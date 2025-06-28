'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Comment } from '@/types/blog';

interface CommentSectionProps {
  postSlug: string;
  commentsEnabled?: boolean;
}

interface CommentFormData {
  author: string;
  email: string;
  content: string;
}

const CommentSection: React.FC<CommentSectionProps> = ({ postSlug, commentsEnabled = true }) => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<'newest' | 'oldest' | 'popular'>('newest');
  
  const [formData, setFormData] = useState<CommentFormData>({
    author: '',
    email: '',
    content: ''
  });

  const fetchComments = useCallback(async () => {
    try {
      const response = await fetch(`/api/comments?postSlug=${postSlug}&sort=${sortBy}`);
      const result = await response.json();
      
      if (result.success) {
        setComments(result.data);
      }
    } catch (error) {
      console.error('Error fetching comments:', error);
    } finally {
      setLoading(false);
    }
  }, [postSlug, sortBy]);

  useEffect(() => {
    if (commentsEnabled) {
      fetchComments();
    }
  }, [commentsEnabled, fetchComments]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent, parentId?: string) => {
    e.preventDefault();
    
    if (!formData.author.trim() || !formData.email.trim() || !formData.content.trim()) {
      setMessage({ type: 'error', text: 'Please fill in all fields' });
      return;
    }

    try {
      setSubmitting(true);
      const response = await fetch('/api/comments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          postSlug: postSlug,
          parentId: parentId,
          ...formData
        })
      });

      const result = await response.json();

      if (result.success) {
        setMessage({ type: 'success', text: 'Comment submitted successfully! It will appear after approval.' });
        setFormData({ author: '', email: '', content: '' });
        setReplyingTo(null);
        // Refresh comments to show the new one
        await fetchComments();
      } else {
        setMessage({ type: 'error', text: result.error || 'Failed to submit comment' });
      }
    } catch (error) {
      console.error('Error submitting comment:', error);
      setMessage({ type: 'error', text: 'Failed to submit comment' });
    } finally {
      setSubmitting(false);
    }
  };

  const handleReaction = async (commentId: string, action: 'like' | 'dislike') => {
    try {
      const response = await fetch('/api/comments/reactions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ commentId, action })
      });

      const result = await response.json();
      
      if (result.success) {
        // Update the local state to reflect the new count
        setComments(prev => prev.map(comment => {
          if (comment._id?.toString() === commentId) {
            return {
              ...comment,
              [action === 'like' ? 'likes' : 'dislikes']: result.data[action === 'like' ? 'likes' : 'dislikes']
            };
          }
          // Also check replies
          if (comment.replies) {
            comment.replies = comment.replies.map(reply => {
              if (reply._id?.toString() === commentId) {
                return {
                  ...reply,
                  [action === 'like' ? 'likes' : 'dislikes']: result.data[action === 'like' ? 'likes' : 'dislikes']
                };
              }
              return reply;
            });
          }
          return comment;
        }));
      }
    } catch (error) {
      console.error('Error updating reaction:', error);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => setMessage(null), 5000);
      return () => clearTimeout(timer);
    }
  }, [message]);

  if (!commentsEnabled) {
    return null;
  }

  return (
    <div className="mt-12 border-t border-neutral-200/50 dark:border-neutral-700/50 pt-8">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-2xl font-bold text-neutral-900 dark:text-white">
          Comments ({comments.length})
        </h3>
        
        {/* Sort Options */}
        {comments.length > 0 && (
          <div className="flex items-center space-x-2">
            <span className="text-sm text-neutral-600 dark:text-neutral-400">Sort by:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as 'newest' | 'oldest' | 'popular')}
              className="text-sm bg-white/60 dark:bg-neutral-800/60 border border-neutral-200 dark:border-neutral-700 rounded-lg px-3 py-1 focus:outline-none focus:ring-2 focus:ring-amber-500 transition-all duration-200"
            >
              <option value="newest">Newest</option>
              <option value="oldest">Oldest</option>
              <option value="popular">Most Popular</option>
            </select>
          </div>
        )}
      </div>

      {/* Comment Form */}
      <div className="bg-neutral-50/50 dark:bg-neutral-800/30 rounded-xl p-6 mb-8">
        <h4 className="text-lg font-semibold text-neutral-900 dark:text-white mb-4">
          {replyingTo ? 'Reply to Comment' : 'Leave a Comment'}
        </h4>

        {replyingTo && (
          <div className="mb-4 p-3 bg-amber-50/50 dark:bg-amber-900/20 border border-amber-200/50 dark:border-amber-800/50 rounded-lg">
            <div className="flex items-center justify-between">
              <span className="text-sm text-amber-700 dark:text-amber-300">
                Replying to comment
              </span>
              <button
                onClick={() => setReplyingTo(null)}
                className="text-amber-600 dark:text-amber-400 hover:text-amber-700 dark:hover:text-amber-300 text-sm"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {message && (
          <div className={`mb-4 p-3 rounded-lg text-sm ${
            message.type === 'success'
              ? 'bg-green-50/50 dark:bg-green-900/20 text-green-700 dark:text-green-300 border border-green-200/50 dark:border-green-800/50'
              : 'bg-red-50/50 dark:bg-red-900/20 text-red-700 dark:text-red-300 border border-red-200/50 dark:border-red-800/50'
          }`}>
            {message.text}
          </div>
        )}

        <form onSubmit={(e) => handleSubmit(e, replyingTo || undefined)} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <input
                type="text"
                name="author"
                value={formData.author}
                onChange={handleInputChange}
                placeholder="Your Name *"
                className="w-full px-4 py-3 bg-white/60 dark:bg-neutral-800/60 border border-neutral-200 dark:border-neutral-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all duration-200 text-sm"
                disabled={submitting}
                required
              />
            </div>
            <div>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="Your Email * (not published)"
                className="w-full px-4 py-3 bg-white/60 dark:bg-neutral-800/60 border border-neutral-200 dark:border-neutral-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all duration-200 text-sm"
                disabled={submitting}
                required
              />
            </div>
          </div>
          
          <div>
            <textarea
              name="content"
              value={formData.content}
              onChange={handleInputChange}
              placeholder="Write your comment... *"
              rows={4}
              className="w-full px-4 py-3 bg-white/60 dark:bg-neutral-800/60 border border-neutral-200 dark:border-neutral-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all duration-200 resize-none text-sm"
              disabled={submitting}
              required
            />
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="bg-amber-500 hover:bg-amber-600 disabled:bg-amber-400/50 text-white px-6 py-3 rounded-lg font-medium text-sm transition-all duration-200 disabled:cursor-not-allowed flex items-center"
          >
            {submitting ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Submitting...
              </>
            ) : (
              'Post Comment'
            )}
          </button>
        </form>
      </div>

      {/* Comments List */}
      {loading ? (
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-amber-500 mx-auto"></div>
          <p className="mt-2 text-sm text-neutral-600 dark:text-neutral-400">Loading comments...</p>
        </div>
      ) : comments.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-neutral-600 dark:text-neutral-400">No comments yet. Be the first to comment!</p>
        </div>
      ) : (
        <div className="space-y-6">
          {comments.map((comment) => (
            <div key={comment._id?.toString()} className="bg-white/40 dark:bg-neutral-800/40 rounded-lg p-6 border border-neutral-200/50 dark:border-neutral-700/50">
              <div className="flex items-start space-x-4">
                <div className="w-10 h-10 bg-amber-100 dark:bg-amber-900/30 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-amber-800 dark:text-amber-300 font-medium text-sm">
                    {comment.author.charAt(0).toUpperCase()}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-2 mb-2">
                    <h5 className="font-medium text-neutral-900 dark:text-white">
                      {comment.author}
                    </h5>
                    <span className="text-xs text-neutral-500 dark:text-neutral-400">
                      {formatDate(comment.createdAt.toString())}
                    </span>
                  </div>
                  <p className="text-neutral-700 dark:text-neutral-300 text-sm leading-relaxed mb-3">
                    {comment.content}
                  </p>
                  
                  {/* Comment Actions */}
                  <div className="flex items-center space-x-4 text-xs">
                    <button
                      onClick={() => setReplyingTo(comment._id?.toString() || '')}
                      className="flex items-center space-x-1 text-neutral-500 dark:text-neutral-400 hover:text-amber-600 dark:hover:text-amber-400 transition-colors"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" />
                      </svg>
                      <span>Reply</span>
                    </button>
                    
                    <div className="flex items-center space-x-2">
                      <button 
                        onClick={() => handleReaction(comment._id?.toString() || '', 'like')}
                        className="flex items-center space-x-1 text-neutral-500 dark:text-neutral-400 hover:text-green-600 dark:hover:text-green-400 transition-colors"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5" />
                        </svg>
                        <span>{comment.likes || 0}</span>
                      </button>
                      
                      <button 
                        onClick={() => handleReaction(comment._id?.toString() || '', 'dislike')}
                        className="flex items-center space-x-1 text-neutral-500 dark:text-neutral-400 hover:text-red-600 dark:hover:text-red-400 transition-colors"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14H5.236a2 2 0 01-1.789-2.894l3.5-7A2 2 0 018.736 3h4.018c.163 0 .326.02.485.06L17 4m-7 10v2a2 2 0 002 2h.095c.5 0 .905-.405.905-.905 0-.714.211-1.412.608-2.006L17 13V4m-7 10h2m5-10h2a2 2 0 012 2v6a2 2 0 01-2 2h-2.5" />
                        </svg>
                        <span>{comment.dislikes || 0}</span>
                      </button>
                    </div>
                  </div>
                  
                  {/* Replies */}
                  {comment.replies && comment.replies.length > 0 && (
                    <div className="mt-4 ml-4 space-y-3">
                      {comment.replies.map((reply) => (
                        <div key={reply._id?.toString()} className="bg-neutral-50/50 dark:bg-neutral-700/30 rounded-lg p-4 border border-neutral-200/30 dark:border-neutral-600/30">
                          <div className="flex items-start space-x-3">
                            <div className="w-8 h-8 bg-amber-100 dark:bg-amber-900/30 rounded-full flex items-center justify-center flex-shrink-0">
                              <span className="text-amber-800 dark:text-amber-300 font-medium text-xs">
                                {reply.author.charAt(0).toUpperCase()}
                              </span>
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center space-x-2 mb-2">
                                <h6 className="font-medium text-neutral-900 dark:text-white text-sm">
                                  {reply.author}
                                </h6>
                                <span className="text-xs text-neutral-500 dark:text-neutral-400">
                                  {formatDate(reply.createdAt.toString())}
                                </span>
                              </div>
                              <p className="text-neutral-700 dark:text-neutral-300 text-xs leading-relaxed">
                                {reply.content}
                              </p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CommentSection;
