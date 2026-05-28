# KhmerCareer Frontend Deployment Guide

Complete deployment guide for the KhmerCareer React frontend application.

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Environment Setup](#environment-setup)
3. [Build Process](#build-process)
4. [Docker Deployment](#docker-deployment)
5. [Nginx Deployment](#nginx-deployment)
6. [CDN Deployment](#cdn-deployment)
7. [Vercel Deployment](#vercel-deployment)
8. [Netlify Deployment](#netlify-deployment)
9. [Mobile App Build](#mobile-app-build)
10. [Environment Variables](#environment-variables)
11. [Performance Checklist](#performance-checklist)
12. [Monitoring](#monitoring)

---

## Prerequisites

### System Requirements

| Resource | Minimum | Recommended |
|----------|---------|-------------|
| Node.js | 20.x LTS | 22.x LTS |
| npm | 10.x | 10.x |
| RAM | 2 GB | 4 GB |
| Disk | 1 GB | 5 GB |

### Install Dependencies

```bash
# Install Node.js dependencies
npm install

# Or use pnpm for faster installs
pnpm install
```

---

## Environment Setup

### Environment Files

```bash
# Development
cp .env.example .env.development

# Production
cp .env.example .env.production
```

### Environment Variables

| Variable | Required | Description | Example |
|----------|----------|-------------|---------|
| `VITE_API_URL` | Yes | Backend API base URL | `https://api.khmercareer.com/api/v1` |
| `VITE_APP_NAME` | No | Application name | `KhmerCareer` |
| `VITE_APP_VERSION` | No | Application version | `1.0.0` |
| `VITE_SOCKET_URL` | No | Socket.IO server URL | `wss://api.khmercareer.com` |
| `VITE_STRIPE_KEY` | No | Stripe publishable key | `pk_live_...` |
| `VITE_GOOGLE_CLIENT_ID` | No | Google OAuth client ID | `...apps.googleusercontent.com` |
| `VITE_FACEBOOK_APP_ID` | No | Facebook app ID | `...` |
| `VITE_SENTRY_DSN` | No | Sentry error tracking DSN | `https://...` |

---

## Build Process

### Development Build

```bash
# Start development server (http://localhost:5173)
npm run dev

# With specific port
npm run dev -- --port 3000
```

### Production Build

```bash
# Create optimized production build
npm run build

# Output directory: dist/
# Contains: index.html, assets/, static files
```

### Build Output Structure

```
dist/
├── index.html              # Entry HTML file
├── assets/
│   ├── index-[hash].js     # Main JS bundle
│   ├── index-[hash].css    # Main CSS bundle
│   ├── vendor-[hash].js    # Vendor chunks
│   └── ...
├── locales/                # i18n translation files
└── favicon.ico             # Site favicon
```

### Build Verification

```bash
# Preview production build locally
npm run preview

# Preview with specific port
npm run preview -- --port 4173
```

---

## Docker Deployment

### Dockerfile

```dockerfile
# Build stage
FROM node:22-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# Production stage
FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

### Build and Run

```bash
# Build Docker image
docker build -t khmercareer/frontend:latest .

# Run container
docker run -d \
  --name khmercareer-frontend \
  -p 80:80 \
  khmercareer/frontend:latest

# Or with docker-compose
docker-compose up -d
```

### docker-compose.yml

```yaml
version: '3.8'

services:
  frontend:
    build: .
    container_name: khmercareer-frontend
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./ssl:/etc/nginx/ssl:ro
    environment:
      - NGINX_ENVSUBST_OUTPUT_DIR=/etc/nginx
    restart: unless-stopped

  # Optional: Add Cloudflare tunnel for HTTPS
  cloudflare:
    image: cloudflare/cloudflared:latest
    command: tunnel --no-autoupdate run
    environment:
      - TUNNEL_TOKEN=your-tunnel-token
    restart: unless-stopped
```

---

## Nginx Deployment

### Nginx Configuration

```nginx
server {
    listen 80;
    server_name khmercareer.com www.khmercareer.com;
    
    # Redirect HTTP to HTTPS
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name khmercareer.com www.khmercareer.com;

    # SSL certificates
    ssl_certificate /etc/letsencrypt/live/khmercareer.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/khmercareer.com/privkey.pem;
    
    # SSL settings
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers 'ECDHE-ECDSA-AES128-GCM-SHA256:ECDHE-RSA-AES128-GCM-SHA256';
    ssl_prefer_server_ciphers off;
    ssl_session_cache shared:SSL:50m;
    ssl_session_timeout 1d;

    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header Referrer-Policy "strict-origin-when-cross-origin" always;

    # Gzip compression
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_types
        text/plain
        text/css
        text/xml
        text/javascript
        application/json
        application/javascript
        application/xml+rss
        application/atom+xml
        image/svg+xml;

    # Root directory
    root /var/www/khmercareer-frontend/dist;
    index index.html;

    # Cache static assets
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
        expires 6M;
        add_header Cache-Control "public, immutable";
        access_log off;
    }

    # Cache HTML for short time
    location ~* \.html$ {
        expires 1h;
        add_header Cache-Control "public, must-revalidate";
    }

    # API proxy (if same domain)
    location /api/ {
        proxy_pass http://localhost:3001;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        
        # WebSocket support
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
    }

    # SPA fallback - serve index.html for all routes
    location / {
        try_files $uri $uri/ /index.html;
    }

    # Error pages
    error_page 404 /index.html;
    error_page 500 502 503 504 /50x.html;
    location = /50x.html {
        root /var/www/khmercareer-frontend/dist;
    }
}
```

### Deployment Steps

```bash
# 1. Build the application
npm run build

# 2. Copy to server
rsync -avz --delete dist/ user@server:/var/www/khmercareer-frontend/dist/

# 3. Reload Nginx
ssh user@server "sudo nginx -t && sudo systemctl reload nginx"
```

---

## CDN Deployment

### Cloudflare Pages

```bash
# Install Wrangler
npm install -g wrangler

# Login to Cloudflare
wrangler login

# Deploy
wrangler pages deploy dist --project-name=khmercareer
```

### AWS S3 + CloudFront

```bash
# Sync to S3
aws s3 sync dist/ s3://khmercareer-frontend --delete

# Invalidate CloudFront cache
aws cloudfront create-invalidation \
    --distribution-id YOUR_DISTRIBUTION_ID \
    --paths "/*"
```

---

## Vercel Deployment

### Using Vercel CLI

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel --prod

# Or with environment variables
vercel --prod -e VITE_API_URL=https://api.khmercareer.com/api/v1
```

### Using Git Integration

1. Connect GitHub repository to Vercel
2. Set environment variables in Vercel dashboard
3. Deploy on every push to `main`

### vercel.json

```json
{
  "rewrites": [
    { "source": "/(.*)", "destination": "/index.html" }
  ],
  "headers": [
    {
      "source": "/assets/(.*)",
      "headers": [
        { "key": "Cache-Control", "value": "public, max-age=31536000, immutable" }
      ]
    }
  ]
}
```

---

## Netlify Deployment

### Using Netlify CLI

```bash
# Install Netlify CLI
npm install -g netlify-cli

# Deploy
netlify deploy --prod --dir=dist
```

### netlify.toml

```toml
[build]
  command = "npm run build"
  publish = "dist"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200

[[headers]]
  for = "/assets/*"
  [headers.values]
    Cache-Control = "public, max-age=31536000, immutable"
```

---

## Mobile App Build

### Prerequisites

```bash
# Install Capacitor CLI
npm install @capacitor/cli @capacitor/core

# Add platforms
npm install @capacitor/ios @capacitor/android

# Sync native project
npx cap sync
```

### Android Build

```bash
# Build web assets
npm run build

# Sync to Android project
npx cap sync android

# Open in Android Studio
npx cap open android

# Or build APK directly
cd android
./gradlew assembleRelease
```

**Release APK Location:**
```
android/app/build/outputs/apk/release/app-release.apk
```

### iOS Build

```bash
# Build web assets
npm run build

# Sync to iOS project
npx cap sync ios

# Open in Xcode
npx cap open ios

# Build using xcodebuild
cd ios
xcodebuild -workspace App.xcworkspace -scheme App -configuration Release
```

### Environment-Specific Builds

```bash
# Development
npm run build

# Staging
VITE_API_URL=https://staging-api.khmercareer.com/api/v1 npm run build

# Production
VITE_API_URL=https://api.khmercareer.com/api/v1 npm run build
```

### App Store Submission Checklist

- [ ] App icon (all required sizes)
- [ ] Splash screen
- [ ] App name and description
- [ ] Screenshots for all device sizes
- [ ] Privacy policy URL
- [ ] Terms of service URL
- [ ] Contact information
- [ ] Category selection
- [ ] Age rating
- [ ] Pricing (free/paid)

---

## Environment Variables

### Build-Time Variables (VITE_*)

All environment variables used in the frontend must be prefixed with `VITE_`:

```env
# .env.development
VITE_API_URL=http://localhost:3001/api/v1
VITE_SOCKET_URL=ws://localhost:3001
VITE_APP_NAME=KhmerCareer Dev

# .env.production
VITE_API_URL=https://api.khmercareer.com/api/v1
VITE_SOCKET_URL=wss://api.khmercareer.com
VITE_APP_NAME=KhmerCareer
```

### Access in Code

```typescript
const apiUrl = import.meta.env.VITE_API_URL;
const appName = import.meta.env.VITE_APP_NAME;
```

---

## Performance Checklist

Before deploying to production:

### Build Optimization

- [ ] Code splitting enabled (lazy loading routes)
- [ ] Tree shaking working (no dead code)
- [ ] Bundle size under 500KB initial
- [ ] Vendor chunks separated
- [ ] CSS extracted and minified

### Asset Optimization

- [ ] Images compressed and optimized
- [ ] WebP format used where possible
- [ ] Fonts subset for needed characters
- [ ] SVG icons used where possible

### Runtime Performance

- [ ] Service worker registered (PWA)
- [ ] Critical CSS inlined
- [ ] Font display: swap used
- [ ] Lazy loading for images
- [ ] Debounce on search inputs

### SEO & Accessibility

- [ ] Meta tags for each page
- [ ] Open Graph tags
- [ ] robots.txt configured
- [ ] sitemap.xml generated
- [ ] Alt text on all images
- [ ] ARIA labels on interactive elements

### Security

- [ ] HTTPS enabled
- [ ] Security headers configured
- [ ] Content Security Policy set
- [ ] No sensitive data in client bundle
- [ ] API keys not exposed in source

---

## Monitoring

### Error Tracking (Sentry)

```typescript
// main.ts
import * as Sentry from '@sentry/react';

Sentry.init({
  dsn: import.meta.env.VITE_SENTRY_DSN,
  environment: import.meta.env.VITE_APP_ENV,
  tracesSampleRate: 0.1,
});
```

### Analytics

```typescript
// Track page views
useEffect(() => {
  gtag('config', 'GA_MEASUREMENT_ID', {
    page_path: location.pathname,
  });
}, [location]);
```

### Health Check

```bash
# Frontend health endpoint (if using SSR)
curl https://khmercareer.com/health

# Expected response:
# { "status": "ok", "version": "1.0.0" }
```
