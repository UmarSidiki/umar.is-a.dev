export interface BlogPostListItem {
  _id: string;
  title: string;
  status: "draft" | "published";
  createdAt: string;
  author: string;
  category: string;
  commentCount?: number;
  slug: string;
}

export interface DashboardStats {
  totalPosts: number;
  publishedPosts: number;
  draftPosts: number;
  totalComments: number;
  pendingComments: number;
  recentPosts: Array<{
    title: string;
    slug: string;
    category: string;
    createdAt: string;
  }>;
  recentActivity: Array<{ type: string; content: string; timestamp: string }>;
  topCategories: Array<{ name: string; posts: number }>;
}

export type AdminTab = "dashboard" | "create" | "manage" | "comments";

export interface MessageState {
  type: "success" | "error";
  text: string;
}

export interface AdminFilters {
  searchTerm: string;
  selectedCategory: string;
  selectedStatus: string;
}
