'use client';

import React, { useState, useEffect } from "react";
import { BlogPost } from "@/types/blog";
import { BlogTemplate } from "@/templates/Blog";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";

const BlogPostPage = () => {
  const params = useParams();
  const slug = params?.slug as string;
  
  const [post, setPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/blog?slug=${slug}`);
        const result = await response.json();
        
        if (result.success) {
          setPost(result.data);
        } else {
          setError(result.error || 'Post not found');
        }
      } catch (error) {
        console.error('Error fetching post:', error);
        setError('Failed to load post');
      } finally {
        setLoading(false);
      }
    };

    if (slug) {
      fetchPost();
    }
  }, [slug]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <BlogTemplate>
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-500 mx-auto"></div>
          <p className="mt-4 text-neutral-600 dark:text-neutral-400">Loading post...</p>
        </div>
      </BlogTemplate>
    );
  }

  if (error || !post) {
    return (
      <BlogTemplate>
        <div className="text-center py-12">
          <div className="mb-6">
            <svg className="w-16 h-16 text-neutral-400 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6-4h6m2 5.291A7.962 7.962 0 0118 12a8 8 0 00-16 0 7.962 7.962 0 011.678 4.291" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-neutral-900 dark:text-white mb-2">Post Not Found</h1>
          <p className="text-neutral-600 dark:text-neutral-400 mb-6">
            {error || 'The blog post you are looking for does not exist.'}
          </p>
          <Link 
            href="/blog"
            className="inline-flex items-center px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white rounded-lg transition-colors"
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
            </svg>
            Back to Blog
          </Link>
        </div>
      </BlogTemplate>
    );
  }

  return (
    <BlogTemplate>
      <div className="max-w-4xl mx-auto">
        {/* Back Button */}
        <div className="mb-8">
          <Link 
            href="/blog"
            className="inline-flex items-center text-neutral-600 dark:text-neutral-400 hover:text-amber-600 dark:hover:text-amber-400 transition-colors text-sm"
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
            </svg>
            Back to Blog
          </Link>
        </div>

        {/* Post Header */}
        <header className="mb-8">
          {/* Category */}
          <div className="mb-4">
            <span className="bg-amber-100 dark:bg-amber-900/30 text-amber-800 dark:text-amber-300 px-3 py-1 rounded-full text-sm font-medium">
              {post.category}
            </span>
          </div>

          {/* Title */}
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-neutral-900 dark:text-white mb-4 leading-tight">
            {post.title}
          </h1>

          {/* Excerpt */}
          <p className="text-lg text-neutral-600 dark:text-neutral-400 leading-relaxed mb-6">
            {post.excerpt}
          </p>

          {/* Meta Information */}
          <div className="flex flex-wrap items-center gap-4 text-sm text-neutral-500 dark:text-neutral-400 mb-6">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-amber-100 dark:bg-amber-900/30 rounded-full flex items-center justify-center">
                <span className="text-amber-800 dark:text-amber-300 font-medium text-xs">
                  {post.author.charAt(0).toUpperCase()}
                </span>
              </div>
              <span className="font-medium">{post.author}</span>
            </div>
            <span>•</span>
            <span>{formatDate(post.createdAt.toString())}</span>
            {post.readTime && (
              <>
                <span>•</span>
                <span>{post.readTime} min read</span>
              </>
            )}
          </div>

          {/* Tags */}
          {post.tags && post.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-8">
              {post.tags.map((tag, index) => (
                <span
                  key={index}
                  className="bg-neutral-100 dark:bg-neutral-700/50 text-neutral-600 dark:text-neutral-300 px-3 py-1 rounded-full text-sm"
                >
                  #{tag}
                </span>
              ))}
            </div>
          )}
        </header>

        {/* Featured Image */}
        {post.featuredImage && (
          <div className="mb-8">
            <div className="relative h-64 md:h-96 rounded-2xl overflow-hidden">
              <Image
                src={post.featuredImage}
                alt={post.title}
                fill
                className="object-cover"
              />
            </div>
          </div>
        )}

        {/* Post Content */}
        <article className="prose prose-neutral dark:prose-invert max-w-none">
          <div 
            className="leading-relaxed text-neutral-700 dark:text-neutral-300"
            dangerouslySetInnerHTML={{ __html: post.content }}
          />
        </article>

        {/* Post Footer */}
        <footer className="mt-12 pt-8 border-t border-neutral-200/50 dark:border-neutral-700/50">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-amber-100 dark:bg-amber-900/30 rounded-full flex items-center justify-center">
                <span className="text-amber-800 dark:text-amber-300 font-bold">
                  {post.author.charAt(0).toUpperCase()}
                </span>
              </div>
              <div>
                <p className="font-medium text-neutral-900 dark:text-white">{post.author}</p>
                <p className="text-sm text-neutral-600 dark:text-neutral-400">Full-Stack Developer</p>
              </div>
            </div>

            {/* Social Share Buttons */}
            <div className="flex items-center space-x-3">
              <button className="p-2 bg-neutral-100 dark:bg-neutral-700 hover:bg-neutral-200 dark:hover:bg-neutral-600 rounded-lg transition-colors">
                <svg className="w-5 h-5 text-neutral-600 dark:text-neutral-400" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M18.77 7.46H14.5v-1.9c0-.9.6-1.1 1-1.1h3V.5h-4.33C10.24.5 9.5 3.44 9.5 5.32v2.15h-3v4h3v12h5v-12h3.85l.42-4z"/>
                </svg>
              </button>
              <button className="p-2 bg-neutral-100 dark:bg-neutral-700 hover:bg-neutral-200 dark:hover:bg-neutral-600 rounded-lg transition-colors">
                <svg className="w-5 h-5 text-neutral-600 dark:text-neutral-400" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                </svg>
              </button>
              <button className="p-2 bg-neutral-100 dark:bg-neutral-700 hover:bg-neutral-200 dark:hover:bg-neutral-600 rounded-lg transition-colors">
                <svg className="w-5 h-5 text-neutral-600 dark:text-neutral-400" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                </svg>
              </button>
            </div>
          </div>
        </footer>
      </div>
    </BlogTemplate>
  );
};

export default BlogPostPage;
