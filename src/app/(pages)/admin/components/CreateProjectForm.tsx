import React, { useRef, useState } from "react";
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
  const longDescriptionRef = useRef<HTMLTextAreaElement>(null);
  const [showImageDialog, setShowImageDialog] = useState(false);
  const [imageUrl, setImageUrl] = useState("");
  const [uploadingInlineImage, setUploadingInlineImage] = useState(false);

  const handleInlineImageUpload = async (file: File) => {
    setUploadingInlineImage(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('folder', 'projects/inline');

      const token = localStorage.getItem('admin_token');
      const response = await fetch('/api/upload', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: formData,
      });

      const data = await response.json();
      if (data.success) {
        insertText(`![Image](${data.url})`);
      } else {
        throw new Error(data.error || 'Upload failed');
      }
    } catch (error) {
      console.error('Upload error:', error);
      alert('Failed to upload image. Please try again.');
    } finally {
      setUploadingInlineImage(false);
    }
  };
  
  const insertText = (before: string, after = "", placeholder = "") => {
    const textarea = longDescriptionRef.current;
    if (!textarea) return;
    
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = textarea.value.substring(start, end) || placeholder;
    const newText = before + selectedText + after;
    
    const newContent = 
      textarea.value.substring(0, start) + 
      newText + 
      textarea.value.substring(end);
    
    // Update the form data
    onInputChange("longDescription", newContent);
    
    // Reset focus and selection
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(
        start + before.length,
        start + before.length + selectedText.length
      );
    }, 0);
  };

  const insertImage = () => {
    if (imageUrl.trim()) {
      insertText(`![Image](${imageUrl})`);
      setImageUrl("");
      setShowImageDialog(false);
    }
  };

  const formatButtons = [
    { icon: "B", action: () => insertText("**", "**", "bold text"), title: "Bold", style: "font-bold" },
    { icon: "I", action: () => insertText("*", "*", "italic text"), title: "Italic", style: "italic" },
    { icon: "`", action: () => insertText("`", "`", "code"), title: "Inline Code", style: "font-mono" },
    { icon: "{ }", action: () => insertText("```\n", "\n```", "code block"), title: "Code Block", style: "font-mono" },
    { icon: "H1", action: () => insertText("# ", "", "Heading 1"), title: "Heading 1", style: "font-bold text-lg" },
    { icon: "H2", action: () => insertText("## ", "", "Heading 2"), title: "Heading 2", style: "font-bold" },
    { icon: "•", action: () => insertText("- ", "", "List item"), title: "Bullet List", style: "" },
    { icon: "1.", action: () => insertText("1. ", "", "List item"), title: "Numbered List", style: "" },
    { icon: "🔗", action: () => insertText("[", "](url)", "link text"), title: "Link", style: "" },
    { 
      icon: uploadingInlineImage ? "⏳" : "📷", 
      action: () => setShowImageDialog(true), 
      title: uploadingInlineImage ? "Uploading..." : "Insert Image", 
      style: uploadingInlineImage ? "opacity-50" : "" 
    },
  ];
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
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-foreground">
          {editingProject ? "Edit Project" : "Create New Project"}
        </h2>
        {editingProject && (
          <button
            onClick={onReset}
            className="px-4 py-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            Cancel Edit
          </button>
        )}
      </div>

      <form onSubmit={onSubmit} className="space-y-3">
        {/* Basic Information */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-medium text-foreground mb-1.5">
              Project Title *
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => onInputChange("title", e.target.value)}
              className="w-full px-3 py-2 bg-card/50 border border-border rounded-md focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-all duration-200 text-sm text-foreground placeholder-muted-foreground"
              placeholder="Enter project title"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-foreground mb-1.5">
              Category *
            </label>
            <select
              value={formData.category}
              onChange={(e) => onInputChange("category", e.target.value)}
              className="w-full px-3 py-2 bg-card/50 border border-border rounded-md focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-all duration-200 text-sm text-foreground"
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
          <label className="block text-xs font-medium text-foreground mb-1.5">
            Short Description *
          </label>
          <textarea
            value={formData.description}
            onChange={(e) => onInputChange("description", e.target.value)}
            rows={2}
            className="w-full px-3 py-2 bg-card/50 border border-border rounded-md focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-all duration-200 text-sm text-foreground placeholder-muted-foreground"
            placeholder="Brief description of the project"
            required
          />
        </div>

        {/* Long Description with Rich Text Editor */}
        <div>
          <label className="block text-xs font-medium text-foreground mb-1.5">
            Detailed Description
          </label>
          
          {/* Rich Text Toolbar */}
          <div className="border border-border rounded-t-md bg-card/30 p-2 flex flex-wrap gap-1 justify-between">
            <div className="flex flex-wrap gap-1">
              {formatButtons.slice(0, -1).map((button, index) => (
                <button
                  key={index}
                  type="button"
                  onClick={button.action}
                  title={button.title}
                  className={`px-2 py-1 text-xs border border-border rounded hover:bg-accent hover:text-accent-foreground transition-colors ${button.style}`}
                >
                  {button.icon}
                </button>
              ))}
            </div>
            
            {/* Image button and upload */}
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={formatButtons[formatButtons.length - 1].action}
                title={formatButtons[formatButtons.length - 1].title}
                className={`px-2 py-1 text-xs border border-border rounded hover:bg-accent hover:text-accent-foreground transition-colors ${formatButtons[formatButtons.length - 1].style}`}
                disabled={uploadingInlineImage}
              >
                {formatButtons[formatButtons.length - 1].icon}
              </button>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) handleInlineImageUpload(file);
                }}
                className="hidden"
                id="inline-image-upload"
              />
              <label
                htmlFor="inline-image-upload"
                className="px-2 py-1 text-xs border border-border rounded hover:bg-accent hover:text-accent-foreground transition-colors cursor-pointer"
                title="Upload Image"
              >
                📤
              </label>
            </div>
          </div>
          
          <textarea
            ref={longDescriptionRef}
            value={formData.longDescription}
            onChange={(e) => onInputChange("longDescription", e.target.value)}
            rows={8}
            className="w-full px-3 py-2 bg-card/50 border border-border border-t-0 rounded-b-md focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-all duration-200 text-sm text-foreground placeholder-muted-foreground font-mono resize-none"
            placeholder="Detailed description, features, challenges, etc. You can use Markdown formatting."
          />
        </div>

        {/* Technologies */}
        <div>
          <label className="block text-xs font-medium text-foreground mb-1.5">
            Technologies
          </label>
          <input
            type="text"
            value={formData.technologies}
            onChange={(e) => onInputChange("technologies", e.target.value)}
            className="w-full px-3 py-2 bg-card/50 border border-border rounded-md focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-all duration-200 text-sm text-foreground placeholder-muted-foreground"
            placeholder="React, Next.js, TypeScript, Node.js (comma-separated)"
          />
          <p className="text-xs text-muted-foreground mt-1">
            Separate technologies with commas
          </p>
        </div>

        {/* Status and Featured */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-medium text-foreground mb-1.5">
              Status
            </label>
            <select
              value={formData.status}
              onChange={(e) => onInputChange("status", e.target.value as "active" | "completed" | "archived")}
              className="w-full px-3 py-2 bg-card/50 border border-border rounded-md focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-all duration-200 text-sm text-foreground"
            >
              {statusOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center pt-6">
            <label className="flex items-center space-x-2 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.featured}
                onChange={(e) => onInputChange("featured", e.target.checked)}
                className="w-4 h-4 text-primary border-border rounded focus:ring-1 focus:ring-primary"
              />
              <span className="text-xs font-medium text-foreground">
                Featured Project
              </span>
            </label>
          </div>
        </div>

        {/* URLs */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-medium text-foreground mb-1.5">
              GitHub URL
            </label>
            <input
              type="url"
              value={formData.githubUrl}
              onChange={(e) => onInputChange("githubUrl", e.target.value)}
              className="w-full px-3 py-2 bg-card/50 border border-border rounded-md focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-all duration-200 text-sm text-foreground placeholder-muted-foreground"
              placeholder="https://github.com/username/project"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-foreground mb-1.5">
              Live Demo URL
            </label>
            <input
              type="url"
              value={formData.liveUrl}
              onChange={(e) => onInputChange("liveUrl", e.target.value)}
              className="w-full px-3 py-2 bg-card/50 border border-border rounded-md focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-all duration-200 text-sm text-foreground placeholder-muted-foreground"
              placeholder="https://project-demo.com"
            />
          </div>
        </div>

        {/* Images */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
          <ImageUpload
            currentImage={formData.imageUrl}
            onImageChange={(url) => onInputChange("imageUrl", url)}
            folder="projects"
            label="Main Project Image"
            className="w-full"
          />

          <div>
            <label className="block text-xs font-medium text-foreground mb-1.5">
              Additional Images
            </label>
            <input
              type="text"
              value={formData.images}
              onChange={(e) => onInputChange("images", e.target.value)}
              className="w-full px-3 py-2 bg-card/50 border border-border rounded-md focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-all duration-200 text-sm text-foreground placeholder-muted-foreground"
              placeholder="URL1, URL2, URL3 (comma-separated)"
            />
            <p className="text-xs text-muted-foreground mt-1">
              Separate image URLs with commas
            </p>
          </div>
        </div>

        {/* Dates */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-medium text-foreground mb-1.5">
              Start Date
            </label>
            <input
              type="date"
              value={formData.startDate}
              onChange={(e) => onInputChange("startDate", e.target.value)}
              className="w-full px-3 py-2 bg-card/50 border border-border rounded-md focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-all duration-200 text-sm text-foreground"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-foreground mb-1.5">
              End Date
            </label>
            <input
              type="date"
              value={formData.endDate}
              onChange={(e) => onInputChange("endDate", e.target.value)}
              className="w-full px-3 py-2 bg-card/50 border border-border rounded-md focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-all duration-200 text-sm text-foreground"
            />
          </div>
        </div>

        {/* Additional Information */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
          <div>
            <label className="block text-xs font-medium text-foreground mb-1.5">
              Client
            </label>
            <input
              type="text"
              value={formData.client}
              onChange={(e) => onInputChange("client", e.target.value)}
              className="w-full px-3 py-2 bg-card/50 border border-border rounded-md focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-all duration-200 text-sm text-foreground placeholder-muted-foreground"
              placeholder="Client name or 'Personal'"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-foreground mb-1.5">
              Team Size
            </label>
            <input
              type="number"
              value={formData.teamSize}
              onChange={(e) => onInputChange("teamSize", e.target.value)}
              className="w-full px-3 py-2 bg-card/50 border border-border rounded-md focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-all duration-200 text-sm text-foreground placeholder-muted-foreground"
              placeholder="1"
              min="1"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-foreground mb-1.5">
              Your Role
            </label>
            <input
              type="text"
              value={formData.role}
              onChange={(e) => onInputChange("role", e.target.value)}
              className="w-full px-3 py-2 bg-card/50 border border-border rounded-md focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-all duration-200 text-sm text-foreground placeholder-muted-foreground"
              placeholder="Full-Stack Developer"
            />
          </div>
        </div>

        {/* Form Actions */}
        <div className="flex justify-end space-x-2 pt-3 border-t border-border">
          <button
            type="button"
            onClick={onReset}
            disabled={loading}
            className="px-4 py-2 text-sm border border-border rounded-md hover:bg-accent hover:text-accent-foreground transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {editingProject ? "Cancel Edit" : "Reset Form"}
          </button>
          
          <button
            type="submit"
            disabled={loading}
            className="px-4 py-2 text-sm bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
          >
            {loading ? (
              <>
                <div className="w-3 h-3 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                <span>{editingProject ? "Updating..." : "Creating..."}</span>
              </>
            ) : (
              <span>{editingProject ? "Update Project" : "Create Project"}</span>
            )}
          </button>
        </div>

        {/* Image URL Dialog */}
        {showImageDialog && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-card p-6 rounded-lg border border-border max-w-md w-full mx-4">
              <h3 className="text-lg font-medium text-foreground mb-4">Insert Image</h3>
              <input
                type="url"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                placeholder="Enter image URL"
                className="w-full px-3 py-2 bg-card/50 border border-border rounded-md focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary text-sm text-foreground placeholder-muted-foreground mb-4"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    insertImage();
                  }
                  if (e.key === 'Escape') {
                    setShowImageDialog(false);
                    setImageUrl("");
                  }
                }}
                autoFocus
              />
              <div className="flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => {
                    setShowImageDialog(false);
                    setImageUrl("");
                  }}
                  className="px-3 py-1.5 text-sm border border-border rounded hover:bg-accent hover:text-accent-foreground transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={insertImage}
                  className="px-3 py-1.5 text-sm bg-primary text-primary-foreground rounded hover:bg-primary/90 transition-colors"
                >
                  Insert
                </button>
              </div>
            </div>
          </div>
        )}
      </form>
    </div>
  );
};
