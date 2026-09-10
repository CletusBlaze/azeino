import type { Metadata } from 'next';
import './globals.css';
import ToastContainer from '../src/components/shared/Toast';
import ErrorBoundary from '../src/components/shared/ErrorBoundary';

export const metadata: Metadata = {
  title: 'AZEINO',
  description: 'One AI for almost everything.',
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'AZEINO',
  },
  other: {
    'mobile-web-app-capable': 'yes',
  },
};

export const viewport = {
  themeColor: '#6366F1',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" data-theme="dark">
      <body>
        <div className="bg-animation" aria-hidden="true">
          <div className="bg-mesh" />
          <div className="bg-grid" />
          <div className="bg-glow" />
        </div>
        <ErrorBoundary>
          <div style={{ position: 'relative', zIndex: 1, minHeight: '100vh' }}>
            {children}
          </div>
        </ErrorBoundary>
        <ToastContainer />
      </body>
    </html>
  );
}
