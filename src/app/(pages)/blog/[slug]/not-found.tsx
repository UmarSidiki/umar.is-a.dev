import React from 'react';
import Link from 'next/link';
import { BlogTemplate } from '@/templates/Blog';

export default function NotFound() {
  return (
    <BlogTemplate>
      <div className="flex flex-col items-center justify-center py-16">
        <div className="mb-8">
          <div className="relative inline-flex">
            <svg className="w-24 h-24 text-neutral-300 dark:text-neutral-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6-4h6m2 5.291A7.962 7.962 0 0118 12a8 8 0 00-16 0 7.962 7.962 0 011.678 4.291" />
            </svg>
            <div className="absolute -top-2 -right-2 w-8 h-8 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center">
              <span className="text-red-600 dark:text-red-400 text-lg">⚠️</span>
            </div>
          </div>
        </div>
        <h2 className="text-2xl font-bold text-neutral-900 dark:text-white mb-3">
          Article Not Found
        </h2>
        <p className="text-lg text-neutral-600 dark:text-neutral-400 mb-8 max-w-md text-center">
          Sorry, we couldn&apos;t find the article you&apos;re looking for. It may have been moved or deleted.
        </p>
        <div className="flex flex-col sm:flex-row gap-4">
          <Link 
            href="/blog"
            className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white rounded-xl font-medium transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
            </svg>
            Back to Blog
          </Link>
          <Link 
            href="/"
            className="inline-flex items-center px-6 py-3 border-2 border-neutral-300 dark:border-neutral-600 text-neutral-700 dark:text-neutral-300 hover:border-amber-500 hover:text-amber-600 dark:hover:text-amber-400 rounded-xl font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-amber-500/20"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
            Go Home
          </Link>
        </div>
      </div>
    </BlogTemplate>
  );
}
