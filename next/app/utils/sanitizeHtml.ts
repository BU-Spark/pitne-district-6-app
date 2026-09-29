import DOMPurify from 'dompurify';

// CMS editors can format biographies, but cannot inject executable markup.
export function sanitizeHtml(html: string): string {
  return DOMPurify.sanitize(html, {
    ALLOWED_TAGS: ['p', 'br', 'strong', 'b', 'em', 'i', 'u', 'ul', 'ol', 'li', 'a', 'blockquote', 'h2', 'h3', 'h4'],
    ALLOWED_ATTR: ['href', 'title'],
  });
}
