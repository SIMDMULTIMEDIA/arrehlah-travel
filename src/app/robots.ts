import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://arrehlah.com";

  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: [
        "/admin/",
        "/account/",
        "/auth/",
        "/api/",
        "/private/"
      ],
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
