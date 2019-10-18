import { get } from "lodash";
import { GraphQLClient } from "./client";
import {
  Query,
  TransactionListItem,
  TransactionsConnectionEdge
} from "./schema";

export class Transaction {
  private client: GraphQLClient;

  constructor(graphqlClient: GraphQLClient) {
    this.client = graphqlClient;
  }

  public getAll = async (): Promise<Array<TransactionListItem>> => {
    const query = `{
      viewer {
          mainAccount {
            transactions {
              edges {
                node {
                  id
                  amount
                  name
                  iban
                  type
                  bookingDate
                  valutaDate
                  originalAmount
                  foreignCurrency
                  e2eId
                  mandateNumber
                  paymentMethod
                  category
                  userSelectedBookingDate
                  purpose
                  bookingType
                  invoiceNumber
                  invoicePreviewUrl
                  invoiceDownloadUrl
                  documentType
                }
              }
            }
          }
        }
      }`;

    const result: Query = await this.client.rawQuery(query);

    const transactions = get(
      result,
      "viewer.mainAccount.transactions.edges",
      []
    ).map((edge: TransactionsConnectionEdge) => edge.node);

    return transactions;
  };
}
