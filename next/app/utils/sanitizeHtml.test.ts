import { sanitizeHtml } from './sanitizeHtml';

describe('CMS biography HTML', () => {
  it('keeps basic biography formatting and safe links', () => {
    const html = '<p><strong>Office hours</strong><br><a href="https://www.boston.gov">City website</a></p>';
    expect(sanitizeHtml(html)).toBe(html);
  });

  it('removes executable markup, event handlers, and script URLs', () => {
    const html =
      '<script>alert(1)</script><img src=x onerror="alert(1)"><p onclick="alert(1)">Bio</p><a href="javascript:alert(1)">link</a><iframe src="https://example.com"></iframe>';
    expect(sanitizeHtml(html)).toBe('<p>Bio</p><a>link</a>');
  });
});
