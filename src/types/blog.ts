import { ObjectId } from 'mongodb';

export interface BlogPost {
  _id?: ObjectId | string;
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  author: string;
  tags: string[];
  category: string;
  status: 'draft' | 'published';
  featuredImage?: string;
  createdAt: Date;
  updatedAt: Date;
  publishedAt?: Date;
  readTime?: number;
}

export interface BlogPostFormData {
  title: string;
  content: string;
  excerpt: string;
  author: string;
  tags: string;
  category: string;
  status: 'draft' | 'published';
  featuredImage?: string;
}

// Generate slug from title
export function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9 -]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();
}

// Calculate reading time (approximately 200 words per minute)
export function calculateReadTime(content: string): number {
  const words = content.trim().split(/\s+/).length;
  return Math.ceil(words / 200);
}

// Validate blog post data
export function validateBlogPost(data: BlogPostFormData): string[] {
  const errors: string[] = [];

  if (!data.title.trim()) {
    errors.push('Title is required');
  }

  if (!data.content.trim()) {
    errors.push('Content is required');
  }

  if (!data.excerpt.trim()) {
    errors.push('Excerpt is required');
  }

  if (!data.author.trim()) {
    errors.push('Author is required');
  }

  if (!data.category.trim()) {
    errors.push('Category is required');
  }

  if (data.title.trim().length > 100) {
    errors.push('Title must be less than 100 characters');
  }

  if (data.excerpt.trim().length > 300) {
    errors.push('Excerpt must be less than 300 characters');
  }

  return errors;
}
