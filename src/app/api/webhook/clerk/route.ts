import { WebhookEvent } from "@clerk/nextjs/server";
import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { ConvexHttpClient } from "convex/browser";
import { api } from "../../../../../convex/_generated/api";

// Initialize the Convex client
const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

export async function POST(req: Request) {
  // Get the headers
  const headerPayload = await headers();
  const svix_id = headerPayload.get("svix-id");
  const svix_timestamp = headerPayload.get("svix-timestamp");
  const svix_signature = headerPayload.get("svix-signature");
 
  // If there are no headers, error out
  if (!svix_id || !svix_timestamp || !svix_signature) {
    return new NextResponse("Error: Missing svix headers", {
      status: 400,
    });
  }
 
  // Get the body
  const payload = await req.json();
  const body = JSON.stringify(payload);
 
  // Create a new Svix instance with your secret
  const wh = require("svix").Webhook;
  const webhook = new wh(process.env.CLERK_WEBHOOK_SECRET!);
  let evt: WebhookEvent;
  evt = webhook.verify(body, {
    "svix-id": svix_id,
    "svix-timestamp": svix_timestamp,
    "svix-signature": svix_signature,
  });
 
  // Verify the payload with the headers
  try {
    evt = wh;
  } catch (err) {
    console.error("Error verifying webhook:", err);
    return new NextResponse("Error verifying webhook", {
      status: 400,
    });
  }
 
  // Get the ID and type
  const { id } = evt.data;
  const eventType = evt.type;
 
  console.log(`Webhook with ID: ${id} and type: ${eventType}`);
 
  // Forward the webhook to Convex
  try {
    await convex.action(api.clerk.processClerkWebhook, {
      payload,
      headers: {
        "svix-id": svix_id,
        "svix-timestamp": svix_timestamp,
        "svix-signature": svix_signature,
      },
    });
  } catch (err) {
    console.error("Error forwarding webhook to Convex:", err);
  }
 
  return NextResponse.json({ success: true });
}