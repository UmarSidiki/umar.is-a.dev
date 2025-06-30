import { useState, useCallback } from "react";
import { BlogPostListItem, DashboardStats, MessageState } from "../types";
import { Comment, BlogPost } from "@/types/blog";
import { getAuthHeaders } from "../utils/helpers";

export const useAdminData = () => {
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
  const [loading, setLoading] = useState(false);

  const fetchStats = useCallback(async (onError: (message: MessageState) => void, logout: () => void) => {
    try {
      setLoading(true);
      const response = await fetch("/api/analytics", {
        headers: getAuthHeaders(),
      });
      const result = await response.json();

      if (result.success) {
        setStats(result.data);
      } else if (response.status === 401) {
        onError({
          type: "error",
          text: "Authentication failed. Please login again.",
        });
        logout();
      }
    } catch (error) {
      console.error("Error fetching stats:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchComments = useCallback(async (onError: (message: MessageState) => void, logout: () => void) => {
    try {
      setLoading(true);
      const response = await fetch("/api/comments?all=true", {
        headers: getAuthHeaders(),
      });
      const result = await response.json();

      if (result.success) {
        setComments(result.data);
      } else if (response.status === 401) {
        onError({
          type: "error",
          text: "Authentication failed. Please login again.",
        });
        logout();
      }
    } catch (error) {
      console.error("Error fetching comments:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchPosts = useCallback(async (onError: (message: MessageState) => void) => {
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
      onError({ type: "error", text: "Failed to fetch posts" });
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    posts,
    setPosts,
    comments,
    setComments,
    stats,
    loading,
    fetchStats,
    fetchComments,
    fetchPosts,
  };
};
