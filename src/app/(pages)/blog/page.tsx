'use client';

import { BlogTemplate } from "@/templates/Blog";
import React, { useState, useEffect } from "react";
import { BlogPost } from "@/types/blog";
import Image from "next/image";
import Link from "next/link";

const Blog = () => {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const response = await fetch('/api/blog?status=published&limit=10');
      const result = await response.json();
      
      if (result.success) {
        setPosts(result.data);
      }
    } catch (error) {
      console.error('Error fetching posts:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <BlogTemplate>
      <div>
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-neutral-900 dark:text-white mb-4">
            Blog
          </h1>
          <p className="text-lg text-neutral-600 dark:text-neutral-400 max-w-2xl mx-auto">
            Thoughts, tutorials, and insights about web development, technology, and more.
          </p>
        </div>

        {/* Blog Posts */}
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-500 mx-auto"></div>
            <p className="mt-4 text-neutral-600 dark:text-neutral-400">Loading posts...</p>
          </div>
        ) : posts.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-neutral-600 dark:text-neutral-400">No blog posts published yet.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {posts.map((post) => (
              <Link 
                key={post._id?.toString()} 
                href={`/blog/${post.slug}`}
                className="group block"
              >
                <article className="h-full bg-white/60 dark:bg-neutral-800/60 backdrop-blur-sm border border-neutral-200/50 dark:border-neutral-700/50 rounded-2xl overflow-hidden hover:shadow-xl hover:scale-[1.02] transition-all duration-300">
                  {/* Featured Image */}
                  {post.featuredImage ? (
                    <div className="relative h-48 overflow-hidden">
                      <Image
                        src={post.featuredImage}
                        alt={post.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                    </div>
                  ) : (
                    <div className="h-48 bg-gradient-to-br from-amber-100 to-amber-200 dark:from-amber-900/20 dark:to-amber-800/20 flex items-center justify-center">
                      <svg className="w-16 h-16 text-amber-500/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                      </svg>
                    </div>
                  )}

                  {/* Content */}
                  <div className="p-6">
                    {/* Category & Date */}
                    <div className="flex items-center justify-between text-xs text-neutral-500 dark:text-neutral-400 mb-3">
                      <span className="bg-amber-100 dark:bg-amber-900/30 text-amber-800 dark:text-amber-300 px-2 py-1 rounded-full font-medium">
                        {post.category}
                      </span>
                      <span>{formatDate(post.createdAt.toString())}</span>
                    </div>

                    {/* Title */}
                    <h2 className="text-lg font-bold text-neutral-900 dark:text-white mb-2 line-clamp-2 group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors">
                      {post.title}
                    </h2>

                    {/* Excerpt */}
                    <p className="text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed mb-4 line-clamp-3">
                      {post.excerpt}
                    </p>

                    {/* Tags */}
                    {post.tags && post.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1 mb-4">
                        {post.tags.slice(0, 3).map((tag, index) => (
                          <span
                            key={index}
                            className="bg-neutral-100 dark:bg-neutral-700/50 text-neutral-600 dark:text-neutral-300 px-2 py-1 rounded text-xs"
                          >
                            #{tag}
                          </span>
                        ))}
                        {post.tags.length > 3 && (
                          <span className="text-xs text-neutral-500 dark:text-neutral-400">
                            +{post.tags.length - 3} more
                          </span>
                        )}
                      </div>
                    )}

                    {/* Footer */}
                    <div className="flex items-center justify-between pt-3 border-t border-neutral-200/30 dark:border-neutral-700/30">
                      <div className="flex items-center space-x-2 text-xs text-neutral-500 dark:text-neutral-400">
                        <span>{post.author}</span>
                        {post.readTime && (
                          <>
                            <span>•</span>
                            <span>{post.readTime} min read</span>
                          </>
                        )}
                      </div>
                      <div className="text-amber-600 dark:text-amber-400 opacity-0 group-hover:opacity-100 transition-opacity">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                        </svg>
                      </div>
                    </div>
                  </div>
                </article>
              </Link>
            ))}
          </div>
        )}
      </div>
    </BlogTemplate>
  );
};

export default Blog;
