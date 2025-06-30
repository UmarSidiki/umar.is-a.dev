import { useState } from "react";
import { BlogPostFormData, BlogPost } from "@/types/blog";
import { MessageState } from "../types";
import { getAuthHeaders } from "../utils/helpers";

export const useFormManagement = () => {
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
  const [editingPost, setEditingPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(false);

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

  const handleSubmit = async (
    e: React.FormEvent,
    onMessage: (message: MessageState) => void,
    onSuccess: () => void,
    logout: () => void
  ) => {
    e.preventDefault();

    if (
      !formData.title.trim() ||
      !formData.content.trim() ||
      !formData.excerpt.trim()
    ) {
      onMessage({ type: "error", text: "Please fill in all required fields" });
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
        headers: getAuthHeaders(),
        body: JSON.stringify(body),
      });

      const result = await response.json();

      if (result.success) {
        onMessage({
          type: "success",
          text: editingPost
            ? "Post updated successfully!"
            : "Post created successfully!",
        });

        resetForm();
        onSuccess();
      } else if (response.status === 401) {
        onMessage({
          type: "error",
          text: "Authentication failed. Please login again.",
        });
        logout();
      } else {
        onMessage({
          type: "error",
          text: result.error || "Failed to save post",
        });
      }
    } catch (error) {
      console.error("Error saving post:", error);
      onMessage({ type: "error", text: "Failed to save post" });
    } finally {
      setLoading(false);
    }
  };

  const loadPostForEditing = async (
    id: string,
    onMessage: (message: MessageState) => void
  ) => {
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
      }
    } catch (error) {
      console.error("Error fetching post:", error);
      onMessage({ type: "error", text: "Failed to load post for editing" });
    } finally {
      setLoading(false);
    }
  };

  return {
    formData,
    setFormData,
    editingPost,
    loading,
    handleInputChange,
    handleSubmit,
    resetForm,
    loadPostForEditing,
  };
};
