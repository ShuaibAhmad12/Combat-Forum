"use client"

import { DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { MessageSquare, ThumbsUp, Share2, Search, SlidersHorizontal, Archive } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { useQuery } from "convex/react"
import { api } from "../../../convex/_generated/api"
import { Skeleton } from "@/components/ui/skeleton"
import { useState, useEffect } from "react"
import { BlogContentPreview } from "../../components/blog-content-preview"
import { Input } from "@/components/ui/input"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Badge } from "@/components/ui/badge"
import { Calendar } from "@/components/ui/calendar"
import { format } from "date-fns"
import { Separator } from "@/components/ui/separator"
import { useIsMobile } from "../../hooks/use-mobile"

export default function BlogPage() {
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [sortBy, setSortBy] = useState<string>("latest")
  const [dateRange, setDateRange] = useState<Date | undefined>(undefined)
  const [selectedYear, setSelectedYear] = useState<string | null>(null)
  const [showFilters, setShowFilters] = useState(false)

  const isMobile = useIsMobile()

  // Fetch all categories
  const categories = useQuery(api.posts.getCategories1) || []

  // Fetch archive data
  const archiveData = useQuery(api.posts.getArchiveData) || { years: [], postsByYear: {} }
  const archiveYears = archiveData.years || []
  const archivePosts = archiveData.postsByYear || {}

  // Fetch posts from Convex with filters
  const posts = useQuery(api.posts.getFiltered, {
    searchQuery: searchQuery || undefined,
    category: selectedCategory || undefined,
    sortBy,
    dateFrom: dateRange ? dateRange.getTime() : undefined,
    year: selectedYear || undefined,
  })

  // Debug posts data
  useEffect(() => {
    console.log("Posts data:", posts)
    if (posts !== undefined) {
      setIsLoading(false)
    }
  }, [posts])

  // Reset filters
  const resetFilters = () => {
    setSearchQuery("")
    setSelectedCategory(null)
    setSortBy("latest")
    setDateRange(undefined)
    setSelectedYear(null)
  }

  // Handle active filters display
  const hasActiveFilters = searchQuery || selectedCategory || sortBy !== "latest" || dateRange || selectedYear

  return (
    <div className="flex min-h-screen flex-col">
      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-start gap-4 md:flex-row md:justify-between">
              <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">Blog</h1>
                <p className="max-w-[700px] text-muted-foreground">
                  The latest news, updates, and insights from the world of combat sports.
                </p>
              </div>

              {/* Filter and Search UI for Mobile */}
              {isMobile && (
                <div className="flex flex-col sm:flex-row w-full md:w-auto gap-2">
                  <div className="relative flex-1 sm:max-w-[300px]">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      type="search"
                      placeholder="Search posts..."
                      className="pl-8"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>

                  <div className="flex gap-2">
                    <Popover open={showFilters} onOpenChange={setShowFilters}>
                      <PopoverTrigger asChild>
                        <Button variant="outline" className="gap-2">
                          <SlidersHorizontal className="h-4 w-4" />
                          <span className="hidden sm:inline">Filters</span>
                          {hasActiveFilters && (
                            <Badge
                              variant="secondary"
                              className="ml-1 rounded-full h-5 w-5 p-0 flex items-center justify-center"
                            >
                              !
                            </Badge>
                          )}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-[280px] p-4" align="end">
                        <div className="space-y-4">
                          <h4 className="font-medium">Filter Posts</h4>

                          <div className="space-y-2">
                            <h5 className="text-sm font-medium">Category</h5>
                            <Select
                              value={selectedCategory || ""}
                              onValueChange={(value) => setSelectedCategory(value || null)}
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="All categories" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="all">All categories</SelectItem>
                                {categories.map((category: string) => (
                                  <SelectItem key={category} value={category}>
                                    {category}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>

                          <div className="space-y-2">
                            <h5 className="text-sm font-medium">Sort by</h5>
                            <Select value={sortBy} onValueChange={setSortBy}>
                              <SelectTrigger>
                                <SelectValue placeholder="Sort by" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="latest">Latest</SelectItem>
                                <SelectItem value="oldest">Oldest</SelectItem>
                                <SelectItem value="popular">Most Popular</SelectItem>
                                <SelectItem value="comments">Most Comments</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>

                          <div className="space-y-2">
                            <h5 className="text-sm font-medium">Year</h5>
                            <Select
                              value={selectedYear || ""}
                              onValueChange={(value) => setSelectedYear(value || null)}
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="All years" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="all">All years</SelectItem>
                                {archiveYears.map((year: string) => (
                                  <SelectItem key={year} value={year}>
                                    {year}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>

                          <div className="space-y-2">
                            <h5 className="text-sm font-medium">Date</h5>
                            <Calendar
                              mode="single"
                              selected={dateRange}
                              onSelect={setDateRange}
                              className="border rounded-md p-2"
                            />
                            {dateRange && (
                              <div className="flex items-center justify-between">
                                <span className="text-sm">From: {format(dateRange, "PPP")}</span>
                                <Button variant="ghost" size="sm" onClick={() => setDateRange(undefined)}>
                                  Clear
                                </Button>
                              </div>
                            )}
                          </div>

                          <div className="flex justify-between pt-2">
                            <Button variant="outline" size="sm" onClick={resetFilters}>
                              Reset all
                            </Button>
                            <Button size="sm" onClick={() => setShowFilters(false)}>
                              Apply filters
                            </Button>
                          </div>
                        </div>
                      </PopoverContent>
                    </Popover>

                    <DropdownMenu>
                      {/* <DropdownMenuTrigger asChild>
                        <Button variant="outline">
                          {sortBy === "latest"
                            ? "Latest"
                            : sortBy === "oldest"
                              ? "Oldest"
                              : sortBy === "popular"
                                ? "Popular"
                                : "Most Comments"}
                        </Button>
                      </DropdownMenuTrigger> */}
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Sort by</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => setSortBy("latest")}>Latest</DropdownMenuItem>
                        <DropdownMenuItem onClick={() => setSortBy("oldest")}>Oldest</DropdownMenuItem>
                        <DropdownMenuItem onClick={() => setSortBy("popular")}>Most Popular</DropdownMenuItem>
                        <DropdownMenuItem onClick={() => setSortBy("comments")}>Most Comments</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              )}

              {/* Sort dropdown for desktop */}
              {!isMobile && (
                <div className="flex gap-2">
                  <Select value={sortBy} onValueChange={setSortBy}>
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Sort by" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="latest">Latest</SelectItem>
                      <SelectItem value="oldest">Oldest</SelectItem>
                      <SelectItem value="popular">Most Popular</SelectItem>
                      <SelectItem value="comments">Most Comments</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}
            </div>

            {/* Active filters display */}
            {hasActiveFilters && (
              <div className="flex flex-wrap gap-2 mt-4">
                {selectedCategory && (
                  <Badge variant="secondary" className="flex items-center gap-1">
                    Category: {selectedCategory}
                    <button className="ml-1 hover:text-primary" onClick={() => setSelectedCategory(null)}>
                      ×
                    </button>
                  </Badge>
                )}
                {sortBy !== "latest" && (
                  <Badge variant="secondary" className="flex items-center gap-1">
                    Sort: {sortBy === "oldest" ? "Oldest" : sortBy === "popular" ? "Popular" : "Most Comments"}
                    <button className="ml-1 hover:text-primary" onClick={() => setSortBy("latest")}>
                      ×
                    </button>
                  </Badge>
                )}
                {dateRange && (
                  <Badge variant="secondary" className="flex items-center gap-1">
                    From: {format(dateRange, "PP")}
                    <button className="ml-1 hover:text-primary" onClick={() => setDateRange(undefined)}>
                      ×
                    </button>
                  </Badge>
                )}
                {selectedYear && (
                  <Badge variant="secondary" className="flex items-center gap-1">
                    Year: {selectedYear}
                    <button className="ml-1 hover:text-primary" onClick={() => setSelectedYear(null)}>
                      ×
                    </button>
                  </Badge>
                )}
                {searchQuery && (
                  <Badge variant="secondary" className="flex items-center gap-1">
                    Search: {searchQuery}
                    <button className="ml-1 hover:text-primary" onClick={() => setSearchQuery("")}>
                      ×
                    </button>
                  </Badge>
                )}
                <Button variant="ghost" size="sm" className="h-6 text-xs" onClick={resetFilters}>
                  Clear all
                </Button>
              </div>
            )}

            <div className="flex flex-col lg:flex-row gap-8 mt-8">
              {/* Main content area */}
              <div className="flex-1">
                {isLoading ? (
                  <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-2">
                    {[...Array(6)].map((_, i) => (
                      <Card key={i} className="overflow-hidden">
                        <Skeleton className="h-48 w-full" />
                        <CardHeader>
                          <Skeleton className="h-6 w-3/4 mb-2" />
                          <Skeleton className="h-4 w-1/2" />
                        </CardHeader>
                        <CardContent>
                          <Skeleton className="h-4 w-full mb-2" />
                          <Skeleton className="h-4 w-full" />
                        </CardContent>
                        <CardFooter>
                          <Skeleton className="h-10 w-full" />
                        </CardFooter>
                      </Card>
                    ))}
                  </div>
                ) : error ? (
                  <div className="text-center py-10">
                    <h2 className="text-2xl font-bold text-red-500 mb-4">Error Loading Posts</h2>
                    <p>{error}</p>
                    <Button onClick={() => window.location.reload()} className="mt-4">
                      Try Again
                    </Button>
                  </div>
                ) : !posts || posts.length === 0 ? (
                  <div className="text-center py-10">
                    <h2 className="text-2xl font-bold mb-4">No Posts Found</h2>
                    <p>
                      {hasActiveFilters
                        ? "No posts match your current filters. Try adjusting your search criteria."
                        : "There are currently no blog posts available."}
                    </p>
                    {hasActiveFilters && (
                      <Button onClick={resetFilters} className="mt-4">
                        Clear Filters
                      </Button>
                    )}
                  </div>
                ) : (
                  <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-2">
                    {posts.map((post: any) => (
                      <BlogPostCard key={post._id} post={post} />
                    ))}
                  </div>
                )}
              </div>

              {/* Right sidebar with filters - only shown on desktop */}
              {!isMobile && (
                <div className="w-full lg:w-80 space-y-6">
                  {/* Search */}
                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle>Search</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="relative">
                        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                          type="search"
                          placeholder="Search posts..."
                          className="pl-8"
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                        />
                      </div>
                    </CardContent>
                  </Card>

                  {/* Categories */}
                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle>Categories</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex flex-wrap gap-2">
                        {categories.map((category: string) => (
                          <Badge
                            key={category}
                            variant={selectedCategory === category ? "default" : "secondary"}
                            className="cursor-pointer"
                            onClick={() => setSelectedCategory(selectedCategory === category ? null : category)}
                          >
                            {category} {/* You could add count here */}
                          </Badge>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  {/* Archive */}
                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="flex items-center gap-2">
                        <Archive className="h-4 w-4" />
                        Archive
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {archiveYears.map((year) => (
                        <div key={year}>
                          <h3
                            className={`font-medium mb-2 cursor-pointer hover:text-primary ${selectedYear === year ? "text-primary" : ""}`}
                            onClick={() => setSelectedYear(selectedYear === year ? null : year)}
                          >
                            {year}
                          </h3>
                          {selectedYear === year && (
                            <ul className="space-y-2 pl-4 text-sm">
                              {archivePosts[year]?.map((post, index) => (
                                <li key={index}>
                                  <div className="text-xs text-muted-foreground">{post.date}</div>
                                  <Link href={`/blog/${post.slug}`} className="hover:text-primary">
                                    {post.title}
                                  </Link>
                                </li>
                              ))}
                            </ul>
                          )}
                          {year !== archiveYears[archiveYears.length - 1] && <Separator className="my-2" />}
                        </div>
                      ))}
                    </CardContent>
                  </Card>

                  {/* Subscribe */}
                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle>Subscribe</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground mb-4">
                        Get the latest posts delivered right to your inbox.
                      </p>
                      <div className="space-y-2">
                        <Input placeholder="Enter your email" type="email" />
                        <Button className="w-full">Subscribe</Button>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}

function BlogPostCard({ post }: { post: any }) {
  return (
    <Card className="overflow-hidden flex flex-col">
      <div className="relative h-48">
        {post.imageUrl ? (
          <Image src={post.imageUrl || "/placeholder.svg"} alt={post.title} fill className="object-cover" />
        ) : post.imageId ? (
          <Image
            src={`${process.env.NEXT_PUBLIC_CONVEX_SITE_URL}/getImage/${post.imageId}/image.jpg`}
            alt={post.title}
            fill
            className="object-cover"
          />
        ) : (
          <Image src="/placeholder.svg?height=200&width=400" alt={post.title} fill className="object-cover" />
        )}
        <div className="absolute top-2 left-2 bg-primary text-primary-foreground px-2 py-1 text-xs font-medium rounded">
          {post.category}
        </div>
      </div>
      <CardHeader>
        <CardTitle>{post.title}</CardTitle>
        <CardDescription>
          {new Date(post.createdAt).toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <BlogContentPreview content={post.description} lineClamp={2} />
      </CardContent>
      <CardFooter className="flex justify-between mt-auto">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1">
            <MessageSquare className="h-4 w-4" />
            <span className="text-xs">{post.commentCount}</span>
          </div>
          <div className="flex items-center gap-1">
            <ThumbsUp className="h-4 w-4" />
            <span className="text-xs">{post.likeCount}</span>
          </div>
          <div className="flex items-center gap-1">
            <Share2 className="h-4 w-4" />
          </div>
        </div>
        <Link href={`/blog/${post.slug}`}>
          <Button variant="ghost" size="sm">
            Read More
          </Button>
        </Link>
      </CardFooter>
    </Card>
  )
}
