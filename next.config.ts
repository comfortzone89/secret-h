import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone", // critical for Docker/K8s
};

export default nextConfig;
