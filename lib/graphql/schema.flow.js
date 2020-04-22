/* @flow */


/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {|
  ID: string,
  String: string,
  Boolean: boolean,
  Int: number,
  Float: number,
  /** The javascript `Date` as string. Type represents date and time as the ISO Date string. */
  DateTime: any,
|};

/** The bank account of the current user */
export type Account = {|
   __typename?: 'Account',
  iban: $ElementType<Scalars, 'String'>,
  cardHolderRepresentation?: ?$ElementType<Scalars, 'String'>,
  balance: $ElementType<Scalars, 'Int'>,
  cardHolderRepresentations: Array<$ElementType<Scalars, 'String'>>,
  transfers: TransfersConnection,
  transaction?: ?Transaction,
  transactions: TransactionsConnection,
  transfer?: ?Transfer,
  accountStats?: ?AccountStats,
  /** Individual tax-related settings per year */
  taxYearSettings: Array<TaxYearSetting>,
  /**
   * A list of iban/name combinations based on existing user's transactions,
   * provided to assist users when creating new transfers
   */
  transferSuggestions?: ?Array<TransferSuggestion>,
  cards: Array<Card>,
  card?: ?Card,
  /** Overdraft Application - only available for Kontist Application */
  overdraft?: ?Overdraft,
|};


/** The bank account of the current user */
export type AccountTransfersArgs = {|
  where?: ?TransfersConnectionFilter,
  type: TransferType,
  first?: ?$ElementType<Scalars, 'Int'>,
  last?: ?$ElementType<Scalars, 'Int'>,
  after?: ?$ElementType<Scalars, 'String'>,
  before?: ?$ElementType<Scalars, 'String'>,
|};


/** The bank account of the current user */
export type AccountTransactionArgs = {|
  id: $ElementType<Scalars, 'ID'>,
|};


/** The bank account of the current user */
export type AccountTransactionsArgs = {|
  filter?: ?TransactionFilter,
  first?: ?$ElementType<Scalars, 'Int'>,
  last?: ?$ElementType<Scalars, 'Int'>,
  after?: ?$ElementType<Scalars, 'String'>,
  before?: ?$ElementType<Scalars, 'String'>,
|};


/** The bank account of the current user */
export type AccountTransferArgs = {|
  id: $ElementType<Scalars, 'ID'>,
  type: TransferType,
|};


/** The bank account of the current user */
export type AccountCardArgs = {|
  filter?: ?CardFilter,
|};

export type AccountStats = {|
   __typename?: 'AccountStats',
  accountBalance: $ElementType<Scalars, 'Int'>,
  main: $ElementType<Scalars, 'Int'>,
  yours: $ElementType<Scalars, 'Int'>,
  unknown: $ElementType<Scalars, 'Int'>,
  vatAmount: $ElementType<Scalars, 'Int'>,
  vatTotal: $ElementType<Scalars, 'Int'>,
  vatMissing: $ElementType<Scalars, 'Int'>,
  taxCurrentYearAmount: $ElementType<Scalars, 'Int'>,
  taxPastYearAmount?: ?$ElementType<Scalars, 'Int'>,
  taxTotal: $ElementType<Scalars, 'Int'>,
  taxMissing: $ElementType<Scalars, 'Int'>,
|};

export const BannerNameValues = Object.freeze({
  Overdraft: 'OVERDRAFT'
});


export type BannerName = $Values<typeof BannerNameValues>;

export const BaseOperatorValues = Object.freeze({
  Or: 'OR', 
  And: 'AND'
});


export type BaseOperator = $Values<typeof BaseOperatorValues>;

export type BatchTransfer = {|
   __typename?: 'BatchTransfer',
  id: $ElementType<Scalars, 'String'>,
  status: BatchTransferStatus,
  transfers: Array<SepaTransfer>,
|};

export const BatchTransferStatusValues = Object.freeze({
  AuthorizationRequired: 'AUTHORIZATION_REQUIRED', 
  ConfirmationRequired: 'CONFIRMATION_REQUIRED', 
  Accepted: 'ACCEPTED', 
  Failed: 'FAILED', 
  Successful: 'SUCCESSFUL'
});


export type BatchTransferStatus = $Values<typeof BatchTransferStatusValues>;

export type Card = {|
   __typename?: 'Card',
  id: $ElementType<Scalars, 'String'>,
  status: CardStatus,
  type: CardType,
  pinSet: $ElementType<Scalars, 'Boolean'>,
  holder?: ?$ElementType<Scalars, 'String'>,
  formattedExpirationDate?: ?$ElementType<Scalars, 'String'>,
  maskedPan?: ?$ElementType<Scalars, 'String'>,
  settings: CardSettings,
|};

export const CardActionValues = Object.freeze({
  Close: 'CLOSE', 
  Block: 'BLOCK', 
  Unblock: 'UNBLOCK'
});


export type CardAction = $Values<typeof CardActionValues>;

export type CardFilter = {|
  id?: ?$ElementType<Scalars, 'String'>,
  type?: ?CardType,
|};

export type CardLimit = {|
   __typename?: 'CardLimit',
  maxAmountCents: $ElementType<Scalars, 'Float'>,
  maxTransactions: $ElementType<Scalars, 'Float'>,
|};

export type CardLimitInput = {|
  maxAmountCents: $ElementType<Scalars, 'Float'>,
  maxTransactions: $ElementType<Scalars, 'Float'>,
|};

export type CardLimits = {|
   __typename?: 'CardLimits',
  daily: CardLimit,
  monthly: CardLimit,
|};

export type CardLimitsInput = {|
  daily: CardLimitInput,
  monthly: CardLimitInput,
|};

export type CardSettings = {|
   __typename?: 'CardSettings',
  contactlessEnabled: $ElementType<Scalars, 'Boolean'>,
  cardPresentLimits?: ?CardLimits,
  cardNotPresentLimits?: ?CardLimits,
|};

export type CardSettingsInput = {|
  cardPresentLimits?: ?CardLimitsInput,
  cardNotPresentLimits?: ?CardLimitsInput,
  contactlessEnabled?: ?$ElementType<Scalars, 'Boolean'>,
|};

export const CardStatusValues = Object.freeze({
  Processing: 'PROCESSING', 
  Inactive: 'INACTIVE', 
  Active: 'ACTIVE', 
  Blocked: 'BLOCKED', 
  BlockedBySolaris: 'BLOCKED_BY_SOLARIS', 
  ActivationBlockedBySolaris: 'ACTIVATION_BLOCKED_BY_SOLARIS', 
  Closed: 'CLOSED', 
  ClosedBySolaris: 'CLOSED_BY_SOLARIS'
});


export type CardStatus = $Values<typeof CardStatusValues>;

export const CardTypeValues = Object.freeze({
  VirtualVisaBusinessDebit: 'VIRTUAL_VISA_BUSINESS_DEBIT', 
  VisaBusinessDebit: 'VISA_BUSINESS_DEBIT', 
  MastercardBusinessDebit: 'MASTERCARD_BUSINESS_DEBIT', 
  VirtualMastercardBusinessDebit: 'VIRTUAL_MASTERCARD_BUSINESS_DEBIT', 
  VirtualVisaFreelanceDebit: 'VIRTUAL_VISA_FREELANCE_DEBIT'
});


export type CardType = $Values<typeof CardTypeValues>;

export type Client = {|
   __typename?: 'Client',
  id: $ElementType<Scalars, 'ID'>,
  /** The URL to redirect to after authentication */
  redirectUri?: ?$ElementType<Scalars, 'String'>,
  /** The name of the OAuth2 client displayed when users log in */
  name: $ElementType<Scalars, 'String'>,
  /** The grant types (i.e. ways to obtain access tokens) allowed for the client */
  grantTypes?: ?Array<GrantType>,
  /** The scopes the client has access to, limiting access to the corresponding parts of the API */
  scopes?: ?Array<ScopeType>,
|};

export const CompanyTypeValues = Object.freeze({
  Selbstaendig: 'SELBSTAENDIG', 
  Einzelunternehmer: 'EINZELUNTERNEHMER', 
  Freiberufler: 'FREIBERUFLER', 
  Gewerbetreibender: 'GEWERBETREIBENDER', 
  Limited: 'LIMITED', 
  EK: 'E_K', 
  Partgg: 'PARTGG', 
  Gbr: 'GBR', 
  Ohg: 'OHG', 
  Kg: 'KG', 
  Kgaa: 'KGAA', 
  Gmbh: 'GMBH', 
  GmbhUndCoKg: 'GMBH_UND_CO_KG', 
  Ug: 'UG'
});


export type CompanyType = $Values<typeof CompanyTypeValues>;

export type ConfirmationRequest = {|
   __typename?: 'ConfirmationRequest',
  confirmationId: $ElementType<Scalars, 'String'>,
|};

export type ConfirmationRequestOrTransfer = ConfirmationRequest | Transfer;

export type ConfirmationStatus = {|
   __typename?: 'ConfirmationStatus',
  status: $ElementType<Scalars, 'String'>,
|};

export type ConfirmFraudResponse = {|
   __typename?: 'ConfirmFraudResponse',
  id: $ElementType<Scalars, 'String'>,
  resolution: $ElementType<Scalars, 'String'>,
|};

/** The available fields to create an OAuth2 client */
export type CreateClientInput = {|
  /** The name of the OAuth2 client displayed when users log in */
  name: $ElementType<Scalars, 'String'>,
  /** The OAuth2 client secret */
  secret?: ?$ElementType<Scalars, 'String'>,
  /** The URL to redirect to after authentication */
  redirectUri?: ?$ElementType<Scalars, 'String'>,
  /** The grant types (i.e. ways to obtain access tokens) allowed for the client */
  grantTypes: Array<GrantType>,
  /** The scopes the client has access to, limiting access to the corresponding parts of the API */
  scopes: Array<ScopeType>,
|};

/** The available fields to create a SEPA Transfer */
export type CreateSepaTransferInput = {|
  /** The name of the SEPA Transfer recipient */
  recipient: $ElementType<Scalars, 'String'>,
  /** The IBAN of the SEPA Transfer recipient */
  iban: $ElementType<Scalars, 'String'>,
  /** The amount of the SEPA Transfer in cents */
  amount: $ElementType<Scalars, 'Int'>,
  /** The purpose of the SEPA Transfer - 140 max characters */
  purpose?: ?$ElementType<Scalars, 'String'>,
  /** The end to end ID of the SEPA Transfer */
  e2eId?: ?$ElementType<Scalars, 'String'>,
|};

export type CreateTransactionSplitsInput = {|
  amount: $ElementType<Scalars, 'Int'>,
  category: TransactionCategory,
  userSelectedBookingDate?: ?$ElementType<Scalars, 'DateTime'>,
|};

/** The available fields to create a transfer */
export type CreateTransferInput = {|
  /** The name of the transfer recipient */
  recipient: $ElementType<Scalars, 'String'>,
  /** The IBAN of the transfer recipient */
  iban: $ElementType<Scalars, 'String'>,
  /** The amount of the transfer in cents */
  amount: $ElementType<Scalars, 'Int'>,
  /** The date at which the payment will be executed for Timed Orders or Standing Orders */
  executeAt?: ?$ElementType<Scalars, 'DateTime'>,
  /** The date at which the last payment will be executed for Standing Orders */
  lastExecutionDate?: ?$ElementType<Scalars, 'DateTime'>,
  /** The purpose of the transfer - 140 max characters */
  purpose?: ?$ElementType<Scalars, 'String'>,
  /** The end to end ID of the transfer */
  e2eId?: ?$ElementType<Scalars, 'String'>,
  /** The reoccurrence type of the payments for Standing Orders */
  reoccurrence?: ?StandingOrderReoccurenceType,
  /** The user selected category for the SEPA Transfer */
  category?: ?TransactionCategory,
  /** When a transaction corresponds to a tax or vat payment, the user may specify at which date it should be considered booked */
  userSelectedBookingDate?: ?$ElementType<Scalars, 'DateTime'>,
|};


export type DirectDebitFee = {|
   __typename?: 'DirectDebitFee',
  id: $ElementType<Scalars, 'Int'>,
  type: TransactionFeeType,
  name: $ElementType<Scalars, 'String'>,
  amount: $ElementType<Scalars, 'Int'>,
  usedAt?: ?$ElementType<Scalars, 'DateTime'>,
  invoiceStatus: InvoiceStatus,
|};

export const DocumentTypeValues = Object.freeze({
  Voucher: 'VOUCHER', 
  Invoice: 'INVOICE'
});


export type DocumentType = $Values<typeof DocumentTypeValues>;

export const GenderValues = Object.freeze({
  Male: 'MALE', 
  Female: 'FEMALE'
});


export type Gender = $Values<typeof GenderValues>;

export const GrantTypeValues = Object.freeze({
  Password: 'PASSWORD', 
  AuthorizationCode: 'AUTHORIZATION_CODE', 
  RefreshToken: 'REFRESH_TOKEN', 
  ClientCredentials: 'CLIENT_CREDENTIALS'
});


export type GrantType = $Values<typeof GrantTypeValues>;

export const IdentificationStatusValues = Object.freeze({
  Pending: 'PENDING', 
  PendingSuccessful: 'PENDING_SUCCESSFUL', 
  PendingFailed: 'PENDING_FAILED', 
  Successful: 'SUCCESSFUL', 
  Failed: 'FAILED', 
  Expired: 'EXPIRED', 
  Created: 'CREATED', 
  Aborted: 'ABORTED', 
  Canceled: 'CANCELED'
});


export type IdentificationStatus = $Values<typeof IdentificationStatusValues>;

export const InvoiceStatusValues = Object.freeze({
  Open: 'OPEN', 
  Closed: 'CLOSED', 
  Rejected: 'REJECTED', 
  Pending: 'PENDING'
});


export type InvoiceStatus = $Values<typeof InvoiceStatusValues>;

export type Mutation = {|
   __typename?: 'Mutation',
  /** Cancel an existing Timed Order or Standing Order */
  cancelTransfer: ConfirmationRequestOrTransfer,
  /** Confirm a Standing Order cancelation */
  confirmCancelTransfer: Transfer,
  /** Create an OAuth2 client */
  createClient: Client,
  /** Update an OAuth2 client */
  updateClient: Client,
  /** Delete an OAuth2 client */
  deleteClient: Client,
  /** Update individual tax-related settings per year */
  updateTaxYearSettings: Array<TaxYearSetting>,
  /** Create a transfer. The transfer's type will be determined based on the provided input */
  createTransfer: ConfirmationRequest,
  updateTransfer: ConfirmationRequestOrTransfer,
  /** Confirm a transfer creation */
  confirmTransfer: Transfer,
  /** Create multiple transfers at once. Only regular SEPA Transfers are supported */
  createTransfers: ConfirmationRequest,
  /** Confirm the transfers creation */
  confirmTransfers: BatchTransfer,
  /** Update user's subscription plan */
  updateSubscriptionPlan: UpdateSubscriptionPlanResult,
  whitelistCard: WhitelistCardResponse,
  confirmFraud: ConfirmFraudResponse,
  /** Create a new card */
  createCard: Card,
  /** Activate a card */
  activateCard: Card,
  /** Update settings (e.g. limits) */
  updateCardSettings: CardSettings,
  /** Block or unblock or close a card */
  changeCardStatus: Card,
  /** Set a new PIN, needs to be confirmed */
  changeCardPIN: ConfirmationRequest,
  /** Confirm a PIN change request */
  confirmChangeCardPIN: ConfirmationStatus,
  /** Call when customer's card is lost or stolen */
  replaceCard: Card,
  /** Close and order new card. Call when customer's card is damaged */
  reorderCard: Card,
  /** Set the card holder representation for the customer */
  setCardHolderRepresentation: $ElementType<Scalars, 'String'>,
  /** Categorize a transaction with an optional custom booking date for VAT or Tax categories */
  categorizeTransaction: Transaction,
  /** Create Overdraft Application  - only available for Kontist Application */
  requestOverdraft?: ?Overdraft,
  /** Create transaction splits */
  createTransactionSplits: Transaction,
  /** Update transaction splits */
  updateTransactionSplits: Transaction,
  /** Delete transaction splits */
  deleteTransactionSplits: Transaction,
  dismissBanner: MutationResult,
|};


export type MutationCancelTransferArgs = {|
  id: $ElementType<Scalars, 'String'>,
  type: TransferType,
|};


export type MutationConfirmCancelTransferArgs = {|
  authorizationToken: $ElementType<Scalars, 'String'>,
  confirmationId: $ElementType<Scalars, 'String'>,
  type: TransferType,
|};


export type MutationCreateClientArgs = {|
  client: CreateClientInput,
|};


export type MutationUpdateClientArgs = {|
  client: UpdateClientInput,
|};


export type MutationDeleteClientArgs = {|
  id: $ElementType<Scalars, 'String'>,
|};


export type MutationUpdateTaxYearSettingsArgs = {|
  taxYearSettings: Array<TaxYearSettingInput>,
|};


export type MutationCreateTransferArgs = {|
  transfer: CreateTransferInput,
|};


export type MutationUpdateTransferArgs = {|
  transfer: UpdateTransferInput,
|};


export type MutationConfirmTransferArgs = {|
  authorizationToken: $ElementType<Scalars, 'String'>,
  confirmationId: $ElementType<Scalars, 'String'>,
|};


export type MutationCreateTransfersArgs = {|
  transfers: Array<CreateSepaTransferInput>,
|};


export type MutationConfirmTransfersArgs = {|
  authorizationToken: $ElementType<Scalars, 'String'>,
  confirmationId: $ElementType<Scalars, 'String'>,
|};


export type MutationUpdateSubscriptionPlanArgs = {|
  newPlan: PurchaseType,
|};


export type MutationWhitelistCardArgs = {|
  fraudCaseId: $ElementType<Scalars, 'String'>,
  id: $ElementType<Scalars, 'String'>,
|};


export type MutationConfirmFraudArgs = {|
  fraudCaseId: $ElementType<Scalars, 'String'>,
  id: $ElementType<Scalars, 'String'>,
|};


export type MutationCreateCardArgs = {|
  type: CardType,
  cardHolderRepresentation?: ?$ElementType<Scalars, 'String'>,
|};


export type MutationActivateCardArgs = {|
  verificationToken: $ElementType<Scalars, 'String'>,
  id: $ElementType<Scalars, 'String'>,
|};


export type MutationUpdateCardSettingsArgs = {|
  settings: CardSettingsInput,
  id: $ElementType<Scalars, 'String'>,
|};


export type MutationChangeCardStatusArgs = {|
  id: $ElementType<Scalars, 'String'>,
  action: CardAction,
|};


export type MutationChangeCardPinArgs = {|
  pin: $ElementType<Scalars, 'String'>,
  id: $ElementType<Scalars, 'String'>,
|};


export type MutationConfirmChangeCardPinArgs = {|
  authorizationToken: $ElementType<Scalars, 'String'>,
  confirmationId: $ElementType<Scalars, 'String'>,
  id: $ElementType<Scalars, 'String'>,
|};


export type MutationReplaceCardArgs = {|
  id: $ElementType<Scalars, 'String'>,
|};


export type MutationReorderCardArgs = {|
  id: $ElementType<Scalars, 'String'>,
|};


export type MutationSetCardHolderRepresentationArgs = {|
  cardHolderRepresentation: $ElementType<Scalars, 'String'>,
|};


export type MutationCategorizeTransactionArgs = {|
  id: $ElementType<Scalars, 'String'>,
  category?: ?TransactionCategory,
  userSelectedBookingDate?: ?$ElementType<Scalars, 'DateTime'>,
|};


export type MutationCreateTransactionSplitsArgs = {|
  splits: Array<CreateTransactionSplitsInput>,
  transactionId: $ElementType<Scalars, 'ID'>,
|};


export type MutationUpdateTransactionSplitsArgs = {|
  splits: Array<UpdateTransactionSplitsInput>,
  transactionId: $ElementType<Scalars, 'ID'>,
|};


export type MutationDeleteTransactionSplitsArgs = {|
  transactionId: $ElementType<Scalars, 'ID'>,
|};


export type MutationDismissBannerArgs = {|
  name: BannerName,
|};

export type MutationResult = {|
   __typename?: 'MutationResult',
  success: $ElementType<Scalars, 'Boolean'>,
|};

export const NationalityValues = Object.freeze({
  De: 'DE', 
  Ad: 'AD', 
  Ae: 'AE', 
  Af: 'AF', 
  Ag: 'AG', 
  Ai: 'AI', 
  Al: 'AL', 
  Am: 'AM', 
  Ao: 'AO', 
  Aq: 'AQ', 
  Ar: 'AR', 
  As: 'AS', 
  At: 'AT', 
  Au: 'AU', 
  Aw: 'AW', 
  Ax: 'AX', 
  Az: 'AZ', 
  Ba: 'BA', 
  Bb: 'BB', 
  Bd: 'BD', 
  Be: 'BE', 
  Bf: 'BF', 
  Bg: 'BG', 
  Bh: 'BH', 
  Bi: 'BI', 
  Bj: 'BJ', 
  Bl: 'BL', 
  Bm: 'BM', 
  Bn: 'BN', 
  Bo: 'BO', 
  Br: 'BR', 
  Bs: 'BS', 
  Bt: 'BT', 
  Bv: 'BV', 
  Bw: 'BW', 
  By: 'BY', 
  Bz: 'BZ', 
  Ca: 'CA', 
  Cc: 'CC', 
  Cd: 'CD', 
  Cf: 'CF', 
  Cg: 'CG', 
  Ch: 'CH', 
  Ci: 'CI', 
  Ck: 'CK', 
  Cl: 'CL', 
  Cm: 'CM', 
  Cn: 'CN', 
  Co: 'CO', 
  Cr: 'CR', 
  Cu: 'CU', 
  Cv: 'CV', 
  Cw: 'CW', 
  Cx: 'CX', 
  Cy: 'CY', 
  Cz: 'CZ', 
  Dj: 'DJ', 
  Dk: 'DK', 
  Dm: 'DM', 
  Do: 'DO', 
  Dz: 'DZ', 
  Ec: 'EC', 
  Ee: 'EE', 
  Eg: 'EG', 
  Eh: 'EH', 
  Er: 'ER', 
  Es: 'ES', 
  Et: 'ET', 
  Fi: 'FI', 
  Fj: 'FJ', 
  Fk: 'FK', 
  Fm: 'FM', 
  Fo: 'FO', 
  Fr: 'FR', 
  Ga: 'GA', 
  Gb: 'GB', 
  Gd: 'GD', 
  Ge: 'GE', 
  Gf: 'GF', 
  Gg: 'GG', 
  Gh: 'GH', 
  Gi: 'GI', 
  Gl: 'GL', 
  Gm: 'GM', 
  Gn: 'GN', 
  Gp: 'GP', 
  Gq: 'GQ', 
  Gr: 'GR', 
  Gs: 'GS', 
  Gt: 'GT', 
  Gu: 'GU', 
  Gw: 'GW', 
  Gy: 'GY', 
  Hk: 'HK', 
  Hm: 'HM', 
  Hn: 'HN', 
  Hr: 'HR', 
  Ht: 'HT', 
  Hu: 'HU', 
  Id: 'ID', 
  Ie: 'IE', 
  Il: 'IL', 
  Im: 'IM', 
  In: 'IN', 
  Io: 'IO', 
  Iq: 'IQ', 
  Ir: 'IR', 
  Is: 'IS', 
  It: 'IT', 
  Je: 'JE', 
  Jm: 'JM', 
  Jo: 'JO', 
  Jp: 'JP', 
  Ke: 'KE', 
  Kg: 'KG', 
  Kh: 'KH', 
  Ki: 'KI', 
  Km: 'KM', 
  Kn: 'KN', 
  Kp: 'KP', 
  Kr: 'KR', 
  Kw: 'KW', 
  Ky: 'KY', 
  Kz: 'KZ', 
  La: 'LA', 
  Lb: 'LB', 
  Lc: 'LC', 
  Li: 'LI', 
  Lk: 'LK', 
  Lr: 'LR', 
  Ls: 'LS', 
  Lt: 'LT', 
  Lu: 'LU', 
  Lv: 'LV', 
  Ly: 'LY', 
  Ma: 'MA', 
  Mc: 'MC', 
  Md: 'MD', 
  Me: 'ME', 
  Mf: 'MF', 
  Mg: 'MG', 
  Mh: 'MH', 
  Mk: 'MK', 
  Ml: 'ML', 
  Mm: 'MM', 
  Mn: 'MN', 
  Mo: 'MO', 
  Mp: 'MP', 
  Mq: 'MQ', 
  Mr: 'MR', 
  Ms: 'MS', 
  Mt: 'MT', 
  Mu: 'MU', 
  Mv: 'MV', 
  Mw: 'MW', 
  Mx: 'MX', 
  My: 'MY', 
  Mz: 'MZ', 
  Na: 'NA', 
  Nc: 'NC', 
  Ne: 'NE', 
  Nf: 'NF', 
  Ng: 'NG', 
  Ni: 'NI', 
  Nl: 'NL', 
  No: 'NO', 
  Np: 'NP', 
  Nr: 'NR', 
  Nu: 'NU', 
  Nz: 'NZ', 
  Om: 'OM', 
  Pa: 'PA', 
  Pe: 'PE', 
  Pf: 'PF', 
  Pg: 'PG', 
  Ph: 'PH', 
  Pk: 'PK', 
  Pl: 'PL', 
  Pm: 'PM', 
  Pn: 'PN', 
  Pr: 'PR', 
  Ps: 'PS', 
  Pt: 'PT', 
  Pw: 'PW', 
  Py: 'PY', 
  Qa: 'QA', 
  Re: 'RE', 
  Ro: 'RO', 
  Rs: 'RS', 
  Ru: 'RU', 
  Rw: 'RW', 
  Sa: 'SA', 
  Sb: 'SB', 
  Sc: 'SC', 
  Sd: 'SD', 
  Se: 'SE', 
  Sg: 'SG', 
  Si: 'SI', 
  Sj: 'SJ', 
  Sk: 'SK', 
  Sl: 'SL', 
  Sm: 'SM', 
  Sn: 'SN', 
  So: 'SO', 
  Sr: 'SR', 
  Ss: 'SS', 
  St: 'ST', 
  Sv: 'SV', 
  Sx: 'SX', 
  Sy: 'SY', 
  Sz: 'SZ', 
  Tc: 'TC', 
  Td: 'TD', 
  Tf: 'TF', 
  Tg: 'TG', 
  Th: 'TH', 
  Tj: 'TJ', 
  Tk: 'TK', 
  Tl: 'TL', 
  Tm: 'TM', 
  Tn: 'TN', 
  To: 'TO', 
  Tr: 'TR', 
  Tt: 'TT', 
  Tv: 'TV', 
  Tw: 'TW', 
  Tz: 'TZ', 
  Ua: 'UA', 
  Ug: 'UG', 
  Um: 'UM', 
  Us: 'US', 
  Uy: 'UY', 
  Uz: 'UZ', 
  Va: 'VA', 
  Vc: 'VC', 
  Ve: 'VE', 
  Vg: 'VG', 
  Vi: 'VI', 
  Vn: 'VN', 
  Vu: 'VU', 
  Wf: 'WF', 
  Ws: 'WS', 
  Xk: 'XK', 
  Ye: 'YE', 
  Yt: 'YT', 
  Za: 'ZA', 
  Zm: 'ZM', 
  Zw: 'ZW'
});


export type Nationality = $Values<typeof NationalityValues>;

export type Overdraft = {|
   __typename?: 'Overdraft',
  id: $ElementType<Scalars, 'String'>,
  /** Overdraft status */
  status: OverdraftApplicationStatus,
  /** Available overdraft limit */
  limit?: ?$ElementType<Scalars, 'Int'>,
|};

export const OverdraftApplicationStatusValues = Object.freeze({
  Created: 'CREATED', 
  InitialScoringPending: 'INITIAL_SCORING_PENDING', 
  AccountSnapshotPending: 'ACCOUNT_SNAPSHOT_PENDING', 
  AccountSnapshotVerificationPending: 'ACCOUNT_SNAPSHOT_VERIFICATION_PENDING', 
  Offered: 'OFFERED', 
  Rejected: 'REJECTED', 
  OverdraftCreated: 'OVERDRAFT_CREATED'
});


export type OverdraftApplicationStatus = $Values<typeof OverdraftApplicationStatusValues>;

export type PageInfo = {|
   __typename?: 'PageInfo',
  startCursor?: ?$ElementType<Scalars, 'String'>,
  endCursor?: ?$ElementType<Scalars, 'String'>,
  hasNextPage: $ElementType<Scalars, 'Boolean'>,
  hasPreviousPage: $ElementType<Scalars, 'Boolean'>,
|};

export const PaymentFrequencyValues = Object.freeze({
  Monthly: 'MONTHLY', 
  Quarterly: 'QUARTERLY', 
  Yearly: 'YEARLY', 
  None: 'NONE'
});


export type PaymentFrequency = $Values<typeof PaymentFrequencyValues>;

export const PurchaseTypeValues = Object.freeze({
  BasicInitial: 'BASIC_INITIAL', 
  Basic: 'BASIC', 
  Premium: 'PREMIUM', 
  Card: 'CARD', 
  Lexoffice: 'LEXOFFICE'
});


export type PurchaseType = $Values<typeof PurchaseTypeValues>;

export type Query = {|
   __typename?: 'Query',
  /** The current user information */
  viewer?: ?User,
  status: SystemStatus,
|};

export const ScopeTypeValues = Object.freeze({
  Offline: 'OFFLINE', 
  Accounts: 'ACCOUNTS', 
  Users: 'USERS', 
  Transactions: 'TRANSACTIONS', 
  Transfers: 'TRANSFERS', 
  Subscriptions: 'SUBSCRIPTIONS', 
  Statements: 'STATEMENTS', 
  Admin: 'ADMIN', 
  Clients: 'CLIENTS', 
  Overdraft: 'OVERDRAFT'
});


export type ScopeType = $Values<typeof ScopeTypeValues>;

export type SepaTransfer = {|
   __typename?: 'SepaTransfer',
  /** The status of the SEPA Transfer */
  status: SepaTransferStatus,
  /** The amount of the SEPA Transfer in cents */
  amount: $ElementType<Scalars, 'Int'>,
  /** The purpose of the SEPA Transfer - 140 max characters */
  purpose?: ?$ElementType<Scalars, 'String'>,
  id: $ElementType<Scalars, 'String'>,
  /** The name of the SEPA Transfer recipient */
  recipient: $ElementType<Scalars, 'String'>,
  /** The IBAN of the SEPA Transfer recipient */
  iban: $ElementType<Scalars, 'String'>,
  /** The end to end ID of the SEPA Transfer */
  e2eId?: ?$ElementType<Scalars, 'String'>,
|};

export const SepaTransferStatusValues = Object.freeze({
  Authorized: 'AUTHORIZED', 
  Confirmed: 'CONFIRMED', 
  Booked: 'BOOKED'
});


export type SepaTransferStatus = $Values<typeof SepaTransferStatusValues>;

export const StandingOrderReoccurenceTypeValues = Object.freeze({
  Monthly: 'MONTHLY', 
  Quarterly: 'QUARTERLY', 
  EverySixMonths: 'EVERY_SIX_MONTHS', 
  Annually: 'ANNUALLY'
});


export type StandingOrderReoccurenceType = $Values<typeof StandingOrderReoccurenceTypeValues>;

export const StatusValues = Object.freeze({
  Error: 'ERROR'
});


export type Status = $Values<typeof StatusValues>;

export type Subscription = {|
   __typename?: 'Subscription',
  newTransaction: Transaction,
|};

export type SystemStatus = {|
   __typename?: 'SystemStatus',
  type?: ?Status,
  message?: ?$ElementType<Scalars, 'String'>,
|};

export type TaxYearSetting = {|
   __typename?: 'TaxYearSetting',
  /** Tax year the individual settings apply to */
  year: $ElementType<Scalars, 'Int'>,
  /** Tax rate that should be applied in the corresponding year */
  taxRate?: ?$ElementType<Scalars, 'Int'>,
  /** Flag if the corresponding year should be excluded from the tax calculations completely */
  excluded?: ?$ElementType<Scalars, 'Boolean'>,
|};

export type TaxYearSettingInput = {|
  /** Tax year the individual settings apply to */
  year: $ElementType<Scalars, 'Int'>,
  /** Tax rate that should be applied in the corresponding year */
  taxRate?: ?$ElementType<Scalars, 'Int'>,
  /** Flag if the corresponding year should be excluded from the tax calculations completely */
  excluded?: ?$ElementType<Scalars, 'Boolean'>,
|};

export type Transaction = {|
   __typename?: 'Transaction',
  id: $ElementType<Scalars, 'ID'>,
  /** The amount of the transaction in cents */
  amount: $ElementType<Scalars, 'Int'>,
  iban?: ?$ElementType<Scalars, 'String'>,
  type: TransactionProjectionType,
  /** The date at which the transaction was processed and the amount deducted from the user's account */
  valutaDate?: ?$ElementType<Scalars, 'DateTime'>,
  e2eId?: ?$ElementType<Scalars, 'String'>,
  mandateNumber?: ?$ElementType<Scalars, 'String'>,
  fees: Array<TransactionFee>,
  /** Metadata of separate pseudo-transactions created when splitting the parent transaction */
  splits: Array<TransactionSplit>,
  /** The date at which the transaction was booked (created) */
  bookingDate: $ElementType<Scalars, 'DateTime'>,
  directDebitFees: Array<DirectDebitFee>,
  name?: ?$ElementType<Scalars, 'String'>,
  paymentMethod: $ElementType<Scalars, 'String'>,
  category?: ?TransactionCategory,
  /** When a transaction corresponds to a tax or vat payment, the user may specify at which date it should be considered booked */
  userSelectedBookingDate?: ?$ElementType<Scalars, 'DateTime'>,
  purpose?: ?$ElementType<Scalars, 'String'>,
  documentNumber?: ?$ElementType<Scalars, 'String'>,
  documentPreviewUrl?: ?$ElementType<Scalars, 'String'>,
  documentDownloadUrl?: ?$ElementType<Scalars, 'String'>,
  documentType?: ?DocumentType,
  foreignCurrency?: ?$ElementType<Scalars, 'String'>,
  originalAmount?: ?$ElementType<Scalars, 'Int'>,
|};

export const TransactionCategoryValues = Object.freeze({
  Private: 'PRIVATE', 
  Vat: 'VAT', 
  Vat_0: 'VAT_0', 
  Vat_7: 'VAT_7', 
  Vat_19: 'VAT_19', 
  TaxPayment: 'TAX_PAYMENT', 
  VatPayment: 'VAT_PAYMENT', 
  TaxRefund: 'TAX_REFUND', 
  VatRefund: 'VAT_REFUND', 
  VatSaving: 'VAT_SAVING', 
  TaxSaving: 'TAX_SAVING'
});


export type TransactionCategory = $Values<typeof TransactionCategoryValues>;

export type TransactionCondition = {|
  operator?: ?BaseOperator,
  amount_lt?: ?$ElementType<Scalars, 'Int'>,
  amount_gt?: ?$ElementType<Scalars, 'Int'>,
  amount_gte?: ?$ElementType<Scalars, 'Int'>,
  amount_lte?: ?$ElementType<Scalars, 'Int'>,
  amount_eq?: ?$ElementType<Scalars, 'Int'>,
  amount_ne?: ?$ElementType<Scalars, 'Int'>,
  amount_in?: ?Array<$ElementType<Scalars, 'Int'>>,
  iban_eq?: ?$ElementType<Scalars, 'String'>,
  iban_ne?: ?$ElementType<Scalars, 'String'>,
  iban_like?: ?$ElementType<Scalars, 'String'>,
  iban_likeAny?: ?Array<$ElementType<Scalars, 'String'>>,
  iban_in?: ?Array<$ElementType<Scalars, 'String'>>,
  valutaDate_eq?: ?$ElementType<Scalars, 'DateTime'>,
  valutaDate_ne?: ?$ElementType<Scalars, 'DateTime'>,
  valutaDate_gt?: ?$ElementType<Scalars, 'DateTime'>,
  valutaDate_lt?: ?$ElementType<Scalars, 'DateTime'>,
  valutaDate_gte?: ?$ElementType<Scalars, 'DateTime'>,
  valutaDate_lte?: ?$ElementType<Scalars, 'DateTime'>,
  bookingDate_eq?: ?$ElementType<Scalars, 'DateTime'>,
  bookingDate_ne?: ?$ElementType<Scalars, 'DateTime'>,
  bookingDate_gt?: ?$ElementType<Scalars, 'DateTime'>,
  bookingDate_lt?: ?$ElementType<Scalars, 'DateTime'>,
  bookingDate_gte?: ?$ElementType<Scalars, 'DateTime'>,
  bookingDate_lte?: ?$ElementType<Scalars, 'DateTime'>,
  name_eq?: ?$ElementType<Scalars, 'String'>,
  name_ne?: ?$ElementType<Scalars, 'String'>,
  name_like?: ?$ElementType<Scalars, 'String'>,
  name_likeAny?: ?Array<$ElementType<Scalars, 'String'>>,
  name_in?: ?Array<$ElementType<Scalars, 'String'>>,
  purpose_eq?: ?$ElementType<Scalars, 'String'>,
  purpose_ne?: ?$ElementType<Scalars, 'String'>,
  purpose_like?: ?$ElementType<Scalars, 'String'>,
  purpose_likeAny?: ?Array<$ElementType<Scalars, 'String'>>,
|};

export type TransactionFee = {|
   __typename?: 'TransactionFee',
  type: TransactionFeeType,
  status: TransactionFeeStatus,
  unitAmount?: ?$ElementType<Scalars, 'Int'>,
  usedAt?: ?$ElementType<Scalars, 'DateTime'>,
|};

export const TransactionFeeStatusValues = Object.freeze({
  Created: 'CREATED', 
  Charged: 'CHARGED', 
  Refunded: 'REFUNDED', 
  Cancelled: 'CANCELLED', 
  RefundInitiated: 'REFUND_INITIATED'
});


export type TransactionFeeStatus = $Values<typeof TransactionFeeStatusValues>;

export const TransactionFeeTypeValues = Object.freeze({
  Atm: 'ATM', 
  ForeignTransaction: 'FOREIGN_TRANSACTION', 
  DirectDebitReturn: 'DIRECT_DEBIT_RETURN', 
  SecondReminderEmail: 'SECOND_REMINDER_EMAIL', 
  CardReplacement: 'CARD_REPLACEMENT'
});


export type TransactionFeeType = $Values<typeof TransactionFeeTypeValues>;

export type TransactionFilter = {|
  operator?: ?BaseOperator,
  amount_lt?: ?$ElementType<Scalars, 'Int'>,
  amount_gt?: ?$ElementType<Scalars, 'Int'>,
  amount_gte?: ?$ElementType<Scalars, 'Int'>,
  amount_lte?: ?$ElementType<Scalars, 'Int'>,
  amount_eq?: ?$ElementType<Scalars, 'Int'>,
  amount_ne?: ?$ElementType<Scalars, 'Int'>,
  amount_in?: ?Array<$ElementType<Scalars, 'Int'>>,
  iban_eq?: ?$ElementType<Scalars, 'String'>,
  iban_ne?: ?$ElementType<Scalars, 'String'>,
  iban_like?: ?$ElementType<Scalars, 'String'>,
  iban_likeAny?: ?Array<$ElementType<Scalars, 'String'>>,
  iban_in?: ?Array<$ElementType<Scalars, 'String'>>,
  valutaDate_eq?: ?$ElementType<Scalars, 'DateTime'>,
  valutaDate_ne?: ?$ElementType<Scalars, 'DateTime'>,
  valutaDate_gt?: ?$ElementType<Scalars, 'DateTime'>,
  valutaDate_lt?: ?$ElementType<Scalars, 'DateTime'>,
  valutaDate_gte?: ?$ElementType<Scalars, 'DateTime'>,
  valutaDate_lte?: ?$ElementType<Scalars, 'DateTime'>,
  bookingDate_eq?: ?$ElementType<Scalars, 'DateTime'>,
  bookingDate_ne?: ?$ElementType<Scalars, 'DateTime'>,
  bookingDate_gt?: ?$ElementType<Scalars, 'DateTime'>,
  bookingDate_lt?: ?$ElementType<Scalars, 'DateTime'>,
  bookingDate_gte?: ?$ElementType<Scalars, 'DateTime'>,
  bookingDate_lte?: ?$ElementType<Scalars, 'DateTime'>,
  name_eq?: ?$ElementType<Scalars, 'String'>,
  name_ne?: ?$ElementType<Scalars, 'String'>,
  name_like?: ?$ElementType<Scalars, 'String'>,
  name_likeAny?: ?Array<$ElementType<Scalars, 'String'>>,
  name_in?: ?Array<$ElementType<Scalars, 'String'>>,
  purpose_eq?: ?$ElementType<Scalars, 'String'>,
  purpose_ne?: ?$ElementType<Scalars, 'String'>,
  purpose_like?: ?$ElementType<Scalars, 'String'>,
  purpose_likeAny?: ?Array<$ElementType<Scalars, 'String'>>,
  conditions?: ?Array<TransactionCondition>,
|};

export const TransactionProjectionTypeValues = Object.freeze({
  CreditPresentment: 'CREDIT_PRESENTMENT', 
  CashManual: 'CASH_MANUAL', 
  Atm: 'ATM', 
  CancelManualLoad: 'CANCEL_MANUAL_LOAD', 
  CardUsage: 'CARD_USAGE', 
  DirectDebitAutomaticTopup: 'DIRECT_DEBIT_AUTOMATIC_TOPUP', 
  DirectDebitReturn: 'DIRECT_DEBIT_RETURN', 
  DisputeClearing: 'DISPUTE_CLEARING', 
  ManualLoad: 'MANUAL_LOAD', 
  WireTransferTopup: 'WIRE_TRANSFER_TOPUP', 
  TransferToBankAccount: 'TRANSFER_TO_BANK_ACCOUNT', 
  CancellationBooking: 'CANCELLATION_BOOKING', 
  CancellationDoubleBooking: 'CANCELLATION_DOUBLE_BOOKING', 
  CreditTransferCancellation: 'CREDIT_TRANSFER_CANCELLATION', 
  CurrencyTransactionCancellation: 'CURRENCY_TRANSACTION_CANCELLATION', 
  DirectDebit: 'DIRECT_DEBIT', 
  ForeignPayment: 'FOREIGN_PAYMENT', 
  Other: 'OTHER', 
  SepaCreditTransferReturn: 'SEPA_CREDIT_TRANSFER_RETURN', 
  SepaCreditTransfer: 'SEPA_CREDIT_TRANSFER', 
  SepaDirectDebitReturn: 'SEPA_DIRECT_DEBIT_RETURN', 
  SepaDirectDebit: 'SEPA_DIRECT_DEBIT', 
  Transfer: 'TRANSFER', 
  InternationalCreditTransfer: 'INTERNATIONAL_CREDIT_TRANSFER', 
  CancellationSepaDirectDebitReturn: 'CANCELLATION_SEPA_DIRECT_DEBIT_RETURN', 
  Rebooking: 'REBOOKING', 
  CancellationDirectDebit: 'CANCELLATION_DIRECT_DEBIT', 
  CancellationSepaCreditTransferReturn: 'CANCELLATION_SEPA_CREDIT_TRANSFER_RETURN', 
  CardTransaction: 'CARD_TRANSACTION', 
  InterestAccrued: 'INTEREST_ACCRUED', 
  CancellationInterestAccrued: 'CANCELLATION_INTEREST_ACCRUED'
});


export type TransactionProjectionType = $Values<typeof TransactionProjectionTypeValues>;

export type TransactionsConnection = {|
   __typename?: 'TransactionsConnection',
  edges: Array<TransactionsConnectionEdge>,
  pageInfo: PageInfo,
|};

export type TransactionsConnectionEdge = {|
   __typename?: 'TransactionsConnectionEdge',
  node: Transaction,
  cursor: $ElementType<Scalars, 'String'>,
|};

export type TransactionSplit = {|
   __typename?: 'TransactionSplit',
  id: $ElementType<Scalars, 'ID'>,
  amount: $ElementType<Scalars, 'Int'>,
  category: TransactionCategory,
  userSelectedBookingDate?: ?$ElementType<Scalars, 'DateTime'>,
|};

export type Transfer = {|
   __typename?: 'Transfer',
  id: $ElementType<Scalars, 'String'>,
  /** The name of the transfer recipient */
  recipient: $ElementType<Scalars, 'String'>,
  /** The IBAN of the transfer recipient */
  iban: $ElementType<Scalars, 'String'>,
  /** The amount of the transfer in cents */
  amount: $ElementType<Scalars, 'Int'>,
  /** The status of the transfer */
  status?: ?TransferStatus,
  /** The date at which the payment will be executed for Timed Orders or Standing Orders */
  executeAt?: ?$ElementType<Scalars, 'DateTime'>,
  /** The date at which the last payment will be executed for Standing Orders */
  lastExecutionDate?: ?$ElementType<Scalars, 'DateTime'>,
  /** The purpose of the transfer - 140 max characters */
  purpose?: ?$ElementType<Scalars, 'String'>,
  /** The end to end ID of the transfer */
  e2eId?: ?$ElementType<Scalars, 'String'>,
  /** The reoccurrence type of the payments for Standing Orders */
  reoccurrence?: ?StandingOrderReoccurenceType,
  /** The date at which the next payment will be executed for Standing Orders */
  nextOccurrence?: ?$ElementType<Scalars, 'DateTime'>,
  /** The user selected category for the SEPA Transfer */
  category?: ?TransactionCategory,
  /** When a transaction corresponds to a tax or vat payment, the user may specify at which date it should be considered booked */
  userSelectedBookingDate?: ?$ElementType<Scalars, 'DateTime'>,
|};

export type TransfersConnection = {|
   __typename?: 'TransfersConnection',
  edges: Array<TransfersConnectionEdge>,
  pageInfo: PageInfo,
|};

export type TransfersConnectionEdge = {|
   __typename?: 'TransfersConnectionEdge',
  node: Transfer,
  cursor: $ElementType<Scalars, 'String'>,
|};

export type TransfersConnectionFilter = {|
  status?: ?TransferStatus,
|};

export const TransferStatusValues = Object.freeze({
  Authorized: 'AUTHORIZED', 
  Confirmed: 'CONFIRMED', 
  Booked: 'BOOKED', 
  Created: 'CREATED', 
  Active: 'ACTIVE', 
  Inactive: 'INACTIVE', 
  Canceled: 'CANCELED', 
  AuthorizationRequired: 'AUTHORIZATION_REQUIRED', 
  ConfirmationRequired: 'CONFIRMATION_REQUIRED', 
  Scheduled: 'SCHEDULED', 
  Executed: 'EXECUTED', 
  Failed: 'FAILED'
});


export type TransferStatus = $Values<typeof TransferStatusValues>;

export type TransferSuggestion = {|
   __typename?: 'TransferSuggestion',
  iban: $ElementType<Scalars, 'String'>,
  name: $ElementType<Scalars, 'String'>,
|};

export const TransferTypeValues = Object.freeze({
  SepaTransfer: 'SEPA_TRANSFER', 
  StandingOrder: 'STANDING_ORDER', 
  TimedOrder: 'TIMED_ORDER'
});


export type TransferType = $Values<typeof TransferTypeValues>;

/** The available fields to update an OAuth2 client */
export type UpdateClientInput = {|
  /** The name of the OAuth2 client displayed when users log in */
  name?: ?$ElementType<Scalars, 'String'>,
  /** The OAuth2 client secret */
  secret?: ?$ElementType<Scalars, 'String'>,
  /** The URL to redirect to after authentication */
  redirectUri?: ?$ElementType<Scalars, 'String'>,
  /** The grant types (i.e. ways to obtain access tokens) allowed for the client */
  grantTypes?: ?Array<GrantType>,
  /** The scopes the client has access to, limiting access to the corresponding parts of the API */
  scopes?: ?Array<ScopeType>,
  /** The id of the OAuth2 client to update */
  id: $ElementType<Scalars, 'String'>,
|};

export type UpdateSubscriptionPlanResult = {|
   __typename?: 'UpdateSubscriptionPlanResult',
  newPlan: $ElementType<Scalars, 'String'>,
  previousPlans: Array<PurchaseType>,
  hasOrderedPhysicalCard: $ElementType<Scalars, 'Boolean'>,
  updateActiveAt: $ElementType<Scalars, 'String'>,
  hasCanceledDowngrade: $ElementType<Scalars, 'Boolean'>,
|};

export type UpdateTransactionSplitsInput = {|
  id: $ElementType<Scalars, 'Int'>,
  amount: $ElementType<Scalars, 'Int'>,
  category: TransactionCategory,
  userSelectedBookingDate?: ?$ElementType<Scalars, 'DateTime'>,
|};

/** The available fields to update a transfer */
export type UpdateTransferInput = {|
  /** The ID of the transfer to update */
  id: $ElementType<Scalars, 'String'>,
  /** The type of transfer to update, currently only Standing Orders are supported */
  type: TransferType,
  /** The amount of the Standing Order payment in cents */
  amount?: ?$ElementType<Scalars, 'Int'>,
  /** The date at which the last payment will be executed */
  lastExecutionDate?: ?$ElementType<Scalars, 'DateTime'>,
  /** The purpose of the Standing Order - 140 max characters, if not specified with the update, it will be set to null */
  purpose?: ?$ElementType<Scalars, 'String'>,
  /** The end to end ID of the Standing Order, if not specified with the update, it will be set to null */
  e2eId?: ?$ElementType<Scalars, 'String'>,
  /** The reoccurrence type of the payments for Standing Orders */
  reoccurrence?: ?StandingOrderReoccurenceType,
  /** The user selected category for the SEPA Transfer */
  category?: ?TransactionCategory,
  /** When a transaction corresponds to a tax or vat payment, the user may specify at which date it should be considered booked */
  userSelectedBookingDate?: ?$ElementType<Scalars, 'DateTime'>,
|};

export type User = {|
   __typename?: 'User',
  email: $ElementType<Scalars, 'String'>,
  createdAt: $ElementType<Scalars, 'DateTime'>,
  vatCutoffLine?: ?$ElementType<Scalars, 'DateTime'>,
  taxCutoffLine?: ?$ElementType<Scalars, 'DateTime'>,
  vatPaymentFrequency?: ?PaymentFrequency,
  taxPaymentFrequency?: ?PaymentFrequency,
  taxRate?: ?$ElementType<Scalars, 'Int'>,
  vatRate?: ?$ElementType<Scalars, 'Int'>,
  /** The user's IDNow identification status */
  identificationStatus?: ?IdentificationStatus,
  /** The link to use for IDNow identification */
  identificationLink?: ?$ElementType<Scalars, 'String'>,
  gender?: ?Gender,
  firstName?: ?$ElementType<Scalars, 'String'>,
  lastName?: ?$ElementType<Scalars, 'String'>,
  birthPlace?: ?$ElementType<Scalars, 'String'>,
  birthDate?: ?$ElementType<Scalars, 'DateTime'>,
  nationality?: ?Nationality,
  street?: ?$ElementType<Scalars, 'String'>,
  postCode?: ?$ElementType<Scalars, 'String'>,
  city?: ?$ElementType<Scalars, 'String'>,
  mobileNumber?: ?$ElementType<Scalars, 'String'>,
  untrustedPhoneNumber?: ?$ElementType<Scalars, 'String'>,
  /** Indicates whether the user pays taxes in the US */
  isUSPerson?: ?$ElementType<Scalars, 'Boolean'>,
  companyType?: ?CompanyType,
  publicId: $ElementType<Scalars, 'ID'>,
  language?: ?$ElementType<Scalars, 'String'>,
  country?: ?$ElementType<Scalars, 'String'>,
  /** Business description provided by the user */
  businessPurpose?: ?$ElementType<Scalars, 'String'>,
  /** The economic sector of the user's business */
  economicSector?: ?$ElementType<Scalars, 'String'>,
  /** Business economic sector provided by the user */
  otherEconomicSector?: ?$ElementType<Scalars, 'String'>,
  vatNumber?: ?$ElementType<Scalars, 'String'>,
  /** The user's referral code to use for promotional purposes */
  referralCode?: ?$ElementType<Scalars, 'String'>,
  /** The list of all OAuth2 clients for the current user */
  clients: Array<Client>,
  /** The details of an existing OAuth2 client */
  client?: ?Client,
  mainAccount?: ?Account,
|};


export type UserClientArgs = {|
  id: $ElementType<Scalars, 'String'>,
|};

export type WhitelistCardResponse = {|
   __typename?: 'WhitelistCardResponse',
  id: $ElementType<Scalars, 'String'>,
  resolution: $ElementType<Scalars, 'String'>,
  whitelisted_until: $ElementType<Scalars, 'String'>,
|};
