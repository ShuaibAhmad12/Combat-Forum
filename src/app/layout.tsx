// pages/_app.tsx

import { ClerkProvider, useClerk } from '@clerk/nextjs';
// import { useRouter } from 'next/router';
import { Inter } from 'next/font/google';
import { ThemeProvider } from 'next-themes';
import Navbar from '@/components/navbar';
import Footer from '@/components/footer';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'Martial Arts Forum',
  description:
    'A community for martial arts enthusiasts to discuss techniques, share experiences, and connect with others.',
};

const clerkFrontendApi = process.env.NEXT_PUBLIC_CLERK_FRONTEND_API;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ClerkProvider publishableKey={clerkFrontendApi}>
          <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
            <div className="flex min-h-screen flex-col">
              <Navbar />
              <main className="flex-1">{children}</main>
              <Footer />
            </div>
          </ThemeProvider>
        </ClerkProvider>
      </body>
    </html>
  );
}
