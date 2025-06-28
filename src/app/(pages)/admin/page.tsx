'use client';

import React, { useState, useEffect } from "react";
import { BlogPost, BlogPostFormData } from "@/types/blog";

interface BlogPostListItem {
  _id: string;
  title: string;
  status: 'draft' | 'published';
  createdAt: string;
  author: string;
  category: string;
}

const Admin = () => {
  const [activeTab, setActiveTab] = useState<'create' | 'manage'>('create');
  const [posts, setPosts] = useState<BlogPostListItem[]>([]);
  const [editingPost, setEditingPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const [formData, setFormData] = useState<BlogPostFormData>({
    title: '',
    content: '',
    excerpt: '',
    author: 'Umar Siddiqui',
    tags: '',
    category: '',
    status: 'draft',
    featuredImage: ''
  });

  const categories = ['Technology', 'Web Development', 'React', 'Next.js', 'JavaScript', 'Tutorial', 'Personal'];

  useEffect(() => {
    if (activeTab === 'manage') {
      fetchPosts();
    }
  }, [activeTab]);

  const fetchPosts = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/blog?limit=20');
      const result = await response.json();
      
      if (result.success) {
        setPosts(result.data.map((post: BlogPost) => ({
          _id: post._id?.toString() || '',
          title: post.title,
          status: post.status,
          createdAt: new Date(post.createdAt).toLocaleDateString(),
          author: post.author,
          category: post.category
        })));
      }
    } catch (error) {
      console.error('Error fetching posts:', error);
      setMessage({ type: 'error', text: 'Failed to fetch posts' });
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title.trim() || !formData.content.trim() || !formData.excerpt.trim()) {
      setMessage({ type: 'error', text: 'Please fill in all required fields' });
      return;
    }

    try {
      setLoading(true);
      
      const endpoint = editingPost ? '/api/blog' : '/api/blog';
      const method = editingPost ? 'PUT' : 'POST';
      const body = editingPost ? { ...formData, id: editingPost._id } : formData;

      const response = await fetch(endpoint, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });

      const result = await response.json();

      if (result.success) {
        setMessage({ 
          type: 'success', 
          text: editingPost ? 'Post updated successfully!' : 'Post created successfully!' 
        });
        
        // Reset form
        setFormData({
          title: '',
          content: '',
          excerpt: '',
          author: 'Umar Siddiqui',
          tags: '',
          category: '',
          status: 'draft',
          featuredImage: ''
        });
        setEditingPost(null);
        
        // Refresh posts if in manage tab
        if (activeTab === 'manage') {
          fetchPosts();
        }
      } else {
        setMessage({ type: 'error', text: result.error || 'Failed to save post' });
      }
    } catch (error) {
      console.error('Error saving post:', error);
      setMessage({ type: 'error', text: 'Failed to save post' });
    } finally {
      setLoading(false);
    }
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
          tags: post.tags.join(', '),
          category: post.category,
          status: post.status,
          featuredImage: post.featuredImage || ''
        });
        setEditingPost(post);
        setActiveTab('create');
      }
    } catch (error) {
      console.error('Error fetching post:', error);
      setMessage({ type: 'error', text: 'Failed to load post for editing' });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this post?')) return;

    try {
      setLoading(true);
      const response = await fetch(`/api/blog?id=${id}`, { method: 'DELETE' });
      const result = await response.json();
      
      if (result.success) {
        setMessage({ type: 'success', text: 'Post deleted successfully!' });
        fetchPosts();
      } else {
        setMessage({ type: 'error', text: result.error || 'Failed to delete post' });
      }
    } catch (error) {
      console.error('Error deleting post:', error);
      setMessage({ type: 'error', text: 'Failed to delete post' });
    } finally {
      setLoading(false);
    }
  };

  const clearMessage = () => {
    setTimeout(() => setMessage(null), 5000);
  };

  useEffect(() => {
    if (message) {
      clearMessage();
    }
  }, [message]);

  return (
    <>
      <main className="relative min-h-screen z-10 pt-24">
        <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
          <div className="bg-gradient-to-br from-white/80 via-neutral-50/60 to-white/70 dark:from-neutral-800/80 dark:via-neutral-900/60 dark:to-transparent backdrop-blur-xl border border-neutral-200/50 dark:border-neutral-700/50 rounded-3xl shadow-2xl shadow-neutral-200/20 dark:shadow-neutral-900/40 min-h-[calc(100vh-12rem)]">
            <div className="p-8 lg:p-12">
              {/* Header */}
              <div className="mb-8">
                <h1 className="text-3xl font-bold text-neutral-900 dark:text-white mb-2">
                  Blog Admin Dashboard
                </h1>
                <p className="text-neutral-600 dark:text-neutral-400">
                  Create and manage your blog posts
                </p>
              </div>

              {/* Message */}
              {message && (
                <div className={`mb-6 p-4 rounded-lg border ${
                  message.type === 'success' 
                    ? 'bg-green-50/50 dark:bg-green-900/20 border-green-200/50 dark:border-green-800/50 text-green-700 dark:text-green-300'
                    : 'bg-red-50/50 dark:bg-red-900/20 border-red-200/50 dark:border-red-800/50 text-red-700 dark:text-red-300'
                }`}>
                  {message.text}
                </div>
              )}

              {/* Tabs */}
              <div className="mb-8">
                <div className="flex space-x-1 bg-neutral-100/50 dark:bg-neutral-800/50 p-1 rounded-lg">
                  <button
                    onClick={() => setActiveTab('create')}
                    className={`px-6 py-2 rounded-md font-medium text-sm transition-all ${
                      activeTab === 'create'
                        ? 'bg-amber-500 text-white shadow-sm'
                        : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-200'
                    }`}
                  >
                    {editingPost ? 'Edit Post' : 'Create Post'}
                  </button>
                  <button
                    onClick={() => setActiveTab('manage')}
                    className={`px-6 py-2 rounded-md font-medium text-sm transition-all ${
                      activeTab === 'manage'
                        ? 'bg-amber-500 text-white shadow-sm'
                        : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-200'
                    }`}
                  >
                    Manage Posts
                  </button>
                </div>
              </div>

              {/* Create/Edit Post Tab */}
              {activeTab === 'create' && (
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
                      className="w-full px-4 py-3 bg-white/60 dark:bg-neutral-800/60 border border-neutral-200 dark:border-neutral-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 text-neutral-900 dark:text-white"
                      placeholder="Enter blog post title..."
                      required
                    />
                  </div>

                  {/* Category and Status */}
                  <div className="grid md:grid-cols-2 gap-6">
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
                        {categories.map(cat => (
                          <option key={cat} value={cat}>{cat}</option>
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
                      placeholder="Enter tags separated by commas..."
                    />
                  </div>

                  {/* Featured Image URL */}
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
                      placeholder="Brief description of the blog post..."
                      required
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
                      rows={15}
                      className="w-full px-4 py-3 bg-white/60 dark:bg-neutral-800/60 border border-neutral-200 dark:border-neutral-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 text-neutral-900 dark:text-white resize-none"
                      placeholder="Write your blog post content here... (Markdown supported)"
                      required
                    />
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
                          <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          {editingPost ? 'Updating...' : 'Creating...'}
                        </>
                      ) : (
                        editingPost ? 'Update Post' : 'Create Post'
                      )}
                    </button>

                    {editingPost && (
                      <button
                        type="button"
                        onClick={() => {
                          setEditingPost(null);
                          setFormData({
                            title: '',
                            content: '',
                            excerpt: '',
                            author: 'Umar Siddiqui',
                            tags: '',
                            category: '',
                            status: 'draft',
                            featuredImage: ''
                          });
                        }}
                        className="bg-neutral-500 hover:bg-neutral-600 text-white px-8 py-3 rounded-lg font-medium transition-all duration-200"
                      >
                        Cancel Edit
                      </button>
                    )}
                  </div>
                </form>
              )}

              {/* Manage Posts Tab */}
              {activeTab === 'manage' && (
                <div>
                  {loading ? (
                    <div className="text-center py-12">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-500 mx-auto"></div>
                      <p className="mt-4 text-neutral-600 dark:text-neutral-400">Loading posts...</p>
                    </div>
                  ) : posts.length === 0 ? (
                    <div className="text-center py-12">
                      <p className="text-neutral-600 dark:text-neutral-400">No blog posts found.</p>
                    </div>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead>
                          <tr className="border-b border-neutral-200 dark:border-neutral-700">
                            <th className="text-left py-4 px-2 font-medium text-neutral-700 dark:text-neutral-300">Title</th>
                            <th className="text-left py-4 px-2 font-medium text-neutral-700 dark:text-neutral-300">Category</th>
                            <th className="text-left py-4 px-2 font-medium text-neutral-700 dark:text-neutral-300">Status</th>
                            <th className="text-left py-4 px-2 font-medium text-neutral-700 dark:text-neutral-300">Date</th>
                            <th className="text-left py-4 px-2 font-medium text-neutral-700 dark:text-neutral-300">Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {posts.map((post) => (
                            <tr key={post._id} className="border-b border-neutral-100 dark:border-neutral-800">
                              <td className="py-4 px-2">
                                <div className="font-medium text-neutral-900 dark:text-white">{post.title}</div>
                                <div className="text-sm text-neutral-500 dark:text-neutral-400">by {post.author}</div>
                              </td>
                              <td className="py-4 px-2">
                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-neutral-100 dark:bg-neutral-800 text-neutral-800 dark:text-neutral-200">
                                  {post.category}
                                </span>
                              </td>
                              <td className="py-4 px-2">
                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                  post.status === 'published' 
                                    ? 'bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-300'
                                    : 'bg-yellow-100 dark:bg-yellow-900/20 text-yellow-800 dark:text-yellow-300'
                                }`}>
                                  {post.status}
                                </span>
                              </td>
                              <td className="py-4 px-2 text-neutral-600 dark:text-neutral-400">
                                {post.createdAt}
                              </td>
                              <td className="py-4 px-2">
                                <div className="flex space-x-2">
                                  <button
                                    onClick={() => handleEdit(post._id)}
                                    className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded text-sm transition-all duration-200"
                                  >
                                    Edit
                                  </button>
                                  <button
                                    onClick={() => handleDelete(post._id)}
                                    className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-sm transition-all duration-200"
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
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </>
  );
};

export default Admin;
