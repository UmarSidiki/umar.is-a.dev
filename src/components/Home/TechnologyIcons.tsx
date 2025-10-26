"use client";

import React from "react";
import {
  Code,
  Globe,
  Cpu,
  Server,
  Network,
  Database,
  Boxes,
  Zap,
  Braces,
  Smartphone,
} from "lucide-react";

interface TechnologyProps {
  technologies: {
    name: string;
    iconName: string;
  }[];
}

// Map icon names to Lucide components
const iconMap = {
  react: Globe,
  nextjs: Network,
  reactnative: Smartphone,
  nodejs: Cpu,
  expressjs: Server,
  hono: Boxes,
  prisma: Braces,
  mongodb: Database,
  typescript: Code,
  automation: Zap,
};

const TechnologyIcons: React.FC<TechnologyProps> = ({ technologies }) => {
  const getIcon = (iconName: string) => {
    const IconComponent = iconMap[iconName as keyof typeof iconMap];
    return IconComponent ? (
      <IconComponent className="w-6 h-6 text-amber-500 dark:text-amber-400" />
    ) : null;
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
