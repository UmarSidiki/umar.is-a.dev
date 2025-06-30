"use client";

import React, { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import LoginForm from "@/components/LoginForm";
import {
  AdminNavigation,
  DashboardStats,
  CreatePostForm,
  ManagePosts,
  CommentsManagement,
} from "./components";
import {
  useAdminData,
  useFormManagement,
  usePostActions,
  useCommentActions,
} from "./hooks";
import { AdminTab, MessageState, AdminFilters } from "./types";

const AdminDashboard = () => {
  const { isAuthenticated, loading: authLoading, logout } = useAuth();
  const [activeTab, setActiveTab] = useState<AdminTab>("dashboard");
  const [message, setMessage] = useState<MessageState | null>(null);
  const [filters, setFilters] = useState<AdminFilters>({
    searchTerm: "",
    selectedCategory: "all",
    selectedStatus: "all",
  });

  // Custom hooks
  const { posts, comments, stats, loading, fetchStats, fetchComments, fetchPosts } = useAdminData();
  const { 
    formData, 
    editingPost, 
    loading: formLoading, 
    handleInputChange, 
    handleSubmit, 
    resetForm, 
    loadPostForEditing 
  } = useFormManagement();
  const { handleEdit, handleDelete } = usePostActions();
  const { handleCommentAction, deleteComment } = useCommentActions();

  // Auto-dismiss messages
  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => setMessage(null), 5000);
      return () => clearTimeout(timer);
    }
  }, [message]);

  // Fetch data based on active tab
  useEffect(() => {
    if (activeTab === "manage") {
      fetchPosts(setMessage);
    } else if (activeTab === "comments") {
      fetchComments(setMessage, logout);
    } else if (activeTab === "dashboard") {
      fetchStats(setMessage, logout);
    }
  }, [activeTab, fetchPosts, fetchComments, fetchStats, logout]);

  // Wrapped handlers for components
  const handleFormSubmit = (e: React.FormEvent) => {
    handleSubmit(e, setMessage, () => {
      if (activeTab === "manage") fetchPosts(setMessage);
      if (activeTab === "dashboard") fetchStats(setMessage, logout);
    }, logout);
  };

  const handlePostEdit = (id: string) => {
    handleEdit(id, loadPostForEditing, setActiveTab, setMessage);
  };

  const handlePostDelete = (id: string) => {
    handleDelete(id, setMessage, () => {
      fetchPosts(setMessage);
      if (activeTab === "dashboard") fetchStats(setMessage, logout);
    }, logout);
  };

  const handleCommentActionWrapper = (commentId: string, action: "approved" | "rejected") => {
    handleCommentAction(commentId, action, setMessage, () => {
      fetchComments(setMessage, logout);
      if (activeTab === "dashboard") fetchStats(setMessage, logout);
    }, logout);
  };

  const handleDeleteCommentWrapper = (commentId: string) => {
    deleteComment(commentId, setMessage, () => {
      fetchComments(setMessage, logout);
      if (activeTab === "dashboard") fetchStats(setMessage, logout);
    }, logout);
  };

  const handleFiltersChange = (newFilters: Partial<AdminFilters>) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  };

  return (
    <>
      {/* Show loading screen while checking authentication */}
      {authLoading && (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-neutral-50 via-white to-neutral-100 dark:from-neutral-900 dark:via-neutral-800 dark:to-neutral-900">
          <div className="text-center">
            <div className="w-16 h-16 bg-gradient-to-br from-amber-500 to-amber-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
              <div className="w-8 h-8 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            </div>
            <p className="text-neutral-600 dark:text-neutral-400">
              Checking authentication...
            </p>
          </div>
        </div>
      )}

      {/* Show login form if not authenticated */}
      {!authLoading && !isAuthenticated && <LoginForm />}

      {/* Show admin dashboard if authenticated */}
      {!authLoading && isAuthenticated && (
        <div className="min-h-screen bg-gradient-to-br from-neutral-50 via-white to-neutral-100 dark:from-neutral-900 dark:via-neutral-800 dark:to-neutral-900 pt-24">
          <div className="container mx-auto px-4 py-4 sm:py-8">
            {/* Navigation */}
            <AdminNavigation
              activeTab={activeTab}
              onTabChange={setActiveTab}
              onLogout={logout}
            />

            {/* Message Display */}
            {message && (
              <div
                className={`relative z-10 mb-6 p-4 rounded-xl border transition-all duration-200 ${
                  message.type === "success"
                    ? "bg-green-50/50 dark:bg-green-900/20 text-green-700 dark:text-green-300 border-green-200/50 dark:border-green-800/50"
                    : "bg-red-50/50 dark:bg-red-900/20 text-red-700 dark:text-red-300 border-red-200/50 dark:border-red-800/50"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span>{message.text}</span>
                  <button
                    onClick={() => setMessage(null)}
                    className="text-current opacity-50 hover:opacity-100 transition-opacity"
                  >
                    ×
                  </button>
                </div>
              </div>
            )}

            {/* Content Area */}
            <div className="relative z-20 bg-white/80 dark:bg-neutral-800/80 backdrop-blur-xl border border-neutral-200/50 dark:border-neutral-700/50 rounded-2xl sm:rounded-3xl shadow-2xl shadow-neutral-200/20 dark:shadow-neutral-900/40">
              {/* Dashboard Tab */}
              {activeTab === "dashboard" && (
                <div className="p-4 sm:p-6 lg:p-8">
                  <DashboardStats stats={stats} loading={loading} />
                </div>
              )}

              {/* Create/Edit Post Tab */}
              {activeTab === "create" && (
                <div className="p-4 sm:p-6 lg:p-8">
                  <CreatePostForm
                    formData={formData}
                    editingPost={editingPost}
                    loading={formLoading}
                    onInputChange={handleInputChange}
                    onSubmit={handleFormSubmit}
                    onReset={resetForm}
                  />
                </div>
              )}

              {/* Manage Posts Tab */}
              {activeTab === "manage" && (
                <div className="p-4 sm:p-6 lg:p-8">
                  <ManagePosts
                    posts={posts}
                    loading={loading}
                    filters={filters}
                    onFiltersChange={handleFiltersChange}
                    onEdit={handlePostEdit}
                    onDelete={handlePostDelete}
                  />
                </div>
              )}

              {/* Comments Tab */}
              {activeTab === "comments" && (
                <div className="p-4 sm:p-6 lg:p-8">
                  <CommentsManagement
                    comments={comments}
                    loading={loading}
                    onCommentAction={handleCommentActionWrapper}
                    onDeleteComment={handleDeleteCommentWrapper}
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default AdminDashboard;
