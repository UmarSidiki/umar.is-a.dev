"use client";

import React from "react";
import { Check, Trash2, X } from "lucide-react";
import { Comment } from "@/types/blog";
import { formatDate } from "../utils/helpers";

interface CommentsManagementProps {
  comments: Comment[];
  loading: boolean;
  onCommentAction: (commentId: string, action: "approved" | "rejected") => void;
  onDeleteComment: (commentId: string) => void;
}

function StatusBadge({ status }: { status: string }) {
  const tone =
    status === "approved" ? "text-signal" : status === "rejected" ? "text-destructive" : "text-ink-soft";
  return <span className={`label-mono ${tone}`}>{status}</span>;
}

export function CommentsManagement({
  comments,
  loading,
  onCommentAction,
  onDeleteComment,
}: CommentsManagementProps) {
  return (
    <div className="space-y-6">
      <p className="label-mono text-ink-soft">{comments.length} comments</p>

      {loading ? (
        <p className="py-12 text-center text-sm text-ink-soft">Loading comments…</p>
      ) : comments.length === 0 ? (
        <div className="border border-dashed border-hairline px-6 py-16 text-center">
          <p className="font-display text-xl font-bold">No comments yet</p>
          <p className="mt-2 text-sm text-ink-soft">
            Comments from your posts will appear here for moderation.
          </p>
        </div>
      ) : (
        <ul className="space-y-3">
          {comments.map((comment) => (
            <li key={comment._id?.toString()} className="min-w-0 border border-hairline p-4">
              <div className="flex min-w-0 flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div className="min-w-0 flex-1">
                  <div className="flex min-w-0 flex-wrap items-center gap-x-3 gap-y-1">
                    <span className="min-w-0 break-words font-medium text-sm">
                      {comment.author}
                    </span>
                    <StatusBadge status={comment.status} />
                    <span className="label-mono break-words text-ink-soft">
                      {formatDate(comment.createdAt.toString())}
                    </span>
                  </div>
                  <p className="mt-2 line-clamp-3 break-words text-sm text-ink-soft sm:line-clamp-2">
                    &ldquo;{comment.content}&rdquo;
                  </p>
                </div>

                <div className="flex min-w-0 items-center gap-2 sm:shrink-0">
                  {comment.status !== "approved" && (
                    <button
                      type="button"
                      onClick={() => onCommentAction(comment._id?.toString() || "", "approved")}
                      className="label-mono inline-flex h-11 min-w-0 flex-1 items-center justify-center gap-1.5 border border-hairline px-3 transition-colors hover:border-signal hover:text-signal sm:flex-none"
                    >
                      <Check className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
                      Approve
                    </button>
                  )}
                  {comment.status !== "rejected" && (
                    <button
                      type="button"
                      onClick={() => onCommentAction(comment._id?.toString() || "", "rejected")}
                      className="label-mono inline-flex h-11 min-w-0 flex-1 items-center justify-center gap-1.5 border border-hairline px-3 transition-colors hover:border-foreground sm:flex-none"
                    >
                      <X className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
                      Reject
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => onDeleteComment(comment._id?.toString() || "")}
                    aria-label={`Delete comment by ${comment.author}`}
                    className="inline-flex h-11 w-11 shrink-0 items-center justify-center border border-hairline transition-colors hover:border-destructive hover:text-destructive"
                  >
                    <Trash2 className="h-4 w-4" aria-hidden="true" />
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
