// Re-export shared types and provide mock data used by Listen page and shared components.
export type { Email, Priority } from "./api/types";
import type { Email } from "./api/types";

export interface DailySummary {
  date: string;
  totalEmails: number;
  veryImportant: number;
  important: number;
  notImportant: number;
  highlights: string[];
}

export interface WeeklySummary {
  week: string;
  totalEmails: number;
  veryImportant: number;
  important: number;
  notImportant: number;
  summary: string;
  actionItems: string[];
  topSenders: { name: string; count: number }[];
}

export const mockEmails: Email[] = [
  {
    id: "1",
    threadId: "t1",
    from: "Sarah Chen",
    fromEmail: "sarah@company.com",
    subject: "Q4 Planning Review – Action Required",
    preview: "Hi team, we need to finalize the Q4 roadmap by Friday. Please review the attached document...",
    body: "Hi team,\n\nWe need to finalize the Q4 roadmap by Friday. Please review the attached document and share your feedback before our sync on Thursday.\n\nThanks,\nSarah",
    date: "Today",
    time: "10:24 AM",
    priority: "very-important",
    read: false,
    starred: true,
    trashed: false,
    labels: ["Work", "Urgent"],
  },
  {
    id: "2",
    threadId: "t2",
    from: "GitHub",
    fromEmail: "noreply@github.com",
    subject: "New pull request in your repository",
    preview: "A new pull request has been opened by contributor123...",
    body: "A new pull request has been opened by contributor123 in your repository.\n\nReview it here: https://github.com",
    date: "Today",
    time: "9:12 AM",
    priority: "important",
    read: false,
    starred: false,
    trashed: false,
    labels: ["Dev"],
  },
  {
    id: "3",
    threadId: "t3",
    from: "Newsletter",
    fromEmail: "news@example.com",
    subject: "This week in tech",
    preview: "Top stories: AI breakthroughs, new framework releases, and more...",
    body: "Top stories this week in tech...",
    date: "Yesterday",
    time: "6:00 PM",
    priority: "not-important",
    read: true,
    starred: false,
    trashed: false,
    labels: ["News"],
  },
];

export const mockTrashedEmails: Email[] = [];

export const mockDailySummaries: DailySummary[] = [
  {
    date: "Today",
    totalEmails: 12,
    veryImportant: 2,
    important: 5,
    notImportant: 5,
    highlights: ["Q4 planning review due Friday", "New PR awaiting your review"],
  },
  {
    date: "Yesterday",
    totalEmails: 18,
    veryImportant: 1,
    important: 7,
    notImportant: 10,
    highlights: ["Client contract signed", "Team standup notes shared"],
  },
];

export const mockWeeklySummary: WeeklySummary = {
  week: "This Week",
  totalEmails: 87,
  veryImportant: 8,
  important: 32,
  notImportant: 47,
  summary:
    "A productive week with several key client interactions and project milestones. Most communication centered around Q4 planning and product launches.",
  actionItems: [
    "Finalize Q4 roadmap by Friday",
    "Review pending PRs",
    "Schedule client follow-up call",
  ],
  topSenders: [
    { name: "Sarah Chen", count: 14 },
    { name: "GitHub", count: 11 },
    { name: "Slack", count: 8 },
  ],
};
