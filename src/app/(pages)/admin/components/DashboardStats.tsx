"use client";

import React from "react";
import { CheckCircle2, FileText, MessageSquare, PenLine } from "lucide-react";
import { DashboardStats as DashboardStatsType } from "../types";

interface DashboardStatsProps {
  stats: DashboardStatsType;
  loading: boolean;
}

export function DashboardStats({ stats, loading }: DashboardStatsProps) {
  if (loading) {
    return (
      <div className="space-y-10">
        <div className="grid grid-cols-2 gap-px border border-hairline bg-hairline lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="animate-pulse space-y-4 bg-background p-6">
              <div className="h-4 w-16 bg-muted" />
              <div className="h-8 w-24 bg-muted" />
            </div>
          ))}
        </div>
        <div className="grid gap-10 lg:grid-cols-2">
          {Array.from({ length: 2 }).map((_, i) => (
            <div key={i} className="animate-pulse space-y-4 border border-hairline p-6">
              <div className="h-5 w-32 bg-muted" />
              <div className="h-16 w-full bg-muted" />
              <div className="h-16 w-full bg-muted" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  const cards = [
    { label: "Total posts", value: stats.totalPosts, Icon: FileText },
    { label: "Published", value: stats.publishedPosts, Icon: CheckCircle2 },
    { label: "Drafts", value: stats.draftPosts, Icon: PenLine },
    { label: "Comments", value: stats.totalComments, Icon: MessageSquare },
  ];

  return (
    <div className="space-y-12">
      <div className="grid grid-cols-2 gap-px border border-hairline bg-hairline lg:grid-cols-4">
        {cards.map(({ label, value, Icon }) => (
          <div key={label} className="bg-background p-6">
            <div className="flex items-center justify-between">
              <span className="label-mono text-ink-soft">{label}</span>
              <Icon className="h-4 w-4 text-signal" aria-hidden="true" />
            </div>
            <p className="index-numeral mt-6 text-4xl text-foreground sm:text-5xl">
              {value.toLocaleString()}
            </p>
          </div>
        ))}
      </div>

      <p className="label-mono text-ink-soft">
        {stats.pendingComments} comment{stats.pendingComments === 1 ? "" : "s"} awaiting moderation
      </p>

      <div className="grid gap-10 lg:grid-cols-2">
        <section className="border border-hairline">
          <div className="flex items-center justify-between border-b border-hairline p-5">
            <h2 className="font-display text-lg font-bold">Recent posts</h2>
          </div>
          <div className="p-5">
            {stats.recentPosts.length > 0 ? (
              <ul className="[&>li]:border-b [&>li]:border-hairline [&>li:last-child]:border-0">
                {stats.recentPosts.slice(0, 5).map((post, i) => (
                  <li key={`${post.slug}-${i}`} className="flex items-center gap-4 py-4">
                    <span className="index-numeral text-xl text-ink-soft">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium">{post.title}</p>
                      <p className="label-mono text-ink-soft">
                        {post.category} · {new Date(post.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="py-8 text-sm text-ink-soft">
                No posts yet. Create your first post to see it here.
              </p>
            )}
          </div>
        </section>

        <section className="border border-hairline">
          <div className="border-b border-hairline p-5">
            <h2 className="font-display text-lg font-bold">Top categories</h2>
          </div>
          <div className="p-5">
            {stats.topCategories.length > 0 ? (
              <ul className="space-y-4">
                {stats.topCategories.slice(0, 5).map((category) => (
                  <li key={category.name} className="flex items-center justify-between gap-4">
                    <span className="text-sm">{category.name}</span>
                    <span className="label-mono text-ink-soft">{category.posts} posts</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="py-8 text-sm text-ink-soft">No categories yet.</p>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}
