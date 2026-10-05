import type { CrawlResult } from "./types.js";

export class PolicyCrawler {
  async crawl(url: string): Promise<CrawlResult> {
    const target = new URL(url);
    const robotsUrl = new URL("/robots.txt", target.origin);

    const robotsResponse = await fetch(robotsUrl, {
      headers: { "User-Agent": "CasinoOutreachAgent/0.1 (+compliant crawler)" }
    });

    const robotsText = robotsResponse.ok ? await robotsResponse.text() : "";
    const robotsAllowed = !robotsText
      .split("\n")
      .some((line) => /^disallow:\s*\/\s*$/i.test(line.trim()));

    if (!robotsAllowed) {
      throw new Error("robots.txt does not allow crawling this site");
    }

    const response = await fetch(url, {
      headers: {
        "User-Agent": "CasinoOutreachAgent/0.1 (+compliant crawler)",
        Accept: "text/html,application/xhtml+xml"
      }
    });

    if (!response.ok) throw new Error(`Page returned HTTP ${response.status}`);

    const html = await response.text();
    const title = html.match(/<title[^>]*>([\s\S]*?)<\/title>/i)?.[1]?.trim() ?? "";
    const text = html
      .replace(/<script[\s\S]*?<\/script>/gi, " ")
      .replace(/<style[\s\S]*?<\/style>/gi, " ")
      .replace(/<[^>]+>/g, " ")
      .replace(/\s+/g, " ")
      .trim();

    return { url, title, text, robotsAllowed: true };
  }
}
