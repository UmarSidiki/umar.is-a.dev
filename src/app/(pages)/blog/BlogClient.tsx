'use client';

import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import { BlogPost } from "@/types/blog";
import { BlogTemplate } from "@/templates/Blog";

interface FilterState {
  search: string;
  category: string;
  tag: string;
  sortBy: "newest" | "oldest" | "popular" | "title";
}

// Skeleton loader component for better loading UX
const PostSkeleton = () => (
  <div className="animate-pulse bg-white/50 dark:bg-neutral-800/50 backdrop-blur-sm border border-neutral-200/50 dark:border-neutral-700/50 rounded-2xl overflow-hidden">
    <div className="bg-gradient-to-br from-neutral-200/50 via-neutral-100/50 to-neutral-200/50 dark:from-neutral-700/50 dark:via-neutral-600/50 dark:to-neutral-700/50 h-36 md:h-44"></div>
    <div className="p-3 md:p-5">
      <div className="flex items-center justify-between mb-2">
        <div
          className="h-3 bg-neutral-200/50 dark:bg-neutral-700/50 rounded-full w-16 animate-pulse"
          style={{ animationDelay: "0.1s" }}
        ></div>
        <div
          className="h-2 bg-neutral-200/50 dark:bg-neutral-700/50 rounded-full w-20 animate-pulse"
          style={{ animationDelay: "0.2s" }}
        ></div>
      </div>
      <div
        className="h-5 md:h-6 bg-neutral-200/50 dark:bg-neutral-700/50 rounded-lg mb-2 animate-pulse"
        style={{ animationDelay: "0.3s" }}
      ></div>
      <div
        className="h-4 bg-neutral-200/50 dark:bg-neutral-700/50 rounded mb-3 w-3/4 animate-pulse"
        style={{ animationDelay: "0.4s" }}
      ></div>
      <div className="flex gap-2 mb-3">
        <div
          className="h-5 bg-neutral-200/50 dark:bg-neutral-700/50 rounded-full w-12 animate-pulse"
          style={{ animationDelay: "0.5s" }}
        ></div>
        <div
          className="h-5 bg-neutral-200/50 dark:bg-neutral-700/50 rounded-full w-16 animate-pulse"
          style={{ animationDelay: "0.6s" }}
        ></div>
      </div>
      <div className="flex items-center justify-between pt-2 border-t border-neutral-200/30 dark:border-neutral-700/30">
        <div
          className="h-3 bg-neutral-200/50 dark:bg-neutral-700/50 rounded-full w-24 animate-pulse"
          style={{ animationDelay: "0.7s" }}
        ></div>
        <div
          className="h-4 bg-neutral-200/50 dark:bg-neutral-700/50 rounded w-4 animate-pulse"
          style={{ animationDelay: "0.8s" }}
        ></div>
      </div>
    </div>
  </div>
);

const BlogClient = () => {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchDebounce, setSearchDebounce] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [filters, setFilters] = useState<FilterState>({
    search: "",
    category: "",
    tag: "",
    sortBy: "newest",
  });

  const POSTS_PER_PAGE = 9;

  // Debounce search input for better UX
  useEffect(() => {
    setIsSearching(true);
    const timer = setTimeout(() => {
      setSearchDebounce(filters.search);
      setIsSearching(false);
    }, 300);

    return () => clearTimeout(timer);
  }, [filters.search]);

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/blog?status=published&limit=50"); // Fetch more for client-side filtering
      const result = await response.json();

      if (result.success) {
        setPosts(result.data);
      }
    } catch (error) {
      console.error("Error fetching posts:", error);
    } finally {
      setLoading(false);
    }
  };

  // Get unique categories and tags for filters
  const { categories, tags } = useMemo(() => {
    const categorySet = new Set<string>();
    const tagSet = new Set<string>();

    posts.forEach((post) => {
      if (post.category) categorySet.add(post.category);
      if (post.tags) post.tags.forEach((tag) => tagSet.add(tag));
    });

    return {
      categories: Array.from(categorySet).sort(),
      tags: Array.from(tagSet).sort(),
    };
  }, [posts]);

  // Filter and sort posts with debounced search
  const filteredAndSortedPosts = useMemo(() => {
    const searchTerm = searchDebounce.toLowerCase();
    const filtered = posts.filter((post) => {
      const matchesSearch =
        !searchTerm ||
        post.title.toLowerCase().includes(searchTerm) ||
        post.excerpt.toLowerCase().includes(searchTerm) ||
        post.author.toLowerCase().includes(searchTerm) ||
        (post.tags &&
          post.tags.some((tag) => tag.toLowerCase().includes(searchTerm)));

      const matchesCategory =
        !filters.category || post.category === filters.category;

      const matchesTag =
        !filters.tag || (post.tags && post.tags.includes(filters.tag));

      return matchesSearch && matchesCategory && matchesTag;
    });

    // Sort posts
    filtered.sort((a, b) => {
      switch (filters.sortBy) {
        case "newest":
          return (
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          );
        case "oldest":
          return (
            new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
          );
        case "popular":
          return (b.commentCount || 0) - (a.commentCount || 0);
        case "title":
          return a.title.localeCompare(b.title);
        default:
          return 0;
      }
    });

    return filtered;
  }, [posts, searchDebounce, filters.category, filters.tag, filters.sortBy]);

  // Paginate posts
  const paginatedPosts = useMemo(() => {
    const startIndex = (currentPage - 1) * POSTS_PER_PAGE;
    return filteredAndSortedPosts.slice(
      startIndex,
      startIndex + POSTS_PER_PAGE
    );
  }, [filteredAndSortedPosts, currentPage]);

  const totalPages = Math.ceil(filteredAndSortedPosts.length / POSTS_PER_PAGE);

  // Reset to first page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [filters]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const handleFilterChange = (key: keyof FilterState, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const clearFilters = () => {
    setFilters({
      search: "",
      category: "",
      tag: "",
      sortBy: "newest",
    });
  };

  return (
    <BlogTemplate>
      <div>
        {/* Compact Header */}
        <div className="mb-6 md:mb-8 text-center">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-neutral-900 dark:text-white mb-2 md:mb-3">
            Latest Articles
          </h1>
          <p className="text-sm sm:text-base text-neutral-600 dark:text-neutral-400 mb-4 md:mb-6 px-2">
            Discover insights, tutorials, and thoughts about web development,
            technology, and the digital world.
          </p>

          {/* Search and Filters */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-3 justify-center max-w-5xl mx-auto px-2">
            {/* Compact Search Bar */}
            <div className="relative flex-1 max-w-md">
              <label htmlFor="search-posts" className="sr-only">
                Search articles
              </label>
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg
                  className={`h-4 w-4 transition-colors ${
                    isSearching ? "text-amber-500" : "text-neutral-400"
                  }`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </div>
              <input
                id="search-posts"
                type="text"
                placeholder="Search articles..."
                value={filters.search}
                onChange={(e) => handleFilterChange("search", e.target.value)}
                className="block w-full pl-10 pr-4 py-2.5 text-sm border border-neutral-200/50 dark:border-neutral-700/50 rounded-lg bg-white/70 dark:bg-neutral-800/70 backdrop-blur-lg text-neutral-900 dark:text-white placeholder-neutral-500 dark:placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all duration-300"
                aria-describedby="search-help"
              />
              <span id="search-help" className="sr-only">
                Search through article titles, content, and tags
              </span>
              {isSearching && (
                <div
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  aria-hidden="true"
                >
                  <div className="animate-spin h-3 w-3 border-2 border-amber-500 border-t-transparent rounded-full"></div>
                </div>
              )}
            </div>

            {/* Compact Filters */}
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
              {/* Category Filter */}
              <div className="relative">
                <label htmlFor="category-filter" className="sr-only">
                  Filter by category
                </label>
                <select
                  id="category-filter"
                  value={filters.category}
                  onChange={(e) =>
                    handleFilterChange("category", e.target.value)
                  }
                  className="appearance-none px-3 md:px-4 py-2.5 pr-7 md:pr-8 border border-neutral-200/50 dark:border-neutral-700/50 rounded-lg bg-white/70 dark:bg-neutral-800/70 backdrop-blur-lg text-neutral-900 dark:text-white text-xs md:text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all duration-200 cursor-pointer hover:bg-white/90 dark:hover:bg-neutral-800/90"
                >
                  <option value="">All Categories</option>
                  {categories.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
                <div
                  className="absolute inset-y-0 right-0 pr-2 flex items-center pointer-events-none"
                  aria-hidden="true"
                >
                  <svg
                    className="w-3 h-3 text-neutral-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </div>
              </div>

              {/* Tag Filter */}
              <div className="relative">
                <label htmlFor="tag-filter" className="sr-only">
                  Filter by tag
                </label>
                <select
                  id="tag-filter"
                  value={filters.tag}
                  onChange={(e) => handleFilterChange("tag", e.target.value)}
                  className="appearance-none px-3 md:px-4 py-2.5 pr-7 md:pr-8 border border-neutral-200/50 dark:border-neutral-700/50 rounded-lg bg-white/70 dark:bg-neutral-800/70 backdrop-blur-lg text-neutral-900 dark:text-white text-xs md:text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all duration-200 cursor-pointer hover:bg-white/90 dark:hover:bg-neutral-800/90"
                >
                  <option value="">All Tags</option>
                  {tags.map((tag) => (
                    <option key={tag} value={tag}>
                      #{tag}
                    </option>
                  ))}
                </select>
                <div
                  className="absolute inset-y-0 right-0 pr-2 flex items-center pointer-events-none"
                  aria-hidden="true"
                >
                  <svg
                    className="w-3 h-3 text-neutral-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </div>
              </div>

              {/* Sort By */}
              <div className="relative">
                <select
                  value={filters.sortBy}
                  onChange={(e) =>
                    handleFilterChange(
                      "sortBy",
                      e.target.value as FilterState["sortBy"]
                    )
                  }
                  className="appearance-none px-3 md:px-4 py-2.5 pr-7 md:pr-8 border border-neutral-200/50 dark:border-neutral-700/50 rounded-lg bg-white/70 dark:bg-neutral-800/70 backdrop-blur-lg text-neutral-900 dark:text-white text-xs md:text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all duration-200 cursor-pointer hover:bg-white/90 dark:hover:bg-neutral-800/90"
                >
                  <option value="newest">Newest</option>
                  <option value="oldest">Oldest</option>
                  <option value="popular">Popular</option>
                  <option value="title">A-Z</option>
                </select>
                <div className="absolute inset-y-0 right-0 pr-2 flex items-center pointer-events-none">
                  <svg
                    className="w-3 h-3 text-neutral-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </div>
              </div>

              {/* Clear Filters */}
              {(filters.search ||
                filters.category ||
                filters.tag ||
                filters.sortBy !== "newest") && (
                <button
                  onClick={clearFilters}
                  className="px-3 py-2.5 text-xs md:text-sm font-medium text-neutral-600 dark:text-neutral-400 hover:text-amber-600 dark:hover:text-amber-400 hover:bg-amber-50/50 dark:hover:bg-amber-900/20 rounded-lg transition-all duration-200 border border-neutral-200/50 dark:border-neutral-700/50 bg-white/50 dark:bg-neutral-800/50 backdrop-blur-lg"
                >
                  Clear
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Blog Posts */}
        {loading ? (
          <div className="space-y-4">
            {/* Compact Loading Indicator */}
            <div className="flex items-center justify-center py-4">
              <div className="flex items-center space-x-3 bg-white/60 dark:bg-neutral-800/60 backdrop-blur-xl px-4 py-2.5 rounded-full border border-neutral-200/50 dark:border-neutral-700/50 shadow-lg">
                <div className="relative">
                  <div className="animate-spin rounded-full h-5 w-5 border-2 border-amber-200/40 border-t-amber-500"></div>
                  <div className="absolute inset-0 rounded-full bg-gradient-to-r from-amber-400/20 to-amber-600/20 animate-pulse"></div>
                </div>
                <div className="flex flex-col">
                  <span className="text-neutral-700 dark:text-neutral-300 font-medium text-sm">
                    Loading articles
                  </span>
                  <span className="text-neutral-500 dark:text-neutral-500 text-xs">
                    Please wait...
                  </span>
                </div>
              </div>
            </div>
            {/* Skeleton loaders */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
              {Array.from({ length: 6 }).map((_, index) => (
                <PostSkeleton key={index} />
              ))}
            </div>
          </div>
        ) : paginatedPosts.length === 0 ? (
          <div className="text-center py-16">
            <div className="mb-8">
              <div className="relative inline-flex">
                <svg
                  className="w-24 h-24 text-neutral-300 dark:text-neutral-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="1"
                    d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6-4h6m2 5.291A7.962 7.962 0 0118 12a8 8 0 00-16 0 7.962 7.962 0 011.678 4.291"
                  />
                </svg>
                <div className="absolute -top-2 -right-2 w-8 h-8 bg-amber-100 dark:bg-amber-900/30 rounded-full flex items-center justify-center">
                  <span className="text-amber-600 dark:text-amber-400 text-lg">
                    📄
                  </span>
                </div>
              </div>
            </div>
            <h3 className="text-2xl font-bold text-neutral-900 dark:text-white mb-3">
              {posts.length === 0 ? "No Articles Yet" : "No Results Found"}
            </h3>
            <p className="text-lg text-neutral-600 dark:text-neutral-400 mb-8 max-w-md mx-auto">
              {posts.length === 0
                ? "We're working on some amazing content. Check back soon for exciting articles!"
                : "Try adjusting your search terms or clear the filters to see more articles."}
            </p>
            {posts.length > 0 && (
              <button
                onClick={clearFilters}
                className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white rounded-xl font-medium transition-all duration-200 shadow-lg shadow-amber-500/25 hover:shadow-xl hover:shadow-amber-500/30 transform hover:-translate-y-0.5"
              >
                <svg
                  className="w-5 h-5 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                  />
                </svg>
                Reset Filters
              </button>
            )}
          </div>
        ) : (
          <>
            {/* Enhanced Posts Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 lg:gap-8">
              {paginatedPosts.map((post, index) => (
                <Link
                  key={post._id?.toString()}
                  href={`/blog/${post.slug}`}
                  className="group block"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <article className="h-full bg-white/70 dark:bg-neutral-800/70 backdrop-blur-xl border border-neutral-200/50 dark:border-neutral-700/50 rounded-2xl md:rounded-3xl overflow-hidden hover:shadow-2xl hover:shadow-neutral-200/20 dark:hover:shadow-neutral-900/40 hover:scale-[1.02] hover:-translate-y-2 transition-all duration-500 group-hover:border-amber-500/30 animate-fadeInUp">
                    {/* Featured Image with enhanced effects */}
                    {post.featuredImage ? (
                      <div className="relative overflow-hidden h-48 md:h-56">
                        <Image
                          src={post.featuredImage}
                          alt={post.title}
                          fill
                          className="object-cover group-hover:scale-110 transition-transform duration-700"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent group-hover:from-black/60 transition-all duration-300"></div>
                        <div className="absolute top-3 md:top-4 left-3 md:left-4">
                          <span className="bg-white/90 dark:bg-neutral-900/90 backdrop-blur-sm text-amber-600 dark:text-amber-400 px-2 md:px-3 py-1 rounded-full text-xs font-bold shadow-lg">
                            {post.category}
                          </span>
                        </div>
                        {post.readTime && (
                          <div className="absolute top-3 md:top-4 right-3 md:right-4">
                            <span className="bg-black/50 text-white px-2 py-1 rounded-full text-xs font-medium backdrop-blur-sm">
                              ⏱️ {post.readTime} min
                            </span>
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="bg-gradient-to-br from-amber-50 via-amber-100 to-amber-200 dark:from-amber-900/20 dark:via-amber-800/20 dark:to-amber-700/20 flex items-center justify-center relative overflow-hidden h-48 md:h-56">
                        <div className="absolute inset-0 bg-gradient-to-br from-amber-500/10 to-amber-600/10 dark:from-amber-400/10 dark:to-amber-500/10"></div>
                        <svg
                          className="w-16 md:w-20 h-16 md:h-20 text-amber-500/40 relative z-10"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="1"
                            d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"
                          />
                        </svg>
                        <div className="absolute top-3 md:top-4 left-3 md:left-4">
                          <span className="bg-white/90 dark:bg-neutral-900/90 backdrop-blur-sm text-amber-600 dark:text-amber-400 px-2 md:px-3 py-1 rounded-full text-xs font-bold shadow-lg">
                            {post.category}
                          </span>
                        </div>
                        {post.readTime && (
                          <div className="absolute top-3 md:top-4 right-3 md:right-4">
                            <span className="bg-amber-500/20 text-amber-700 dark:text-amber-300 px-2 py-1 rounded-full text-xs font-medium backdrop-blur-sm">
                              ⏱️ {post.readTime} min
                            </span>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Content with enhanced styling */}
                    <div className="p-4 md:p-6 lg:p-8 flex-1 flex flex-col">
                      {/* Date & Author */}
                      <div className="flex items-center justify-between text-xs text-neutral-500 dark:text-neutral-400 mb-3 md:mb-4">
                        <div className="flex items-center space-x-2">
                          <div className="w-5 md:w-6 h-5 md:h-6 bg-gradient-to-br from-amber-400 to-amber-600 rounded-full flex items-center justify-center shadow-lg">
                            <span className="text-white font-bold text-xs">
                              {post.author.charAt(0).toUpperCase()}
                            </span>
                          </div>
                          <span className="font-medium text-xs md:text-sm">
                            {post.author}
                          </span>
                        </div>
                        <span className="font-medium text-xs">
                          📅 {formatDate(post.createdAt.toString())}
                        </span>
                      </div>

                      {/* Title with enhanced typography */}
                      <h2 className="text-lg md:text-xl font-bold text-neutral-900 dark:text-white mb-2 md:mb-3 group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors leading-tight line-clamp-2">
                        {post.title}
                      </h2>

                      {/* Excerpt with improved readability */}
                      <p className="text-xs md:text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed mb-4 md:mb-6 flex-grow line-clamp-3">
                        {post.excerpt}
                      </p>

                      {/* Enhanced Tags */}
                      {post.tags && post.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1 md:gap-2 mb-4 md:mb-6">
                          {post.tags.slice(0, 3).map((tag, tagIndex) => (
                            <span
                              key={tagIndex}
                              className="bg-neutral-100/80 dark:bg-neutral-700/50 text-neutral-600 dark:text-neutral-300 px-2 md:px-3 py-1 rounded-full text-xs font-medium hover:bg-amber-100 dark:hover:bg-amber-900/30 hover:text-amber-700 dark:hover:text-amber-300 transition-colors border border-neutral-200/50 dark:border-neutral-600/50"
                            >
                              #{tag}
                            </span>
                          ))}
                          {post.tags.length > 3 && (
                            <span className="text-xs text-neutral-500 dark:text-neutral-400 self-center">
                              +{post.tags.length - 3} more
                            </span>
                          )}
                        </div>
                      )}

                      {/* Enhanced Footer */}
                      <div className="flex items-center justify-between pt-3 md:pt-4 border-t border-neutral-200/30 dark:border-neutral-700/30 mt-auto">
                        <div className="flex items-center space-x-4 text-xs text-neutral-500 dark:text-neutral-400">
                          {post.commentCount !== undefined && (
                            <div className="flex items-center space-x-1">
                              <svg
                                className="w-3 md:w-4 h-3 md:h-4"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth="2"
                                  d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                                />
                              </svg>
                              <span className="font-medium">
                                {post.commentCount} comments
                              </span>
                            </div>
                          )}
                        </div>
                        <div className="flex items-center space-x-1 md:space-x-2">
                          <span className="text-xs text-neutral-500 dark:text-neutral-400 group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors font-medium">
                            Read article
                          </span>
                          <div className="text-amber-600 dark:text-amber-400 opacity-0 group-hover:opacity-100 transition-all duration-300 transform group-hover:translate-x-1">
                            <svg
                              className="w-4 md:w-5 h-4 md:h-5"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M13 7l5 5m0 0l-5 5m5-5H6"
                              />
                            </svg>
                          </div>
                        </div>
                      </div>
                    </div>
                  </article>
                </Link>
              ))}
            </div>

            {/* Enhanced Pagination */}
            {totalPages > 1 && (
              <div className="mt-12 md:mt-16 flex justify-center px-4">
                <nav className="flex items-center space-x-1 md:space-x-2 bg-white/70 dark:bg-neutral-800/70 backdrop-blur-xl rounded-xl md:rounded-2xl p-1 md:p-2 border border-neutral-200/50 dark:border-neutral-700/50 shadow-lg shadow-neutral-200/20 dark:shadow-neutral-900/20">
                  {/* Previous Button */}
                  <button
                    onClick={() =>
                      setCurrentPage((prev) => Math.max(prev - 1, 1))
                    }
                    disabled={currentPage === 1}
                    className={`px-3 md:px-4 py-2 md:py-3 rounded-lg md:rounded-xl text-xs md:text-sm font-medium transition-all duration-200 flex items-center space-x-1 md:space-x-2 ${
                      currentPage === 1
                        ? "text-neutral-400 dark:text-neutral-600 cursor-not-allowed"
                        : "text-neutral-600 dark:text-neutral-400 hover:text-amber-600 dark:hover:text-amber-400 hover:bg-amber-50 dark:hover:bg-amber-900/20"
                    }`}
                  >
                    <svg
                      className="w-3 md:w-4 h-3 md:h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M15 19l-7-7 7-7"
                      />
                    </svg>
                    <span className="hidden sm:inline">Previous</span>
                    <span className="sm:hidden">Prev</span>
                  </button>

                  {/* Page Numbers */}
                  <div className="flex items-center space-x-1">
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                      (page) => {
                        // Show first page, last page, current page, and pages around current
                        const showPage =
                          page === 1 ||
                          page === totalPages ||
                          Math.abs(page - currentPage) <= 1;
                        const showEllipsis =
                          (page === 2 && currentPage > 4) ||
                          (page === totalPages - 1 &&
                            currentPage < totalPages - 3);

                        if (!showPage && !showEllipsis) return null;

                        if (showEllipsis) {
                          return (
                            <span
                              key={`ellipsis-${page}`}
                              className="px-2 md:px-3 py-2 text-neutral-400 dark:text-neutral-600 text-xs md:text-sm"
                            >
                              ⋯
                            </span>
                          );
                        }

                        return (
                          <button
                            key={page}
                            onClick={() => setCurrentPage(page)}
                            className={`px-3 md:px-4 py-2 md:py-3 rounded-lg md:rounded-xl text-xs md:text-sm font-bold transition-all duration-200 ${
                              currentPage === page
                                ? "bg-gradient-to-r from-amber-500 to-amber-600 text-white shadow-lg shadow-amber-500/25"
                                : "text-neutral-600 dark:text-neutral-400 hover:text-amber-600 dark:hover:text-amber-400 hover:bg-amber-50 dark:hover:bg-amber-900/20"
                            }`}
                          >
                            {page}
                          </button>
                        );
                      }
                    )}
                  </div>

                  {/* Next Button */}
                  <button
                    onClick={() =>
                      setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                    }
                    disabled={currentPage === totalPages}
                    className={`px-3 md:px-4 py-2 md:py-3 rounded-lg md:rounded-xl text-xs md:text-sm font-medium transition-all duration-200 flex items-center space-x-1 md:space-x-2 ${
                      currentPage === totalPages
                        ? "text-neutral-400 dark:text-neutral-600 cursor-not-allowed"
                        : "text-neutral-600 dark:text-neutral-400 hover:text-amber-600 dark:hover:text-amber-400 hover:bg-amber-50 dark:hover:bg-amber-900/20"
                    }`}
                  >
                    <span className="hidden sm:inline">Next</span>
                    <span className="sm:hidden">Next</span>
                    <svg
                      className="w-3 md:w-4 h-3 md:h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </button>
                </nav>
              </div>
            )}
          </>
        )}
      </div>
    </BlogTemplate>
  );
};

export default BlogClient;
