import { Card as CardModel, Query } from "./schema";
import { Model } from "./model";
import { ResultPage } from "./resultPage";
import {
  GetCardOptions,
  ActivateCardOptions,
  ChangeCardPINOptions,
  ConfirmChangeCardPINOptions
} from "./types";

const CARD_FIELDS = `
  id
  status
  type
  holder
  formattedExpirationDate
  maskedPan
  settings {
    contactlessEnabled
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
  $confirmationId: String!
  $authorizationToken: String!
) {
  confirmChangeCardPIN(
    confirmationId: $confirmationId
    authorizationToken: $authorizationToken
  ) {
    status
  }
}`;

export class Card extends Model<CardModel> {
  /**
   * Fetches all cards belonging to the current user
   *
   * @returns     result page
   */
  async fetch(): Promise<ResultPage<CardModel>> {
    const result: Query = await this.client.rawQuery(GET_CARDS);

    const cards = result.viewer.mainAccount?.cards ?? [];

    // cards resolver is not paginated
    const pageInfo = {
      hasNextPage: false,
      hasPreviousPage: false
    };

    return new ResultPage(this, cards, pageInfo, {});
  }

  /**
   * Returns details of a specific card belonging to the current user
   *
   * @param args  query parameters
   * @returns     details of the card specified in query parameters
   */
  async get(args: GetCardOptions): Promise<CardModel | null> {
    const result: Query = await this.client.rawQuery(GET_CARD, args);
    return result.viewer.mainAccount?.card ?? null;
  }

  /**
   * Activates a card
   *
   * @param args  query parameters including cardId and verificationToken
   * @returns     activated card
   */
  async activate(args: ActivateCardOptions): Promise<CardModel> {
    const result = await this.client.rawQuery(ACTIVATE_CARD, args);
    return result.activateCard;
  }

  /**
   * Initiates a change of PIN number for a given card
   *
   * @param args   query parameters including cardId and PIN number
   * @returns      confirmation id used to confirm the PIN change
   */
  async changePIN(args: ChangeCardPINOptions): Promise<string> {
    const result = await this.client.rawQuery(CHANGE_CARD_PIN, args);
    return result.changeCardPIN.confirmationId;
  }

  /**
   * Confirms a requested PIN number change
   *
   * @param args   query parameters including cardId and PIN number
   * @returns      PIN number change status
   */
  async confirmChangePIN(args: ConfirmChangeCardPINOptions) {
    const result = await this.client.rawQuery(CONFIRM_CHANGE_CARD_PIN, args);
    return result.confirmChangeCardPIN.status;
  }
}
