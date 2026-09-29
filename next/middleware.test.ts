/** @jest-environment node */
import { NextRequest } from 'next/server';
import { middleware } from './middleware';

describe('frontend request methods', () => {
  it.each(['GET', 'HEAD'])('allows %s page requests', (method) => {
    expect(
      middleware(new NextRequest('https://www.bostond6.com/locations', { method })).headers.get('x-middleware-next')
    ).toBe('1');
  });
  it.each(['POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'])('rejects unused %s requests', (method) => {
    const response = middleware(
      new NextRequest('https://www.bostond6.com/', { method, headers: { 'Next-Action': 'unused' } })
    );
    expect(response.status).toBe(405);
    expect(response.headers.get('allow')).toBe('GET, HEAD');
  });
});
