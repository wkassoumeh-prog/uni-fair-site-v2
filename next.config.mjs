/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config, { dev }) => {
    if (dev) {
      // Applies to `npm run dev` (webpack). Does NOT apply to `npm run dev:turbo` (Turbopack).
      // Mitigate intermittent errno -4094 UNKNOWN open on .next/* on Windows (watchpack / HMR races).
      // See https://github.com/vercel/next.js/issues/60628
      config.watchOptions = {
        ...config.watchOptions,
        poll: 1000,
        aggregateTimeout: 300,
      };
    }
    return config;
  },
};

export default nextConfig;
