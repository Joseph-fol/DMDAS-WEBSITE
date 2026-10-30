import type { NextConfig } from "next";
import withSerwistInit from "@serwist/next";

const isVercelBuild = process.env.VERCEL === "1";

const withSerwist = withSerwistInit({
  swSrc: "app/sw.ts",
  swDest: "public/sw.js",
  // Keep SW enabled locally, but disable during Vercel build where this plugin can fail.
  disable: isVercelBuild,
  reloadOnOnline: true,
});

const nextConfig: NextConfig = {
  output: "export",
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
};

export default withSerwist(nextConfig);