import {
  Query,
  CreateTransferInput,
  Transfer as TransferModel,
  BatchTransfer,
  TransferType,
  TransfersConnectionEdge,
  ConfirmationRequestOrTransfer
} from "./schema";
import { TransferFetchOptions } from "./types";
import { ResultPage } from "./resultPage";
import { IterableModel } from "./iterableModel";

const TRANSFER_FIELDS = `
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
`;

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
    ${TRANSFER_FIELDS}
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

const CANCEL_TRANSFER = `mutation cancelTransfer($type: TransferType!, $id: String!) {
  cancelTransfer(type: $type, id: $id) {
    ... on ConfirmationRequest {
      confirmationId
    }

    ... on Transfer {
      ${TRANSFER_FIELDS}
    }
  }
}`;

const CONFIRM_CANCEL_TRANSFER = `mutation confirmCancelTransfer(
  $type: TransferType!
  $confirmationId: String!
  $authorizationToken: String!
) {
  confirmCancelTransfer(
    type: $type
    confirmationId: $confirmationId
    authorizationToken: $authorizationToken
  ) {
    ${TRANSFER_FIELDS}
  }
}`;

const FETCH_TRANSFERS = `query fetchTransfers ($type: TransferType!, $first: Int, $last: Int, $after: String, $before: String) {
  viewer {
    mainAccount {
      transfers(type: $type, first: $first, last: $last, after: $after, before: $before) {
        edges {
          node {
            ${TRANSFER_FIELDS}
          }
        }
        pageInfo {
          hasNextPage
          hasPreviousPage
          startCursor
          endCursor
        }
      }
    }
  }
}`;

export class Transfer extends IterableModel<
  TransferModel,
  TransferFetchOptions
> {
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
  ): Promise<TransferModel> {
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
   * Cancel transfer
   *
   * @param type      transfer type
   * @param id        transfer id
   * @returns         confirmation id used to confirm the cancellation or transfer if confirmation is not needed
   */
  async cancelTransfer(
    type: TransferType,
    id: string
  ): Promise<ConfirmationRequestOrTransfer> {
    const result = await this.client.rawQuery(CANCEL_TRANSFER, { type, id });
    return result.cancelTransfer;
  }

  /**
   * Confirm transfer cancellation
   *
   * @param type                transfer type
   * @param confirmationId      confirmation id obtained as a result of `transfer.cancelTransfer` call
   * @param authorizationToken  sms token
   * @returns                   canceled transfer
   */
  async confirmCancelTransfer(
    type: TransferType,
    confirmationId: string,
    authorizationToken: string
  ): Promise<TransferModel> {
    const result = await this.client.rawQuery(CONFIRM_CANCEL_TRANSFER, {
      type,
      confirmationId,
      authorizationToken
    });
    return result.confirmCancelTransfer;
  }

  /**
   * Fetches first 50 transfers of provided type which match the query
   *
   * @param args  query parameters
   * @returns     result page
   */
  async fetch(
    args: TransferFetchOptions
  ): Promise<ResultPage<TransferModel, TransferFetchOptions>> {
    const result: Query = await this.client.rawQuery(FETCH_TRANSFERS, args);

    const transfers = (result?.viewer?.mainAccount?.transfers?.edges ?? []).map(
      (edge: TransfersConnectionEdge) => edge.node
    );

    const pageInfo = result?.viewer?.mainAccount?.transfers?.pageInfo ?? {
      hasNextPage: false,
      hasPreviousPage: false
    };
    return new ResultPage(this, transfers, pageInfo, args);
  }
}
