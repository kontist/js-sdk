import { Card as CardModel, CardSettings } from "./schema";
import { Model } from "./model";
import { ResultPage } from "./resultPage";
import { GetCardOptions, ActivateCardOptions, ChangeCardPINOptions, ConfirmChangeCardPINOptions, ChangeCardStatusOptions, CreateCardOptions, UpdateCardSettingsOptions } from "./types";
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
     * @param args  query parameters including card id and / or type
     * @returns     details of the card specified in query parameters
     */
    get(args: GetCardOptions): Promise<CardModel | null>;
    /**
     * Returns limits of a specific card belonging to the current user
     *
     * @param args  query parameters including card id and / or type
     * @returns     limits of the card
     */
    getLimits(args: GetCardOptions): Promise<CardSettings | null>;
    /**
     * Creates a card
     *
     * @param args   query parameters including cardType
     * @returns      the newly created card details
     */
    create(args: CreateCardOptions): Promise<CardModel>;
    /**
     * Activates a card
     *
     * @param args  query parameters including card id and verificationToken
     * @returns     activated card details
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
     * @returns      updated card details
     */
    changeStatus(args: ChangeCardStatusOptions): Promise<CardModel>;
    /**
     * Update settings for a card
     *
     * @param args   query parameters including card id, contactlessEnabled, cardPresentLimits and cardNotPresentLimits
     * @returns      updated card settings
     */
    updateSettings(args: UpdateCardSettingsOptions): Promise<CardSettings>;
}
