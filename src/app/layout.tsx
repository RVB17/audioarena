import type { Metadata } from 'next';
import { Inter, Outfit, JetBrains_Mono } from 'next/font/google';
import './globals.css';
import { Navbar } from '@/components/layout/Navbar';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });
const outfit = Outfit({ subsets: ['latin'], variable: '--font-outfit' });
const jetbrainsMono = JetBrains_Mono({ subsets: ['latin'], variable: '--font-jetbrains-mono' });

export const metadata: Metadata = {
  title: 'AudioArena — Collaborative Music Arena',
  description: 'A web-based collaborative music production platform where musicians matchmake and create tracks together.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" data-theme="synthwave-dark">
      <body className={`${inter.variable} ${outfit.variable} ${jetbrainsMono.variable}`}>
        <Navbar />
        <main>{children}</main>
      </body>
    </html>
  );
}
