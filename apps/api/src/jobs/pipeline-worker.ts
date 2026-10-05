import { PrismaClient } from "@prisma/client";
import { DiscoveryAgent } from "../discovery/discovery-agent.js";
import { HttpSearchProvider } from "../discovery/search-provider.js";
import { persistDiscovery } from "../discovery/persist.js";
import { analyzeOpportunityPolicy } from "../policy/service.js";
import { scoreOpportunityById } from "../scoring/service.js";
import { generateOpportunityContent } from "../content/service.js";
import type { JobPayload, JobType } from "./types.js";

const prisma = new PrismaClient();
const search = new HttpSearchProvider();

export async function runPipelineJob(type: JobType, payload: JobPayload) {
  if (type === "DISCOVERY") {
    if (!payload.projectId) throw new Error("projectId is required");
    const project = await prisma.project.findUnique({ where: { id: payload.projectId } });
    if (!project) throw new Error("project not found");

    const topics = payload.topics ?? (Array.isArray(project.topics)
      ? project.topics.filter((x): x is string => typeof x === "string")
      : []);

    const results = await new DiscoveryAgent(search).discover(topics);
    const saved = await persistDiscovery(prisma, project.id, results);
    return { discovered: results.length, saved };
  }

  if (!payload.opportunityId) throw new Error("opportunityId is required");

  if (type === "POLICY") return analyzeOpportunityPolicy(prisma, payload.opportunityId);
  if (type === "SCORING") return scoreOpportunityById(prisma, payload.opportunityId);
  if (type === "CONTENT") return generateOpportunityContent(prisma, payload.opportunityId);

  throw new Error(`unsupported job type: ${type}`);
}
