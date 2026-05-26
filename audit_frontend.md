# KhmerCareer Express - Comprehensive Frontend Audit Report

**Audit Date:** 2025-06-17
**Auditor:** Senior Frontend QA Engineer
**Scope:** Full codebase review of `/mnt/agents/output/khmercareer-app/src/`

---

## Table of Contents

1. [API Integration Quality](#1-api-integration-quality)
2. [AuthContext Quality](#2-authcontext-quality)
3. [Pages Using APIs](#3-pages-using-apis)
4. [Missing Integrations](#4-missing-integrations)
5. [Routing Issues](#5-routing-issues)
6. [i18n Issues](#6-i18n-issues)
7. [Build & Code Quality Issues](#7-build--code-quality-issues)
8. [Summary & Priority Action Plan](#8-summary--priority-action-plan)

---

## 1. API Integration Quality

### 1.1 `src/api/client.ts` - HTTP Client

| Severity | Issue | Description | Fix |
|----------|-------|-------------|-----|
| **Medium** | Race condition in token refresh | `isRefreshing` flag is not reset if `doRefreshToken()` throws an exception unexpectedly (line 196-226 has catch, but `finally` block missing for `isRefreshing = false`) | Add `finally { isRefreshing = false; }` to ensure flag is always reset |
| **Medium** | Token refresh uses raw axios, not apiClient | `doRefreshToken()` creates a new axios instance (line 156) which won't have request interceptors | Use `apiClient` for the refresh call to ensure consistent headers |
| **Low** | Double `message` extraction in error parser | Lines 258-261 attempt to extract `message` twice with overlapping conditions | Consolidate into single logic path |
| **Low** | `isLocalMode()` always returns `false` | Line 349 checks `!apiClient.defaults.baseURL` but baseURL is always set to at least `/api/v1` on line 110 | Remove dead code or fix logic |
| **Low** | Default timeout 30s may be too long for mobile | Slow networks on mobile devices in Cambodia could lead to poor UX | Reduce to 15s for non-critical requests |

**Positive findings:**
- Proper JWT token attachment via request interceptor
- Token refresh queue (subscriber pattern) correctly implemented
- `CustomEvent('auth:session_expired')` dispatched on 401
- Network error handling with KhmerCareerAPIError class
- HTTP helper functions (get/post/put/patch/del) properly unwrap ApiResponse wrapper

### 1.2 `src/api/authApi.ts` - Auth API

| Severity | Issue | Description | Fix |
|----------|-------|-------------|-----|
| **High** | **Plaintext password stored in localStorage** | Line 141: `password: data.password` - passwords stored in plaintext in `STORAGE_USERS_KEY` | NEVER store passwords in localStorage; use secure cookie-based auth only |
| **High** | **Mock tokens are insecure** | `generateMockToken()` (line 64-65) creates predictable tokens | Use proper JWT format even for mock tokens, or reject mock mode in production |
| **High** | Fallback mode silently activates | On ANY API error during register/login, it falls back to localStorage mode without clear user notification | Show a clear warning banner when in fallback mode |
| **Medium** | `logout()` calls API asynchronously without await | Line 204: `post('/auth/logout').catch(() => {})` - fire-and-forget | Add timeout and proper error handling |
| **Medium** | `getMe()` returns stale user on API failure | Lines 232-237: Falls back to localStorage user which may be outdated | Add timestamp check for cached user data |
| **Low** | Google fallback creates duplicate user IDs | Line 357: Uses `googleData.id` directly as user ID, which may conflict | Prefix with `google_` to avoid collisions |

### 1.3 `src/api/jobsApi.ts` - Jobs API

| Severity | Issue | Description | Fix |
|----------|-------|-------------|-----|
| **Medium** | `getFeaturedJobs()` assumes response shape | Line 139: `get<{ jobs: Job[] }>` - assumes wrapped response but fallback doesn't match | Ensure API and fallback return consistent shapes |
| **Medium** | Legacy API methods (`getAll`, `getById`, etc.) expose localStorage bypass | Lines 242-280: Direct localStorage access methods bypass HTTP API entirely | Mark deprecated and add console.warn |
| **Low** | `getCurrentUserId()` returns string `'anonymous_user'` | Line 61: Return type says `string \| null` but always returns a string | Fix return type to be accurate |

### 1.4 `src/api/coursesApi.ts` - Courses API

| Severity | Issue | Description | Fix |
|----------|-------|-------------|-----|
| **Medium** | `getUserEnrollments()` has no API attempt | Lines 166-176: Only reads from localStorage, never calls backend | Add API attempt with localStorage fallback |
| **Medium** | `updateProgress()` has no API attempt | Lines 184-192: Only writes to localStorage | Add API call to sync progress |
| **Medium** | `isEnrolled()` is synchronous | Line 179: Returns boolean synchronously but should check server state | Make async and query API first |

### 1.5 `src/api/favoritesApi.ts` - Favorites API

| Severity | Issue | Description | Fix |
|----------|-------|-------------|-----|
| **Critical** | Uses `require()` in ES module | Line 49: `require('./db')` will break in ESM builds | Change to dynamic `import()` or remove circular dependency |
| **High** | `toggleFavorite()` reads all favorites | Line 143: `this.getFavorites()` pulls entire list to check one item | Use lightweight `isFavorited()` or add dedicated endpoint |
| **Low** | Fallback creates fake Job objects | Lines 79-103: Creates placeholder jobs with empty fields | Return minimal valid objects instead of full fake Job |

### 1.6 `src/api/chatApi.ts` - Chat API

| Severity | Issue | Description | Fix |
|----------|-------|-------------|-----|
| **Medium** | `markAsRead()` doesn't update API on failure | Lines 235-254: No API call attempt at all - only localStorage | Add API attempt with fallback |
| **Low** | Auto-seeding in `getRooms()` creates race condition | Lines 157: `seedDefaultRooms()` called inside catch block | Move seeding to initialization phase |

### 1.7 `src/api/types.ts` - TypeScript Interfaces

| Severity | Issue | Description | Fix |
|----------|-------|-------------|-----|
| **Low** | `UserRole` type duplicated in AuthContext | Line 12 of AuthContext.tsx redefines `UserRole` | Import from types.ts instead of redefining |
| **Low** | `Job.updatedAt` is optional but most APIs assume it exists | Line 108: `updatedAt?: string` | Make required for consistency |

### 1.8 `src/api/index.ts` - Exports

| Severity | Issue | Description | Fix |
|----------|-------|-------------|-----|
| **Low** | Exports `Job` and `Course` types from both `db.ts` and `types.ts` | Line 48: `export type { DBCollection, Job, Course } from './db'` may conflict with types.ts versions | Remove duplicate exports or alias them |
| **Low** | `defaultClient` alias is confusing | Line 9: `default as defaultClient` | Rename to just `apiClient` for clarity |

---

## 2. AuthContext Quality

### `src/context/AuthContext.tsx`

| Severity | Issue | Description | Fix |
|----------|-------|-------------|-----|
| **High** | Session expiry event uses `as never` cast | Line 138: `window.addEventListener('auth:session_expired' as never, ...)` | Define a proper custom event type or use string event with correct typing |
| **Medium** | `initRef` pattern is fragile | Lines 64, 68-69: Uses ref to prevent double init in StrictMode | Use a proper state machine or useEffect cleanup |
| **Medium** | `updateUserProfile` silently succeeds on API failure | Lines 249-256: Catches error and does optimistic update without informing user | Show a warning toast that changes are local only |
| **Medium** | Loading state stays true if API hangs | No timeout on `authApi.getMe()` call in init | Add a timeout wrapper (e.g., 5s max) |
| **Low** | `login()` and `register()` return `boolean` instead of proper result | No way to get the actual error message to display | Return `{ success: boolean; error?: string }` instead |
| **Low** | No re-auth on 403 responses | Only handles 401, not 403 forbidden | Add 403 handler that redirects to login |

**Positive findings:**
- Proper `initRef` guard against StrictMode double-execution
- User persistence to localStorage works
- Session expiry listener correctly clears state
- Fallback mode detection works correctly
- `useCallback` used properly for all action functions

---

## 3. Pages Using APIs

### 3.1 `src/pages/Login.tsx`

| Severity | Issue | Description | Fix |
|----------|-------|-------------|-----|
| **Medium** | Demo login hardcodes credentials | Lines 182-202: `demo@khmerjob.com` / `demo123` hardcoded | Move to environment variables or config |
| **Medium** | Google Sign-In bypasses AuthContext | Lines 384-402: Directly sets localStorage and navigates without calling `loginWithGoogle` | Use `loginWithGoogle` from context and remove manual localStorage manipulation |
| **Low** | Email regex is basic | Line 28: `/^[^\s@]+@[^\s@]+\.[^\s@]+$/` | Consider using a more robust validation library |
| **Low** | Password saved in form state is plaintext | While not persisted, password exists in React state | Use controlled inputs with password type only |

### 3.2 `src/pages/Register.tsx`

| Severity | Issue | Description | Fix |
|----------|-------|-------------|-----|
| **High** | **Form data saved to localStorage** | Lines 68-74: Entire form including password saved to `khmer_register_form` | Remove password from saved form data |
| **Medium** | Terms agreement text is hardcoded English | Lines 692-706: "I agree to the" and links are hardcoded | Move to i18n translation keys |
| **Medium** | Back button text is hardcoded | Line 728: `"Back"` should be translated | Use `t('common.back')` |
| **Low** | Benefits array title/desc use same translation key | Lines 275-280: Both `title` and `desc` use the same translation key | Use separate keys for title and description |

---

## 4. Missing Integrations

### Pages Still Using localStorage Instead of API

| Page | localStorage Key(s) | What It Does | API Status |
|------|---------------------|--------------|------------|
| `src/pages/Jobs.tsx` | `khmercareer-saved-jobs` | Saves favorited job IDs | Uses **localStorage only**, should use `favoritesApi` |
| `src/pages/JobDetail.tsx` | `khmerhr-saved-jobs` | Saves favorited job IDs (different key!) | Uses **localStorage only**, should use `favoritesApi` |
| `src/pages/VideoResume.tsx` | `videoResumes`, `videoResumePrivacyTip` | Stores video resume records | **No API at all** - completely localStorage |
| `src/pages/VideoResumeRecord.tsx` | `videoResumes` | Appends new video records | **No API at all** - writes directly to localStorage |
| `src/pages/Profile.tsx` | (via AuthContext) | User profile data | Partial API via `updateUserProfile` |

### Contexts Using localStorage Instead of API

| Context | localStorage Key(s) | Issue | Priority |
|---------|---------------------|-------|----------|
| `src/context/FavoritesContext.tsx` | `khmercareer_favorites` | **Never calls `favoritesApi` at all** - completely isolated from backend | **Critical** |
| `src/context/ChatContext.tsx` | `khmercareer_conversations`, `khmercareer_messages` | Never calls `chatApi` - all chat is localStorage only | **Critical** |
| `src/context/AuthContext.tsx` | `khmer_auth_user`, `khmer_access_token` | Uses API but falls back to localStorage | Expected behavior |

### API Endpoints Defined But Never Used

| API Module | Endpoint | Defined In | Actually Used By |
|------------|----------|------------|------------------|
| `favoritesApi.getFavorites()` | `GET /favorites` | `src/api/favoritesApi.ts` | **NOTHING** - FavoritesContext bypasses it |
| `favoritesApi.addFavorite()` | `POST /favorites` | `src/api/favoritesApi.ts` | **NOTHING** |
| `favoritesApi.removeFavorite()` | `DELETE /favorites/:id` | `src/api/favoritesApi.ts` | **NOTHING** |
| `chatApi.getRooms()` | `GET /chat/rooms` | `src/api/chatApi.ts` | **NOTHING** - ChatContext bypasses it |
| `chatApi.getMessages()` | `GET /chat/rooms/:id/messages` | `src/api/chatApi.ts` | **NOTHING** |
| `chatApi.sendMessage()` | `POST /chat/rooms/:id/messages` | `src/api/chatApi.ts` | **NOTHING** |
| `chatApi.markAsRead()` | `POST /chat/rooms/:id/read` | `src/api/chatApi.ts` | **NOTHING** |

---

## 5. Routing Issues

### `src/App.tsx`

| Severity | Issue | Description | Fix |
|----------|-------|-------------|-----|
| **Medium** | `Home` component is NOT lazy-loaded | Line 9: `import Home from './pages/Home'` is synchronous | Move to lazy import for consistency |
| **Medium** | No route guards for protected routes | Admin routes, `/profile`, `/teacher-dashboard` have no auth guards | Add `ProtectedRoute` wrapper component |
| **Low** | Admin routes use separate layout but no auth check | Lines 121-126: `/admin/*` routes render without verifying admin role | Add role-based route guard |
| **Low** | SuperAdmin routes also unprotected | Lines 127-134: `/superadmin/*` routes have no role verification | Add `superadmin` role check |
| **Low** | Missing `/forgot-password` route | Login page links to `/forgot-password` but no route defined | Add the route or remove the link |
| **Low** | Duplicate `courses/:id` and `courses/:id/detail` routes | Lines 100-101: May conflict - `:id` will match before `:id/detail` | Reorder routes or use different path pattern |

**Positive findings:**
- All major pages use `React.lazy()` for code splitting
- `SuspenseWrapper` provides consistent loading fallback
- Route structure is well-organized with admin/superadmin separation
- `Layout` wrapper applied correctly to public routes

---

## 6. i18n Issues

### `src/i18n.ts`

| Severity | Issue | Description | Fix |
|----------|-------|-------------|-----|
| **Critical** | `// @ts-nocheck` disables ALL TypeScript checking | Line 1: Suppresses type checking on 3600+ lines | Remove and fix all type errors |
| **High** | Thai (`th`) translations missing 4 major namespaces | `chineseEnterprise`, `factoryJobs`, `recruitmentServices`, `skillMatch` | Add complete Thai translations |
| **High** | Vietnamese (`vi`) translations missing 4 major namespaces | `chineseEnterprise`, `factoryJobs`, `recruitmentServices`, `skillMatch` | Add complete Vietnamese translations |
| **Medium** | Thai auth namespace missing 7 keys | `companyName`, `industry`, `phone`, `registerSuccess`, `rememberMe`, `role_employer`, `role_jobseeker` | Add missing keys |
| **Medium** | Vietnamese auth namespace missing 7 keys | Same as Thai | Add missing keys |
| **Medium** | Thai jobs namespace missing `apply` key | `jobs.apply` not defined | Add translation |
| **Medium** | Vietnamese jobs namespace missing `apply` key | `jobs.apply` not defined | Add translation |
| **Low** | Mixed language fallback not robust | `fallbackLng: 'en'` - no regional fallbacks | Consider `fallbackLng: { 'zh-CN': ['zh', 'en'], default: ['en'] }` |

### Duplicate Keys Found

| Key | Location | Issue |
|-----|----------|-------|
| `insurance` | `factoryJobs` namespace - appears at both lines 18 and 32 | Different values: "Health Insurance" vs "Health Insurance" - may be intentional but confusing |
| `training` | `factoryJobs` namespace - appears at both lines 19 and 32 | "Free Training" vs "Training" - key collision |
| `industrialZones` | `factoryJobs` namespace - lines 41 and 44 | Same key used twice for different purposes |

---

## 7. Build & Code Quality Issues

### 7.1 TODOs, FIXMEs, and Console Logs

| File | Line | Finding |
|------|------|---------|
| `src/utils/pwa.ts` | Multiple | 16 instances of `console.log` wrapped in `import.meta.env.DEV` checks |
| `src/utils/pwa.ts` | ~95 | `TODO: Send subscription to server` |
| `src/utils/pwa.ts` | ~103 | `TODO: Remove subscription from server` |
| `src/utils/logger.ts` | ~5 | `console.log` / `console.error` / `console.warn` usage |
| `src/context/AuthContext.tsx` | 156, 183, 227, 249 | `console.error` for auth errors |
| `src/context/FavoritesContext.tsx` | 80 | `console.error` for save failures |

**Note:** PWA console logs are acceptable as they're wrapped in DEV checks. Auth context errors should use the logger utility instead.

### 7.2 Hardcoded API URLs

| File | URL | Context |
|------|-----|---------|
| `src/api/apiService.ts` | `https://api.khmercareer.com` | In a comment (line 5), not active code |
| `src/api/apiService.ts` | `https://your-api.com` | In console message (line 70), not active code |
| `src/api/client.ts` | `/api/v1` | Default baseURL (acceptable) |

**No critical hardcoded production URLs found in active code.**

### 7.3 Error Boundaries

| Finding | Status |
|---------|--------|
| `src/components/ErrorBoundary.tsx` exists | **Present** |
| Error boundary text is hardcoded Chinese only | **Issue: Not translated** |
| Error boundary is NOT used in App.tsx | **Critical Issue: ErrorBoundary is imported nowhere** |
| No error boundary wraps the route tree | Routes will crash to white screen on errors |

### 7.4 Code Quality Issues

| Severity | Issue | Count | Location |
|----------|-------|-------|----------|
| **High** | 106 empty `catch {}` blocks swallowing errors | 106 | Throughout `src/` |
| **High** | Password stored in localStorage plaintext | 1 | `src/api/authApi.ts:141` |
| **Medium** | `use client` directive in FavoritesContext.tsx | 1 | Line 1 - Next.js directive in React app, harmless but incorrect |
| **Medium** | `require()` used in ES module context | 1 | `src/api/favoritesApi.ts:49` |
| **Medium** | Different localStorage keys for same feature | 2 | `khmercareer-saved-jobs` vs `khmerhr-saved-jobs` |
| **Low** | `package.json` not audited for vulnerabilities | - | Run `npm audit` |
| **Low** | Unused imports may exist | - | Run `eslint --no-unused-vars` |

### 7.5 Security Issues

| Severity | Issue | Description |
|----------|-------|-------------|
| **High** | XSS via localStorage | User data rendered from localStorage without sanitization |
| **High** | No CSP headers mentioned | Content Security Policy not implemented |
| **Medium** | Mock tokens don't expire | `generateMockToken()` creates tokens with no expiration |
| **Medium** | `localStorage` used for auth tokens | Vulnerable to XSS token theft; should use `httpOnly` cookies |
| **Low** | No rate limiting on login | `handleDemoLogin` and login form can be brute-forced |

---

## 8. Summary & Priority Action Plan

### Critical Issues (Must Fix Before Production)

| # | Issue | File | Effort |
|---|-------|------|--------|
| 1 | **Plaintext password stored in localStorage** | `authApi.ts:141` | Small |
| 2 | **FavoritesContext never calls favoritesApi** | `FavoritesContext.tsx` | Medium |
| 3 | **ChatContext never calls chatApi** | `ChatContext.tsx` | Medium |
| 4 | **ErrorBoundary not used in App** | `App.tsx` | Small |
| 5 | **`require()` in ES module** | `favoritesApi.ts:49` | Small |
| 6 | **`// @ts-nocheck` on i18n.ts** | `i18n.ts:1` | Medium |
| 7 | **Register form saves password to localStorage** | `Register.tsx:68-74` | Small |

### High Priority Issues

| # | Issue | File | Effort |
|---|-------|------|--------|
| 1 | Mock tokens are insecure/predictable | `authApi.ts:64-65` | Small |
| 2 | Thai translations missing 4 namespaces | `i18n.ts` | Large |
| 3 | Vietnamese translations missing 4 namespaces | `i18n.ts` | Large |
| 4 | Google Sign-In bypasses AuthContext | `Login.tsx:384-402` | Small |
| 5 | No route guards for admin/superadmin | `App.tsx` | Medium |
| 6 | Auth tokens in localStorage (XSS risk) | `client.ts` | Medium |
| 7 | Different localStorage keys for saved jobs | `Jobs.tsx`, `JobDetail.tsx` | Small |
| 8 | 106 empty catch blocks | Throughout | Medium |

### Medium Priority Issues

| # | Issue | File | Effort |
|---|-------|------|--------|
| 1 | Token refresh race condition | `client.ts` | Small |
| 2 | VideoResume pages have no API integration | `VideoResume.tsx`, `VideoResumeRecord.tsx` | Medium |
| 3 | Home component not lazy-loaded | `App.tsx` | Small |
| 4 | `updateUserProfile` silent success on failure | `AuthContext.tsx` | Small |
| 5 | Missing `/forgot-password` route | `App.tsx` | Small |
| 6 | Error boundary text not translated | `ErrorBoundary.tsx` | Small |
| 7 | `isLocalMode()` is dead code | `client.ts` | Small |

---

## Appendix: File Inventory

### API Layer
- `src/api/client.ts` - HTTP client with interceptors
- `src/api/authApi.ts` - Authentication API
- `src/api/jobsApi.ts` - Jobs API
- `src/api/coursesApi.ts` - Courses API
- `src/api/favoritesApi.ts` - Favorites API
- `src/api/chatApi.ts` - Chat API
- `src/api/types.ts` - Shared TypeScript types
- `src/api/index.ts` - Central exports
- `src/api/db.ts` - localStorage database wrapper
- `src/api/notificationsApi.ts` - localStorage notifications

### Context Layer
- `src/context/AuthContext.tsx` - Auth state management
- `src/context/FavoritesContext.tsx` - Favorites state (localStorage only)
- `src/context/ChatContext.tsx` - Chat state (localStorage only)

### Hooks
- `src/hooks/useAuth.ts` - Auth context consumer
- `src/hooks/useFavorites.ts` - Favorites context consumer
- `src/hooks/useChat.ts` - Chat context consumer

### Key Pages
- `src/pages/Login.tsx` - Login page (uses API)
- `src/pages/Register.tsx` - Register page (uses API)
- `src/pages/Jobs.tsx` - Job listing (localStorage for favorites)
- `src/pages/JobDetail.tsx` - Job detail (localStorage for favorites)
- `src/pages/Profile.tsx` - Profile page (uses API)
- `src/pages/ChatList.tsx` - Chat list (uses ChatContext/localStorage)
- `src/pages/ChatDetail.tsx` - Chat detail (uses ChatContext/localStorage)
- `src/pages/VideoResume.tsx` - Video resume (localStorage only)
- `src/pages/VideoResumeRecord.tsx` - Video record (localStorage only)
