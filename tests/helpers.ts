import {
  TransactionProjectionType,
  Transaction,
  Transfer,
  TransferStatus
} from "../lib/graphql/schema";
import { Client } from "../lib";

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
    ...opts
  });
};

export const createTransaction = (): Transaction => {
  return {
    id: Math.random.toString(),
    amount: parseInt((Math.random() * 100).toString()),
    directDebitFees: [],
    type: TransactionProjectionType.Atm,
    fees: [],
    bookingDate: new Date(),
    paymentMethod: "card"
  };
};

export const createTransfer = (
  override: Record<string, any> = {}
): Transfer => {
  return {
    id: Math.random.toString(),
    recipient: "John Doe",
    iban: "DE32110101001000000029",
    amount: parseInt((Math.random() * 100).toString()),
    status: TransferStatus.Confirmed,
    executeAt: null,
    lastExecutionDate: null,
    purpose: "some transfer purpose",
    e2eId: "some-e2e-id",
    reoccurrence: null,
    nextOccurrence: null,
    ...override
  };
};
