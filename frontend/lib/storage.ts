// LocalStorage management for SaralGST

const STORAGE_KEYS = {
  LOOKUPS: 'sg_lookups_',
  TOKEN: 'sg_token',
  TIER: 'sg_tier',
  EXPIRES_AT: 'sg_expires_at',
  LANGUAGE: 'sg_language',
};

export class StorageManager {
  // Daily lookups counter
  static getTodayLookups(): number {
    const today = new Date().toISOString().split('T')[0];
    const key = `${STORAGE_KEYS.LOOKUPS}${today}`;
    const stored = localStorage.getItem(key);
    return stored ? parseInt(stored, 10) : 0;
  }

  static incrementLookups(): number {
    const today = new Date().toISOString().split('T')[0];
    const key = `${STORAGE_KEYS.LOOKUPS}${today}`;
    const current = this.getTodayLookups();
    const newCount = current + 1;
    localStorage.setItem(key, newCount.toString());
    return newCount;
  }

  static resetLookups(): void {
    const today = new Date().toISOString().split('T')[0];
    const key = `${STORAGE_KEYS.LOOKUPS}${today}`;
    localStorage.setItem(key, '0');
  }

  // Token management
  static getToken(): string | null {
    return localStorage.getItem(STORAGE_KEYS.TOKEN);
  }

  static setToken(token: string): void {
    localStorage.setItem(STORAGE_KEYS.TOKEN, token);
  }

  static clearToken(): void {
    localStorage.removeItem(STORAGE_KEYS.TOKEN);
    localStorage.removeItem(STORAGE_KEYS.TIER);
    localStorage.removeItem(STORAGE_KEYS.EXPIRES_AT);
  }

  // Tier management
  static getTier(): 'free' | 'paid' | 'ca_firm' {
    const tier = localStorage.getItem(STORAGE_KEYS.TIER);
    return (tier as 'free' | 'paid' | 'ca_firm') || 'free';
  }

  static setTier(tier: 'free' | 'paid' | 'ca_firm'): void {
    localStorage.setItem(STORAGE_KEYS.TIER, tier);
  }

  // Expiry management
  static getExpiresAt(): string | null {
    return localStorage.getItem(STORAGE_KEYS.EXPIRES_AT);
  }

  static setExpiresAt(expiresAt: string): void {
    localStorage.setItem(STORAGE_KEYS.EXPIRES_AT, expiresAt);
  }

  static isTokenExpired(): boolean {
    const expiresAt = this.getExpiresAt();
    if (!expiresAt) return true;

    const expiryDate = new Date(expiresAt);
    const now = new Date();
    return now > expiryDate;
  }

  // Language preference
  static getLanguage(): 'en' | 'hi' {
    const lang = localStorage.getItem(STORAGE_KEYS.LANGUAGE);
    return (lang as 'en' | 'hi') || 'en';
  }

  static setLanguage(language: 'en' | 'hi'): void {
    localStorage.setItem(STORAGE_KEYS.LANGUAGE, language);
  }

  // Check if user has reached daily limit
  static hasReachedDailyLimit(): boolean {
    const tier = this.getTier();
    if (tier !== 'free') return false;

    const lookups = this.getTodayLookups();
    return lookups >= 3;
  }

  // Get remaining lookups for today
  static getRemainingLookups(): number {
    const tier = this.getTier();
    if (tier !== 'free') return 1000; // Unlimited for paid tier

    const lookups = this.getTodayLookups();
    return Math.max(0, 3 - lookups);
  }

  // Clear all data (for testing or logout)
  static clearAll(): void {
    // Clear all lookups
    const keys = Object.keys(localStorage);
    keys.forEach(key => {
      if (key.startsWith(STORAGE_KEYS.LOOKUPS)) {
        localStorage.removeItem(key);
      }
    });

    // Clear token and tier
    this.clearToken();
  }
}

export const storageManager = StorageManager;
