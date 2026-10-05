export function buildDiscoveryQueries(topics: string[]): string[] {
  const templates = [
    "${topic} forum discussion",
    "${topic} community forum",
    "${topic} review discussion",
    "${topic} poker discussion",
    "${topic} site recommendations",
    "${topic} tournament discussion"
  ];

  return [...new Set(
    topics.flatMap((topic) =>
      templates.map((template) => template.replace("${topic}", topic))
    )
  )];
}
