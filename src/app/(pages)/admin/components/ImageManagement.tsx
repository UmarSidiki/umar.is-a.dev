"use client";

import React, { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import ImageUpload from "@/components/ImageUpload";

interface ImageItem {
  key: string;
  url: string;
  size: number;
  lastModified: Date;
  folder: string;
  filename: string;
}

export const ImageManagement = ({}) => {
  const [images, setImages] = useState<ImageItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedFolder, setSelectedFolder] = useState<string>("all");
  const [copiedUrl, setCopiedUrl] = useState<string | null>(null);
  const [showUpload, setShowUpload] = useState(false);

  const fetchImages = useCallback(async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("admin_token");
      const folderParam = selectedFolder === "all" ? "" : selectedFolder;

      const response = await fetch(`/api/images?folder=${folderParam}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();
      if (data.success) {
        setImages(data.images);
      }
    } catch (error) {
      console.error("Error fetching images:", error);
    } finally {
      setLoading(false);
    }
  }, [selectedFolder]);

  useEffect(() => {
    fetchImages();
  }, [fetchImages]);

  const deleteImage = async (key: string) => {
    if (!confirm("Are you sure you want to delete this image?")) return;

    try {
      const token = localStorage.getItem("admin_token");
      const response = await fetch(
        `/api/images?key=${encodeURIComponent(key)}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();
      if (data.success) {
        setImages((prev) => prev.filter((img) => img.key !== key));
        alert("Image deleted successfully");
      } else {
        throw new Error(data.error);
      }
    } catch (error) {
      console.error("Error deleting image:", error);
      alert("Failed to delete image");
    }
  };

  const copyToClipboard = async (url: string) => {
    try {
      await navigator.clipboard.writeText(url);
      setCopiedUrl(url);
      setTimeout(() => setCopiedUrl(null), 2000);
    } catch (error) {
      console.error("Failed to copy:", error);
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const folders = [
    "all",
    ...Array.from(new Set(images.map((img) => img.folder))),
  ];

  const filteredImages =
    selectedFolder === "all"
      ? images
      : images.filter((img) => img.folder === selectedFolder);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold bg-gradient-to-r from-amber-600 to-red-600 bg-clip-text text-transparent">
            Image Management
          </h2>
          <p className="text-neutral-600 dark:text-neutral-400 mt-1">
            Manage your uploaded images ({filteredImages.length} images)
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* Upload Button */}
          <button
            onClick={() => setShowUpload(!showUpload)}
            className={`px-4 py-2 rounded-lg transition-colors text-sm font-medium ${
              showUpload
                ? 'bg-purple-500 hover:bg-purple-600 text-white'
                : 'bg-blue-500 hover:bg-blue-600 text-white'
            }`}
          >
            {showUpload ? 'Cancel Upload' : 'Upload Images'}
          </button>

          {/* Refresh Button */}
          <button
            onClick={fetchImages}
            className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors text-sm font-medium"
          >
            Refresh
          </button>
        </div>
      </div>

      {/* Upload Section */}
      {showUpload && (
        <div className="bg-white dark:bg-neutral-800 rounded-lg border border-neutral-200 dark:border-neutral-700 p-6">
          <h3 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100 mb-4">
            Upload New Images
          </h3>
          <ImageUpload
            currentImage=""
            onImageChange={(url) => {
              if (url) {
                // Refresh images after upload
                fetchImages();
                // Show success message
                alert('Image uploaded successfully!');
              }
            }}
            folder={selectedFolder === 'all' ? 'uploads' : selectedFolder}
            label="Select Images to Upload"
            className="w-full"
          />
        </div>
      )}

      {/* Folder Filter */}
      <div className="flex flex-wrap gap-2">
        {folders.map((folder) => (
          <button
            key={folder}
            onClick={() => setSelectedFolder(folder)}
            className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
              selectedFolder === folder
                ? "bg-amber-100 dark:bg-amber-900/20 text-amber-700 dark:text-amber-300"
                : "bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 hover:bg-neutral-200 dark:hover:bg-neutral-700"
            }`}
          >
            {folder === "all" ? "All Folders" : folder}
          </button>
        ))}
      </div>

      {/* Loading State */}
      {loading && (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-2 border-amber-500 border-t-transparent"></div>
        </div>
      )}

      {/* Empty State */}
      {!loading && filteredImages.length === 0 && (
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-neutral-100 dark:bg-neutral-800 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg
              className="w-8 h-8 text-neutral-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-neutral-900 dark:text-neutral-100 mb-2">
            No images found
          </h3>
          <p className="text-neutral-600 dark:text-neutral-400">
            Upload some images to get started.
          </p>
        </div>
      )}

      {/* Images Grid */}
      {!loading && filteredImages.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
          {filteredImages.map((image) => (
            <div
              key={image.key}
              className="bg-white dark:bg-neutral-800 rounded-lg border border-neutral-200 dark:border-neutral-700 overflow-hidden hover:shadow-md transition-shadow"
            >
              {/* Grid View */}
              <div className="aspect-square relative bg-neutral-100 dark:bg-neutral-700">
                <Image
                  src={image.url}
                  alt={image.filename}
                  fill
                  className="object-cover"
                  sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, (max-width: 1024px) 25vw, (max-width: 1280px) 20vw, 16vw"
                  unoptimized={true}
                  onError={(e) => {
                    console.error('Image load error:', e);
                    e.currentTarget.style.display = 'none';
                  }}
                />
              </div>
              <div className="p-3">
                <p className="text-xs font-medium text-neutral-900 dark:text-neutral-100 truncate mb-1">
                  {image.filename}
                </p>
                <p className="text-xs text-neutral-500 dark:text-neutral-400 mb-2">
                  {formatFileSize(image.size)}
                </p>
                <div className="flex gap-1">
                  <button
                    onClick={() => copyToClipboard(image.url)}
                    className="flex-1 px-2 py-1 bg-amber-100 dark:bg-amber-900/20 text-amber-700 dark:text-amber-300 rounded text-xs font-medium hover:bg-amber-200 dark:hover:bg-amber-900/30 transition-colors"
                    title="Copy URL"
                  >
                    {copiedUrl === image.url ? "✓" : "Copy"}
                  </button>
                  <button
                    onClick={() => deleteImage(image.key)}
                    className="px-2 py-1 bg-red-100 dark:bg-red-900/20 text-red-700 dark:text-red-400 rounded text-xs font-medium hover:bg-red-200 dark:hover:bg-red-900/30 transition-colors"
                    title="Delete"
                  >
                    🗑️
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
