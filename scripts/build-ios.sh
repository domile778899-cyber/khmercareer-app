#!/bin/bash
# ============================================================
# KhmerCareer Express - Local iOS Build Script
# ============================================================
# This script builds the iOS archive and exports an IPA file
# for KhmerCareer Express on macOS with Xcode installed.
#
# IMPORTANT: This script CANNOT run on Ubuntu/Linux.
#            iOS builds REQUIRE macOS + Xcode.
#            For CI/CD on non-macOS servers, use the GitHub
#            Actions workflow (.github/workflows/build-ios.yml).
#
# Prerequisites:
#   - macOS 12+ (Monterey or later)
#   - Xcode 15+ with command line tools
#   - Node.js 18+ and npm
#   - Apple Developer account (for signing)
#   - Provisioning profile (for device builds)
#
# Usage:
#   ./scripts/build-ios.sh                  # Build archive
#   ./scripts/build-ios.sh archive          # Build archive only
#   ./scripts/build-ios.sh ipa              # Build and export IPA
#   ./scripts/build-ios.sh simulator        # Build for simulator
#
# Output:
#   - .xcarchive in output/
#   - .ipa file in output/ (if export succeeds)
#
# Environment Variables (optional):
#   APPLE_TEAM_ID           - Apple Developer Team ID
#   BUILD_CERTIFICATE_PATH  - Path to .p12 certificate
#   BUILD_CERTIFICATE_PASS  - Certificate password
#   PROVISIONING_PROFILE    - Path to .mobileprovision file
# ============================================================

set -euo pipefail

# ── Configuration ──────────────────────────────────────────
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"
OUTPUT_DIR="$PROJECT_ROOT/output"
TIMESTAMP=$(date +'%Y%m%d_%H%M%S')
LOG_FILE="$OUTPUT_DIR/build-ios-${TIMESTAMP}.log"

# Build mode: archive (default), ipa, or simulator
BUILD_MODE="${1:-archive}"

# Colors for terminal output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

# ── Logging Functions ──────────────────────────────────────
log_info() {
    echo -e "${BLUE}[INFO]${NC} $1" | tee -a "$LOG_FILE"
}

log_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1" | tee -a "$LOG_FILE"
}

log_warn() {
    echo -e "${YELLOW}[WARN]${NC} $1" | tee -a "$LOG_FILE"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1" | tee -a "$LOG_FILE"
}

log_step() {
    echo -e "${CYAN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}" | tee -a "$LOG_FILE"
    echo -e "${CYAN}  $1${NC}" | tee -a "$LOG_FILE"
    echo -e "${CYAN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}" | tee -a "$LOG_FILE"
}

# ── Error Handler ──────────────────────────────────────────
cleanup_on_error() {
    local exit_code=$?
    if [ $exit_code -ne 0 ]; then
        log_error "Build failed with exit code $exit_code"
        log_error "Check log file: $LOG_FILE"
        echo ""
        echo -e "${RED}╔══════════════════════════════════════════════════════════════╗${NC}"
        echo -e "${RED}║                    BUILD FAILED                              ║${NC}"
        echo -e "${RED}╚══════════════════════════════════════════════════════════════╝${NC}"
    fi
}
trap cleanup_on_error EXIT

# ── macOS Check ─────────────────────────────────────────────
log_step "KhmerCareer Express - iOS Build"
echo ""

if [[ "$OSTYPE" != "darwin"* ]]; then
    echo ""
    log_error "╔══════════════════════════════════════════════════════════════════╗"
    log_error "║  iOS builds REQUIRE macOS + Xcode                             ║"
    log_error "║  This script cannot run on Ubuntu/Linux.                      ║"
    log_error "║                                                                 ║"
    log_error "║  Options:                                                      ║"
    log_error "║  1. Run this on a Mac with Xcode installed                     ║"
    log_error "║  2. Use GitHub Actions with macOS runner (see build-ios.yml)  ║"
    log_error "║  3. Use a cloud Mac service (MacStadium, AWS EC2 Mac)         ║"
    log_error "╚══════════════════════════════════════════════════════════════════╝"
    echo ""
    log_info "For CI/CD builds, use the GitHub Actions workflow instead:"
    log_info "  .github/workflows/build-ios.yml"
    exit 1
fi

log_success "Running on macOS: $(sw_vers -productVersion)"
echo ""

# Create output directory
mkdir -p "$OUTPUT_DIR"

# ── Pre-flight Checks ──────────────────────────────────────
log_step "Step 1: Checking prerequisites"

# Check Xcode
if ! command -v xcodebuild &> /dev/null; then
    log_error "Xcode not found. Install from App Store or:"
    log_error "  xcode-select --install"
    exit 1
fi
XCODE_VERSION=$(xcodebuild -version | head -1)
log_success "Xcode found: $XCODE_VERSION"

# Check Node.js
if ! command -v node &> /dev/null; then
    log_error "Node.js not installed. Install via Homebrew:"
    log_error "  brew install node@20"
    exit 1
fi
NODE_VERSION=$(node -v)
log_success "Node.js found: $NODE_VERSION"

# Check npm
if ! command -v npm &> /dev/null; then
    log_error "npm not found."
    exit 1
fi
log_success "npm found: v$(npm -v)"

# Check for ios-deploy (optional, for device installs)
if command -v ios-deploy &> /dev/null; then
    log_success "ios-deploy found (for device installation)"
else
    log_warn "ios-deploy not found. Install with: npm install -g ios-deploy"
fi

log_success "All prerequisites met!"
echo ""

# ── Step 2: Install Dependencies ───────────────────────────
log_step "Step 2: Installing npm dependencies"
cd "$PROJECT_ROOT"
log_info "Running npm install..."
npm ci --prefer-offline --no-audit 2>&1 | tee -a "$LOG_FILE"
log_success "Dependencies installed"
echo ""

# ── Step 3: Install Capacitor iOS Platform ─────────────────
log_step "Step 3: Installing Capacitor iOS platform"
if [ ! -d "$PROJECT_ROOT/ios/App" ]; then
    log_info "Adding iOS platform..."
    npm install @capacitor/ios --save 2>&1 | tee -a "$LOG_FILE"
    npx cap add ios 2>&1 | tee -a "$LOG_FILE"
    log_success "iOS platform added"
else
    log_info "iOS platform already exists"
fi
echo ""

# ── Step 4: Build Web Assets ───────────────────────────────
log_step "Step 4: Building web assets"
log_info "Running production build..."
npm run build 2>&1 | tee -a "$LOG_FILE"
log_success "Web assets built"
echo ""

# ── Step 5: Sync Capacitor ─────────────────────────────────
log_step "Step 5: Syncing Capacitor with iOS"
npx cap sync ios 2>&1 | tee -a "$LOG_FILE"
log_success "Capacitor sync complete"
echo ""

# ── Step 6: Build iOS Archive ──────────────────────────────
log_step "Step 6: Building iOS archive"

# Navigate to iOS project
cd "$PROJECT_ROOT/ios/App"

# Determine scheme name
SCHEME=$(xcodebuild -list -project App.xcodeproj 2>/dev/null | grep -A1 "Schemes:" | tail -1 | xargs || echo "App")
log_info "Using scheme: $SCHEME"

# Create archive
ARCHIVE_PATH="$OUTPUT_DIR/KhmerCareer-${TIMESTAMP}.xcarchive"

if [ "$BUILD_MODE" == "simulator" ]; then
    log_info "Building for iOS Simulator..."
    DESTINATION="platform=iOS Simulator,name=iPhone 15"
    # Build only, no archive for simulator
    xcodebuild build \
        -project App.xcodeproj \
        -scheme "$SCHEME" \
        -destination "$DESTINATION" \
        -configuration Debug \
        -allowProvisioningUpdates \
        CODE_SIGN_IDENTITY="" \
        CODE_SIGNING_REQUIRED=NO \
        CODE_SIGNING_ALLOWED=NO \
        2>&1 | tee -a "$LOG_FILE"
    log_success "Simulator build complete!"
    echo ""
    echo -e "${GREEN}╔══════════════════════════════════════════════════════════════╗${NC}"
    echo -e "${GREEN}║           SIMULATOR BUILD COMPLETE                           ║${NC}"
    echo -e "${GREEN}╚══════════════════════════════════════════════════════════════╝${NC}"
    exit 0
fi

# Build archive for device/generic
log_info "Building archive..."
xcodebuild archive \
    -project App.xcodeproj \
    -scheme "$SCHEME" \
    -archivePath "$ARCHIVE_PATH" \
    -destination 'generic/platform=iOS' \
    -allowProvisioningUpdates \
    CODE_SIGN_STYLE=Automatic \
    DEVELOPMENT_TEAM="${APPLE_TEAM_ID:-}" \
    2>&1 | tee -a "$LOG_FILE" || {
    log_warn "Archive build may have issues. Trying without signing..."
    xcodebuild archive \
        -project App.xcodeproj \
        -scheme "$SCHEME" \
        -archivePath "$ARCHIVE_PATH" \
        -destination 'generic/platform=iOS' \
        CODE_SIGN_IDENTITY="" \
        CODE_SIGNING_REQUIRED=NO \
        CODE_SIGNING_ALLOWED=NO \
        2>&1 | tee -a "$LOG_FILE"
}

if [ -d "$ARCHIVE_PATH" ]; then
    ARCHIVE_SIZE=$(du -sh "$ARCHIVE_PATH" | cut -f1)
    log_success "Archive built: $ARCHIVE_SIZE"
else
    log_error "Archive build failed. Check log: $LOG_FILE"
    exit 1
fi
echo ""

# ── Step 7: Export IPA ─────────────────────────────────────
if [ "$BUILD_MODE" == "ipa" ] || [ "$BUILD_MODE" == "archive" ]; then
    log_step "Step 7: Exporting IPA"
    
    # Create ExportOptions.plist
    EXPORT_PLIST="$OUTPUT_DIR/ExportOptions-${TIMESTAMP}.plist"
    cat > "$EXPORT_PLIST" << EOF
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
    <key>method</key>
    <string>development</string>
    <key>teamID</key>
    <string>${APPLE_TEAM_ID:-}</string>
    <key>compileBitcode</key>
    <false/>
    <key>uploadBitcode</key>
    <false/>
    <key>uploadSymbols</key>
    <true/>
    <key>signingStyle</key>
    <string>automatic</string>
</dict>
</plist>
EOF
    
    IPA_OUTPUT="$OUTPUT_DIR/IPA-${TIMESTAMP}"
    mkdir -p "$IPA_OUTPUT"
    
    log_info "Exporting IPA..."
    xcodebuild -exportArchive \
        -archivePath "$ARCHIVE_PATH" \
        -exportOptionsPlist "$EXPORT_PLIST" \
        -exportPath "$IPA_OUTPUT" \
        -allowProvisioningUpdates \
        2>&1 | tee -a "$LOG_FILE" || {
        
        log_warn "Standard export failed. Trying manual IPA creation..."
        # Fallback: create IPA from archive manually
        PAYLOAD_DIR="$IPA_OUTPUT/Payload"
        mkdir -p "$PAYLOAD_DIR"
        
        # Extract .app from archive
        cp -R "$ARCHIVE_PATH/Products/Applications/"*.app "$PAYLOAD_DIR/" 2>/dev/null || {
            log_error "No .app bundle found in archive"
            log_info "You may need to build with a valid signing certificate."
            log_info "For testing on simulator, use: ./scripts/build-ios.sh simulator"
            exit 1
        }
        
        # Package into IPA
        cd "$IPA_OUTPUT"
        zip -r "KhmerCareer-${TIMESTAMP}.ipa" Payload 2>&1 | tee -a "$LOG_FILE"
        cd "$PROJECT_ROOT"
    }
    
    # Find and copy IPA
    IPA_FILE=$(find "$IPA_OUTPUT" -name "*.ipa" | head -1)
    if [ -n "$IPA_FILE" ]; then
        IPA_NAME="KhmerCareer-iOS-${TIMESTAMP}.ipa"
        cp "$IPA_FILE" "$OUTPUT_DIR/$IPA_NAME"
        IPA_SIZE=$(du -h "$OUTPUT_DIR/$IPA_NAME" | cut -f1)
        log_success "IPA exported: $IPA_NAME ($IPA_SIZE)"
    else
        log_warn "IPA file not found in output directory"
    fi
    
    # Cleanup temp files
    rm -f "$EXPORT_PLIST"
fi

# ── Build Summary ──────────────────────────────────────────
log_step "Build Summary"
echo ""
echo -e "${GREEN}╔══════════════════════════════════════════════════════════════╗${NC}"
echo -e "${GREEN}║                  iOS BUILD COMPLETE                          ║${NC}"
echo -e "${GREEN}╠══════════════════════════════════════════════════════════════╣${NC}"
echo -e "${GREEN}║  Build Mode:  ${CYAN}$(echo "$BUILD_MODE" | tr '[:lower:]' '[:upper:]')${GREEN}                                   ║${NC}"
echo -e "${GREEN}║  Archive:     ${CYAN}KhmerCareer-${TIMESTAMP}.xcarchive${GREEN}    ║${NC}"
if [ -f "$OUTPUT_DIR/$IPA_NAME" ]; then
    echo -e "${GREEN}║  IPA File:    ${CYAN}$IPA_NAME${GREEN}        ║${NC}"
    echo -e "${GREEN}║  IPA Size:    ${CYAN}$IPA_SIZE${GREEN}                                    ║${NC}"
fi
echo -e "${GREEN}║  Location:    ${CYAN}output/${GREEN}                                    ║${NC}"
echo -e "${GREEN}║  Log File:    ${CYAN}build-ios-${TIMESTAMP}.log${GREEN}            ║${NC}"
echo -e "${GREEN}╚══════════════════════════════════════════════════════════════╝${NC}"
echo ""
log_info "Build completed at $(date '+%Y-%m-%d %H:%M:%S')"
log_info "Xcode: $XCODE_VERSION"
log_info "macOS: $(sw_vers -productVersion)"

# List all output files
echo ""
log_info "All output files:"
ls -lh "$OUTPUT_DIR"/*.{xcarchive,ipa} 2>/dev/null | while read -r line; do
    echo "  $line"
done || true
