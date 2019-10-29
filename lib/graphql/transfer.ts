import {
  CreateTransferInput,
  Transfer as TransferEntry,
  BatchTransfer
} from "./schema";
import { Model } from "./model";
import { FetchOptions } from "./types";
import { ResultPage } from "./resultPage";

export class Transfer extends Model<TransferEntry> {
  async createOne(transfer: CreateTransferInput): Promise<TransferEntry> {
    const query = `mutation createTransfer($transfer: CreateTransferInput!) {
      createTransfer(transfer: $transfer) {
        id
        status
        amount
        purpose
        iban
        e2eId
      }
    }`;

    const result = await this.client.rawQuery(query, { transfer });
    return result.createTransfer;
  }

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

    const result = await this.client.rawQuery(query, {
      confirmationId,
      authorizationToken
    });
    return result.confirmTransfer;
  }

  async createMany(transfers: Array<CreateTransferInput>): Promise<string> {
    const query = `mutation createTransfers($transfers: [CreateTransferInput!]!) {
      createTransfers(transfers: $transfers) {
        confirmationId
      }
    }`;

    const result = await this.client.rawQuery(query, { transfers });
    return result.createTransfers.confirmationId;
  }

  async confirmMany(
    confirmationId: string,
    authorizationToken: string
  ): Promise<BatchTransfer> {
    const query = `mutation {
      confirmTransfers(
        confirmationId: "${confirmationId}"
        authorizationToken: "${authorizationToken}"
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

    const result = await this.client.rawQuery(query);
    return result.confirmTransfers;
  }

  async fetch(args?: FetchOptions): Promise<ResultPage<TransferEntry>> {
    throw new Error("not implemented yet");
  }
}
