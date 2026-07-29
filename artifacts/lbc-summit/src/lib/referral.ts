// Referral attribution — captures ?ref=CODE, stores it for 30 days, and
// pings the backend to record the click. Read at checkout to attribute sales.

const STORAGE_KEY = "lbc_ref";
const WINDOW_DAYS = 30;

interface StoredRef {
  code: string;
  savedAt: number;
}

/** Read the current stored referral code, or null if none / expired. */
export function getReferralCode(): string | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as StoredRef;
    const ageDays = (Date.now() - parsed.savedAt) / (1000 * 60 * 60 * 24);
    if (ageDays > WINDOW_DAYS) {
      localStorage.removeItem(STORAGE_KEY);
      return null;
    }
    return parsed.code;
  } catch {
    return null;
  }
}

/**
 * Capture ?ref=CODE from the URL on page load. Stores it (last-touch wins),
 * records the click server-side, then strips the param from the URL.
 * Safe to call once on app boot.
 */
export function captureReferral(): void {
  try {
    const params = new URLSearchParams(window.location.search);
    const raw = params.get("ref");
    if (!raw) return;

    const code = raw.trim().toUpperCase().replace(/[^A-Z0-9]/g, "").slice(0, 40);
    if (!code) return;

    localStorage.setItem(STORAGE_KEY, JSON.stringify({ code, savedAt: Date.now() } as StoredRef));

    // Record the click (fire-and-forget).
    fetch("/api/affiliate/track-click", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ code }),
    }).catch(() => { /* ignore network errors */ });

    // Remove ?ref from the visible URL without reloading.
    params.delete("ref");
    const qs = params.toString();
    const newUrl = window.location.pathname + (qs ? `?${qs}` : "") + window.location.hash;
    window.history.replaceState({}, "", newUrl);
  } catch {
    /* localStorage unavailable — silently skip */
  }
}
