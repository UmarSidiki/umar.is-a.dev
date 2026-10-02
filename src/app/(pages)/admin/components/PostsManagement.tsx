"use client";

import React, { useState } from "react";
import { CreatePostForm } from "./CreatePostForm";
import { ManagePosts } from "./ManagePosts";
import { CommentsManagement } from "./CommentsManagement";
import { AdminFilters, BlogPostListItem } from "../types";
import { BlogPost, BlogPostFormData, Comment } from "@/types/blog";

interface PostsManagementProps {
  formData: BlogPostFormData;
  editingPost: BlogPost | null;
  formLoading: boolean;
  onInputChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => void;
  onSubmit: (e: React.FormEvent) => void;
  onReset: () => void;
  posts: BlogPostListItem[];
  postsLoading: boolean;
  filters: AdminFilters;
  onFiltersChange: (filters: Partial<AdminFilters>) => void;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
  comments: Comment[];
  commentsLoading: boolean;
  onCommentAction: (commentId: string, action: "approved" | "rejected") => void;
  onDeleteComment: (commentId: string) => void;
}

type PostsSubTab = "manage" | "create" | "comments";

export function PostsManagement({
  formData,
  editingPost,
  formLoading,
  onInputChange,
  onSubmit,
  onReset,
  posts,
  postsLoading,
  filters,
  onFiltersChange,
  onEdit,
  onDelete,
  comments,
  commentsLoading,
  onCommentAction,
  onDeleteComment,
}: PostsManagementProps) {
  const [activeSubTab, setActiveSubTab] = useState<PostsSubTab>("manage");

  const subTabs: { id: PostsSubTab; label: string; count?: number }[] = [
    { id: "manage", label: "Manage posts", count: posts.length },
    { id: "create", label: editingPost ? "Edit post" : "Create post" },
    { id: "comments", label: "Comments", count: comments.length },
  ];

  React.useEffect(() => {
    if (editingPost) setActiveSubTab("create");
  }, [editingPost]);

  return (
    <div className="space-y-8">
      <div>
        <span className="label-mono text-ink-soft">Content</span>
        <h2 className="display-lg mt-2 text-foreground">Posts</h2>
      </div>

      <nav aria-label="Post sections" className="border-b border-hairline">
        <ul className="flex gap-1 overflow-x-auto scrollbar-hide">
          {subTabs.map((tab) => (
            <li key={tab.id}>
              <button
                type="button"
                onClick={() => setActiveSubTab(tab.id)}
                aria-current={activeSubTab === tab.id ? "page" : undefined}
                className={`inline-flex h-12 items-center gap-2 whitespace-nowrap border-b-2 px-4 text-sm font-medium transition-colors ${
                  activeSubTab === tab.id
                    ? "border-signal text-signal"
                    : "border-transparent text-ink-soft hover:text-foreground"
                }`}
              >
                {tab.label}
                {tab.count !== undefined && (
                  <span className="label-mono text-ink-soft">{tab.count}</span>
                )}
              </button>
            </li>
          ))}
        </ul>
      </nav>

      {activeSubTab === "create" && (
        <CreatePostForm
          formData={formData}
          editingPost={editingPost}
          loading={formLoading}
          onInputChange={onInputChange}
          onSubmit={onSubmit}
          onReset={onReset}
        />
      )}

      {activeSubTab === "manage" && (
        <ManagePosts
          posts={posts}
          loading={postsLoading}
          filters={filters}
          onFiltersChange={onFiltersChange}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      )}

      {activeSubTab === "comments" && (
        <CommentsManagement
          comments={comments}
          loading={commentsLoading}
          onCommentAction={onCommentAction}
          onDeleteComment={onDeleteComment}
        />
      )}
    </div>
  );
}
