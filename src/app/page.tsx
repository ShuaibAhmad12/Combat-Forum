"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Shield, Users, MessageSquare, TrendingUp, Dumbbell, Flame, ChevronRight, Eye, ThumbsUp, Clock } from "lucide-react";
import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { useUser } from "@clerk/clerk-react";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Id } from "../../convex/_generated/dataModel";

// Map topic names to icons
const iconMap = {
  "trending-up": <TrendingUp className="h-6 w-6" />,
  "shield": <Shield className="h-6 w-6" />,
  "dumbbell": <Dumbbell className="h-6 w-6" />,
  "flame": <Flame className="h-6 w-6" />,
  "users": <Users className="h-6 w-6" />,
  "message-square": <MessageSquare className="h-6 w-6" />,
};

// Color mapping for topics with better contrast
const colorMap = {
  "red": "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300",
  "blue": "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300",
  "green": "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300",
  "yellow": "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300",
  "purple": "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300",
  "orange": "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300",
};

export default function Home() {
  const { isSignedIn, user } = useUser();

  // Fetch user threads only when user is signed in and userId is available
  const userThreads = useQuery(
    api.threads.getThreadsByUser, 
    isSignedIn ? { userId: user?.id } : "skip"
  ) || [];
  
  // Get the pathname and extract topic from URL
  const pathname = usePathname();
  const pathParts = pathname.split("/").filter(Boolean);
  const topicSlug = pathParts[pathParts.length - 1];
  
  // Fetch topics and threads
  const topics = useQuery(api.topics.list) || [];
  const [topicId, setTopicId] = useState<string | null>(null);
  const featuredTopics = topics.slice(0, 4);
  const threads = useQuery(api.threads.list, topicId ? { topicId: topicId as Id<"topics"> } : "skip") || [];
  
  // Get the latest threads for the "Recent Discussions" section
  const recentThreads = useQuery(api.threads.getRecentThreads, { limit: 3 }) || [];

  useEffect(() => {
    if (topicSlug) {
      const matchingTopic = topics.find((t) => t.name.toLowerCase().replace(/\s+/g, "-") === topicSlug);
      if (matchingTopic) {
        setTopicId(matchingTopic._id);
      }
    }
  }, [topics, topicSlug]);

  // Function to get the topic name from an ID
  const getTopicName = (topicId: string) => {
    const topic = topics.find(t => t._id === topicId);
    return topic ? topic.name : "General";
  };

  // Function to format date
  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/30">
      {/* Hero Section with Enhanced Visual Appeal */}
      <section className="relative py-20 md:py-24 lg:py-28 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-secondary/10 dark:from-primary/5 dark:to-secondary/5 z-0" />
        <div className="container relative z-10 px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-6 text-center">
            <div className="space-y-4">
              <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary">
                Martial Arts Discussion Forum
              </h1>
              <p className="mx-auto max-w-[700px] text-lg md:text-xl text-muted-foreground">
                Join the community to discuss techniques, share experiences, and connect with martial artists from around the world.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/topics">
                <Button size="lg" className="w-full sm:w-auto rounded-full">
                  Browse Topics
                  <ChevronRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              {!isSignedIn && (
                <Link href="/auth/signup">
                  <Button variant="outline" size="lg" className="w-full sm:w-auto rounded-full">
                    Sign Up
                  </Button>
                </Link>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Features Section with Improved Cards */}
      <section className="py-12 md:py-16">
        <div className="container px-4 md:px-6">
          <h2 className="text-2xl font-bold tracking-tight mb-8 text-center">Why Join Our Community?</h2>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            <Card className="border-none shadow-md hover:shadow-lg transition-all duration-200">
              <CardHeader className="flex flex-row items-center gap-4">
                <div className="p-2 rounded-full bg-primary/10">
                  <Shield className="h-6 w-6 text-primary" />
                </div>
                <CardTitle>Multiple Disciplines</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">Explore discussions on MMA, Taekwondo, Jiu-Jitsu, Judo, Boxing, and many more martial arts styles.</p>
              </CardContent>
            </Card>
            <Card className="border-none shadow-md hover:shadow-lg transition-all duration-200">
              <CardHeader className="flex flex-row items-center gap-4">
                <div className="p-2 rounded-full bg-primary/10">
                  <Users className="h-6 w-6 text-primary" />
                </div>
                <CardTitle>Active Community</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">Connect with practitioners, coaches, and enthusiasts from around the world who share your passion.</p>
              </CardContent>
            </Card>
            <Card className="border-none shadow-md hover:shadow-lg transition-all duration-200">
              <CardHeader className="flex flex-row items-center gap-4">
                <div className="p-2 rounded-full bg-primary/10">
                  <MessageSquare className="h-6 w-6 text-primary" />
                </div>
                <CardTitle>Engaging Discussions</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">Start threads, share insights, and participate in meaningful conversations about your favorite martial arts.</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Popular Topics Section with Improved Visual Design */}
      <section className="py-12 md:py-16 bg-muted/50 rounded-xl mx-4 md:mx-6">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center mb-8">
            <h2 className="text-3xl font-bold tracking-tight">
              Popular Topics
            </h2>
            <p className="text-muted-foreground max-w-[700px]">
              Explore our most active discussion categories and join the conversation
            </p>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4 mt-8">
            {featuredTopics.map((topic, index) => (
              <Link key={topic._id} href={`/topics/${topic.name.toLowerCase().replace(/\s+/g, '-')}`}>
                <Card className={`hover:shadow-lg transition-all duration-200 border-none h-full ${colorMap[topic.color.split('-')[0] as keyof typeof colorMap] || 'bg-primary/10'}`}>
                  <CardHeader>
                    <div className="flex items-center gap-3">
                      <div className="bg-background/90 rounded-full p-2">
                        {iconMap[topic.icon as keyof typeof iconMap] || <Shield className="h-6 w-6" />}
                      </div>
                      <CardTitle>{topic.name}</CardTitle>
                    </div>
                    <CardDescription className="mt-2">
                      {["Techniques", "Training methods", "Philosophy", "Equipment"][index % 4]}
                    </CardDescription>
                  </CardHeader>
                  <CardFooter className="flex justify-between">
                    <span className="text-sm font-medium">{topic.threadCount} threads</span>
                    <Button variant="ghost" size="sm" className="p-0">
                      Explore <ChevronRight className="ml-1 h-4 w-4" />
                    </Button>
                  </CardFooter>
                </Card>
              </Link>
            ))}
          </div>
          <div className="flex justify-center mt-8">
            <Link href="/topics">
              <Button variant="outline">View All Topics</Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Recent Discussions Section - New! */}
      <section className="py-12 md:py-16">
        <div className="container px-4 md:px-6">
          <h2 className="text-3xl font-bold tracking-tight mb-8">Recent Discussions</h2>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {recentThreads.map((thread) => (
              <Card key={thread._id} className="overflow-hidden border-none shadow-md hover:shadow-lg transition-all duration-200">
                <CardHeader className="pb-3">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-xs px-2 py-1 rounded-full bg-primary/10 text-primary font-medium">
                      {getTopicName(thread.topicId)}
                    </span>
                    <span className="text-xs text-muted-foreground flex items-center">
                      <Clock className="h-3 w-3 mr-1" />
                      {formatDate(thread._creationTime)}
                    </span>
                  </div>
                  <Link 
                    href={`/topics/${topics.find(t => t._id === thread.topicId)?.name.toLowerCase().replace(/\s+/g, '-') || 'general'}/${thread._id}`}
                  >
                    <CardTitle className="hover:text-primary transition-colors">{thread.title}</CardTitle>
                  </Link>
                </CardHeader>
                <CardContent className="pb-4">
                  <p className="text-muted-foreground line-clamp-2">{thread.content}</p>
                </CardContent>
                <CardFooter className="border-t pt-4 flex justify-between text-sm text-muted-foreground">
                  <div className="flex items-center gap-4">
                    <span className="flex items-center">
                      <Eye className="h-4 w-4 mr-1" /> {thread.views}
                    </span>
                    <span className="flex items-center">
                      <ThumbsUp className="h-4 w-4 mr-1" /> {thread.likes}
                    </span>
                  </div>
                  <Link 
                    href={`/topics/${topics.find(t => t._id === thread.topicId)?.name.toLowerCase().replace(/\s+/g, '-') || 'general'}/${thread._id}`}
                    className="font-medium text-primary hover:underline"
                  >
                    Read More
                  </Link>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Your Threads Section with Improved UX */}
      {isSignedIn && userThreads.length > 0 && (
        <section className="py-12 md:py-16 bg-muted/30 rounded-xl mx-4 md:mx-6">
          <div className="container px-4 md:px-6">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-3xl font-bold tracking-tight">Your Threads</h2>
              <Link href="/profile/threads">
                <Button variant="outline" size="sm">View All</Button>
              </Link>
            </div>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {userThreads.slice(0, 3).map((thread) => (
                <Card key={thread._id} className="overflow-hidden border-none shadow-md hover:shadow-lg transition-all duration-200">
                  <CardHeader className="pb-3">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-xs px-2 py-1 rounded-full bg-primary/10 text-primary font-medium">
                        {getTopicName(thread.topicId)}
                      </span>
                    </div>
                    <Link 
                      href={`/topics/${topics.find(t => t._id === thread.topicId)?.name.toLowerCase().replace(/\s+/g, '-') || 'general'}/${thread._id}`}
                    >
                      <CardTitle className="hover:text-primary transition-colors">{thread.title}</CardTitle>
                    </Link>
                  </CardHeader>
                  <CardContent className="pb-4">
                    <p className="text-muted-foreground line-clamp-2">{thread.content}</p>
                  </CardContent>
                  <CardFooter className="border-t pt-4 flex justify-between text-sm text-muted-foreground">
                    <div className="flex items-center gap-4">
                      <span className="flex items-center">
                        <Eye className="h-4 w-4 mr-1" /> {thread.views}
                      </span>
                      <span className="flex items-center">
                        <ThumbsUp className="h-4 w-4 mr-1" /> {thread.likes}
                      </span>
                    </div>
                    <Link 
                      href={`/topics/${topics.find(t => t._id === thread.topicId)?.name.toLowerCase().replace(/\s+/g, '-') || 'general'}/${thread._id}`}
                      className="font-medium text-primary hover:underline"
                    >
                      Read More
                    </Link>
                  </CardFooter>
                </Card>
              ))}
            </div>
            {userThreads.length > 3 && (
              <div className="flex justify-center mt-6">
                <Link href="/profile/threads">
                  <Button variant="outline">View All Your Threads</Button>
                </Link>
              </div>
            )}
          </div>
        </section>
      )}

      {/* Join Our Community Section with Enhanced CTA */}
      {!isSignedIn && (
        <section className="py-16 md:py-20">
          <div className="container px-4 md:px-6">
            <div className="bg-gradient-to-r from-primary/10 to-secondary/10 dark:from-primary/5 dark:to-secondary/5 rounded-2xl p-8 md:p-12">
              <div className="flex flex-col items-center justify-center space-y-6 text-center max-w-3xl mx-auto">
                <div className="space-y-4">
                  <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
                    Join Our Community Today
                  </h2>
                  <p className="text-lg text-muted-foreground">
                    Create an account to participate in discussions, share your knowledge, and connect with fellow martial artists from around the world.
                  </p>
                </div>
                <div className="flex flex-col sm:flex-row gap-4">
                  <Link href="/auth/signup">
                    <Button size="lg" className="w-full sm:w-auto rounded-full">
                      Sign Up Now
                    </Button>
                  </Link>
                  <Link href="/auth/login">
                    <Button variant="outline" size="lg" className="w-full sm:w-auto rounded-full">
                      Log In
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}
      
      {/* Footer - New! */}
      <footer className="py-8 border-t">
        <div className="container px-4 md:px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div>
              <h3 className="font-medium mb-4">Site Links</h3>
              <ul className="space-y-2">
                <li><Link href="/" className="text-muted-foreground hover:text-primary">Home</Link></li>
                <li><Link href="/topics" className="text-muted-foreground hover:text-primary">Topics</Link></li>
                <li><Link href="/members" className="text-muted-foreground hover:text-primary">Members</Link></li>
                <li><Link href="/contact" className="text-muted-foreground hover:text-primary">Contact</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="font-medium mb-4">Popular Topics</h3>
              <ul className="space-y-2">
                {featuredTopics.slice(0, 4).map((topic) => (
                  <li key={topic._id}>
                    <Link 
                      href={`/topics/${topic.name.toLowerCase().replace(/\s+/g, '-')}`}
                      className="text-muted-foreground hover:text-primary"
                    >
                      {topic.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="font-medium mb-4">Resources</h3>
              <ul className="space-y-2">
                <li><Link href="/resources/beginners" className="text-muted-foreground hover:text-primary">Beginner's Guide</Link></li>
                <li><Link href="/resources/terminology" className="text-muted-foreground hover:text-primary">Terminology</Link></li>
                <li><Link href="/resources/schools" className="text-muted-foreground hover:text-primary">Find Schools</Link></li>
                <li><Link href="/resources/events" className="text-muted-foreground hover:text-primary">Events</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="font-medium mb-4">Legal</h3>
              <ul className="space-y-2">
                <li><Link href="/terms" className="text-muted-foreground hover:text-primary">Terms of Service</Link></li>
                <li><Link href="/privacy" className="text-muted-foreground hover:text-primary">Privacy Policy</Link></li>
                <li><Link href="/guidelines" className="text-muted-foreground hover:text-primary">Community Guidelines</Link></li>
              </ul>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t text-center text-muted-foreground">
            <p>© {new Date().getFullYear()} Martial Arts Discussion Forum. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}