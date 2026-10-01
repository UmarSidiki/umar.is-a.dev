"use client";

import React, { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import { Check, Copy, Trash2, Upload } from "lucide-react";
import ImageUpload from "@/components/ImageUpload";

interface ImageItem {
  key: string;
  url: string;
  size: number;
  lastModified: Date;
  folder: string;
  filename: string;
}

export function ImageManagement() {
  const [images, setImages] = useState<ImageItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedFolder, setSelectedFolder] = useState<string>("all");
  const [copiedUrl, setCopiedUrl] = useState<string | null>(null);
  const [showUpload, setShowUpload] = useState(false);

  const fetchImages = useCallback(async () => {
    try {
      setLoading(true);
      const folderParam = selectedFolder === "all" ? "" : selectedFolder;
      const response = await fetch(`/api/images?folder=${folderParam}`);
      const data = await response.json();
      if (data.success) setImages(data.images);
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
    if (!confirm("Delete this image?")) return;
    try {
      const response = await fetch(`/api/images?key=${encodeURIComponent(key)}`, {
        method: "DELETE",
      });
      const data = await response.json();
      if (data.success) {
        setImages((prev) => prev.filter((img) => img.key !== key));
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
    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
  };

  const folders = ["all", ...Array.from(new Set(images.map((img) => img.folder)))];
  const filteredImages =
    selectedFolder === "all" ? images : images.filter((img) => img.folder === selectedFolder);

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <span className="label-mono text-ink-soft">Media</span>
          <h2 className="display-lg mt-2 text-foreground">Images</h2>
          <p className="mt-2 text-sm text-ink-soft">{filteredImages.length} images</p>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setShowUpload((v) => !v)}
            className="label-mono inline-flex h-11 items-center gap-2 border border-hairline px-4 transition-colors hover:border-signal hover:text-signal"
          >
            <Upload className="h-4 w-4" aria-hidden="true" />
            {showUpload ? "Cancel" : "Upload"}
          </button>
          <button
            type="button"
            onClick={fetchImages}
            className="label-mono inline-flex h-11 items-center border border-hairline px-4 transition-colors hover:border-signal hover:text-signal"
          >
            Refresh
          </button>
        </div>
      </div>

      {showUpload && (
        <div className="border border-hairline p-5">
          <h3 className="label-mono mb-4 text-ink-soft">Upload new images</h3>
          <ImageUpload
            currentImage=""
            onImageChange={(url) => {
              if (url) {
                fetchImages();
                alert("Image uploaded successfully.");
              }
            }}
            folder={selectedFolder === "all" ? "uploads" : selectedFolder}
            label="Select images to upload"
            className="w-full"
          />
        </div>
      )}

      {folders.length > 1 && (
        <div className="flex flex-wrap gap-2">
          {folders.map((folder) => (
            <button
              key={folder}
              type="button"
              onClick={() => setSelectedFolder(folder)}
              aria-pressed={selectedFolder === folder}
              className={`label-mono inline-flex h-9 items-center border px-3 transition-colors ${
                selectedFolder === folder
                  ? "border-signal text-signal"
                  : "border-hairline text-ink-soft hover:border-foreground hover:text-foreground"
              }`}
            >
              {folder === "all" ? "All" : folder}
            </button>
          ))}
        </div>
      )}

      {loading ? (
        <p className="py-12 text-center text-sm text-ink-soft">Loading images…</p>
      ) : filteredImages.length === 0 ? (
        <div className="border border-dashed border-hairline px-6 py-16 text-center">
          <p className="font-display text-xl font-bold">No images</p>
          <p className="mt-2 text-sm text-ink-soft">Upload some images to get started.</p>
        </div>
      ) : (
        <ul className="grid grid-cols-2 gap-px border border-hairline bg-hairline sm:grid-cols-3 lg:grid-cols-5 xl:grid-cols-6">
          {filteredImages.map((image) => (
            <li key={image.key} className="bg-background">
              <div className="relative aspect-square bg-muted">
                <Image
                  src={image.url}
                  alt={image.filename}
                  fill
                  sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
                  unoptimized
                  className="object-cover"
                  onError={(e) => {
                    e.currentTarget.style.display = "none";
                  }}
                />
              </div>
              <div className="p-3">
                <p className="truncate text-xs font-medium" title={image.filename}>
                  {image.filename}
                </p>
                <p className="label-mono text-ink-soft">{formatFileSize(image.size)}</p>
                <div className="mt-3 flex gap-2">
                  <button
                    type="button"
                    onClick={() => copyToClipboard(image.url)}
                    className="label-mono inline-flex h-9 flex-1 items-center justify-center gap-1.5 border border-hairline transition-colors hover:border-signal hover:text-signal"
                  >
                    {copiedUrl === image.url ? (
                      <Check className="h-3.5 w-3.5" aria-hidden="true" />
                    ) : (
                      <Copy className="h-3.5 w-3.5" aria-hidden="true" />
                    )}
                    {copiedUrl === image.url ? "Copied" : "Copy"}
                  </button>
                  <button
                    type="button"
                    onClick={() => deleteImage(image.key)}
                    aria-label={`Delete ${image.filename}`}
                    className="inline-flex h-9 w-9 items-center justify-center border border-hairline transition-colors hover:border-destructive hover:text-destructive"
                  >
                    <Trash2 className="h-3.5 w-3.5" aria-hidden="true" />
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
