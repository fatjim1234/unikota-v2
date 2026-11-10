/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Next.js 16: instrumentation.ts is stable and enabled by default
  // (the old experimental.instrumentationHook flag was removed).
  async redirects() {
    return [
      // Brand pages moved from /products/<brand> to /brands/<brand>.
      // Permanent, so Google and old links transfer to the new address.
      {
        source: "/products/:brand(cili|wasabi|unisoft|aimishu|babylike|sumo)",
        destination: "/brands/:brand",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
