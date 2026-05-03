import { auth, clerkClient } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { getStripe } from "@/lib/stripe";

export async function GET() {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const stripe = getStripe();
  const client = await clerkClient();
  const user = await client.users.getUser(userId);
  const stripeCustomerId = user.privateMetadata?.stripeCustomerId as string | undefined;

  if (!stripeCustomerId) {
    return NextResponse.json({
      active: false,
      plan: null,
      currentPeriodEnd: null,
      cancelAtPeriodEnd: false,
      trialEnd: null,
    });
  }

  const subscriptions = await stripe.subscriptions.list({
    customer: stripeCustomerId,
    status: "all",
    limit: 1,
  });

  const sub = subscriptions.data[0];
  if (!sub || (sub.status !== "active" && sub.status !== "trialing")) {
    return NextResponse.json({
      active: false,
      plan: null,
      currentPeriodEnd: null,
      cancelAtPeriodEnd: false,
      trialEnd: null,
    });
  }

  const periodEnd = sub.items.data[0]?.current_period_end;

  return NextResponse.json({
    active: true,
    plan: "AADM Pro",
    currentPeriodEnd: periodEnd
      ? new Date(periodEnd * 1000).toISOString()
      : null,
    cancelAtPeriodEnd: sub.cancel_at_period_end,
    trialEnd: sub.trial_end
      ? new Date(sub.trial_end * 1000).toISOString()
      : null,
  });
}

export async function POST() {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const priceId = process.env.STRIPE_PRICE_ID;
  if (!priceId) {
    return NextResponse.json(
      { error: "STRIPE_PRICE_ID not configured" },
      { status: 500 }
    );
  }

  const stripe = getStripe();
  const client = await clerkClient();
  const user = await client.users.getUser(userId);
  let stripeCustomerId = user.privateMetadata?.stripeCustomerId as string | undefined;

  if (!stripeCustomerId) {
    const customer = await stripe.customers.create({
      email: user.emailAddresses[0]?.emailAddress,
      metadata: { clerkUserId: userId },
    });
    stripeCustomerId = customer.id;
    await client.users.updateUserMetadata(userId, {
      privateMetadata: { stripeCustomerId },
    });
  }

  const session = await stripe.checkout.sessions.create({
    customer: stripeCustomerId,
    mode: "subscription",
    line_items: [{ price: priceId, quantity: 1 }],
    subscription_data: {
      trial_period_days: 7,
    },
    success_url: `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/subscription?success=true`,
    cancel_url: `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/subscription?canceled=true`,
  });

  return NextResponse.json({ url: session.url });
}
