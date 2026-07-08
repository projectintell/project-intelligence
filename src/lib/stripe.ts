import Stripe from 'stripe';

// Billing entity: Second City Assets Ltd (UK VAT registered — see
// build-decisions.md). Build/test on Stripe test mode keys; switch to
// live keys only right before public launch, alongside Vercel Pro.
export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-06-20',
});
