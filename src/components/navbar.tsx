"use client"

import Link from "next/link"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Menu, Search, Shield, Users, MessageSquare, TrendingUp, Dumbbell, Moon, Sun } from 'lucide-react'
import { useTheme } from "next-themes"
import { UserButton, SignInButton, SignUpButton, useUser } from "@clerk/nextjs"

export default function Navbar() {
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const { setTheme, theme } = useTheme()
  const { isSignedIn, user } = useUser()
  
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center">
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="ghost" className="mr-2 px-0 text-base hover:bg-transparent focus-visible:bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 md:hidden">
              <Menu className="h-5 w-5" />
              <span className="sr-only">Toggle Menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="pr-0">
            <div className="px-7">
              <Link href="/" className="flex items-center">
                <Shield className="mr-2 h-4 w-4" />
                <span className="font-bold">Martial Arts Forum</span>
              </Link>
            </div>
            <div className="my-4 px-7">
              <Input placeholder="Search..." className="w-full" />
            </div>
            <nav className="flex flex-col gap-4 px-7">
              <Link href="/" className="flex items-center text-sm font-medium">
                Home
              </Link>
              <Link href="/topics" className="flex items-center text-sm font-medium">
                Topics
              </Link>
              <Link href="/members" className="flex items-center text-sm font-medium">
                Members
              </Link>
              <Link href="/about" className="flex items-center text-sm font-medium">
                About
              </Link>
            </nav>
            <div className="mt-4 border-t px-7 pt-4">
              {isSignedIn ? (
                <div className="flex flex-col gap-4">
                  <Link href="/profile" className="flex items-center text-sm font-medium">
                    Profile
                  </Link>
                  <Link href="/settings" className="flex items-center text-sm font-medium">
                    Settings
                  </Link>
                </div>
              ) : (
                <div className="flex flex-col gap-2">
                  <SignInButton mode="modal">
                    <Button className="w-full">Log In</Button>
                  </SignInButton>
                  <SignUpButton mode="modal">
                    <Button variant="outline" className="w-full">Sign Up</Button>
                  </SignUpButton>
                </div>
              )}
            </div>
          </SheetContent>
        </Sheet>
        <Link href="/" className="mr-6 flex items-center space-x-2">
          <Shield className="h-6 w-6" />
          <span className="hidden font-bold sm:inline-block">Martial Arts Forum</span>
        </Link>
        <NavigationMenu className="hidden md:flex">
          <NavigationMenuList>
            <NavigationMenuItem>
              <Link href="/" legacyBehavior passHref>
                <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                  Home
                </NavigationMenuLink>
              </Link>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <NavigationMenuTrigger>Topics</NavigationMenuTrigger>
              <NavigationMenuContent>
                <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px]">
                  {[
                    { name: "MMA", icon: <TrendingUp className="h-4 w-4" /> },
                    { name: "Brazilian Jiu-Jitsu", icon: <Shield className="h-4 w-4" /> },
                    { name: "Boxing", icon: <Dumbbell className="h-4 w-4" /> },
                    { name: "Taekwondo", icon: <Shield className="h-4 w-4" /> },
                  ].map((topic) => (
                    <li key={topic.name}>
                      <Link
                        href={`/topics/${topic.name.toLowerCase().replace(/\s+/g, '-')}`}
                        legacyBehavior
                        passHref
                      >
                        <NavigationMenuLink className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground">
                          <div className="flex items-center gap-2">
                            {topic.icon}
                            <div className="text-sm font-medium leading-none">{topic.name}</div>
                          </div>
                        </NavigationMenuLink>
                      </Link>
                    </li>
                  ))}
                  <li className="col-span-2">
                    <Link href="/topics" legacyBehavior passHref>
                      <NavigationMenuLink className="block select-none rounded-md p-3 text-center leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground">
                        View All Topics
                      </NavigationMenuLink>
                    </Link>
                  </li>
                </ul>
              </NavigationMenuContent>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <Link href="/members" legacyBehavior passHref>
                <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                  Members
                </NavigationMenuLink>
              </Link>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <Link href="/about" legacyBehavior passHref>
                <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                  About
                </NavigationMenuLink>
              </Link>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>
        <div className="flex flex-1 items-center justify-end space-x-2">
          <div className="w-full flex-1 md:w-auto md:flex-none">
            {isSearchOpen ? (
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search..."
                  className="w-full rounded-lg bg-background pl-8 md:w-[200px] lg:w-[300px]"
                  onBlur={() => setIsSearchOpen(false)}
                  autoFocus
                />
              </div>
            ) : (
              <Button
                variant="ghost"
                size="icon"
                className="mr-1"
                onClick={() => setIsSearchOpen(true)}
              >
                <Search className="h-5 w-5" />
                <span className="sr-only">Search</span>
              </Button>
            )}
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          >
            <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
            <span className="sr-only">Toggle theme</span>
          </Button>
          {isSignedIn ? (
            <UserButton 
              afterSignOutUrl="/"
              appearance={{
                elements: {
                  userButtonAvatarBox: "h-8 w-8"
                }
              }}
            />
          ) : (
            <div className="hidden md:flex md:gap-2">
              <SignInButton mode="modal">
                <Button variant="ghost" size="sm">Log In</Button>
              </SignInButton>
              <SignUpButton mode="modal">
                <Button size="sm">Sign Up</Button>
              </SignUpButton>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}