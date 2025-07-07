/**
 * Process markdown content for react-markdown
 * @param markdown The markdown content to process
 * @returns Normalized markdown string
 */
export function processMarkdown(markdown: string): string {
  if (!markdown) return '';
  
  // Just normalize the markdown content, react-markdown will handle the rendering
  return markdown
    .replace(/\r\n/g, '\n') // Normalize line endings
    .replace(/\r/g, '\n')   // Handle old Mac line endings
    .trim();
}

/**
 * Sanitize markdown content for storage
 * @param content The raw markdown content
 * @returns Sanitized markdown content
 */
export function sanitizeMarkdown(content: string): string {
  if (!content) return '';
  
  return content
    .trim()
    .replace(/\r\n/g, '\n')
    .replace(/\r/g, '\n');
}

/**
 * Extract plain text from markdown for excerpts
 * @param markdown The markdown content
 * @param maxLength Maximum length of the excerpt
 * @returns Plain text excerpt
 */
export function extractTextFromMarkdown(markdown: string, maxLength = 160): string {
  if (!markdown) return '';
  
  try {
    // Simple text extraction without HTML processing
    const text = markdown
      // Remove markdown syntax
      .replace(/#{1,6}\s+/g, '') // Remove headers
      .replace(/\*\*(.*?)\*\*/g, '$1') // Remove bold
      .replace(/\*(.*?)\*/g, '$1') // Remove italic
      .replace(/`(.*?)`/g, '$1') // Remove inline code
      .replace(/```[\s\S]*?```/g, '') // Remove code blocks
      .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1') // Extract link text
      .replace(/!\[([^\]]*)\]\([^)]+\)/g, '$1') // Extract image alt text
      .replace(/>\s+/g, '') // Remove blockquote markers
      .replace(/[-*+]\s+/g, '') // Remove list markers
      .replace(/\d+\.\s+/g, '') // Remove numbered list markers
      .replace(/\n{2,}/g, ' ') // Replace multiple newlines with space
      .replace(/\s+/g, ' ') // Normalize whitespace
      .trim();
    
    if (text.length <= maxLength) return text;
    
    // Find the last complete word within the limit
    const truncated = text.substring(0, maxLength);
    const lastSpace = truncated.lastIndexOf(' ');
    
    return lastSpace > 0 
      ? truncated.substring(0, lastSpace) + '...'
      : truncated + '...';
  } catch (error) {
    console.error('Error extracting text from markdown:', error);
    return markdown.substring(0, maxLength) + '...';
  }
}
