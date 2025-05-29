'use client';

import dynamic from 'next/dynamic';

const ResourcePage = dynamic(() => import('./ResourcePage'), { ssr: false });

export default function Map() {
  return <ResourcePage />;
}
