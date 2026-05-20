import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

const section = (title: string, children: React.ReactNode) => (
  <motion.div
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    className="glass-surface rounded-2xl p-6"
  >
    <h2 className="text-base font-bold text-foreground mb-3">{title}</h2>
    <div className="text-sm text-muted-foreground space-y-2">{children}</div>
  </motion.div>
);

const PrivacyPolicy = () => (
  <div className="min-h-screen bg-background px-4 py-10">
    <div className="max-w-2xl mx-auto space-y-6">

      {/* Header */}
      <div className="flex items-center gap-4 mb-2">
        <Link
          to="/"
          className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to app
        </Link>
      </div>

      {/* Logo + Title */}
      <div className="flex items-center gap-3 mb-6">
        <svg
          width="36"
          height="36"
          viewBox="0 0 32 32"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="shrink-0"
        >
          <defs>
            <linearGradient id="pp-auris-grad" x1="0" y1="0" x2="32" y2="32" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#7C3AED" />
              <stop offset="100%" stopColor="#2563EB" />
            </linearGradient>
          </defs>
          <rect x="1.5" y="7.5" width="19" height="14" rx="2.5" stroke="url(#pp-auris-grad)" strokeWidth="1.6" />
          <polyline points="1.5,9 11,16 20.5,9" stroke="url(#pp-auris-grad)" strokeWidth="1.6" strokeLinejoin="round" strokeLinecap="round" />
          <line x1="24" y1="13" x2="24" y2="19" stroke="url(#pp-auris-grad)" strokeWidth="1.8" strokeLinecap="round" />
          <line x1="26.5" y1="11" x2="26.5" y2="21" stroke="url(#pp-auris-grad)" strokeWidth="1.8" strokeLinecap="round" />
          <line x1="29" y1="14" x2="29" y2="18" stroke="url(#pp-auris-grad)" strokeWidth="1.8" strokeLinecap="round" />
          <line x1="31.2" y1="12.5" x2="31.2" y2="19.5" stroke="url(#pp-auris-grad)" strokeWidth="1" strokeLinecap="round" />
        </svg>
        <div>
          <h1 className="text-2xl font-bold text-foreground tracking-tight">Auris Privacy Policy</h1>
          <p className="text-xs text-muted-foreground mt-0.5">Last updated: May 2026</p>
        </div>
      </div>

      <p className="text-sm text-muted-foreground -mt-2">
        Auris is built on a simple principle: your emails are yours. This policy explains exactly what we
        access, what we store, and what we never do.
      </p>

      {section("What we access", (
        <>
          <p>When you connect your Gmail account, Auris requests read-only access to your inbox via the Gmail API. This allows us to:</p>
          <ul className="list-disc pl-5 space-y-1 mt-2">
            <li>Fetch email subjects, senders, and body text for summarisation and text-to-speech.</li>
            <li>Read metadata (date, labels) to sort and prioritise your inbox.</li>
          </ul>
          <p className="mt-2">We request the minimum OAuth scopes necessary and do not access Drafts, Sent mail, Contacts, or Calendar data.</p>
        </>
      ))}

      {section("What we store", (
        <>
          <ul className="list-disc pl-5 space-y-1">
            <li>Your Firebase Authentication UID and display name / profile photo, used to identify your account.</li>
            <li>Your listening preferences (voice speed, voice type, smart-feature toggles) stored in our database.</li>
            <li>AI-generated email summaries, cached temporarily to avoid redundant API calls.</li>
            <li>Generated audio files, stored briefly (up to 24 hours) in cloud storage so they can be streamed without re-generation.</li>
          </ul>
          <p className="mt-2">We do not store the raw text of your emails beyond the time needed to generate a summary or audio file.</p>
        </>
      ))}

      {section("What we never do", (
        <ul className="list-disc pl-5 space-y-1">
          <li>Sell, rent, or share your data with advertisers or data brokers.</li>
          <li>Train AI or machine-learning models on your personal email content.</li>
          <li>Send emails on your behalf or modify your inbox in any way.</li>
          <li>Store your Gmail OAuth tokens beyond your active session — tokens are handled via secure server-side flows and never exposed to the browser.</li>
          <li>Track you across other websites or apps.</li>
        </ul>
      ))}

      {section("Third-party services", (
        <>
          <p>Auris relies on the following third-party services, each governed by their own privacy policies:</p>
          <ul className="list-disc pl-5 space-y-1 mt-2">
            <li><span className="font-medium text-foreground">Google (Gmail API &amp; Firebase)</span> — authentication and email access.</li>
            <li><span className="font-medium text-foreground">Google Cloud Text-to-Speech</span> — converting email summaries to audio.</li>
            <li><span className="font-medium text-foreground">Anthropic / OpenAI</span> — AI models used to generate email summaries. Prompts are processed per-request and are not used for model training under our API agreements.</li>
            <li><span className="font-medium text-foreground">Google Cloud Storage</span> — short-term audio file hosting.</li>
          </ul>
        </>
      ))}

      {section("Data retention", (
        <ul className="list-disc pl-5 space-y-1">
          <li>Audio files are deleted automatically after 24 hours.</li>
          <li>Email summaries are cached for up to 7 days, then purged.</li>
          <li>Your account preferences are retained until you delete your account.</li>
          <li>Deleting your account removes all stored preferences and cached data within 30 days.</li>
        </ul>
      ))}

      {section("Your rights", (
        <>
          <p>You can exercise the following rights at any time by contacting us:</p>
          <ul className="list-disc pl-5 space-y-1 mt-2">
            <li><span className="font-medium text-foreground">Access</span> — request a copy of the personal data we hold about you.</li>
            <li><span className="font-medium text-foreground">Deletion</span> — request that your account and associated data be deleted.</li>
            <li><span className="font-medium text-foreground">Revoke access</span> — disconnect Gmail at any time from the Settings page; this immediately invalidates our access token.</li>
            <li><span className="font-medium text-foreground">Portability</span> — request your preferences data in a machine-readable format.</li>
          </ul>
        </>
      ))}

      {section("Security", (
        <ul className="list-disc pl-5 space-y-1">
          <li>All data is transmitted over HTTPS / TLS.</li>
          <li>OAuth tokens are stored server-side and never exposed to the client.</li>
          <li>Firebase Authentication handles credential management — we never store passwords.</li>
          <li>Access to production infrastructure is restricted to authorised team members.</li>
        </ul>
      ))}

      {section("Contact", (
        <>
          <p>Questions, requests, or concerns about this policy? Reach us at:</p>
          <a
            href="mailto:hello@aurismail.com"
            className="inline-block mt-2 font-medium text-primary hover:underline"
          >
            hello@aurismail.com
          </a>
          <p className="mt-3">We aim to respond to all privacy-related enquiries within 5 business days.</p>
        </>
      ))}

      <p className="text-xs text-muted-foreground text-center pb-6">
        © {new Date().getFullYear()} Auris. All rights reserved.
      </p>

    </div>
  </div>
);

export default PrivacyPolicy;
