export type PolicyAnalysis = {
  allowsSelfPromotion: boolean;
  allowsExternalLinks: boolean;
  requiresDisclosure: boolean;
  requiresModerator: boolean;
  policyScore: number;
  riskScore: number;
  notes: string;
};

export type CrawlResult = {
  url: string;
  title: string;
  text: string;
  robotsAllowed: boolean;
};
