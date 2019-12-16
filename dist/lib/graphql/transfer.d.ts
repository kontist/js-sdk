import { CreateTransferInput, Transfer as TransferModel, BatchTransfer, TransferType, ConfirmationRequestOrTransfer } from "./schema";
import { TransferFetchOptions } from "./types";
import { ResultPage } from "./resultPage";
import { IterableModel } from "./iterableModel";
export declare class Transfer extends IterableModel<TransferModel, TransferFetchOptions> {
    /**
     * Creates single wire transfer / timed order / standing order
     *
     * @param transfer  transfer data including at least recipient, IBAN and amount
     * @returns         confirmation id used to confirm the transfer
     */
    createOne(transfer: CreateTransferInput): Promise<string>;
    /**
     * Creates single wire transfer / timed order / standing order
     *
     * @param confirmationId      confirmation id obtained as a result of `transfer.createOne` call
     * @param authorizationToken  sms token
     * @returns                   confirmed wire transfer
     */
    confirmOne(confirmationId: string, authorizationToken: string): Promise<TransferModel>;
    /**
     * Creates multiple wire transfers which can be later confirmed with single `authorizationToken`
     *
     * @param transfers   array of transfers data including at least recipient, IBAN and amount
     * @returns           confirmation id used to confirm the transfer
     */
    createMany(transfers: Array<CreateTransferInput>): Promise<string>;
    /**
     * Confirms multiple transfers with single `authorizationToken`
     *
     * @param confirmationId      confirmation id obtained as a result of `transfer.createMany` call
     * @param authorizationToken  sms token
     * @returns                   batch transfer result
     */
    confirmMany(confirmationId: string, authorizationToken: string): Promise<BatchTransfer>;
    /**
     * Cancel transfer
     *
     * @param type      transfer type
     * @param id        transfer id
     * @returns         confirmation id used to confirm the cancellation or transfer if confirmation is not needed
     */
    cancelTransfer(type: TransferType, id: string): Promise<ConfirmationRequestOrTransfer>;
    /**
     * Confirm transfer cancellation
     *
     * @param type                transfer type
     * @param confirmationId      confirmation id obtained as a result of `transfer.cancelTransfer` call
     * @param authorizationToken  sms token
     * @returns                   canceled transfer
     */
    confirmCancelTransfer(type: TransferType, confirmationId: string, authorizationToken: string): Promise<TransferModel>;
    /**
     * Fetches first 50 transfers of provided type which match the query
     *
     * @param args  query parameters
     * @returns     result page
     */
    fetch(args: TransferFetchOptions): Promise<ResultPage<TransferModel, TransferFetchOptions>>;
}
