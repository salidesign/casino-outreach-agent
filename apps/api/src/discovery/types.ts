export type SearchResult = {
  url: string;
  title: string;
  snippet?: string;
  source?: string;
};

export type DiscoveryQuery = {
  query: string;
  topic: string;
};

export interface SearchProvider {
  search(query: string, limit?: number): Promise<SearchResult[]>;
}
