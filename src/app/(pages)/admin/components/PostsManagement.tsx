"use client";

import React, { useState } from "react";
import { CreatePostForm } from "./CreatePostForm";
import { ManagePosts } from "./ManagePosts";
import { CommentsManagement } from "./CommentsManagement";
import { AdminFilters, BlogPostListItem } from "../types";
import { BlogPost, BlogPostFormData, Comment } from "@/types/blog";

interface PostsManagementProps {
  // Post form props
  formData: BlogPostFormData;
  editingPost: BlogPost | null;
  formLoading: boolean;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
  onSubmit: (e: React.FormEvent) => void;
  onReset: () => void;
  
  // Posts management props
  posts: BlogPostListItem[];
  postsLoading: boolean;
  filters: AdminFilters;
  onFiltersChange: (filters: Partial<AdminFilters>) => void;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
  
  // Comments props
  comments: Comment[];
  commentsLoading: boolean;
  onCommentAction: (commentId: string, action: "approved" | "rejected") => void;
  onDeleteComment: (commentId: string) => void;
}

type PostsSubTab = "create" | "manage" | "comments";

export const PostsManagement: React.FC<PostsManagementProps> = ({
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
}) => {
  const [activeSubTab, setActiveSubTab] = useState<PostsSubTab>("manage");

  const subTabs = [
    { id: "manage" as PostsSubTab, label: "Manage Posts", icon: "📋", count: posts.length },
    { id: "create" as PostsSubTab, label: editingPost ? "Edit Post" : "Create Post", icon: "✏️" },
    { id: "comments" as PostsSubTab, label: "Comments", icon: "💬", count: comments.length },
  ];

  // Auto-switch to create tab when editing
  React.useEffect(() => {
    if (editingPost) {
      setActiveSubTab("create");
    }
  }, [editingPost]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Posts Management
          </h2>
          <p className="text-neutral-600 dark:text-neutral-400 mt-1">
            Create, manage, and moderate your blog content
          </p>
        </div>
        
        {/* Quick Stats */}
        <div className="flex items-center gap-4 text-sm">
          <div className="flex items-center gap-2 px-3 py-2 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
            <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
            <span className="text-blue-700 dark:text-blue-300">{posts.length} Posts</span>
          </div>
          <div className="flex items-center gap-2 px-3 py-2 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
            <span className="w-2 h-2 bg-purple-500 rounded-full"></span>
            <span className="text-purple-700 dark:text-purple-300">{comments.length} Comments</span>
          </div>
        </div>
      </div>

      {/* Sub Navigation */}
      <div className="border-b border-neutral-200 dark:border-neutral-700">
        <nav className="flex space-x-8">
          {subTabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveSubTab(tab.id)}
              className={`flex items-center gap-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeSubTab === tab.id
                  ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                  : 'border-transparent text-neutral-500 hover:text-neutral-700 dark:text-neutral-400 dark:hover:text-neutral-300'
              }`}
            >
              <span className="text-lg">{tab.icon}</span>
              <span>{tab.label}</span>
              {tab.count !== undefined && (
                <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                  activeSubTab === tab.id
                    ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300'
                    : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400'
                }`}>
                  {tab.count}
                </span>
              )}
            </button>
          ))}
        </nav>
      </div>

      {/* Content */}
      <div className="bg-white/80 dark:bg-neutral-800/80 backdrop-blur-xl rounded-2xl border border-neutral-200/50 dark:border-neutral-700/50 shadow-xl">
        {activeSubTab === "create" && (
          <div className="p-6">
            <CreatePostForm
              formData={formData}
              editingPost={editingPost}
              loading={formLoading}
              onInputChange={onInputChange}
              onSubmit={onSubmit}
              onReset={onReset}
            />
          </div>
        )}

        {activeSubTab === "manage" && (
          <div className="p-6">
            <ManagePosts
              posts={posts}
              loading={postsLoading}
              filters={filters}
              onFiltersChange={onFiltersChange}
              onEdit={onEdit}
              onDelete={onDelete}
            />
          </div>
        )}

        {activeSubTab === "comments" && (
          <div className="p-6">
            <CommentsManagement
              comments={comments}
              loading={commentsLoading}
              onCommentAction={onCommentAction}
              onDeleteComment={onDeleteComment}
            />
          </div>
        )}
      </div>

      {/* Quick Actions */}
      {activeSubTab === "manage" && (
        <div className="flex justify-center">
          <button
            onClick={() => setActiveSubTab("create")}
            className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl font-medium shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
          >
            <span className="text-lg">✏️</span>
            Create New Post
          </button>
        </div>
      )}
    </div>
  );
};
