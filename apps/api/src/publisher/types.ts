export type PublishRequest = {
  opportunityId: string;
  contentId: string;
};

export type PublishResult = {
  status: "PUBLISHED" | "FAILED";
  publishedUrl?: string;
  error?: string;
};

export interface Publisher {
  canPublish(url: string): Promise<boolean>;
  publish(url: string, body: string): Promise<PublishResult>;
}
