'use client';

import { SessionProvider } from 'next-auth/react';
import { ThemeProvider } from '@/lib/context/ThemeContext';
import './globals.css';
import type { Metadata } from 'next';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr">
      <body>
        <ThemeProvider>
          <SessionProvider>
            {children}
          </SessionProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
