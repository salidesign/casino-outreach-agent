import { randomUUID } from "node:crypto";
import type { JobPayload, JobType } from "./types.js";

type Job = { id:string; type:JobType; payload:JobPayload; createdAt:string };

const jobs: Job[] = [];

export function enqueue(type: JobType, payload: JobPayload) {
  const job={id:randomUUID(),type,payload,createdAt:new Date().toISOString()};
  jobs.push(job);
  return job;
}

export function listJobs() {
  return [...jobs].reverse();
}

export function dequeue() {
  return jobs.shift() ?? null;
}
