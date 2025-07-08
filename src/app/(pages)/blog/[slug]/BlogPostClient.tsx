"use client";

import React from "react";
import { BlogPost } from "@/types/blog";
import { BlogTemplate } from "@/templates/Blog";
import Image from "next/image";
import Link from "next/link";
import CommentSection from "@/components/CommentSection";
import MarkdownRenderer from "@/components/MarkdownRenderer";
import BlogTTS from "@/components/BlogTTS";

interface BlogPostClientProps {
  post: BlogPost;
  slug: string;
}

const BlogPostClient = ({ post, slug }: BlogPostClientProps) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <BlogTemplate>
      {/* Skip to content link for accessibility */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 bg-amber-500 text-white px-4 py-2 rounded-lg font-medium shadow-lg transition-all duration-200"
      >
        Skip to main content
      </a>

      <div className="max-w-4xl mx-auto">
        {/* Enhanced Back Button */}
        <div className="mb-6 sm:mb-8">
          <Link
            href="/blog"
            className="group inline-flex items-center text-neutral-600 dark:text-neutral-400 hover:text-amber-600 dark:hover:text-amber-400 transition-all duration-200 text-sm font-medium bg-white/50 dark:bg-neutral-800/50 backdrop-blur-sm border border-neutral-200/50 dark:border-neutral-700/50 rounded-lg px-4 py-2.5 hover:bg-amber-50/50 dark:hover:bg-amber-900/20 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
            aria-label="Go back to blog list"
          >
            <svg
              className="w-4 h-4 mr-2 transition-transform group-hover:-translate-x-1"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M15 19l-7-7 7-7"
              />
            </svg>
            Back to Blog
          </Link>
        </div>

        {/* Enhanced Post Header */}
        <header className="mb-10 sm:mb-12" id="main-content">
          {/* Category with enhanced styling */}
          {post.category && (
            <div className="mb-4 sm:mb-6">
              <span className="inline-flex items-center bg-gradient-to-r from-amber-500/10 to-amber-600/10 border border-amber-200/50 dark:border-amber-700/50 text-amber-700 dark:text-amber-300 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-bold shadow-lg shadow-amber-500/10">
                <span
                  className="w-2 h-2 bg-amber-500 rounded-full mr-2"
                  aria-hidden="true"
                ></span>
                {post.category}
              </span>
            </div>
          )}

          {/* Enhanced Title */}
          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold bg-gradient-to-r from-neutral-900 via-neutral-800 to-neutral-900 dark:from-white dark:via-neutral-100 dark:to-white bg-clip-text text-transparent mb-4 sm:mb-6 leading-tight">
            {post.title}
          </h1>

          {/* Enhanced Excerpt */}
          <p className="text-base sm:text-lg md:text-xl text-neutral-600 dark:text-neutral-400 leading-relaxed mb-6 sm:mb-8 font-medium">
            {post.excerpt}
          </p>

          {/* Enhanced Meta Information */}
          <div className="flex flex-wrap items-center gap-4 sm:gap-6 text-sm text-neutral-500 dark:text-neutral-400 mb-6 sm:mb-8 p-4 sm:p-6 bg-neutral-50/50 dark:bg-neutral-800/30 backdrop-blur-sm border border-neutral-200/50 dark:border-neutral-700/50 rounded-xl sm:rounded-2xl">
            <div className="flex items-center space-x-3">
              <div className="w-8 sm:w-10 h-8 sm:h-10 bg-gradient-to-br from-amber-400 to-amber-600 rounded-full flex items-center justify-center shadow-lg">
                <span className="text-white font-bold text-xs sm:text-sm">
                  {post.author.charAt(0).toUpperCase()}
                </span>
              </div>
              <div>
                <span className="font-semibold text-neutral-700 dark:text-neutral-300 text-sm sm:text-base">
                  {post.author}
                </span>
                <p className="text-xs text-neutral-500 dark:text-neutral-400">
                  Author
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-1">
              <svg
                className="w-4 h-4 text-amber-500 flex-shrink-0"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
              <span className="font-medium text-xs sm:text-sm">
                {formatDate(post.createdAt.toString())}
              </span>
            </div>
            {post.readTime && (
              <div className="flex items-center space-x-1">
                <svg
                  className="w-4 h-4 text-amber-500 flex-shrink-0"
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
                <span className="font-medium text-xs sm:text-sm">
                  {post.readTime} min read
                </span>
              </div>
            )}
          </div>
        </header>

        {/* Enhanced Featured Image */}
        {post.featuredImage && (
          <div className="mb-12">
            <div className="relative h-64 md:h-96 lg:h-[500px] rounded-3xl overflow-hidden shadow-2xl shadow-neutral-200/50 dark:shadow-neutral-900/50 group">
              <Image
                src={post.featuredImage}
                alt={`Featured image for ${post.title}`}
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 1200px"
                priority
                className="object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent"></div>
            </div>
          </div>
        )}
        {/* Text-to-Speech Player - More Visible */}
        <div className="mb-8">
          <BlogTTS
            content={post.content}
            title={post.title}
            excerpt={post.excerpt}
          />
        </div>

        {/* Enhanced Post Content */}
        <article
          className="max-w-none"
          role="main"
          aria-label="Blog post content"
        >
          <MarkdownRenderer content={post.content} />
        </article>

        {/* Enhanced Post Footer */}
        <footer className="mt-12 sm:mt-16 pt-8 sm:pt-10 border-t-2 border-gradient-to-r border-neutral-200/50 dark:border-neutral-700/50">
          <div className="bg-gradient-to-br from-neutral-50/80 via-white/50 to-neutral-50/80 dark:from-neutral-800/50 dark:via-neutral-900/30 dark:to-neutral-800/50 backdrop-blur-xl border border-neutral-200/50 dark:border-neutral-700/50 rounded-2xl sm:rounded-3xl p-6 sm:p-8 shadow-lg shadow-neutral-200/20 dark:shadow-neutral-900/20">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 sm:gap-8">
              <div className="flex items-center space-x-4 sm:space-x-6">
                <div className="w-12 sm:w-16 h-12 sm:h-16 bg-gradient-to-br from-amber-400 to-amber-600 rounded-xl sm:rounded-2xl flex items-center justify-center shadow-lg shadow-amber-500/25 flex-shrink-0">
                  <span className="text-white font-bold text-lg sm:text-xl">
                    {post.author.charAt(0).toUpperCase()}
                  </span>
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className="text-lg sm:text-xl font-bold text-neutral-900 dark:text-white truncate">
                    {post.author}
                  </h3>
                  <p className="text-neutral-600 dark:text-neutral-400 font-medium text-sm sm:text-base">
                    Full-Stack Developer & Tech Enthusiast
                  </p>
                  <p className="text-xs sm:text-sm text-neutral-500 dark:text-neutral-500 mt-1">
                    Sharing insights about web development and technology
                  </p>
                </div>
              </div>

              {/* Enhanced Social Share Buttons */}
              <div
                className="flex flex-wrap items-center gap-2 sm:gap-3"
                role="group"
                aria-label="Social sharing options"
              >
                <span className="text-xs sm:text-sm font-medium text-neutral-600 dark:text-neutral-400 mr-1 sm:mr-2 w-full sm:w-auto mb-2 sm:mb-0">
                  Share:
                </span>
                <button
                  onClick={() =>
                    window.open(
                      `https://twitter.com/intent/tweet?text=${encodeURIComponent(
                        post.title
                      )}&url=${encodeURIComponent(window.location.href)}`,
                      "_blank"
                    )
                  }
                  className="group p-3 bg-blue-500/10 hover:bg-blue-500 border border-blue-200/50 dark:border-blue-700/50 hover:border-blue-500 rounded-xl transition-all duration-200 hover:shadow-lg hover:shadow-blue-500/25 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                  aria-label="Share on Twitter"
                  title="Share on Twitter"
                >
                  <svg
                    className="w-5 h-5 text-blue-600 group-hover:text-white transition-colors"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" />
                  </svg>
                </button>
                <button
                  onClick={() =>
                    window.open(
                      `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
                        window.location.href
                      )}`,
                      "_blank"
                    )
                  }
                  className="group p-3 bg-blue-600/10 hover:bg-blue-600 border border-blue-300/50 dark:border-blue-600/50 hover:border-blue-600 rounded-xl transition-all duration-200 hover:shadow-lg hover:shadow-blue-600/25 focus:outline-none focus:ring-2 focus:ring-blue-600/20"
                  aria-label="Share on Facebook"
                  title="Share on Facebook"
                >
                  <svg
                    className="w-5 h-5 text-blue-700 group-hover:text-white transition-colors"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path d="M18.77 7.46H14.5v-1.9c0-.9.6-1.1 1-1.1h3V.5h-4.33C10.24.5 9.5 3.44 9.5 5.32v2.15h-3v4h3v12h5v-12h3.85l.42-4z" />
                  </svg>
                </button>
                <button
                  onClick={() =>
                    window.open(
                      `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(
                        window.location.href
                      )}`,
                      "_blank"
                    )
                  }
                  className="group p-3 bg-blue-700/10 hover:bg-blue-700 border border-blue-400/50 dark:border-blue-600/50 hover:border-blue-700 rounded-xl transition-all duration-200 hover:shadow-lg hover:shadow-blue-700/25 focus:outline-none focus:ring-2 focus:ring-blue-700/20"
                  aria-label="Share on LinkedIn"
                  title="Share on LinkedIn"
                >
                  <svg
                    className="w-5 h-5 text-blue-800 group-hover:text-white transition-colors"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                  </svg>
                </button>
                <button
                  onClick={async () => {
                    try {
                      await navigator.clipboard.writeText(window.location.href);
                      // Show feedback to user
                      const button =
                        document.activeElement as HTMLButtonElement;
                      const originalContent = button.innerHTML;
                      button.innerHTML =
                        '<svg class="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg>';
                      setTimeout(() => {
                        button.innerHTML = originalContent;
                      }, 2000);
                    } catch (err) {
                      console.error("Failed to copy link:", err);
                    }
                  }}
                  className="group p-3 bg-neutral-500/10 hover:bg-neutral-500 border border-neutral-300/50 dark:border-neutral-600/50 hover:border-neutral-500 rounded-xl transition-all duration-200 hover:shadow-lg hover:shadow-neutral-500/25 focus:outline-none focus:ring-2 focus:ring-neutral-500/20"
                  aria-label="Copy link to this post"
                  title="Copy link"
                >
                  <svg
                    className="w-5 h-5 text-neutral-600 group-hover:text-white transition-colors"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                    />
                  </svg>
                </button>
              </div>
            </div>

            {/* Reading Progress Indicator */}
            <div className="mt-6 sm:mt-8 pt-4 sm:pt-6 border-t border-neutral-200/30 dark:border-neutral-700/30">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-3 text-xs sm:text-sm text-neutral-500 dark:text-neutral-400">
                <span className="flex items-center gap-2">
                  <span className="text-base sm:text-lg" aria-hidden="true">
                    📚
                  </span>
                  Thanks for reading!
                </span>
                <div className="flex items-center space-x-2">
                  <span>Found this helpful?</span>
                  <button
                    className="text-amber-600 dark:text-amber-400 hover:text-amber-700 dark:hover:text-amber-300 font-medium transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-amber-500/20 rounded px-1"
                    onClick={() => {
                      // Scroll to share buttons
                      const shareButtons = document.querySelector(
                        '[role="group"][aria-label="Social sharing options"]'
                      );
                      shareButtons?.scrollIntoView({
                        behavior: "smooth",
                        block: "center",
                      });
                    }}
                  >
                    Share it!
                  </button>
                </div>
              </div>
            </div>
          </div>
        </footer>

        {/* Enhanced Comment Section */}
        <div className="mt-12 sm:mt-16">
          <div className="bg-gradient-to-br from-neutral-50/80 via-white/50 to-neutral-50/80 dark:from-neutral-800/50 dark:via-neutral-900/30 dark:to-neutral-800/50 backdrop-blur-xl border border-neutral-200/50 dark:border-neutral-700/50 rounded-2xl sm:rounded-3xl p-6 sm:p-8 shadow-lg shadow-neutral-200/20 dark:shadow-neutral-900/20">
            <div className="mb-6">
              <h3 className="text-xl sm:text-2xl font-bold text-neutral-900 dark:text-white mb-2">
                Join the Discussion
              </h3>
              <p className="text-neutral-600 dark:text-neutral-400 text-sm sm:text-base">
                Share your thoughts and engage with other readers
              </p>
            </div>
            <CommentSection
              postSlug={slug}
              commentsEnabled={post.commentsEnabled !== false}
            />
          </div>
        </div>
      </div>
    </BlogTemplate>
  );
};

export default BlogPostClient;
