import type { NextConfig } from "next";
import withPWAInit from "next-pwa";

const withPWA = withPWAInit({
  dest: "public",
  disable: process.env.NODE_ENV === "development",
  register: true,
  skipWaiting: true,
  runtimeCaching: [
    {
      urlPattern: /.*\.(?:png|jpg|jpeg|svg|gif|webp|avif)/,
      handler: 'CacheFirst',
      options: {
        cacheName: 'images',
        expiration: {
          maxEntries: 60,
          maxAgeSeconds: 30 * 24 * 60 * 60,
        },
      },
    },
    {
      urlPattern: /.*\.(?:mp3|wav|ogg)/,
      handler: 'CacheFirst',
      options: {
        cacheName: 'audio',
        expiration: {
          maxEntries: 100,
          maxAgeSeconds: 30 * 24 * 60 * 60,
        },
      },
    },
    {
      urlPattern: /^https:\/\/assets\.mixkit\.co\/.*/i,
      handler: 'CacheFirst',
      options: {
        cacheName: 'external-assets',
        expiration: {
          maxEntries: 20,
          maxAgeSeconds: 24 * 60 * 60,
        },
      },
    },
    {
      urlPattern: /\/api\/.*/i,
      handler: 'NetworkFirst',
      options: {
        cacheName: 'api-calls',
        expiration: {
          maxEntries: 50,
          maxAgeSeconds: 60 * 60,
        },
        networkTimeoutSeconds: 5,
      },
    },
  ],
});

const nextConfig: NextConfig = {
  output: 'export',
  images: {
    unoptimized: true, // Required for static export
  },
  trailingSlash: true,
  turbopack: {},
};

export default withPWA(nextConfig);
