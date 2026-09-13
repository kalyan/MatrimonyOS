import type { Metadata, Viewport } from 'next';
import './globals.css';
import { AuthProvider } from '@/lib/auth/auth-context';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import BottomNav from '@/components/layout/BottomNav';

export const metadata: Metadata = {
  title: 'Matrimony OS — Find Meaningful Connections. Bring Families Together.',
  description:
    'A modern, privacy-first matrimonial experience designed around people, preferences, and family involvement. Optimized for mobile and WhatsApp WebView.',
  manifest: '/manifest.json',
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: '32x32' },
      { url: '/icon.svg', type: 'image/svg+xml' },
    ],
    shortcut: '/favicon.ico',
    apple: '/icons/icon-192.png',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: '#e11d48',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/icons/icon-192.png" />
      </head>
      <body className="min-h-screen flex flex-col bg-[#FAF8F5] text-slate-900 antialiased font-sans pb-16 md:pb-0">
        <AuthProvider>
          <Header />
          <main className="flex-1 w-full max-w-6xl mx-auto px-4 py-4 sm:py-6 flex flex-col">
            <div className="flex-1">
              {children}
            </div>
            <Footer />
          </main>
          <BottomNav />
        </AuthProvider>
      </body>
    </html>
  );
}
