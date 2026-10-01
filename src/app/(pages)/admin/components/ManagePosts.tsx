"use client";

import React from "react";
import { Pencil, Trash2 } from "lucide-react";
import { AdminFilters, BlogPostListItem } from "../types";
import { categories } from "../utils/helpers";

interface ManagePostsProps {
  posts: BlogPostListItem[];
  loading: boolean;
  filters: AdminFilters;
  onFiltersChange: (filters: Partial<AdminFilters>) => void;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
}

const controlClass =
  "w-full border border-hairline bg-transparent px-3 py-2.5 text-sm text-foreground focus:border-signal focus:outline-none";

function StatusBadge({ status }: { status: string }) {
  return (
    <span
      className={`label-mono inline-flex items-center gap-1.5 ${
        status === "published" ? "text-signal" : "text-ink-soft"
      }`}
    >
      <span
        aria-hidden="true"
        className={`h-1.5 w-1.5 rounded-full ${
          status === "published" ? "bg-signal" : "bg-ink-soft"
        }`}
      />
      {status}
    </span>
  );
}

export function ManagePosts({
  posts,
  loading,
  filters,
  onFiltersChange,
  onEdit,
  onDelete,
}: ManagePostsProps) {
  const filteredPosts = posts.filter((post) => {
    const term = filters.searchTerm.toLowerCase();
    const matchesSearch =
      post.title.toLowerCase().includes(term) ||
      post.category.toLowerCase().includes(term) ||
      post.author.toLowerCase().includes(term);
    const matchesCategory =
      filters.selectedCategory === "all" || post.category === filters.selectedCategory;
    const matchesStatus =
      filters.selectedStatus === "all" || post.status === filters.selectedStatus;
    return matchesSearch && matchesCategory && matchesStatus;
  });

  return (
    <div className="space-y-6">
      <div className="grid gap-4 border border-hairline p-4 sm:grid-cols-3">
        <div>
          <label htmlFor="filter-search" className="label-mono mb-2 block text-ink-soft">
            Search
          </label>
          <input
            id="filter-search"
            type="search"
            value={filters.searchTerm}
            onChange={(e) => onFiltersChange({ searchTerm: e.target.value })}
            placeholder="Title, author, category"
            className={controlClass}
          />
        </div>
        <div>
          <label htmlFor="filter-category" className="label-mono mb-2 block text-ink-soft">
            Category
          </label>
          <select
            id="filter-category"
            value={filters.selectedCategory}
            onChange={(e) => onFiltersChange({ selectedCategory: e.target.value })}
            className={controlClass}
          >
            <option value="all">All categories</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="filter-status" className="label-mono mb-2 block text-ink-soft">
            Status
          </label>
          <select
            id="filter-status"
            value={filters.selectedStatus}
            onChange={(e) => onFiltersChange({ selectedStatus: e.target.value })}
            className={controlClass}
          >
            <option value="all">All statuses</option>
            <option value="published">Published</option>
            <option value="draft">Draft</option>
          </select>
        </div>
      </div>

      <p className="label-mono text-ink-soft">
        {filteredPosts.length} of {posts.length} posts
      </p>

      {loading ? (
        <p className="py-12 text-center text-sm text-ink-soft">Loading posts…</p>
      ) : filteredPosts.length === 0 ? (
        <div className="border border-dashed border-hairline px-6 py-16 text-center">
          <p className="font-display text-xl font-bold">No posts found</p>
          <p className="mt-2 text-sm text-ink-soft">
            {posts.length === 0
              ? "Create your first post to get started."
              : "Try adjusting your search or filters."}
          </p>
        </div>
      ) : (
        <>
          {/* Desktop table */}
          <div className="hidden overflow-x-auto border border-hairline md:block">
            <table className="w-full text-left text-sm">
              <caption className="sr-only">Blog posts</caption>
              <thead>
                <tr className="border-b border-hairline">
                  <th className="px-4 py-3 font-medium text-ink-soft">Title</th>
                  <th className="px-4 py-3 font-medium text-ink-soft">Category</th>
                  <th className="px-4 py-3 font-medium text-ink-soft">Status</th>
                  <th className="px-4 py-3 font-medium text-ink-soft">Date</th>
                  <th className="px-4 py-3 text-right font-medium text-ink-soft">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredPosts.map((post) => (
                  <tr key={post._id} className="border-b border-hairline last:border-0">
                    <td className="px-4 py-4">
                      <p className="font-medium">{post.title}</p>
                      <p className="text-xs text-ink-soft">by {post.author}</p>
                    </td>
                    <td className="px-4 py-4 text-ink-soft">{post.category}</td>
                    <td className="px-4 py-4">
                      <StatusBadge status={post.status} />
                    </td>
                    <td className="px-4 py-4 text-ink-soft">{post.createdAt}</td>
                    <td className="px-4 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          type="button"
                          onClick={() => onEdit(post._id)}
                          aria-label={`Edit ${post.title}`}
                          className="inline-flex h-10 w-10 items-center justify-center border border-hairline transition-colors hover:border-signal hover:text-signal"
                        >
                          <Pencil className="h-4 w-4" aria-hidden="true" />
                        </button>
                        <button
                          type="button"
                          onClick={() => onDelete(post._id)}
                          aria-label={`Delete ${post.title}`}
                          className="inline-flex h-10 w-10 items-center justify-center border border-hairline transition-colors hover:border-destructive hover:text-destructive"
                        >
                          <Trash2 className="h-4 w-4" aria-hidden="true" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile cards */}
          <ul className="space-y-4 md:hidden">
            {filteredPosts.map((post) => (
              <li key={post._id} className="border border-hairline p-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="font-medium">{post.title}</p>
                    <p className="label-mono mt-1 text-ink-soft">
                      {post.category} · {post.createdAt}
                    </p>
                  </div>
                  <StatusBadge status={post.status} />
                </div>
                <div className="mt-4 flex gap-2">
                  <button
                    type="button"
                    onClick={() => onEdit(post._id)}
                    className="label-mono flex h-11 flex-1 items-center justify-center gap-2 border border-hairline transition-colors hover:border-signal hover:text-signal"
                  >
                    <Pencil className="h-4 w-4" aria-hidden="true" />
                    Edit
                  </button>
                  <button
                    type="button"
                    onClick={() => onDelete(post._id)}
                    className="label-mono flex h-11 flex-1 items-center justify-center gap-2 border border-hairline transition-colors hover:border-destructive hover:text-destructive"
                  >
                    <Trash2 className="h-4 w-4" aria-hidden="true" />
                    Delete
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
}
