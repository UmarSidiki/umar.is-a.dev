import { useCallback } from "react";
import { MessageState } from "../types";
import { getAuthHeaders } from "../utils/helpers";

export const useCommentActions = () => {
  const handleCommentAction = useCallback(async (
    commentId: string,
    action: "approved" | "rejected",
    onMessage: (message: MessageState) => void,
    onRefresh: () => void,
    logout: () => void
  ) => {
    try {
      const response = await fetch("/api/comments", {
        method: "PUT",
        headers: getAuthHeaders(),
        body: JSON.stringify({ commentId, status: action }),
      });

      const result = await response.json();

      if (result.success) {
        onMessage({
          type: "success",
          text: `Comment ${action} successfully!`,
        });
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
          text: result.error || `Failed to ${action} comment`,
        });
      }
    } catch (error) {
      console.error(`Error ${action} comment:`, error);
      onMessage({ type: "error", text: `Failed to ${action} comment` });
    }
  }, []);

  const deleteComment = useCallback(async (
    commentId: string,
    onMessage: (message: MessageState) => void,
    onRefresh: () => void,
    logout: () => void
  ) => {
    if (!confirm("Are you sure you want to delete this comment?")) return;

    try {
      const response = await fetch(`/api/comments?id=${commentId}`, {
        method: "DELETE",
        headers: getAuthHeaders(),
      });
      const result = await response.json();

      if (result.success) {
        onMessage({ type: "success", text: "Comment deleted successfully!" });
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
          text: result.error || "Failed to delete comment",
        });
      }
    } catch (error) {
      console.error("Error deleting comment:", error);
      onMessage({ type: "error", text: "Failed to delete comment" });
    }
  }, []);

  return {
    handleCommentAction,
    deleteComment,
  };
};
