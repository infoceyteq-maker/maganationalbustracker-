import type { Metadata, Viewport } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Maga · National Bus Digitization — RBAC Operations Console',
  description:
    'National Bus Digitization System with strict role-based access: crews self-register, depots verify, provinces grant permits, automation unlocks live tracking. Admins never enter bus or driver data.',
};

export const viewport: Viewport = {
  themeColor: '#F4F2EE',
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        {/* Typography — Plus Jakarta Sans (display) + Inter (fallback body) */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=Inter:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
