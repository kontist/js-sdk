import { Query, Mutation, TransferType } from "./schema";

export type FetchOptions = {
  first?: number;
  last?: number;
  before?: string | null;
  after?: string | null;
};

export type TransferFetchOptions = {
  type: TransferType;
} & FetchOptions;

export type RawQueryResponse = Query & Mutation;
