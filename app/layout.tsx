import type { Metadata } from "next";
import { Inter, Outfit } from "next/font/google";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Providers } from "@/components/Providers";
import ChefMascotLoader from "@/components/ChefMascotLoader";
import { Toaster } from "react-hot-toast";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Recipe Remixer – AI-Powered Recipe Generator",
  description:
    "Enter the ingredients you have on hand and let AI craft delicious, creative recipes just for you. Recipe Remixer turns pantry staples into culinary inspiration.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${outfit.variable}`}
    >
      <body className="min-h-screen flex flex-col antialiased">
        <Providers>
          <Navbar />
          {children}
          <Footer />
          <ChefMascotLoader />
          <Toaster 
            position="bottom-right"
            toastOptions={{
              style: {
                background: 'rgba(0,0,0,0.8)',
                color: '#fff',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255,255,255,0.1)',
                fontFamily: 'var(--font-outfit)'
              }
            }}
          />
        </Providers>
      </body>
    </html>
  );
}
