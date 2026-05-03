import { NextResponse } from "next/server";
import { getStripe } from "@/lib/stripe";
import { clerkClient } from "@clerk/nextjs/server";
import Stripe from "stripe";

export async function POST(request: Request) {
  const body = await request.text();
  const signature = request.headers.get("stripe-signature");

  if (!signature || !process.env.STRIPE_WEBHOOK_SECRET) {
    return NextResponse.json({ error: "Missing signature" }, { status: 400 });
  }

  const stripe = getStripe();
  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch {
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  const client = await clerkClient();

  switch (event.type) {
    case "customer.subscription.created":
    case "customer.subscription.updated": {
      const subscription = event.data.object as Stripe.Subscription;
      const customerId = subscription.customer as string;
      const customer = await stripe.customers.retrieve(customerId);
      if (customer.deleted) break;

      const clerkUserId = customer.metadata?.clerkUserId;
      if (!clerkUserId) break;

      const isActive =
        subscription.status === "active" || subscription.status === "trialing";

      await client.users.updateUserMetadata(clerkUserId, {
        publicMetadata: {
          subscriptionActive: isActive,
          subscriptionId: subscription.id,
        },
      });
      break;
    }

    case "customer.subscription.deleted": {
      const subscription = event.data.object as Stripe.Subscription;
      const customerId = subscription.customer as string;
      const customer = await stripe.customers.retrieve(customerId);
      if (customer.deleted) break;

      const clerkUserId = customer.metadata?.clerkUserId;
      if (!clerkUserId) break;

      await client.users.updateUserMetadata(clerkUserId, {
        publicMetadata: {
          subscriptionActive: false,
          subscriptionId: null,
        },
      });
      break;
    }
  }

  return NextResponse.json({ received: true });
}
