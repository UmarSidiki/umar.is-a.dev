"use client";

import React from "react";
import { 
  Code, 
  Server, 
  BoxSelect, 
  Database, 
  FileCode, 
  Bookmark, 
  Target
} from "lucide-react";

interface TechnologyProps {
  technologies: {
    name: string;
    iconName: string;
  }[];
}

// Map icon names to their components
const iconMap = {
  react: Code,
  nextjs: Server,
  nodejs: BoxSelect,
  expressjs: Database,
  laravel: FileCode,
  wordpress: Bookmark,
  typescript: Code,
  flutter: Target
};

const TechnologyIcons: React.FC<TechnologyProps> = ({ technologies }) => {
  // Function to get the correct icon based on iconName
  const getIcon = (iconName: string) => {
    const IconComponent = iconMap[iconName as keyof typeof iconMap];
    return IconComponent ? <IconComponent className="w-6 h-6 text-amber-500 dark:text-amber-400" /> : null;
  };

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
      {technologies.map((tech, index) => (
        <div
          key={index}
          className="bg-white/50 dark:bg-neutral-800/50 backdrop-blur-sm border border-neutral-200/50 dark:border-neutral-700/50 rounded-xl p-4 text-center hover:shadow-lg transition-all duration-200 group hover:-translate-y-1"
        >
          <div className="text-2xl mb-2 group-hover:scale-110 transition-transform duration-200 flex justify-center">
            {getIcon(tech.iconName)}
          </div>
          <div className="text-sm font-medium text-neutral-700 dark:text-neutral-300">
            {tech.name}
          </div>
        </div>
      ))}
    </div>
  );
};

export default TechnologyIcons;
