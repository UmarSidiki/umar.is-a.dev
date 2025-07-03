"use client";

import {
  Palette,
  Globe,
  Rocket,
  Settings,
  Smartphone,
  Send,
  Mail,
  Phone,
  MapPin,
  Github,
  Linkedin,
  FileText,
  Bookmark,
  Code,
  Server,
  BoxSelect,
  Database,
  FileCode,
  Target,
  MessageSquare,
  CheckCircle,
  FileText as FileIcon,
  Image,
  BarChart,
  LayoutDashboard,
  Folder,
  ChevronRight,
  PlusCircle,
  AlertTriangle,
  CircleUserRound,
  Layers,
  Briefcase,
  GraduationCap
} from "lucide-react";

// Services icons
export const serviceIcons = {
  brandIdentity: Palette,
  businessWebsites: Globe,
  mvpDevelopment: Rocket,
  webSystemDevelopment: Settings,
  mobileAppDevelopment: Smartphone
};

// Contact icons
export const contactIcons = {
  email: Mail,
  phone: Phone,
  location: MapPin
};

// Social icons
export const socialIcons = {
  github: Github,
  linkedin: Linkedin,
  resume: FileText
};

// Technology icons
export const technologyIcons = {
  react: () => <Code className="text-blue-500" />,
  nextjs: () => <Server className="text-black dark:text-white" />,
  nodejs: () => <BoxSelect className="text-green-600" />,
  expressjs: () => <Database className="text-gray-600" />,
  laravel: () => <FileCode className="text-red-500" />,
  wordpress: () => <Bookmark className="text-blue-400" />,
  typescript: () => <Code className="text-blue-600" />,
  flutter: () => <Target className="text-blue-400" />
};

// Admin icons
export const adminIcons = {
  dashboard: LayoutDashboard,
  posts: FileText,
  projects: Rocket,
  images: Image,
  comments: MessageSquare,
  published: CheckCircle,
  drafts: FileIcon,
  manage: Folder,
  create: PlusCircle,
  warning: AlertTriangle,
  profile: CircleUserRound,
  stats: BarChart,
  layers: Layers
};

// UI Icons
export const uiIcons = {
  arrowRight: ChevronRight,
  send: Send
};

// Experience and education icons
export const experienceIcons = {
  work: Briefcase,
  education: GraduationCap
};
