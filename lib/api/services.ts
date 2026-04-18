import { api } from "./client";
import type {
  Email,
  DailySummary,
  WeeklySummary,
  UserPrefs,
  UserProfile,
  AudioUrls,
  AudioGenerateResult,
  Priority,
  VoiceSpeed,
} from "./types";

// ── AUTH ───────────────────────────────────────────────────

export const authApi = {
  /** Returns Gmail connection status */
  getStatus: () =>
    api.get<{ gmailConnected: boolean; email: string | null }>("/auth/status"),

  /** Get the Google OAuth URL to redirect the user to */
  getGmailAuthUrl: () => api.get<{ url: string }>("/auth/gmail/url"),

  /** Disconnect Gmail account */
  disconnectGmail: () => api.delete<{ success: boolean }>("/auth/gmail"),

  /** Register FCM device token for push notifications */
  registerFcmToken: (token: string) =>
    api.post<{ success: boolean }>("/auth/fcm-token", { token }),
};

// ── EMAILS ─────────────────────────────────────────────────

export interface FetchEmailsOptions {
  maxResults?: number;
  pageToken?: string;
  priority?: Priority;
  unread?: boolean;
}

export const emailsApi = {
  /** Fetch inbox emails with optional filters */
  getInbox: (opts: FetchEmailsOptions = {}) => {
    const params = new URLSearchParams();
    if (opts.maxResults) params.set("maxResults", String(opts.maxResults));
    if (opts.pageToken) params.set("pageToken", opts.pageToken);
    if (opts.priority) params.set("priority", opts.priority);
    if (opts.unread) params.set("unread", "true");
    const qs = params.toString();
    return api.get<{ emails: Email[]; nextPageToken: string | null }>(
      `/emails${qs ? `?${qs}` : ""}`
    );
  },

  /** Fetch starred emails */
  getStarred: () =>
    api.get<{ emails: Email[] }>("/emails/starred"),

  /** Fetch trashed emails */
  getTrash: () =>
    api.get<{ emails: Email[] }>("/emails/trash"),

  /** Fetch single email by ID (also marks it as read) */
  getById: (id: string) =>
    api.get<{ email: Email }>(`/emails/${id}`),

  /** Star or unstar an email */
  setStar: (id: string, starred: boolean) =>
    api.patch<{ success: boolean; starred: boolean }>(`/emails/${id}/star`, { starred }),

  /** Mark an email as read */
  markRead: (id: string) =>
    api.patch<{ success: boolean }>(`/emails/${id}/read`),

  /** Move email to trash */
  trash: (id: string) =>
    api.delete<{ success: boolean }>(`/emails/${id}`),

  /** Restore email from trash */
  restore: (id: string) =>
    api.post<{ success: boolean }>(`/emails/${id}/restore`),

  /** Permanently delete email */
  deletePermanently: (id: string) =>
    api.delete<{ success: boolean }>(`/emails/${id}/permanent`),
};

// ── AUDIO ──────────────────────────────────────────────────

export const audioApi = {
  /**
   * Generate full + summary audio for an email.
   * Safe to call multiple times — returns cached result after first generation.
   */
  generate: (emailId: string, speed: VoiceSpeed = "normal") =>
    api.post<AudioGenerateResult>(`/audio/${emailId}/generate`, { speed }),

  /**
   * Get fresh signed playback URLs (valid for 15 min).
   * Always call this right before playing — don't store the URLs.
   */
  getUrls: (
    emailId: string,
    type: "full" | "summary" | "both" = "both",
    speed: VoiceSpeed = "normal"
  ) =>
    api.get<AudioUrls>(
      `/audio/${emailId}/url?type=${type}&speed=${speed}`
    ),

  /** Generate audio for a daily/weekly summary text */
  generateSummaryAudio: (
    summaryId: string,
    text: string,
    type: "daily" | "weekly" = "daily",
    speed: VoiceSpeed = "normal"
  ) =>
    api.post<{ url: string; gcsPath: string }>("/audio/summary/generate", {
      summaryId,
      text,
      type,
      speed,
    }),

  /** Get signed URL for a previously generated summary audio */
  getSummaryUrl: (
    summaryId: string,
    type: "daily" | "weekly" = "daily",
    speed: VoiceSpeed = "normal"
  ) =>
    api.get<{ url: string }>(
      `/audio/summary/${summaryId}/url?type=${type}&speed=${speed}`
    ),
};

// ── SUMMARIES ──────────────────────────────────────────────

export const summariesApi = {
  /** Get daily summaries for the last N days */
  getDaily: (days = 7) =>
    api.get<{ summaries: DailySummary[] }>(`/summaries/daily?days=${days}`),

  /** Get summary for a specific date (YYYY-MM-DD) */
  getDailyByDate: (date: string) =>
    api.get<{ summary: DailySummary }>(`/summaries/daily/${date}`),

  /** Get this week's summary */
  getWeekly: () =>
    api.get<{ summary: WeeklySummary }>("/summaries/weekly"),

  /** Force-regenerate today's daily summary */
  refreshToday: () =>
    api.post<{ summary: DailySummary }>("/summaries/daily/refresh"),
};

// ── USER ───────────────────────────────────────────────────

export const userApi = {
  /** Get user profile + Gmail connection info */
  getProfile: () =>
    api.get<UserProfile>("/user/profile"),

  /** Get all user preferences */
  getPrefs: () =>
    api.get<{ prefs: UserPrefs }>("/user/prefs"),

  /** Update one or more preferences */
  updatePrefs: (prefs: Partial<UserPrefs>) =>
    api.patch<{ success: boolean; prefs: Partial<UserPrefs> }>("/user/prefs", prefs),

  /** Replace all preferences at once */
  setPrefs: (prefs: UserPrefs) =>
    api.put<{ success: boolean; prefs: UserPrefs }>("/user/prefs", prefs),
};
