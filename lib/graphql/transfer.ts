import { IterableModel } from "./iterableModel";
import { ResultPage } from "./resultPage";
import {
  AccountTransfersArgs,
  BatchTransfer,
  ConfirmationRequest,
  ConfirmationRequestOrTransfer,
  CreateTransferInput,
  MutationCancelTransferArgs,
  MutationConfirmCancelTransferArgs,
  MutationCreateTransferArgs,
  MutationUpdateTransferArgs,
  Query,
  Transfer as TransferModel,
  TransfersConnectionEdge,
  TransferSuggestion,
  UnfinishedTransfer,
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
  reoccurrence
  nextOccurrence
  category
  userSelectedBookingDate
  personalNote
`;

const CREATE_TRANSFER = `mutation createTransfer(
  $transfer: CreateTransferInput!
  $deviceId: String
  $deliveryMethod: DeliveryMethod
) {
  createTransfer(
    transfer: $transfer
    deviceId: $deviceId
    deliveryMethod: $deliveryMethod
  ) {
    confirmationId
    stringToSign
  }
}`;

const CONFIRM_TRANSFER = `mutation confirmTransfer(
  $confirmationId: String!
  $authorizationToken: String
  $signature: String
  $deviceId: String
) {
  confirmTransfer(
    confirmationId: $confirmationId
    authorizationToken: $authorizationToken
    signature: $signature
    deviceId: $deviceId
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
    }
  }
}`;

const CANCEL_TRANSFER = `mutation cancelTransfer(
  $type: TransferType!,
  $id: String!,
  $deviceId: String,
  $deliveryMethod: DeliveryMethod
) {
  cancelTransfer(
    type: $type,
    id: $id,
    deviceId: $deviceId,
    deliveryMethod: $deliveryMethod
  ) {
    ... on ConfirmationRequest {
      confirmationId
      stringToSign
    }

    ... on Transfer {
      ${TRANSFER_FIELDS}
    }
  }
}`;

const CONFIRM_CANCEL_TRANSFER = `mutation confirmCancelTransfer(
  $type: TransferType!
  $confirmationId: String!
  $authorizationToken: String
  $deviceId: String
  $signature: String
) {
  confirmCancelTransfer(
    type: $type
    confirmationId: $confirmationId
    authorizationToken: $authorizationToken
    deviceId: $deviceId
    signature: $signature
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

const UPDATE_TRANSFER = `mutation updateTransfer(
  $transfer: UpdateTransferInput!
  $deviceId: String
  $deliveryMethod: DeliveryMethod
) {
  updateTransfer(
    transfer: $transfer
    deviceId: $deviceId
    deliveryMethod: $deliveryMethod
  ) {
    ... on ConfirmationRequest {
      confirmationId
      stringToSign
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
   * @param deviceId  device id used for device signing authorization
   * @param deliveryMethod  delivery method used for device signing / mobile number authorization
   * @returns         confirmation id and optional string to sign used to confirm the transfer
   */
  public async createOne({
    transfer,
    deviceId,
    deliveryMethod,
  }: MutationCreateTransferArgs): Promise<ConfirmationRequest> {
    const result = await this.client.rawQuery(CREATE_TRANSFER, {
      transfer,
      deviceId,
      deliveryMethod,
    });
    return result.createTransfer;
  }

  /**
   * Creates single wire transfer / timed order / standing order
   *
   * @param confirmationId      confirmation id obtained as a result of `transfer.createOne` call
   * @param authorizationToken  sms token
   * @param signature           signature of string to sign obtained as a result of `transfer.createOne` call
   * @param deviceId            device id used for device signing authorization
   * @returns                   confirmed wire transfer
   */
  public async confirmOne({
    confirmationId,
    authorizationToken,
    signature,
    deviceId,
  }: {
    confirmationId: string;
    authorizationToken?: string;
    signature?: string;
    deviceId?: string;
  }): Promise<TransferModel> {
    const result = await this.client.rawQuery(CONFIRM_TRANSFER, {
      authorizationToken,
      confirmationId,
      signature,
      deviceId,
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
    authorizationToken: string
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
   * @param deliveryMethod  delivery method used for device signing / mobile number authorization
   * @param deviceId  device id used for device signing authorization
   * @returns         confirmation id used to confirm the cancellation or transfer if confirmation is not needed
   */
  public async cancelTransfer({
    type,
    id,
    deliveryMethod,
    deviceId,
  }: MutationCancelTransferArgs): Promise<ConfirmationRequestOrTransfer> {
    const result = await this.client.rawQuery(CANCEL_TRANSFER, {
      type,
      id,
      deliveryMethod,
      deviceId,
    });
    return result.cancelTransfer;
  }

  /**
   * Confirm transfer cancellation
   *
   * @param type                transfer type
   * @param confirmationId      confirmation id obtained as a result of `transfer.cancelTransfer` call
   * @param authorizationToken  sms token
   * @param signature           signature of string to sign obtained as a result of `transfer.cancelTransfer` call
   * @param deviceId            device id used for device signing authorization
   * @returns                   canceled transfer
   */
  public async confirmCancelTransfer({
    type,
    confirmationId,
    authorizationToken,
    signature,
    deviceId,
  }: MutationConfirmCancelTransferArgs): Promise<TransferModel> {
    const result = await this.client.rawQuery(CONFIRM_CANCEL_TRANSFER, {
      authorizationToken,
      confirmationId,
      type,
      deviceId,
      signature,
    });
    return result.confirmCancelTransfer;
  }

  /**
   * Update a standing order
   *
   * @param transfer  transfer data including at least id and type. For Timed Orders and Sepa Transfers, only category and userSelectedBooking date can be updated
   * @param deviceId  device id used for device signing authorization
   * @param deliveryMethod  delivery method used for device signing / mobile number authorization
   * @returns         confirmation id used to confirm the update of Standing order or Transfer for Sepa Transfer / Timed Order
   */
  public async update({
    transfer,
    deliveryMethod,
    deviceId,
  }: MutationUpdateTransferArgs): Promise<ConfirmationRequestOrTransfer> {
    const result = await this.client.rawQuery(UPDATE_TRANSFER, {
      transfer,
      deliveryMethod,
      deviceId,
    });
    return result.updateTransfer;
  }

  /**
   * Fetches first 50 transfers of provided type which match the query
   *
   * @param args  query parameters
   * @returns     result page
   */
  public async fetch(
    args: AccountTransfersArgs
  ): Promise<ResultPage<TransferModel, AccountTransfersArgs>> {
    const result: Query = await this.client.rawQuery(FETCH_TRANSFERS, args);

    const transfers = (result.viewer?.mainAccount?.transfers?.edges ?? []).map(
      (edge: TransfersConnectionEdge) => edge.node
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
