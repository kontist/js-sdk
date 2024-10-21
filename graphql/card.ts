import {
  Card as CardModel,
  CardSettings,
  MutationActivateCardArgs,
  MutationChangeCardPinArgs,
  MutationChangeCardStatusArgs,
  MutationConfirmChangeCardPinArgs,
  MutationCreateCardArgs,
  MutationReorderCardArgs,
  MutationReplaceCardArgs,
  MutationUpdateCardSettingsArgs,
  Query,
  GooglePayCardToken,
  MutationAddGooglePayCardTokenArgs,
  MutationDeleteGooglePayCardTokenArgs,
  WhitelistCardResponse,
  ConfirmFraudResponse,
  CardPinKey,
  MutationChangeCardPinEncryptedArgs,
  MutationChangeCardPinWithChangeRequestArgs,
} from "./schema";
import { Model } from "./model";
import { ResultPage } from "./resultPage";
import { GetCardOptions } from "./types";

const CARD_FIELDS = `
  id
  status
  type
  holder
  formattedExpirationDate
  maskedPan
  pinSet
  addedToApplePay
  newCardOrdered
  googlePayTokens {
    walletId
    tokenRefId
  }
`;

const CARD_LIMITS_FIELDS = `
  daily {
    maxAmountCents
    maxTransactions
  }
  monthly {
    maxAmountCents
    maxTransactions
  }
`;

const GET_CARDS = `query getCards {
  viewer {
    mainAccount {
      cards {
        ${CARD_FIELDS}
      }
    }
  }
}`;

const GET_CARD = `
  query getCard (
    $id: String,
    $type: CardType
  ) {
    viewer {
      mainAccount {
        card(
          filter: {
            id: $id,
            type: $type
          }
        ) {
          ${CARD_FIELDS}
        }
      }
    }
  }
`;

const GET_CARD_LIMITS = `
  query getCardLimits (
    $id: String,
    $type: CardType
  ) {
    viewer {
      mainAccount {
        card(
          filter: {
            id: $id,
            type: $type
          }
        ) {
          settings {
            cardSpendingLimits {
              atm {
                ${CARD_LIMITS_FIELDS}
              }
              purchase {
                ${CARD_LIMITS_FIELDS}
              }
            }
          }
        }
      }
    }
  }
`;

const GET_CARD_PIN_KEY = `
  query getCardPinKey (
    $id: String,
    $type: CardType
  ) {
    viewer {
      mainAccount {
        card(
          filter: {
            id: $id,
            type: $type
          }
        ) {
          pinKey {
            kid
            kty
            use
            alg
            n
            e
          }
        }
      }
    }
  }
`;

const CHANGE_CARD_PIN_ENCRYPTED = `mutation changeCardPINEncrypted(
  $id: String!
  $payload: ChangeCardPINEncryptedInput!
) {
  changeCardPINEncrypted(
    id: $id
    payload: $payload
  ) {
    ${CARD_FIELDS}
  }
}`;

const CHANGE_CARD_PIN_WITH_CHANGE_REQUEST = `mutation changeCardPINWithChangeRequest(
  $id: String!,
  $payload: ChangeCardPINWithChangeRequestInput!
) {
  changeCardPINWithChangeRequest(
    id: $id,
    payload: $payload
  ) {
    confirmationId
  }
}`;

const CREATE_CARD = `mutation createCard(
  $type: CardType!,
  $cardHolderRepresentation: String
) {
  createCard(
    type: $type,
    cardHolderRepresentation: $cardHolderRepresentation
  ) {
    ${CARD_FIELDS}
  }
}`;

const ACTIVATE_CARD = `mutation activateCard(
  $id: String!
  $verificationToken: String!
) {
  activateCard(
    id: $id
    verificationToken: $verificationToken
  ) {
    ${CARD_FIELDS}
  }
}`;

const CHANGE_CARD_PIN = `mutation changeCardPIN(
  $id: String!
  $pin: String!
) {
  changeCardPIN(
    id: $id
    pin: $pin
  ) {
    confirmationId
  }
}`;

const CONFIRM_CHANGE_CARD_PIN = `mutation confirmChangeCardPIN(
  $id: String!
  $confirmationId: String!
  $authorizationToken: String!
) {
  confirmChangeCardPIN(
    id: $id
    confirmationId: $confirmationId
    authorizationToken: $authorizationToken
  ) {
    status
  }
}`;

const CHANGE_CARD_STATUS = `mutation changeCardStatus(
  $id: String!
  $action: CardAction!
) {
  changeCardStatus(
    id: $id
    action: $action
  ) {
    ${CARD_FIELDS}
  }
}`;

const UPDATE_CARD_SETTINGS = `mutation updateCardSettings(
  $id: String!
  $atmLimits: CardLimitsInput
  $purchaseLimits: CardLimitsInput
) {
  updateCardSettings(
    settings: {
      atmLimits: $atmLimits
      purchaseLimits: $purchaseLimits
    }
    id: $id
  ) {
    cardSpendingLimits {
      atm {
        ${CARD_LIMITS_FIELDS}
      }
      purchase {
        ${CARD_LIMITS_FIELDS}
      }
    }
  }
}`;

const REPLACE_CARD = `mutation replaceCard(
  $id: String!
) {
  replaceCard(
    id: $id
  ) {
    ${CARD_FIELDS}
  }
}`;

const REORDER_CARD = `mutation reorderCard(
  $id: String!
) {
  reorderCard(
    id: $id
  ) {
    ${CARD_FIELDS}
  }
}`;

export const SET_CARD_HOLDER_REPRESENTATION = `mutation setCardHolderRepresentation(
  $cardHolderRepresentation: String!
) {
  setCardHolderRepresentation(
    cardHolderRepresentation: $cardHolderRepresentation
  )
}`;

export const ADD_GOOGLE_PAY_CARD_TOKEN = `mutation(
  $id: String!,
  $walletId: String!
  $tokenRefId: String!
) {
  addGooglePayCardToken(
    id: $id,
    walletId: $walletId,
    tokenRefId: $tokenRefId
  ) {
    walletId
    tokenRefId
  }
}`;

export const DELETE_GOOGLE_PAY_CARD_TOKEN = `mutation(
  $id: String!,
  $walletId: String!
  $tokenRefId: String!
) {
  deleteGooglePayCardToken(
    id: $id,
    walletId: $walletId,
    tokenRefId: $tokenRefId
  ) {
    walletId
    tokenRefId
  }
}`;

export const WHITELIST_CARD = `mutation {
  whitelistCard {
    id
    resolution
    whitelistedUntil
  }
}`;

export const CONFIRM_FRAUD = `
mutation {
  confirmFraud {
    id
    resolution
  }
}`;

export class Card extends Model<CardModel> {
  /**
   * Fetches all cards belonging to the current user
   *
   * @returns     result page
   */
  public async fetch(): Promise<ResultPage<CardModel>> {
    const result: Query = await this.client.rawQuery(GET_CARDS);

    const cards = result.viewer?.mainAccount?.cards ?? [];

    // cards resolver is not paginated
    const pageInfo = {
      hasNextPage: false,
      hasPreviousPage: false,
    };

    return new ResultPage(this, cards, pageInfo, {});
  }

  /**
   * Returns details of a specific card belonging to the current user
   *
   * @param args  query parameters including card id and / or type
   * @returns     details of the card specified in query parameters
   */
  public async get(args: GetCardOptions): Promise<CardModel | null> {
    const result: Query = await this.client.rawQuery(GET_CARD, args);
    return result.viewer?.mainAccount?.card ?? null;
  }

  /**
   * Returns limits of a specific card belonging to the current user
   *
   * @param args  query parameters including card id and / or type
   * @returns     limits of the card
   */
  public async getLimits(args: GetCardOptions): Promise<CardSettings | null> {
    const result: Query = await this.client.rawQuery(GET_CARD_LIMITS, args);
    return result.viewer?.mainAccount?.card?.settings ?? null;
  }

  /**
   * Creates a card
   *
   * @param args   query parameters including card type
   * @returns      the newly created card details
   */
  public async create(args: MutationCreateCardArgs): Promise<CardModel> {
    const result = await this.client.rawQuery(CREATE_CARD, args);
    return result.createCard;
  }

  /**
   * Activates a card
   *
   * @param args  query parameters including card id and verificationToken
   * @returns     activated card details
   */
  public async activate(args: MutationActivateCardArgs): Promise<CardModel> {
    const result = await this.client.rawQuery(ACTIVATE_CARD, args);
    return result.activateCard;
  }

  /**
   * Returns PIN key of a card to use during encrypted PIN change
   *
   * @param args  query parameters including card id and / or type
   * @returns     PIN key of the card
   */
  public async getPinKey(args: GetCardOptions): Promise<CardPinKey | null> {
    const result: Query = await this.client.rawQuery(GET_CARD_PIN_KEY, args);
    return result.viewer?.mainAccount?.card?.pinKey ?? null;
  }

  /**
   * Encrypted change PIN number for a given card
   *
   * @param args   query parameters including card id and encrypted PIN number
   * @returns      updated card details
   */
  public async changePINEncrypted(
    args: MutationChangeCardPinEncryptedArgs
  ): Promise<CardModel> {
    const result = await this.client.rawQuery(CHANGE_CARD_PIN_ENCRYPTED, args);
    return result.changeCardPINEncrypted;
  }

  /**
   * Encrypted change PIN number for a given card with Change Request
   *
   * @param args   query parameters including card id and encrypted PIN number
   * @returns      confirmation id used to confirm the PIN change
   */
  public async changePINWithChangeRequest(
    args: MutationChangeCardPinWithChangeRequestArgs
  ): Promise<string> {
    const result = await this.client.rawQuery(
      CHANGE_CARD_PIN_WITH_CHANGE_REQUEST,
      args
    );
    return result.changeCardPINWithChangeRequest.confirmationId;
  }

  /**
   * Initiates a change of PIN number for a given card
   *
   * @param args   query parameters including card id and PIN number
   * @returns      confirmation id used to confirm the PIN change
   */
  public async changePIN(args: MutationChangeCardPinArgs): Promise<string> {
    const result = await this.client.rawQuery(CHANGE_CARD_PIN, args);
    return result.changeCardPIN.confirmationId;
  }

  /**
   * Confirms a requested PIN number change
   *
   * @param args   query parameters including card id and PIN number
   * @returns      PIN number change status
   */
  public async confirmChangePIN(
    args: MutationConfirmChangeCardPinArgs
  ): Promise<string> {
    const result = await this.client.rawQuery(CONFIRM_CHANGE_CARD_PIN, args);
    return result.confirmChangeCardPIN.status;
  }

  /**
   * Change a card status
   *
   * @param args   query parameters including card id and action
   * @returns      updated card details
   */
  public async changeStatus(
    args: MutationChangeCardStatusArgs
  ): Promise<CardModel> {
    const result = await this.client.rawQuery(CHANGE_CARD_STATUS, args);
    return result.changeCardStatus;
  }

  /**
   * Update settings for a card
   *
   * @param args   query parameters including card id, atm and purchase card limits
   * @returns      updated card settings
   */
  public async updateSettings(
    args: MutationUpdateCardSettingsArgs["settings"] &
      Pick<MutationUpdateCardSettingsArgs, "id">
  ): Promise<CardSettings> {
    const result = await this.client.rawQuery(UPDATE_CARD_SETTINGS, args);
    return result.updateCardSettings;
  }

  /**
   * Replace a card
   *
   * @param args   query parameters including card id
   * @returns      updated card details
   */
  public async replace(args: MutationReplaceCardArgs): Promise<CardModel> {
    const result = await this.client.rawQuery(REPLACE_CARD, args);
    return result.replaceCard;
  }

  /**
   * Reorder a card
   *
   * @param args   query parameters including card id
   * @returns      the newly created card details
   */
  public async reorder(args: MutationReorderCardArgs): Promise<CardModel> {
    const result = await this.client.rawQuery(REORDER_CARD, args);
    return result.reorderCard;
  }

  /**
   * Updates a customer's card holder representation
   *
   * @param cardHolderRepresentation   the card holder representation to set
   * @returns                          the updated card holder representation
   */
  public async setCardHolderRepresentation(
    cardHolderRepresentation: string
  ): Promise<string> {
    const result = await this.client.rawQuery(SET_CARD_HOLDER_REPRESENTATION, {
      cardHolderRepresentation,
    });
    return result.setCardHolderRepresentation;
  }

  /**
   * Adds Google Pay card token reference id for given wallet id
   *
   * @param args   query parameters including card id, Google Pay card token ref id and active wallet id
   * @returns      combination of Google Pay card token ref id and active wallet id
   */
  public async addGooglePayCardToken(
    args: MutationAddGooglePayCardTokenArgs
  ): Promise<GooglePayCardToken> {
    const result = await this.client.rawQuery(ADD_GOOGLE_PAY_CARD_TOKEN, args);
    return result.addGooglePayCardToken;
  }

  /**
   * Removes Google Pay card token reference id for given wallet id
   *
   * @param args   query parameters including card id, Google Pay card token ref id and active wallet id
   * @returns      combination of removed Google Pay card token ref id and active wallet id
   */
  public async deleteGooglePayCardToken(
    args: MutationDeleteGooglePayCardTokenArgs
  ): Promise<GooglePayCardToken> {
    const result = await this.client.rawQuery(
      DELETE_GOOGLE_PAY_CARD_TOKEN,
      args
    );
    return result.deleteGooglePayCardToken;
  }

  /**
   * Whitelist card fraud case
   *
   * @returns      case resolution and timestamp till when the case is whitelisted
   */
  public async whitelistCard(): Promise<WhitelistCardResponse> {
    const result = await this.client.rawQuery(WHITELIST_CARD);
    return result.whitelistCard;
  }

  /**
   * Confirm card fraud case
   *
   * @returns      case resolution
   */
  public async confirmFraud(): Promise<ConfirmFraudResponse> {
    const result = await this.client.rawQuery(CONFIRM_FRAUD);
    return result.confirmFraud;
  }
}
