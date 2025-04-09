"use client"

import Link from "next/link"
import { UserButton, SignInButton } from "@clerk/nextjs"
import { useUser } from "@clerk/nextjs"
import { ModeToggle } from "@/components/mode-toggle"
import { Button } from "@/components/ui/button"
import { Dumbbell } from "lucide-react"

export function SiteHeader() {
  const { isSignedIn, user } = useUser()
  const isAdmin = user?.publicMetadata?.role === "admin"

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background">
      <div className="container flex h-16 items-center space-x-4 sm:justify-between sm:space-x-0">
        <div className="flex gap-6 md:gap-10">
          <Link href="/" className="flex items-center space-x-2">
            <Dumbbell className="h-6 w-6" />
            <span className="inline-block font-bold">Combat Sports Blog</span>
          </Link>
          <nav className="flex gap-6">
            <Link
              href="/"
              className="flex items-center text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
            >
              Home
            </Link>
            <Link
              href="/blog"
              className="flex items-center text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
            >
              Blog
            </Link>
            {isAdmin && (
              <Link
                href="/admin"
                className="flex items-center text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
              >
                Admin
              </Link>
            )}
          </nav>
        </div>
        <div className="flex flex-1 items-center justify-end space-x-4">
          <nav className="flex items-center space-x-2">
            <ModeToggle />
            {isSignedIn ? (
              <UserButton afterSignOutUrl="/" />
            ) : (
              <SignInButton mode="modal">
                <Button variant="secondary" size="sm">
                  Sign In
                </Button>
              </SignInButton>
            )}
          </nav>
        </div>
      </div>
    </header>
  )
}

