import { Query, Mutation } from "./schema";

export type FetchOptions = {
  first?: number;
  last?: number;
  before?: string | null;
  after?: string | null;
};

export type RawQueryResponse = Query & Mutation;
