import {
  CreateTransferInput,
  Transfer as TransferEntry,
  BatchTransfer
} from "./schema";
import { Model } from "./model";
import { FetchOptions } from "./types";
import { ResultPage } from "./resultPage";

export class Transfer extends Model<TransferEntry> {
  /**
   * Creates single wire transfer
   *
   * @param transfer  transfer data including at least recipient, IBAN and amount
   * @returns         confirmation id used to confirm the transfer
   */
  async createOne(transfer: CreateTransferInput): Promise<string> {
    const query = `mutation createTransfer($transfer: CreateTransferInput!) {
      createTransfer(transfer: $transfer) {
        id
      }
    }`;

    const result = await this.client.rawQuery(query, { transfer });
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
    const query = `mutation confirmTransfer(
      $confirmationId: String!
      $authorizationToken: String!
    ) {
      confirmTransfer(
        transferId: $confirmationId
        authorizationToken: $authorizationToken
      ) {
        id
        status
        amount
        purpose
        recipient
        iban
        e2eId
      }
    }`;

    const variables = {
      confirmationId,
      authorizationToken
    };
    const result = await this.client.rawQuery(query, variables);
    return result.confirmTransfer;
  }

  /**
   * Creates multiple wire transfers which can be later confirmed with single `authorizationToken`
   *
   * @param transfers   array of transfers data including at least recipient, IBAN and amount
   * @returns           confirmation id used to confirm the transfer
   */
  async createMany(transfers: Array<CreateTransferInput>): Promise<string> {
    const query = `mutation createTransfers($transfers: [CreateTransferInput!]!) {
      createTransfers(transfers: $transfers) {
        confirmationId
      }
    }`;

    const result = await this.client.rawQuery(query, { transfers });
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
    const query = `mutation confirmTransfer(
      $confirmationId: String!
      $authorizationToken: String!
    ) {
      confirmTransfers(
        confirmationId: $confirmationId
        authorizationToken: $authorizationToken
      ) {
        id
        status
        transfers {
          id
          status
          recipient
          iban
          purpose
          amount
          e2eId
        }
      }
    }`;

    const variables = {
      confirmationId,
      authorizationToken
    };
    const result = await this.client.rawQuery(query, variables);
    return result.confirmTransfers;
  }

  async fetch(args?: FetchOptions): Promise<ResultPage<TransferEntry>> {
    throw new Error("not implemented yet");
  }
}
