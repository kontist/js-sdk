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

export type Account = {
   __typename?: 'Account',
  iban: Scalars['String'],
  balance: Scalars['Int'],
  transaction?: Maybe<Transaction>,
  transactions: TransactionsConnection,
  transfer?: Maybe<Transfer>,
  transfers: TransfersConnection,
};


export type AccountTransactionArgs = {
  id: Scalars['ID']
};


export type AccountTransactionsArgs = {
  first?: Maybe<Scalars['Int']>,
  last?: Maybe<Scalars['Int']>,
  after?: Maybe<Scalars['String']>,
  before?: Maybe<Scalars['String']>
};


export type AccountTransferArgs = {
  id: Scalars['ID']
};


export type AccountTransfersArgs = {
  where?: Maybe<TransfersConnectionFilter>,
  first?: Maybe<Scalars['Int']>,
  last?: Maybe<Scalars['Int']>,
  after?: Maybe<Scalars['String']>,
  before?: Maybe<Scalars['String']>
};

export type BatchTransfer = {
   __typename?: 'BatchTransfer',
  id: Scalars['String'],
  status: BatchTransferStatus,
  transfers: Array<Transfer>,
};

export enum BatchTransferStatus {
  AuthorizationRequired = 'AUTHORIZATION_REQUIRED',
  ConfirmationRequired = 'CONFIRMATION_REQUIRED',
  Accepted = 'ACCEPTED',
  Failed = 'FAILED',
  Successful = 'SUCCESSFUL'
}

export type Client = {
   __typename?: 'Client',
  id: Scalars['ID'],
  redirectUri?: Maybe<Scalars['String']>,
  name: Scalars['String'],
  grantTypes?: Maybe<Array<GrantType>>,
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

export type CreateClientInput = {
  name: Scalars['String'],
  secret?: Maybe<Scalars['String']>,
  redirectUri?: Maybe<Scalars['String']>,
  grantTypes: Array<GrantType>,
  scopes: Array<ScopeType>,
};

export type CreateTransferInput = {
  recipient: Scalars['String'],
  iban: Scalars['String'],
  amount: Scalars['Int'],
  purpose?: Maybe<Scalars['String']>,
  e2eId?: Maybe<Scalars['String']>,
};

export type CreateTransfersResult = {
   __typename?: 'CreateTransfersResult',
  confirmationId: Scalars['String'],
};


export type DirectDebitFee = {
   __typename?: 'DirectDebitFee',
  id: Scalars['Int'],
  type: TransactionFeeType,
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
  createTransfer: Transfer,
  confirmTransfer: Transfer,
  createTransfers: CreateTransfersResult,
  confirmTransfers: BatchTransfer,
  createClient: Client,
  updateClient: Client,
  deleteClient: Client,
};


export type MutationCreateTransferArgs = {
  transfer: CreateTransferInput
};


export type MutationConfirmTransferArgs = {
  authorizationToken: Scalars['String'],
  transferId: Scalars['String']
};


export type MutationCreateTransfersArgs = {
  transfers: Array<CreateTransferInput>
};


export type MutationConfirmTransfersArgs = {
  authorizationToken: Scalars['String'],
  confirmationId: Scalars['String']
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
  viewer: User,
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
  Clients = 'CLIENTS'
}

export type Transaction = {
   __typename?: 'Transaction',
  id: Scalars['ID'],
  amount: Scalars['Int'],
  iban?: Maybe<Scalars['String']>,
  type: TransactionProjectionType,
  valutaDate?: Maybe<Scalars['DateTime']>,
  e2eId?: Maybe<Scalars['String']>,
  mandateNumber?: Maybe<Scalars['String']>,
  fees: Array<TransactionFee>,
  bookingDate: Scalars['DateTime'],
  directDebitFees: Array<DirectDebitFee>,
  name?: Maybe<Scalars['String']>,
  paymentMethod: Scalars['String'],
  category?: Maybe<Scalars['String']>,
  userSelectedBookingDate?: Maybe<Scalars['DateTime']>,
  purpose?: Maybe<Scalars['String']>,
  documentNumber?: Maybe<Scalars['String']>,
  documentPreviewUrl?: Maybe<Scalars['String']>,
  documentDownloadUrl?: Maybe<Scalars['String']>,
  documentType?: Maybe<DocumentType>,
  foreignCurrency?: Maybe<Scalars['String']>,
  originalAmount?: Maybe<Scalars['Int']>,
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

export enum TransactionProjectionType {
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

export type Transfer = {
   __typename?: 'Transfer',
  status: TransferStatus,
  amount: Scalars['Int'],
  purpose?: Maybe<Scalars['String']>,
  id: Scalars['String'],
  recipient: Scalars['String'],
  iban: Scalars['String'],
  e2eId?: Maybe<Scalars['String']>,
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
  Created = 'CREATED',
  Authorized = 'AUTHORIZED',
  Confirmed = 'CONFIRMED',
  Booked = 'BOOKED'
}

export type UpdateClientInput = {
  name?: Maybe<Scalars['String']>,
  secret?: Maybe<Scalars['String']>,
  redirectUri?: Maybe<Scalars['String']>,
  grantTypes?: Maybe<Array<GrantType>>,
  scopes?: Maybe<Array<ScopeType>>,
  id: Scalars['String'],
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
  identificationStatus?: Maybe<IdentificationStatus>,
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
  isUSPerson?: Maybe<Scalars['Boolean']>,
  companyType?: Maybe<CompanyType>,
  publicId: Scalars['ID'],
  language?: Maybe<Scalars['String']>,
  country?: Maybe<Scalars['String']>,
  businessPurpose?: Maybe<Scalars['String']>,
  economicSector?: Maybe<Scalars['String']>,
  otherEconomicSector?: Maybe<Scalars['String']>,
  vatNumber?: Maybe<Scalars['String']>,
  referralCode?: Maybe<Scalars['String']>,
  mainAccount?: Maybe<Account>,
  clients: Array<Client>,
  client?: Maybe<Client>,
};


export type UserClientArgs = {
  id: Scalars['String']
};
