/**
 * KhmerCareer Express — Favorites API
 * Manages user's favorited jobs. HTTP API with localStorage fallback.
 */

import { get, post, del } from './client';
import type { Favorite, FavoriteToggleResponse, Job } from './types';

const FAVORITES_KEY = 'khmercareer_favorites';
const FAVORITES_FALLBACK_KEY = 'khmer_favorites_fallback';

// =============================================================================
// Fallback helpers
// =============================================================================

function isFallbackEnabled(): boolean {
  try { return localStorage.getItem(FAVORITES_FALLBACK_KEY) === 'true'; } catch { return false; }
}

function setFallbackEnabled(v: boolean): void {
  try { localStorage.setItem(FAVORITES_FALLBACK_KEY, v ? 'true' : 'false'); } catch { /* */ }
}

interface LocalFavorite {
  id: string;
  jobId: string;
  createdAt: string;
}

function getLocalFavorites(): LocalFavorite[] {
  try { return JSON.parse(localStorage.getItem(FAVORITES_KEY) || '[]'); } catch { return []; }
}

function saveLocalFavorites(favs: LocalFavorite[]): void {
  localStorage.setItem(FAVORITES_KEY, JSON.stringify(favs));
}

function getCurrentUserId(): string | null {
  try {
    const user = localStorage.getItem('khmer_auth_user');
    if (user) return JSON.parse(user).id as string;
  } catch { /* */ }
  return 'anonymous_user';
}

// Import jobs collection for fallback resolution
function getJobFromLocal(jobId: string): Job | undefined {
  try {
    const { createCollection } = require('./db');
    const jobsCollection = createCollection<Job>('jobs');
    return jobsCollection.findById(jobId);
  } catch {
    return undefined;
  }
}

// =============================================================================
// Favorites API
// =============================================================================

export type { Favorite, FavoriteToggleResponse };

export const favoritesApi = {
  // ── Get Favorites ───────────────────────────────────────────────────────────
  async getFavorites(): Promise<Favorite[]> {
    try {
      const response = await get<{ favorites: Favorite[] }>('/favorites');
      setFallbackEnabled(false);
      return response.favorites || [];
    } catch {
      setFallbackEnabled(true);
      const userId = getCurrentUserId();
      const allFavs = getLocalFavorites();
      // In local fallback, we return favorites without the full job object
      // Components should resolve job details separately
      return allFavs.map(f => ({
        id: f.id,
        jobId: f.jobId,
        job: getJobFromLocal(f.jobId) || {
          id: f.jobId,
          title: 'Unknown Job',
          titleZh: '',
          titleEn: '',
          company: '',
          location: '',
          salary: '',
          salaryMin: 0,
          salaryMax: 0,
          type: 'full-time',
          industry: '',
          level: '',
          experience: '',
          description: '',
          requirements: [],
          benefits: [],
          applicants: 0,
          postedAt: '',
          status: 'active',
          verified: false,
          urgent: false,
          featured: false,
          employerType: '',
          createdAt: f.createdAt,
        } as Job,
        createdAt: f.createdAt,
      }));
    }
  },

  // ── Add Favorite ────────────────────────────────────────────────────────────
  async addFavorite(jobId: string): Promise<FavoriteToggleResponse> {
    try {
      const response = await post<FavoriteToggleResponse>('/favorites', { jobId });
      return response;
    } catch {
      const favs = getLocalFavorites();
      if (!favs.find(f => f.jobId === jobId)) {
        favs.push({
          id: crypto.randomUUID(),
          jobId,
          createdAt: new Date().toISOString(),
        });
        saveLocalFavorites(favs);
      }
      return { favorited: true };
    }
  },

  // ── Remove Favorite ─────────────────────────────────────────────────────────
  async removeFavorite(jobId: string): Promise<FavoriteToggleResponse> {
    try {
      const response = await del<FavoriteToggleResponse>(`/favorites/${jobId}`);
      return response;
    } catch {
      const favs = getLocalFavorites().filter(f => f.jobId !== jobId);
      saveLocalFavorites(favs);
      return { favorited: false };
    }
  },

  // ── Toggle Favorite ─────────────────────────────────────────────────────────
  async toggleFavorite(jobId: string): Promise<boolean> {
    const favs = await this.getFavorites();
    const isFav = favs.some(f => f.jobId === jobId);
    if (isFav) {
      await this.removeFavorite(jobId);
      return false;
    } else {
      await this.addFavorite(jobId);
      return true;
    }
  },

  // ── Check if favorited ──────────────────────────────────────────────────────
  async isFavorited(jobId: string): Promise<boolean> {
    try {
      const favs = await this.getFavorites();
      return favs.some(f => f.jobId === jobId);
    } catch {
      return getLocalFavorites().some(f => f.jobId === jobId);
    }
  },

  // ── Get favorite job IDs (lightweight) ──────────────────────────────────────
  async getFavoriteJobIds(): Promise<string[]> {
    try {
      const favs = await this.getFavorites();
      return favs.map(f => f.jobId);
    } catch {
      return getLocalFavorites().map(f => f.jobId);
    }
  },
};

export default favoritesApi;
