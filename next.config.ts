import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  webpack(config) {
    // Añadir configuración para importar SVG como componente React
    config.module.rules.push({
      test: /\.svg$/,
      use: ["@svgr/webpack"],
    });
    return config;
  },
};

export default nextConfig;
