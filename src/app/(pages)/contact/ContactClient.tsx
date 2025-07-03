"use client";

import React, { useState } from "react";
import { user } from "@/providers/user";

interface FormData {
  firstName: string;
  lastName: string;
  email: string;
  subject: string;
  message: string;
}

interface FormErrors {
  firstName?: string;
  lastName?: string;
  email?: string;
  subject?: string;
  message?: string;
}

const Contact = () => {
  const email: string = user.email;
  const address: string = user.location.address;

  const [formData, setFormData] = useState<FormData>({
    firstName: "",
    lastName: "",
    email: "",
    subject: "",
    message: "",
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<
    "idle" | "success" | "error"
  >("idle");
  const [submitMessage, setSubmitMessage] = useState("");

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.firstName.trim()) {
      newErrors.firstName = "First name is required";
    }

    if (!formData.lastName.trim()) {
      newErrors.lastName = "Last name is required";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    if (!formData.subject.trim()) {
      newErrors.subject = "Subject is required";
    }

    if (!formData.message.trim()) {
      newErrors.message = "Message is required";
    } else if (formData.message.trim().length < 10) {
      newErrors.message = "Message must be at least 10 characters long";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Clear error when user starts typing
    if (errors[name as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    setSubmitStatus("idle");

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (response.ok && result.success) {
        setSubmitStatus("success");
        setSubmitMessage(
          result.message ||
            "Thank you! Your message has been sent successfully."
        );
        setFormData({
          firstName: "",
          lastName: "",
          email: "",
          subject: "",
          message: "",
        });
      } else {
        setSubmitStatus("error");
        setSubmitMessage(
          result.error || "Something went wrong. Please try again."
        );
      }
    } catch (error) {
      console.error("Form submission error:", error);
      setSubmitStatus("error");
      setSubmitMessage(
        "Network error. Please check your connection and try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <main className="relative min-h-screen z-10 pt-24">
        <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
          <div className="bg-gradient-to-br from-white/80 via-neutral-50/60 to-white/70 dark:from-neutral-800/80 dark:via-neutral-900/60 dark:to-transparent backdrop-blur-xl border border-neutral-200/50 dark:border-neutral-700/50 rounded-3xl shadow-2xl shadow-neutral-200/20 dark:shadow-neutral-900/40 min-h-[calc(100vh-12rem)]">
            <div className="p-8 lg:p-12">
              {/* Header Section */}
              <div className="text-center mb-12">
                <h1 className="text-4xl md:text-5xl font-bold text-neutral-900 dark:text-white mb-4">
                  {user.contact.formTitle}
                </h1>
                <p className="text-lg text-neutral-600 dark:text-neutral-400 max-w-2xl mx-auto">
                  {user.contact.formSubtitle}
                </p>
              </div>

              <div className="grid lg:grid-cols-2 gap-12">
                {/* Contact Information */}
                <div className="order-2 lg:order-1">
                  <div className="mb-8">
                    <h2 className="text-xl font-medium text-neutral-900 dark:text-white mb-2">
                      Get in touch
                    </h2>
                    <p className="text-sm text-neutral-500 dark:text-neutral-400">
                      Let&apos;s discuss your next project
                    </p>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center space-x-3 text-sm">
                      <div className="w-5 h-5 text-amber-500 dark:text-amber-400 flex-shrink-0">
                        <svg
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                          />
                        </svg>
                      </div>
                      <span className="text-neutral-700 dark:text-neutral-300">
                        {email}
                      </span>
                    </div>

                    <div className="flex items-center space-x-3 text-sm">
                      <div className="w-5 h-5 text-amber-500 dark:text-amber-400 flex-shrink-0">
                        <svg
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                          />
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                          />
                        </svg>
                      </div>
                      <span className="text-neutral-700 dark:text-neutral-300">
                        {address}
                      </span>
                    </div>

                    <div className="flex items-center space-x-3 text-sm">
                      <div className="w-5 h-5 text-amber-500 dark:text-amber-400 flex-shrink-0">
                        <svg
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>
                      </div>
                      <span className="text-neutral-700 dark:text-neutral-300">
                        24-48h response
                      </span>
                    </div>
                  </div>

                  <div className="mt-8 p-4 bg-neutral-50/50 dark:bg-neutral-800/30 rounded-lg border border-neutral-200/30 dark:border-neutral-700/30">
                    <p className="text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed">
                      {user.homepage.availability.showStatus && user.homepage.availability.status}
                      <span className="text-amber-600 dark:text-amber-400 font-medium">
                        {" "}
                        Let&apos;s build something great together.
                      </span>
                    </p>
                  </div>
                </div>

                {/* Contact Form */}
                <div className="order-1 lg:order-2">
                  <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Status Messages */}
                    {submitStatus === "success" && (
                      <div className="p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg text-sm text-green-800 dark:text-green-300">
                        {submitMessage}
                      </div>
                    )}

                    {submitStatus === "error" && (
                      <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-sm text-red-800 dark:text-red-300">
                        {submitMessage}
                      </div>
                    )}

                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <input
                          type="text"
                          name="firstName"
                          value={formData.firstName}
                          onChange={handleInputChange}
                          className={`w-full px-4 py-3 bg-white/60 dark:bg-neutral-800/60 border rounded-lg focus:outline-none focus:ring-1 focus:ring-amber-500 focus:border-amber-500 transition-all duration-200 text-sm text-neutral-900 dark:text-white placeholder-neutral-500 dark:placeholder-neutral-400 ${
                            errors.firstName
                              ? "border-red-300 dark:border-red-700"
                              : "border-neutral-200 dark:border-neutral-700"
                          }`}
                          placeholder={`${user.contact.formFields.name.label} ${user.contact.formFields.name.required ? '*' : ''}`}
                          disabled={isSubmitting}
                        />
                        {errors.firstName && (
                          <p className="mt-1 text-xs text-red-600 dark:text-red-400 pl-1">
                            {errors.firstName}
                          </p>
                        )}
                      </div>
                      <div>
                        <input
                          type="text"
                          name="lastName"
                          value={formData.lastName}
                          onChange={handleInputChange}
                          className={`w-full px-4 py-3 bg-white/60 dark:bg-neutral-800/60 border rounded-lg focus:outline-none focus:ring-1 focus:ring-amber-500 focus:border-amber-500 transition-all duration-200 text-sm text-neutral-900 dark:text-white placeholder-neutral-500 dark:placeholder-neutral-400 ${
                            errors.lastName
                              ? "border-red-300 dark:border-red-700"
                              : "border-neutral-200 dark:border-neutral-700"
                          }`}
                          placeholder="Last name *"
                          disabled={isSubmitting}
                        />
                        {errors.lastName && (
                          <p className="mt-1 text-xs text-red-600 dark:text-red-400 pl-1">
                            {errors.lastName}
                          </p>
                        )}
                      </div>
                    </div>

                    <div>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        className={`w-full px-4 py-3 bg-white/60 dark:bg-neutral-800/60 border rounded-lg focus:outline-none focus:ring-1 focus:ring-amber-500 focus:border-amber-500 transition-all duration-200 text-sm text-neutral-900 dark:text-white placeholder-neutral-500 dark:placeholder-neutral-400 ${
                          errors.email
                            ? "border-red-300 dark:border-red-700"
                            : "border-neutral-200 dark:border-neutral-700"
                        }`}
                        placeholder={`${user.contact.formFields.email.placeholder} ${user.contact.formFields.email.required ? '*' : ''}`}
                        disabled={isSubmitting}
                      />
                      {errors.email && (
                        <p className="mt-1 text-xs text-red-600 dark:text-red-400 pl-1">
                          {errors.email}
                        </p>
                      )}
                    </div>

                    <div>
                      <input
                        type="text"
                        name="subject"
                        value={formData.subject}
                        onChange={handleInputChange}
                        className={`w-full px-4 py-3 bg-white/60 dark:bg-neutral-800/60 border rounded-lg focus:outline-none focus:ring-1 focus:ring-amber-500 focus:border-amber-500 transition-all duration-200 text-sm text-neutral-900 dark:text-white placeholder-neutral-500 dark:placeholder-neutral-400 ${
                          errors.subject
                            ? "border-red-300 dark:border-red-700"
                            : "border-neutral-200 dark:border-neutral-700"
                        }`}
                        placeholder="Subject *"
                        disabled={isSubmitting}
                      />
                      {errors.subject && (
                        <p className="mt-1 text-xs text-red-600 dark:text-red-400 pl-1">
                          {errors.subject}
                        </p>
                      )}
                    </div>

                    <div>
                      <textarea
                        name="message"
                        value={formData.message}
                        onChange={handleInputChange}
                        rows={5}
                        className={`w-full px-4 py-3 bg-white/60 dark:bg-neutral-800/60 border rounded-lg focus:outline-none focus:ring-1 focus:ring-amber-500 focus:border-amber-500 transition-all duration-200 resize-none text-sm text-neutral-900 dark:text-white placeholder-neutral-500 dark:placeholder-neutral-400 ${
                          errors.message
                            ? "border-red-300 dark:border-red-700"
                            : "border-neutral-200 dark:border-neutral-700"
                        }`}
                        placeholder="Tell me about your project... *"
                        disabled={isSubmitting}
                      />
                      {errors.message && (
                        <p className="mt-1 text-xs text-red-600 dark:text-red-400 pl-1">
                          {errors.message}
                        </p>
                      )}
                    </div>

                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full bg-amber-500 hover:bg-amber-600 disabled:bg-amber-400/50 text-white px-6 py-3 rounded-lg font-medium text-sm transition-all duration-200 disabled:cursor-not-allowed flex items-center justify-center"
                    >
                      {isSubmitting ? (
                        <>
                          <svg
                            className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                          >
                            <circle
                              className="opacity-25"
                              cx="12"
                              cy="12"
                              r="10"
                              stroke="currentColor"
                              strokeWidth="4"
                            ></circle>
                            <path
                              className="opacity-75"
                              fill="currentColor"
                              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                            ></path>
                          </svg>
                          Sending...
                        </>
                      ) : (
                        user.contact.submitButtonText
                      )}
                    </button>

                    <p className="text-xs text-neutral-500 dark:text-neutral-400 text-center">
                      * Required fields
                    </p>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
};

export default Contact;
