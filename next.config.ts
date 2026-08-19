import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts");

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  images: {
    formats: ["image/avif", "image/webp"],
    remotePatterns: [
      { protocol: "https", hostname: "images.pexels.com", pathname: "/photos/**" },
    ],
  },
  experimental: {
    // `framer-motion` is already tree-shakeable, and forcing package-import
    // optimization here breaks Webpack vendor chunk generation in Next 15 dev.
    optimizePackageImports: ["lucide-react"],
  },
};

export default withNextIntl(nextConfig);
