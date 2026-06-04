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

const Terms = () => (
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
            <linearGradient id="terms-auris-grad" x1="0" y1="0" x2="32" y2="32" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#7C3AED" />
              <stop offset="100%" stopColor="#2563EB" />
            </linearGradient>
          </defs>
          <rect x="1.5" y="7.5" width="19" height="14" rx="2.5" stroke="url(#terms-auris-grad)" strokeWidth="1.6" />
          <polyline points="1.5,9 11,16 20.5,9" stroke="url(#terms-auris-grad)" strokeWidth="1.6" strokeLinejoin="round" strokeLinecap="round" />
          <line x1="24" y1="13" x2="24" y2="19" stroke="url(#terms-auris-grad)" strokeWidth="1.8" strokeLinecap="round" />
          <line x1="26.5" y1="11" x2="26.5" y2="21" stroke="url(#terms-auris-grad)" strokeWidth="1.8" strokeLinecap="round" />
          <line x1="29" y1="14" x2="29" y2="18" stroke="url(#terms-auris-grad)" strokeWidth="1.8" strokeLinecap="round" />
          <line x1="31.2" y1="12.5" x2="31.2" y2="19.5" stroke="url(#terms-auris-grad)" strokeWidth="1" strokeLinecap="round" />
        </svg>
        <div>
          <h1 className="text-2xl font-bold text-foreground tracking-tight">Auris Terms of Service</h1>
          <p className="text-xs text-muted-foreground mt-0.5">Last updated: June 2026</p>
        </div>
      </div>

      <p className="text-sm text-muted-foreground -mt-2">
        These Terms of Service govern your use of Auris, operated by EclipifyAI. By accessing or using
        Auris you agree to be bound by these terms.
      </p>

      {section("Acceptance of Terms", (
        <>
          <p>By creating an account or using Auris in any way, you confirm that you are at least 13 years old (or the minimum age required in your jurisdiction) and that you agree to these Terms of Service and our Privacy Policy.</p>
          <p>If you are using Auris on behalf of an organisation, you represent that you have authority to bind that organisation to these terms.</p>
        </>
      ))}

      {section("Description of Service", (
        <>
          <p>Auris is an AI-powered email listening assistant that connects to your Gmail inbox, summarises your emails, and reads them aloud via text-to-speech. Core features include:</p>
          <ul className="list-disc pl-5 space-y-1 mt-2">
            <li>AI-generated summaries of individual emails and weekly digests.</li>
            <li>Text-to-speech audio playback of email content.</li>
            <li>Inbox prioritisation and smart filtering.</li>
            <li>Listening preferences and personalisation settings.</li>
          </ul>
          <p className="mt-2">EclipifyAI reserves the right to modify, suspend, or discontinue any feature at any time with reasonable notice.</p>
        </>
      ))}

      {section("Google Account Access", (
        <>
          <p>Auris requests read-only access to your Gmail inbox via Google's OAuth 2.0 flow. By granting this access you acknowledge that:</p>
          <ul className="list-disc pl-5 space-y-1 mt-2">
            <li>Auris will read email content solely to provide the summarisation and audio features described above.</li>
            <li>You can revoke Gmail access at any time from the Auris Settings page or from your Google Account permissions.</li>
            <li>Your use of Google services through Auris is also subject to Google's Terms of Service and Privacy Policy.</li>
          </ul>
          <p className="mt-2">We will never send emails, modify your inbox, or request write permissions beyond what is required for the service.</p>
        </>
      ))}

      {section("Acceptable Use", (
        <>
          <p>You agree not to use Auris to:</p>
          <ul className="list-disc pl-5 space-y-1 mt-2">
            <li>Violate any applicable law or regulation.</li>
            <li>Attempt to reverse-engineer, decompile, or extract the source code of Auris.</li>
            <li>Circumvent, disable, or interfere with security features of the service.</li>
            <li>Use automated scripts or bots to access the service in ways not intended for human use.</li>
            <li>Resell, sublicense, or commercially exploit the service without written consent from EclipifyAI.</li>
          </ul>
          <p className="mt-2">EclipifyAI may suspend or terminate accounts that violate these restrictions.</p>
        </>
      ))}

      {section("Subscription and Billing", (
        <>
          <p><span className="font-medium text-foreground">Free beta:</span> Auris is currently available free of charge during its public beta period. No payment information is required to create an account.</p>
          <p>When paid plans are introduced, EclipifyAI will provide at least 30 days' advance notice to existing users. At that point:</p>
          <ul className="list-disc pl-5 space-y-1 mt-2">
            <li>Continued use of premium features will require a paid subscription.</li>
            <li>Free-tier limitations (if any) will be clearly communicated before they take effect.</li>
            <li>Billing, refunds, and cancellation terms will be published alongside the paid plan details.</li>
          </ul>
        </>
      ))}

      {section("Intellectual Property", (
        <>
          <p>All software, design, branding, and content comprising Auris — including the name, logo, and AI-generated interface copy — are the property of EclipifyAI and are protected by applicable intellectual property laws.</p>
          <p>You retain full ownership of your email content. EclipifyAI claims no ownership over the emails processed through your account. The AI-generated summaries produced from your emails are provided for your personal use and are not independently licensed to EclipifyAI beyond what is necessary to deliver the service.</p>
        </>
      ))}

      {section("Disclaimer of Warranties", (
        <>
          <p>Auris is provided <span className="font-medium text-foreground">"as is"</span> and <span className="font-medium text-foreground">"as available"</span> without warranties of any kind, express or implied, including but not limited to warranties of merchantability, fitness for a particular purpose, or non-infringement.</p>
          <p>EclipifyAI does not warrant that:</p>
          <ul className="list-disc pl-5 space-y-1 mt-2">
            <li>The service will be uninterrupted, timely, or error-free.</li>
            <li>AI-generated summaries will be accurate, complete, or free of errors.</li>
            <li>Any defects or errors will be corrected.</li>
          </ul>
          <p className="mt-2">You use the service at your own risk. Always refer to the original email for important decisions.</p>
        </>
      ))}

      {section("Limitation of Liability", (
        <>
          <p>To the maximum extent permitted by applicable law, EclipifyAI and its officers, employees, and affiliates shall not be liable for any indirect, incidental, special, consequential, or punitive damages arising from your use of — or inability to use — Auris.</p>
          <p>This includes, without limitation, damages resulting from:</p>
          <ul className="list-disc pl-5 space-y-1 mt-2">
            <li>Reliance on an inaccurate AI-generated summary.</li>
            <li>Unauthorised access to your account.</li>
            <li>Service interruptions or data loss.</li>
          </ul>
          <p className="mt-2">In jurisdictions that do not allow the exclusion of certain warranties or limitation of liability, EclipifyAI's liability is limited to the fullest extent permitted by law.</p>
        </>
      ))}

      {section("Termination", (
        <>
          <p>You may delete your account at any time from the Auris Settings page. Upon deletion, your preferences and cached data will be removed within 30 days in accordance with our Privacy Policy.</p>
          <p>EclipifyAI may suspend or terminate your account without prior notice if you breach these Terms, if required by law, or if continued operation of your account poses a risk to the service or other users. Where feasible, we will notify you of the reason for termination.</p>
          <p>Sections covering Intellectual Property, Disclaimer of Warranties, Limitation of Liability, and Governing Law survive termination.</p>
        </>
      ))}

      {section("Changes to Terms", (
        <>
          <p>EclipifyAI may update these Terms of Service from time to time. When we do, we will revise the "Last updated" date at the top of this page and, for material changes, notify you by email or via an in-app notice.</p>
          <p>Your continued use of Auris after the effective date of any changes constitutes acceptance of the revised terms. If you do not agree to the updated terms, please discontinue use and delete your account.</p>
        </>
      ))}

      {section("Governing Law", (
        <p>These Terms are governed by and construed in accordance with the laws of South Africa, without regard to conflict-of-law principles. Any disputes arising under these Terms shall be subject to the exclusive jurisdiction of the courts of South Africa, unless otherwise required by the law of your country of residence.</p>
      ))}

      {section("Contact", (
        <>
          <p>Questions about these Terms? Reach us at:</p>
          <a
            href="mailto:hello@aurismail.com"
            className="inline-block mt-2 font-medium text-primary hover:underline"
          >
            hello@aurismail.com
          </a>
          <p className="mt-3">We aim to respond to all enquiries within 5 business days.</p>
        </>
      ))}

      <p className="text-xs text-muted-foreground text-center pb-6">
        © {new Date().getFullYear()} EclipifyAI. All rights reserved.
      </p>

    </div>
  </div>
);

export default Terms;
