export type Maybe<T> = T | null;
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string,
  String: string,
  Boolean: boolean,
  Int: number,
  Float: number,
};

export type Account = {
   __typename?: 'Account',
  id: Scalars['ID'],
  transaction?: Maybe<TransactionDetails>,
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

export type DirectDebitFee = {
   __typename?: 'DirectDebitFee',
  id: Scalars['Int'],
  type: TransactionFeeType,
  amount: Scalars['Int'],
  date?: Maybe<Scalars['String']>,
  invoiceStatus: InvoiceStatus,
};

export enum InvoiceStatus {
  Open = 'OPEN',
  Closed = 'CLOSED',
  Rejected = 'REJECTED',
  Pending = 'PENDING'
}

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

export type TransactionDetails = {
   __typename?: 'TransactionDetails',
  id: Scalars['ID'],
  amount: Scalars['Int'],
  name?: Maybe<Scalars['String']>,
  iban?: Maybe<Scalars['String']>,
  type: TransactionProjectionType,
  bookingDate: Scalars['String'],
  valutaDate?: Maybe<Scalars['String']>,
  originalAmount?: Maybe<Scalars['Int']>,
  foreignCurrency?: Maybe<Scalars['String']>,
  e2eId?: Maybe<Scalars['String']>,
  mandateNumber?: Maybe<Scalars['String']>,
  paymentMethod: Scalars['String'],
  category?: Maybe<Scalars['String']>,
  userSelectedBookingDate?: Maybe<Scalars['String']>,
  purpose?: Maybe<Scalars['String']>,
  bookingType: TransactionProjectionType,
  invoiceNumber?: Maybe<Scalars['String']>,
  invoicePreviewUrl?: Maybe<Scalars['String']>,
  invoiceDownloadUrl?: Maybe<Scalars['String']>,
  documentType?: Maybe<Scalars['String']>,
  fees: Array<TransactionFee>,
  directDebitFees: Array<DirectDebitFee>,
};

export type TransactionFee = {
   __typename?: 'TransactionFee',
  type: TransactionFeeType,
  status: TransactionFeeStatus,
  unitAmount?: Maybe<Scalars['Int']>,
  usedAt?: Maybe<Scalars['String']>,
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

export type TransactionListItem = {
   __typename?: 'TransactionListItem',
  id: Scalars['ID'],
  amount: Scalars['Int'],
  name?: Maybe<Scalars['String']>,
  iban?: Maybe<Scalars['String']>,
  type: TransactionProjectionType,
  bookingDate: Scalars['String'],
  valutaDate?: Maybe<Scalars['String']>,
  originalAmount?: Maybe<Scalars['Int']>,
  foreignCurrency?: Maybe<Scalars['String']>,
  e2eId?: Maybe<Scalars['String']>,
  mandateNumber?: Maybe<Scalars['String']>,
  paymentMethod: Scalars['String'],
  category?: Maybe<Scalars['String']>,
  userSelectedBookingDate?: Maybe<Scalars['String']>,
  purpose?: Maybe<Scalars['String']>,
  bookingType: TransactionProjectionType,
  invoiceNumber?: Maybe<Scalars['String']>,
  invoicePreviewUrl?: Maybe<Scalars['String']>,
  invoiceDownloadUrl?: Maybe<Scalars['String']>,
  documentType?: Maybe<Scalars['String']>,
};

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
  node: TransactionListItem,
  cursor: Scalars['String'],
};

export type Transfer = {
   __typename?: 'Transfer',
  status: Scalars['String'],
  purpose: Scalars['String'],
};

export type User = {
   __typename?: 'User',
  id: Scalars['ID'],
  mainAccount?: Maybe<Account>,
};
