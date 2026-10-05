import type { SearchProvider, SearchResult } from "./types.js";

export class HttpSearchProvider implements SearchProvider {
  async search(query: string, limit = 10): Promise<SearchResult[]> {
    const endpoint = process.env.SEARCH_API_URL;
    const apiKey = process.env.SEARCH_API_KEY;

    if (!endpoint || !apiKey) {
      throw new Error("SEARCH_API_URL and SEARCH_API_KEY are required");
    }

    const url = new URL(endpoint);
    url.searchParams.set("q", query);
    url.searchParams.set("limit", String(limit));

    const response = await fetch(url, {
      headers: { Authorization: `Bearer ${apiKey}`, Accept: "application/json" }
    });

    if (!response.ok) {
      throw new Error(`Search provider returned ${response.status}`);
    }

    const data = await response.json() as {
      results?: Array<{ url?: string; title?: string; snippet?: string; source?: string }>;
    };

    return (data.results ?? [])
      .filter((item) => item.url && item.title)
      .map((item) => ({
        url: item.url!,
        title: item.title!,
        snippet: item.snippet,
        source: item.source
      }));
  }
}
