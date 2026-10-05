import { Queue } from "bullmq";
import { redis } from "./redis.js";
import type { JobPayload, JobType } from "./types.js";

export const pipelineQueue = new Queue<JobPayload & { type: JobType }>("outreach-pipeline", {
  connection: redis
});

export async function enqueuePipeline(type: JobType, payload: JobPayload) {
  return pipelineQueue.add(type, { ...payload, type }, {
    attempts: 3,
    backoff: { type: "exponential", delay: 2000 },
    removeOnComplete: 100,
    removeOnFail: 100
  });
}
