import { Query, Mutation, TransferType } from "./schema";

export type FetchOptions = {
  first?: number;
  last?: number;
  before?: string | null;
  after?: string | null;
  type?: TransferType;
};

export type RawQueryResponse = Query & Mutation;
