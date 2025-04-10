"use client"

import type { ReactNode } from "react"
import { ConvexReactClient } from "convex/react"
import { ConvexProviderWithClerk } from "convex/react-clerk"
import { ClerkLoading, ClerkLoaded, useAuth } from "@clerk/nextjs"

const convex = new ConvexReactClient(process.env.NEXT_PUBLIC_CONVEX_URL as string)

export function ConvexClientProvider({
  children,
}: {
  children: ReactNode
}) {
  return (
    <>
      <ClerkLoading>
        <div className="flex items-center justify-center h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      </ClerkLoading>
      <ClerkLoaded>
        <ConvexProviderWithClerk client={convex} useAuth={useAuth}>
          {children}
        </ConvexProviderWithClerk>
      </ClerkLoaded>
    </>
  )
}

