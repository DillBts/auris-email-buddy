// ── Core types ─────────────────────────────────────────────

export type Priority = "very-important" | "important" | "not-important";
export type VoiceSpeed = "slow" | "normal" | "fast";

export interface Email {
  id: string;
  threadId: string;
  from: string;
  fromEmail: string;
  subject: string;
  preview: string;
  body: string;
  date: string;
  time: string;
  priority: Priority;
  read: boolean;
  starred: boolean;
  trashed: boolean;
  labels: string[];
}

export interface DailySummary {
  date: string;
  totalEmails: number;
  veryImportant: number;
  important: number;
  notImportant: number;
  highlights: string[];
  audioSummary: string;
}

export interface WeeklySummary {
  week: string;
  totalEmails: number;
  veryImportant: number;
  important: number;
  notImportant: number;
  topSenders: Array<{ name: string; count: number }>;
  actionItems: string[];
  summary: string;
  audioSummary: string;
}

export interface UserPrefs {
  notifications: boolean;
  autoListen: boolean;
  smartPriority: boolean;
  dailySummary: boolean;
  weeklySummary: boolean;
  voiceSpeed: VoiceSpeed;
}

export interface UserProfile {
  uid: string;
  email: string;
  gmailConnected: boolean;
  connectedEmail: string | null;
}

export interface AudioUrls {
  fullUrl?: string;
  summaryUrl?: string;
}

export interface AudioGenerateResult {
  cached: boolean;
  fullPath: string;
  summaryPath: string;
  summary: string;
  speed: VoiceSpeed;
}
