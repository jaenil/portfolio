import type { Metadata } from "next";
import {
  Geist,
  Geist_Mono
} from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "next-themes";
import { siteStructuredData } from "./seo-jsonld";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";

const geist = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
  preload: true,
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
  preload: false,
});

export const metadata: Metadata = {
  metadataBase: new URL("https://vgil.fr"),
  title: "Valentin Gil - Portfolio",
  description:
    "Étudiant de 2e année en BUT Métiers du Multimédia et de l'Internet à l'IUT d'Angoulême.",
  icons: {
    icon: [
      { url: "/favicon.ico", type: "image/x-icon" },
      { url: "/favicon.svg", type: "image/svg+xml" },
    ],
    apple: [{ url: "/apple-icon.png", sizes: "180x180", type: "image/png" }],
  },
  manifest: "/site.webmanifest",
  alternates: {
    canonical: "https://vgil.fr",
    languages: {
      "fr": "https://vgil.fr",
      "x-default": "https://vgil.fr",
    },
  },
  openGraph: {
    title: "Valentin Gil - Portfolio",
    description:
      "Étudiant de 2e année en BUT Métiers du Multimédia et de l'Internet à l'IUT d'Angoulême.",
    url: "https://vgil.fr",
    siteName: "Valentin Gil - Portfolio",
    images: [
      {
        url: "/thumbnail.png",
        width: 1080,
        height: 1080,
        alt: "Valentin Gil",
      },
    ],
    locale: "fr_FR",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "Valentin Gil - Portfolio",
    description:
      "Étudiant de 2e année en BUT Métiers du Multimédia et de l'Internet à l'IUT d'Angoulême.",
    images: ["/thumbnail.png"],
  },
};

export const viewport = {
  themeColor: "#ffffff",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" suppressHydrationWarning>
      <head>
        <script
          key="ldjson"
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(siteStructuredData),
          }}
        />
      </head>
      <body className={`${geist.variable} ${geistMono.variable} antialiased`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem={false}
        >
          {children}
        </ThemeProvider>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
