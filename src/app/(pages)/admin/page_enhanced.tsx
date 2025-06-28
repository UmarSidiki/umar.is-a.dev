"use client";

import React, { useState, useEffect } from "react";
import { BlogPost, BlogPostFormData, Comment } from "@/types/blog";

interface BlogPostListItem {
  _id: string;
  title: string;
  status: "draft" | "published";
  createdAt: string;
  author: string;
  category: string;
  commentCount?: number;
  slug: string;
}

interface DashboardStats {
  totalPosts: number;
  publishedPosts: number;
  draftPosts: number;
  totalComments: number;
  pendingComments: number;
  recentPosts: Array<{ title: string; slug: string; category: string; createdAt: string }>;
  recentActivity: Array<{ type: string; content: string; timestamp: string }>;
  topCategories: Array<{ name: string; posts: number }>;
}

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState<
    "dashboard" | "create" | "manage" | "comments"
  >("dashboard");
  const [posts, setPosts] = useState<BlogPostListItem[]>([]);
  const [comments, setComments] = useState<Comment[]>([]);
  const [stats, setStats] = useState<DashboardStats>({
    totalPosts: 0,
    publishedPosts: 0,
    draftPosts: 0,
    totalComments: 0,
    pendingComments: 0,
    recentPosts: [],
    recentActivity: [],
    topCategories: [],
  });

  const [editingPost, setEditingPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  const [formData, setFormData] = useState<BlogPostFormData>({
    title: "",
    content: "",
    excerpt: "",
    author: "Umar Siddiqui",
    tags: "",
    category: "",
    status: "draft",
    featuredImage: "",
    commentsEnabled: true,
  });

  const categories = [
    "Technology",
    "Web Development",
    "React",
    "Next.js",
    "JavaScript",
    "Tutorial",
    "Personal",
  ];

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
      fetchPosts();
    } else if (activeTab === "comments") {
      fetchComments();
    } else if (activeTab === "dashboard") {
      fetchStats();
    }
  }, [activeTab]);

  const fetchStats = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/analytics');
      const result = await response.json();
      
      if (result.success) {
        setStats(result.data);
      }
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchComments = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/comments?all=true");
      const result = await response.json();

      if (result.success) {
        setComments(result.data);
      }
    } catch (error) {
      console.error("Error fetching comments:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchPosts = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/blog?limit=100");
      const result = await response.json();

      if (result.success) {
        setPosts(
          result.data.map((post: BlogPost) => ({
            _id: post._id?.toString() || "",
            title: post.title,
            status: post.status,
            createdAt: new Date(post.createdAt).toLocaleDateString(),
            author: post.author,
            category: post.category,
            slug: post.slug,
            commentCount: Math.floor(Math.random() * 20), // Mock comment count
          }))
        );
      }
    } catch (error) {
      console.error("Error fetching posts:", error);
      setMessage({ type: "error", text: "Failed to fetch posts" });
    } finally {
      setLoading(false);
    }
  };

  const handleCommentAction = async (
    commentId: string,
    action: "approved" | "rejected"
  ) => {
    try {
      const response = await fetch("/api/comments", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ commentId, status: action }),
      });

      const result = await response.json();

      if (result.success) {
        setMessage({
          type: "success",
          text: `Comment ${action} successfully!`,
        });
        fetchComments();
        if (activeTab === "dashboard") fetchStats();
      } else {
        setMessage({
          type: "error",
          text: result.error || `Failed to ${action} comment`,
        });
      }
    } catch (error) {
      console.error(`Error ${action} comment:`, error);
      setMessage({ type: "error", text: `Failed to ${action} comment` });
    }
  };

  const deleteComment = async (commentId: string) => {
    if (!confirm("Are you sure you want to delete this comment?")) return;

    try {
      const response = await fetch(`/api/comments?id=${commentId}`, {
        method: "DELETE",
      });
      const result = await response.json();

      if (result.success) {
        setMessage({ type: "success", text: "Comment deleted successfully!" });
        fetchComments();
        if (activeTab === "dashboard") fetchStats();
      } else {
        setMessage({
          type: "error",
          text: result.error || "Failed to delete comment",
        });
      }
    } catch (error) {
      console.error("Error deleting comment:", error);
      setMessage({ type: "error", text: "Failed to delete comment" });
    }
  };

  // Enhanced filtering for posts
  const filteredPosts = posts.filter((post) => {
    const matchesSearch =
      post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.author.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCategory =
      selectedCategory === "all" || post.category === selectedCategory;
    const matchesStatus =
      selectedStatus === "all" || post.status === selectedStatus;

    return matchesSearch && matchesCategory && matchesStatus;
  });

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value, type } = e.target;

    if (type === "checkbox") {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData((prev) => ({ ...prev, [name]: checked }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (
      !formData.title.trim() ||
      !formData.content.trim() ||
      !formData.excerpt.trim()
    ) {
      setMessage({ type: "error", text: "Please fill in all required fields" });
      return;
    }

    try {
      setLoading(true);

      const endpoint = "/api/blog";
      const method = editingPost ? "PUT" : "POST";
      const body = editingPost
        ? { ...formData, id: editingPost._id }
        : formData;

      const response = await fetch(endpoint, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const result = await response.json();

      if (result.success) {
        setMessage({
          type: "success",
          text: editingPost
            ? "Post updated successfully!"
            : "Post created successfully!",
        });

        // Reset form
        resetForm();

        // Refresh data
        if (activeTab === "manage") fetchPosts();
        if (activeTab === "dashboard") fetchStats();
      } else {
        setMessage({
          type: "error",
          text: result.error || "Failed to save post",
        });
      }
    } catch (error) {
      console.error("Error saving post:", error);
      setMessage({ type: "error", text: "Failed to save post" });
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      title: "",
      content: "",
      excerpt: "",
      author: "Umar Siddiqui",
      tags: "",
      category: "",
      status: "draft",
      featuredImage: "",
      commentsEnabled: true,
    });
    setEditingPost(null);
  };

  const handleEdit = async (id: string) => {
    try {
      setLoading(true);
      const response = await fetch(`/api/blog?id=${id}`);
      const result = await response.json();

      if (result.success) {
        const post = result.data;
        setFormData({
          title: post.title,
          content: post.content,
          excerpt: post.excerpt,
          author: post.author,
          tags: post.tags.join(", "),
          category: post.category,
          status: post.status,
          featuredImage: post.featuredImage || "",
          commentsEnabled:
            post.commentsEnabled !== undefined ? post.commentsEnabled : true,
        });
        setEditingPost(post);
        setActiveTab("create");
      }
    } catch (error) {
      console.error("Error fetching post:", error);
      setMessage({ type: "error", text: "Failed to load post for editing" });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this post?")) return;

    try {
      setLoading(true);
      const response = await fetch(`/api/blog?id=${id}`, { method: "DELETE" });
      const result = await response.json();

      if (result.success) {
        setMessage({ type: "success", text: "Post deleted successfully!" });
        fetchPosts();
        if (activeTab === "dashboard") fetchStats();
      } else {
        setMessage({
          type: "error",
          text: result.error || "Failed to delete post",
        });
      }
    } catch (error) {
      console.error("Error deleting post:", error);
      setMessage({ type: "error", text: "Failed to delete post" });
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-50 via-white to-neutral-100 dark:from-neutral-900 dark:via-neutral-800 dark:to-neutral-900">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-neutral-900 dark:text-white mb-2">
            Admin Dashboard
          </h1>
          <p className="text-neutral-600 dark:text-neutral-400">
            Manage your blog content, comments, and monitor website analytics
          </p>
        </div>

        {/* Message Display */}
        {message && (
          <div
            className={`mb-6 p-4 rounded-xl border transition-all duration-200 ${
              message.type === "success"
                ? "bg-green-50/50 dark:bg-green-900/20 text-green-700 dark:text-green-300 border-green-200/50 dark:border-green-800/50"
                : "bg-red-50/50 dark:bg-red-900/20 text-red-700 dark:text-red-300 border-red-200/50 dark:border-red-800/50"
            }`}
          >
            <div className="flex items-center justify-between">
              <span>{message.text}</span>
              <button
                onClick={() => setMessage(null)}
                className="text-current hover:opacity-70 transition-opacity"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
          </div>
        )}

        {/* Navigation Tabs */}
        <div className="mb-8">
          <div className="flex space-x-1 bg-neutral-100/50 dark:bg-neutral-800/50 p-1 rounded-xl backdrop-blur-sm">
            {[
              { id: "dashboard", label: "Dashboard", icon: "📊" },
              {
                id: "create",
                label: editingPost ? "Edit Post" : "Create Post",
                icon: "✏️",
              },
              { id: "manage", label: "Manage Posts", icon: "📝" },
              { id: "comments", label: "Comments", icon: "💬" },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center space-x-2 px-6 py-3 rounded-lg font-medium text-sm transition-all duration-200 ${
                  activeTab === tab.id
                    ? "bg-amber-500 text-white shadow-lg"
                    : "text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-200 hover:bg-white/50 dark:hover:bg-neutral-700/50"
                }`}
              >
                <span>{tab.icon}</span>
                <span>{tab.label}</span>
                {tab.id === "comments" && stats.pendingComments > 0 && (
                  <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                    {stats.pendingComments}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Content Area */}
        <div className="bg-white/80 dark:bg-neutral-800/80 backdrop-blur-xl border border-neutral-200/50 dark:border-neutral-700/50 rounded-3xl shadow-2xl shadow-neutral-200/20 dark:shadow-neutral-900/40">
          {/* Dashboard Tab */}
          {activeTab === "dashboard" && (
            <div className="p-8">
              <h2 className="text-2xl font-bold text-neutral-900 dark:text-white mb-8">
                Website Overview
              </h2>

              {loading ? (
                <div className="text-center py-12">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-500 mx-auto"></div>
                  <p className="mt-4 text-neutral-600 dark:text-neutral-400">
                    Loading dashboard...
                  </p>
                </div>
              ) : (
                <div className="space-y-8">
                  {/* Stats Cards */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <div className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 p-6 rounded-2xl border border-blue-200/50 dark:border-blue-800/50">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-blue-600 dark:text-blue-400 text-sm font-medium">
                            Total Posts
                          </p>
                          <p className="text-3xl font-bold text-blue-800 dark:text-blue-200">
                            {stats.totalPosts}
                          </p>
                        </div>
                        <div className="text-blue-500 text-2xl">📝</div>
                      </div>
                    </div>

                    <div className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 p-6 rounded-2xl border border-green-200/50 dark:border-green-800/50">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-green-600 dark:text-green-400 text-sm font-medium">
                            Published
                          </p>
                          <p className="text-3xl font-bold text-green-800 dark:text-green-200">
                            {stats.publishedPosts}
                          </p>
                        </div>
                        <div className="text-green-500 text-2xl">✅</div>
                      </div>
                    </div>

                    <div className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 p-6 rounded-2xl border border-purple-200/50 dark:border-purple-800/50">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-purple-600 dark:text-purple-400 text-sm font-medium">
                            Comments
                          </p>
                          <p className="text-3xl font-bold text-purple-800 dark:text-purple-200">
                            {stats.totalComments}
                          </p>
                        </div>
                        <div className="text-purple-500 text-2xl">💬</div>
                      </div>
                    </div>

                    <div className="bg-gradient-to-br from-amber-50 to-amber-100 dark:from-amber-900/20 dark:to-amber-800/20 p-6 rounded-2xl border border-amber-200/50 dark:border-amber-800/50">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-amber-600 dark:text-amber-400 text-sm font-medium">
                            Total Views
                          </p>
                          <p className="text-3xl font-bold text-amber-800 dark:text-amber-200">
                            {stats.totalViews.toLocaleString()}
                          </p>
                        </div>
                        <div className="text-amber-500 text-2xl">👁️</div>
                      </div>
                    </div>
                  </div>

                  {/* Charts and Additional Info */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Popular Posts */}
                    <div className="bg-neutral-50/50 dark:bg-neutral-700/30 rounded-2xl p-6 border border-neutral-200/50 dark:border-neutral-600/50">
                      <h3 className="text-lg font-semibold text-neutral-900 dark:text-white mb-4">
                        Popular Posts
                      </h3>
                      <div className="space-y-3">
                        {stats.popularPosts.map((post, index) => (
                          <div
                            key={index}
                            className="flex items-center justify-between p-3 bg-white/50 dark:bg-neutral-800/50 rounded-lg"
                          >
                            <div className="flex-1">
                              <p className="font-medium text-neutral-900 dark:text-white text-sm">
                                {post.title}
                              </p>
                              <p className="text-xs text-neutral-500 dark:text-neutral-400">
                                /blog/{post.slug}
                              </p>
                            </div>
                            <div className="text-amber-600 dark:text-amber-400 font-semibold text-sm">
                              {post.views} views
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Recent Activity */}
                    <div className="bg-neutral-50/50 dark:bg-neutral-700/30 rounded-2xl p-6 border border-neutral-200/50 dark:border-neutral-600/50">
                      <h3 className="text-lg font-semibold text-neutral-900 dark:text-white mb-4">
                        Recent Activity
                      </h3>
                      <div className="space-y-3">
                        {stats.recentActivity.map((activity, index) => (
                          <div
                            key={index}
                            className="flex items-start space-x-3 p-3 bg-white/50 dark:bg-neutral-800/50 rounded-lg"
                          >
                            <div className="text-lg">
                              {activity.type === "comment"
                                ? "💬"
                                : activity.type === "post"
                                ? "📝"
                                : "⚡"}
                            </div>
                            <div className="flex-1">
                              <p className="text-sm text-neutral-900 dark:text-white">
                                {activity.content}
                              </p>
                              <p className="text-xs text-neutral-500 dark:text-neutral-400">
                                {activity.timestamp}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Quick Actions */}
                  <div className="bg-gradient-to-r from-amber-50 to-amber-100 dark:from-amber-900/20 dark:to-amber-800/20 rounded-2xl p-6 border border-amber-200/50 dark:border-amber-800/50">
                    <h3 className="text-lg font-semibold text-neutral-900 dark:text-white mb-4">
                      Quick Actions
                    </h3>
                    <div className="flex flex-wrap gap-3">
                      <button
                        onClick={() => setActiveTab("create")}
                        className="bg-amber-500 hover:bg-amber-600 text-white px-4 py-2 rounded-lg font-medium text-sm transition-colors"
                      >
                        ✏️ Write New Post
                      </button>
                      <button
                        onClick={() => setActiveTab("comments")}
                        className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg font-medium text-sm transition-colors"
                      >
                        💬 Review Comments ({stats.pendingComments})
                      </button>
                      <button
                        onClick={() => setActiveTab("manage")}
                        className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg font-medium text-sm transition-colors"
                      >
                        📝 Manage Posts
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Create/Edit Post Tab */}
          {activeTab === "create" && (
            <div className="p-8">
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-2xl font-bold text-neutral-900 dark:text-white">
                  {editingPost ? "Edit Post" : "Create New Post"}
                </h2>
                {editingPost && (
                  <button
                    onClick={resetForm}
                    className="bg-neutral-500 hover:bg-neutral-600 text-white px-4 py-2 rounded-lg font-medium text-sm transition-colors"
                  >
                    Cancel Edit
                  </button>
                )}
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Title */}
                <div>
                  <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                    Title *
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-white/60 dark:bg-neutral-800/60 border border-neutral-200 dark:border-neutral-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 text-neutral-900 dark:text-white transition-all"
                    placeholder="Enter an engaging title..."
                    required
                  />
                </div>

                {/* Category, Status, and Comments Toggle */}
                <div className="grid md:grid-cols-3 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                      Category *
                    </label>
                    <select
                      name="category"
                      value={formData.category}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 bg-white/60 dark:bg-neutral-800/60 border border-neutral-200 dark:border-neutral-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 text-neutral-900 dark:text-white"
                      required
                    >
                      <option value="">Select a category</option>
                      {categories.map((cat) => (
                        <option key={cat} value={cat}>
                          {cat}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                      Status
                    </label>
                    <select
                      name="status"
                      value={formData.status}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 bg-white/60 dark:bg-neutral-800/60 border border-neutral-200 dark:border-neutral-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 text-neutral-900 dark:text-white"
                    >
                      <option value="draft">Draft</option>
                      <option value="published">Published</option>
                    </select>
                  </div>

                  <div className="flex items-center">
                    <label className="flex items-center space-x-3">
                      <input
                        type="checkbox"
                        name="commentsEnabled"
                        checked={formData.commentsEnabled}
                        onChange={handleInputChange}
                        className="w-5 h-5 text-amber-500 bg-white border-neutral-300 rounded focus:ring-amber-500"
                      />
                      <span className="text-sm font-medium text-neutral-700 dark:text-neutral-300">
                        Enable Comments
                      </span>
                    </label>
                  </div>
                </div>

                {/* Excerpt */}
                <div>
                  <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                    Excerpt *
                  </label>
                  <textarea
                    name="excerpt"
                    value={formData.excerpt}
                    onChange={handleInputChange}
                    rows={3}
                    className="w-full px-4 py-3 bg-white/60 dark:bg-neutral-800/60 border border-neutral-200 dark:border-neutral-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 text-neutral-900 dark:text-white resize-none"
                    placeholder="Write a compelling excerpt that summarizes your post..."
                    required
                  />
                </div>

                {/* Tags */}
                <div>
                  <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                    Tags
                  </label>
                  <input
                    type="text"
                    name="tags"
                    value={formData.tags}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-white/60 dark:bg-neutral-800/60 border border-neutral-200 dark:border-neutral-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 text-neutral-900 dark:text-white"
                    placeholder="javascript, react, tutorial (comma separated)"
                  />
                </div>

                {/* Featured Image */}
                <div>
                  <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                    Featured Image URL
                  </label>
                  <input
                    type="url"
                    name="featuredImage"
                    value={formData.featuredImage}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-white/60 dark:bg-neutral-800/60 border border-neutral-200 dark:border-neutral-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 text-neutral-900 dark:text-white"
                    placeholder="https://example.com/image.jpg"
                  />
                </div>

                {/* Content */}
                <div>
                  <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                    Content *
                  </label>
                  <textarea
                    name="content"
                    value={formData.content}
                    onChange={handleInputChange}
                    rows={20}
                    className="w-full px-4 py-3 bg-white/60 dark:bg-neutral-800/60 border border-neutral-200 dark:border-neutral-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 text-neutral-900 dark:text-white resize-none font-mono text-sm"
                    placeholder="Write your blog post content here... (Markdown supported)"
                    required
                  />
                  <p className="mt-2 text-xs text-neutral-500 dark:text-neutral-400">
                    Tip: You can use Markdown syntax for formatting. Use
                    **bold**, *italic*, `code`, and more.
                  </p>
                </div>

                {/* Submit Button */}
                <div className="flex space-x-4">
                  <button
                    type="submit"
                    disabled={loading}
                    className="bg-amber-500 hover:bg-amber-600 disabled:bg-amber-400/50 text-white px-8 py-3 rounded-lg font-medium transition-all duration-200 disabled:cursor-not-allowed flex items-center"
                  >
                    {loading ? (
                      <>
                        <svg
                          className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          ></circle>
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          ></path>
                        </svg>
                        {editingPost ? "Updating..." : "Creating..."}
                      </>
                    ) : editingPost ? (
                      "Update Post"
                    ) : (
                      "Create Post"
                    )}
                  </button>

                  {formData.status === "published" && (
                    <button
                      type="button"
                      onClick={() =>
                        setFormData((prev) => ({ ...prev, status: "draft" }))
                      }
                      className="bg-neutral-500 hover:bg-neutral-600 text-white px-6 py-3 rounded-lg font-medium transition-colors"
                    >
                      Save as Draft
                    </button>
                  )}
                </div>
              </form>
            </div>
          )}

          {/* Manage Posts Tab */}
          {activeTab === "manage" && (
            <div className="p-8">
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-2xl font-bold text-neutral-900 dark:text-white">
                  Manage Posts
                </h2>
                <button
                  onClick={() => setActiveTab("create")}
                  className="bg-amber-500 hover:bg-amber-600 text-white px-4 py-2 rounded-lg font-medium text-sm transition-colors"
                >
                  + New Post
                </button>
              </div>

              {/* Filters */}
              <div className="mb-6 space-y-4 md:space-y-0 md:flex md:items-center md:space-x-4">
                <div className="flex-1">
                  <input
                    type="text"
                    placeholder="Search posts..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full px-4 py-2 bg-white/60 dark:bg-neutral-800/60 border border-neutral-200 dark:border-neutral-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 text-sm"
                  />
                </div>

                <div className="flex space-x-3">
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="px-4 py-2 bg-white/60 dark:bg-neutral-800/60 border border-neutral-200 dark:border-neutral-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 text-sm"
                  >
                    <option value="all">All Categories</option>
                    {categories.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>

                  <select
                    value={selectedStatus}
                    onChange={(e) => setSelectedStatus(e.target.value)}
                    className="px-4 py-2 bg-white/60 dark:bg-neutral-800/60 border border-neutral-200 dark:border-neutral-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 text-sm"
                  >
                    <option value="all">All Status</option>
                    <option value="published">Published</option>
                    <option value="draft">Draft</option>
                  </select>
                </div>
              </div>

              {loading ? (
                <div className="text-center py-12">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-500 mx-auto"></div>
                  <p className="mt-4 text-neutral-600 dark:text-neutral-400">
                    Loading posts...
                  </p>
                </div>
              ) : filteredPosts.length === 0 ? (
                <div className="text-center py-12">
                  <div className="text-6xl mb-4">📝</div>
                  <p className="text-neutral-600 dark:text-neutral-400">
                    {searchTerm
                      ? "No posts found matching your search."
                      : "No blog posts found."}
                  </p>
                </div>
              ) : (
                <div className="overflow-hidden rounded-xl border border-neutral-200/50 dark:border-neutral-700/50">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-neutral-50/50 dark:bg-neutral-700/50">
                        <tr>
                          <th className="text-left py-4 px-6 font-medium text-neutral-700 dark:text-neutral-300">
                            Title
                          </th>
                          <th className="text-left py-4 px-6 font-medium text-neutral-700 dark:text-neutral-300">
                            Category
                          </th>
                          <th className="text-left py-4 px-6 font-medium text-neutral-700 dark:text-neutral-300">
                            Status
                          </th>
                          <th className="text-left py-4 px-6 font-medium text-neutral-700 dark:text-neutral-300">
                            Comments
                          </th>
                          <th className="text-left py-4 px-6 font-medium text-neutral-700 dark:text-neutral-300">
                            Date
                          </th>
                          <th className="text-left py-4 px-6 font-medium text-neutral-700 dark:text-neutral-300">
                            Actions
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-neutral-200/50 dark:divide-neutral-700/50">
                        {filteredPosts.map((post) => (
                          <tr
                            key={post._id}
                            className="hover:bg-neutral-50/30 dark:hover:bg-neutral-700/30 transition-colors"
                          >
                            <td className="py-4 px-6">
                              <div>
                                <div className="font-medium text-neutral-900 dark:text-white">
                                  {post.title}
                                </div>
                                <div className="text-sm text-neutral-500 dark:text-neutral-400">
                                  by {post.author}
                                </div>
                              </div>
                            </td>
                            <td className="py-4 px-6">
                              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-neutral-100 dark:bg-neutral-800 text-neutral-800 dark:text-neutral-200">
                                {post.category}
                              </span>
                            </td>
                            <td className="py-4 px-6">
                              <span
                                className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                  post.status === "published"
                                    ? "bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-300"
                                    : "bg-yellow-100 dark:bg-yellow-900/20 text-yellow-800 dark:text-yellow-300"
                                }`}
                              >
                                {post.status}
                              </span>
                            </td>
                            <td className="py-4 px-6">
                              <span className="text-neutral-600 dark:text-neutral-400">
                                {post.commentCount || 0}
                              </span>
                            </td>
                            <td className="py-4 px-6 text-neutral-600 dark:text-neutral-400 text-sm">
                              {post.createdAt}
                            </td>
                            <td className="py-4 px-6">
                              <div className="flex items-center space-x-2">
                                <button
                                  onClick={() =>
                                    window.open(`/blog/${post.slug}`, "_blank")
                                  }
                                  className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 text-sm font-medium"
                                >
                                  View
                                </button>
                                <button
                                  onClick={() => handleEdit(post._id)}
                                  className="text-amber-600 dark:text-amber-400 hover:text-amber-700 dark:hover:text-amber-300 text-sm font-medium"
                                >
                                  Edit
                                </button>
                                <button
                                  onClick={() => handleDelete(post._id)}
                                  className="text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 text-sm font-medium"
                                >
                                  Delete
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* Results Info */}
              {filteredPosts.length > 0 && (
                <div className="mt-4 text-sm text-neutral-600 dark:text-neutral-400">
                  Showing {filteredPosts.length} of {posts.length} posts
                  {searchTerm && ` matching "${searchTerm}"`}
                </div>
              )}
            </div>
          )}

          {/* Comments Tab */}
          {activeTab === "comments" && (
            <div className="p-8">
              <h2 className="text-2xl font-bold text-neutral-900 dark:text-white mb-8">
                Comment Management
              </h2>

              {loading ? (
                <div className="text-center py-12">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-500 mx-auto"></div>
                  <p className="mt-4 text-neutral-600 dark:text-neutral-400">
                    Loading comments...
                  </p>
                </div>
              ) : comments.length === 0 ? (
                <div className="text-center py-12">
                  <div className="text-6xl mb-4">💬</div>
                  <p className="text-neutral-600 dark:text-neutral-400">
                    No comments found.
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {comments.map((comment) => (
                    <div
                      key={comment._id?.toString()}
                      className={`p-6 rounded-xl border transition-all duration-200 ${
                        comment.status === "pending"
                          ? "bg-yellow-50/50 dark:bg-yellow-900/20 border-yellow-200/50 dark:border-yellow-800/50"
                          : comment.status === "approved"
                          ? "bg-green-50/50 dark:bg-green-900/20 border-green-200/50 dark:border-green-800/50"
                          : "bg-red-50/50 dark:bg-red-900/20 border-red-200/50 dark:border-red-800/50"
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-3">
                            <div className="w-10 h-10 bg-amber-100 dark:bg-amber-900/30 rounded-full flex items-center justify-center">
                              <span className="text-amber-800 dark:text-amber-300 font-medium text-sm">
                                {comment.author.charAt(0).toUpperCase()}
                              </span>
                            </div>
                            <div>
                              <h4 className="font-medium text-neutral-900 dark:text-white">
                                {comment.author}
                              </h4>
                              <p className="text-sm text-neutral-500 dark:text-neutral-400">
                                {comment.email} •{" "}
                                {formatDate(comment.createdAt.toString())}
                              </p>
                            </div>
                            <span
                              className={`px-2 py-1 rounded-full text-xs font-medium ${
                                comment.status === "pending"
                                  ? "bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300"
                                  : comment.status === "approved"
                                  ? "bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300"
                                  : "bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300"
                              }`}
                            >
                              {comment.status}
                            </span>
                          </div>

                          <div className="mb-3">
                            <p className="text-neutral-700 dark:text-neutral-300 leading-relaxed">
                              {comment.content}
                            </p>
                          </div>

                          <div className="text-sm text-neutral-500 dark:text-neutral-400">
                            Post:{" "}
                            <span className="font-medium">
                              {comment.postSlug}
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center space-x-2 ml-4">
                          {comment.status === "pending" && (
                            <>
                              <button
                                onClick={() =>
                                  handleCommentAction(
                                    comment._id?.toString() || "",
                                    "approved"
                                  )
                                }
                                className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded-lg text-sm font-medium transition-colors"
                              >
                                Approve
                              </button>
                              <button
                                onClick={() =>
                                  handleCommentAction(
                                    comment._id?.toString() || "",
                                    "rejected"
                                  )
                                }
                                className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-lg text-sm font-medium transition-colors"
                              >
                                Reject
                              </button>
                            </>
                          )}
                          <button
                            onClick={() =>
                              deleteComment(comment._id?.toString() || "")
                            }
                            className="bg-neutral-500 hover:bg-neutral-600 text-white px-3 py-1 rounded-lg text-sm font-medium transition-colors"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
