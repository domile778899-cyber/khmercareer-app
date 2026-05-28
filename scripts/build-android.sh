#!/bin/bash
# ============================================================
# KhmerCareer Express - Local Android Build Script
# ============================================================
# This script builds the Android APK for KhmerCareer Express
# on a local development machine or Ubuntu server.
#
# Prerequisites:
#   - Node.js 18+ and npm installed
#   - Android SDK installed (ANDROID_HOME set)
#   - Java 17 installed (JAVA_HOME set)
#   - Android device or emulator connected (for install)
#
# Usage:
#   ./scripts/build-android.sh              # Build debug APK
#   ./scripts/build-android.sh release      # Build release APK
#   ./scripts/build-android.sh debug install # Build and install
#
# Output:
#   - APK files in output/ directory
#   - Build logs for debugging
#
# NOTE: This script is designed for Ubuntu/Linux.
# For macOS, install Android SDK via Android Studio.
# ============================================================

set -euo pipefail

# ── Configuration ──────────────────────────────────────────
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"
OUTPUT_DIR="$PROJECT_ROOT/output"
TIMESTAMP=$(date +'%Y%m%d_%H%M%S')
LOG_FILE="$OUTPUT_DIR/build-android-${TIMESTAMP}.log"

# Build type: debug (default) or release
BUILD_TYPE="${1:-debug}"
# Install flag: "install" to install on device after build
INSTALL_FLAG="${2:-}"

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

# ── Pre-flight Checks ──────────────────────────────────────
log_step "KhmerCareer Express - Android Build"
echo ""

# Create output directory
mkdir -p "$OUTPUT_DIR"

log_info "Build type: $BUILD_TYPE"
log_info "Timestamp: $TIMESTAMP"
log_info "Project root: $PROJECT_ROOT"
log_info "Output directory: $OUTPUT_DIR"
echo ""

# Check Node.js
log_step "Step 1: Checking prerequisites"
if ! command -v node &> /dev/null; then
    log_error "Node.js is not installed. Install it first:"
    log_error "  curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -"
    log_error "  sudo apt-get install -y nodejs"
    exit 1
fi
NODE_VERSION=$(node -v)
log_success "Node.js found: $NODE_VERSION"

# Check npm
if ! command -v npm &> /dev/null; then
    log_error "npm is not installed."
    exit 1
fi
NPM_VERSION=$(npm -v)
log_success "npm found: v$NPM_VERSION"

# Check Android SDK
if [ -z "${ANDROID_HOME:-}" ]; then
    log_warn "ANDROID_HOME not set. Trying to find Android SDK..."
    # Common Android SDK locations on Ubuntu
    for path in \
        "$HOME/Android/Sdk" \
        "/usr/lib/android-sdk" \
        "/opt/android-sdk" \
        "/opt/android/sdk"
    do
        if [ -d "$path" ]; then
            export ANDROID_HOME="$path"
            log_success "Found Android SDK at: $ANDROID_HOME"
            break
        fi
    done
    if [ -z "${ANDROID_HOME:-}" ]; then
        log_error "Android SDK not found. Install it:"
        log_error "  sudo apt-get install android-sdk"
        log_error "Or download from https://developer.android.com/studio#downloads"
        exit 1
    fi
else
    log_success "Android SDK found at: $ANDROID_HOME"
fi

# Add Android SDK tools to PATH
export PATH="$ANDROID_HOME/cmdline-tools/latest/bin:$ANDROID_HOME/platform-tools:$ANDROID_HOME/tools:$PATH"

# Check Java
if [ -z "${JAVA_HOME:-}" ]; then
    log_warn "JAVA_HOME not set. Trying to find Java 17..."
    if command -v java &> /dev/null; then
        JAVA_VERSION=$(java -version 2>&1 | head -1 | cut -d'"' -f2)
        log_info "Found Java: $JAVA_VERSION"
    else
        log_error "Java is not installed. Install OpenJDK 17:"
        log_error "  sudo apt-get install openjdk-17-jdk"
        exit 1
    fi
else
    log_success "Java found at: $JAVA_HOME"
fi

# Check that gradlew exists
if [ ! -f "$PROJECT_ROOT/android/gradlew" ]; then
    log_error "Gradle wrapper not found at $PROJECT_ROOT/android/gradlew"
    log_error "Run 'npx cap sync android' first to generate Android project files."
    exit 1
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

# ── Step 3: Install Capacitor Android Platform ─────────────
log_step "Step 3: Installing Capacitor Android platform"
if [ ! -d "$PROJECT_ROOT/android" ] || [ ! -d "$PROJECT_ROOT/android/app/src" ]; then
    log_info "Adding Android platform..."
    npm install @capacitor/android --save 2>&1 | tee -a "$LOG_FILE"
    npx cap add android 2>&1 | tee -a "$LOG_FILE"
    log_success "Android platform added"
else
    log_info "Android platform already exists, syncing..."
fi
log_success "Android platform ready"
echo ""

# ── Step 4: Build Web Assets ───────────────────────────────
log_step "Step 4: Building web assets"
log_info "Running production build..."
npm run build 2>&1 | tee -a "$LOG_FILE"
log_success "Web assets built"
echo ""

# ── Step 5: Sync Capacitor ─────────────────────────────────
log_step "Step 5: Syncing Capacitor with Android"
npx cap sync android 2>&1 | tee -a "$LOG_FILE"
log_success "Capacitor sync complete"
echo ""

# ── Step 6: Build APK ──────────────────────────────────────
log_step "Step 6: Building APK ($BUILD_TYPE)"

# Make gradlew executable
chmod +x "$PROJECT_ROOT/android/gradlew"

cd "$PROJECT_ROOT/android"

if [ "$BUILD_TYPE" == "release" ]; then
    log_info "Building release APK..."
    ./gradlew assembleRelease --no-daemon --stacktrace 2>&1 | tee -a "$LOG_FILE"
    
    # Check if signed APK exists, otherwise use unsigned
    if [ -f "app/build/outputs/apk/release/app-release.apk" ]; then
        APK_SOURCE="app/build/outputs/apk/release/app-release.apk"
        APK_NAME="KhmerCareer-Release-${TIMESTAMP}.apk"
        log_success "Signed release APK built!"
    elif [ -f "app/build/outputs/apk/release/app-release-unsigned.apk" ]; then
        APK_SOURCE="app/build/outputs/apk/release/app-release-unsigned.apk"
        APK_NAME="KhmerCareer-Release-Unsigned-${TIMESTAMP}.apk"
        log_warn "Unsigned release APK built (no signing credentials)"
    else
        log_error "Release APK not found"
        exit 1
    fi
else
    log_info "Building debug APK..."
    ./gradlew assembleDebug --no-daemon --stacktrace 2>&1 | tee -a "$LOG_FILE"
    
    if [ -f "app/build/outputs/apk/debug/app-debug.apk" ]; then
        APK_SOURCE="app/build/outputs/apk/debug/app-debug.apk"
        APK_NAME="KhmerCareer-Debug-${TIMESTAMP}.apk"
        log_success "Debug APK built!"
    else
        log_error "Debug APK not found"
        exit 1
    fi
fi

# Copy APK to output directory
cp "$APK_SOURCE" "$OUTPUT_DIR/$APK_NAME"
APK_SIZE=$(du -h "$OUTPUT_DIR/$APK_NAME" | cut -f1)
log_success "APK copied to: output/$APK_NAME ($APK_SIZE)"
echo ""

# ── Step 7: Install on device (optional) ───────────────────
if [ "$INSTALL_FLAG" == "install" ]; then
    log_step "Step 7: Installing APK on connected device"
    if command -v adb &> /dev/null; then
        DEVICES=$(adb devices | grep -c "device$")
        if [ "$DEVICES" -gt 0 ]; then
            log_info "Found $DEVICES connected device(s)"
            adb install -r "$OUTPUT_DIR/$APK_NAME" 2>&1 | tee -a "$LOG_FILE"
            log_success "APK installed successfully!"
        else
            log_warn "No Android device connected. Skipping install."
            log_info "Connect a device or start an emulator, then run:"
            log_info "  adb install -r output/$APK_NAME"
        fi
    else
        log_warn "adb not found in PATH. Skipping install."
    fi
    echo ""
fi

# ── Build Summary ──────────────────────────────────────────
log_step "Build Summary"
echo ""
echo -e "${GREEN}╔══════════════════════════════════════════════════════════════╗${NC}"
echo -e "${GREEN}║               ANDROID BUILD COMPLETE                         ║${NC}"
echo -e "${GREEN}╠══════════════════════════════════════════════════════════════╣${NC}"
echo -e "${GREEN}║  Build Type:  ${CYAN}$(echo "$BUILD_TYPE" | tr '[:lower:]' '[:upper:]')${GREEN}                                     ║${NC}"
echo -e "${GREEN}║  APK File:    ${CYAN}$APK_NAME${GREEN}          ║${NC}"
echo -e "${GREEN}║  APK Size:    ${CYAN}$APK_SIZE${GREEN}                                      ║${NC}"
echo -e "${GREEN}║  Location:    ${CYAN}output/$APK_NAME${GREEN}              ║${NC}"
echo -e "${GREEN}║  Log File:    ${CYAN}output/build-android-${TIMESTAMP}.log${GREEN}  ║${NC}"
echo -e "${GREEN}╚══════════════════════════════════════════════════════════════╝${NC}"
echo ""
log_info "Build completed at $(date '+%Y-%m-%d %H:%M:%S')"

# List all APKs in output directory
echo ""
log_info "All APK files in output/:"
ls -lh "$OUTPUT_DIR"/*.apk 2>/dev/null | while read -r line; do
    echo "  $line"
done
