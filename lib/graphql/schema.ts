export type Maybe<T> = T | null;
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string,
  String: string,
  Boolean: boolean,
  Int: number,
  Float: number,
  /** The javascript `Date` as string. Type represents date and time as the ISO Date string. */
  DateTime: any,
};

/** The bank account of the current user */
export type Account = {
   __typename?: 'Account',
  iban: Scalars['String'],
  cardHolderRepresentation?: Maybe<Scalars['String']>,
  balance: Scalars['Int'],
  cardHolderRepresentations: Array<Scalars['String']>,
  transfers: TransfersConnection,
  transaction?: Maybe<Transaction>,
  transactions: TransactionsConnection,
  transfer?: Maybe<Transfer>,
  /** Individual tax-related settings per year */
  taxYearSettings: Array<TaxYearSetting>,
  /** 
 * A list of iban/name combinations based on existing user's transactions,
   * provided to assist users when creating new transfers
 **/
  transferSuggestions?: Maybe<Array<TransferSuggestion>>,
  cards: Array<Card>,
  card?: Maybe<Card>,
  /** Overdraft Application - only available for Kontist Application */
  overdraft?: Maybe<Overdraft>,
};


/** The bank account of the current user */
export type AccountTransfersArgs = {
  where?: Maybe<TransfersConnectionFilter>,
  type: TransferType,
  first?: Maybe<Scalars['Int']>,
  last?: Maybe<Scalars['Int']>,
  after?: Maybe<Scalars['String']>,
  before?: Maybe<Scalars['String']>
};


/** The bank account of the current user */
export type AccountTransactionArgs = {
  id: Scalars['ID']
};


/** The bank account of the current user */
export type AccountTransactionsArgs = {
  filter?: Maybe<TransactionFilter>,
  first?: Maybe<Scalars['Int']>,
  last?: Maybe<Scalars['Int']>,
  after?: Maybe<Scalars['String']>,
  before?: Maybe<Scalars['String']>
};


/** The bank account of the current user */
export type AccountTransferArgs = {
  id: Scalars['ID'],
  type: TransferType
};


/** The bank account of the current user */
export type AccountCardArgs = {
  filter?: Maybe<CardFilter>
};

export enum BaseOperator {
  Or = 'OR',
  And = 'AND'
}

export type BatchTransfer = {
   __typename?: 'BatchTransfer',
  id: Scalars['String'],
  status: BatchTransferStatus,
  transfers: Array<SepaTransfer>,
};

export enum BatchTransferStatus {
  AuthorizationRequired = 'AUTHORIZATION_REQUIRED',
  ConfirmationRequired = 'CONFIRMATION_REQUIRED',
  Accepted = 'ACCEPTED',
  Failed = 'FAILED',
  Successful = 'SUCCESSFUL'
}

export type Card = {
   __typename?: 'Card',
  id: Scalars['String'],
  status: CardStatus,
  type: CardType,
  pinSet: Scalars['Boolean'],
  holder?: Maybe<Scalars['String']>,
  formattedExpirationDate?: Maybe<Scalars['String']>,
  maskedPan?: Maybe<Scalars['String']>,
  settings: CardSettings,
};

export enum CardAction {
  Close = 'CLOSE',
  Block = 'BLOCK',
  Unblock = 'UNBLOCK'
}

export type CardFilter = {
  id?: Maybe<Scalars['String']>,
  type?: Maybe<CardType>,
};

export type CardLimit = {
   __typename?: 'CardLimit',
  maxAmountCents: Scalars['Float'],
  maxTransactions: Scalars['Float'],
};

export type CardLimitInput = {
  maxAmountCents: Scalars['Float'],
  maxTransactions: Scalars['Float'],
};

export type CardLimits = {
   __typename?: 'CardLimits',
  daily: CardLimit,
  monthly: CardLimit,
};

export type CardLimitsInput = {
  daily: CardLimitInput,
  monthly: CardLimitInput,
};

export type CardSettings = {
   __typename?: 'CardSettings',
  contactlessEnabled: Scalars['Boolean'],
  cardPresentLimits?: Maybe<CardLimits>,
  cardNotPresentLimits?: Maybe<CardLimits>,
};

export type CardSettingsInput = {
  cardPresentLimits?: Maybe<CardLimitsInput>,
  cardNotPresentLimits?: Maybe<CardLimitsInput>,
  contactlessEnabled?: Maybe<Scalars['Boolean']>,
};

export enum CardStatus {
  Processing = 'PROCESSING',
  Inactive = 'INACTIVE',
  Active = 'ACTIVE',
  Blocked = 'BLOCKED',
  BlockedBySolaris = 'BLOCKED_BY_SOLARIS',
  ActivationBlockedBySolaris = 'ACTIVATION_BLOCKED_BY_SOLARIS',
  Closed = 'CLOSED',
  ClosedBySolaris = 'CLOSED_BY_SOLARIS'
}

export enum CardType {
  VirtualVisaBusinessDebit = 'VIRTUAL_VISA_BUSINESS_DEBIT',
  VisaBusinessDebit = 'VISA_BUSINESS_DEBIT',
  MastercardBusinessDebit = 'MASTERCARD_BUSINESS_DEBIT',
  VirtualMastercardBusinessDebit = 'VIRTUAL_MASTERCARD_BUSINESS_DEBIT',
  VirtualVisaFreelanceDebit = 'VIRTUAL_VISA_FREELANCE_DEBIT'
}

export type Client = {
   __typename?: 'Client',
  id: Scalars['ID'],
  /** The URL to redirect to after authentication */
  redirectUri?: Maybe<Scalars['String']>,
  /** The name of the OAuth2 client displayed when users log in */
  name: Scalars['String'],
  /** The grant types (i.e. ways to obtain access tokens) allowed for the client */
  grantTypes?: Maybe<Array<GrantType>>,
  /** The scopes the client has access to, limiting access to the corresponding parts of the API */
  scopes?: Maybe<Array<ScopeType>>,
};

export enum CompanyType {
  Selbstaendig = 'SELBSTAENDIG',
  Einzelunternehmer = 'EINZELUNTERNEHMER',
  Freiberufler = 'FREIBERUFLER',
  Gewerbetreibender = 'GEWERBETREIBENDER',
  Limited = 'LIMITED',
  EK = 'E_K',
  Partgg = 'PARTGG',
  Gbr = 'GBR',
  Ohg = 'OHG',
  Kg = 'KG',
  Kgaa = 'KGAA',
  Gmbh = 'GMBH',
  GmbhUndCoKg = 'GMBH_UND_CO_KG',
  Ug = 'UG'
}

export type ConfirmationRequest = {
   __typename?: 'ConfirmationRequest',
  confirmationId: Scalars['String'],
};

export type ConfirmationRequestOrTransfer = ConfirmationRequest | Transfer;

export type ConfirmationStatus = {
   __typename?: 'ConfirmationStatus',
  status: Scalars['String'],
};

export type ConfirmFraudResponse = {
   __typename?: 'ConfirmFraudResponse',
  id: Scalars['String'],
  resolution: Scalars['String'],
};

/** The available fields to create an OAuth2 client */
export type CreateClientInput = {
  /** The name of the OAuth2 client displayed when users log in */
  name: Scalars['String'],
  /** The OAuth2 client secret */
  secret?: Maybe<Scalars['String']>,
  /** The URL to redirect to after authentication */
  redirectUri?: Maybe<Scalars['String']>,
  /** The grant types (i.e. ways to obtain access tokens) allowed for the client */
  grantTypes: Array<GrantType>,
  /** The scopes the client has access to, limiting access to the corresponding parts of the API */
  scopes: Array<ScopeType>,
};

/** The available fields to create a SEPA Transfer */
export type CreateSepaTransferInput = {
  /** The name of the SEPA Transfer recipient */
  recipient: Scalars['String'],
  /** The IBAN of the SEPA Transfer recipient */
  iban: Scalars['String'],
  /** The amount of the SEPA Transfer in cents */
  amount: Scalars['Int'],
  /** The purpose of the SEPA Transfer - 140 max characters */
  purpose?: Maybe<Scalars['String']>,
  /** The end to end ID of the SEPA Transfer */
  e2eId?: Maybe<Scalars['String']>,
};

/** The available fields to create a transfer */
export type CreateTransferInput = {
  /** The name of the transfer recipient */
  recipient: Scalars['String'],
  /** The IBAN of the transfer recipient */
  iban: Scalars['String'],
  /** The amount of the transfer in cents */
  amount: Scalars['Int'],
  /** The date at which the payment will be executed for Timed Orders or Standing Orders */
  executeAt?: Maybe<Scalars['DateTime']>,
  /** The date at which the last payment will be executed for Standing Orders */
  lastExecutionDate?: Maybe<Scalars['DateTime']>,
  /** The purpose of the transfer - 140 max characters */
  purpose?: Maybe<Scalars['String']>,
  /** The end to end ID of the transfer */
  e2eId?: Maybe<Scalars['String']>,
  /** The reoccurrence type of the payments for Standing Orders */
  reoccurrence?: Maybe<StandingOrderReoccurenceType>,
  /** The user selected category for the SEPA Transfer */
  category?: Maybe<TransactionCategory>,
  /** When a transaction corresponds to a tax or vat payment, the user may specify at which date it should be considered booked */
  userSelectedBookingDate?: Maybe<Scalars['DateTime']>,
};


export type DirectDebitFee = {
   __typename?: 'DirectDebitFee',
  id: Scalars['Int'],
  type: TransactionFeeType,
  name: Scalars['String'],
  amount: Scalars['Int'],
  usedAt?: Maybe<Scalars['DateTime']>,
  invoiceStatus: InvoiceStatus,
};

export enum DocumentType {
  Voucher = 'VOUCHER',
  Invoice = 'INVOICE'
}

export enum Gender {
  Male = 'MALE',
  Female = 'FEMALE'
}

export enum GrantType {
  Password = 'PASSWORD',
  AuthorizationCode = 'AUTHORIZATION_CODE',
  RefreshToken = 'REFRESH_TOKEN',
  ClientCredentials = 'CLIENT_CREDENTIALS'
}

export enum IdentificationStatus {
  Pending = 'PENDING',
  PendingSuccessful = 'PENDING_SUCCESSFUL',
  PendingFailed = 'PENDING_FAILED',
  Successful = 'SUCCESSFUL',
  Failed = 'FAILED',
  Expired = 'EXPIRED',
  Created = 'CREATED',
  Aborted = 'ABORTED',
  Canceled = 'CANCELED'
}

export enum InvoiceStatus {
  Open = 'OPEN',
  Closed = 'CLOSED',
  Rejected = 'REJECTED',
  Pending = 'PENDING'
}

export type Mutation = {
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
  setCardHolderRepresentation: Scalars['String'],
  /** Categorize a transaction with an optional custom booking date for VAT or Tax categories */
  categorizeTransaction: Transaction,
  /** Create Overdraft Application  - only available for Kontist Application */
  requestOverdraft?: Maybe<Overdraft>,
};


export type MutationCancelTransferArgs = {
  id: Scalars['String'],
  type: TransferType
};


export type MutationConfirmCancelTransferArgs = {
  authorizationToken: Scalars['String'],
  confirmationId: Scalars['String'],
  type: TransferType
};


export type MutationCreateClientArgs = {
  client: CreateClientInput
};


export type MutationUpdateClientArgs = {
  client: UpdateClientInput
};


export type MutationDeleteClientArgs = {
  id: Scalars['String']
};


export type MutationUpdateTaxYearSettingsArgs = {
  taxYearSettings: Array<TaxYearSettingInput>
};


export type MutationCreateTransferArgs = {
  transfer: CreateTransferInput
};


export type MutationUpdateTransferArgs = {
  transfer: UpdateTransferInput
};


export type MutationConfirmTransferArgs = {
  authorizationToken: Scalars['String'],
  confirmationId: Scalars['String']
};


export type MutationCreateTransfersArgs = {
  transfers: Array<CreateSepaTransferInput>
};


export type MutationConfirmTransfersArgs = {
  authorizationToken: Scalars['String'],
  confirmationId: Scalars['String']
};


export type MutationWhitelistCardArgs = {
  fraudCaseId: Scalars['String'],
  id: Scalars['String']
};


export type MutationConfirmFraudArgs = {
  fraudCaseId: Scalars['String'],
  id: Scalars['String']
};


export type MutationCreateCardArgs = {
  type: CardType,
  cardHolderRepresentation?: Maybe<Scalars['String']>
};


export type MutationActivateCardArgs = {
  verificationToken: Scalars['String'],
  id: Scalars['String']
};


export type MutationUpdateCardSettingsArgs = {
  settings: CardSettingsInput,
  id: Scalars['String']
};


export type MutationChangeCardStatusArgs = {
  id: Scalars['String'],
  action: CardAction
};


export type MutationChangeCardPinArgs = {
  pin: Scalars['String'],
  id: Scalars['String']
};


export type MutationConfirmChangeCardPinArgs = {
  authorizationToken: Scalars['String'],
  confirmationId: Scalars['String'],
  id: Scalars['String']
};


export type MutationReplaceCardArgs = {
  id: Scalars['String']
};


export type MutationReorderCardArgs = {
  id: Scalars['String']
};


export type MutationSetCardHolderRepresentationArgs = {
  cardHolderRepresentation: Scalars['String']
};


export type MutationCategorizeTransactionArgs = {
  id: Scalars['String'],
  category?: Maybe<TransactionCategory>,
  userSelectedBookingDate?: Maybe<Scalars['DateTime']>
};

export enum Nationality {
  De = 'DE',
  Ad = 'AD',
  Ae = 'AE',
  Af = 'AF',
  Ag = 'AG',
  Ai = 'AI',
  Al = 'AL',
  Am = 'AM',
  Ao = 'AO',
  Aq = 'AQ',
  Ar = 'AR',
  As = 'AS',
  At = 'AT',
  Au = 'AU',
  Aw = 'AW',
  Ax = 'AX',
  Az = 'AZ',
  Ba = 'BA',
  Bb = 'BB',
  Bd = 'BD',
  Be = 'BE',
  Bf = 'BF',
  Bg = 'BG',
  Bh = 'BH',
  Bi = 'BI',
  Bj = 'BJ',
  Bl = 'BL',
  Bm = 'BM',
  Bn = 'BN',
  Bo = 'BO',
  Br = 'BR',
  Bs = 'BS',
  Bt = 'BT',
  Bv = 'BV',
  Bw = 'BW',
  By = 'BY',
  Bz = 'BZ',
  Ca = 'CA',
  Cc = 'CC',
  Cd = 'CD',
  Cf = 'CF',
  Cg = 'CG',
  Ch = 'CH',
  Ci = 'CI',
  Ck = 'CK',
  Cl = 'CL',
  Cm = 'CM',
  Cn = 'CN',
  Co = 'CO',
  Cr = 'CR',
  Cu = 'CU',
  Cv = 'CV',
  Cw = 'CW',
  Cx = 'CX',
  Cy = 'CY',
  Cz = 'CZ',
  Dj = 'DJ',
  Dk = 'DK',
  Dm = 'DM',
  Do = 'DO',
  Dz = 'DZ',
  Ec = 'EC',
  Ee = 'EE',
  Eg = 'EG',
  Eh = 'EH',
  Er = 'ER',
  Es = 'ES',
  Et = 'ET',
  Fi = 'FI',
  Fj = 'FJ',
  Fk = 'FK',
  Fm = 'FM',
  Fo = 'FO',
  Fr = 'FR',
  Ga = 'GA',
  Gb = 'GB',
  Gd = 'GD',
  Ge = 'GE',
  Gf = 'GF',
  Gg = 'GG',
  Gh = 'GH',
  Gi = 'GI',
  Gl = 'GL',
  Gm = 'GM',
  Gn = 'GN',
  Gp = 'GP',
  Gq = 'GQ',
  Gr = 'GR',
  Gs = 'GS',
  Gt = 'GT',
  Gu = 'GU',
  Gw = 'GW',
  Gy = 'GY',
  Hk = 'HK',
  Hm = 'HM',
  Hn = 'HN',
  Hr = 'HR',
  Ht = 'HT',
  Hu = 'HU',
  Id = 'ID',
  Ie = 'IE',
  Il = 'IL',
  Im = 'IM',
  In = 'IN',
  Io = 'IO',
  Iq = 'IQ',
  Ir = 'IR',
  Is = 'IS',
  It = 'IT',
  Je = 'JE',
  Jm = 'JM',
  Jo = 'JO',
  Jp = 'JP',
  Ke = 'KE',
  Kg = 'KG',
  Kh = 'KH',
  Ki = 'KI',
  Km = 'KM',
  Kn = 'KN',
  Kp = 'KP',
  Kr = 'KR',
  Kw = 'KW',
  Ky = 'KY',
  Kz = 'KZ',
  La = 'LA',
  Lb = 'LB',
  Lc = 'LC',
  Li = 'LI',
  Lk = 'LK',
  Lr = 'LR',
  Ls = 'LS',
  Lt = 'LT',
  Lu = 'LU',
  Lv = 'LV',
  Ly = 'LY',
  Ma = 'MA',
  Mc = 'MC',
  Md = 'MD',
  Me = 'ME',
  Mf = 'MF',
  Mg = 'MG',
  Mh = 'MH',
  Mk = 'MK',
  Ml = 'ML',
  Mm = 'MM',
  Mn = 'MN',
  Mo = 'MO',
  Mp = 'MP',
  Mq = 'MQ',
  Mr = 'MR',
  Ms = 'MS',
  Mt = 'MT',
  Mu = 'MU',
  Mv = 'MV',
  Mw = 'MW',
  Mx = 'MX',
  My = 'MY',
  Mz = 'MZ',
  Na = 'NA',
  Nc = 'NC',
  Ne = 'NE',
  Nf = 'NF',
  Ng = 'NG',
  Ni = 'NI',
  Nl = 'NL',
  No = 'NO',
  Np = 'NP',
  Nr = 'NR',
  Nu = 'NU',
  Nz = 'NZ',
  Om = 'OM',
  Pa = 'PA',
  Pe = 'PE',
  Pf = 'PF',
  Pg = 'PG',
  Ph = 'PH',
  Pk = 'PK',
  Pl = 'PL',
  Pm = 'PM',
  Pn = 'PN',
  Pr = 'PR',
  Ps = 'PS',
  Pt = 'PT',
  Pw = 'PW',
  Py = 'PY',
  Qa = 'QA',
  Re = 'RE',
  Ro = 'RO',
  Rs = 'RS',
  Ru = 'RU',
  Rw = 'RW',
  Sa = 'SA',
  Sb = 'SB',
  Sc = 'SC',
  Sd = 'SD',
  Se = 'SE',
  Sg = 'SG',
  Si = 'SI',
  Sj = 'SJ',
  Sk = 'SK',
  Sl = 'SL',
  Sm = 'SM',
  Sn = 'SN',
  So = 'SO',
  Sr = 'SR',
  Ss = 'SS',
  St = 'ST',
  Sv = 'SV',
  Sx = 'SX',
  Sy = 'SY',
  Sz = 'SZ',
  Tc = 'TC',
  Td = 'TD',
  Tf = 'TF',
  Tg = 'TG',
  Th = 'TH',
  Tj = 'TJ',
  Tk = 'TK',
  Tl = 'TL',
  Tm = 'TM',
  Tn = 'TN',
  To = 'TO',
  Tr = 'TR',
  Tt = 'TT',
  Tv = 'TV',
  Tw = 'TW',
  Tz = 'TZ',
  Ua = 'UA',
  Ug = 'UG',
  Um = 'UM',
  Us = 'US',
  Uy = 'UY',
  Uz = 'UZ',
  Va = 'VA',
  Vc = 'VC',
  Ve = 'VE',
  Vg = 'VG',
  Vi = 'VI',
  Vn = 'VN',
  Vu = 'VU',
  Wf = 'WF',
  Ws = 'WS',
  Xk = 'XK',
  Ye = 'YE',
  Yt = 'YT',
  Za = 'ZA',
  Zm = 'ZM',
  Zw = 'ZW'
}

export type Overdraft = {
   __typename?: 'Overdraft',
  id: Scalars['String'],
  /** Overdraft status */
  status: OverdraftApplicationStatus,
  /** Available overdraft limit */
  limit?: Maybe<Scalars['Int']>,
};

export enum OverdraftApplicationStatus {
  Created = 'CREATED',
  InitialScoringPending = 'INITIAL_SCORING_PENDING',
  AccountSnapshotPending = 'ACCOUNT_SNAPSHOT_PENDING',
  AccountSnapshotVerificationPending = 'ACCOUNT_SNAPSHOT_VERIFICATION_PENDING',
  Offered = 'OFFERED',
  Rejected = 'REJECTED',
  OverdraftCreated = 'OVERDRAFT_CREATED'
}

export type PageInfo = {
   __typename?: 'PageInfo',
  startCursor?: Maybe<Scalars['String']>,
  endCursor?: Maybe<Scalars['String']>,
  hasNextPage: Scalars['Boolean'],
  hasPreviousPage: Scalars['Boolean'],
};

export enum PaymentFrequency {
  Monthly = 'MONTHLY',
  Quarterly = 'QUARTERLY',
  Yearly = 'YEARLY',
  None = 'NONE'
}

export type Query = {
   __typename?: 'Query',
  /** The current user information */
  viewer?: Maybe<User>,
  status: SystemStatus,
};

export enum ScopeType {
  Offline = 'OFFLINE',
  Accounts = 'ACCOUNTS',
  Users = 'USERS',
  Transactions = 'TRANSACTIONS',
  Transfers = 'TRANSFERS',
  Subscriptions = 'SUBSCRIPTIONS',
  Statements = 'STATEMENTS',
  Admin = 'ADMIN',
  Clients = 'CLIENTS',
  Overdraft = 'OVERDRAFT'
}

export type SepaTransfer = {
   __typename?: 'SepaTransfer',
  /** The status of the SEPA Transfer */
  status: SepaTransferStatus,
  /** The amount of the SEPA Transfer in cents */
  amount: Scalars['Int'],
  /** The purpose of the SEPA Transfer - 140 max characters */
  purpose?: Maybe<Scalars['String']>,
  id: Scalars['String'],
  /** The name of the SEPA Transfer recipient */
  recipient: Scalars['String'],
  /** The IBAN of the SEPA Transfer recipient */
  iban: Scalars['String'],
  /** The end to end ID of the SEPA Transfer */
  e2eId?: Maybe<Scalars['String']>,
};

export enum SepaTransferStatus {
  Authorized = 'AUTHORIZED',
  Confirmed = 'CONFIRMED',
  Booked = 'BOOKED'
}

export enum StandingOrderReoccurenceType {
  Monthly = 'MONTHLY',
  Quarterly = 'QUARTERLY',
  EverySixMonths = 'EVERY_SIX_MONTHS',
  Annually = 'ANNUALLY'
}

export enum Status {
  Error = 'ERROR'
}

export type Subscription = {
   __typename?: 'Subscription',
  newTransaction: Transaction,
};

export type SystemStatus = {
   __typename?: 'SystemStatus',
  type?: Maybe<Status>,
  message?: Maybe<Scalars['String']>,
};

export type TaxYearSetting = {
   __typename?: 'TaxYearSetting',
  /** Tax year the individual settings apply to */
  year: Scalars['Int'],
  /** Tax rate that should be applied in the corresponding year */
  taxRate?: Maybe<Scalars['Int']>,
  /** Flag if the corresponding year should be excluded from the tax calculations completely */
  excluded?: Maybe<Scalars['Boolean']>,
};

export type TaxYearSettingInput = {
  /** Tax year the individual settings apply to */
  year: Scalars['Int'],
  /** Tax rate that should be applied in the corresponding year */
  taxRate?: Maybe<Scalars['Int']>,
  /** Flag if the corresponding year should be excluded from the tax calculations completely */
  excluded?: Maybe<Scalars['Boolean']>,
};

export type Transaction = {
   __typename?: 'Transaction',
  id: Scalars['ID'],
  /** The amount of the transaction in cents */
  amount: Scalars['Int'],
  iban?: Maybe<Scalars['String']>,
  type: TransactionProjectionType,
  /** The date at which the transaction was processed and the amount deducted from the user's account */
  valutaDate?: Maybe<Scalars['DateTime']>,
  e2eId?: Maybe<Scalars['String']>,
  mandateNumber?: Maybe<Scalars['String']>,
  fees: Array<TransactionFee>,
  splits: Array<TransactionSplit>,
  /** The date at which the transaction was booked (created) */
  bookingDate: Scalars['DateTime'],
  directDebitFees: Array<DirectDebitFee>,
  name?: Maybe<Scalars['String']>,
  paymentMethod: Scalars['String'],
  category?: Maybe<TransactionCategory>,
  /** When a transaction corresponds to a tax or vat payment, the user may specify at which date it should be considered booked */
  userSelectedBookingDate?: Maybe<Scalars['DateTime']>,
  purpose?: Maybe<Scalars['String']>,
  documentNumber?: Maybe<Scalars['String']>,
  documentPreviewUrl?: Maybe<Scalars['String']>,
  documentDownloadUrl?: Maybe<Scalars['String']>,
  documentType?: Maybe<DocumentType>,
  foreignCurrency?: Maybe<Scalars['String']>,
  originalAmount?: Maybe<Scalars['Int']>,
};

export enum TransactionCategory {
  Private = 'PRIVATE',
  Vat = 'VAT',
  Vat_0 = 'VAT_0',
  Vat_7 = 'VAT_7',
  Vat_19 = 'VAT_19',
  TaxPayment = 'TAX_PAYMENT',
  VatPayment = 'VAT_PAYMENT',
  TaxRefund = 'TAX_REFUND',
  VatRefund = 'VAT_REFUND',
  VatSaving = 'VAT_SAVING',
  TaxSaving = 'TAX_SAVING'
}

export type TransactionCondition = {
  operator?: Maybe<BaseOperator>,
  amount_lt?: Maybe<Scalars['Int']>,
  amount_gt?: Maybe<Scalars['Int']>,
  amount_gte?: Maybe<Scalars['Int']>,
  amount_lte?: Maybe<Scalars['Int']>,
  amount_eq?: Maybe<Scalars['Int']>,
  amount_ne?: Maybe<Scalars['Int']>,
  amount_in?: Maybe<Array<Scalars['Int']>>,
  iban_eq?: Maybe<Scalars['String']>,
  iban_ne?: Maybe<Scalars['String']>,
  iban_like?: Maybe<Scalars['String']>,
  iban_likeAny?: Maybe<Array<Scalars['String']>>,
  iban_in?: Maybe<Array<Scalars['String']>>,
  valutaDate_eq?: Maybe<Scalars['DateTime']>,
  valutaDate_ne?: Maybe<Scalars['DateTime']>,
  valutaDate_gt?: Maybe<Scalars['DateTime']>,
  valutaDate_lt?: Maybe<Scalars['DateTime']>,
  valutaDate_gte?: Maybe<Scalars['DateTime']>,
  valutaDate_lte?: Maybe<Scalars['DateTime']>,
  bookingDate_eq?: Maybe<Scalars['DateTime']>,
  bookingDate_ne?: Maybe<Scalars['DateTime']>,
  bookingDate_gt?: Maybe<Scalars['DateTime']>,
  bookingDate_lt?: Maybe<Scalars['DateTime']>,
  bookingDate_gte?: Maybe<Scalars['DateTime']>,
  bookingDate_lte?: Maybe<Scalars['DateTime']>,
  name_eq?: Maybe<Scalars['String']>,
  name_ne?: Maybe<Scalars['String']>,
  name_like?: Maybe<Scalars['String']>,
  name_likeAny?: Maybe<Array<Scalars['String']>>,
  name_in?: Maybe<Array<Scalars['String']>>,
  purpose_eq?: Maybe<Scalars['String']>,
  purpose_ne?: Maybe<Scalars['String']>,
  purpose_like?: Maybe<Scalars['String']>,
  purpose_likeAny?: Maybe<Array<Scalars['String']>>,
};

export type TransactionFee = {
   __typename?: 'TransactionFee',
  type: TransactionFeeType,
  status: TransactionFeeStatus,
  unitAmount?: Maybe<Scalars['Int']>,
  usedAt?: Maybe<Scalars['DateTime']>,
};

export enum TransactionFeeStatus {
  Created = 'CREATED',
  Charged = 'CHARGED',
  Refunded = 'REFUNDED',
  Cancelled = 'CANCELLED',
  RefundInitiated = 'REFUND_INITIATED'
}

export enum TransactionFeeType {
  Atm = 'ATM',
  ForeignTransaction = 'FOREIGN_TRANSACTION',
  DirectDebitReturn = 'DIRECT_DEBIT_RETURN',
  SecondReminderEmail = 'SECOND_REMINDER_EMAIL',
  CardReplacement = 'CARD_REPLACEMENT'
}

export type TransactionFilter = {
  operator?: Maybe<BaseOperator>,
  amount_lt?: Maybe<Scalars['Int']>,
  amount_gt?: Maybe<Scalars['Int']>,
  amount_gte?: Maybe<Scalars['Int']>,
  amount_lte?: Maybe<Scalars['Int']>,
  amount_eq?: Maybe<Scalars['Int']>,
  amount_ne?: Maybe<Scalars['Int']>,
  amount_in?: Maybe<Array<Scalars['Int']>>,
  iban_eq?: Maybe<Scalars['String']>,
  iban_ne?: Maybe<Scalars['String']>,
  iban_like?: Maybe<Scalars['String']>,
  iban_likeAny?: Maybe<Array<Scalars['String']>>,
  iban_in?: Maybe<Array<Scalars['String']>>,
  valutaDate_eq?: Maybe<Scalars['DateTime']>,
  valutaDate_ne?: Maybe<Scalars['DateTime']>,
  valutaDate_gt?: Maybe<Scalars['DateTime']>,
  valutaDate_lt?: Maybe<Scalars['DateTime']>,
  valutaDate_gte?: Maybe<Scalars['DateTime']>,
  valutaDate_lte?: Maybe<Scalars['DateTime']>,
  bookingDate_eq?: Maybe<Scalars['DateTime']>,
  bookingDate_ne?: Maybe<Scalars['DateTime']>,
  bookingDate_gt?: Maybe<Scalars['DateTime']>,
  bookingDate_lt?: Maybe<Scalars['DateTime']>,
  bookingDate_gte?: Maybe<Scalars['DateTime']>,
  bookingDate_lte?: Maybe<Scalars['DateTime']>,
  name_eq?: Maybe<Scalars['String']>,
  name_ne?: Maybe<Scalars['String']>,
  name_like?: Maybe<Scalars['String']>,
  name_likeAny?: Maybe<Array<Scalars['String']>>,
  name_in?: Maybe<Array<Scalars['String']>>,
  purpose_eq?: Maybe<Scalars['String']>,
  purpose_ne?: Maybe<Scalars['String']>,
  purpose_like?: Maybe<Scalars['String']>,
  purpose_likeAny?: Maybe<Array<Scalars['String']>>,
  conditions?: Maybe<Array<TransactionCondition>>,
};

export enum TransactionProjectionType {
  CreditPresentment = 'CREDIT_PRESENTMENT',
  CashManual = 'CASH_MANUAL',
  Atm = 'ATM',
  CancelManualLoad = 'CANCEL_MANUAL_LOAD',
  CardUsage = 'CARD_USAGE',
  DirectDebitAutomaticTopup = 'DIRECT_DEBIT_AUTOMATIC_TOPUP',
  DirectDebitReturn = 'DIRECT_DEBIT_RETURN',
  DisputeClearing = 'DISPUTE_CLEARING',
  ManualLoad = 'MANUAL_LOAD',
  WireTransferTopup = 'WIRE_TRANSFER_TOPUP',
  TransferToBankAccount = 'TRANSFER_TO_BANK_ACCOUNT',
  CancellationBooking = 'CANCELLATION_BOOKING',
  CancellationDoubleBooking = 'CANCELLATION_DOUBLE_BOOKING',
  CreditTransferCancellation = 'CREDIT_TRANSFER_CANCELLATION',
  CurrencyTransactionCancellation = 'CURRENCY_TRANSACTION_CANCELLATION',
  DirectDebit = 'DIRECT_DEBIT',
  ForeignPayment = 'FOREIGN_PAYMENT',
  Other = 'OTHER',
  SepaCreditTransferReturn = 'SEPA_CREDIT_TRANSFER_RETURN',
  SepaCreditTransfer = 'SEPA_CREDIT_TRANSFER',
  SepaDirectDebitReturn = 'SEPA_DIRECT_DEBIT_RETURN',
  SepaDirectDebit = 'SEPA_DIRECT_DEBIT',
  Transfer = 'TRANSFER',
  InternationalCreditTransfer = 'INTERNATIONAL_CREDIT_TRANSFER',
  CancellationSepaDirectDebitReturn = 'CANCELLATION_SEPA_DIRECT_DEBIT_RETURN',
  Rebooking = 'REBOOKING',
  CancellationDirectDebit = 'CANCELLATION_DIRECT_DEBIT',
  CancellationSepaCreditTransferReturn = 'CANCELLATION_SEPA_CREDIT_TRANSFER_RETURN',
  CardTransaction = 'CARD_TRANSACTION'
}

export type TransactionsConnection = {
   __typename?: 'TransactionsConnection',
  edges: Array<TransactionsConnectionEdge>,
  pageInfo: PageInfo,
};

export type TransactionsConnectionEdge = {
   __typename?: 'TransactionsConnectionEdge',
  node: Transaction,
  cursor: Scalars['String'],
};

export type TransactionSplit = {
   __typename?: 'TransactionSplit',
  id: Scalars['ID'],
  amount: Scalars['Int'],
  category: TransactionCategory,
  userSelectedBookingDate?: Maybe<Scalars['DateTime']>,
};

export type Transfer = {
   __typename?: 'Transfer',
  id: Scalars['String'],
  /** The name of the transfer recipient */
  recipient: Scalars['String'],
  /** The IBAN of the transfer recipient */
  iban: Scalars['String'],
  /** The amount of the transfer in cents */
  amount: Scalars['Int'],
  /** The status of the transfer */
  status?: Maybe<TransferStatus>,
  /** The date at which the payment will be executed for Timed Orders or Standing Orders */
  executeAt?: Maybe<Scalars['DateTime']>,
  /** The date at which the last payment will be executed for Standing Orders */
  lastExecutionDate?: Maybe<Scalars['DateTime']>,
  /** The purpose of the transfer - 140 max characters */
  purpose?: Maybe<Scalars['String']>,
  /** The end to end ID of the transfer */
  e2eId?: Maybe<Scalars['String']>,
  /** The reoccurrence type of the payments for Standing Orders */
  reoccurrence?: Maybe<StandingOrderReoccurenceType>,
  /** The date at which the next payment will be executed for Standing Orders */
  nextOccurrence?: Maybe<Scalars['DateTime']>,
  /** The user selected category for the SEPA Transfer */
  category?: Maybe<TransactionCategory>,
  /** When a transaction corresponds to a tax or vat payment, the user may specify at which date it should be considered booked */
  userSelectedBookingDate?: Maybe<Scalars['DateTime']>,
};

export type TransfersConnection = {
   __typename?: 'TransfersConnection',
  edges: Array<TransfersConnectionEdge>,
  pageInfo: PageInfo,
};

export type TransfersConnectionEdge = {
   __typename?: 'TransfersConnectionEdge',
  node: Transfer,
  cursor: Scalars['String'],
};

export type TransfersConnectionFilter = {
  status?: Maybe<TransferStatus>,
};

export enum TransferStatus {
  Authorized = 'AUTHORIZED',
  Confirmed = 'CONFIRMED',
  Booked = 'BOOKED',
  Created = 'CREATED',
  Active = 'ACTIVE',
  Inactive = 'INACTIVE',
  Canceled = 'CANCELED',
  AuthorizationRequired = 'AUTHORIZATION_REQUIRED',
  ConfirmationRequired = 'CONFIRMATION_REQUIRED',
  Scheduled = 'SCHEDULED',
  Executed = 'EXECUTED',
  Failed = 'FAILED'
}

export type TransferSuggestion = {
   __typename?: 'TransferSuggestion',
  iban: Scalars['String'],
  name: Scalars['String'],
};

export enum TransferType {
  SepaTransfer = 'SEPA_TRANSFER',
  StandingOrder = 'STANDING_ORDER',
  TimedOrder = 'TIMED_ORDER'
}

/** The available fields to update an OAuth2 client */
export type UpdateClientInput = {
  /** The name of the OAuth2 client displayed when users log in */
  name?: Maybe<Scalars['String']>,
  /** The OAuth2 client secret */
  secret?: Maybe<Scalars['String']>,
  /** The URL to redirect to after authentication */
  redirectUri?: Maybe<Scalars['String']>,
  /** The grant types (i.e. ways to obtain access tokens) allowed for the client */
  grantTypes?: Maybe<Array<GrantType>>,
  /** The scopes the client has access to, limiting access to the corresponding parts of the API */
  scopes?: Maybe<Array<ScopeType>>,
  /** The id of the OAuth2 client to update */
  id: Scalars['String'],
};

/** The available fields to update a transfer */
export type UpdateTransferInput = {
  /** The ID of the transfer to update */
  id: Scalars['String'],
  /** The type of transfer to update, currently only Standing Orders are supported */
  type: TransferType,
  /** The amount of the Standing Order payment in cents */
  amount?: Maybe<Scalars['Int']>,
  /** The date at which the last payment will be executed */
  lastExecutionDate?: Maybe<Scalars['DateTime']>,
  /** The purpose of the Standing Order - 140 max characters, if not specified with the update, it will be set to null */
  purpose?: Maybe<Scalars['String']>,
  /** The end to end ID of the Standing Order, if not specified with the update, it will be set to null */
  e2eId?: Maybe<Scalars['String']>,
  /** The reoccurrence type of the payments for Standing Orders */
  reoccurrence?: Maybe<StandingOrderReoccurenceType>,
  /** The user selected category for the SEPA Transfer */
  category?: Maybe<TransactionCategory>,
  /** When a transaction corresponds to a tax or vat payment, the user may specify at which date it should be considered booked */
  userSelectedBookingDate?: Maybe<Scalars['DateTime']>,
};

export type User = {
   __typename?: 'User',
  email: Scalars['String'],
  createdAt: Scalars['DateTime'],
  vatCutoffLine?: Maybe<Scalars['DateTime']>,
  taxCutoffLine?: Maybe<Scalars['DateTime']>,
  vatPaymentFrequency?: Maybe<PaymentFrequency>,
  taxPaymentFrequency?: Maybe<PaymentFrequency>,
  taxRate?: Maybe<Scalars['Int']>,
  vatRate?: Maybe<Scalars['Int']>,
  /** The user's IDNow identification status */
  identificationStatus?: Maybe<IdentificationStatus>,
  /** The link to use for IDNow identification */
  identificationLink?: Maybe<Scalars['String']>,
  gender?: Maybe<Gender>,
  firstName?: Maybe<Scalars['String']>,
  lastName?: Maybe<Scalars['String']>,
  birthPlace?: Maybe<Scalars['String']>,
  birthDate?: Maybe<Scalars['DateTime']>,
  nationality?: Maybe<Nationality>,
  street?: Maybe<Scalars['String']>,
  postCode?: Maybe<Scalars['String']>,
  city?: Maybe<Scalars['String']>,
  mobileNumber?: Maybe<Scalars['String']>,
  untrustedPhoneNumber?: Maybe<Scalars['String']>,
  /** Indicates whether the user pays taxes in the US */
  isUSPerson?: Maybe<Scalars['Boolean']>,
  companyType?: Maybe<CompanyType>,
  publicId: Scalars['ID'],
  language?: Maybe<Scalars['String']>,
  country?: Maybe<Scalars['String']>,
  /** Business description provided by the user */
  businessPurpose?: Maybe<Scalars['String']>,
  /** The economic sector of the user's business */
  economicSector?: Maybe<Scalars['String']>,
  /** Business economic sector provided by the user */
  otherEconomicSector?: Maybe<Scalars['String']>,
  vatNumber?: Maybe<Scalars['String']>,
  /** The user's referral code to use for promotional purposes */
  referralCode?: Maybe<Scalars['String']>,
  /** The list of all OAuth2 clients for the current user */
  clients: Array<Client>,
  /** The details of an existing OAuth2 client */
  client?: Maybe<Client>,
  mainAccount?: Maybe<Account>,
};


export type UserClientArgs = {
  id: Scalars['String']
};

export type WhitelistCardResponse = {
   __typename?: 'WhitelistCardResponse',
  id: Scalars['String'],
  resolution: Scalars['String'],
  whitelisted_until: Scalars['String'],
};
