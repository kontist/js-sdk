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
  id: Scalars['Int'],
  transaction?: Maybe<Transaction>,
  transactions: TransactionsConnection,
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

export enum GrantType {
  Password = 'PASSWORD',
  AuthorizationCode = 'AUTHORIZATION_CODE',
  RefreshToken = 'REFRESH_TOKEN',
  ClientCredentials = 'CLIENT_CREDENTIALS'
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

export type PageInfo = {
   __typename?: 'PageInfo',
  startCursor?: Maybe<Scalars['String']>,
  endCursor?: Maybe<Scalars['String']>,
  hasNextPage: Scalars['Boolean'],
  hasPreviousPage: Scalars['Boolean'],
};

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
  id: Scalars['ID'],
  mainAccount?: Maybe<Account>,
  clients: Array<Client>,
  client?: Maybe<Client>,
};


export type UserClientArgs = {
  id: Scalars['String']
};
