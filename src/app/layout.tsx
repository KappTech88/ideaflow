import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'FlowForge Pro - AI-Powered Workflow Generator',
  description: 'Generate development workflows, database schemas, and project plans with AI',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className={inter.className}>
        <div className="min-h-screen bg-gray-950">
          {children}
        </div>
      </body>
    </html>
  );
}
