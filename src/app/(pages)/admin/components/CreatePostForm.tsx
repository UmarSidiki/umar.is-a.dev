import React, { useRef, useState } from "react";
import { BlogPostFormData, BlogPost } from "@/types/blog";
import { categories } from "../utils/helpers";
import ImageUpload from "@/components/ImageUpload";

interface CreatePostFormProps {
  formData: BlogPostFormData;
  editingPost: BlogPost | null;
  loading: boolean;
  onInputChange: (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => void;
  onSubmit: (e: React.FormEvent) => void;
  onReset: () => void;
}

export const CreatePostForm: React.FC<CreatePostFormProps> = ({
  formData,
  editingPost,
  loading,
  onInputChange,
  onSubmit,
  onReset,
}) => {
  const contentRef = useRef<HTMLTextAreaElement>(null);
  const [showImageDialog, setShowImageDialog] = useState(false);
  const [imageUrl, setImageUrl] = useState("");
  const [showPreview, setShowPreview] = useState(false);
  const [uploadingInlineImage, setUploadingInlineImage] = useState(false);
  
  const handleInlineImageUpload = async (file: File) => {
    setUploadingInlineImage(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('folder', 'posts/inline');

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
    const textarea = contentRef.current;
    if (!textarea) return;
    
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = textarea.value.substring(start, end) || placeholder;
    const newText = before + selectedText + after;
    
    const newContent = 
      textarea.value.substring(0, start) + 
      newText + 
      textarea.value.substring(end);
    
    // Create synthetic event to trigger onChange
    const event = {
      target: { name: 'content', value: newContent }
    } as React.ChangeEvent<HTMLTextAreaElement>;
    
    onInputChange(event);
    
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
  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-foreground">
          {editingPost ? "Edit Post" : "Create New Post"}
        </h2>
        {editingPost && (
          <button
            onClick={onReset}
            className="px-4 py-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            Cancel Edit
          </button>
        )}
      </div>

      <form onSubmit={onSubmit} className="space-y-3">
        {/* Title */}
        <div>
          <label className="block text-xs font-medium text-foreground mb-1.5">
            Title *
          </label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={onInputChange}
            className="w-full px-3 py-2 bg-card/50 border border-border rounded-md focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-all duration-200 text-sm text-foreground placeholder-muted-foreground"
            placeholder="Enter post title"
            required
          />
        </div>

        {/* Content with Rich Text Editor */}
        <div>
          <label className="block text-xs font-medium text-foreground mb-1.5">
            Content *
          </label>
          
          {/* Formatting Toolbar */}
          <div className="border border-border rounded-t-md bg-card/30 p-2 flex flex-wrap gap-1 justify-between">
            <div className="flex flex-wrap gap-1">
              {formatButtons.map((btn, index) => (
                <button
                  key={index}
                  type="button"
                  onClick={btn.action}
                  className={`px-2 py-1 text-xs rounded border border-border/50 hover:bg-primary/10 hover:border-primary/50 transition-colors ${btn.style}`}
                  title={btn.title}
                >
                  {btn.icon}
                </button>
              ))}
            </div>
            <button
              type="button"
              onClick={() => setShowPreview(!showPreview)}
              className={`px-2 py-1 text-xs rounded border border-border/50 transition-colors ${
                showPreview 
                  ? 'bg-primary/20 border-primary/50 text-primary' 
                  : 'hover:bg-primary/10 hover:border-primary/50'
              }`}
              title="Toggle Preview"
            >
              👁️ Preview
            </button>
          </div>
          
          {showPreview ? (
            <div className="border border-border border-t-0 rounded-b-md bg-card/50 p-3 min-h-[200px] text-sm text-foreground prose prose-sm max-w-none">
              <div className="text-xs text-muted-foreground mb-2 border-b border-border/30 pb-1">Preview:</div>
              {formData.content ? (
                <div className="whitespace-pre-wrap">{formData.content}</div>
              ) : (
                <div className="text-muted-foreground italic">Start typing to see preview...</div>
              )}
            </div>
          ) : (
            <textarea
              ref={contentRef}
              name="content"
              value={formData.content}
              onChange={onInputChange}
              rows={8}
              className="w-full px-3 py-2 bg-card/50 border border-border border-t-0 rounded-b-md focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-all duration-200 resize-vertical text-sm text-foreground placeholder-muted-foreground font-mono"
              placeholder="Write your post content here using Markdown..."
              required
            />
          )}
          
          {/* Image Dialog */}
          {showImageDialog && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
              <div className="bg-card border border-border rounded-lg p-4 w-96 max-w-[90vw]">
                <h3 className="text-sm font-medium text-foreground mb-3">Insert Image</h3>
                
                {/* Upload Option */}
                <div className="mb-4">
                  <label className="block text-xs text-muted-foreground mb-2">Upload Image</label>
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
                    className="w-full text-xs"
                  />
                </div>
                
                <div className="text-xs text-muted-foreground text-center mb-3">or</div>
                
                {/* URL Option */}
                <div className="mb-4">
                  <label className="block text-xs text-muted-foreground mb-2">Image URL</label>
                  <input
                    type="url"
                    value={imageUrl}
                    onChange={(e) => setImageUrl(e.target.value)}
                    className="w-full px-3 py-2 bg-card/50 border border-border rounded-md focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-all duration-200 text-sm text-foreground placeholder-muted-foreground"
                    placeholder="https://example.com/image.jpg"
                    autoFocus
                  />
                </div>
                
                <div className="flex gap-2 justify-end">
                  <button
                    type="button"
                    onClick={() => setShowImageDialog(false)}
                    className="px-3 py-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={insertImage}
                    className="px-3 py-1.5 bg-primary text-primary-foreground text-xs rounded transition-colors hover:bg-primary/90"
                    disabled={!imageUrl.trim()}
                  >
                    Insert
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Excerpt */}
        <div>
          <label className="block text-xs font-medium text-foreground mb-1.5">
            Excerpt *
          </label>
          <textarea
            name="excerpt"
            value={formData.excerpt}
            onChange={onInputChange}
            rows={2}
            className="w-full px-3 py-2 bg-card/50 border border-border rounded-md focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-all duration-200 text-sm text-foreground placeholder-muted-foreground"
            placeholder="Brief description of the post"
            required
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {/* Author */}
          <div>
            <label className="block text-xs font-medium text-foreground mb-1.5">
              Author *
            </label>
            <input
              type="text"
              name="author"
              value={formData.author}
              onChange={onInputChange}
              className="w-full px-3 py-2 bg-card/50 border border-border rounded-md focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-all duration-200 text-sm text-foreground placeholder-muted-foreground"
              required
            />
          </div>

          {/* Category */}
          <div>
            <label className="block text-xs font-medium text-foreground mb-1.5">
              Category *
            </label>
            <select
              name="category"
              value={formData.category}
              onChange={onInputChange}
              className="w-full px-3 py-2 bg-card/50 border border-border rounded-md focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-all duration-200 text-sm text-foreground"
              required
            >
              <option value="">Select Category</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {/* Tags */}
          <div>
            <label className="block text-xs font-medium text-foreground mb-1.5">
              Tags
            </label>
            <input
              type="text"
              name="tags"
              value={formData.tags}
              onChange={onInputChange}
              className="w-full px-3 py-2 bg-card/50 border border-border rounded-md focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-all duration-200 text-sm text-foreground placeholder-muted-foreground"
              placeholder="Comma-separated tags"
            />
          </div>

          {/* Status */}
          <div>
            <label className="block text-xs font-medium text-foreground mb-1.5">
              Status
            </label>
            <select
              name="status"
              value={formData.status}
              onChange={onInputChange}
              className="w-full px-3 py-2 bg-card/50 border border-border rounded-md focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-all duration-200 text-sm text-foreground"
            >
              <option value="draft">Draft</option>
              <option value="published">Published</option>
            </select>
          </div>
        </div>

        {/* Featured Image */}
        <ImageUpload
          currentImage={formData.featuredImage}
          onImageChange={(url) => {
            const event = {
              target: { name: 'featuredImage', value: url }
            } as React.ChangeEvent<HTMLInputElement>;
            onInputChange(event);
          }}
          folder="posts"
          label="Featured Image"
          className="w-full"
        />

        {/* Comments Enabled */}
        <div>
          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              name="commentsEnabled"
              checked={formData.commentsEnabled}
              onChange={onInputChange}
              className="w-4 h-4 text-primary bg-card/50 border-border rounded focus:ring-primary focus:ring-1"
            />
            <span className="text-xs font-medium text-foreground">
              Enable comments for this post
            </span>
          </label>
        </div>

        {/* Submit Button */}
        <div className="flex justify-end space-x-2 pt-3 border-t border-border">
          <button
            type="button"
            onClick={onReset}
            className="px-4 py-2 text-xs text-muted-foreground hover:text-foreground transition-colors"
            disabled={loading}
          >
            Reset
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-4 py-2 bg-primary hover:bg-primary/90 text-primary-foreground font-medium rounded-md transition-all duration-200 shadow-sm hover:shadow-md transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none text-xs"
          >
            {loading ? (
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin"></div>
                <span>Saving...</span>
              </div>
            ) : (
              editingPost ? "Update Post" : "Create Post"
            )}
          </button>
        </div>
      </form>
    </div>
  );
};
