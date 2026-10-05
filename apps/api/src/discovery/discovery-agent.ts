import { buildDiscoveryQueries } from "./queries.js";
import type { SearchProvider, SearchResult } from "./types.js";

function normalizeUrl(raw: string): string | null {
  try {
    const url = new URL(raw);
    if (!["http:", "https:"].includes(url.protocol)) return null;
    url.hash = "";
    return url.toString().replace(/\/$/, "");
  } catch {
    return null;
  }
}

export class DiscoveryAgent {
  constructor(private readonly searchProvider: SearchProvider) {}

  async discover(topics: string[], limitPerQuery = 10): Promise<SearchResult[]> {
    const queries = buildDiscoveryQueries(topics);
    const seen = new Set<string>();
    const results: SearchResult[] = [];

    for (const query of queries) {
      const found = await this.searchProvider.search(query, limitPerQuery);

      for (const result of found) {
        const url = normalizeUrl(result.url);
        if (!url || seen.has(url)) continue;

        seen.add(url);
        results.push({ ...result, url });
      }
    }

    return results;
  }
}
