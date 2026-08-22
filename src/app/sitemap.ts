import { MetadataRoute } from "next";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://arrehlah.com";

  const staticRoutes = [
    "",
    "/about",
    "/tours",
    "/destinations",
    "/umrah",
    "/hajj",
    "/visa",
    "/airport-transfers",
    "/travel-insurance",
    "/offers",
    "/contact",
    "/privacy",
    "/terms",
    "/refund-policy"
  ];

  const sitemapEntries: MetadataRoute.Sitemap = staticRoutes.map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date().toISOString(),
    changeFrequency: route === "" ? "daily" : "weekly",
    priority: route === "" ? 1.0 : (route.includes("terms") || route.includes("privacy") ? 0.5 : 0.8),
  }));

  return sitemapEntries;
}
