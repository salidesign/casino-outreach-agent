export type JobType = "DISCOVERY" | "POLICY" | "SCORING" | "CONTENT";

export type JobPayload = {
  projectId?: string;
  opportunityId?: string;
  topics?: string[];
};
