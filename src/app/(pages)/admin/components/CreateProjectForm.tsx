import React from "react";
import { ProjectFormData, Project } from "../types";
import ImageUpload from "@/components/ImageUpload";

interface CreateProjectFormProps {
  formData: ProjectFormData;
  editingProject: Project | null;
  loading: boolean;
  onInputChange: (field: keyof ProjectFormData, value: string | boolean) => void;
  onSubmit: (e: React.FormEvent) => void;
  onReset: () => void;
}

export const CreateProjectForm: React.FC<CreateProjectFormProps> = ({
  formData,
  editingProject,
  loading,
  onInputChange,
  onSubmit,
  onReset,
}) => {
  const categories = [
    "Web Application",
    "Mobile App",
    "Desktop App",
    "Library/Package",
    "API/Backend",
    "Portfolio",
    "E-commerce",
    "Educational",
    "Tool/Utility",
    "Other"
  ];

  const statusOptions = [
    { value: "active", label: "Active" },
    { value: "completed", label: "Completed" },
    { value: "archived", label: "Archived" },
  ];

  return (
    <div className="bg-white/95 dark:bg-neutral-900/95 backdrop-blur-xl rounded-2xl border border-neutral-200/50 dark:border-neutral-700/50 shadow-xl">
      <div className="p-6 border-b border-neutral-200/50 dark:border-neutral-700/50">
        <h2 className="text-2xl font-bold text-neutral-900 dark:text-neutral-100">
          {editingProject ? "Edit Project" : "Create New Project"}
        </h2>
        <p className="text-neutral-600 dark:text-neutral-400 mt-1">
          {editingProject ? "Update project details" : "Add a new project to your portfolio"}
        </p>
      </div>

      <form onSubmit={onSubmit} className="p-6 space-y-6">
        {/* Basic Information */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
              Project Title *
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => onInputChange("title", e.target.value)}
              className="w-full px-4 py-3 bg-white dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-600 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200"
              placeholder="Enter project title"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
              Category *
            </label>
            <select
              value={formData.category}
              onChange={(e) => onInputChange("category", e.target.value)}
              className="w-full px-4 py-3 bg-white dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-600 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200"
              required
            >
              <option value="">Select category</option>
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
            Short Description *
          </label>
          <textarea
            value={formData.description}
            onChange={(e) => onInputChange("description", e.target.value)}
            rows={3}
            className="w-full px-4 py-3 bg-white dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-600 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200 resize-none"
            placeholder="Brief description of the project"
            required
          />
        </div>

        {/* Long Description */}
        <div>
          <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
            Detailed Description
          </label>
          <textarea
            value={formData.longDescription}
            onChange={(e) => onInputChange("longDescription", e.target.value)}
            rows={6}
            className="w-full px-4 py-3 bg-white dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-600 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200 resize-none"
            placeholder="Detailed description, features, challenges, etc."
          />
        </div>

        {/* Technologies */}
        <div>
          <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
            Technologies
          </label>
          <input
            type="text"
            value={formData.technologies}
            onChange={(e) => onInputChange("technologies", e.target.value)}
            className="w-full px-4 py-3 bg-white dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-600 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200"
            placeholder="React, Next.js, TypeScript, Node.js (comma-separated)"
          />
          <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">
            Separate technologies with commas
          </p>
        </div>

        {/* Status and Featured */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
              Status
            </label>
            <select
              value={formData.status}
              onChange={(e) => onInputChange("status", e.target.value as "active" | "completed" | "archived")}
              className="w-full px-4 py-3 bg-white dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-600 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200"
            >
              {statusOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center pt-8">
            <label className="flex items-center space-x-3 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.featured}
                onChange={(e) => onInputChange("featured", e.target.checked)}
                className="w-5 h-5 text-primary border-neutral-300 dark:border-neutral-600 rounded focus:ring-2 focus:ring-primary"
              />
              <span className="text-sm font-medium text-neutral-700 dark:text-neutral-300">
                Featured Project
              </span>
            </label>
          </div>
        </div>

        {/* URLs */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
              GitHub URL
            </label>
            <input
              type="url"
              value={formData.githubUrl}
              onChange={(e) => onInputChange("githubUrl", e.target.value)}
              className="w-full px-4 py-3 bg-white dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-600 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200"
              placeholder="https://github.com/username/project"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
              Live Demo URL
            </label>
            <input
              type="url"
              value={formData.liveUrl}
              onChange={(e) => onInputChange("liveUrl", e.target.value)}
              className="w-full px-4 py-3 bg-white dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-600 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200"
              placeholder="https://project-demo.com"
            />
          </div>
        </div>

        {/* Images */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <ImageUpload
            currentImage={formData.imageUrl}
            onImageChange={(url) => onInputChange("imageUrl", url)}
            folder="projects"
            label="Main Project Image"
            className="w-full"
          />

          <div>
            <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
              Additional Images
            </label>
            <input
              type="text"
              value={formData.images}
              onChange={(e) => onInputChange("images", e.target.value)}
              className="w-full px-4 py-3 bg-white dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-600 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200"
              placeholder="URL1, URL2, URL3 (comma-separated)"
            />
            <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">
              Separate image URLs with commas
            </p>
          </div>
        </div>

        {/* Dates */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
              Start Date
            </label>
            <input
              type="date"
              value={formData.startDate}
              onChange={(e) => onInputChange("startDate", e.target.value)}
              className="w-full px-4 py-3 bg-white dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-600 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
              End Date
            </label>
            <input
              type="date"
              value={formData.endDate}
              onChange={(e) => onInputChange("endDate", e.target.value)}
              className="w-full px-4 py-3 bg-white dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-600 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200"
            />
          </div>
        </div>

        {/* Additional Information */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div>
            <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
              Client
            </label>
            <input
              type="text"
              value={formData.client}
              onChange={(e) => onInputChange("client", e.target.value)}
              className="w-full px-4 py-3 bg-white dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-600 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200"
              placeholder="Client name or 'Personal'"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
              Team Size
            </label>
            <input
              type="number"
              value={formData.teamSize}
              onChange={(e) => onInputChange("teamSize", e.target.value)}
              className="w-full px-4 py-3 bg-white dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-600 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200"
              placeholder="1"
              min="1"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
              Your Role
            </label>
            <input
              type="text"
              value={formData.role}
              onChange={(e) => onInputChange("role", e.target.value)}
              className="w-full px-4 py-3 bg-white dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-600 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200"
              placeholder="Full-Stack Developer"
            />
          </div>
        </div>

        {/* Form Actions */}
        <div className="flex flex-col sm:flex-row gap-3 pt-6 border-t border-neutral-200/50 dark:border-neutral-700/50">
          <button
            type="submit"
            disabled={loading}
            className="flex-1 bg-primary hover:bg-primary/90 active:bg-primary/80 disabled:bg-neutral-400 disabled:cursor-not-allowed text-primary-foreground px-6 py-3 rounded-xl transition-all duration-200 font-medium shadow-lg hover:shadow-xl disabled:shadow-none flex items-center justify-center space-x-2"
          >
            {loading ? (
              <>
                <div className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                <span>{editingProject ? "Updating..." : "Creating..."}</span>
              </>
            ) : (
              <span>{editingProject ? "Update Project" : "Create Project"}</span>
            )}
          </button>

          <button
            type="button"
            onClick={onReset}
            disabled={loading}
            className="flex-1 sm:flex-none bg-neutral-200 hover:bg-neutral-300 active:bg-neutral-400 dark:bg-neutral-700 dark:hover:bg-neutral-600 dark:active:bg-neutral-500 disabled:opacity-50 disabled:cursor-not-allowed text-neutral-800 dark:text-neutral-200 px-6 py-3 rounded-xl transition-all duration-200 font-medium"
          >
            {editingProject ? "Cancel Edit" : "Reset Form"}
          </button>
        </div>
      </form>
    </div>
  );
};
