import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "CAREER EXPO SYRIA",
  description: "CAREER EXPO SYRIA - Connecting Students with Their Future",
};

// Root layout - minimal, only applies to admin routes
// Site routes (/en, /ar) use their own layouts in (site) route group
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Playfair+Display:wght@700&display=swap" rel="stylesheet" />
      </head>
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
