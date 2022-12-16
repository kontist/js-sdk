import { IterableModel } from "./iterableModel";
import { ResultPage } from "./resultPage";
import {
  AccountTransfersArgs,
  BatchTransfer,
  ConfirmationRequestOrTransfer,
  CreateTransferInput,
  Query,
  Transfer as TransferModel,
  TransfersConnectionEdge,
  TransferSuggestion,
  TransferType,
  UnfinishedTransfer,
  UpdateTransferInput,
} from "./schema";

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
  category
  userSelectedBookingDate
  personalNote
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

const CREATE_TRANSFERS = `mutation createTransfers(
  $transfers: [CreateSepaTransferInput!]!
) {
  createTransfers(transfers: $transfers) {
    confirmationId
  }
}`;

const CONFIRM_TRANSFERS = `mutation confirmTransfers(
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

const FETCH_TRANSFERS = `
  query fetchTransfers(
    $type: TransferType!,
    $where: TransfersConnectionFilter,
    $first: Int,
    $last: Int,
    $after: String,
    $before: String
  ) {
    viewer {
      mainAccount {
      transfers(
        type: $type,
        where: $where,
        first: $first,
        last: $last,
        after: $after,
        before: $before
      ) {
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
  }
`;

const GET_TRANSFER_SUGGESTIONS = `
  query getTransferSuggestions {
    viewer {
      mainAccount {
        transferSuggestions {
          iban
          name
        }
      }
    }
  }
`;

const GET_UNFINISHED_TRANSFERS = `
  query getUnfinishedTransfers {
    viewer {
      unfinishedTransfers {
        amount
        recipient
        iban
        purpose
      }
    }
  }
`;

const UPDATE_TRANSFER = `mutation updateTransfer($transfer: UpdateTransferInput!) {
  updateTransfer(transfer: $transfer) {
    ... on ConfirmationRequest {
      confirmationId
    }

    ... on Transfer {
      ${TRANSFER_FIELDS}
    }
  }
}`;

export class Transfer extends IterableModel<
  TransferModel,
  AccountTransfersArgs
> {
  /**
   * Creates single wire transfer / timed order / standing order
   *
   * @param transfer  transfer data including at least recipient, IBAN and amount
   * @returns         confirmation id used to confirm the transfer
   */
  public async createOne(transfer: CreateTransferInput): Promise<string> {
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
  public async confirmOne(
    confirmationId: string,
    authorizationToken: string,
  ): Promise<TransferModel> {
    const result = await this.client.rawQuery(CONFIRM_TRANSFER, {
      authorizationToken,
      confirmationId,
    });
    return result.confirmTransfer;
  }

  /**
   * Creates multiple wire transfers which can be later confirmed with single `authorizationToken`
   *
   * @param transfers   array of transfers data including at least recipient, IBAN and amount
   * @returns           confirmation id used to confirm the transfer
   */
  public async createMany(transfers: CreateTransferInput[]): Promise<string> {
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
  public async confirmMany(
    confirmationId: string,
    authorizationToken: string,
  ): Promise<BatchTransfer> {
    const result = await this.client.rawQuery(CONFIRM_TRANSFERS, {
      authorizationToken,
      confirmationId,
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
  public async cancelTransfer(
    type: TransferType,
    id: string,
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
  public async confirmCancelTransfer(
    type: TransferType,
    confirmationId: string,
    authorizationToken: string,
  ): Promise<TransferModel> {
    const result = await this.client.rawQuery(CONFIRM_CANCEL_TRANSFER, {
      authorizationToken,
      confirmationId,
      type,
    });
    return result.confirmCancelTransfer;
  }

  /**
   * Update a standing order
   *
   * @param transfer  transfer data including at least id and type. For Timed Orders and Sepa Transfers, only category and userSelectedBooking date can be updated
   * @returns         confirmation id used to confirm the update of Standing order or Transfer for Sepa Transfer / Timed Order
   */
  public async update(transfer: UpdateTransferInput): Promise<ConfirmationRequestOrTransfer> {
    const result = await this.client.rawQuery(UPDATE_TRANSFER, { transfer });
    return result.updateTransfer;
  }

  /**
   * Fetches first 50 transfers of provided type which match the query
   *
   * @param args  query parameters
   * @returns     result page
   */
  public async fetch(
    args: AccountTransfersArgs,
  ): Promise<ResultPage<TransferModel, AccountTransfersArgs>> {
    const result: Query = await this.client.rawQuery(FETCH_TRANSFERS, args);

    const transfers = (result.viewer?.mainAccount?.transfers?.edges ?? []).map(
      (edge: TransfersConnectionEdge) => edge.node,
    );

    const pageInfo = result.viewer?.mainAccount?.transfers?.pageInfo ?? {
      hasNextPage: false,
      hasPreviousPage: false,
    };
    return new ResultPage(this, transfers, pageInfo, args);
  }

  /**
   * Fetches a list of suggestions for wire transfer
   * recipients based on existing user's transactions
   *
   * @returns array of TransferSuggestion
   */
  public async suggestions(): Promise<TransferSuggestion[]> {
    const result: Query = await this.client.rawQuery(GET_TRANSFER_SUGGESTIONS);
    return result.viewer?.mainAccount?.transferSuggestions ?? [];
  }

  /**
   * Fetches a list of unfinished wire transfers
   *
   * @returns array of unfinished wire transfers
   */
  public async fetchUnfinished(): Promise<UnfinishedTransfer[]> {
    const result: Query = await this.client.rawQuery(GET_UNFINISHED_TRANSFERS);
    return result.viewer?.unfinishedTransfers ?? [];
  }
}
