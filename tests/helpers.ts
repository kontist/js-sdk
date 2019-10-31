import { TransactionProjectionType, Transaction } from "../lib/graphql/schema";
import { Client } from "../lib";

export const createClient = () => {
  const clientId = "26990216-e340-4f54-b5a5-df9baacc0440";
  const redirectUri = "https://localhost:3000/auth/callback";
  const scopes = ["transactions"];
  const state = "25843739712322056";

  return new Client({
    clientId,
    redirectUri,
    scopes,
    state
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
