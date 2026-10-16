import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import Script from 'next/script';
import './globals.css';
import { siteMetadata } from '@/lib/seo/metadata';

export const metadata: Metadata = siteMetadata();

export default function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="en">
      <body>
        {children}
        <Script src="/legacy/analytics-consent.js" strategy="beforeInteractive" />
      </body>
    </html>
  );
}
