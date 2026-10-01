"use client";

import React, { useState } from "react";
import { Mail, MapPin } from "lucide-react";
import { user } from "@/providers/user";
import Reveal from "@/components/motion/Reveal";

interface FormData {
  firstName: string;
  lastName: string;
  email: string;
  subject: string;
  message: string;
}

type FormErrors = Partial<Record<keyof FormData, string>>;

const fieldClass =
  "w-full border border-hairline bg-transparent px-4 py-3 text-base text-foreground placeholder:text-ink-soft focus:border-signal focus:outline-none";

export default function ContactClient() {
  const [formData, setFormData] = useState<FormData>({
    firstName: "",
    lastName: "",
    email: "",
    subject: "",
    message: "",
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const [statusMessage, setStatusMessage] = useState("");

  const validate = (): boolean => {
    const next: FormErrors = {};
    if (!formData.firstName.trim()) next.firstName = "First name is required.";
    if (!formData.lastName.trim()) next.lastName = "Last name is required.";
    if (!formData.email.trim()) next.email = "Email is required.";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email))
      next.email = "Enter a valid email address.";
    if (!formData.subject.trim()) next.subject = "Subject is required.";
    if (!formData.message.trim()) next.message = "Message is required.";
    else if (formData.message.trim().length < 10)
      next.message = "Message must be at least 10 characters.";
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name as keyof FormData]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    setStatus("idle");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const result = await res.json();
      if (res.ok && result.success) {
        setStatus("success");
        setStatusMessage(result.message || "Thanks. Your message has been sent.");
        setFormData({ firstName: "", lastName: "", email: "", subject: "", message: "" });
      } else {
        setStatus("error");
        setStatusMessage(result.error || "Something went wrong. Please try again.");
      }
    } catch {
      setStatus("error");
      setStatusMessage("Network error. Please check your connection and try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="relative overflow-x-clip pt-24 lg:pt-32">
      <div className="mx-auto max-w-[110rem] px-5 pb-24 sm:px-8 lg:px-12 lg:pb-32">
        <span className="label-mono text-ink-soft">Contact — Say hello</span>
        <h1 className="display-xl mt-3 max-w-[16ch] text-foreground">
          {user.contact.formTitle}
        </h1>
        <p className="mt-6 max-w-xl text-lg text-ink-soft">{user.contact.formSubtitle}</p>

        <div className="mt-16 grid gap-16 lg:grid-cols-[1fr_1.1fr]">
          <Reveal self>
            <h2 className="label-mono border-b border-hairline pb-3 text-ink-soft">
              Direct
            </h2>
            <ul className="mt-6 space-y-5 text-sm">
              <li className="flex items-start gap-3">
                <Mail className="mt-0.5 h-4 w-4 shrink-0 text-signal" aria-hidden="true" />
                <a
                  href={`mailto:${user.email}`}
                  className="break-all transition-colors hover:text-signal"
                >
                  {user.email}
                </a>
              </li>
              <li className="flex items-start gap-3">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-signal" aria-hidden="true" />
                <span className="text-ink-soft">
                  {user.location.city}, {user.location.region}, {user.location.country}
                </span>
              </li>
            </ul>

            <p className="mt-10 max-w-sm text-sm leading-relaxed text-ink-soft">
              {user.homepage.availability.status}. {user.homepage.tagline}
            </p>
          </Reveal>

          <Reveal self>
            <form onSubmit={handleSubmit} className="space-y-6" noValidate>
              {status !== "idle" && (
                <div
                  role="status"
                  className={`border px-4 py-3 text-sm ${
                    status === "success"
                      ? "border-signal/40 bg-signal/5 text-foreground"
                      : "border-destructive/40 bg-destructive/5 text-destructive"
                  }`}
                >
                  {statusMessage}
                </div>
              )}

              <div className="grid gap-6 sm:grid-cols-2">
                <div>
                  <label htmlFor="firstName" className="label-mono mb-2 block text-ink-soft">
                    First name <span className="text-signal">*</span>
                  </label>
                  <input
                    id="firstName"
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    autoComplete="given-name"
                    aria-invalid={!!errors.firstName}
                    aria-describedby={errors.firstName ? "firstName-error" : undefined}
                    className={fieldClass}
                    disabled={isSubmitting}
                  />
                  {errors.firstName && (
                    <p id="firstName-error" className="mt-2 text-xs text-destructive">
                      {errors.firstName}
                    </p>
                  )}
                </div>

                <div>
                  <label htmlFor="lastName" className="label-mono mb-2 block text-ink-soft">
                    Last name <span className="text-signal">*</span>
                  </label>
                  <input
                    id="lastName"
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    autoComplete="family-name"
                    aria-invalid={!!errors.lastName}
                    aria-describedby={errors.lastName ? "lastName-error" : undefined}
                    className={fieldClass}
                    disabled={isSubmitting}
                  />
                  {errors.lastName && (
                    <p id="lastName-error" className="mt-2 text-xs text-destructive">
                      {errors.lastName}
                    </p>
                  )}
                </div>
              </div>

              <div>
                <label htmlFor="email" className="label-mono mb-2 block text-ink-soft">
                  Email <span className="text-signal">*</span>
                </label>
                <input
                  id="email"
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  autoComplete="email"
                  placeholder="you@example.com"
                  aria-invalid={!!errors.email}
                  aria-describedby={errors.email ? "email-error" : undefined}
                  className={fieldClass}
                  disabled={isSubmitting}
                />
                {errors.email && (
                  <p id="email-error" className="mt-2 text-xs text-destructive">
                    {errors.email}
                  </p>
                )}
              </div>

              <div>
                <label htmlFor="subject" className="label-mono mb-2 block text-ink-soft">
                  Subject <span className="text-signal">*</span>
                </label>
                <input
                  id="subject"
                  type="text"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  aria-invalid={!!errors.subject}
                  aria-describedby={errors.subject ? "subject-error" : undefined}
                  className={fieldClass}
                  disabled={isSubmitting}
                />
                {errors.subject && (
                  <p id="subject-error" className="mt-2 text-xs text-destructive">
                    {errors.subject}
                  </p>
                )}
              </div>

              <div>
                <label htmlFor="message" className="label-mono mb-2 block text-ink-soft">
                  Message <span className="text-signal">*</span>
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  rows={6}
                  placeholder="Tell me about your project…"
                  aria-invalid={!!errors.message}
                  aria-describedby={errors.message ? "message-error" : undefined}
                  className={`${fieldClass} resize-none`}
                  disabled={isSubmitting}
                />
                {errors.message && (
                  <p id="message-error" className="mt-2 text-xs text-destructive">
                    {errors.message}
                  </p>
                )}
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="inline-flex h-14 items-center rounded-full bg-signal px-8 text-sm font-medium text-signal-ink transition-colors hover:bg-foreground hover:text-background disabled:opacity-50"
              >
                {isSubmitting ? "Sending…" : user.contact.submitButtonText}
              </button>
            </form>
          </Reveal>
        </div>
      </div>
    </main>
  );
}
