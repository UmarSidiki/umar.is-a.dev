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
        
        {/* Request for More Card */}
        {onRequestMore && (
          <div
            onClick={onRequestMore}
            className="bg-gradient-to-br from-amber-500/50 to-amber-600/50 dark:from-amber-800/50 dark:to-amber-900/50 backdrop-blur-sm border border-amber-200/50 dark:amber-amber-700/50 rounded-xl p-6 hover:shadow-lg transition-all duration-200 group hover:-translate-y-1 cursor-pointer"
          >
            <div className="text-amber-600 dark:text-amber-300 group-hover:scale-110 transition-transform duration-200 mb-4">
              <ChevronRight className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-semibold text-amber-900 dark:text-amber-100 mb-2">
              REQUEST FOR MORE
            </h3>
            <p className="text-amber-700 dark:text-amber-300">
              Give me feedback, I really enjoy learning new things
            </p>
          </div>
        )}
      </div>
    </section>
  );
};

export default WhatIDo;
