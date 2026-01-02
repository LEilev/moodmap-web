/** @type {import('next').NextConfig} */
const nextConfig = {
  async redirects() {
    return [
      // ---------------------------------------------------------------------
      // SUPPORT (clean URL: /support)
      // - /support should NOT redirect (serve content)
      // - /support.html is legacy (Apple / old links) and should canonicalize to /support
      // ---------------------------------------------------------------------
      {
        source: "/support.html",
        destination: "/support",
        permanent: true,
      },
      {
        source: "/support.html/",
        destination: "/support",
        permanent: true,
      },
      {
        source: "/support/",
        destination: "/support",
        permanent: true,
      },

      // ---------------------------------------------------------------------
      // PRIVACY POLICY (legacy .html + trailing slash cleanup)
      // Keep these even if you don't use them internally anymore.
      // ---------------------------------------------------------------------
      {
        source: "/privacy-policy.html",
        destination: "/privacy-policy",
        permanent: true,
      },
      {
        source: "/privacy-policy/",
        destination: "/privacy-policy",
        permanent: true,
      },

      // ---------------------------------------------------------------------
      // Apple App Site Association (some crawlers hit root path)
      // ---------------------------------------------------------------------
      {
        source: "/apple-app-site-association",
        destination: "/.well-known/apple-app-site-association",
        permanent: true,
      },

      // ---------------------------------------------------------------------
      // Convenience aliases
      // ---------------------------------------------------------------------
      {
        source: "/llms",
        destination: "/llms.txt",
        permanent: true,
      },
      {
        source: "/robots",
        destination: "/robots.txt",
        permanent: true,
      },
      {
        source: "/sitemap",
        destination: "/sitemap.xml",
        permanent: true,
      },
    ];
  },

  async rewrites() {
    return [
      // ---------------------------------------------------------------------
      // Clean support URL:
      // Serve the static Apple-approved support.html at /support (URL stays /support).
      // ---------------------------------------------------------------------
      { source: "/support", destination: "/support.html" },

      // Support both endpoints: /api/version and /api/version.json
      { source: "/api/version.json", destination: "/api/version" },
    ];
  },

  async headers() {
    return [
      // ---------------------------------------------------------------------
      // Version endpoint caching (CDN)
      // Prevent hammering any upstream lookup; keep response fast.
      // ---------------------------------------------------------------------
      {
        source: "/api/version",
        headers: [
          {
            key: "Cache-Control",
            value:
              "public, max-age=0, s-maxage=7200, stale-while-revalidate=86400",
          },
        ],
      },
      {
        source: "/api/version.json",
        headers: [
          {
            key: "Cache-Control",
            value:
              "public, max-age=0, s-maxage=7200, stale-while-revalidate=86400",
          },
        ],
      },

      // ---------------------------------------------------------------------
      // Apple association JSON content-type (belt + suspenders)
      // ---------------------------------------------------------------------
      {
        source: "/.well-known/apple-app-site-association",
        headers: [{ key: "Content-Type", value: "application/json" }],
      },
      {
        source: "/apple-app-site-association",
        headers: [{ key: "Content-Type", value: "application/json" }],
      },
    ];
  },
};

export default nextConfig;
