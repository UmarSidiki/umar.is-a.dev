import React, { useRef, useState } from "react";
import { Bold, Code, Eye, Image as ImageIcon, Italic, Link2, List, ListOrdered } from "lucide-react";
import { BlogPostFormData, BlogPost } from "@/types/blog";
import { categories } from "../utils/helpers";
import ImageUpload from "@/components/ImageUpload";
import MarkdownRenderer from "@/components/MarkdownRenderer";

interface CreatePostFormProps {
  formData: BlogPostFormData;
  editingPost: BlogPost | null;
  loading: boolean;
  onInputChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => void;
  onSubmit: (e: React.FormEvent) => void;
  onReset: () => void;
}

const field =
  "w-full border border-hairline bg-transparent px-3 py-2.5 text-sm text-foreground placeholder:text-ink-soft focus:border-signal focus:outline-none";

export function CreatePostForm({
  formData,
  editingPost,
  loading,
  onInputChange,
  onSubmit,
  onReset,
}: CreatePostFormProps) {
  const contentRef = useRef<HTMLTextAreaElement>(null);
  const [showImageDialog, setShowImageDialog] = useState(false);
  const [imageUrl, setImageUrl] = useState("");
  const [showPreview, setShowPreview] = useState(false);
  const [uploadingInlineImage, setUploadingInlineImage] = useState(false);

  const handleInlineImageUpload = async (file: File) => {
    setUploadingInlineImage(true);
    try {
      const body = new FormData();
      body.append("file", file);
      body.append("folder", "posts/inline");
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
    const textarea = contentRef.current;
    if (!textarea) return;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selected = textarea.value.substring(start, end) || placeholder;
    const newContent =
      textarea.value.substring(0, start) + before + selected + after + textarea.value.substring(end);
    onInputChange({
      target: { name: "content", value: newContent },
    } as React.ChangeEvent<HTMLTextAreaElement>);
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
    { icon: <ImageIcon className="h-3.5 w-3.5" aria-hidden="true" />, action: () => setShowImageDialog(true), title: uploadingInlineImage ? "Uploading…" : "Insert image" },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <h3 className="font-display text-xl font-bold">
          {editingPost ? "Edit post" : "Create post"}
        </h3>
        {editingPost && (
          <button type="button" onClick={onReset} className="label-mono text-ink-soft hover:text-foreground">
            Cancel edit
          </button>
        )}
      </div>

      <form onSubmit={onSubmit} className="space-y-4">
        <div className="grid gap-4 lg:grid-cols-2">
          <div>
            <label htmlFor="post-title" className="label-mono mb-2 block text-ink-soft">
              Title *
            </label>
            <input id="post-title" type="text" name="title" value={formData.title} onChange={onInputChange} className={field} required />
          </div>
          <div>
            <label htmlFor="post-slug" className="label-mono mb-2 block text-ink-soft">
              Custom URL (optional)
            </label>
            <input
              id="post-slug"
              type="text"
              name="slug"
              value={formData.slug || ""}
              onChange={onInputChange}
              placeholder="leave blank to auto-generate"
              pattern="^[a-z0-9-]+$"
              title="Only lowercase letters, numbers and hyphens"
              className={field}
            />
          </div>
        </div>

        <div>
          <label htmlFor="post-content" className="label-mono mb-2 block text-ink-soft">
            Content *
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
              onClick={() => setShowPreview((v) => !v)}
              aria-pressed={showPreview}
              className={`label-mono ml-auto inline-flex h-8 items-center gap-1.5 border px-3 transition-colors ${
                showPreview ? "border-signal text-signal" : "border-hairline text-ink-soft hover:text-foreground"
              }`}
            >
              <Eye className="h-3.5 w-3.5" aria-hidden="true" />
              Preview
            </button>
          </div>

          {showPreview ? (
            <div className="min-h-[240px] border border-hairline p-4">
              {formData.content ? (
                <MarkdownRenderer content={formData.content} className="text-sm" />
              ) : (
                <p className="text-sm italic text-ink-soft">Start typing to see the preview.</p>
              )}
            </div>
          ) : (
            <textarea
              id="post-content"
              ref={contentRef}
              name="content"
              value={formData.content}
              onChange={onInputChange}
              rows={12}
              className={`${field} resize-y font-mono`}
              placeholder="Write in Markdown…"
              required
            />
          )}

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
                    <label htmlFor="inline-image-url" className="label-mono mb-2 block text-ink-soft">
                      Or image URL
                    </label>
                    <input
                      id="inline-image-url"
                      type="url"
                      value={imageUrl}
                      onChange={(e) => setImageUrl(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          insertImage();
                        }
                        if (e.key === "Escape") setShowImageDialog(false);
                      }}
                      className={field}
                      placeholder="https://example.com/image.jpg"
                      autoFocus
                    />
                  </div>
                </div>
                <div className="mt-6 flex justify-end gap-3">
                  <button type="button" onClick={() => setShowImageDialog(false)} className="label-mono h-11 px-4 text-ink-soft hover:text-foreground">
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={insertImage}
                    disabled={!imageUrl.trim()}
                    className="label-mono h-11 rounded-full bg-signal px-5 text-signal-ink disabled:opacity-50"
                  >
                    Insert
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        <div>
          <label htmlFor="post-excerpt" className="label-mono mb-2 block text-ink-soft">
            Excerpt *
          </label>
          <textarea id="post-excerpt" name="excerpt" value={formData.excerpt} onChange={onInputChange} rows={3} className={`${field} resize-none`} required />
        </div>

        <div className="grid gap-4 lg:grid-cols-2">
          <div>
            <label htmlFor="post-author" className="label-mono mb-2 block text-ink-soft">
              Author *
            </label>
            <input id="post-author" type="text" name="author" value={formData.author} onChange={onInputChange} className={field} required />
          </div>
          <div>
            <label htmlFor="post-category" className="label-mono mb-2 block text-ink-soft">
              Category *
            </label>
            <select id="post-category" name="category" value={formData.category} onChange={onInputChange} className={field} required>
              <option value="">Select category</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid gap-4 lg:grid-cols-2">
          <div>
            <label htmlFor="post-tags" className="label-mono mb-2 block text-ink-soft">
              Tags
            </label>
            <input id="post-tags" type="text" name="tags" value={formData.tags} onChange={onInputChange} placeholder="comma, separated" className={field} />
          </div>
          <div>
            <label htmlFor="post-status" className="label-mono mb-2 block text-ink-soft">
              Status
            </label>
            <select id="post-status" name="status" value={formData.status} onChange={onInputChange} className={field}>
              <option value="draft">Draft</option>
              <option value="published">Published</option>
            </select>
          </div>
        </div>

        <ImageUpload
          currentImage={formData.featuredImage}
          onImageChange={(url) =>
            onInputChange({
              target: { name: "featuredImage", value: url },
            } as React.ChangeEvent<HTMLInputElement>)
          }
          folder="posts"
          label="Featured image"
          className="w-full"
        />

        <label className="flex items-center gap-3 text-sm">
          <input
            type="checkbox"
            name="commentsEnabled"
            checked={formData.commentsEnabled}
            onChange={onInputChange}
            className="h-4 w-4 accent-[var(--signal)]"
          />
          Enable comments for this post
        </label>

        <div className="flex justify-end gap-3 border-t border-hairline pt-5">
          <button type="button" onClick={onReset} disabled={loading} className="label-mono h-11 px-4 text-ink-soft hover:text-foreground disabled:opacity-50">
            Reset
          </button>
          <button
            type="submit"
            disabled={loading}
            className="label-mono h-11 rounded-full bg-signal px-6 text-signal-ink transition-colors hover:bg-foreground hover:text-background disabled:opacity-50"
          >
            {loading ? "Saving…" : editingPost ? "Update post" : "Create post"}
          </button>
        </div>
      </form>
    </div>
  );
}
