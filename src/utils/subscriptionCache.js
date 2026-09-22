// src/utils/subscriptionCache.js
//
// Persists the current subscription across refreshes AND tab closes.
// Uses localStorage (not sessionStorage) so a subscribed user who
// reopens the browser still sees "Current Plan" immediately.
// Cleared on logout (via localStorage.clear() in AuthContext).

const CACHE_KEY = 'semprep_subscription_cache';

export const saveSubscriptionCache = (sub) => {
  try {
    if (!sub || !sub.isActive) {
      localStorage.removeItem(CACHE_KEY);
      return;
    }
    localStorage.setItem(CACHE_KEY, JSON.stringify(sub));
  } catch (e) {
    console.warn('Failed to save subscription cache:', e);
  }
};

export const getSubscriptionCache = () => {
  try {
    const raw = localStorage.getItem(CACHE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    return parsed && parsed.isActive ? parsed : null;
  } catch (e) {
    console.warn('Failed to read subscription cache:', e);
    return null;
  }
};

export const clearSubscriptionCache = () => {
  try {
    localStorage.removeItem(CACHE_KEY);
  } catch (e) {
    // ignore
  }
};