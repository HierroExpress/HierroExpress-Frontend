import type { NextConfig } from "next"; // configuración Next.JS

const nextConfig: NextConfig = {
  images: {
    domains: ["img.freepik.com"], // Permitir imágenes desde Freepik
  },
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
