import {GraphQLClient} from "./client";
import {
  AuthorizeChangeRequestRespone,
  MutationAuthorizeChangeRequestArgs,
  MutationConfirmChangeRequestArgs,
  ConfirmChangeRequestRespone,
} from "./schema";

const AUTHORIZE_CHANGE_REQUEST = `mutation(
  $deviceId: String!,
  $changeRequestId: String!
) {
  authorizeChangeRequest(
    deviceId: $deviceId,
    changeRequestId: $changeRequestId
  ) {
    stringToSign
  }
}`;

const CONFIRM_CHANGE_REQUEST = `mutation(
  $deviceId: String!,
  $changeRequestId: String!
  $signature: String!
) {
  confirmChangeRequest(
    deviceId: $deviceId,
    changeRequestId: $changeRequestId
    signature: $signature
  ) {
    success
  }
}`;

export class ChangeRequest {
  constructor(protected client: GraphQLClient) {}

  /**
   * authorize change request
   *
   * @param args  query parameters
   * @returns     string to sign with device key
   */
  public async authorize(
    args: MutationAuthorizeChangeRequestArgs
  ): Promise<AuthorizeChangeRequestRespone> {
    const result = await this.client.rawQuery(AUTHORIZE_CHANGE_REQUEST, args);
    return result.authorizeChangeRequest;
  }

  /**
   * confirm change request
   *
   * @param args  query parameters
   * @returns     case resolution
   */
  public async confirm(
    args: MutationConfirmChangeRequestArgs
  ): Promise<ConfirmChangeRequestRespone> {
    const result = await this.client.rawQuery(CONFIRM_CHANGE_REQUEST, args);
    return result.confirmChangeRequest;
  }
}
