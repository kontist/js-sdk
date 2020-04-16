import { Client } from "../lib";
import {
  Transaction,
  TransactionProjectionType,
  Transfer,
  TransferStatus,
} from "../lib/graphql/schema";

export const clientId = "26990216-e340-4f54-b5a5-df9baacc0440";
export const redirectUri = "https://localhost:3000/auth/callback";
export const scopes = ["transactions"];
export const state = "25843739712322056";

export const createClient = (opts = {}) => {
  return new Client({
    clientId,
    redirectUri,
    scopes,
    state,
    ...opts,
  });
};

export const createTransaction = (
  override: Record<string, any> = {},
): Transaction => {
  return {
    amount: parseInt((Math.random() * 100).toString(), 10),
    bookingDate: new Date(),
    directDebitFees: [],
    fees: [],
    id: Math.random.toString(),
    paymentMethod: "card",
    type: TransactionProjectionType.Atm,
    splits: [],
    ...override,
  };
};

export const createTransfer = (
  override: Record<string, any> = {},
): Transfer => {
  return {
    amount: parseInt((Math.random() * 100).toString(), 10),
    e2eId: "some-e2e-id",
    executeAt: null,
    iban: "DE32110101001000000029",
    id: Math.random.toString(),
    lastExecutionDate: null,
    nextOccurrence: null,
    purpose: "some transfer purpose",
    recipient: "John Doe",
    reoccurrence: null,
    status: TransferStatus.Confirmed,
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
