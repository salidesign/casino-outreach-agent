import { z } from "zod";

export const ProjectConfigSchema = z.object({
  name: z.string().min(1),
  website: z.string().url(),
  topics: z.array(z.string()).default([])
});

export type ProjectConfig = z.infer<typeof ProjectConfigSchema>;

export type OpportunityDecision = {
  relevant: boolean;
  relevanceScore: number;
  policyScore: number;
  riskScore: number;
  reason: string;
};
