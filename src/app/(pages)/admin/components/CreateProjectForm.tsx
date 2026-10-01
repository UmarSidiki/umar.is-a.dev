import React, { useRef, useState } from "react";
import { Bold, Code, Italic, Link2, List, ListOrdered } from "lucide-react";
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

const field =
  "w-full border border-hairline bg-transparent px-3 py-2.5 text-sm text-foreground placeholder:text-ink-soft focus:border-signal focus:outline-none";

const PROJECT_CATEGORIES = [
  "Web Application",
  "Mobile App",
  "Desktop App",
  "Library/Package",
  "API/Backend",
  "Portfolio",
  "E-commerce",
  "Educational",
  "Tool/Utility",
  "Other",
];

const STATUS_OPTIONS = [
  { value: "active", label: "Active" },
  { value: "completed", label: "Completed" },
  { value: "archived", label: "Archived" },
];

export function CreateProjectForm({
  formData,
  editingProject,
  loading,
  onInputChange,
  onSubmit,
  onReset,
}: CreateProjectFormProps) {
  const longDescriptionRef = useRef<HTMLTextAreaElement>(null);
  const [showImageDialog, setShowImageDialog] = useState(false);
  const [imageUrl, setImageUrl] = useState("");
  const [uploadingInlineImage, setUploadingInlineImage] = useState(false);

  const handleInlineImageUpload = async (file: File) => {
    setUploadingInlineImage(true);
    try {
      const body = new FormData();
      body.append("file", file);
      body.append("folder", "projects/inline");
      const response = await fetch("/api/upload", {
        method: "POST",
        body,
      });
      const data = await response.json();
      if (data.success) insertText(`![Image](${data.url})`);
      else throw new Error(data.error || "Upload failed");
    } catch (error) {
      console.error("Upload error:", error);
      alert("Failed to upload image. Please try again.");
    } finally {
      setUploadingInlineImage(false);
    }
  };

  const insertText = (before: string, after = "", placeholder = "") => {
    const textarea = longDescriptionRef.current;
    if (!textarea) return;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selected = textarea.value.substring(start, end) || placeholder;
    const newContent =
      textarea.value.substring(0, start) + before + selected + after + textarea.value.substring(end);
    onInputChange("longDescription", newContent);
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + before.length, start + before.length + selected.length);
    }, 0);
  };

  const insertImage = () => {
    if (imageUrl.trim()) {
      insertText(`![Image](${imageUrl})`);
      setImageUrl("");
      setShowImageDialog(false);
    }
  };

  const formatButtons: { icon: React.ReactNode; action: () => void; title: string }[] = [
    { icon: <Bold className="h-3.5 w-3.5" aria-hidden="true" />, action: () => insertText("**", "**", "bold text"), title: "Bold" },
    { icon: <Italic className="h-3.5 w-3.5" aria-hidden="true" />, action: () => insertText("*", "*", "italic text"), title: "Italic" },
    { icon: <Code className="h-3.5 w-3.5" aria-hidden="true" />, action: () => insertText("`", "`", "code"), title: "Inline code" },
    { icon: <span className="font-mono text-xs">{"{ }"}</span>, action: () => insertText("```\n", "\n```", "code block"), title: "Code block" },
    { icon: <span className="text-xs font-bold">H1</span>, action: () => insertText("# ", "", "Heading 1"), title: "Heading 1" },
    { icon: <span className="text-xs font-bold">H2</span>, action: () => insertText("## ", "", "Heading 2"), title: "Heading 2" },
    { icon: <List className="h-3.5 w-3.5" aria-hidden="true" />, action: () => insertText("- ", "", "List item"), title: "Bullet list" },
    { icon: <ListOrdered className="h-3.5 w-3.5" aria-hidden="true" />, action: () => insertText("1. ", "", "List item"), title: "Numbered list" },
    { icon: <Link2 className="h-3.5 w-3.5" aria-hidden="true" />, action: () => insertText("[", "](url)", "link text"), title: "Link" },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <h3 className="font-display text-xl font-bold">
          {editingProject ? "Edit project" : "Create project"}
        </h3>
        {editingProject && (
          <button type="button" onClick={onReset} className="label-mono text-ink-soft hover:text-foreground">
            Cancel edit
          </button>
        )}
      </div>

      <form onSubmit={onSubmit} className="space-y-4">
        <div className="grid gap-4 lg:grid-cols-2">
          <div>
            <label htmlFor="proj-title" className="label-mono mb-2 block text-ink-soft">
              Title *
            </label>
            <input id="proj-title" type="text" value={formData.title} onChange={(e) => onInputChange("title", e.target.value)} className={field} required />
          </div>
          <div>
            <label htmlFor="proj-category" className="label-mono mb-2 block text-ink-soft">
              Category *
            </label>
            <select id="proj-category" value={formData.category} onChange={(e) => onInputChange("category", e.target.value)} className={field} required>
              <option value="">Select category</option>
              {PROJECT_CATEGORIES.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label htmlFor="proj-description" className="label-mono mb-2 block text-ink-soft">
            Short description *
          </label>
          <textarea id="proj-description" value={formData.description} onChange={(e) => onInputChange("description", e.target.value)} rows={2} className={`${field} resize-none`} required />
        </div>

        <div>
          <label htmlFor="proj-long" className="label-mono mb-2 block text-ink-soft">
            Detailed description
          </label>
          <div className="flex flex-wrap items-center gap-1 border border-hairline border-b-0 p-2">
            {formatButtons.map((btn, i) => (
              <button
                key={i}
                type="button"
                onClick={btn.action}
                title={btn.title}
                aria-label={btn.title}
                className="inline-flex h-8 w-8 items-center justify-center border border-transparent text-ink-soft transition-colors hover:border-hairline hover:text-foreground"
              >
                {btn.icon}
              </button>
            ))}
            <button
              type="button"
              onClick={() => setShowImageDialog(true)}
              disabled={uploadingInlineImage}
              className="label-mono ml-auto inline-flex h-8 items-center border border-hairline px-3 text-ink-soft hover:text-foreground"
            >
              {uploadingInlineImage ? "Uploading…" : "Image"}
            </button>
          </div>
          <textarea id="proj-long" ref={longDescriptionRef} value={formData.longDescription} onChange={(e) => onInputChange("longDescription", e.target.value)} rows={10} className={`${field} resize-y font-mono`} placeholder="Markdown supported" />
        </div>

        <div>
          <label htmlFor="proj-tech" className="label-mono mb-2 block text-ink-soft">
            Technologies
          </label>
          <input id="proj-tech" type="text" value={formData.technologies} onChange={(e) => onInputChange("technologies", e.target.value)} placeholder="React, Next.js, TypeScript" className={field} />
          <p className="mt-2 text-xs text-ink-soft">Separate technologies with commas.</p>
        </div>

        <div className="grid gap-4 lg:grid-cols-2">
          <div>
            <label htmlFor="proj-status" className="label-mono mb-2 block text-ink-soft">
              Status
            </label>
            <select id="proj-status" value={formData.status} onChange={(e) => onInputChange("status", e.target.value as ProjectFormData["status"])} className={field}>
              {STATUS_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
          <label className="flex items-center gap-3 self-end pb-3 text-sm">
            <input type="checkbox" checked={formData.featured} onChange={(e) => onInputChange("featured", e.target.checked)} className="h-4 w-4 accent-[var(--signal)]" />
            Featured project
          </label>
        </div>

        <div className="grid gap-4 lg:grid-cols-2">
          <div>
            <label htmlFor="proj-github" className="label-mono mb-2 block text-ink-soft">
              GitHub URL
            </label>
            <input id="proj-github" type="url" value={formData.githubUrl} onChange={(e) => onInputChange("githubUrl", e.target.value)} placeholder="https://github.com/…" className={field} />
          </div>
          <div>
            <label htmlFor="proj-live" className="label-mono mb-2 block text-ink-soft">
              Live demo URL
            </label>
            <input id="proj-live" type="url" value={formData.liveUrl} onChange={(e) => onInputChange("liveUrl", e.target.value)} placeholder="https://…" className={field} />
          </div>
        </div>

        <div className="grid gap-4 lg:grid-cols-2">
          <ImageUpload currentImage={formData.imageUrl} onImageChange={(url) => onInputChange("imageUrl", url)} folder="projects" label="Main project image" className="w-full" />
          <div>
            <label htmlFor="proj-images" className="label-mono mb-2 block text-ink-soft">
              Additional images
            </label>
            <input id="proj-images" type="text" value={formData.images} onChange={(e) => onInputChange("images", e.target.value)} placeholder="url1, url2, url3" className={field} />
            <p className="mt-2 text-xs text-ink-soft">Separate image URLs with commas.</p>
          </div>
        </div>

        <div className="grid gap-4 lg:grid-cols-2">
          <div>
            <label htmlFor="proj-start" className="label-mono mb-2 block text-ink-soft">
              Start date
            </label>
            <input id="proj-start" type="date" value={formData.startDate} onChange={(e) => onInputChange("startDate", e.target.value)} className={field} />
          </div>
          <div>
            <label htmlFor="proj-end" className="label-mono mb-2 block text-ink-soft">
              End date
            </label>
            <input id="proj-end" type="date" value={formData.endDate} onChange={(e) => onInputChange("endDate", e.target.value)} className={field} />
          </div>
        </div>

        <div className="grid gap-4 lg:grid-cols-3">
          <div>
            <label htmlFor="proj-client" className="label-mono mb-2 block text-ink-soft">
              Client
            </label>
            <input id="proj-client" type="text" value={formData.client} onChange={(e) => onInputChange("client", e.target.value)} placeholder="Client or Personal" className={field} />
          </div>
          <div>
            <label htmlFor="proj-team" className="label-mono mb-2 block text-ink-soft">
              Team size
            </label>
            <input id="proj-team" type="number" min="1" value={formData.teamSize} onChange={(e) => onInputChange("teamSize", e.target.value)} className={field} />
          </div>
          <div>
            <label htmlFor="proj-role" className="label-mono mb-2 block text-ink-soft">
              Role
            </label>
            <input id="proj-role" type="text" value={formData.role} onChange={(e) => onInputChange("role", e.target.value)} placeholder="Full-Stack Developer" className={field} />
          </div>
        </div>

        <div className="flex justify-end gap-3 border-t border-hairline pt-5">
          <button type="button" onClick={onReset} disabled={loading} className="label-mono h-11 px-4 text-ink-soft hover:text-foreground disabled:opacity-50">
            Reset
          </button>
          <button
            type="submit"
            disabled={loading}
            className="label-mono h-11 rounded-full bg-signal px-6 text-signal-ink transition-colors hover:bg-foreground hover:text-background disabled:opacity-50"
          >
            {loading ? "Saving…" : editingProject ? "Update project" : "Create project"}
          </button>
        </div>
      </form>

      {showImageDialog && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center bg-foreground/70 p-5" role="dialog" aria-modal="true" aria-label="Insert image">
          <div className="w-full max-w-md border border-hairline bg-background p-5">
            <h3 className="font-display text-lg font-bold">Insert image</h3>
            <div className="mt-5 space-y-4">
              <div>
                <label className="label-mono mb-2 block text-ink-soft">Upload</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      handleInlineImageUpload(file);
                      setShowImageDialog(false);
                    }
                  }}
                  className="w-full text-sm"
                />
              </div>
              <div>
                <label htmlFor="proj-inline-image-url" className="label-mono mb-2 block text-ink-soft">
                  Or image URL
                </label>
                <input
                  id="proj-inline-image-url"
                  type="url"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      insertImage();
                    }
                    if (e.key === "Escape") {
                      setShowImageDialog(false);
                      setImageUrl("");
                    }
                  }}
                  className={field}
                  placeholder="https://example.com/image.jpg"
                  autoFocus
                />
              </div>
            </div>
            <div className="mt-6 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => {
                  setShowImageDialog(false);
                  setImageUrl("");
                }}
                className="label-mono h-11 px-4 text-ink-soft hover:text-foreground"
              >
                Cancel
              </button>
              <button type="button" onClick={insertImage} className="label-mono h-11 rounded-full bg-signal px-5 text-signal-ink">
                Insert
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
