import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import Link from "next/link";

export default async function SettingsPage() {
  const user = await currentUser();
  
  if (!user) {
    redirect("/auth/login");
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col space-y-4 mb-8">
        <h1 className="text-3xl font-bold">Settings</h1>
        <p className="text-muted-foreground">
          Manage your account settings and preferences
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Account Settings</CardTitle>
            <CardDescription>Manage your account details and security</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="font-medium">Email Address</div>
              <div className="text-sm text-muted-foreground">{user.emailAddresses[0].emailAddress}</div>
            </div>
            <div className="space-y-2">
              <div className="font-medium">Username</div>
              <div className="text-sm text-muted-foreground">{user.username || "Not set"}</div>
            </div>
          </CardContent>
          <CardFooter>
            <Button asChild variant="outline">
              <Link href="https://accounts.clerk.dev/user/profile">
                Manage Account
              </Link>
            </Button>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Notification Settings</CardTitle>
            <CardDescription>Control how you receive notifications</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="email-notifications">Email Notifications</Label>
                <div className="text-sm text-muted-foreground">
                  Receive email notifications for replies to your threads
                </div>
              </div>
              <Switch id="email-notifications" />
            </div>
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="thread-notifications">Thread Updates</Label>
                <div className="text-sm text-muted-foreground">
                  Get notified about updates to threads you're participating in
                </div>
              </div>
              <Switch id="thread-notifications" />
            </div>
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="marketing-emails">Marketing Emails</Label>
                <div className="text-sm text-muted-foreground">
                  Receive emails about new features and community events
                </div>
              </div>
              <Switch id="marketing-emails" />
            </div>
          </CardContent>
          <CardFooter>
            <Button>Save Preferences</Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}