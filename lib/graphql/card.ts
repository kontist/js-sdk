import { Card as CardModel, Query } from "./schema";
import { Model } from "./model";
import { ResultPage } from "./resultPage";
import { KontistSDKError } from "../errors";
import { CardOptions } from "./types"


const CARD_FIELDS = `
  id
  status
  type
  canceledAt
  expirationDate
  orderedAt
  holder
  formattedExpirationDate
  maskedPan
  settings {
    contactlessEnabled
    cardNotPresentLimits {
      daily {
        maxAmountCents
        maxTransactions
      }
      monthly {
        maxAmountCents
        maxTransactions
      }
    }
    cardPresentLimits {
      daily {
        maxAmountCents
        maxTransactions
      }
      monthly {
        maxAmountCents
        maxTransactions
      }
    }
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
    $cardId: String,
    $type: CardType
  ) {
    viewer {
      mainAccount {
        card(
          filter: {
            cardId: $cardId,
            type: $type
          }
        ) {
          ${CARD_FIELDS}
        }
      }
    }
  }
`;

export class Card extends Model<CardModel> {
  async fetch(): Promise<ResultPage<CardModel>> {
    throw new KontistSDKError({
      message:
        "Card model does not implement fetch, please use the `get` method instead."
    });
  }

  /**
   * Returns details of all cards belonging to the current user
   *
   * @returns details of the cards
   */
  async getAll(): Promise<Array<CardModel> | null> {
    const result: Query = await this.client.rawQuery(GET_CARDS);
    return result.viewer.mainAccount?.cards ?? null;
  }

  /**
   * Returns details of a specific card belonging to the current user
   *
   * @param args  query parameters
   * @returns     details of the card specified in query parameters
   */
  async get(args: CardOptions): Promise<CardModel | null> {
    const result: Query = await this.client.rawQuery(GET_CARD, args);
    return result.viewer.mainAccount?.card ?? null;
  }
}
