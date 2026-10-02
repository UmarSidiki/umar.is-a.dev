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
  "min-h-11 border border-hairline bg-transparent px-3 pr-8 text-base text-foreground focus:border-signal focus:outline-none";

function PostFallback({ label }: { label: string }) {
  return (
    <span
      aria-hidden="true"
      className="flex h-full w-full items-center justify-center bg-background"
    >
      <span className="index-numeral index-hollow text-5xl sm:text-7xl">
        {label.slice(0, 1).toUpperCase() || "✳"}
      </span>
    </span>
  );
}

function FeaturedPost({
  post,
  formatDate,
}: {
  post: BlogPost;
  formatDate: (value: string) => string;
}) {
  return (
    <article className="border-t border-hairline pt-8">
      <span className="label-mono text-signal">Latest</span>
      <Link
        href={`/blog/${post.slug}`}
        className="group mt-4 grid gap-6 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,1fr)] lg:gap-12"
      >
        <span className="relative block aspect-[16/10] overflow-hidden border border-hairline">
          {post.featuredImage ? (
            <Image
              src={post.featuredImage}
              alt={post.title}
              fill
              sizes="(max-width: 1024px) 100vw, 55vw"
              className="object-cover transition-transform duration-700 group-hover:scale-[1.03]"
            />
          ) : (
            <PostFallback label={post.category || post.title} />
          )}
        </span>

        <span className="flex flex-col justify-between gap-8">
          <span className="block">
            <span className="flex flex-wrap items-center justify-between gap-3">
              <span className="label-mono text-ink-soft">{post.category}</span>
              <span className="label-mono text-ink-soft">
                {formatDate(post.createdAt.toString())}
              </span>
            </span>
            <span className="mt-4 block font-display text-2xl font-bold leading-[1.08] tracking-tight transition-colors group-hover:text-signal sm:text-4xl">
              {post.title}
            </span>
            <span className="mt-4 line-clamp-3 block text-base leading-relaxed text-ink-soft">
              {post.excerpt}
            </span>
            {post.tags && post.tags.length > 0 && (
              <span className="mt-5 flex flex-wrap gap-2">
                {post.tags.slice(0, 4).map((tag) => (
                  <span
                    key={tag}
                    className="label-mono border border-hairline px-2 py-1 text-ink-soft"
                  >
                    #{tag}
                  </span>
                ))}
              </span>
            )}
          </span>

          <span className="flex items-center justify-between gap-4 border-t border-hairline pt-4">
            <span className="label-mono text-ink-soft">
              {post.readTime ? `${post.readTime} min read` : post.author}
            </span>
            <span className="tap label-mono text-signal">
              Read
              <ArrowUpRight
                className="h-4 w-4 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                aria-hidden="true"
              />
            </span>
          </span>
        </span>
      </Link>
    </article>
  );
}

function PostRow({
  post,
  formatDate,
}: {
  post: BlogPost;
  formatDate: (value: string) => string;
}) {
  return (
    <li>
      <Link
        href={`/blog/${post.slug}`}
        className="group grid min-h-11 grid-cols-[5rem_1fr] items-center gap-4 border-b border-hairline py-4 transition-colors hover:bg-signal/5 sm:grid-cols-[8rem_1fr_auto] sm:gap-6"
      >
        <span className="relative block aspect-[16/10] w-full overflow-hidden border border-hairline">
          {post.featuredImage ? (
            <Image
              src={post.featuredImage}
              alt=""
              fill
              sizes="(max-width: 640px) 80px, 128px"
              className="object-cover transition-transform duration-700 group-hover:scale-105"
            />
          ) : (
            <PostFallback label={post.category || post.title} />
          )}
        </span>

        <span className="min-w-0">
          <span className="label-mono flex flex-wrap items-center gap-x-3 text-ink-soft">
            {post.category}
            <span aria-hidden="true">·</span>
            {formatDate(post.createdAt.toString())}
          </span>
          <span className="mt-1 block font-display text-lg font-bold leading-snug tracking-tight transition-colors group-hover:text-signal sm:text-2xl">
            {post.title}
          </span>
        </span>

        <ArrowUpRight
          className="hidden h-5 w-5 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-signal sm:block"
          aria-hidden="true"
        />
      </Link>
    </li>
  );
}

function SkeletonFeatured() {
  return (
    <div
      className="animate-pulse space-y-6 border-t border-hairline pt-8 lg:grid lg:grid-cols-[minmax(0,1.05fr)_minmax(0,1fr)] lg:gap-12"
      aria-hidden="true"
    >
      <div className="aspect-[16/10] border border-hairline bg-muted" />
      <div className="space-y-4">
        <div className="h-3 w-24 bg-muted" />
        <div className="h-8 w-4/5 bg-muted" />
        <div className="h-3 w-full bg-muted" />
        <div className="h-3 w-2/3 bg-muted" />
      </div>
    </div>
  );
}

function SkeletonRows() {
  return (
    <ul className="space-y-6 border-t border-hairline pt-6" aria-hidden="true">
      {Array.from({ length: 3 }).map((_, i) => (
        <li key={i} className="flex animate-pulse items-center gap-4">
          <div className="aspect-[16/10] w-20 border border-hairline bg-muted sm:w-32" />
          <div className="flex-1 space-y-3">
            <div className="h-3 w-24 bg-muted" />
            <div className="h-4 w-3/4 bg-muted" />
          </div>
        </li>
      ))}
    </ul>
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
  /* The first item of the page leads as the featured row, everything after it
     becomes a full-width list row — so 1 post is just the lead, 2 is lead + 1
     row, and there is never a half-empty grid cell. */
  const featured = paginated[0];
  const rest = paginated.slice(1);

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
        <div className="mt-10 space-y-12">
          <SkeletonFeatured />
          <SkeletonRows />
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
          <FeaturedPost post={featured} formatDate={formatDate} />

          {rest.length > 0 && (
            <ul className="mt-14 border-t border-hairline">
              {rest.map((post) => (
                <PostRow key={post._id?.toString()} post={post} formatDate={formatDate} />
              ))}
            </ul>
          )}

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
