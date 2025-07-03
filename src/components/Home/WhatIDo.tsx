"use client";

import React from "react";
import { 
  Palette, 
  Globe, 
  Rocket, 
  Settings, 
  Smartphone,
  ChevronRight
} from "lucide-react";

interface ServiceItem {
  title: string;
  description: string;
  iconName: string;
}

interface WhatIDoProps {
  services: ServiceItem[];
  title?: string;
  subtitle?: string;
  onRequestMore?: () => void;
}

// Map icon names to their components
const iconMap = {
  brandIdentity: Palette,
  businessWebsites: Globe,
  mvpDevelopment: Rocket,
  webSystemDevelopment: Settings,
  mobileAppDevelopment: Smartphone
};

const WhatIDo: React.FC<WhatIDoProps> = ({
  services,
  title = "What I Do",
  subtitle,
  onRequestMore,
}) => {
  // Function to get the correct icon based on iconName
  const getIcon = (iconName: string) => {
    const IconComponent = iconMap[iconName as keyof typeof iconMap];
    return IconComponent ? <IconComponent className="w-6 h-6 text-amber-500 dark:text-amber-400" /> : null;
  };

  return (
    <section className="mb-16">
      <h2 className="text-2xl font-bold text-neutral-900 dark:text-white mb-2 text-center">
        {title}
      </h2>
      {subtitle && (
        <p className="text-neutral-600 dark:text-neutral-400 text-center mb-8 max-w-2xl mx-auto">
          {subtitle}
        </p>
      )}

      <div className="grid md:grid-cols-2 gap-6">
        {services.map((service, index) => (
          <div
            key={index}
            className="bg-white/50 dark:bg-neutral-800/50 backdrop-blur-sm border border-neutral-200/50 dark:border-neutral-700/50 rounded-xl p-6 hover:shadow-lg transition-all duration-200 group hover:-translate-y-1"
          >
            <div className="text-amber-500 dark:text-amber-400 group-hover:scale-110 transition-transform duration-200 mb-4">
              {getIcon(service.iconName)}
            </div>
            <h3 className="text-xl font-semibold text-neutral-900 dark:text-white mb-2">
              {service.title}
            </h3>
            <p className="text-neutral-600 dark:text-neutral-400">
              {service.description}
            </p>
          </div>
        ))}
      </div>

      {onRequestMore && (
        <div className="mt-10 text-center">
          <button
            onClick={onRequestMore}
            className="inline-flex items-center gap-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white px-6 py-3 rounded-xl font-medium shadow-md hover:shadow-lg transition-all duration-200 transform hover:-translate-y-0.5"
          >
            <span>Request for More</span>
            <ChevronRight className="w-5 h-5" />
          </button>
          <p className="mt-3 text-sm text-neutral-600 dark:text-neutral-400">
            Give me feedback, I really enjoy learning new things
          </p>
        </div>
      )}
    </section>
  );
};

export default WhatIDo;
