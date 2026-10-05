import { dequeue } from "./queue.js";

let running=false;

export function startWorker() {
  if (running) return;
  running=true;

  setInterval(() => {
    const job=dequeue();
    if (!job) return;

    // Execution is intentionally separated from queueing.
    // Wire real agents here as the production worker evolves.
    console.log("[worker] processing", job.type, job.id);
  }, 1000);
}
