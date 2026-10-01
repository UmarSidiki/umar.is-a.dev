"use client";

import React, { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight, Search } from "lucide-react";
import { BlogPost } from "@/types/blog";
import { BlogTemplate } from "@/templates/Blog";

interface BlogClientProps {
  initialPosts: BlogPost[];
}

interface FilterState {
  search: string;
  category: string;
  tag: string;
  sortBy: "newest" | "oldest" | "popular" | "title";
}

const POSTS_PER_PAGE = 9;

const selectClass =
  "border border-hairline bg-transparent py-3 pl-3 pr-8 text-base text-foreground focus:border-signal focus:outline-none";

function Skeleton() {
  return (
    <div className="animate-pulse border border-hairline">
      <div className="aspect-[16/10] bg-muted" />
      <div className="space-y-3 p-6">
        <div className="h-3 w-20 bg-muted" />
        <div className="h-5 w-3/4 bg-muted" />
        <div className="h-3 w-full bg-muted" />
      </div>
    </div>
  );
}

export default function BlogClient({ initialPosts }: BlogClientProps) {
  const [posts, setPosts] = useState<BlogPost[]>(initialPosts || []);
  const [loading, setLoading] = useState(initialPosts.length === 0);
  const [page, setPage] = useState(1);
  const [searchDebounce, setSearchDebounce] = useState("");
  const [filters, setFilters] = useState<FilterState>({
    search: "",
    category: "",
    tag: "",
    sortBy: "newest",
  });

  useEffect(() => {
    const timer = setTimeout(() => setSearchDebounce(filters.search), 300);
    return () => clearTimeout(timer);
  }, [filters.search]);

  useEffect(() => {
    if (initialPosts.length > 0) return;
    let cancelled = false;
    (async () => {
      try {
        setLoading(true);
        const res = await fetch("/api/blog?status=published&limit=50");
        const result = await res.json();
        if (!cancelled && result.success) setPosts(result.data);
      } catch (error) {
        console.error("Error fetching posts:", error);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [initialPosts]);

  const { categories, tags } = useMemo(() => {
    const categorySet = new Set<string>();
    const tagSet = new Set<string>();
    posts.forEach((post) => {
      if (post.category) categorySet.add(post.category);
      post.tags?.forEach((tag) => tagSet.add(tag));
    });
    return {
      categories: Array.from(categorySet).sort(),
      tags: Array.from(tagSet).sort(),
    };
  }, [posts]);

  const filtered = useMemo(() => {
    const term = searchDebounce.toLowerCase();
    const result = posts.filter((post) => {
      const matchesSearch =
        !term ||
        post.title.toLowerCase().includes(term) ||
        post.excerpt.toLowerCase().includes(term) ||
        post.author.toLowerCase().includes(term) ||
        post.tags?.some((tag) => tag.toLowerCase().includes(term));
      const matchesCategory = !filters.category || post.category === filters.category;
      const matchesTag = !filters.tag || post.tags?.includes(filters.tag);
      return matchesSearch && matchesCategory && matchesTag;
    });

    result.sort((a, b) => {
      switch (filters.sortBy) {
        case "oldest":
          return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
        case "popular":
          return (b.commentCount || 0) - (a.commentCount || 0);
        case "title":
          return a.title.localeCompare(b.title);
        default:
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      }
    });
    return result;
  }, [posts, searchDebounce, filters.category, filters.tag, filters.sortBy]);

  const totalPages = Math.ceil(filtered.length / POSTS_PER_PAGE);
  const paginated = useMemo(
    () => filtered.slice((page - 1) * POSTS_PER_PAGE, page * POSTS_PER_PAGE),
    [filtered, page]
  );

  useEffect(() => setPage(1), [filters]);

  const clearFilters = () =>
    setFilters({ search: "", category: "", tag: "", sortBy: "newest" });

  const filtersActive =
    filters.search || filters.category || filters.tag || filters.sortBy !== "newest";

  const formatDate = (value: string) =>
    new Date(value).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });

  return (
    <BlogTemplate>
      <span className="label-mono text-ink-soft">Journal — Index</span>
      <h1 className="display-xl mt-3 text-foreground">Writing</h1>
      <p className="mt-6 max-w-xl text-lg text-ink-soft">
        Notes on web development, React, Next.js and building for the web.
      </p>

      <div className="mt-12 flex flex-col gap-4 border-y border-hairline py-5 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex items-center gap-4">
          <label htmlFor="blog-search" className="label-mono text-ink-soft">
            Search
          </label>
          <div className="relative flex-1 lg:w-72">
            <Search
              className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-soft"
              aria-hidden="true"
            />
            <input
              id="blog-search"
              type="search"
              value={filters.search}
              onChange={(e) => setFilters((p) => ({ ...p, search: e.target.value }))}
              placeholder="Title, tag or author"
              className="w-full border border-hairline bg-transparent py-3 pl-10 pr-3 text-base text-foreground placeholder:text-ink-soft focus:border-signal focus:outline-none"
            />
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-3">
            <label htmlFor="blog-category" className="label-mono text-ink-soft">
              Category
            </label>
            <select
              id="blog-category"
              value={filters.category}
              onChange={(e) => setFilters((p) => ({ ...p, category: e.target.value }))}
              className={selectClass}
            >
              <option value="">All</option>
              {categories.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-3">
            <label htmlFor="blog-tag" className="label-mono text-ink-soft">
              Tag
            </label>
            <select
              id="blog-tag"
              value={filters.tag}
              onChange={(e) => setFilters((p) => ({ ...p, tag: e.target.value }))}
              className={selectClass}
            >
              <option value="">All</option>
              {tags.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-3">
            <label htmlFor="blog-sort" className="label-mono text-ink-soft">
              Sort
            </label>
            <select
              id="blog-sort"
              value={filters.sortBy}
              onChange={(e) =>
                setFilters((p) => ({
                  ...p,
                  sortBy: e.target.value as FilterState["sortBy"],
                }))
              }
              className={selectClass}
            >
              <option value="newest">Newest</option>
              <option value="oldest">Oldest</option>
              <option value="popular">Most discussed</option>
              <option value="title">A–Z</option>
            </select>
          </div>

          {filtersActive && (
            <button
              type="button"
              onClick={clearFilters}
              className="label-mono text-signal transition-opacity hover:opacity-70"
            >
              Clear
            </button>
          )}
        </div>
      </div>

      {loading ? (
        <div className="mt-10 grid gap-px border border-hairline bg-hairline sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="bg-background">
              <Skeleton />
            </div>
          ))}
        </div>
      ) : paginated.length === 0 ? (
        <div className="mt-16 border border-dashed border-hairline px-6 py-24 text-center">
          <p className="font-display text-2xl font-bold">
            {posts.length === 0 ? "No articles yet" : "No results found"}
          </p>
          <p className="mt-3 text-sm text-ink-soft">
            {posts.length === 0
              ? "New writing is on the way. Check back soon."
              : "Try adjusting your search or clearing the filters."}
          </p>
          {posts.length > 0 && (
            <button
              type="button"
              onClick={clearFilters}
              className="label-mono mt-6 text-signal transition-opacity hover:opacity-70"
            >
              Reset filters
            </button>
          )}
        </div>
      ) : (
        <>
          <div className="mt-10 grid gap-px border border-hairline bg-hairline sm:grid-cols-2 lg:grid-cols-3">
            {paginated.map((post) => (
              <Link
                key={post._id?.toString()}
                href={`/blog/${post.slug}`}
                className="group flex flex-col bg-background"
              >
                <div className="relative aspect-[16/10] overflow-hidden border-b border-hairline bg-muted">
                  {post.featuredImage ? (
                    <Image
                      src={post.featuredImage}
                      alt={post.title}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                  ) : (
                    <span className="absolute left-5 top-5 label-mono text-ink-soft">
                      {post.category}
                    </span>
                  )}
                </div>

                <div className="flex flex-1 flex-col p-6">
                  <div className="flex items-center justify-between gap-3">
                    <span className="label-mono text-ink-soft">{post.category}</span>
                    <span className="label-mono text-ink-soft">
                      {formatDate(post.createdAt.toString())}
                    </span>
                  </div>

                  <h2 className="mt-4 font-display text-lg font-bold leading-snug tracking-tight transition-colors group-hover:text-signal">
                    {post.title}
                  </h2>
                  <p className="mt-3 line-clamp-3 flex-1 text-sm leading-relaxed text-ink-soft">
                    {post.excerpt}
                  </p>

                  {post.tags && post.tags.length > 0 && (
                    <ul className="mt-5 flex flex-wrap gap-2">
                      {post.tags.slice(0, 3).map((tag) => (
                        <li
                          key={tag}
                          className="border border-hairline px-2 py-1 text-xs text-ink-soft"
                        >
                          #{tag}
                        </li>
                      ))}
                    </ul>
                  )}

                  <div className="mt-6 flex items-center justify-between border-t border-hairline pt-4">
                    <span className="text-xs text-ink-soft">
                      {post.readTime ? `${post.readTime} min read` : post.author}
                    </span>
                    <ArrowUpRight
                      className="h-5 w-5 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-signal"
                      aria-hidden="true"
                    />
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {totalPages > 1 && (
            <nav
              aria-label="Pagination"
              className="mt-12 flex items-center justify-center gap-2"
            >
              <button
                type="button"
                onClick={() => setPage((p) => Math.max(p - 1, 1))}
                disabled={page === 1}
                className="label-mono border border-hairline px-4 py-3 disabled:opacity-40"
              >
                Prev
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((n) => (
                <button
                  key={n}
                  type="button"
                  onClick={() => setPage(n)}
                  aria-current={n === page ? "page" : undefined}
                  className={`label-mono h-11 w-11 border transition-colors ${
                    n === page
                      ? "border-signal bg-signal text-signal-ink"
                      : "border-hairline hover:border-foreground"
                  }`}
                >
                  {n}
                </button>
              ))}
              <button
                type="button"
                onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
                disabled={page === totalPages}
                className="label-mono border border-hairline px-4 py-3 disabled:opacity-40"
              >
                Next
              </button>
            </nav>
          )}
        </>
      )}
    </BlogTemplate>
  );
}
