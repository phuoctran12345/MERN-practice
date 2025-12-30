import { create } from "zustand";
import { loadStripe, Stripe } from "@stripe/stripe-js";

/**
 * Config Store - Quản lý cấu hình hệ thống
 * Chứa các config như Stripe, API endpoints, etc.
 */
interface ConfigState {
  stripePromise: Promise<Stripe | null> | null;
  initializeStripe: (publishableKey: string) => void;
}

const STRIPE_PUB_KEY = import.meta.env.VITE_STRIPE_PUB_KEY || "";

export const useConfigStore = create<ConfigState>((set) => ({
  stripePromise: STRIPE_PUB_KEY ? loadStripe(STRIPE_PUB_KEY) : null,

  initializeStripe: (publishableKey: string) => {
    set({ stripePromise: loadStripe(publishableKey) });
  },
}));

