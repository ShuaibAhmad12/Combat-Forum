import { Inter } from 'next/font/google'
import "./globals.css"
import { ThemeProvider } from "next-themes"
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"
import ConvexClientProvider from "../../convex/ConvexClientProvider"

const inter = Inter({ subsets: ["latin"] })

export const metadata = {
  title: "Martial Arts Forum",
  description: "A community for martial arts enthusiasts to discuss techniques, share experiences, and connect with others.",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ConvexClientProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <div className="flex min-h-screen flex-col">
              <Navbar />
              <main className="flex-1">{children}</main>
              <Footer />
            </div>
          </ThemeProvider>
        </ConvexClientProvider>
      </body>
    </html>
  )
}