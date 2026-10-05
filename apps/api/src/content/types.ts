export type ContentBrief = {
  title: string;
  pageUrl: string;
  pageContext: string;
  policyNotes: string;
  projectName: string;
  projectWebsite: string;
  topics: string[];
};

export type GeneratedDraft = {
  body: string;
  includesLink: boolean;
  disclosureRequired: boolean;
};
