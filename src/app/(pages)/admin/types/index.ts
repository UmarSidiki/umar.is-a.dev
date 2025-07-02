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

export type AdminTab = "dashboard" | "create" | "manage" | "comments" | "projects" | "images";

export interface MessageState {
  type: "success" | "error";
  text: string;
}

export interface AdminFilters {
  searchTerm: string;
  selectedCategory: string;
  selectedStatus: string;
}

export interface Project {
  _id: string;
  title: string;
  description: string;
  longDescription?: string;
  technologies: string[];
  category: string;
  status: "active" | "completed" | "archived";
  featured: boolean;
  githubUrl?: string;
  liveUrl?: string;
  imageUrl?: string;
  images?: string[];
  createdAt: string;
  updatedAt: string;
  startDate?: string;
  endDate?: string;
  client?: string;
  teamSize?: number;
  role?: string;
}

export interface ProjectFormData {
  title: string;
  description: string;
  longDescription: string;
  technologies: string;
  category: string;
  status: "active" | "completed" | "archived";
  featured: boolean;
  githubUrl: string;
  liveUrl: string;
  imageUrl: string;
  images: string;
  startDate: string;
  endDate: string;
  client: string;
  teamSize: string;
  role: string;
}

export interface ProjectStats {
  totalProjects: number;
  activeProjects: number;
  completedProjects: number;
  featuredProjects: number;
}
