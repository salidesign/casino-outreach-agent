import { dequeue } from "./queue.js";
import { runPipelineJob } from "./pipeline-worker.js";

let running=false;

export function startWorker() {
  if (running) return;
  running=true;

  setInterval(async () => {
    const job=dequeue();
    if (!job) return;

    try {
      const result=await runPipelineJob(job.type, job.payload);
      console.log("[worker] completed", job.type, job.id, result);
    } catch (error) {
      console.error("[worker] failed", job.type, job.id, error);
    }
  }, 1000);
}
