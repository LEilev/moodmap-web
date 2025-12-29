/** @type {import('next').NextConfig} */
const nextConfig = {
  async redirects() {
    return [
      // ---------------------------------------------------------------------
      // SUPPORT (Apple-approved static support.html)
      // Canonicalize all support variants to /support.html
      // ---------------------------------------------------------------------
      {
        source: "/support",
        destination: "/support.html",
        permanent: true,
      },
      {
        source: "/support/",
        destination: "/support.html",
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
      // Convenience
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
      // Support both endpoints: /api/version and /api/version.json
      { source: "/api/version.json", destination: "/api/version" },
    ];
  },

  async headers() {
    return [
      // ✅ Version endpoint caching (CDN)
      // This prevents hammering Apple lookup and keeps response fast.
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

      // Apple association content-type rule (belt + suspenders)
      {
        source: "/.well-known/apple-app-site-association",
        headers: [{ key: "Content-Type", value: "application/json" }],
      },
    ];
  },
};

export default nextConfig;
