// app/sw.ts
import { defaultCache } from "@serwist/next/worker";
import type { PrecacheEntry, SerwistGlobalConfig } from "serwist";
import { Serwist, NetworkFirst, NetworkOnly, ExpirationPlugin } from "serwist";

declare global {
  interface WorkerGlobalScope extends SerwistGlobalConfig {
    __SW_MANIFEST: (PrecacheEntry | string)[] | undefined;
  }
}

declare const self: ServiceWorkerGlobalScope;

const serwist = new Serwist({
  precacheEntries: self.__SW_MANIFEST,
  skipWaiting: true,
  clientsClaim: true,
  navigationPreload: false,
  runtimeCaching: [
    {
      matcher: ({ url }) =>
        url.pathname.startsWith("/api/transactions") ||
        url.pathname.startsWith("/api/paystack"),
      handler: new NetworkOnly(),
    },

    // Cache student dashboard & rep dashboard for offline access
    {
      matcher: ({ url }) =>
        url.pathname.includes("/dashboard") ||
        url.pathname.includes("/dashboard-rep"),
      handler: new NetworkFirst({
        cacheName: "dmdas-student-cache",
        plugins: [
          new ExpirationPlugin({
            maxAgeSeconds: 60 * 60 * 24 * 7, // 7 days retention
            maxEntries: 50,
          }),
        ],
      }),
    },
    ...defaultCache,
  ],
});

serwist.addEventListeners();
