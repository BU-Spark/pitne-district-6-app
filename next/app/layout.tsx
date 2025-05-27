import type { Metadata } from 'next';
import { Montserrat, Lora } from 'next/font/google';
import './globals.css';
import { ErrorBoundary } from './components/ErrorBoundary';

const montserrat = Montserrat({
  subsets: ['latin'],
  variable: '--font-montserrat',
});

const lora = Lora({
  subsets: ['latin'],
  variable: '--font-lora',
  style: ['normal', 'italic'],
  weight: ['400'],
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
    <html lang="en" className={`${montserrat.variable} ${lora.variable}`}>
      <body>
        <ErrorBoundary>
          <div className="main-content-container">{children}</div>
        </ErrorBoundary>
      </body>
    </html>
  );
}
