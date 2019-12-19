import { Card as CardModel } from "./schema";
import { Model } from "./model";
import { ResultPage } from "./resultPage";
import { GetCardOptions, ActivateCardOptions, ChangeCardPINOptions, ConfirmChangeCardPINOptions, ChangeCardStatusOptions } from "./types";
export declare class Card extends Model<CardModel> {
    /**
     * Fetches all cards belonging to the current user
     *
     * @returns     result page
     */
    fetch(): Promise<ResultPage<CardModel>>;
    /**
     * Returns details of a specific card belonging to the current user
     *
     * @param args  query parameters
     * @returns     details of the card specified in query parameters
     */
    get(args: GetCardOptions): Promise<CardModel | null>;
    /**
     * Activates a card
     *
     * @param args  query parameters including card id and verificationToken
     * @returns     activated card
     */
    activate(args: ActivateCardOptions): Promise<CardModel>;
    /**
     * Initiates a change of PIN number for a given card
     *
     * @param args   query parameters including card id and PIN number
     * @returns      confirmation id used to confirm the PIN change
     */
    changePIN(args: ChangeCardPINOptions): Promise<string>;
    /**
     * Confirms a requested PIN number change
     *
     * @param args   query parameters including card id and PIN number
     * @returns      PIN number change status
     */
    confirmChangePIN(args: ConfirmChangeCardPINOptions): Promise<string>;
    /**
     * Change a card status
     *
     * @param args   query parameters including card id and action
     * @returns      updated card
     */
    changeStatus(args: ChangeCardStatusOptions): Promise<CardModel>;
}
