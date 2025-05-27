import type { Metadata } from 'next';
import { Montserrat } from 'next/font/google';
import './globals.css';
import { ErrorBoundary } from './components/ErrorBoundary';

const montserrat = Montserrat({
  subsets: ['latin'],
  variable: '--font-montserrat',
});

export const metadata: Metadata = {
  title: 'District 6 App',
  description: 'District 6 App',
  keywords: ['Next.js', 'React', 'TypeScript', 'Template'],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${montserrat.variable}`}>
      <body>
        <ErrorBoundary>
          <div className="main-content-container">{children}</div>
        </ErrorBoundary>
      </body>
    </html>
  );
}
