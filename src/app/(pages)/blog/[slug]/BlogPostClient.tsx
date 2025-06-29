'use client';

import React from "react";
import { BlogPost } from "@/types/blog";
import { BlogTemplate } from "@/templates/Blog";
import Image from "next/image";
import Link from "next/link";
import CommentSection from "@/components/CommentSection";

interface Props {
  post: BlogPost;
}

const BlogPostClient = ({ post }: Props) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
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
            <svg className="w-4 h-4 mr-2 transition-transform group-hover:-translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
            </svg>
            Back to Blog
          </Link>
        </div>

        {/* Enhanced Article Header */}
        <header className="mb-8 sm:mb-12" id="main-content">
          {/* Category Badge */}
          {post.category && (
            <div className="mb-4 sm:mb-6">
              <span className="inline-flex items-center bg-amber-100/80 dark:bg-amber-900/30 text-amber-800 dark:text-amber-300 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-bold uppercase tracking-wider border border-amber-200/50 dark:border-amber-700/50 shadow-sm">
                <span className="w-2 h-2 bg-amber-500 rounded-full mr-2 animate-pulse" aria-hidden="true"></span>
                {post.category}
              </span>
            </div>
          )}

          {/* Enhanced Title */}
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-neutral-900 dark:text-white mb-4 sm:mb-6 leading-tight">
            {post.title}
          </h1>

          {/* Enhanced Meta Information */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-6 text-sm text-neutral-600 dark:text-neutral-400 mb-6 sm:mb-8">
            <div className="flex items-center space-x-3">
              <div className="w-8 sm:w-10 h-8 sm:h-10 bg-gradient-to-br from-amber-400 to-amber-600 rounded-full flex items-center justify-center shadow-lg flex-shrink-0">
                <span className="text-white font-bold text-sm sm:text-base">
                  {post.author.charAt(0).toUpperCase()}
                </span>
              </div>
              <div>
                <p className="font-medium text-neutral-800 dark:text-neutral-200 text-sm sm:text-base">
                  {post.author}
                </p>
                <p className="text-xs sm:text-sm text-neutral-500 dark:text-neutral-500">
                  Full-Stack Developer
                </p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4 sm:space-x-6 text-xs sm:text-sm">
              <time 
                dateTime={post.createdAt.toString()} 
                className="flex items-center space-x-1 font-medium"
                aria-label={`Published on ${formatDate(post.createdAt.toString())}`}
              >
                <svg className="w-4 h-4 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <span>{formatDate(post.createdAt.toString())}</span>
              </time>
              
              {post.readTime && (
                <span className="flex items-center space-x-1" aria-label={`${post.readTime} minute read`}>
                  <svg className="w-4 h-4 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>{post.readTime} min read</span>
                </span>
              )}

              {post.commentCount !== undefined && (
                <span className="flex items-center space-x-1" aria-label={`${post.commentCount} comments`}>
                  <svg className="w-4 h-4 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                  <span>{post.commentCount} comments</span>
                </span>
              )}
            </div>
          </div>

          {/* Enhanced Tags */}
          {post.tags && post.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-6 sm:mb-8" role="list" aria-label="Article tags">
              {post.tags.map((tag, index) => (
                <span
                  key={index}
                  className="inline-flex items-center bg-neutral-100/80 dark:bg-neutral-700/50 text-neutral-600 dark:text-neutral-300 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-medium hover:bg-amber-100 dark:hover:bg-amber-900/30 hover:text-amber-700 dark:hover:text-amber-300 transition-all duration-200 border border-neutral-200/50 dark:border-neutral-600/50 cursor-pointer focus:outline-none focus:ring-2 focus:ring-amber-500/20"
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      // Handle tag click functionality here if needed
                      e.preventDefault();
                    }
                  }}
                >
                  <span className="text-amber-500 mr-1" aria-hidden="true">#</span>
                  {tag}
                </span>
              ))}
            </div>
          )}
        </header>

        {/* Enhanced Featured Image */}
        {post.featuredImage && (
          <div className="relative mb-8 sm:mb-12 rounded-2xl sm:rounded-3xl overflow-hidden shadow-2xl shadow-neutral-900/10 dark:shadow-neutral-900/40">
            <Image
              src={post.featuredImage}
              alt={`Featured image for "${post.title}"`}
              width={1200}
              height={600}
              className="w-full h-auto object-cover"
              priority
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 90vw, 1200px"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent pointer-events-none"></div>
          </div>
        )}

        {/* Enhanced Article Content */}
        <article 
          className="prose prose-lg dark:prose-invert max-w-none mb-12 sm:mb-16"
          itemScope 
          itemType="https://schema.org/BlogPosting"
        >
          {/* Hidden metadata for screen readers and SEO */}
          <meta itemProp="headline" content={post.title} />
          <meta itemProp="description" content={post.excerpt} />
          <meta itemProp="author" content={post.author} />
          <meta itemProp="datePublished" content={post.createdAt.toString()} />
          {post.updatedAt && <meta itemProp="dateModified" content={post.updatedAt.toString()} />}
          {post.featuredImage && <meta itemProp="image" content={post.featuredImage} />}

          <div 
            dangerouslySetInnerHTML={{ __html: post.content }}
            className="leading-relaxed text-neutral-700 dark:text-neutral-300 [&>h1]:text-3xl [&>h1]:font-bold [&>h1]:mt-12 [&>h1]:mb-6 [&>h1]:text-neutral-900 [&>h1]:dark:text-white [&>h2]:text-2xl [&>h2]:font-bold [&>h2]:mt-10 [&>h2]:mb-5 [&>h2]:text-neutral-900 [&>h2]:dark:text-white [&>h3]:text-xl [&>h3]:font-semibold [&>h3]:mt-8 [&>h3]:mb-4 [&>h3]:text-neutral-900 [&>h3]:dark:text-white [&>p]:mb-6 [&>p]:leading-relaxed [&>blockquote]:border-l-4 [&>blockquote]:border-amber-500 [&>blockquote]:pl-6 [&>blockquote]:py-4 [&>blockquote]:bg-amber-50/50 [&>blockquote]:dark:bg-amber-900/10 [&>blockquote]:rounded-r-lg [&>blockquote]:my-8 [&>blockquote]:italic [&>pre]:bg-neutral-900 [&>pre]:text-neutral-100 [&>pre]:p-6 [&>pre]:rounded-xl [&>pre]:overflow-x-auto [&>pre]:text-sm [&>pre]:leading-relaxed [&>code]:bg-neutral-100 [&>code]:dark:bg-neutral-800 [&>code]:px-2 [&>code]:py-1 [&>code]:rounded [&>code]:text-sm [&>code]:font-mono [&>ul]:space-y-2 [&>ol]:space-y-2 [&>li]:leading-relaxed [&>a]:text-amber-600 [&>a]:dark:text-amber-400 [&>a]:underline [&>a]:decoration-2 [&>a]:underline-offset-2 [&>a]:transition-colors [&>a]:hover:text-amber-700 [&>a]:dark:hover:text-amber-300"
          />
        </article>

        {/* Enhanced Footer with Author Info and Social Share */}
        <footer className="border-t border-neutral-200/50 dark:border-neutral-700/50 pt-8 sm:pt-12 mb-12 sm:mb-16">
          <div className="bg-gradient-to-br from-white/60 via-neutral-50/40 to-white/60 dark:from-neutral-800/60 dark:via-neutral-900/40 dark:to-neutral-800/60 backdrop-blur-xl border border-neutral-200/50 dark:border-neutral-700/50 rounded-2xl sm:rounded-3xl p-6 sm:p-8 shadow-xl shadow-neutral-200/20 dark:shadow-neutral-900/20">
            {/* Enhanced Author Card */}
            <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6 mb-6 sm:mb-8">
              <div className="w-12 sm:w-16 h-12 sm:h-16 bg-gradient-to-br from-amber-400 to-amber-600 rounded-xl sm:rounded-2xl flex items-center justify-center shadow-lg shadow-amber-500/25 flex-shrink-0">
                <span className="text-white font-bold text-lg sm:text-xl">
                  {post.author.charAt(0).toUpperCase()}
                </span>
              </div>
              <div className="min-w-0 flex-1">
                <h3 className="text-lg sm:text-xl font-bold text-neutral-900 dark:text-white truncate">{post.author}</h3>
                <p className="text-neutral-600 dark:text-neutral-400 font-medium text-sm sm:text-base">Full-Stack Developer & Tech Enthusiast</p>
                <p className="text-xs sm:text-sm text-neutral-500 dark:text-neutral-500 mt-1">Sharing insights about web development and technology</p>
              </div>
            </div>

            {/* Enhanced Social Share Buttons */}
            <div className="flex flex-wrap items-center gap-2 sm:gap-3" role="group" aria-label="Social sharing options">
              <span className="text-xs sm:text-sm font-medium text-neutral-600 dark:text-neutral-400 mr-1 sm:mr-2 w-full sm:w-auto mb-2 sm:mb-0">Share:</span>
              <button 
                onClick={() => window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(post.title)}&url=${encodeURIComponent(window.location.href)}`, '_blank')}
                className="group p-3 bg-blue-500/10 hover:bg-blue-500 border border-blue-200/50 dark:border-blue-700/50 hover:border-blue-500 rounded-xl transition-all duration-200 hover:shadow-lg hover:shadow-blue-500/25 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                aria-label="Share on Twitter"
                title="Share on Twitter"
              >
                <svg className="w-5 h-5 text-blue-600 group-hover:text-white transition-colors" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                </svg>
              </button>
              <button 
                onClick={() => window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`, '_blank')}
                className="group p-3 bg-blue-600/10 hover:bg-blue-600 border border-blue-300/50 dark:border-blue-600/50 hover:border-blue-600 rounded-xl transition-all duration-200 hover:shadow-lg hover:shadow-blue-600/25 focus:outline-none focus:ring-2 focus:ring-blue-600/20"
                aria-label="Share on Facebook"
                title="Share on Facebook"
              >
                <svg className="w-5 h-5 text-blue-700 group-hover:text-white transition-colors" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" />
                </svg>
              </button>
              <button 
                onClick={() => window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(window.location.href)}`, '_blank')}
                className="group p-3 bg-blue-700/10 hover:bg-blue-700 border border-blue-400/50 dark:border-blue-700/50 hover:border-blue-700 rounded-xl transition-all duration-200 hover:shadow-lg hover:shadow-blue-700/25 focus:outline-none focus:ring-2 focus:ring-blue-700/20"
                aria-label="Share on LinkedIn"
                title="Share on LinkedIn"
              >
                <svg className="w-5 h-5 text-blue-800 group-hover:text-white transition-colors" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path fillRule="evenodd" d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" clipRule="evenodd" />
                </svg>
              </button>
              <button 
                onClick={() => {
                  if (navigator.share) {
                    navigator.share({
                      title: post.title,
                      text: post.excerpt,
                      url: window.location.href,
                    });
                  } else {
                    // Fallback to copying URL
                    navigator.clipboard.writeText(window.location.href);
                    // You could show a toast notification here
                  }
                }}
                className="group p-3 bg-neutral-500/10 hover:bg-neutral-500 border border-neutral-300/50 dark:border-neutral-600/50 hover:border-neutral-500 rounded-xl transition-all duration-200 hover:shadow-lg hover:shadow-neutral-500/25 focus:outline-none focus:ring-2 focus:ring-neutral-500/20"
                aria-label="Copy link to this post"
                title="Copy link"
              >
                <svg className="w-5 h-5 text-neutral-600 group-hover:text-white transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
              </button>
            </div>

            {/* Reading Progress Indicator */}
            <div className="mt-6 sm:mt-8 pt-4 sm:pt-6 border-t border-neutral-200/30 dark:border-neutral-700/30">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-3 text-xs sm:text-sm text-neutral-500 dark:text-neutral-400">
                <span className="flex items-center gap-2">
                  <span className="text-base sm:text-lg" aria-hidden="true">📚</span>
                  Thanks for reading!
                </span>
                <div className="flex items-center space-x-2">
                  <span>Found this helpful?</span>
                  <button 
                    className="text-amber-600 dark:text-amber-400 hover:text-amber-700 dark:hover:text-amber-300 font-medium transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-amber-500/20 rounded px-1"
                    onClick={() => {
                      // Scroll to share buttons
                      const shareButtons = document.querySelector('[role="group"][aria-label="Social sharing options"]');
                      shareButtons?.scrollIntoView({ behavior: 'smooth', block: 'center' });
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
        <section className="bg-gradient-to-br from-white/40 via-neutral-50/30 to-white/40 dark:from-neutral-800/40 dark:via-neutral-900/30 dark:to-neutral-800/40 backdrop-blur-sm border border-neutral-200/30 dark:border-neutral-700/30 rounded-2xl sm:rounded-3xl p-6 sm:p-8 shadow-lg shadow-neutral-200/10 dark:shadow-neutral-900/20">
          <div className="flex items-center space-x-3 mb-6 sm:mb-8">
            <div className="w-8 sm:w-10 h-8 sm:h-10 bg-gradient-to-br from-amber-400 to-amber-600 rounded-xl flex items-center justify-center shadow-lg">
              <svg className="w-4 sm:w-5 h-4 sm:h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-neutral-900 dark:text-white">Join the Discussion</h2>
              <p className="text-sm sm:text-base text-neutral-600 dark:text-neutral-400">Share your thoughts and questions about this article</p>
            </div>
          </div>
          
          <CommentSection postSlug={post.slug} />
        </section>
      </div>
    </BlogTemplate>
  );
};

export default BlogPostClient;
