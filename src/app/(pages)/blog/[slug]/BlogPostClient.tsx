"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, Check, Link as LinkIcon } from "lucide-react";
import { BlogPost } from "@/types/blog";
import { BlogTemplate } from "@/templates/Blog";
import CommentSection from "@/components/CommentSection";
import MarkdownRenderer from "@/components/MarkdownRenderer";
import BlogTTS from "@/components/BlogTTS";

interface BlogPostClientProps {
  post: BlogPost;
  slug: string;
}

export default function BlogPostClient({ post, slug }: BlogPostClientProps) {
  const formatDate = (value: string) =>
    new Date(value).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });

  const share = (url: string) => window.open(url, "_blank", "noopener,noreferrer");

  return (
    <BlogTemplate>
      <div className="mx-auto max-w-3xl">
        <Link
          href="/blog"
          className="label-mono inline-flex items-center gap-2 text-ink-soft transition-colors hover:text-signal"
        >
          <ArrowLeft className="h-3.5 w-3.5" aria-hidden="true" />
          Back to writing
        </Link>

        <header className="mt-10">
          <span className="label-mono text-signal">{post.category}</span>
          <h1 className="display-lg mt-4 text-foreground">{post.title}</h1>
          <p className="mt-6 text-lg leading-relaxed text-ink-soft">{post.excerpt}</p>

          <dl className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-2 border-y border-hairline py-4 text-sm">
            <div className="flex items-center gap-2">
              <dt className="text-ink-soft">By</dt>
              <dd className="font-medium">{post.author}</dd>
            </div>
            <div className="flex items-center gap-2">
              <dt className="text-ink-soft">Published</dt>
              <dd>{formatDate(post.createdAt.toString())}</dd>
            </div>
            {post.readTime && (
              <div className="flex items-center gap-2">
                <dt className="text-ink-soft">Read</dt>
                <dd>{post.readTime} min</dd>
              </div>
            )}
          </dl>
        </header>

        {post.featuredImage && (
          <div className="relative mt-10 aspect-[16/9] w-full overflow-hidden border border-hairline bg-muted">
            <Image
              src={post.featuredImage}
              alt={`Cover image for ${post.title}`}
              fill
              sizes="(max-width: 768px) 100vw, 768px"
              priority
              className="object-cover"
            />
          </div>
        )}

        <div className="mt-8">
          <BlogTTS content={post.content} title={post.title} excerpt={post.excerpt} />
        </div>

        <article className="mt-12">
          <MarkdownRenderer content={post.content} />
        </article>

        <footer className="mt-16 border-t border-hairline pt-8">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm text-ink-soft">
              Written by <span className="font-medium text-foreground">{post.author}</span>
            </p>

            <div className="flex items-center gap-3" role="group" aria-label="Share this article">
              <span className="label-mono text-ink-soft">Share</span>
              <button
                type="button"
                onClick={() =>
                  share(
                    `https://twitter.com/intent/tweet?text=${encodeURIComponent(
                      post.title
                    )}&url=${encodeURIComponent(window.location.href)}`
                  )
                }
                className="label-mono inline-flex h-11 items-center border border-hairline px-4 transition-colors hover:border-signal hover:text-signal"
              >
                X
              </button>
              <button
                type="button"
                onClick={() =>
                  share(
                    `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(
                      window.location.href
                    )}`
                  )
                }
                className="label-mono inline-flex h-11 items-center border border-hairline px-4 transition-colors hover:border-signal hover:text-signal"
              >
                LinkedIn
              </button>
              <CopyLinkButton />
            </div>
          </div>
        </footer>

        {post.commentsEnabled !== false && (
          <div className="mt-16 border-t border-hairline pt-10">
            <CommentSection postSlug={slug} commentsEnabled />
          </div>
        )}
      </div>
    </BlogTemplate>
  );
}

function CopyLinkButton() {
  const [copied, setCopied] = React.useState(false);
  return (
    <button
      type="button"
      onClick={async () => {
        try {
          await navigator.clipboard.writeText(window.location.href);
          setCopied(true);
          setTimeout(() => setCopied(false), 2000);
        } catch {
          /* ignore */
        }
      }}
      className="label-mono inline-flex h-11 items-center gap-2 border border-hairline px-4 transition-colors hover:border-signal hover:text-signal"
    >
      {copied ? (
        <Check className="h-3.5 w-3.5" aria-hidden="true" />
      ) : (
        <LinkIcon className="h-3.5 w-3.5" aria-hidden="true" />
      )}
      {copied ? "Copied" : "Copy link"}
    </button>
  );
}
