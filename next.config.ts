import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // The repo root is this folder, not the parent workspace.
  turbopack: { root: import.meta.dirname },
};

export default nextConfig;
