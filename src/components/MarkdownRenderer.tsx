import React from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import remarkBreaks from "remark-breaks";
import rehypeHighlight from "rehype-highlight";
import rehypeRaw from "rehype-raw";
import Link from "next/link";
import Image from "next/image";
import type { Components } from "react-markdown";

interface MarkdownRendererProps {
  content: string;
  className?: string;
}

// Custom components for react-markdown with proper typing
const components: Components = {
  // Custom heading renderer with anchor links
  h1: ({ children, ...props }) => (
    <h1
      className="text-4xl font-bold text-neutral-900 dark:text-white mt-8 mb-6 leading-tight scroll-mt-20"
      {...props}
    >
      {children}
    </h1>
  ),
  h2: ({ children, ...props }) => (
    <h2
      className="text-3xl font-bold text-neutral-900 dark:text-white mt-8 mb-5 leading-tight scroll-mt-20"
      {...props}
    >
      {children}
    </h2>
  ),
  h3: ({ children, ...props }) => (
    <h3
      className="text-2xl font-semibold text-neutral-900 dark:text-white mt-6 mb-4 leading-tight scroll-mt-20"
      {...props}
    >
      {children}
    </h3>
  ),
  h4: ({ children, ...props }) => (
    <h4
      className="text-xl font-semibold text-neutral-900 dark:text-white mt-6 mb-3 leading-tight scroll-mt-20"
      {...props}
    >
      {children}
    </h4>
  ),
  h5: ({ children, ...props }) => (
    <h5
      className="text-lg font-medium text-neutral-900 dark:text-white mt-4 mb-3 leading-tight scroll-mt-20"
      {...props}
    >
      {children}
    </h5>
  ),
  h6: ({ children, ...props }) => (
    <h6
      className="text-base font-medium text-neutral-900 dark:text-white mt-4 mb-2 leading-tight scroll-mt-20"
      {...props}
    >
      {children}
    </h6>
  ),

  // Paragraph with proper spacing
  p: ({ children, ...props }) => (
    <p
      className="text-neutral-700 dark:text-neutral-300 leading-relaxed mb-6"
      {...props}
    >
      {children}
    </p>
  ),

  // Lists with proper styling
  ul: ({ children, ...props }) => (
    <ul
      className="list-disc space-y-2 mb-6 pl-6 text-neutral-700 dark:text-neutral-300 [&>li]:pl-2"
      {...props}
    >
      {children}
    </ul>
  ),
  ol: ({ children, ...props }) => (
    <ol
      className="list-decimal space-y-2 mb-6 pl-6 text-neutral-700 dark:text-neutral-300 [&>li]:pl-2"
      {...props}
    >
      {children}
    </ol>
  ),
  li: ({ children, ...props }) => (
    <li className="leading-relaxed" {...props}>
      {children}
    </li>
  ),

  // Task lists (GitHub Flavored Markdown)
  input: ({ checked, ...props }) => (
    <input
      type="checkbox"
      checked={checked}
      disabled
      className="mr-2 accent-amber-500"
      {...props}
    />
  ),

  // Blockquotes with beautiful styling
  blockquote: ({ children, ...props }) => (
    <blockquote
      className="border-l-4 border-amber-500 bg-amber-50/50 dark:bg-amber-900/10 pl-6 py-4 my-6 rounded-r-lg italic text-neutral-700 dark:text-neutral-300"
      {...props}
    >
      {children}
    </blockquote>
  ),

  // Code blocks with syntax highlighting
  pre: ({ children, ...props }) => (
    <div className="relative my-8">
      <pre
        className="bg-neutral-900 dark:bg-neutral-950 text-neutral-100 p-6 rounded-xl overflow-x-auto border border-neutral-700 dark:border-neutral-800 shadow-lg"
        {...props}
      >
        {children}
      </pre>
      <div className="absolute top-3 right-3">
        <div className="flex space-x-1">
          <div className="w-3 h-3 bg-red-500 rounded-full"></div>
          <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
          <div className="w-3 h-3 bg-green-500 rounded-full"></div>
        </div>
      </div>
    </div>
  ),

  // Inline code
  code: ({ children, className, ...props }) => {
    const isInline = !className?.includes("language-");

    if (isInline) {
      return (
        <code
          className="bg-neutral-100 dark:bg-neutral-800 text-amber-600 dark:text-amber-400 px-1.5 py-0.5 rounded text-sm font-mono border border-neutral-200 dark:border-neutral-700"
          {...props}
        >
          {children}
        </code>
      );
    }
    return (
      <code className={className} {...props}>
        {children}
      </code>
    );
  },

  // Tables with beautiful styling
  table: ({ children, ...props }) => (
    <div className="overflow-x-auto my-8">
      <table
        className="min-w-full border-collapse bg-white dark:bg-neutral-800 rounded-lg overflow-hidden shadow-sm border border-neutral-200 dark:border-neutral-700"
        {...props}
      >
        {children}
      </table>
    </div>
  ),
  thead: ({ children, ...props }) => (
    <thead className="bg-neutral-50 dark:bg-neutral-700" {...props}>
      {children}
    </thead>
  ),
  tbody: ({ children, ...props }) => (
    <tbody
      className="divide-y divide-neutral-200 dark:divide-neutral-600"
      {...props}
    >
      {children}
    </tbody>
  ),
  tr: ({ children, ...props }) => (
    <tr
      className="hover:bg-neutral-50 dark:hover:bg-neutral-700/50 transition-colors"
      {...props}
    >
      {children}
    </tr>
  ),
  th: ({ children, ...props }) => (
    <th
      className="px-6 py-4 text-left text-sm font-semibold text-neutral-900 dark:text-neutral-100 border-b border-neutral-200 dark:border-neutral-600"
      {...props}
    >
      {children}
    </th>
  ),
  td: ({ children, ...props }) => (
    <td
      className="px-6 py-4 text-sm text-neutral-700 dark:text-neutral-300 border-b border-neutral-200 dark:border-neutral-600"
      {...props}
    >
      {children}
    </td>
  ),

  // Links with proper styling
  a: ({ href, children, ...props }) => {
    const isExternal = href?.startsWith("http") || href?.startsWith("https");
    const isAnchor = href?.startsWith("#");

    if (isExternal) {
      return (
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className="text-amber-600 dark:text-amber-400 hover:text-amber-700 dark:hover:text-amber-300 font-medium underline decoration-amber-500/30 hover:decoration-amber-500 transition-all duration-200"
          {...props}
        >
          {children}
        </a>
      );
    }

    if (isAnchor) {
      return (
        <a
          href={href}
          className="text-amber-600 dark:text-amber-400 hover:text-amber-700 dark:hover:text-amber-300 font-medium underline decoration-amber-500/30 hover:decoration-amber-500 transition-all duration-200"
          {...props}
        >
          {children}
        </a>
      );
    }

    return (
      <Link
        href={href || "#"}
        className="text-amber-600 dark:text-amber-400 hover:text-amber-700 dark:hover:text-amber-300 font-medium underline decoration-amber-500/30 hover:decoration-amber-500 transition-all duration-200"
        {...props}
      >
        {children}
      </Link>
    );
  },

  // Images with Next.js optimization
  img: ({ src, alt, ...props }) => {
    if (!src) return null;

    // The 'props' from react-markdown can contain width and height as strings.
    // We need to parse them to numbers for the Next.js Image component.
    const { width, height, ...rest } = props;
    const imageWidth = width ? parseInt(String(width), 10) : 800;
    const imageHeight = height ? parseInt(String(height), 10) : 400;

    return (
      <div className="my-8">
        <Image
          src={src as string}
          alt={alt || ""}
          width={imageWidth}
          height={imageHeight}
          className="rounded-xl shadow-lg border border-neutral-200 dark:border-neutral-700 w-full h-auto"
          style={{ objectFit: "cover" }}
          {...rest}
        />
        {alt && (
          <p className="text-center text-sm text-neutral-500 dark:text-neutral-400 mt-2 italic">
            {alt}
          </p>
        )}
      </div>
    );
  },

  // Horizontal rule
  hr: ({ ...props }) => (
    <hr
      className="my-8 border-0 h-px bg-gradient-to-r from-transparent via-neutral-300 dark:via-neutral-600 to-transparent"
      {...props}
    />
  ),

  // Strong and emphasis
  strong: ({ children, ...props }) => (
    <strong
      className="font-bold text-neutral-900 dark:text-neutral-100"
      {...props}
    >
      {children}
    </strong>
  ),
  em: ({ children, ...props }) => (
    <em className="italic text-neutral-700 dark:text-neutral-300" {...props}>
      {children}
    </em>
  ),

  // Strikethrough
  del: ({ children, ...props }) => (
    <del
      className="line-through text-neutral-500 dark:text-neutral-400"
      {...props}
    >
      {children}
    </del>
  ),
};

export const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({
  content,
  className = "",
}) => {
  return (
    <div className={`prose prose-lg max-w-none ${className}`}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm, remarkBreaks]}
        rehypePlugins={[rehypeHighlight, rehypeRaw]}
        components={components}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
};

export default MarkdownRenderer;
