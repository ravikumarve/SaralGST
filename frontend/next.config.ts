import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Webpack forced via --webpack in dev script (package.json).
  // Turbopack has a known bug with Tailwind CSS v4 —
  // utility classes (p-16, px-16, flex, etc.) are not
  // generated on cold start under Turbopack.
};

export default nextConfig;
