import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Shield, Users, MessageSquare, TrendingUp, Dumbbell } from "lucide-react"

export default function Home() {
  return (
    <div className="container mx-auto px-4 py-8">
      <section className="py-12 md:py-16 lg:py-20">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl">
                Martial Arts Discussion Forum
              </h1>
              <p className="mx-auto max-w-[700px] text-gray-500 md:text-xl dark:text-gray-400">
                Join the community to discuss techniques, share experiences, and connect with martial artists from
                around the world.
              </p>
            </div>
            <div className="space-x-4">
              <Link href="/topics">
                <Button size="lg">Browse Topics</Button>
              </Link>
              <Link href="/auth/signup">
                <Button variant="outline" size="lg">
                  Sign Up
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="py-12 md:py-16">
        <div className="container px-4 md:px-6">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            <Card>
              <CardHeader className="flex flex-row items-center gap-4">
                <Shield className="h-8 w-8 text-primary" />
                <div className="grid gap-1">
                  <CardTitle>Multiple Disciplines</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p>Explore discussions on MMA, Taekwondo, Jiu-Jitsu, Judo, Boxing, and more.</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center gap-4">
                <Users className="h-8 w-8 text-primary" />
                <div className="grid gap-1">
                  <CardTitle>Active Community</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p>Connect with practitioners, coaches, and enthusiasts from around the world.</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center gap-4">
                <MessageSquare className="h-8 w-8 text-primary" />
                <div className="grid gap-1">
                  <CardTitle>Engaging Discussions</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p>Start threads, share insights, and participate in meaningful conversations.</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <section className="py-12 md:py-16 bg-muted/50 rounded-lg">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">Popular Topics</h2>
              <p className="mx-auto max-w-[700px] text-gray-500 md:text-xl dark:text-gray-400">
                Explore our most active discussion categories
              </p>
            </div>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4 mt-8">
            {[
              {
                name: "MMA",
                icon: <TrendingUp className="h-8 w-8" />,
                threads: 324,
                color: "bg-red-100 dark:bg-red-900/20",
              },
              {
                name: "Brazilian Jiu-Jitsu",
                icon: <Shield className="h-8 w-8" />,
                threads: 256,
                color: "bg-blue-100 dark:bg-blue-900/20",
              },
              {
                name: "Boxing",
                icon: <Dumbbell className="h-8 w-8" />,
                threads: 198,
                color: "bg-yellow-100 dark:bg-yellow-900/20",
              },
              {
                name: "Taekwondo",
                icon: <Shield className="h-8 w-8" />,
                threads: 145,
                color: "bg-green-100 dark:bg-green-900/20",
              },
            ].map((topic, i) => (
              <Link key={i} href={`/topics/${topic.name.toLowerCase().replace(/\s+/g, "-")}`}>
                <Card className={`hover:shadow-md transition-shadow ${topic.color}`}>
                  <CardHeader>
                    <div className="flex items-center gap-2">
                      {topic.icon}
                      <CardTitle>{topic.name}</CardTitle>
                    </div>
                  </CardHeader>
                  <CardFooter>
                    <p className="text-sm text-muted-foreground">{topic.threads} threads</p>
                  </CardFooter>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="py-12 md:py-16">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">Join Our Community Today</h2>
              <p className="mx-auto max-w-[700px] text-gray-500 md:text-xl dark:text-gray-400">
                Create an account to participate in discussions, share your knowledge, and connect with fellow martial
                artists.
              </p>
            </div>
            <div className="space-x-4">
              <Link href="/auth/signup">
                <Button size="lg">Sign Up Now</Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

