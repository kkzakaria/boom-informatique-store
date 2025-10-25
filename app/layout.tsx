import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { AuthProvider } from "@/components/providers/session-provider";
import { CartDrawer } from "@/components/cart/cart-drawer";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Boom Informatique Store - Votre Magasin Informatique en Ligne",
    template: "%s | Boom Informatique Store"
  },
  description: "Découvrez notre sélection complète d'ordinateurs, composants informatiques, accessoires et logiciels. Livraison rapide, prix compétitifs et service client de qualité.",
  keywords: ["informatique", "ordinateur", "composants", "accessoires", "logiciels", "magasin en ligne", "e-commerce"],
  authors: [{ name: "Boom Informatique Store" }],
  creator: "Boom Informatique Store",
  publisher: "Boom Informatique Store",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    locale: 'fr_FR',
    url: '/',
    title: 'Boom Informatique Store - Votre Magasin Informatique en Ligne',
    description: 'Découvrez notre sélection complète d\'ordinateurs, composants informatiques, accessoires et logiciels.',
    siteName: 'Boom Informatique Store',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Boom Informatique Store - Votre Magasin Informatique en Ligne',
    description: 'Découvrez notre sélection complète d\'ordinateurs, composants informatiques, accessoires et logiciels.',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
