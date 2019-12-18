import { Card as CardModel, Query } from "./schema";
import { Model } from "./model";
import { ResultPage } from "./resultPage";
import { CardOptions } from "./types";

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
  async get(args: CardOptions): Promise<CardModel | null> {
    const result: Query = await this.client.rawQuery(GET_CARD, args);
    return result.viewer.mainAccount?.card ?? null;
  }
}
