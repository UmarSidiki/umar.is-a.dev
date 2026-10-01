"use client";

import React, { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import LoginForm from "@/components/LoginForm";
import {
  AdminShell,
  DashboardStats,
  PostsManagement,
  ProjectsManagement,
  ImageManagement,
} from "./components";
import {
  useAdminData,
  useFormManagement,
  usePostActions,
  useCommentActions,
  useProjectFormManagement,
  useProjectActions,
} from "./hooks";
import { AdminTab, MessageState, AdminFilters, Project } from "./types";

export default function AdminDashboard() {
  const { isAuthenticated, loading: authLoading, logout } = useAuth();
  const [activeTab, setActiveTab] = useState<AdminTab>("dashboard");
  const [message, setMessage] = useState<MessageState | null>(null);
  const [filters, setFilters] = useState<AdminFilters>({
    searchTerm: "",
    selectedCategory: "all",
    selectedStatus: "all",
  });

  const {
    posts,
    comments,
    projects,
    stats,
    loading,
    fetchStats,
    fetchComments,
    fetchPosts,
    fetchProjects,
  } = useAdminData();
  const {
    formData,
    editingPost,
    loading: formLoading,
    handleInputChange,
    handleSubmit,
    resetForm,
    loadPostForEditing,
  } = useFormManagement();
  const {
    formData: projectFormData,
    editingProject,
    loading: projectFormLoading,
    handleInputChange: handleProjectInputChange,
    handleSubmit: handleProjectSubmit,
    resetForm: resetProjectForm,
    loadProjectForEditing,
  } = useProjectFormManagement();
  const { handleEdit, handleDelete } = usePostActions();
  const { handleDelete: handleProjectDelete } = useProjectActions();
  const { handleCommentAction, deleteComment } = useCommentActions();

  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => setMessage(null), 5000);
      return () => clearTimeout(timer);
    }
  }, [message]);

  useEffect(() => {
    if (activeTab === "posts") {
      fetchPosts(setMessage);
      fetchComments(setMessage, logout);
    } else if (activeTab === "dashboard") {
      fetchStats(setMessage, logout);
    } else if (activeTab === "projects") {
      fetchProjects(setMessage, logout);
    }
  }, [activeTab, fetchPosts, fetchComments, fetchStats, fetchProjects, logout]);

  const handleFormSubmit = (e: React.FormEvent) => {
    handleSubmit(
      e,
      setMessage,
      () => {
        if (activeTab === "posts") fetchPosts(setMessage);
        if (activeTab === "dashboard") fetchStats(setMessage, logout);
      },
      logout
    );
  };

  const handleProjectFormSubmit = async (e: React.FormEvent) => {
    const result = await handleProjectSubmit(e);
    setMessage({ type: result.success ? "success" : "error", text: result.message });
    if (result.success) {
      resetProjectForm();
      fetchProjects(setMessage, logout);
      if (activeTab === "dashboard") fetchStats(setMessage, logout);
    }
  };

  const handlePostEdit = (id: string) => {
    handleEdit(id, loadPostForEditing, () => {}, setMessage);
  };

  const handlePostDelete = (id: string) => {
    handleDelete(
      id,
      setMessage,
      () => {
        fetchPosts(setMessage);
        if (activeTab === "dashboard") fetchStats(setMessage, logout);
      },
      logout
    );
  };

  const handleCommentActionWrapper = (
    commentId: string,
    action: "approved" | "rejected"
  ) => {
    handleCommentAction(
      commentId,
      action,
      setMessage,
      () => {
        fetchComments(setMessage, logout);
        if (activeTab === "dashboard") fetchStats(setMessage, logout);
      },
      logout
    );
  };

  const handleDeleteCommentWrapper = (commentId: string) => {
    deleteComment(
      commentId,
      setMessage,
      () => {
        fetchComments(setMessage, logout);
        if (activeTab === "dashboard") fetchStats(setMessage, logout);
      },
      logout
    );
  };

  const handleFiltersChange = (newFilters: Partial<AdminFilters>) => {
    setFilters((prev) => ({ ...prev, ...newFilters }));
  };

  const handleProjectEditWrapper = (project: Project) => {
    loadProjectForEditing(project);
  };

  const handleProjectDeleteWrapper = async (id: string) => {
    const result = await handleProjectDelete(id);
    setMessage({ type: result.success ? "success" : "error", text: result.message });
    if (result.success) {
      fetchProjects(setMessage, logout);
      if (activeTab === "dashboard") fetchStats(setMessage, logout);
    }
  };

  return (
    <>
      {authLoading && (
        <div className="flex min-h-screen items-center justify-center">
          <p className="label-mono text-ink-soft">Checking authentication…</p>
        </div>
      )}

      {!authLoading && !isAuthenticated && <LoginForm />}

      {!authLoading && isAuthenticated && (
        <AdminShell
          activeTab={activeTab}
          onTabChange={setActiveTab}
          onLogout={logout}
        >
          {message && (
            <div
              role="status"
              className={`mb-6 flex items-center justify-between gap-4 border px-4 py-3 text-sm ${
                message.type === "success"
                  ? "border-signal/40 bg-signal/5 text-foreground"
                  : "border-destructive/40 bg-destructive/5 text-destructive"
              }`}
            >
              <span>{message.text}</span>
              <button
                type="button"
                onClick={() => setMessage(null)}
                aria-label="Dismiss message"
                className="label-mono shrink-0 opacity-70 transition-opacity hover:opacity-100"
              >
                Dismiss
              </button>
            </div>
          )}

          <div>
            {activeTab === "dashboard" && <DashboardStats stats={stats} loading={loading} />}

            {activeTab === "posts" && (
              <PostsManagement
                formData={formData}
                editingPost={editingPost}
                formLoading={formLoading}
                onInputChange={handleInputChange}
                onSubmit={handleFormSubmit}
                onReset={resetForm}
                posts={posts}
                postsLoading={loading}
                filters={filters}
                onFiltersChange={handleFiltersChange}
                onEdit={handlePostEdit}
                onDelete={handlePostDelete}
                comments={comments}
                commentsLoading={loading}
                onCommentAction={handleCommentActionWrapper}
                onDeleteComment={handleDeleteCommentWrapper}
              />
            )}

            {activeTab === "projects" && (
              <ProjectsManagement
                formData={projectFormData}
                editingProject={editingProject}
                formLoading={projectFormLoading}
                onInputChange={handleProjectInputChange}
                onSubmit={handleProjectFormSubmit}
                onReset={resetProjectForm}
                projects={projects}
                projectsLoading={loading}
                onEdit={handleProjectEditWrapper}
                onDelete={handleProjectDeleteWrapper}
              />
            )}

            {activeTab === "images" && <ImageManagement />}
          </div>
        </AdminShell>
      )}
    </>
  );
}
