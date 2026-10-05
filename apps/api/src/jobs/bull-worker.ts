import { Worker } from "bullmq";
import { redis } from "./redis.js";
import { runPipelineJob } from "./pipeline-worker.js";
import type { JobPayload, JobType } from "./types.js";

let worker: Worker | undefined;

export function startBullWorker() {
  if (worker) return worker;

  worker = new Worker<JobPayload & { type: JobType }>(
    "outreach-pipeline",
    async job => runPipelineJob(job.data.type, job.data),
    { connection: redis, concurrency: 2 }
  );

  worker.on("completed", job => console.log("[bull] completed", job.id, job.name));
  worker.on("failed", (job, error) => console.error("[bull] failed", job?.id, error));
  return worker;
}
