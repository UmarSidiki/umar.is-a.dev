"use client";

import React, { useCallback, useEffect, useState } from "react";
import { ThumbsDown, ThumbsUp } from "lucide-react";
import { Comment } from "@/types/blog";

interface CommentSectionProps {
  postSlug: string;
  commentsEnabled?: boolean;
}

interface CommentFormData {
  author: string;
  email: string;
  content: string;
}

const fieldClass =
  "w-full border border-hairline bg-transparent px-4 py-3 text-base text-foreground placeholder:text-ink-soft focus:border-signal focus:outline-none";

export default function CommentSection({
  postSlug,
  commentsEnabled = true,
}: CommentSectionProps) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<"newest" | "oldest" | "popular">("newest");
  const [formData, setFormData] = useState<CommentFormData>({
    author: "",
    email: "",
    content: "",
  });

  const fetchComments = useCallback(async () => {
    try {
      const res = await fetch(`/api/comments?postSlug=${postSlug}&sort=${sortBy}`);
      const result = await res.json();
      if (result.success) setComments(result.data);
    } catch (error) {
      console.error("Error fetching comments:", error);
    } finally {
      setLoading(false);
    }
  }, [postSlug, sortBy]);

  useEffect(() => {
    if (commentsEnabled) fetchComments();
  }, [commentsEnabled, fetchComments]);

  useEffect(() => {
    if (!message) return;
    const timer = setTimeout(() => setMessage(null), 5000);
    return () => clearTimeout(timer);
  }, [message]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent, parentId?: string) => {
    e.preventDefault();
    if (!formData.author.trim() || !formData.email.trim() || !formData.content.trim()) {
      setMessage({ type: "error", text: "Please fill in all fields." });
      return;
    }
    try {
      setSubmitting(true);
      const res = await fetch("/api/comments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ postSlug, parentId, ...formData }),
      });
      const result = await res.json();
      if (result.success) {
        setMessage({
          type: "success",
          text: "Comment submitted. It will appear once approved.",
        });
        setFormData({ author: "", email: "", content: "" });
        setReplyingTo(null);
        await fetchComments();
      } else {
        setMessage({ type: "error", text: result.error || "Failed to submit comment." });
      }
    } catch (error) {
      console.error("Error submitting comment:", error);
      setMessage({ type: "error", text: "Failed to submit comment." });
    } finally {
      setSubmitting(false);
    }
  };

  const handleReaction = async (commentId: string, action: "like" | "dislike") => {
    try {
      const res = await fetch("/api/comments/reactions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ commentId, action }),
      });
      const result = await res.json();
      if (result.success) {
        setComments((prev) =>
          prev.map((comment) => {
            if (comment._id?.toString() === commentId) {
              return {
                ...comment,
                [action === "like" ? "likes" : "dislikes"]:
                  result.data[action === "like" ? "likes" : "dislikes"],
              };
            }
            if (comment.replies) {
              comment.replies = comment.replies.map((reply) =>
                reply._id?.toString() === commentId
                  ? {
                      ...reply,
                      [action === "like" ? "likes" : "dislikes"]:
                        result.data[action === "like" ? "likes" : "dislikes"],
                    }
                  : reply
              );
            }
            return comment;
          })
        );
      }
    } catch (error) {
      console.error("Error updating reaction:", error);
    }
  };

  const formatDate = (value: string) =>
    new Date(value).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });

  if (!commentsEnabled) return null;

  return (
    <section aria-labelledby="comments-heading">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <h2 id="comments-heading" className="font-display text-2xl font-bold">
          Comments ({comments.length})
        </h2>
        {comments.length > 0 && (
          <div className="flex items-center gap-3">
            <label htmlFor="comment-sort" className="label-mono text-ink-soft">
              Sort
            </label>
            <select
              id="comment-sort"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
              className="border border-hairline bg-transparent py-2 pl-3 pr-8 text-sm focus:border-signal focus:outline-none"
            >
              <option value="newest">Newest</option>
              <option value="oldest">Oldest</option>
              <option value="popular">Most liked</option>
            </select>
          </div>
        )}
      </div>

      <div className="mt-8 border border-hairline p-5 sm:p-6">
        <h3 className="font-display text-lg font-bold">
          {replyingTo ? "Reply to comment" : "Leave a comment"}
        </h3>

        {replyingTo && (
          <div className="mt-4 flex items-center justify-between border border-hairline px-4 py-3 text-sm">
            <span className="text-ink-soft">Replying to a comment</span>
            <button
              type="button"
              onClick={() => setReplyingTo(null)}
              className="label-mono text-signal"
            >
              Cancel
            </button>
          </div>
        )}

        {message && (
          <div
            role="status"
            className={`mt-4 border px-4 py-3 text-sm ${
              message.type === "success"
                ? "border-signal/40 bg-signal/5 text-foreground"
                : "border-destructive/40 bg-destructive/5 text-destructive"
            }`}
          >
            {message.text}
          </div>
        )}

        <form onSubmit={(e) => handleSubmit(e, replyingTo || undefined)} className="mt-5 space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="comment-author" className="label-mono mb-2 block text-ink-soft">
                Name
              </label>
              <input
                id="comment-author"
                type="text"
                name="author"
                value={formData.author}
                onChange={handleInputChange}
                autoComplete="name"
                className={fieldClass}
                disabled={submitting}
                required
              />
            </div>
            <div>
              <label htmlFor="comment-email" className="label-mono mb-2 block text-ink-soft">
                Email (not published)
              </label>
              <input
                id="comment-email"
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                autoComplete="email"
                className={fieldClass}
                disabled={submitting}
                required
              />
            </div>
          </div>

          <div>
            <label htmlFor="comment-content" className="label-mono mb-2 block text-ink-soft">
              Comment
            </label>
            <textarea
              id="comment-content"
              name="content"
              value={formData.content}
              onChange={handleInputChange}
              rows={4}
              className={`${fieldClass} resize-none`}
              disabled={submitting}
              required
            />
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="inline-flex h-12 items-center rounded-full bg-signal px-7 text-sm font-medium text-signal-ink transition-colors hover:bg-foreground hover:text-background disabled:opacity-50"
          >
            {submitting ? "Submitting…" : "Post comment"}
          </button>
        </form>
      </div>

      {loading ? (
        <p className="mt-8 text-sm text-ink-soft">Loading comments…</p>
      ) : comments.length === 0 ? (
        <p className="mt-8 text-sm text-ink-soft">No comments yet. Be the first.</p>
      ) : (
        <ul className="mt-8 space-y-8">
          {comments.map((comment) => (
            <li key={comment._id?.toString()} className="border-t border-hairline pt-6">
              <div className="flex items-start gap-4">
                <span
                  aria-hidden="true"
                  className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-hairline font-display font-bold text-signal"
                >
                  {comment.author.charAt(0).toUpperCase()}
                </span>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-x-3 text-sm">
                    <span className="font-medium">{comment.author}</span>
                    <span className="text-ink-soft">{formatDate(comment.createdAt.toString())}</span>
                  </div>
                  <p className="mt-3 text-sm leading-relaxed text-foreground/90">
                    {comment.content}
                  </p>

                  <div className="mt-4 flex items-center gap-5 text-sm">
                    <button
                      type="button"
                      onClick={() => setReplyingTo(comment._id?.toString() || "")}
                      className="label-mono text-ink-soft transition-colors hover:text-signal"
                    >
                      Reply
                    </button>
                    <button
                      type="button"
                      onClick={() => handleReaction(comment._id?.toString() || "", "like")}
                      aria-label="Like comment"
                      className="inline-flex items-center gap-1.5 text-ink-soft transition-colors hover:text-signal"
                    >
                      <ThumbsUp className="h-4 w-4" aria-hidden="true" />
                      {comment.likes || 0}
                    </button>
                    <button
                      type="button"
                      onClick={() => handleReaction(comment._id?.toString() || "", "dislike")}
                      aria-label="Dislike comment"
                      className="inline-flex items-center gap-1.5 text-ink-soft transition-colors hover:text-destructive"
                    >
                      <ThumbsDown className="h-4 w-4" aria-hidden="true" />
                      {comment.dislikes || 0}
                    </button>
                  </div>

                  {comment.replies && comment.replies.length > 0 && (
                    <ul className="mt-5 space-y-3 border-l border-hairline pl-4">
                      {comment.replies.map((reply) => (
                        <li key={reply._id?.toString()}>
                          <div className="flex flex-wrap items-center gap-x-3 text-sm">
                            <span className="font-medium">{reply.author}</span>
                            <span className="text-ink-soft">
                              {formatDate(reply.createdAt.toString())}
                            </span>
                          </div>
                          <p className="mt-2 text-sm leading-relaxed text-foreground/90">
                            {reply.content}
                          </p>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
