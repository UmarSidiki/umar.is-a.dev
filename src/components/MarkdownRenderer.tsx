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

const components: Components = {
  h1: ({ children, ...props }) => (
    <h1 className="mt-10 mb-6 font-display text-3xl font-bold leading-tight text-foreground scroll-mt-28 lg:text-4xl" {...props}>
      {children}
    </h1>
  ),
  h2: ({ children, ...props }) => (
    <h2 className="mt-10 mb-5 font-display text-2xl font-bold leading-tight text-foreground scroll-mt-28 lg:text-3xl" {...props}>
      {children}
    </h2>
  ),
  h3: ({ children, ...props }) => (
    <h3 className="mt-8 mb-4 font-display text-xl font-bold leading-tight text-foreground scroll-mt-28" {...props}>
      {children}
    </h3>
  ),
  h4: ({ children, ...props }) => (
    <h4 className="mt-6 mb-3 font-display text-lg font-semibold leading-tight text-foreground scroll-mt-28" {...props}>
      {children}
    </h4>
  ),
  h5: ({ children, ...props }) => (
    <h5 className="mt-5 mb-3 font-medium text-foreground scroll-mt-28" {...props}>
      {children}
    </h5>
  ),
  h6: ({ children, ...props }) => (
    <h6 className="mt-4 mb-2 text-base font-medium text-foreground scroll-mt-28" {...props}>
      {children}
    </h6>
  ),

  p: ({ children, ...props }) => (
    <p className="mb-6 leading-relaxed text-foreground/90" {...props}>
      {children}
    </p>
  ),

  ul: ({ children, ...props }) => (
    <ul className="mb-6 list-disc space-y-2 pl-6 text-foreground/90 [&>li]:pl-1" {...props}>
      {children}
    </ul>
  ),
  ol: ({ children, ...props }) => (
    <ol className="mb-6 list-decimal space-y-2 pl-6 text-foreground/90 [&>li]:pl-1" {...props}>
      {children}
    </ol>
  ),
  li: ({ children, ...props }) => (
    <li className="leading-relaxed" {...props}>
      {children}
    </li>
  ),

  input: ({ checked, ...props }) => (
    <input type="checkbox" checked={checked} disabled className="mr-2 accent-[var(--signal)]" {...props} />
  ),

  blockquote: ({ children, ...props }) => (
    <blockquote
      className="my-8 border-l-2 border-signal bg-signal/5 py-4 pl-6 pr-4 italic text-foreground/90"
      {...props}
    >
      {children}
    </blockquote>
  ),

  pre: ({ children, ...props }) => (
    <pre
      className="my-8 overflow-x-auto border border-hairline bg-[oklch(0.17_0.01_70)] p-5 text-sm text-neutral-100"
      {...props}
    >
      {children}
    </pre>
  ),

  code: ({ children, className, ...props }) => {
    const isInline = !className?.includes("language-");
    if (isInline) {
      return (
        <code
          className="border border-hairline bg-muted px-1.5 py-0.5 font-mono text-[0.85em] text-signal"
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

  table: ({ children, ...props }) => (
    <div className="my-8 overflow-x-auto">
      <table className="w-full border border-hairline" {...props}>
        {children}
      </table>
    </div>
  ),
  thead: ({ children, ...props }) => (
    <thead className="bg-muted" {...props}>
      {children}
    </thead>
  ),
  tbody: ({ children, ...props }) => <tbody {...props}>{children}</tbody>,
  tr: ({ children, ...props }) => (
    <tr className="border-b border-hairline" {...props}>
      {children}
    </tr>
  ),
  th: ({ children, ...props }) => (
    <th className="border-b border-hairline px-4 py-3 text-left text-sm font-semibold text-foreground" {...props}>
      {children}
    </th>
  ),
  td: ({ children, ...props }) => (
    <td className="border-b border-hairline px-4 py-3 text-sm text-foreground/90" {...props}>
      {children}
    </td>
  ),

  a: ({ href, children, ...props }) => {
    const isExternal = href?.startsWith("http");
    const className =
      "font-medium text-signal underline underline-offset-4 decoration-signal/40 transition-colors hover:decoration-signal";

    if (isExternal || href?.startsWith("#")) {
      return (
        <a
          href={href}
          target={isExternal ? "_blank" : undefined}
          rel={isExternal ? "noopener noreferrer" : undefined}
          className={className}
          {...props}
        >
          {children}
        </a>
      );
    }

    return (
      <Link href={href || "#"} className={className} {...props}>
        {children}
      </Link>
    );
  },

  img: ({ src, alt, ...props }) => {
    if (!src) return null;
    const { width, height, ...rest } = props;
    const imageWidth = width ? parseInt(String(width), 10) : 1200;
    const imageHeight = height ? parseInt(String(height), 10) : 675;

    return (
      <span className="my-8 block">
        <Image
          src={src as string}
          alt={alt || ""}
          width={imageWidth}
          height={imageHeight}
          className="h-auto w-full border border-hairline"
          {...rest}
        />
        {alt && (
          <span className="mt-3 block text-center text-sm italic text-ink-soft">{alt}</span>
        )}
      </span>
    );
  },

  hr: ({ ...props }) => <hr className="my-10 h-px border-0 bg-hairline" {...props} />,

  strong: ({ children, ...props }) => (
    <strong className="font-bold text-foreground" {...props}>
      {children}
    </strong>
  ),
  em: ({ children, ...props }) => (
    <em className="italic text-foreground/90" {...props}>
      {children}
    </em>
  ),
  del: ({ children, ...props }) => (
    <del className="text-ink-soft line-through" {...props}>
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
