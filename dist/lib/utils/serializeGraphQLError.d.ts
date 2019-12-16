import { ErrorOpts } from "../errors";
declare type GraphQLAPIError = {
    response?: {
        errors?: [{
            message?: string;
            extensions?: {
                status?: number;
                type?: string;
            };
        }];
    };
};
export declare const serializeGraphQLError: (graphQLError: GraphQLAPIError) => ErrorOpts;
export {};
