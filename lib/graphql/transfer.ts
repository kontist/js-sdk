import { CreateTransferInput, Transfer as TransferEntry } from "./schema";
import { Model } from "./model";
import { FetchOptions } from "./types";
import { ResultPage } from "./resultPage";

export class Transfer extends Model<TransferEntry> {
  async create(transfer: CreateTransferInput): Promise<TransferEntry> {
    const query = `mutation {
      createTransfer(
        transfer: { 
          recipient: "${transfer.recipient}", 
          iban: "${transfer.iban}", 
          amount: ${transfer.amount}, 
          e2eId: "${transfer.e2eId}", 
          purpose: "${transfer.purpose}" 
        }
      ) {
        id
        status
        amount
        note
        iban
        e2eId
      }
    }`;

    const result = await this.client.rawQuery(query);
    return result.createTransfer;
  }

  async confirm(
    transferId: string,
    authorizationToken: string
  ): Promise<TransferEntry> {
    const query = `mutation {
        confirmTransfer(
        transferId: "${transferId}"
        authorizationToken: "${authorizationToken}"
      ) {
        status
        amount
        note
        id
        recipient
        iban
        e2eId
      }
    }`;

    const result = await this.client.rawQuery(query);
    return result.confirmTransfer;
  }

  async fetch(args?: FetchOptions): Promise<ResultPage<TransferEntry>> {
    throw new Error("not implemented yet");
  }
}
