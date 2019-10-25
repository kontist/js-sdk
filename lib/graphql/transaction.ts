import { get } from "lodash";
import {
  Query,
  Transaction as TransactionEntry,
  TransactionsConnectionEdge
} from "./schema";
import { Model } from "./model";

export class Transaction extends Model {
  async fetchAll(): Promise<Array<TransactionEntry>> {
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
  }
}
