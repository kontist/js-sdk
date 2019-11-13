import {
  Query,
  TransactionsConnectionEdge,
  Transaction as TransactionEntry
} from "./schema";
import { IterableModel } from "./iterableModel";
import {
  FetchOptions,
  SubscriptionListeners,
  SubscriptionEvent,
  SubscriptionType
} from "./types";
import { ResultPage } from "./resultPage";

const TRANSACTION_FIELDS = `
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
  documentNumber
  documentPreviewUrl
  documentDownloadUrl
  documentType
`;

const FETCH_TRANSACTIONS = `query fetchTransactions ($first: Int, $last: Int, $after: String, $before: String) {
  viewer {
    mainAccount {
      transactions(first: $first, last: $last, after: $after, before: $before) {
        edges {
          node {
            ${TRANSACTION_FIELDS}
          }
        }
        pageInfo {
          hasNextPage
          hasPreviousPage
          startCursor
          endCursor
        }
      }
    }
  }
}`;

const SUBSCRIPTION_QUERIES = {
  newTransaction: `subscription {
    newTransaction {
      ${TRANSACTION_FIELDS}
    }
  }`
};

export class Transaction extends IterableModel<TransactionEntry> {
  private listeners: SubscriptionListeners = {};

  /**
   * Fetches first 50 transactions which match the query
   *
   * @param args  query parameters
   * @returns     result page
   */
  async fetch(args?: FetchOptions): Promise<ResultPage<TransactionEntry>> {
    const result: Query = await this.client.rawQuery(FETCH_TRANSACTIONS, args);

    const transactions = (result?.viewer?.mainAccount?.transactions?.edges ?? []).map((edge: TransactionsConnectionEdge) => edge.node);

    const pageInfo = result?.viewer?.mainAccount?.transactions?.pageInfo ?? { hasNextPage: false, hasPreviousPage: false};
    return new ResultPage(this, transactions, pageInfo);
  }

  /**
   * Add a listener to a GraphQL subscription topic
   *
   * @param type     the subscription topic to listen to
   * @param handler  the handler to be called when new data is received
   */
  public addEventListener(type: SubscriptionType, handler: Function) {
    if (!this.listeners[type] && SUBSCRIPTION_QUERIES[type]) {
      this.client.subscribe(
        SUBSCRIPTION_QUERIES[type],
        type,
        this.dispatchEvent.bind(this)
      );
      this.listeners[type] = [];
    }
    (this.listeners?.[type] ?? []).push(handler);
  }

  /**
   * Remove a listener to a GraphQL subscription topic
   *
   * @param type     the subscription topic to remove a listener from
   * @param handler  the handler to be removed
   */
  public removeEventListener(type: SubscriptionType, handler: Function) {
    if (!this.listeners[type]) {
      return;
    }

    this.listeners[type] = this.listeners[type].filter(
      listener => listener !== handler
    );

    if (this.listeners[type].length === 0) {
      this.client.unsubscribe(type);
      delete this.listeners[type];
    }
  }

  /**
   * Dispatch an event to all the listener of its type
   *
   * @param event  the subscription event to dispatch
   */
  private dispatchEvent(event: SubscriptionEvent) {
    (this.listeners?.[event.type] ?? []).forEach(listener => {
      listener(event);
    });
  }
}
