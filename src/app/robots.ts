import type { MetadataRoute } from "next";
import { site } from "@/lib/content";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      { userAgent: "*", allow: "/" },
      {
        userAgent: [
          "GPTBot",
          "OAI-SearchBot",
          "ChatGPT-User",
          "ClaudeBot",
          "Claude-SearchBot",
          "Claude-User",
          "Google-Extended",
          "Applebot-Extended",
          "Meta-ExternalAgent",
          "Meta-ExternalFetcher",
          "PerplexityBot",
          "Perplexity-User",
          "CCBot",
          "Bytespider",
        ],
        disallow: "/",
      },
    ],
    sitemap: `${site.url}/sitemap.xml`,
  };
}
