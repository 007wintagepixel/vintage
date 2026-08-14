import type { Metadata, Viewport } from "next";
import { Inter, Space_Grotesk, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space-grotesk",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Ludo Nexus | Premium Multiplayer Ludo",
  description:
    "Experience futuristic Ludo gaming with real-time multiplayer, tournaments, AI opponents, and a premium cyber-gaming interface.",
  keywords: ["ludo", "multiplayer", "game", "tournament", "ai", "board game"],
  authors: [{ name: "Ludo Nexus Team" }],
  creator: "Ludo Nexus",
  publisher: "Ludo Nexus",
  robots: "index, follow",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://ludonexus.com",
    title: "Ludo Nexus | Premium Multiplayer Ludo",
    description:
      "Experience futuristic Ludo gaming with real-time multiplayer, tournaments, AI opponents, and a premium cyber-gaming interface.",
    siteName: "Ludo Nexus",
  },
  twitter: {
    card: "summary_large_image",
    title: "Ludo Nexus | Premium Multiplayer Ludo",
    description:
      "Experience futuristic Ludo gaming with real-time multiplayer, tournaments, AI opponents.",
  },
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon-16x16.png",
    apple: "/apple-touch-icon.png",
  },
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Ludo Nexus",
  },
  formatDetection: {
    telephone: false,
  },
};

export const viewport: Viewport = {
  themeColor: "#0C0A09",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${spaceGrotesk.variable} ${jetbrainsMono.variable} dark`}
    >
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        {/* PWA Meta Tags */}
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta
          name="apple-mobile-web-app-status-bar-style"
          content="black-translucent"
        />
        <meta name="apple-mobile-web-app-title" content="Ludo Nexus" />
        <meta
          name="theme-color"
          content="#0C0A09"
          media="(prefers-color-scheme: dark)"
        />
        <meta
          name="theme-color"
          content="#0C0A09"
          media="(prefers-color-scheme: light)"
        />
        <link rel="apple-touch-icon" href="/icons/icon-192x192.png" />
        <link rel="mask-icon" href="/icons/icon-512x512.png" color="#0C0A09" />
      </head>
      <body className="min-h-screen bg-background-DEFAULT bg-mesh font-sans">
        {children}
        {/* Service Worker Registration */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              if ('serviceWorker' in navigator) {
                window.addEventListener('load', () => {
                  navigator.serviceWorker.register('/sw.js', { scope: '/' })
                    .then(reg => console.log('[SW] Registered:', reg.scope))
                    .catch(err => console.error('[SW] Registration failed:', err));
                });
              }
            `,
          }}
        />
      </body>
    </html>
  );
}
