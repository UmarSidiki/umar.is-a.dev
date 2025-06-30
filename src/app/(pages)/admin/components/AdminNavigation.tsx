import React from "react";
import { AdminTab } from "../types";

interface AdminNavigationProps {
  activeTab: AdminTab;
  onTabChange: (tab: AdminTab) => void;
  onLogout: () => void;
}

export const AdminNavigation: React.FC<AdminNavigationProps> = ({
  activeTab,
  onTabChange,
  onLogout,
}) => {
  const tabs = [
    { id: "dashboard" as AdminTab, label: "Dashboard", icon: "📊" },
    { id: "create" as AdminTab, label: "Create", icon: "✏️" },
    { id: "manage" as AdminTab, label: "Manage", icon: "📝" },
    { id: "comments" as AdminTab, label: "Comments", icon: "💬" },
    { id: "projects" as AdminTab, label: "Projects", icon: "🚀" },
  ];

  return (
    <>
      {/* Mobile Header */}
      <div className="relative z-10 mb-6 sm:mb-8">
        {/* Mobile Top Bar */}
        <div className="flex items-center justify-between mb-4 sm:hidden px-1">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center shadow-lg">
              <span className="text-primary-foreground text-lg font-bold">A</span>
            </div>
            <div>
              <span className="text-base font-semibold text-foreground block">
                Admin Panel
              </span>
              <span className="text-xs text-muted-foreground">
                Welcome back
              </span>
            </div>
          </div>

          {/* Mobile Logout Button */}
          <button
            onClick={() => {
              if (confirm("Are you sure you want to logout?")) {
                onLogout();
              }
            }}
            className="relative z-10 bg-destructive hover:bg-destructive/90 active:bg-destructive/80 text-destructive-foreground px-4 py-2.5 rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl flex items-center space-x-2 font-medium text-sm"
            title="Logout from admin panel"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
              />
            </svg>
            <span className="hidden xs:inline">Logout</span>
          </button>
        </div>

        {/* Desktop Header */}
        <div className="hidden sm:flex items-center justify-between">
          <div>
            <h1 className="text-3xl sm:text-4xl font-bold text-foreground mb-2">
              Admin Dashboard
            </h1>
            <p className="text-muted-foreground">
              Manage your blog content, comments, and monitor website analytics
            </p>
          </div>
          <div className="flex items-center space-x-3">
            <div className="text-right">
              <div className="text-sm font-medium text-foreground">
                Welcome back
              </div>
              <div className="text-xs text-muted-foreground">
                Admin User
              </div>
            </div>

            <button
              onClick={() => {
                if (confirm("Are you sure you want to logout?")) {
                  onLogout();
                }
              }}
              className="relative z-10 bg-destructive hover:bg-destructive/90 active:bg-destructive/80 text-destructive-foreground px-6 py-3 rounded-xl font-medium text-sm transition-all duration-200 flex items-center space-x-2 shadow-lg hover:shadow-xl transform hover:scale-105"
              title="Logout from admin panel"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                />
              </svg>
              <span>Logout</span>
            </button>
          </div>
        </div>

        {/* Mobile Title */}
        <div className="sm:hidden px-1">
          <h1 className="text-2xl font-bold text-foreground mb-2">
            Admin Dashboard
          </h1>
          <p className="text-sm text-muted-foreground">
            Manage your content and monitor analytics
          </p>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="relative z-10 mb-6 sm:mb-8">
        {/* Mobile Navigation - Scrollable horizontal tabs */}
        <div className="sm:hidden">
          <div className="flex space-x-1 bg-muted/50 p-1.5 rounded-xl backdrop-blur-sm overflow-x-auto scrollbar-hide">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => onTabChange(tab.id)}
                className={`relative flex items-center space-x-2 px-4 py-2.5 rounded-lg font-medium text-sm transition-all duration-200 whitespace-nowrap ${
                  activeTab === tab.id
                    ? "bg-background text-foreground shadow-lg"
                    : "text-muted-foreground hover:text-foreground hover:bg-background/50"
                }`}
              >
                <span className="text-base">{tab.icon}</span>
                <span>{tab.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Desktop Navigation */}
        <div className="hidden sm:flex items-center justify-between">
          <div className="flex space-x-1 bg-muted/50 p-1 rounded-xl backdrop-blur-sm">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => onTabChange(tab.id)}
                className={`relative flex items-center space-x-3 px-6 py-3 rounded-xl font-medium text-sm transition-all duration-200 ${
                  activeTab === tab.id
                    ? "bg-background text-foreground shadow-lg"
                    : "text-muted-foreground hover:text-foreground hover:bg-background/50"
                }`}
              >
                <span className="text-lg">{tab.icon}</span>
                <span>{tab.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};
