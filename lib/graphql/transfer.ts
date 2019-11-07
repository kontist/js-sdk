import {
  CreateTransferInput,
  Transfer as TransferEntry,
  BatchTransfer,
  CreateConfirmationResult,
  StandingOrder,
  TimedOrder
} from "./schema";
import { Model } from "./model";
import { FetchOptions } from "./types";
import { ResultPage } from "./resultPage";

const CREATE_TRANSFER = `mutation createTransfer($transfer: CreateTransferInput!) {
  createTransfer(transfer: $transfer) {
    confirmationId
  }
}`;

const CONFIRM_TRANSFER = `mutation confirmTransfer(
  $confirmationId: String!
  $authorizationToken: String!
) {
  confirmTransfer(
    confirmationId: $confirmationId
    authorizationToken: $authorizationToken
  ) {
    id
    recipient
    iban
    amount
    status
    executeAt
    lastExecutionDate
    purpose
    e2eId
    reoccurrence
    nextOccurrence
  }
}`;

const CREATE_TRANSFERS = `mutation($transfers: [CreateSepaTransferInput!]!) {
  createTransfers(transfers: $transfers) {
    confirmationId
  }
}`;

const CONFIRM_TRANSFERS = `mutation confirmTransfer(
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

const CANCEL_STANDING_ORDER = `mutation cancelStandingOrder($id: String!) {
  cancelStandingOrder(id: $id) {
    confirmationId
  }
}`;

const CONFIRM_CANCEL_STANDING_ORDER = `mutation confirmCancelStandingOrder(
  $confirmationId: String!
  $authorizationToken: String!
) {
  confirmCancelStandingOrder(
    confirmationId: $confirmationId
    authorizationToken: $authorizationToken
  ) {
    id
    recipient
    iban
    amount
    status
    executeAt
    lastExecutionDate
    purpose
    e2eId
    reoccurrence
    nextOccurrence
  }
}`;

const CANCEL_TIMED_ORDER = `mutation cancelTimedOrder($id: String!) {
  cancelTimedOrder(id: $id) {
    id
    status
    iban
    recipient
    purpose
    amount
    executeAt
  }
}`;

export class Transfer extends Model<CreateTransferInput> {
  /**
   * Creates single wire transfer / timed order / standing order
   *
   * @param transfer  transfer data including at least recipient, IBAN and amount
   * @returns         confirmation id used to confirm the transfer
   */
  async createOne(transfer: CreateTransferInput): Promise<string> {
    const result = await this.client.rawQuery(CREATE_TRANSFER, { transfer });
    return result.createTransfer.confirmationId;
  }

  /**
   * Creates single wire transfer / timed order / standing order
   *
   * @param confirmationId      confirmation id obtained as a result of `transfer.createOne` call
   * @param authorizationToken  sms token
   * @returns                   confirmed wire transfer
   */
  async confirmOne(
    confirmationId: string,
    authorizationToken: string
  ): Promise<CreateConfirmationResult> {
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

  /**
   * Cancel standing order
   *
   * @param id        standing order id
   * @returns         confirmation id used to confirm the cancellation
   */
  async cancelStandingOrder(id: string): Promise<string> {
    const result = await this.client.rawQuery(CANCEL_STANDING_ORDER, { id });
    return result.cancelStandingOrder.confirmationId;
  }

  /**
   * Confirm standing order cancellation
   *
   * @param confirmationId      confirmation id obtained as a result of `transfer.cancelStandingOrder` call
   * @param authorizationToken  sms token
   * @returns                   canceled standing order
   */
  async confirmCancelStandingOrder(
    confirmationId: string,
    authorizationToken: string
  ): Promise<StandingOrder> {
    const result = await this.client.rawQuery(CONFIRM_CANCEL_STANDING_ORDER, {
      confirmationId,
      authorizationToken
    });
    return result.confirmCancelStandingOrder;
  }

  /**
   * Cancel timed order
   *
   * @param id        timed order id
   * @returns         canceled timed order
   */
  async cancelTimedOrder(id: string): Promise<TimedOrder> {
    const result = await this.client.rawQuery(CANCEL_TIMED_ORDER, { id });
    return result.cancelTimedOrder;
  }

  async fetch(args?: FetchOptions): Promise<ResultPage<TransferEntry>> {
    throw new Error("not implemented yet");
  }
}
