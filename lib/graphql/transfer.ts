import {
  CreateTransferInput,
  Transfer as TransferEntry,
  BatchTransfer
} from "./schema";
import { Model } from "./model";
import { FetchOptions } from "./types";
import { ResultPage } from "./resultPage";
import {
  CREATE_TRANSFER,
  CONFIRM_TRANSFER,
  CREATE_TRANSFERS,
  CONFIRM_TRANSFERS
} from "./queries";

export class Transfer extends Model<TransferEntry> {
  /**
   * Creates single wire transfer
   *
   * @param transfer  transfer data including at least recipient, IBAN and amount
   * @returns         confirmation id used to confirm the transfer
   */
  async createOne(transfer: CreateTransferInput): Promise<string> {
    const result = await this.client.rawQuery(CREATE_TRANSFER, { transfer });
    return result.createTransfer.id;
  }

  /**
   * Confirms single transfer
   *
   * @param confirmationId      confirmation id obtained as a result of `transfer.createOne` call
   * @param authorizationToken  sms token
   * @returns                   confirmed wire transfer
   */
  async confirmOne(
    confirmationId: string,
    authorizationToken: string
  ): Promise<TransferEntry> {
    const result = await this.client.rawQuery(CONFIRM_TRANSFER, {
      confirmationId,
      authorizationToken
    });
    return result.confirmTransfer;
  }

  /**
   * Creates multiple wire transfers which can be later confirmed with single `authorizationToken`
   *
   * @param transfers   array of transfers data including at least recipient, IBAN and amount
   * @returns           confirmation id used to confirm the transfer
   */
  async createMany(transfers: Array<CreateTransferInput>): Promise<string> {
    const result = await this.client.rawQuery(CREATE_TRANSFERS, { transfers });
    return result.createTransfers.confirmationId;
  }

  /**
   * Confirms multiple transfers with single `authorizationToken`
   *
   * @param confirmationId      confirmation id obtained as a result of `transfer.createMany` call
   * @param authorizationToken  sms token
   * @returns                   batch transfer result
   */
  async confirmMany(
    confirmationId: string,
    authorizationToken: string
  ): Promise<BatchTransfer> {
    const result = await this.client.rawQuery(CONFIRM_TRANSFERS, {
      confirmationId,
      authorizationToken
    });
    return result.confirmTransfers;
  }

  async fetch(args?: FetchOptions): Promise<ResultPage<TransferEntry>> {
    throw new Error("not implemented yet");
  }
}
