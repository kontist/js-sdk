import { CreateTransferInput, Transfer as TransferEntry } from "./schema";
import { Model } from "./model";

export class Transfer extends Model {
  async create(transfer: CreateTransferInput): Promise<TransferEntry> {
    const query = `mutation {
      createTransfer(
        transfer: { 
          recipient: "${transfer.recipient}", 
          iban: "${transfer.iban}", 
          amount: ${transfer.amount}, 
          e2eId: "${transfer.e2eId}", 
          note: "${transfer.note}" 
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
}
