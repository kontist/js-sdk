import {
  Transaction,
  TransactionProjectionType,
  TransactionSource,
  Transfer,
  TransferStatus,
} from "../lib/graphql/schema";

import { Client } from "../lib";
import { ClientOpts } from "../lib/types";

export const clientId = "26990216-e340-4f54-b5a5-df9baacc0440";
export const redirectUri = "https://localhost:3000/auth/callback";
export const scopes = ["transactions"];
export const state = "25843739712322056";

export const createClient = (opts: Partial<ClientOpts> = {}) => {
  return new Client({
    clientId,
    redirectUri,
    scopes,
    state,
    ...opts,
  });
};

export const createTransaction = (
  override: Record<string, any> = {}
): Transaction => {
  return {
    amount: parseInt((Math.random() * 100).toString(), 10),
    bookingDate: new Date(),
    directDebitFees: [],
    fees: [],
    id: Math.random().toString(),
    paymentMethod: "card",
    type: TransactionProjectionType.Atm,
    splits: [],
    assets: [],
    transactionAssets: [],
    createdAt: new Date(0).toISOString(),
    categorizationType: null,
    canBeRecategorized: true,
    description: "",
    source: TransactionSource.Solaris,
    ...override,
  };
};

export const createTransfer = (
  override: Record<string, any> = {}
): Transfer => {
  return {
    amount: parseInt((Math.random() * 100).toString(), 10),
    e2eId: "some-e2e-id",
    executeAt: null,
    iban: "DE32110101001000000029",
    id: Math.random().toString(),
    lastExecutionDate: null,
    nextOccurrence: null,
    purpose: "some transfer purpose",
    recipient: "John Doe",
    reoccurrence: null,
    status: TransferStatus.Confirmed,
    uuid: "123e4567-e89b-12d3-a456-426614174000",
    ...override,
  };
};

export const generatePaginatedResponse = ({
  key,
  items,
  pageInfo,
}: {
  key: "transactions" | "transfers";
  items: (Transaction | Transfer)[];
  pageInfo: { hasNextPage: boolean; hasPreviousPage: boolean };
}) => ({
  viewer: {
    mainAccount: {
      [key]: {
        edges: items.map((item) => ({
          cursor: "1234",
          node: item,
        })),
        pageInfo: {
          endCursor: "22222",
          startCursor: "111111",
          ...pageInfo,
        },
      },
    },
  },
});
