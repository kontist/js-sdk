export declare type Maybe<T> = T | null;
/** All built-in and custom scalars, mapped to their actual values */
export declare type Scalars = {
    ID: string;
    String: string;
    Boolean: boolean;
    Int: number;
    Float: number;
    /** The javascript `Date` as string. Type represents date and time as the ISO Date string. */
    DateTime: any;
};
/** The bank account of the current user */
export declare type Account = {
    __typename?: 'Account';
    iban: Scalars['String'];
    cardHolderRepresentation?: Maybe<Scalars['String']>;
    balance: Scalars['Int'];
    cardHolderRepresentations: Array<Scalars['String']>;
    transfers: TransfersConnection;
    transaction?: Maybe<Transaction>;
    transactions: TransactionsConnection;
    transfer?: Maybe<Transfer>;
    cards: Array<Card>;
    card?: Maybe<Card>;
};
/** The bank account of the current user */
export declare type AccountTransfersArgs = {
    where?: Maybe<TransfersConnectionFilter>;
    type: TransferType;
    first?: Maybe<Scalars['Int']>;
    last?: Maybe<Scalars['Int']>;
    after?: Maybe<Scalars['String']>;
    before?: Maybe<Scalars['String']>;
};
/** The bank account of the current user */
export declare type AccountTransactionArgs = {
    id: Scalars['ID'];
};
/** The bank account of the current user */
export declare type AccountTransactionsArgs = {
    first?: Maybe<Scalars['Int']>;
    last?: Maybe<Scalars['Int']>;
    after?: Maybe<Scalars['String']>;
    before?: Maybe<Scalars['String']>;
};
/** The bank account of the current user */
export declare type AccountTransferArgs = {
    id: Scalars['ID'];
    type: TransferType;
};
/** The bank account of the current user */
export declare type AccountCardArgs = {
    filter?: Maybe<CardFilter>;
};
export declare type BatchTransfer = {
    __typename?: 'BatchTransfer';
    id: Scalars['String'];
    status: BatchTransferStatus;
    transfers: Array<SepaTransfer>;
};
export declare enum BatchTransferStatus {
    AuthorizationRequired = "AUTHORIZATION_REQUIRED",
    ConfirmationRequired = "CONFIRMATION_REQUIRED",
    Accepted = "ACCEPTED",
    Failed = "FAILED",
    Successful = "SUCCESSFUL"
}
export declare type Card = {
    __typename?: 'Card';
    id: Scalars['String'];
    status: CardStatus;
    type: CardType;
    pinSet: Scalars['Boolean'];
    holder?: Maybe<Scalars['String']>;
    formattedExpirationDate?: Maybe<Scalars['String']>;
    maskedPan?: Maybe<Scalars['String']>;
    settings: CardSettings;
};
export declare enum CardAction {
    Close = "CLOSE",
    Block = "BLOCK",
    Unblock = "UNBLOCK"
}
export declare type CardFilter = {
    id?: Maybe<Scalars['String']>;
    type?: Maybe<CardType>;
};
export declare type CardLimit = {
    __typename?: 'CardLimit';
    maxAmountCents: Scalars['Float'];
    maxTransactions: Scalars['Float'];
};
export declare type CardLimitInput = {
    maxAmountCents: Scalars['Float'];
    maxTransactions: Scalars['Float'];
};
export declare type CardLimits = {
    __typename?: 'CardLimits';
    daily: CardLimit;
    monthly: CardLimit;
};
export declare type CardLimitsInput = {
    daily: CardLimitInput;
    monthly: CardLimitInput;
};
export declare type CardSettings = {
    __typename?: 'CardSettings';
    contactlessEnabled: Scalars['Boolean'];
    cardPresentLimits?: Maybe<CardLimits>;
    cardNotPresentLimits?: Maybe<CardLimits>;
};
export declare type CardSettingsInput = {
    cardPresentLimits?: Maybe<CardLimitsInput>;
    cardNotPresentLimits?: Maybe<CardLimitsInput>;
    contactlessEnabled?: Maybe<Scalars['Boolean']>;
};
export declare enum CardStatus {
    Processing = "PROCESSING",
    Inactive = "INACTIVE",
    Active = "ACTIVE",
    Blocked = "BLOCKED",
    BlockedBySolaris = "BLOCKED_BY_SOLARIS",
    ActivationBlockedBySolaris = "ACTIVATION_BLOCKED_BY_SOLARIS",
    Closed = "CLOSED",
    ClosedBySolaris = "CLOSED_BY_SOLARIS"
}
export declare enum CardType {
    VirtualVisaBusinessDebit = "VIRTUAL_VISA_BUSINESS_DEBIT",
    VisaBusinessDebit = "VISA_BUSINESS_DEBIT",
    MastercardBusinessDebit = "MASTERCARD_BUSINESS_DEBIT",
    VirtualMastercardBusinessDebit = "VIRTUAL_MASTERCARD_BUSINESS_DEBIT"
}
export declare type Client = {
    __typename?: 'Client';
    id: Scalars['ID'];
    /** The URL to redirect to after authentication */
    redirectUri?: Maybe<Scalars['String']>;
    /** The name of the OAuth2 client displayed when users log in */
    name: Scalars['String'];
    /** The grant types (i.e. ways to obtain access tokens) allowed for the client */
    grantTypes?: Maybe<Array<GrantType>>;
    /** The scopes the client has access to, limiting access to the corresponding parts of the API */
    scopes?: Maybe<Array<ScopeType>>;
};
export declare enum CompanyType {
    Selbstaendig = "SELBSTAENDIG",
    Einzelunternehmer = "EINZELUNTERNEHMER",
    Freiberufler = "FREIBERUFLER",
    Gewerbetreibender = "GEWERBETREIBENDER",
    Limited = "LIMITED",
    EK = "E_K",
    Partgg = "PARTGG",
    Gbr = "GBR",
    Ohg = "OHG",
    Kg = "KG",
    Kgaa = "KGAA",
    Gmbh = "GMBH",
    GmbhUndCoKg = "GMBH_UND_CO_KG",
    Ug = "UG"
}
export declare type ConfirmationRequest = {
    __typename?: 'ConfirmationRequest';
    confirmationId: Scalars['String'];
};
export declare type ConfirmationRequestOrTransfer = ConfirmationRequest | Transfer;
export declare type ConfirmationStatus = {
    __typename?: 'ConfirmationStatus';
    status: Scalars['String'];
};
export declare type ConfirmFraudResponse = {
    __typename?: 'ConfirmFraudResponse';
    id: Scalars['String'];
    resolution: Scalars['String'];
};
/** The available fields to create an OAuth2 client */
export declare type CreateClientInput = {
    /** The name of the OAuth2 client displayed when users log in */
    name: Scalars['String'];
    /** The OAuth2 client secret */
    secret?: Maybe<Scalars['String']>;
    /** The URL to redirect to after authentication */
    redirectUri?: Maybe<Scalars['String']>;
    /** The grant types (i.e. ways to obtain access tokens) allowed for the client */
    grantTypes: Array<GrantType>;
    /** The scopes the client has access to, limiting access to the corresponding parts of the API */
    scopes: Array<ScopeType>;
};
/** The available fields to create a SEPA Transfer */
export declare type CreateSepaTransferInput = {
    /** The name of the SEPA Transfer recipient */
    recipient: Scalars['String'];
    /** The IBAN of the SEPA Transfer recipient */
    iban: Scalars['String'];
    /** The amount of the SEPA Transfer in cents */
    amount: Scalars['Int'];
    /** The purpose of the SEPA Transfer - 140 max characters */
    purpose?: Maybe<Scalars['String']>;
    /** The end to end ID of the SEPA Transfer */
    e2eId?: Maybe<Scalars['String']>;
};
/** The available fields to create a Standing Order */
export declare type CreateStandingOrderInput = {
    /** The name of the Standing Order payments recipient */
    recipient: Scalars['String'];
    /** The IBAN of the Standing Order payments recipient */
    iban: Scalars['String'];
    /** The amount of each Standing Order payment in cents */
    amount: Scalars['Int'];
    /** The date at which the first payment will be executed */
    executeAt: Scalars['DateTime'];
    /** The date at which the last payment will be executed */
    lastExecutionDate?: Maybe<Scalars['DateTime']>;
    /** The purpose of the Standing Order - 140 max characters */
    purpose?: Maybe<Scalars['String']>;
    /** The end to end ID of the Standing Order */
    e2eId?: Maybe<Scalars['String']>;
    /** The reoccurrence type of the Standing Order payments */
    reoccurrence: StandingOrderReoccurenceType;
};
/** The available fields to create a Timed Order */
export declare type CreateTimedOrderInput = {
    /** The name of the Timed Order recipient */
    recipient: Scalars['String'];
    /** The IBAN of the Timed Order recipient */
    iban: Scalars['String'];
    /** The amount of the Timed Order in cents */
    amount: Scalars['Int'];
    /** The date at which the payment will be executed */
    executeAt: Scalars['DateTime'];
    /** The purpose of the Timed Order - 140 max characters */
    purpose?: Maybe<Scalars['String']>;
    /** The end to end ID of the Timed Order */
    e2eId?: Maybe<Scalars['String']>;
};
/** The available fields to create a transfer */
export declare type CreateTransferInput = {
    /** The name of the transfer recipient */
    recipient: Scalars['String'];
    /** The IBAN of the transfer recipient */
    iban: Scalars['String'];
    /** The amount of the transfer in cents */
    amount: Scalars['Int'];
    /** The date at which the payment will be executed for Timed Orders or Standing Orders */
    executeAt?: Maybe<Scalars['DateTime']>;
    /** The date at which the last payment will be executed for Standing Orders */
    lastExecutionDate?: Maybe<Scalars['DateTime']>;
    /** The purpose of the transfer - 140 max characters */
    purpose?: Maybe<Scalars['String']>;
    /** The end to end ID of the transfer */
    e2eId?: Maybe<Scalars['String']>;
    /** The reoccurrence type of the payments for Standing Orders */
    reoccurrence?: Maybe<StandingOrderReoccurenceType>;
};
export declare type DirectDebitFee = {
    __typename?: 'DirectDebitFee';
    id: Scalars['Int'];
    type: TransactionFeeType;
    amount: Scalars['Int'];
    usedAt?: Maybe<Scalars['DateTime']>;
    invoiceStatus: InvoiceStatus;
};
export declare enum DocumentType {
    Voucher = "VOUCHER",
    Invoice = "INVOICE"
}
export declare enum Gender {
    Male = "MALE",
    Female = "FEMALE"
}
export declare enum GrantType {
    Password = "PASSWORD",
    AuthorizationCode = "AUTHORIZATION_CODE",
    RefreshToken = "REFRESH_TOKEN",
    ClientCredentials = "CLIENT_CREDENTIALS"
}
export declare enum IdentificationStatus {
    Pending = "PENDING",
    PendingSuccessful = "PENDING_SUCCESSFUL",
    PendingFailed = "PENDING_FAILED",
    Successful = "SUCCESSFUL",
    Failed = "FAILED",
    Expired = "EXPIRED",
    Created = "CREATED",
    Aborted = "ABORTED",
    Canceled = "CANCELED"
}
export declare enum InvoiceStatus {
    Open = "OPEN",
    Closed = "CLOSED",
    Rejected = "REJECTED",
    Pending = "PENDING"
}
export declare type Mutation = {
    __typename?: 'Mutation';
    /** Cancel an existing Timed Order or Standing Order */
    cancelTransfer: ConfirmationRequestOrTransfer;
    /** Confirm a Standing Order cancelation */
    confirmCancelTransfer: Transfer;
    /** Create an OAuth2 client */
    createClient: Client;
    /** Update an OAuth2 client */
    updateClient: Client;
    /** Delete an OAuth2 client */
    deleteClient: Client;
    /** Create a transfer. The transfer's type will be determined based on the provided input */
    createTransfer: ConfirmationRequest;
    /** Confirm a transfer creation */
    confirmTransfer: Transfer;
    /** Create multiple transfers at once. Only regular SEPA Transfers are supported */
    createTransfers: ConfirmationRequest;
    /** Confirm the transfers creation */
    confirmTransfers: BatchTransfer;
    whitelistCard: WhitelistCardResponse;
    confirmFraud: ConfirmFraudResponse;
    createCard: Card;
    activateCard: Card;
    updateCardSettings: CardSettings;
    changeCardStatus: Card;
    changeCardPIN: ConfirmationRequest;
    confirmChangeCardPIN: ConfirmationStatus;
};
export declare type MutationCancelTransferArgs = {
    id: Scalars['String'];
    type: TransferType;
};
export declare type MutationConfirmCancelTransferArgs = {
    authorizationToken: Scalars['String'];
    confirmationId: Scalars['String'];
    type: TransferType;
};
export declare type MutationCreateClientArgs = {
    client: CreateClientInput;
};
export declare type MutationUpdateClientArgs = {
    client: UpdateClientInput;
};
export declare type MutationDeleteClientArgs = {
    id: Scalars['String'];
};
export declare type MutationCreateTransferArgs = {
    transfer: CreateTransferInput;
};
export declare type MutationConfirmTransferArgs = {
    authorizationToken: Scalars['String'];
    confirmationId: Scalars['String'];
};
export declare type MutationCreateTransfersArgs = {
    transfers: Array<CreateSepaTransferInput>;
};
export declare type MutationConfirmTransfersArgs = {
    authorizationToken: Scalars['String'];
    confirmationId: Scalars['String'];
};
export declare type MutationWhitelistCardArgs = {
    fraudCaseId: Scalars['String'];
    id: Scalars['String'];
};
export declare type MutationConfirmFraudArgs = {
    fraudCaseId: Scalars['String'];
    id: Scalars['String'];
};
export declare type MutationCreateCardArgs = {
    cardType: CardType;
};
export declare type MutationActivateCardArgs = {
    verificationToken: Scalars['String'];
    id: Scalars['String'];
};
export declare type MutationUpdateCardSettingsArgs = {
    settings: CardSettingsInput;
    id: Scalars['String'];
};
export declare type MutationChangeCardStatusArgs = {
    id: Scalars['String'];
    action: CardAction;
};
export declare type MutationChangeCardPinArgs = {
    pin: Scalars['String'];
    id: Scalars['String'];
};
export declare type MutationConfirmChangeCardPinArgs = {
    authorizationToken: Scalars['String'];
    confirmationId: Scalars['String'];
    id: Scalars['String'];
};
export declare enum Nationality {
    De = "DE",
    Ad = "AD",
    Ae = "AE",
    Af = "AF",
    Ag = "AG",
    Ai = "AI",
    Al = "AL",
    Am = "AM",
    Ao = "AO",
    Aq = "AQ",
    Ar = "AR",
    As = "AS",
    At = "AT",
    Au = "AU",
    Aw = "AW",
    Ax = "AX",
    Az = "AZ",
    Ba = "BA",
    Bb = "BB",
    Bd = "BD",
    Be = "BE",
    Bf = "BF",
    Bg = "BG",
    Bh = "BH",
    Bi = "BI",
    Bj = "BJ",
    Bl = "BL",
    Bm = "BM",
    Bn = "BN",
    Bo = "BO",
    Br = "BR",
    Bs = "BS",
    Bt = "BT",
    Bv = "BV",
    Bw = "BW",
    By = "BY",
    Bz = "BZ",
    Ca = "CA",
    Cc = "CC",
    Cd = "CD",
    Cf = "CF",
    Cg = "CG",
    Ch = "CH",
    Ci = "CI",
    Ck = "CK",
    Cl = "CL",
    Cm = "CM",
    Cn = "CN",
    Co = "CO",
    Cr = "CR",
    Cu = "CU",
    Cv = "CV",
    Cw = "CW",
    Cx = "CX",
    Cy = "CY",
    Cz = "CZ",
    Dj = "DJ",
    Dk = "DK",
    Dm = "DM",
    Do = "DO",
    Dz = "DZ",
    Ec = "EC",
    Ee = "EE",
    Eg = "EG",
    Eh = "EH",
    Er = "ER",
    Es = "ES",
    Et = "ET",
    Fi = "FI",
    Fj = "FJ",
    Fk = "FK",
    Fm = "FM",
    Fo = "FO",
    Fr = "FR",
    Ga = "GA",
    Gb = "GB",
    Gd = "GD",
    Ge = "GE",
    Gf = "GF",
    Gg = "GG",
    Gh = "GH",
    Gi = "GI",
    Gl = "GL",
    Gm = "GM",
    Gn = "GN",
    Gp = "GP",
    Gq = "GQ",
    Gr = "GR",
    Gs = "GS",
    Gt = "GT",
    Gu = "GU",
    Gw = "GW",
    Gy = "GY",
    Hk = "HK",
    Hm = "HM",
    Hn = "HN",
    Hr = "HR",
    Ht = "HT",
    Hu = "HU",
    Id = "ID",
    Ie = "IE",
    Il = "IL",
    Im = "IM",
    In = "IN",
    Io = "IO",
    Iq = "IQ",
    Ir = "IR",
    Is = "IS",
    It = "IT",
    Je = "JE",
    Jm = "JM",
    Jo = "JO",
    Jp = "JP",
    Ke = "KE",
    Kg = "KG",
    Kh = "KH",
    Ki = "KI",
    Km = "KM",
    Kn = "KN",
    Kp = "KP",
    Kr = "KR",
    Kw = "KW",
    Ky = "KY",
    Kz = "KZ",
    La = "LA",
    Lb = "LB",
    Lc = "LC",
    Li = "LI",
    Lk = "LK",
    Lr = "LR",
    Ls = "LS",
    Lt = "LT",
    Lu = "LU",
    Lv = "LV",
    Ly = "LY",
    Ma = "MA",
    Mc = "MC",
    Md = "MD",
    Me = "ME",
    Mf = "MF",
    Mg = "MG",
    Mh = "MH",
    Mk = "MK",
    Ml = "ML",
    Mm = "MM",
    Mn = "MN",
    Mo = "MO",
    Mp = "MP",
    Mq = "MQ",
    Mr = "MR",
    Ms = "MS",
    Mt = "MT",
    Mu = "MU",
    Mv = "MV",
    Mw = "MW",
    Mx = "MX",
    My = "MY",
    Mz = "MZ",
    Na = "NA",
    Nc = "NC",
    Ne = "NE",
    Nf = "NF",
    Ng = "NG",
    Ni = "NI",
    Nl = "NL",
    No = "NO",
    Np = "NP",
    Nr = "NR",
    Nu = "NU",
    Nz = "NZ",
    Om = "OM",
    Pa = "PA",
    Pe = "PE",
    Pf = "PF",
    Pg = "PG",
    Ph = "PH",
    Pk = "PK",
    Pl = "PL",
    Pm = "PM",
    Pn = "PN",
    Pr = "PR",
    Ps = "PS",
    Pt = "PT",
    Pw = "PW",
    Py = "PY",
    Qa = "QA",
    Re = "RE",
    Ro = "RO",
    Rs = "RS",
    Ru = "RU",
    Rw = "RW",
    Sa = "SA",
    Sb = "SB",
    Sc = "SC",
    Sd = "SD",
    Se = "SE",
    Sg = "SG",
    Si = "SI",
    Sj = "SJ",
    Sk = "SK",
    Sl = "SL",
    Sm = "SM",
    Sn = "SN",
    So = "SO",
    Sr = "SR",
    Ss = "SS",
    St = "ST",
    Sv = "SV",
    Sx = "SX",
    Sy = "SY",
    Sz = "SZ",
    Tc = "TC",
    Td = "TD",
    Tf = "TF",
    Tg = "TG",
    Th = "TH",
    Tj = "TJ",
    Tk = "TK",
    Tl = "TL",
    Tm = "TM",
    Tn = "TN",
    To = "TO",
    Tr = "TR",
    Tt = "TT",
    Tv = "TV",
    Tw = "TW",
    Tz = "TZ",
    Ua = "UA",
    Ug = "UG",
    Um = "UM",
    Us = "US",
    Uy = "UY",
    Uz = "UZ",
    Va = "VA",
    Vc = "VC",
    Ve = "VE",
    Vg = "VG",
    Vi = "VI",
    Vn = "VN",
    Vu = "VU",
    Wf = "WF",
    Ws = "WS",
    Xk = "XK",
    Ye = "YE",
    Yt = "YT",
    Za = "ZA",
    Zm = "ZM",
    Zw = "ZW"
}
export declare type PageInfo = {
    __typename?: 'PageInfo';
    startCursor?: Maybe<Scalars['String']>;
    endCursor?: Maybe<Scalars['String']>;
    hasNextPage: Scalars['Boolean'];
    hasPreviousPage: Scalars['Boolean'];
};
export declare enum PaymentFrequency {
    Monthly = "MONTHLY",
    Quarterly = "QUARTERLY",
    Yearly = "YEARLY",
    None = "NONE"
}
export declare type Query = {
    __typename?: 'Query';
    /** The current user information */
    viewer: User;
};
export declare enum ScopeType {
    Offline = "OFFLINE",
    Accounts = "ACCOUNTS",
    Users = "USERS",
    Transactions = "TRANSACTIONS",
    Transfers = "TRANSFERS",
    Subscriptions = "SUBSCRIPTIONS",
    Statements = "STATEMENTS",
    Admin = "ADMIN",
    Clients = "CLIENTS"
}
export declare type SepaTransfer = {
    __typename?: 'SepaTransfer';
    /** The status of the SEPA Transfer */
    status: SepaTransferStatus;
    /** The amount of the SEPA Transfer in cents */
    amount: Scalars['Int'];
    /** The purpose of the SEPA Transfer - 140 max characters */
    purpose?: Maybe<Scalars['String']>;
    id: Scalars['String'];
    /** The name of the SEPA Transfer recipient */
    recipient: Scalars['String'];
    /** The IBAN of the SEPA Transfer recipient */
    iban: Scalars['String'];
    /** The end to end ID of the SEPA Transfer */
    e2eId?: Maybe<Scalars['String']>;
};
export declare enum SepaTransferStatus {
    Created = "CREATED",
    Authorized = "AUTHORIZED",
    Confirmed = "CONFIRMED",
    Booked = "BOOKED"
}
export declare type StandingOrder = {
    __typename?: 'StandingOrder';
    id: Scalars['String'];
    /** The status of the Standing Order */
    status: StandingOrderStatus;
    /** The IBAN of the Standing Order payments recipient */
    iban: Scalars['String'];
    /** The name of the Standing Order payments recipient */
    recipient: Scalars['String'];
    /** The purpose of the Standing Order - 140 max characters */
    purpose?: Maybe<Scalars['String']>;
    /** The amount of each Standing Order payment in cents */
    amount: Scalars['Int'];
    /** The date at which the first payment will be executed */
    executeAt: Scalars['DateTime'];
    /** The date at which the last payment will be executed */
    lastExecutionDate?: Maybe<Scalars['DateTime']>;
    /** The end to end ID of the Standing Order */
    e2eId?: Maybe<Scalars['String']>;
    /** The reoccurrence type of the Standing Order payments */
    reoccurrence: StandingOrderReoccurenceType;
    /** The date at which the next payment will be executed */
    nextOccurrence?: Maybe<Scalars['DateTime']>;
};
export declare enum StandingOrderReoccurenceType {
    Monthly = "MONTHLY",
    Quarterly = "QUARTERLY",
    EverySixMonths = "EVERY_SIX_MONTHS",
    Annually = "ANNUALLY"
}
export declare enum StandingOrderStatus {
    Created = "CREATED",
    Active = "ACTIVE",
    Inactive = "INACTIVE",
    Canceled = "CANCELED"
}
export declare type Subscription = {
    __typename?: 'Subscription';
    newTransaction: Transaction;
};
export declare type TimedOrder = {
    __typename?: 'TimedOrder';
    id: Scalars['ID'];
    /** The date at which the payment will be executed */
    executeAt: Scalars['String'];
    /** The status of the Timed Order */
    status: TimedOrderStatus;
    /** The purpose of the Timed Order - 140 max characters */
    purpose?: Maybe<Scalars['String']>;
    /** The IBAN of the Timed Order recipient */
    iban: Scalars['String'];
    /** The name of the Timed Order recipient */
    recipient: Scalars['String'];
    /** The end to end ID of the Timed Order */
    e2eId?: Maybe<Scalars['String']>;
    /** The amount of the Timed Order in cents */
    amount: Scalars['Int'];
};
export declare enum TimedOrderStatus {
    Created = "CREATED",
    AuthorizationRequired = "AUTHORIZATION_REQUIRED",
    ConfirmationRequired = "CONFIRMATION_REQUIRED",
    Scheduled = "SCHEDULED",
    Executed = "EXECUTED",
    Canceled = "CANCELED",
    Failed = "FAILED"
}
export declare type Transaction = {
    __typename?: 'Transaction';
    id: Scalars['ID'];
    /** The amount of the transaction in cents */
    amount: Scalars['Int'];
    iban?: Maybe<Scalars['String']>;
    type: TransactionProjectionType;
    /** The date at which the transaction was processed and the amount deducted from the user's account */
    valutaDate?: Maybe<Scalars['DateTime']>;
    e2eId?: Maybe<Scalars['String']>;
    mandateNumber?: Maybe<Scalars['String']>;
    fees: Array<TransactionFee>;
    /** The date at which the transaction was booked (created) */
    bookingDate: Scalars['DateTime'];
    directDebitFees: Array<DirectDebitFee>;
    name?: Maybe<Scalars['String']>;
    paymentMethod: Scalars['String'];
    category?: Maybe<TransactionCategory>;
    /** When a transaction corresponds to a tax or vat payment, the user may specify at which date it should be considered booked */
    userSelectedBookingDate?: Maybe<Scalars['DateTime']>;
    purpose?: Maybe<Scalars['String']>;
    documentNumber?: Maybe<Scalars['String']>;
    documentPreviewUrl?: Maybe<Scalars['String']>;
    documentDownloadUrl?: Maybe<Scalars['String']>;
    documentType?: Maybe<DocumentType>;
    foreignCurrency?: Maybe<Scalars['String']>;
    originalAmount?: Maybe<Scalars['Int']>;
};
export declare enum TransactionCategory {
    Private = "PRIVATE",
    Vat = "VAT",
    Vat_0 = "VAT_0",
    Vat_7 = "VAT_7",
    Vat_19 = "VAT_19",
    TaxPayment = "TAX_PAYMENT",
    VatPayment = "VAT_PAYMENT",
    TaxRefund = "TAX_REFUND",
    VatRefund = "VAT_REFUND"
}
export declare type TransactionFee = {
    __typename?: 'TransactionFee';
    type: TransactionFeeType;
    status: TransactionFeeStatus;
    unitAmount?: Maybe<Scalars['Int']>;
    usedAt?: Maybe<Scalars['DateTime']>;
};
export declare enum TransactionFeeStatus {
    Created = "CREATED",
    Charged = "CHARGED",
    Refunded = "REFUNDED",
    Cancelled = "CANCELLED",
    RefundInitiated = "REFUND_INITIATED"
}
export declare enum TransactionFeeType {
    Atm = "ATM",
    ForeignTransaction = "FOREIGN_TRANSACTION",
    DirectDebitReturn = "DIRECT_DEBIT_RETURN",
    SecondReminderEmail = "SECOND_REMINDER_EMAIL",
    CardReplacement = "CARD_REPLACEMENT"
}
export declare enum TransactionProjectionType {
    CreditPresentment = "CREDIT_PRESENTMENT",
    CashManual = "CASH_MANUAL",
    Atm = "ATM",
    CancelManualLoad = "CANCEL_MANUAL_LOAD",
    CardUsage = "CARD_USAGE",
    DirectDebitAutomaticTopup = "DIRECT_DEBIT_AUTOMATIC_TOPUP",
    DirectDebitReturn = "DIRECT_DEBIT_RETURN",
    DisputeClearing = "DISPUTE_CLEARING",
    ManualLoad = "MANUAL_LOAD",
    WireTransferTopup = "WIRE_TRANSFER_TOPUP",
    TransferToBankAccount = "TRANSFER_TO_BANK_ACCOUNT",
    CancellationBooking = "CANCELLATION_BOOKING",
    CancellationDoubleBooking = "CANCELLATION_DOUBLE_BOOKING",
    CreditTransferCancellation = "CREDIT_TRANSFER_CANCELLATION",
    CurrencyTransactionCancellation = "CURRENCY_TRANSACTION_CANCELLATION",
    DirectDebit = "DIRECT_DEBIT",
    ForeignPayment = "FOREIGN_PAYMENT",
    Other = "OTHER",
    SepaCreditTransferReturn = "SEPA_CREDIT_TRANSFER_RETURN",
    SepaCreditTransfer = "SEPA_CREDIT_TRANSFER",
    SepaDirectDebitReturn = "SEPA_DIRECT_DEBIT_RETURN",
    SepaDirectDebit = "SEPA_DIRECT_DEBIT",
    Transfer = "TRANSFER",
    InternationalCreditTransfer = "INTERNATIONAL_CREDIT_TRANSFER",
    CancellationSepaDirectDebitReturn = "CANCELLATION_SEPA_DIRECT_DEBIT_RETURN",
    Rebooking = "REBOOKING",
    CancellationDirectDebit = "CANCELLATION_DIRECT_DEBIT",
    CancellationSepaCreditTransferReturn = "CANCELLATION_SEPA_CREDIT_TRANSFER_RETURN",
    CardTransaction = "CARD_TRANSACTION"
}
export declare type TransactionsConnection = {
    __typename?: 'TransactionsConnection';
    edges: Array<TransactionsConnectionEdge>;
    pageInfo: PageInfo;
};
export declare type TransactionsConnectionEdge = {
    __typename?: 'TransactionsConnectionEdge';
    node: Transaction;
    cursor: Scalars['String'];
};
export declare type Transfer = {
    __typename?: 'Transfer';
    id: Scalars['String'];
    /** The name of the transfer recipient */
    recipient: Scalars['String'];
    /** The IBAN of the transfer recipient */
    iban: Scalars['String'];
    /** The amount of the transfer in cents */
    amount: Scalars['Int'];
    /** The status of the transfer */
    status?: Maybe<TransferStatus>;
    /** The date at which the payment will be executed for Timed Orders or Standing Orders */
    executeAt?: Maybe<Scalars['DateTime']>;
    /** The date at which the last payment will be executed for Standing Orders */
    lastExecutionDate?: Maybe<Scalars['DateTime']>;
    /** The purpose of the transfer - 140 max characters */
    purpose?: Maybe<Scalars['String']>;
    /** The end to end ID of the transfer */
    e2eId?: Maybe<Scalars['String']>;
    /** The reoccurrence type of the payments for Standing Orders */
    reoccurrence?: Maybe<StandingOrderReoccurenceType>;
    /** The date at which the next payment will be executed for Standing Orders */
    nextOccurrence?: Maybe<Scalars['DateTime']>;
};
export declare type TransfersConnection = {
    __typename?: 'TransfersConnection';
    edges: Array<TransfersConnectionEdge>;
    pageInfo: PageInfo;
};
export declare type TransfersConnectionEdge = {
    __typename?: 'TransfersConnectionEdge';
    node: Transfer;
    cursor: Scalars['String'];
};
export declare type TransfersConnectionFilter = {
    status?: Maybe<TransferStatus>;
};
export declare enum TransferStatus {
    Created = "CREATED",
    Authorized = "AUTHORIZED",
    Confirmed = "CONFIRMED",
    Booked = "BOOKED",
    Active = "ACTIVE",
    Inactive = "INACTIVE",
    Canceled = "CANCELED",
    AuthorizationRequired = "AUTHORIZATION_REQUIRED",
    ConfirmationRequired = "CONFIRMATION_REQUIRED",
    Scheduled = "SCHEDULED",
    Executed = "EXECUTED",
    Failed = "FAILED"
}
export declare enum TransferType {
    SepaTransfer = "SEPA_TRANSFER",
    StandingOrder = "STANDING_ORDER",
    TimedOrder = "TIMED_ORDER"
}
/** The available fields to update an OAuth2 client */
export declare type UpdateClientInput = {
    /** The name of the OAuth2 client displayed when users log in */
    name?: Maybe<Scalars['String']>;
    /** The OAuth2 client secret */
    secret?: Maybe<Scalars['String']>;
    /** The URL to redirect to after authentication */
    redirectUri?: Maybe<Scalars['String']>;
    /** The grant types (i.e. ways to obtain access tokens) allowed for the client */
    grantTypes?: Maybe<Array<GrantType>>;
    /** The scopes the client has access to, limiting access to the corresponding parts of the API */
    scopes?: Maybe<Array<ScopeType>>;
    /** The id of the OAuth2 client to update */
    id: Scalars['String'];
};
export declare type User = {
    __typename?: 'User';
    email: Scalars['String'];
    createdAt: Scalars['DateTime'];
    vatCutoffLine?: Maybe<Scalars['DateTime']>;
    taxCutoffLine?: Maybe<Scalars['DateTime']>;
    vatPaymentFrequency?: Maybe<PaymentFrequency>;
    taxPaymentFrequency?: Maybe<PaymentFrequency>;
    taxRate?: Maybe<Scalars['Int']>;
    vatRate?: Maybe<Scalars['Int']>;
    /** The user's IDNow identification status */
    identificationStatus?: Maybe<IdentificationStatus>;
    /** The user's IDNow identification status */
    identificationLink?: Maybe<Scalars['String']>;
    gender?: Maybe<Gender>;
    firstName?: Maybe<Scalars['String']>;
    lastName?: Maybe<Scalars['String']>;
    birthPlace?: Maybe<Scalars['String']>;
    birthDate?: Maybe<Scalars['DateTime']>;
    nationality?: Maybe<Nationality>;
    street?: Maybe<Scalars['String']>;
    postCode?: Maybe<Scalars['String']>;
    city?: Maybe<Scalars['String']>;
    mobileNumber?: Maybe<Scalars['String']>;
    untrustedPhoneNumber?: Maybe<Scalars['String']>;
    /** Indicates whether the user pays taxes in the US */
    isUSPerson?: Maybe<Scalars['Boolean']>;
    companyType?: Maybe<CompanyType>;
    publicId: Scalars['ID'];
    language?: Maybe<Scalars['String']>;
    country?: Maybe<Scalars['String']>;
    /** Business description provided by the user */
    businessPurpose?: Maybe<Scalars['String']>;
    /** The economic sector of the user's business */
    economicSector?: Maybe<Scalars['String']>;
    /** Business economic sector provided by the user */
    otherEconomicSector?: Maybe<Scalars['String']>;
    vatNumber?: Maybe<Scalars['String']>;
    /** The user's referral code to use for promotional purposes */
    referralCode?: Maybe<Scalars['String']>;
    /** The list of all OAuth2 clients for the current user */
    clients: Array<Client>;
    /** The details of an existing OAuth2 client */
    client?: Maybe<Client>;
    mainAccount?: Maybe<Account>;
};
export declare type UserClientArgs = {
    id: Scalars['String'];
};
export declare type WhitelistCardResponse = {
    __typename?: 'WhitelistCardResponse';
    id: Scalars['String'];
    resolution: Scalars['String'];
    whitelisted_until: Scalars['String'];
};
