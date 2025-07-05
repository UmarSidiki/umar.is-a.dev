"use client";

import React from "react";
import { DashboardStats as DashboardStatsType } from "../types";

interface DashboardStatsProps {
  stats: DashboardStatsType;
  loading: boolean;
}

export const DashboardStats: React.FC<DashboardStatsProps> = ({
  stats,
  loading,
}) => {
  if (loading) {
    return (
      <div className="space-y-8">
        {/* Header Skeleton */}
        <div className="flex items-center justify-between">
          <div className="animate-pulse">
            <div className="h-8 bg-neutral-200 dark:bg-neutral-700 rounded-lg w-64 mb-2"></div>
            <div className="h-4 bg-neutral-200 dark:bg-neutral-700 rounded w-48"></div>
          </div>
          <div className="animate-pulse">
            <div className="h-10 bg-neutral-200 dark:bg-neutral-700 rounded-lg w-32"></div>
          </div>
        </div>

        {/* Stats Cards Skeleton */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-white dark:bg-neutral-800 rounded-2xl p-6 border border-neutral-200 dark:border-neutral-700 shadow-sm">
              <div className="animate-pulse">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-neutral-200 dark:bg-neutral-700 rounded-xl"></div>
                  <div className="w-6 h-6 bg-neutral-200 dark:bg-neutral-700 rounded"></div>
                </div>
                <div className="h-8 bg-neutral-200 dark:bg-neutral-700 rounded mb-2"></div>
                <div className="h-4 bg-neutral-200 dark:bg-neutral-700 rounded w-20"></div>
              </div>
            </div>
          ))}
        </div>

        {/* Content Skeleton */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {[...Array(2)].map((_, i) => (
            <div key={i} className="bg-white dark:bg-neutral-800 rounded-2xl p-6 border border-neutral-200 dark:border-neutral-700 shadow-sm">
              <div className="animate-pulse">
                <div className="h-6 bg-neutral-200 dark:bg-neutral-700 rounded mb-4 w-32"></div>
                <div className="space-y-3">
                  {[...Array(3)].map((_, j) => (
                    <div key={j} className="h-16 bg-neutral-100 dark:bg-neutral-700/50 rounded-xl"></div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  const statCards = [
    {
      title: "Total Posts",
      value: stats.totalPosts,
      icon: "📝",
      color: "from-amber-500 to-amber-600",
      bgColor: "bg-amber-50 dark:bg-amber-900/20",
      textColor: "text-amber-600 dark:text-amber-400",
      change: "+12%",
      isIncrease: true,
    },
    {
      title: "Published",
      value: stats.publishedPosts,
      icon: "✅",
      color: "from-green-500 to-green-600",
      bgColor: "bg-green-50 dark:bg-green-900/20",
      textColor: "text-green-600 dark:text-green-400",
      change: "+8%",
      isIncrease: true,
    },
    {
      title: "Drafts",
      value: stats.draftPosts,
      icon: "📄",
      color: "from-amber-500 to-amber-600",
      bgColor: "bg-amber-50 dark:bg-amber-900/20",
      textColor: "text-amber-600 dark:text-amber-400",
      change: "-3%",
      isIncrease: false,
    },
    {
      title: "Comments",
      value: stats.totalComments,
      icon: "💬",
      color: "from-red-500 to-red-600",
      bgColor: "bg-red-50 dark:bg-red-900/20",
      textColor: "text-red-600 dark:text-red-400",
      change: "+23%",
      isIncrease: true,
    },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-amber-600 to-red-600 bg-clip-text text-transparent">
            Dashboard Overview
          </h1>
          <p className="text-neutral-600 dark:text-neutral-400 mt-1">
            Welcome back! Here&apos;s what&apos;s happening with your content.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="text-sm text-neutral-500 dark:text-neutral-400">
            Last updated: {new Date().toLocaleTimeString()}
          </div>
          <button className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white rounded-lg transition-colors text-sm font-medium shadow-sm">
            Refresh
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, index) => (
          <div
            key={index}
            className="bg-white dark:bg-neutral-800 rounded-2xl p-6 border border-neutral-200 dark:border-neutral-700 hover:shadow-lg hover:border-neutral-300 dark:hover:border-neutral-600 transition-all duration-200 group"
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`w-12 h-12 ${stat.bgColor} rounded-xl flex items-center justify-center text-lg group-hover:scale-110 transition-transform duration-200`}>
                <span className={stat.textColor}>{stat.icon}</span>
              </div>
              <div className={`flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-full ${
                stat.isIncrease 
                  ? 'bg-green-100 dark:bg-green-900/20 text-green-600 dark:text-green-400' 
                  : 'bg-red-100 dark:bg-red-900/20 text-red-600 dark:text-red-400'
              }`}>
                <span className={stat.isIncrease ? '↗️' : '↘️'}></span>
                {stat.change}
              </div>
            </div>
            <div className="text-3xl font-bold text-neutral-900 dark:text-neutral-100 mb-1">
              {stat.value.toLocaleString()}
            </div>
            <div className="text-sm text-neutral-600 dark:text-neutral-400">
              {stat.title}
            </div>
          </div>
        ))}
      </div>

      {/* Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Posts */}
        <div className="bg-white dark:bg-neutral-800 rounded-2xl border border-neutral-200 dark:border-neutral-700 shadow-sm">
          <div className="p-6 border-b border-neutral-200 dark:border-neutral-700">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100">
                Recent Posts
              </h3>
              <button className="text-sm text-amber-600 dark:text-amber-400 hover:text-amber-700 dark:hover:text-amber-300 font-medium">
                View all
              </button>
            </div>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {stats.recentPosts.length > 0 ? (
                stats.recentPosts.slice(0, 5).map((post, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-4 p-4 bg-neutral-50 dark:bg-neutral-700/50 rounded-xl hover:bg-neutral-100 dark:hover:bg-neutral-700 transition-colors"
                  >
                    <div className="w-10 h-10 bg-gradient-to-br from-amber-500 to-amber-600 rounded-lg flex items-center justify-center text-white font-bold text-sm">
                      {post.title.charAt(0).toUpperCase()}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium text-neutral-900 dark:text-neutral-100 truncate">
                        {post.title}
                      </div>
                      <div className="text-xs text-neutral-500 dark:text-neutral-400 flex items-center gap-2">
                        <span className="px-2 py-1 bg-neutral-200 dark:bg-neutral-600 rounded-full">
                          {post.category}
                        </span>
                        <span>•</span>
                        <span>{new Date(post.createdAt).toLocaleDateString()}</span>
                      </div>
                    </div>
                    <div className="text-xs text-neutral-400">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-neutral-100 dark:bg-neutral-700 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-neutral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  <h4 className="text-sm font-medium text-neutral-900 dark:text-neutral-100 mb-1">
                    No recent posts
                  </h4>
                  <p className="text-xs text-neutral-500 dark:text-neutral-400">
                    Start creating content to see your posts here
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Analytics & Quick Actions */}
        <div className="bg-white dark:bg-neutral-800 rounded-2xl border border-neutral-200 dark:border-neutral-700 shadow-sm">
          <div className="p-6 border-b border-neutral-200 dark:border-neutral-700">
            <h3 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100">
              Quick Actions
            </h3>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-2 gap-4 mb-6">
              <button className="p-4 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 rounded-xl hover:from-blue-100 hover:to-blue-200 dark:hover:from-blue-900/30 dark:hover:to-blue-800/30 transition-all duration-200 group border border-blue-200 dark:border-blue-800">
                <div className="text-2xl mb-2 group-hover:scale-110 transition-transform">📝</div>
                <div className="text-sm font-medium text-blue-700 dark:text-blue-300">Create Post</div>
              </button>
              <button className="p-4 bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 rounded-xl hover:from-green-100 hover:to-green-200 dark:hover:from-green-900/30 dark:hover:to-green-800/30 transition-all duration-200 group border border-green-200 dark:border-green-800">
                <div className="text-2xl mb-2 group-hover:scale-110 transition-transform">🚀</div>
                <div className="text-sm font-medium text-green-700 dark:text-green-300">New Project</div>
              </button>
              <button className="p-4 bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 rounded-xl hover:from-purple-100 hover:to-purple-200 dark:hover:from-purple-900/30 dark:hover:to-purple-800/30 transition-all duration-200 group border border-purple-200 dark:border-purple-800">
                <div className="text-2xl mb-2 group-hover:scale-110 transition-transform">💬</div>
                <div className="text-sm font-medium text-purple-700 dark:text-purple-300">Comments</div>
              </button>
              <button className="p-4 bg-gradient-to-br from-amber-50 to-amber-100 dark:from-amber-900/20 dark:to-amber-800/20 rounded-xl hover:from-amber-100 hover:to-amber-200 dark:hover:from-amber-900/30 dark:hover:to-amber-800/30 transition-all duration-200 group border border-amber-200 dark:border-amber-800">
                <div className="text-2xl mb-2 group-hover:scale-110 transition-transform">🖼️</div>
                <div className="text-sm font-medium text-amber-700 dark:text-amber-300">Images</div>
              </button>
            </div>

            {/* Top Categories */}
            <div className="space-y-3">
              <h4 className="text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-3">
                Top Categories
              </h4>
              {stats.topCategories.length > 0 ? (
                stats.topCategories.slice(0, 4).map((category, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 bg-neutral-50 dark:bg-neutral-700/50 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-700 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-gradient-to-br from-neutral-400 to-neutral-500 rounded-lg flex items-center justify-center text-white font-bold text-xs">
                        {category.name.charAt(0).toUpperCase()}
                      </div>
                      <div className="text-sm font-medium text-neutral-900 dark:text-neutral-100">
                        {category.name}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-neutral-600 dark:text-neutral-400">
                        {category.posts}
                      </span>
                      <span className="text-xs text-neutral-400">posts</span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-6">
                  <p className="text-sm text-neutral-500 dark:text-neutral-400">
                    No categories yet
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
