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

export const authApi = {
  getStatus: () =>
    api.get<{ gmailConnected: boolean; email: string | null }>("/auth/status"),
  disconnectGmail: () => api.delete<{ success: boolean }>("/auth/gmail"),
  registerFcmToken: (token: string) =>
    api.post<{ success: boolean }>("/auth/fcm-token", { token }),
};

export interface FetchEmailsOptions {
  maxResults?: number;
  pageToken?: string;
  priority?: Priority;
  unread?: boolean;
}

export const emailsApi = {
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
  getStarred: () => api.get<{ emails: Email[] }>("/emails/starred"),
  getTrash: () => api.get<{ emails: Email[] }>("/emails/trash"),
  getById: (id: string) => api.get<{ email: Email }>(`/emails/${id}`),
  setStar: (id: string, starred: boolean) =>
    api.patch<{ success: boolean; starred: boolean }>(`/emails/${id}/star`, { starred }),
  markRead: (id: string) =>
    api.patch<{ success: boolean }>(`/emails/${id}/read`),
  trash: (id: string) => api.delete<{ success: boolean }>(`/emails/${id}`),
  restore: (id: string) =>
    api.post<{ success: boolean }>(`/emails/${id}/restore`),
  deletePermanently: (id: string) =>
    api.delete<{ success: boolean }>(`/emails/${id}/permanent`),
};

export const audioApi = {
  generate: (emailId: string, speed: VoiceSpeed = "normal") =>
    api.post<AudioGenerateResult>(`/audio/${emailId}/generate`, { speed }),
  getUrls: (emailId: string, type: "full" | "summary" | "both" = "both", speed: VoiceSpeed = "normal") =>
    api.get<AudioUrls>(`/audio/${emailId}/url?type=${type}&speed=${speed}`),
  generateSummaryAudio: (summaryId: string, text: string, type: "daily" | "weekly" = "daily", speed: VoiceSpeed = "normal") =>
    api.post<{ url: string; gcsPath: string }>("/audio/summary/generate", { summaryId, text, type, speed }),
  getSummaryUrl: (summaryId: string, type: "daily" | "weekly" = "daily", speed: VoiceSpeed = "normal") =>
    api.get<{ url: string }>(`/audio/summary/${summaryId}/url?type=${type}&speed=${speed}`),
};

export const summariesApi = {
  getDaily: (days = 7) =>
    api.get<{ summaries: DailySummary[] }>(`/summaries/daily?days=${days}`),
  getDailyByDate: (date: string) =>
    api.get<{ summary: DailySummary }>(`/summaries/daily/${date}`),
  getWeekly: () => api.get<{ summary: WeeklySummary }>("/summaries/weekly"),
  refreshToday: () =>
    api.post<{ summary: DailySummary }>("/summaries/daily/refresh"),
};

export const userApi = {
  getProfile: () => api.get<UserProfile>("/user/profile"),
  getPrefs: () => api.get<{ prefs: UserPrefs }>("/user/prefs"),
  updatePrefs: (prefs: Partial<UserPrefs>) =>
    api.patch<{ success: boolean; prefs: Partial<UserPrefs> }>("/user/prefs", prefs),
  setPrefs: (prefs: UserPrefs) =>
    api.put<{ success: boolean; prefs: UserPrefs }>("/user/prefs", prefs),
};