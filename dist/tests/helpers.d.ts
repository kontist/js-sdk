import { Transaction, Transfer } from "../lib/graphql/schema";
import { Client } from "../lib";
export declare const clientId = "26990216-e340-4f54-b5a5-df9baacc0440";
export declare const redirectUri = "https://localhost:3000/auth/callback";
export declare const scopes: string[];
export declare const state = "25843739712322056";
export declare const createClient: (opts?: {}) => Client;
export declare const createTransaction: () => Transaction;
export declare const createTransfer: (override?: Record<string, any>) => Transfer;
export declare const generatePaginatedResponse: ({ key, items, pageInfo }: {
    key: "transactions" | "transfers";
    items: (Transaction | Transfer)[];
    pageInfo: {
        hasNextPage: boolean;
        hasPreviousPage: boolean;
    };
}) => {
    viewer: {
        mainAccount: {
            [x: string]: {
                edges: {
                    node: Transaction | Transfer;
                    cursor: string;
                }[];
                pageInfo: {
                    hasNextPage: boolean;
                    hasPreviousPage: boolean;
                    startCursor: string;
                    endCursor: string;
                };
            };
        };
    };
};
