import React from "react";

export default function PrivacyPolicy() {
  return (
    <main className="relative min-h-screen z-10 pt-24">
      <div className="container mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-gradient-to-br from-white/80 via-neutral-50/60 to-white/70 dark:from-neutral-800/80 dark:via-neutral-900/60 dark:to-transparent backdrop-blur-xl border border-neutral-200/50 dark:border-neutral-700/50 rounded-3xl shadow-2xl shadow-neutral-200/20 dark:shadow-neutral-900/40">
          <div className="p-8 lg:p-12 space-y-6 text-neutral-800 dark:text-neutral-200">
            <h1 className="text-3xl lg:text-4xl font-bold mb-4">Privacy Policy</h1>
            <p className="text-sm text-neutral-500 dark:text-neutral-400">
              Effective date: <strong>27 July 2025</strong>
            </p>

            {/* 1. Introduction */}
            <section>
              <h2 className="text-xl font-semibold mb-2">1. Introduction</h2>
              <p>
                Welcome to <strong>umar.is-a.dev</strong> (“Site”). I, Umar Siddiqui, respect your privacy and am committed to protecting any information you share while visiting this portfolio website.
              </p>
            </section>

            {/* 2. What data we collect */}
            <section>
              <h2 className="text-xl font-semibold mb-2">2. Information We Collect</h2>
              <ul className="list-disc list-inside space-y-1">
                <li>
                  **Voluntary contact data**: name, e-mail address, phone number — only if you fill out the contact form or reach out directly.
                </li>
                <li>
                  **Technical data**: IP address, browser type, device identifiers, operating system, referring pages, and timestamps via server logs or analytics tools.
                </li>
                <li>
                  **Cookies & local storage**: used for site functionality and anonymous analytics (Google Analytics, Vercel Analytics).
                </li>
              </ul>
            </section>

            {/* 3. How we use it */}
            <section>
              <h2 className="text-xl font-semibold mb-2">3. How We Use Information</h2>
              <ul className="list-disc list-inside space-y-1">
                <li>To respond to your inquiries.</li>
                <li>To maintain, secure, and improve the Site.</li>
                <li>To understand traffic patterns via aggregated, non-identifiable analytics.</li>
              </ul>
            </section>

            {/* 4. Legal bases (GDPR) */}
            <section>
              <h2 className="text-xl font-semibold mb-2">4. Legal Basis for Processing (EU/EEA Users)</h2>
              <p>
                We process personal data under one of the following bases: consent (Art. 6(1)(a)), contract performance (Art. 6(1)(b)), or legitimate interests (Art. 6(1)(f)) such as improving the Site.
              </p>
            </section>

            {/* 5. Sharing & disclosure */}
            <section>
              <h2 className="text-xl font-semibold mb-2">5. Data Sharing</h2>
              <p>
                We do **not** sell, rent, or trade your personal data. We may share information with service providers (e.g., hosting or analytics) who process data solely on our behalf under confidentiality obligations.
              </p>
            </section>

            {/* 6. International transfers */}
            <section>
              <h2 className="text-xl font-semibold mb-2">6. International Transfers</h2>
              <p>
                If you access the Site from outside the United States, your information may be transferred to and processed on servers located in the U.S. or other jurisdictions that may have different data-protection laws. We rely on Standard Contractual Clauses or other approved safeguards where required.
              </p>
            </section>

            {/* 7. Security */}
            <section>
              <h2 className="text-xl font-semibold mb-2">7. Security Measures</h2>
              <p>
                We implement technical and organizational measures (HTTPS, secure hosting, limited access) to protect your data against unauthorized access, alteration, disclosure, or destruction.
              </p>
            </section>

            {/* 8. Retention */}
            <section>
              <h2 className="text-xl font-semibold mb-2">8. Data Retention</h2>
              <p>
                Personal data is retained only as long as necessary for the purposes outlined above or to comply with legal obligations. Analytics data is automatically purged after **26 months**.
              </p>
            </section>

            {/* 9. Your rights */}
            <section>
              <h2 className="text-xl font-semibold mb-2">9. Your Rights (GDPR / CCPA)</h2>
              <ul className="list-disc list-inside space-y-1">
                <li>Access, rectify, or delete your personal data.</li>
                <li>Restrict or object to processing.</li>
                <li>Data portability.</li>
                <li>Withdraw consent at any time (will not affect prior processing).</li>
              </ul>
              <p className="mt-2">
                To exercise these rights, email <a href="mailto:siddiquiumar0007@gmail.com" className="text-sky-600 dark:text-sky-400 underline">siddiquiumar0007@gmail.com</a>.
              </p>
            </section>

            {/* 10. Children */}
            <section>
              <h2 className="text-xl font-semibold mb-2">10. Children’s Privacy</h2>
              <p>
                The Site is not directed to children under 13 (or 16 in the EEA). We do not knowingly collect such data. If you believe we have done so inadvertently, please contact us for deletion.
              </p>
            </section>

            {/* 11. Third-party links */}
            <section>
              <h2 className="text-xl font-semibold mb-2">11. Third-Party Links</h2>
              <p>
                The Site may contain links to external sites. We are not responsible for their privacy practices. Please review their policies separately.
              </p>
            </section>

            {/* 12. Changes */}
            <section>
              <h2 className="text-xl font-semibold mb-2">12. Changes to This Policy</h2>
              <p>
                We may update this privacy policy from time to time. Any changes will be posted on this page with a new “Effective date.”
              </p>
            </section>

            {/* 13. Contact */}
            <section>
              <h2 className="text-xl font-semibold mb-2">13. Contact Us</h2>
              <p>
                For questions or concerns regarding this policy, please contact:
              </p>
              <p>
                <strong>Umar Siddiqui</strong><br />
                📧 <a href="mailto:siddiquiumar0007@gmail.com" className="text-sky-600 dark:text-sky-400 underline">siddiquiumar0007@gmail.com</a>
              </p>
            </section>
          </div>
        </div>
      </div>
    </main>
  );
}