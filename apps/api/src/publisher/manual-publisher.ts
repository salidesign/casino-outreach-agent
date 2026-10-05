import type { Publisher, PublishResult } from "./types.js";

export class ManualPublisher implements Publisher {
  async canPublish(_url: string): Promise<boolean> {
    return true;
  }

  async publish(_url: string, _body: string): Promise<PublishResult> {
    return {
      status: "FAILED",
      error: "Manual publisher is intentionally non-automated. Copy the approved draft to the destination and record the result."
    };
  }
}
