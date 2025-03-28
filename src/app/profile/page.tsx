import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default async function ProfilePage() {
  const user = await currentUser();
  
  if (!user) {
    redirect("/auth/login");
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col space-y-4 mb-8">
        <h1 className="text-3xl font-bold">My Profile</h1>
        <p className="text-muted-foreground">
          Manage your profile and account settings
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <div className="md:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle>Profile</CardTitle>
              <CardDescription>Your personal information</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col items-center space-y-4">
              <Avatar className="h-24 w-24">
                <AvatarImage src={user.imageUrl} alt={user.username || user.firstName || "User"} />
                <AvatarFallback>
                  {user.firstName?.charAt(0) || user.username?.charAt(0) || "U"}
                </AvatarFallback>
              </Avatar>
              <div className="text-center">
                <h2 className="text-xl font-semibold">
                  {user.username || `${user.firstName} ${user.lastName}` || "User"}
                </h2>
                <p className="text-sm text-muted-foreground">{user.emailAddresses[0].emailAddress}</p>
              </div>
              <Button asChild variant="outline" className="w-full">
                <Link href="https://accounts.clerk.dev/user/profile">
                  Edit Profile
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>

        <div className="md:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Account Activity</CardTitle>
              <CardDescription>Your recent activity on the forum</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="border rounded-lg p-4">
                  <h3 className="font-medium">Your Threads</h3>
                  <p className="text-sm text-muted-foreground mt-2">
                    You haven't created any threads yet.
                  </p>
                  <Button className="mt-4" asChild>
                    <Link href="/topics">Start a Thread</Link>
                  </Button>
                </div>
                
                <div className="border rounded-lg p-4">
                  <h3 className="font-medium">Your Replies</h3>
                  <p className="text-sm text-muted-foreground mt-2">
                    You haven't replied to any threads yet.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}