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
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="bg-card rounded-2xl p-6 border">
            <div className="animate-pulse">
              <div className="h-4 bg-muted rounded mb-2"></div>
              <div className="h-8 bg-muted rounded"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  const statCards = [
    {
      title: "Total Posts",
      value: stats.totalPosts,
      icon: "📝",
      color: "from-blue-500 to-blue-600",
    },
    {
      title: "Published",
      value: stats.publishedPosts,
      icon: "✅",
      color: "from-green-500 to-green-600",
    },
    {
      title: "Drafts",
      value: stats.draftPosts,
      icon: "📄",
      color: "from-yellow-500 to-yellow-600",
    },
    {
      title: "Comments",
      value: stats.totalComments,
      icon: "💬",
      color: "from-purple-500 to-purple-600",
    },
  ];

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-foreground">
          Dashboard Overview
        </h2>
        <div className="text-sm text-muted-foreground">
          Last updated: {new Date().toLocaleTimeString()}
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8">
        {statCards.map((stat, index) => (
          <div
            key={index}
            className="bg-card rounded-2xl p-6 border hover:shadow-lg transition-all duration-200"
          >
            <div className="flex items-center justify-between mb-3">
              <div className={`w-12 h-12 bg-gradient-to-br ${stat.color} rounded-xl flex items-center justify-center text-white text-lg shadow-lg`}>
                {stat.icon}
              </div>
            </div>
            <div className="text-2xl font-bold text-foreground mb-1">
              {stat.value}
            </div>
            <div className="text-sm text-muted-foreground">
              {stat.title}
            </div>
          </div>
        ))}
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Posts */}
        <div className="bg-card rounded-2xl p-6 border">
          <h3 className="text-lg font-semibold text-foreground mb-4">
            Recent Posts
          </h3>
          <div className="space-y-3">
            {stats.recentPosts.length > 0 ? (
              stats.recentPosts.slice(0, 5).map((post, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 bg-muted/50 rounded-xl"
                >
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium text-foreground truncate">
                      {post.title}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {post.category} • {new Date(post.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                No recent posts found
              </div>
            )}
          </div>
        </div>

        {/* Top Categories */}
        <div className="bg-card rounded-2xl p-6 border">
          <h3 className="text-lg font-semibold text-foreground mb-4">
            Top Categories
          </h3>
          <div className="space-y-3">
            {stats.topCategories.length > 0 ? (
              stats.topCategories.slice(0, 5).map((category, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 bg-muted/50 rounded-xl"
                >
                  <div className="text-sm font-medium text-foreground">
                    {category.name}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {category.posts} posts
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                No categories found
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
