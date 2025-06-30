import React from "react";
import { Comment } from "@/types/blog";
import { formatDate } from "../utils/helpers";

interface CommentsManagementProps {
  comments: Comment[];
  loading: boolean;
  onCommentAction: (commentId: string, action: "approved" | "rejected") => void;
  onDeleteComment: (commentId: string) => void;
}

export const CommentsManagement: React.FC<CommentsManagementProps> = ({
  comments,
  loading,
  onCommentAction,
  onDeleteComment,
}) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "approved":
        return "bg-green-50/50 text-green-700 dark:bg-green-900/20 dark:text-green-300 border-green-200/50 dark:border-green-800/50";
      case "rejected":
        return "bg-red-50/50 text-red-700 dark:bg-red-900/20 dark:text-red-300 border-red-200/50 dark:border-red-800/50";
      default:
        return "bg-yellow-50/50 text-yellow-700 dark:bg-yellow-900/20 dark:text-yellow-300 border-yellow-200/50 dark:border-yellow-800/50";
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-foreground">
          Comments Management
        </h2>
        <div className="text-sm text-muted-foreground">
          {comments.length} total comments
        </div>
      </div>

      {loading ? (
        <div className="text-center py-8">
          <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
          <p className="text-muted-foreground text-sm">Loading comments...</p>
        </div>
      ) : comments.length === 0 ? (
        <div className="text-center py-12">
          <div className="w-12 h-12 bg-muted rounded-xl flex items-center justify-center mx-auto mb-4">
            <span className="text-xl">💬</span>
          </div>
          <h3 className="text-lg font-medium text-foreground mb-2">
            No comments yet
          </h3>
          <p className="text-muted-foreground text-sm">
            Comments from your blog posts will appear here for moderation.
          </p>
        </div>
      ) : (
        <div className="space-y-1">
          {comments.map((comment) => (
            <div
              key={comment._id?.toString()}
              className="bg-card/40 dark:bg-card/40 backdrop-blur-sm rounded border border-border/30 hover:border-border/70 transition-all duration-200 px-3 py-1.5"
            >
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-2 flex-1 min-w-0">
                  <div className="w-4 h-4 bg-primary rounded-full flex items-center justify-center text-primary-foreground font-medium text-xs flex-shrink-0">
                    {comment.author.charAt(0).toUpperCase()}
                  </div>
                  
                  <span className="font-medium text-foreground text-xs truncate max-w-[60px]">
                    {comment.author}
                  </span>
                  
                  <span
                    className={`inline-flex items-center px-1.5 py-0.5 rounded text-xs font-medium border ${getStatusColor(
                      comment.status
                    )}`}
                  >
                    {comment.status}
                  </span>
                  
                  <span className="text-xs text-muted-foreground truncate flex-1 min-w-0">
                    &ldquo;{comment.content}&rdquo;
                  </span>
                  
                  <span className="text-xs text-muted-foreground/70 whitespace-nowrap hidden md:inline">
                    {formatDate(comment.createdAt.toString())}
                  </span>
                </div>

                <div className="flex items-center gap-1 flex-shrink-0">
                  {comment.status === "pending" && (
                    <>
                      <button
                        onClick={() => onCommentAction(comment._id?.toString() || "", "approved")}
                        className="px-1.5 py-0.5 bg-green-500 hover:bg-green-600 text-white rounded text-xs transition-colors duration-200 flex items-center gap-0.5"
                        title="Approve comment"
                      >
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                        </svg>
                        <span className="hidden sm:inline">Approve</span>
                      </button>
                      <button
                        onClick={() => onCommentAction(comment._id?.toString() || "", "rejected")}
                        className="px-1.5 py-0.5 bg-destructive hover:bg-destructive/90 text-destructive-foreground rounded text-xs transition-colors duration-200 flex items-center gap-0.5"
                        title="Reject comment"
                      >
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                        <span className="hidden sm:inline">Reject</span>
                      </button>
                    </>
                  )}
                  
                  {comment.status === "approved" && (
                    <button
                      onClick={() => onCommentAction(comment._id?.toString() || "", "rejected")}
                      className="px-1.5 py-0.5 bg-destructive hover:bg-destructive/90 text-destructive-foreground rounded text-xs transition-colors duration-200 flex items-center gap-0.5"
                      title="Reject comment"
                    >
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                      </svg>
                      <span className="hidden sm:inline">Reject</span>
                    </button>
                  )}

                  {comment.status === "rejected" && (
                    <button
                      onClick={() => onCommentAction(comment._id?.toString() || "", "approved")}
                      className="px-1.5 py-0.5 bg-green-500 hover:bg-green-600 text-white rounded text-xs transition-colors duration-200 flex items-center gap-0.5"
                      title="Approve comment"
                    >
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                      </svg>
                      <span className="hidden sm:inline">Approve</span>
                    </button>
                  )}

                  <button
                    onClick={() => onDeleteComment(comment._id?.toString() || "")}
                    className="px-1.5 py-0.5 bg-muted hover:bg-muted/80 text-muted-foreground hover:text-foreground rounded text-xs transition-colors duration-200 flex items-center gap-0.5"
                    title="Delete comment"
                  >
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                    <span className="hidden sm:inline">Delete</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
