import { ObjectId } from "mongodb";

export type FormData = {
  siteTitle: string;
  metaDescription: string;
  siteKeywords: string;
  semanticCore: string;
};

export type SiteSettings = {
  _id: ObjectId | string;
  siteKeywords: string[];
  semanticCore: string[];
  metaDescription: string;
  siteTitle: string;
  updatedAt: string;
};
