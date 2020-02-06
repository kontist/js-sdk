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
} from "./schema";

import { Model } from "./model";
import { ResultPage } from "./resultPage";
import {
  GetCardOptions,
} from "./types";

const CARD_FIELDS = `
  id
  status
  type
  holder
  formattedExpirationDate
  maskedPan
  pinSet
  settings {
    contactlessEnabled
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

const GET_CARDS = `query {
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
            cardPresentLimits {
              ${CARD_LIMITS_FIELDS}
            }
            cardNotPresentLimits {
              ${CARD_LIMITS_FIELDS}
            }
          }
        }
      }
    }
  }
`;

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
  $contactlessEnabled: Boolean
  $cardPresentLimits: CardLimitsInput
  $cardNotPresentLimits: CardLimitsInput
) {
  updateCardSettings(
    settings: {
      contactlessEnabled: $contactlessEnabled
      cardPresentLimits: $cardPresentLimits
      cardNotPresentLimits: $cardNotPresentLimits
    }
    id: $id
  ) {
    contactlessEnabled
    cardNotPresentLimits {
      ${CARD_LIMITS_FIELDS}
    }
    cardPresentLimits {
      ${CARD_LIMITS_FIELDS}
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

export class Card extends Model<CardModel> {
  /**
   * Fetches all cards belonging to the current user
   *
   * @returns     result page
   */
  public async fetch(): Promise<ResultPage<CardModel>> {
    const result: Query = await this.client.rawQuery(GET_CARDS);

    const cards = result.viewer.mainAccount?.cards ?? [];

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
    return result.viewer.mainAccount?.card ?? null;
  }

  /**
   * Returns limits of a specific card belonging to the current user
   *
   * @param args  query parameters including card id and / or type
   * @returns     limits of the card
   */
  public async getLimits(args: GetCardOptions): Promise<CardSettings | null> {
    const result: Query = await this.client.rawQuery(GET_CARD_LIMITS, args);
    return result.viewer.mainAccount?.card?.settings ?? null;
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
  public async confirmChangePIN(args: MutationConfirmChangeCardPinArgs): Promise<string> {
    const result = await this.client.rawQuery(CONFIRM_CHANGE_CARD_PIN, args);
    return result.confirmChangeCardPIN.status;
  }

  /**
   * Change a card status
   *
   * @param args   query parameters including card id and action
   * @returns      updated card details
   */
  public async changeStatus(args: MutationChangeCardStatusArgs): Promise<CardModel> {
    const result = await this.client.rawQuery(CHANGE_CARD_STATUS, args);
    return result.changeCardStatus;
  }

  /**
   * Update settings for a card
   *
   * @param args   query parameters including card id, contactlessEnabled, cardPresentLimits and cardNotPresentLimits
   * @returns      updated card settings
   */
  public async updateSettings(args: MutationUpdateCardSettingsArgs["settings"] & Pick<MutationUpdateCardSettingsArgs, "id">): Promise<CardSettings> {
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
}
