import { NextRequest, NextResponse } from 'next/server';

// This frontend only serves pages and assets. Forms post directly to Strapi.
// Reject unused write methods before requests reach the RSC action handler.
export function middleware(request: NextRequest) {
  if (request.method !== 'GET' && request.method !== 'HEAD') {
    return new NextResponse(null, {
      status: 405,
      headers: { Allow: 'GET, HEAD', 'Cache-Control': 'no-store' },
    });
  }
  return NextResponse.next();
}

export const config = { matcher: '/:path*' };
