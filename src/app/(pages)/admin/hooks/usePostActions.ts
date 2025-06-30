import { useCallback } from "react";
import { MessageState } from "../types";
import { getAuthHeaders } from "../utils/helpers";

export const usePostActions = () => {
  const handleEdit = useCallback(async (
    id: string,
    onLoadForEditing: (id: string, onMessage: (message: MessageState) => void) => void,
    onSetActiveTab: (tab: "create") => void,
    onMessage: (message: MessageState) => void
  ) => {
    onLoadForEditing(id, onMessage);
    onSetActiveTab("create");
  }, []);

  const handleDelete = useCallback(async (
    id: string,
    onMessage: (message: MessageState) => void,
    onRefresh: () => void,
    logout: () => void
  ) => {
    if (!confirm("Are you sure you want to delete this post?")) return;

    try {
      const response = await fetch(`/api/blog?id=${id}`, {
        method: "DELETE",
        headers: getAuthHeaders(),
      });
      const result = await response.json();

      if (result.success) {
        onMessage({ type: "success", text: "Post deleted successfully!" });
        onRefresh();
      } else if (response.status === 401) {
        onMessage({
          type: "error",
          text: "Authentication failed. Please login again.",
        });
        logout();
      } else {
        onMessage({
          type: "error",
          text: result.error || "Failed to delete post",
        });
      }
    } catch (error) {
      console.error("Error deleting post:", error);
      onMessage({ type: "error", text: "Failed to delete post" });
    }
  }, []);

  return {
    handleEdit,
    handleDelete,
  };
};
