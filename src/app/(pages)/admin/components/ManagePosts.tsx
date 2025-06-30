import React from "react";
import { BlogPostListItem, AdminFilters } from "../types";
import { categories } from "../utils/helpers";

interface ManagePostsProps {
  posts: BlogPostListItem[];
  loading: boolean;
  filters: AdminFilters;
  onFiltersChange: (filters: Partial<AdminFilters>) => void;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
}

export const ManagePosts: React.FC<ManagePostsProps> = ({
  posts,
  loading,
  filters,
  onFiltersChange,
  onEdit,
  onDelete,
}) => {
  const filteredPosts = posts.filter((post) => {
    const matchesSearch =
      post.title.toLowerCase().includes(filters.searchTerm.toLowerCase()) ||
      post.category.toLowerCase().includes(filters.searchTerm.toLowerCase()) ||
      post.author.toLowerCase().includes(filters.searchTerm.toLowerCase());

    const matchesCategory =
      filters.selectedCategory === "all" || post.category === filters.selectedCategory;
    const matchesStatus =
      filters.selectedStatus === "all" || post.status === filters.selectedStatus;

    return matchesSearch && matchesCategory && matchesStatus;
  });

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-neutral-900 dark:text-white">
          Manage Posts
        </h2>
        <div className="text-sm text-neutral-600 dark:text-neutral-400">
          {filteredPosts.length} of {posts.length} posts
        </div>
      </div>

      {/* Filters */}
      <div className="mb-6 p-4 bg-neutral-50/50 dark:bg-neutral-700/50 rounded-xl border border-neutral-200/50 dark:border-neutral-600/50">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Search */}
          <div>
            <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
              Search
            </label>
            <input
              type="text"
              value={filters.searchTerm}
              onChange={(e) => onFiltersChange({ searchTerm: e.target.value })}
              className="w-full px-3 py-2 bg-white dark:bg-neutral-700 border border-neutral-300 dark:border-neutral-600 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all duration-200 text-sm"
              placeholder="Search posts..."
            />
          </div>

          {/* Category Filter */}
          <div>
            <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
              Category
            </label>
            <select
              value={filters.selectedCategory}
              onChange={(e) => onFiltersChange({ selectedCategory: e.target.value })}
              className="w-full px-3 py-2 bg-white dark:bg-neutral-700 border border-neutral-300 dark:border-neutral-600 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all duration-200 text-sm"
            >
              <option value="all">All Categories</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          {/* Status Filter */}
          <div>
            <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
              Status
            </label>
            <select
              value={filters.selectedStatus}
              onChange={(e) => onFiltersChange({ selectedStatus: e.target.value })}
              className="w-full px-3 py-2 bg-white dark:bg-neutral-700 border border-neutral-300 dark:border-neutral-600 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all duration-200 text-sm"
            >
              <option value="all">All Status</option>
              <option value="published">Published</option>
              <option value="draft">Draft</option>
            </select>
          </div>
        </div>
      </div>

      {/* Posts Table */}
      {loading ? (
        <div className="text-center py-12">
          <div className="w-8 h-8 bg-gradient-to-br from-amber-500 to-amber-600 rounded-full mx-auto mb-4 flex items-center justify-center">
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
          </div>
          <p className="text-neutral-600 dark:text-neutral-400">Loading posts...</p>
        </div>
      ) : filteredPosts.length === 0 ? (
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-gradient-to-br from-neutral-200 to-neutral-300 dark:from-neutral-700 dark:to-neutral-800 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl">📄</span>
          </div>
          <h3 className="text-lg font-medium text-neutral-900 dark:text-white mb-2">
            No posts found
          </h3>
          <p className="text-neutral-600 dark:text-neutral-400">
            {posts.length === 0 
              ? "Create your first blog post to get started."
              : "Try adjusting your search or filter criteria."
            }
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-neutral-200 dark:border-neutral-700">
                <th className="text-left py-3 px-4 font-medium text-neutral-700 dark:text-neutral-300">
                  Title
                </th>
                <th className="text-left py-3 px-4 font-medium text-neutral-700 dark:text-neutral-300">
                  Category
                </th>
                <th className="text-left py-3 px-4 font-medium text-neutral-700 dark:text-neutral-300">
                  Status
                </th>
                <th className="text-left py-3 px-4 font-medium text-neutral-700 dark:text-neutral-300">
                  Date
                </th>
                <th className="text-left py-3 px-4 font-medium text-neutral-700 dark:text-neutral-300">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredPosts.map((post) => (
                <tr
                  key={post._id}
                  className="border-b border-neutral-100 dark:border-neutral-800 hover:bg-neutral-50/50 dark:hover:bg-neutral-700/50 transition-all duration-200"
                >
                  <td className="py-4 px-4">
                    <div className="font-medium text-neutral-900 dark:text-white">
                      {post.title}
                    </div>
                    <div className="text-sm text-neutral-600 dark:text-neutral-400">
                      by {post.author}
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300">
                      {post.category}
                    </span>
                  </td>
                  <td className="py-4 px-4">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        post.status === "published"
                          ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
                          : "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300"
                      }`}
                    >
                      {post.status}
                    </span>
                  </td>
                  <td className="py-4 px-4 text-sm text-neutral-600 dark:text-neutral-400">
                    {post.createdAt}
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => onEdit(post._id)}
                        className="p-2 text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-all duration-200"
                        title="Edit post"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                      </button>
                      <button
                        onClick={() => onDelete(post._id)}
                        className="p-2 text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-all duration-200"
                        title="Delete post"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Pagination would go here if needed */}
      {filteredPosts.length > 0 && (
        <div className="mt-6 flex items-center justify-between text-sm text-neutral-600 dark:text-neutral-400">
          <div>
            Showing {filteredPosts.length} of {posts.length} posts
          </div>
        </div>
      )}
    </div>
  );
};
