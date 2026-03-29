export type Priority = "very-important" | "important" | "not-important";

export interface Email {
  id: string;
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
}

export const mockEmails: Email[] = [
  {
    id: "1",
    from: "Sarah Chen",
    fromEmail: "sarah.chen@company.com",
    subject: "Q4 Revenue Report — Action Required",
    preview: "Hi, I've attached the Q4 revenue report. We need to review the numbers before the board meeting...",
    body: "Hi,\n\nI've attached the Q4 revenue report. We need to review the numbers before the board meeting on Friday. There are some discrepancies in the APAC region that need your attention.\n\nKey highlights:\n- Revenue up 12% YoY\n- APAC region shows unexpected dip in December\n- New product line exceeded targets by 8%\n\nPlease review and share your thoughts by EOD Wednesday.\n\nBest,\nSarah",
    date: "2026-03-29",
    time: "9:15 AM",
    priority: "very-important",
    read: false,
    starred: true,
    trashed: false,
    labels: ["Work", "Finance"],
  },
  {
    id: "2",
    from: "GitHub",
    fromEmail: "notifications@github.com",
    subject: "PR #482 merged: Fix authentication flow",
    preview: "Your pull request has been successfully merged into main...",
    body: "Your pull request #482 'Fix authentication flow' has been successfully merged into main by @devlead.\n\n3 files changed, 47 insertions(+), 12 deletions(-)\n\nCI/CD pipeline triggered. Deployment to staging expected in ~5 minutes.",
    date: "2026-03-29",
    time: "8:42 AM",
    priority: "important",
    read: false,
    starred: false,
    trashed: false,
    labels: ["Dev"],
  },
  {
    id: "3",
    from: "David Park",
    fromEmail: "david.park@startup.io",
    subject: "Partnership Proposal — Auris Integration",
    preview: "I wanted to reach out about a potential partnership between our companies...",
    body: "Hi there,\n\nI wanted to reach out about a potential partnership between our companies. We've been following Auris's growth and believe there's a strong synergy between our platforms.\n\nWould you be available for a 30-minute call next week to discuss?\n\nLooking forward to hearing from you.\n\nBest regards,\nDavid Park\nCEO, Startup.io",
    date: "2026-03-29",
    time: "7:30 AM",
    priority: "very-important",
    read: true,
    starred: true,
    trashed: false,
    labels: ["Business"],
  },
  {
    id: "4",
    from: "Spotify",
    fromEmail: "no-reply@spotify.com",
    subject: "Your weekly music recap is ready",
    preview: "You listened to 47 songs this week. Your top artist was...",
    body: "Your weekly music recap is ready!\n\nYou listened to 47 songs this week.\nTop artist: Bonobo\nTop genre: Electronic\nListening time: 3h 22m\n\nCheck out your personalized playlist.",
    date: "2026-03-28",
    time: "6:00 PM",
    priority: "not-important",
    read: true,
    starred: false,
    trashed: false,
    labels: ["Personal"],
  },
  {
    id: "5",
    from: "Lisa Wang",
    fromEmail: "lisa.wang@hr.company.com",
    subject: "Team offsite — Please confirm attendance",
    preview: "Hi team, we're planning the annual offsite for April 15-17...",
    body: "Hi team,\n\nWe're planning the annual offsite for April 15-17 at Mountain View Resort. Please confirm your attendance by April 1st.\n\nAgenda includes:\n- Strategy planning sessions\n- Team building activities\n- Product roadmap review\n\nPlease fill out the survey linked below.\n\nThanks,\nLisa",
    date: "2026-03-28",
    time: "3:15 PM",
    priority: "important",
    read: false,
    starred: false,
    trashed: false,
    labels: ["Work"],
  },
  {
    id: "6",
    from: "AWS",
    fromEmail: "no-reply@aws.amazon.com",
    subject: "Your March billing statement",
    preview: "Your AWS bill for March 2026 is $342.18...",
    body: "Your AWS bill for March 2026 is ready.\n\nTotal: $342.18\n\nBreakdown:\n- EC2: $180.50\n- S3: $45.20\n- RDS: $89.00\n- Other: $27.48\n\nView your detailed billing dashboard for more information.",
    date: "2026-03-28",
    time: "12:00 PM",
    priority: "important",
    read: true,
    starred: false,
    trashed: false,
    labels: ["Dev", "Finance"],
  },
  {
    id: "7",
    from: "Newsletter Daily",
    fromEmail: "digest@newsletter.com",
    subject: "Today's tech headlines",
    preview: "AI advances, new startup funding rounds, and more...",
    body: "Today's Top Stories:\n\n1. OpenAI announces new model capabilities\n2. Series B: FinTech startup raises $50M\n3. Apple's spring event date confirmed\n4. Remote work trends in 2026\n5. New cybersecurity regulations proposed",
    date: "2026-03-27",
    time: "7:00 AM",
    priority: "not-important",
    read: true,
    starred: false,
    trashed: false,
    labels: ["Newsletter"],
  },
  {
    id: "8",
    from: "Mom",
    fromEmail: "mom@family.com",
    subject: "Sunday dinner?",
    preview: "Hey sweetie, are you coming for dinner this Sunday? Dad is making...",
    body: "Hey sweetie,\n\nAre you coming for dinner this Sunday? Dad is making his famous lasagna. Your sister and the kids will be here too.\n\nLet me know! ❤️\n\nLove,\nMom",
    date: "2026-03-27",
    time: "2:30 PM",
    priority: "important",
    read: true,
    starred: true,
    trashed: false,
    labels: ["Personal"],
  },
];

export const mockTrashedEmails: Email[] = [
  {
    id: "t1",
    from: "Promo Store",
    fromEmail: "deals@promostore.com",
    subject: "50% OFF everything — Today only!",
    preview: "Don't miss our biggest sale of the year...",
    body: "MEGA SALE! 50% off everything today only. Use code SAVE50 at checkout.",
    date: "2026-03-26",
    time: "10:00 AM",
    priority: "not-important",
    read: true,
    starred: false,
    trashed: true,
    labels: ["Promo"],
  },
  {
    id: "t2",
    from: "Random Survey",
    fromEmail: "survey@research.com",
    subject: "Complete our survey for a chance to win",
    preview: "Take 5 minutes to share your opinion...",
    body: "Complete our survey and win a $100 gift card! Takes only 5 minutes.",
    date: "2026-03-25",
    time: "4:00 PM",
    priority: "not-important",
    read: true,
    starred: false,
    trashed: true,
    labels: [],
  },
];

export const mockDailySummaries: DailySummary[] = [
  {
    date: "2026-03-29",
    totalEmails: 12,
    veryImportant: 2,
    important: 5,
    notImportant: 5,
    highlights: [
      "Q4 Revenue Report requires your review before Friday's board meeting",
      "Partnership proposal from Startup.io — CEO wants to schedule a call",
      "PR #482 merged successfully, deployment to staging in progress",
    ],
  },
  {
    date: "2026-03-28",
    totalEmails: 18,
    veryImportant: 1,
    important: 7,
    notImportant: 10,
    highlights: [
      "Team offsite confirmation needed by April 1st",
      "AWS March billing: $342.18",
      "3 newsletter digests received",
    ],
  },
  {
    date: "2026-03-27",
    totalEmails: 8,
    veryImportant: 0,
    important: 3,
    notImportant: 5,
    highlights: [
      "Family dinner invitation for Sunday",
      "Tech newsletter highlights: AI advances, startup funding",
    ],
  },
];

export const mockWeeklySummary = {
  week: "March 23 – 29, 2026",
  totalEmails: 67,
  veryImportant: 5,
  important: 22,
  notImportant: 40,
  topSenders: [
    { name: "Sarah Chen", count: 8 },
    { name: "GitHub", count: 12 },
    { name: "Lisa Wang", count: 5 },
    { name: "AWS", count: 3 },
  ],
  actionItems: [
    "Review Q4 Revenue Report",
    "Respond to partnership proposal from Startup.io",
    "Confirm team offsite attendance",
    "Review AWS billing optimization",
  ],
  summary:
    "This week you received 67 emails. 5 were flagged as very important, mostly related to finance and business partnerships. 12 GitHub notifications indicate active development. Consider unsubscribing from 3 low-engagement newsletters.",
};
