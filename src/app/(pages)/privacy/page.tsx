import React from "react";

const H2 = "font-display text-xl font-bold text-foreground";
const P = "mt-3 text-sm leading-relaxed text-ink-soft";

export default function PrivacyPolicy() {
  return (
    <main className="relative overflow-x-clip pt-24 lg:pt-32">
      <div className="mx-auto max-w-3xl px-5 pb-24 sm:px-8 lg:px-12 lg:pb-32">
        <span className="label-mono text-ink-soft">Legal</span>
        <h1 className="display-lg mt-3 text-foreground">Privacy Policy</h1>
        <p className="mt-4 text-sm text-ink-soft">
          Effective date: <strong className="text-foreground">27 July 2025</strong>
        </p>

        <div className="mt-12 space-y-10">
          <section>
            <h2 className={H2}>1. Introduction</h2>
            <p className={P}>
              Welcome to <strong className="text-foreground">umar.is-a.dev</strong> (&ldquo;Site&rdquo;). I, Umar
              Siddiqui, respect your privacy and am committed to protecting any information you share
              while visiting this portfolio website.
            </p>
          </section>

          <section>
            <h2 className={H2}>2. Information we collect</h2>
            <ul className={`${P} list-disc space-y-2 pl-5`}>
              <li>
                <strong className="text-foreground">Voluntary contact data</strong>: name, e-mail
                address, phone number, only if you fill out the contact form or reach out directly.
              </li>
              <li>
                <strong className="text-foreground">Technical data</strong>: IP address, browser type,
                device identifiers, operating system, referring pages, and timestamps via server logs
                or analytics tools.
              </li>
              <li>
                <strong className="text-foreground">Cookies &amp; local storage</strong>: used for site
                functionality and anonymous analytics (Google Analytics, Vercel Analytics).
              </li>
            </ul>
          </section>

          <section>
            <h2 className={H2}>3. How we use information</h2>
            <ul className={`${P} list-disc space-y-2 pl-5`}>
              <li>To respond to your inquiries.</li>
              <li>To maintain, secure, and improve the Site.</li>
              <li>To understand traffic patterns via aggregated, non-identifiable analytics.</li>
            </ul>
          </section>

          <section>
            <h2 className={H2}>4. Legal basis for processing (EU/EEA users)</h2>
            <p className={P}>
              We process personal data under one of the following bases: consent (Art. 6(1)(a)),
              contract performance (Art. 6(1)(b)), or legitimate interests (Art. 6(1)(f)) such as
              improving the Site.
            </p>
          </section>

          <section>
            <h2 className={H2}>5. Data sharing</h2>
            <p className={P}>
              We do <strong className="text-foreground">not</strong> sell, rent, or trade your personal
              data. We may share information with service providers (e.g. hosting or analytics) who
              process data solely on our behalf under confidentiality obligations.
            </p>
          </section>

          <section>
            <h2 className={H2}>6. International transfers</h2>
            <p className={P}>
              If you access the Site from outside the United States, your information may be
              transferred to and processed on servers located in the U.S. or other jurisdictions that
              may have different data-protection laws. We rely on Standard Contractual Clauses or
              other approved safeguards where required.
            </p>
          </section>

          <section>
            <h2 className={H2}>7. Security measures</h2>
            <p className={P}>
              We implement technical and organizational measures (HTTPS, secure hosting, limited
              access) to protect your data against unauthorized access, alteration, disclosure, or
              destruction.
            </p>
          </section>

          <section>
            <h2 className={H2}>8. Data retention</h2>
            <p className={P}>
              Personal data is retained only as long as necessary for the purposes outlined above or
              to comply with legal obligations. Analytics data is automatically purged after{" "}
              <strong className="text-foreground">26 months</strong>.
            </p>
          </section>

          <section>
            <h2 className={H2}>9. Your rights (GDPR / CCPA)</h2>
            <ul className={`${P} list-disc space-y-2 pl-5`}>
              <li>Access, rectify, or delete your personal data.</li>
              <li>Restrict or object to processing.</li>
              <li>Data portability.</li>
              <li>Withdraw consent at any time (will not affect prior processing).</li>
            </ul>
            <p className={P}>
              To exercise these rights, email{" "}
              <a href="mailto:siddiquiumar0007@gmail.com" className="text-signal underline underline-offset-4">
                siddiquiumar0007@gmail.com
              </a>
              .
            </p>
          </section>

          <section>
            <h2 className={H2}>10. Children&rsquo;s privacy</h2>
            <p className={P}>
              The Site is not directed to children under 13 (or 16 in the EEA). We do not knowingly
              collect such data. If you believe we have done so inadvertently, please contact us for
              deletion.
            </p>
          </section>

          <section>
            <h2 className={H2}>11. Third-party links</h2>
            <p className={P}>
              The Site may contain links to external sites. We are not responsible for their privacy
              practices. Please review their policies separately.
            </p>
          </section>

          <section>
            <h2 className={H2}>12. Changes to this policy</h2>
            <p className={P}>
              We may update this privacy policy from time to time. Any changes will be posted on this
              page with a new &ldquo;Effective date.&rdquo;
            </p>
          </section>

          <section>
            <h2 className={H2}>13. Contact us</h2>
            <p className={P}>
              For questions or concerns regarding this policy, please contact:
            </p>
            <p className={`${P} text-foreground`}>
              <strong>Umar Siddiqui</strong>
              <br />
              <a href="mailto:siddiquiumar0007@gmail.com" className="text-signal underline underline-offset-4">
                siddiquiumar0007@gmail.com
              </a>
            </p>
          </section>
        </div>
      </div>
    </main>
  );
}
