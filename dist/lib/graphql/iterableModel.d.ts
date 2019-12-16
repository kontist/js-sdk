import { Model } from "./model";
import { FetchOptions } from "./types";
export declare abstract class IterableModel<ModelType, FetchOptionsType = FetchOptions> extends Model<ModelType, FetchOptionsType> {
    createAsyncIterator(args: FetchOptionsType): {
        next: () => Promise<{
            done: boolean;
            value: ModelType | undefined;
        }>;
    };
    fetchAll(args: FetchOptionsType): {
        [Symbol.asyncIterator](): {
            next: () => Promise<{
                done: boolean;
                value: ModelType | undefined;
            }>;
        };
    };
}
