"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu, Search, Shield, Users, MessageSquare, TrendingUp, Dumbbell, Moon, Sun, Bell } from 'lucide-react'
import { useTheme } from "next-themes";
import { UserButton, SignInButton, SignUpButton, useUser } from "@clerk/nextjs";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Id } from "../../convex/_generated/dataModel"; // ✅ Import Convex ID type
import { Input } from "@/components/ui/input"


export default function Navbar() {
  const { setTheme, theme } = useTheme();
  const { isSignedIn, user } = useUser();
  const [isNotifOpen, setIsNotifOpen] = useState(false);

  // ✅ Fetch notifications from Convex
  const notifications = useQuery(api.notifications.list, {
    userId: user?.id ?? "", // Only fetch if user is logged in
  });
  const [localNotifications, setLocalNotifications] = useState(notifications ?? []);
  useEffect(() => {
    if (notifications) {
      setLocalNotifications(notifications);
    }
  }, [notifications]);

  // ✅ Mutation to mark notifications as read
  const markAsRead = useMutation(api.notifications.markAsRead);

  const handleNotificationClick = async (notifId: Id<"notifications">) => {
    await markAsRead({ notificationId: notifId });

    // Optimistically update UI
    setLocalNotifications((prev) =>
      prev.map((n) => (n._id === notifId ? { ...n, isRead: true } : n))
    );
  };

  const isAdmin = user?.publicMetadata?.role === "admin"

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center">
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="ghost" className="mr-2 px-0 text-base md:hidden">
              <Menu className="h-5 w-5" />

            </Button>
          </SheetTrigger>
          <SheetContent side="left">
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
            <NavigationMenuItem>
              <Link href="/blog" legacyBehavior passHref>
                <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                  Blog
                </NavigationMenuLink>
              </Link>
            </NavigationMenuItem>
            <NavigationMenuItem>
            {isAdmin && (
              <Link href="/admin" legacyBehavior passHref>
                <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                  Admin
                </NavigationMenuLink>
              </Link>
               )}
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>

        <div className="flex flex-1 items-center justify-end space-x-2">
          {/* Notification Bell */}
          <div className="relative">
            <Button variant="ghost" size="icon" onClick={() => setIsNotifOpen(!isNotifOpen)}>
              <Bell className="h-5 w-5" />
              {notifications && notifications.filter((n) => !n.isRead).length > 0 && (
                <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-xs text-white">
                  {notifications.filter((n) => !n.isRead).length}
                </span>
              )}

            </Button>

            {/* Notification Dropdown */}
            {isNotifOpen && (
              <div className="absolute right-0 mt-2 w-64 rounded-lg border bg-white shadow-lg dark:bg-gray-800">
                <ul>
                  {notifications && notifications.length > 0 ? (
                    notifications.map((notif) => (
                      <li
                        key={notif._id}
                        className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer"
                        onClick={() => handleNotificationClick(notif._id as Id<"notifications">)}
                      >
                        {notif.type === "like" && `${notif.fromUserName} liked your post!`}
                        {notif.type === "reply" && `${notif.fromUserName} replied to your thread!`}
                      </li>
                    ))
                  ) : (
                    <li className="p-2 text-center text-gray-500">No new notifications</li>
                  )}
                </ul>
              </div>
            )}

          </div>

          {/* Dark Mode Toggle */}
          <Button variant="ghost" size="icon" onClick={() => setTheme(theme === "dark" ? "light" : "dark")}>
            <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          </Button>

          {/* Authentication Buttons */}
          {isSignedIn ? (
            <UserButton afterSignOutUrl="/" />
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
  );
}
