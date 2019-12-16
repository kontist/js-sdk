import { Transaction as TransactionModel } from "./schema";
import { IterableModel } from "./iterableModel";
import { FetchOptions, Subscription } from "./types";
import { ResultPage } from "./resultPage";
export declare const NEW_TRANSACTION_SUBSCRIPTION: string;
export declare class Transaction extends IterableModel<TransactionModel> {
    /**
     * Fetches first 50 transactions which match the query
     *
     * @param args  query parameters
     * @returns     result page
     */
    fetch(args?: FetchOptions): Promise<ResultPage<TransactionModel>>;
    /**
     * @inheritdoc
     */
    fetchAll(args?: FetchOptions): {
        [Symbol.asyncIterator](): {
            next: () => Promise<{
                done: boolean;
                value: TransactionModel | undefined;
            }>;
        };
    };
    subscribe(onNext: (event: TransactionModel) => any, onError?: (error: Error) => any): Subscription;
}
