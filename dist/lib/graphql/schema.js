"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var BatchTransferStatus;
(function (BatchTransferStatus) {
    BatchTransferStatus["AuthorizationRequired"] = "AUTHORIZATION_REQUIRED";
    BatchTransferStatus["ConfirmationRequired"] = "CONFIRMATION_REQUIRED";
    BatchTransferStatus["Accepted"] = "ACCEPTED";
    BatchTransferStatus["Failed"] = "FAILED";
    BatchTransferStatus["Successful"] = "SUCCESSFUL";
})(BatchTransferStatus = exports.BatchTransferStatus || (exports.BatchTransferStatus = {}));
var CardAction;
(function (CardAction) {
    CardAction["Close"] = "CLOSE";
    CardAction["Block"] = "BLOCK";
    CardAction["Unblock"] = "UNBLOCK";
})(CardAction = exports.CardAction || (exports.CardAction = {}));
var CardStatus;
(function (CardStatus) {
    CardStatus["Processing"] = "PROCESSING";
    CardStatus["Inactive"] = "INACTIVE";
    CardStatus["Active"] = "ACTIVE";
    CardStatus["Blocked"] = "BLOCKED";
    CardStatus["BlockedBySolaris"] = "BLOCKED_BY_SOLARIS";
    CardStatus["ActivationBlockedBySolaris"] = "ACTIVATION_BLOCKED_BY_SOLARIS";
    CardStatus["Closed"] = "CLOSED";
    CardStatus["ClosedBySolaris"] = "CLOSED_BY_SOLARIS";
})(CardStatus = exports.CardStatus || (exports.CardStatus = {}));
var CardType;
(function (CardType) {
    CardType["VirtualVisaBusinessDebit"] = "VIRTUAL_VISA_BUSINESS_DEBIT";
    CardType["VisaBusinessDebit"] = "VISA_BUSINESS_DEBIT";
    CardType["MastercardBusinessDebit"] = "MASTERCARD_BUSINESS_DEBIT";
    CardType["VirtualMastercardBusinessDebit"] = "VIRTUAL_MASTERCARD_BUSINESS_DEBIT";
})(CardType = exports.CardType || (exports.CardType = {}));
var CompanyType;
(function (CompanyType) {
    CompanyType["Selbstaendig"] = "SELBSTAENDIG";
    CompanyType["Einzelunternehmer"] = "EINZELUNTERNEHMER";
    CompanyType["Freiberufler"] = "FREIBERUFLER";
    CompanyType["Gewerbetreibender"] = "GEWERBETREIBENDER";
    CompanyType["Limited"] = "LIMITED";
    CompanyType["EK"] = "E_K";
    CompanyType["Partgg"] = "PARTGG";
    CompanyType["Gbr"] = "GBR";
    CompanyType["Ohg"] = "OHG";
    CompanyType["Kg"] = "KG";
    CompanyType["Kgaa"] = "KGAA";
    CompanyType["Gmbh"] = "GMBH";
    CompanyType["GmbhUndCoKg"] = "GMBH_UND_CO_KG";
    CompanyType["Ug"] = "UG";
})(CompanyType = exports.CompanyType || (exports.CompanyType = {}));
var DocumentType;
(function (DocumentType) {
    DocumentType["Voucher"] = "VOUCHER";
    DocumentType["Invoice"] = "INVOICE";
})(DocumentType = exports.DocumentType || (exports.DocumentType = {}));
var Gender;
(function (Gender) {
    Gender["Male"] = "MALE";
    Gender["Female"] = "FEMALE";
})(Gender = exports.Gender || (exports.Gender = {}));
var GrantType;
(function (GrantType) {
    GrantType["Password"] = "PASSWORD";
    GrantType["AuthorizationCode"] = "AUTHORIZATION_CODE";
    GrantType["RefreshToken"] = "REFRESH_TOKEN";
    GrantType["ClientCredentials"] = "CLIENT_CREDENTIALS";
})(GrantType = exports.GrantType || (exports.GrantType = {}));
var IdentificationStatus;
(function (IdentificationStatus) {
    IdentificationStatus["Pending"] = "PENDING";
    IdentificationStatus["PendingSuccessful"] = "PENDING_SUCCESSFUL";
    IdentificationStatus["PendingFailed"] = "PENDING_FAILED";
    IdentificationStatus["Successful"] = "SUCCESSFUL";
    IdentificationStatus["Failed"] = "FAILED";
    IdentificationStatus["Expired"] = "EXPIRED";
    IdentificationStatus["Created"] = "CREATED";
    IdentificationStatus["Aborted"] = "ABORTED";
    IdentificationStatus["Canceled"] = "CANCELED";
})(IdentificationStatus = exports.IdentificationStatus || (exports.IdentificationStatus = {}));
var InvoiceStatus;
(function (InvoiceStatus) {
    InvoiceStatus["Open"] = "OPEN";
    InvoiceStatus["Closed"] = "CLOSED";
    InvoiceStatus["Rejected"] = "REJECTED";
    InvoiceStatus["Pending"] = "PENDING";
})(InvoiceStatus = exports.InvoiceStatus || (exports.InvoiceStatus = {}));
var Nationality;
(function (Nationality) {
    Nationality["De"] = "DE";
    Nationality["Ad"] = "AD";
    Nationality["Ae"] = "AE";
    Nationality["Af"] = "AF";
    Nationality["Ag"] = "AG";
    Nationality["Ai"] = "AI";
    Nationality["Al"] = "AL";
    Nationality["Am"] = "AM";
    Nationality["Ao"] = "AO";
    Nationality["Aq"] = "AQ";
    Nationality["Ar"] = "AR";
    Nationality["As"] = "AS";
    Nationality["At"] = "AT";
    Nationality["Au"] = "AU";
    Nationality["Aw"] = "AW";
    Nationality["Ax"] = "AX";
    Nationality["Az"] = "AZ";
    Nationality["Ba"] = "BA";
    Nationality["Bb"] = "BB";
    Nationality["Bd"] = "BD";
    Nationality["Be"] = "BE";
    Nationality["Bf"] = "BF";
    Nationality["Bg"] = "BG";
    Nationality["Bh"] = "BH";
    Nationality["Bi"] = "BI";
    Nationality["Bj"] = "BJ";
    Nationality["Bl"] = "BL";
    Nationality["Bm"] = "BM";
    Nationality["Bn"] = "BN";
    Nationality["Bo"] = "BO";
    Nationality["Br"] = "BR";
    Nationality["Bs"] = "BS";
    Nationality["Bt"] = "BT";
    Nationality["Bv"] = "BV";
    Nationality["Bw"] = "BW";
    Nationality["By"] = "BY";
    Nationality["Bz"] = "BZ";
    Nationality["Ca"] = "CA";
    Nationality["Cc"] = "CC";
    Nationality["Cd"] = "CD";
    Nationality["Cf"] = "CF";
    Nationality["Cg"] = "CG";
    Nationality["Ch"] = "CH";
    Nationality["Ci"] = "CI";
    Nationality["Ck"] = "CK";
    Nationality["Cl"] = "CL";
    Nationality["Cm"] = "CM";
    Nationality["Cn"] = "CN";
    Nationality["Co"] = "CO";
    Nationality["Cr"] = "CR";
    Nationality["Cu"] = "CU";
    Nationality["Cv"] = "CV";
    Nationality["Cw"] = "CW";
    Nationality["Cx"] = "CX";
    Nationality["Cy"] = "CY";
    Nationality["Cz"] = "CZ";
    Nationality["Dj"] = "DJ";
    Nationality["Dk"] = "DK";
    Nationality["Dm"] = "DM";
    Nationality["Do"] = "DO";
    Nationality["Dz"] = "DZ";
    Nationality["Ec"] = "EC";
    Nationality["Ee"] = "EE";
    Nationality["Eg"] = "EG";
    Nationality["Eh"] = "EH";
    Nationality["Er"] = "ER";
    Nationality["Es"] = "ES";
    Nationality["Et"] = "ET";
    Nationality["Fi"] = "FI";
    Nationality["Fj"] = "FJ";
    Nationality["Fk"] = "FK";
    Nationality["Fm"] = "FM";
    Nationality["Fo"] = "FO";
    Nationality["Fr"] = "FR";
    Nationality["Ga"] = "GA";
    Nationality["Gb"] = "GB";
    Nationality["Gd"] = "GD";
    Nationality["Ge"] = "GE";
    Nationality["Gf"] = "GF";
    Nationality["Gg"] = "GG";
    Nationality["Gh"] = "GH";
    Nationality["Gi"] = "GI";
    Nationality["Gl"] = "GL";
    Nationality["Gm"] = "GM";
    Nationality["Gn"] = "GN";
    Nationality["Gp"] = "GP";
    Nationality["Gq"] = "GQ";
    Nationality["Gr"] = "GR";
    Nationality["Gs"] = "GS";
    Nationality["Gt"] = "GT";
    Nationality["Gu"] = "GU";
    Nationality["Gw"] = "GW";
    Nationality["Gy"] = "GY";
    Nationality["Hk"] = "HK";
    Nationality["Hm"] = "HM";
    Nationality["Hn"] = "HN";
    Nationality["Hr"] = "HR";
    Nationality["Ht"] = "HT";
    Nationality["Hu"] = "HU";
    Nationality["Id"] = "ID";
    Nationality["Ie"] = "IE";
    Nationality["Il"] = "IL";
    Nationality["Im"] = "IM";
    Nationality["In"] = "IN";
    Nationality["Io"] = "IO";
    Nationality["Iq"] = "IQ";
    Nationality["Ir"] = "IR";
    Nationality["Is"] = "IS";
    Nationality["It"] = "IT";
    Nationality["Je"] = "JE";
    Nationality["Jm"] = "JM";
    Nationality["Jo"] = "JO";
    Nationality["Jp"] = "JP";
    Nationality["Ke"] = "KE";
    Nationality["Kg"] = "KG";
    Nationality["Kh"] = "KH";
    Nationality["Ki"] = "KI";
    Nationality["Km"] = "KM";
    Nationality["Kn"] = "KN";
    Nationality["Kp"] = "KP";
    Nationality["Kr"] = "KR";
    Nationality["Kw"] = "KW";
    Nationality["Ky"] = "KY";
    Nationality["Kz"] = "KZ";
    Nationality["La"] = "LA";
    Nationality["Lb"] = "LB";
    Nationality["Lc"] = "LC";
    Nationality["Li"] = "LI";
    Nationality["Lk"] = "LK";
    Nationality["Lr"] = "LR";
    Nationality["Ls"] = "LS";
    Nationality["Lt"] = "LT";
    Nationality["Lu"] = "LU";
    Nationality["Lv"] = "LV";
    Nationality["Ly"] = "LY";
    Nationality["Ma"] = "MA";
    Nationality["Mc"] = "MC";
    Nationality["Md"] = "MD";
    Nationality["Me"] = "ME";
    Nationality["Mf"] = "MF";
    Nationality["Mg"] = "MG";
    Nationality["Mh"] = "MH";
    Nationality["Mk"] = "MK";
    Nationality["Ml"] = "ML";
    Nationality["Mm"] = "MM";
    Nationality["Mn"] = "MN";
    Nationality["Mo"] = "MO";
    Nationality["Mp"] = "MP";
    Nationality["Mq"] = "MQ";
    Nationality["Mr"] = "MR";
    Nationality["Ms"] = "MS";
    Nationality["Mt"] = "MT";
    Nationality["Mu"] = "MU";
    Nationality["Mv"] = "MV";
    Nationality["Mw"] = "MW";
    Nationality["Mx"] = "MX";
    Nationality["My"] = "MY";
    Nationality["Mz"] = "MZ";
    Nationality["Na"] = "NA";
    Nationality["Nc"] = "NC";
    Nationality["Ne"] = "NE";
    Nationality["Nf"] = "NF";
    Nationality["Ng"] = "NG";
    Nationality["Ni"] = "NI";
    Nationality["Nl"] = "NL";
    Nationality["No"] = "NO";
    Nationality["Np"] = "NP";
    Nationality["Nr"] = "NR";
    Nationality["Nu"] = "NU";
    Nationality["Nz"] = "NZ";
    Nationality["Om"] = "OM";
    Nationality["Pa"] = "PA";
    Nationality["Pe"] = "PE";
    Nationality["Pf"] = "PF";
    Nationality["Pg"] = "PG";
    Nationality["Ph"] = "PH";
    Nationality["Pk"] = "PK";
    Nationality["Pl"] = "PL";
    Nationality["Pm"] = "PM";
    Nationality["Pn"] = "PN";
    Nationality["Pr"] = "PR";
    Nationality["Ps"] = "PS";
    Nationality["Pt"] = "PT";
    Nationality["Pw"] = "PW";
    Nationality["Py"] = "PY";
    Nationality["Qa"] = "QA";
    Nationality["Re"] = "RE";
    Nationality["Ro"] = "RO";
    Nationality["Rs"] = "RS";
    Nationality["Ru"] = "RU";
    Nationality["Rw"] = "RW";
    Nationality["Sa"] = "SA";
    Nationality["Sb"] = "SB";
    Nationality["Sc"] = "SC";
    Nationality["Sd"] = "SD";
    Nationality["Se"] = "SE";
    Nationality["Sg"] = "SG";
    Nationality["Si"] = "SI";
    Nationality["Sj"] = "SJ";
    Nationality["Sk"] = "SK";
    Nationality["Sl"] = "SL";
    Nationality["Sm"] = "SM";
    Nationality["Sn"] = "SN";
    Nationality["So"] = "SO";
    Nationality["Sr"] = "SR";
    Nationality["Ss"] = "SS";
    Nationality["St"] = "ST";
    Nationality["Sv"] = "SV";
    Nationality["Sx"] = "SX";
    Nationality["Sy"] = "SY";
    Nationality["Sz"] = "SZ";
    Nationality["Tc"] = "TC";
    Nationality["Td"] = "TD";
    Nationality["Tf"] = "TF";
    Nationality["Tg"] = "TG";
    Nationality["Th"] = "TH";
    Nationality["Tj"] = "TJ";
    Nationality["Tk"] = "TK";
    Nationality["Tl"] = "TL";
    Nationality["Tm"] = "TM";
    Nationality["Tn"] = "TN";
    Nationality["To"] = "TO";
    Nationality["Tr"] = "TR";
    Nationality["Tt"] = "TT";
    Nationality["Tv"] = "TV";
    Nationality["Tw"] = "TW";
    Nationality["Tz"] = "TZ";
    Nationality["Ua"] = "UA";
    Nationality["Ug"] = "UG";
    Nationality["Um"] = "UM";
    Nationality["Us"] = "US";
    Nationality["Uy"] = "UY";
    Nationality["Uz"] = "UZ";
    Nationality["Va"] = "VA";
    Nationality["Vc"] = "VC";
    Nationality["Ve"] = "VE";
    Nationality["Vg"] = "VG";
    Nationality["Vi"] = "VI";
    Nationality["Vn"] = "VN";
    Nationality["Vu"] = "VU";
    Nationality["Wf"] = "WF";
    Nationality["Ws"] = "WS";
    Nationality["Xk"] = "XK";
    Nationality["Ye"] = "YE";
    Nationality["Yt"] = "YT";
    Nationality["Za"] = "ZA";
    Nationality["Zm"] = "ZM";
    Nationality["Zw"] = "ZW";
})(Nationality = exports.Nationality || (exports.Nationality = {}));
var PaymentFrequency;
(function (PaymentFrequency) {
    PaymentFrequency["Monthly"] = "MONTHLY";
    PaymentFrequency["Quarterly"] = "QUARTERLY";
    PaymentFrequency["Yearly"] = "YEARLY";
    PaymentFrequency["None"] = "NONE";
})(PaymentFrequency = exports.PaymentFrequency || (exports.PaymentFrequency = {}));
var ScopeType;
(function (ScopeType) {
    ScopeType["Offline"] = "OFFLINE";
    ScopeType["Accounts"] = "ACCOUNTS";
    ScopeType["Users"] = "USERS";
    ScopeType["Transactions"] = "TRANSACTIONS";
    ScopeType["Transfers"] = "TRANSFERS";
    ScopeType["Subscriptions"] = "SUBSCRIPTIONS";
    ScopeType["Statements"] = "STATEMENTS";
    ScopeType["Admin"] = "ADMIN";
    ScopeType["Clients"] = "CLIENTS";
})(ScopeType = exports.ScopeType || (exports.ScopeType = {}));
var SepaTransferStatus;
(function (SepaTransferStatus) {
    SepaTransferStatus["Created"] = "CREATED";
    SepaTransferStatus["Authorized"] = "AUTHORIZED";
    SepaTransferStatus["Confirmed"] = "CONFIRMED";
    SepaTransferStatus["Booked"] = "BOOKED";
})(SepaTransferStatus = exports.SepaTransferStatus || (exports.SepaTransferStatus = {}));
var StandingOrderReoccurenceType;
(function (StandingOrderReoccurenceType) {
    StandingOrderReoccurenceType["Monthly"] = "MONTHLY";
    StandingOrderReoccurenceType["Quarterly"] = "QUARTERLY";
    StandingOrderReoccurenceType["EverySixMonths"] = "EVERY_SIX_MONTHS";
    StandingOrderReoccurenceType["Annually"] = "ANNUALLY";
})(StandingOrderReoccurenceType = exports.StandingOrderReoccurenceType || (exports.StandingOrderReoccurenceType = {}));
var StandingOrderStatus;
(function (StandingOrderStatus) {
    StandingOrderStatus["Created"] = "CREATED";
    StandingOrderStatus["Active"] = "ACTIVE";
    StandingOrderStatus["Inactive"] = "INACTIVE";
    StandingOrderStatus["Canceled"] = "CANCELED";
})(StandingOrderStatus = exports.StandingOrderStatus || (exports.StandingOrderStatus = {}));
var TimedOrderStatus;
(function (TimedOrderStatus) {
    TimedOrderStatus["Created"] = "CREATED";
    TimedOrderStatus["AuthorizationRequired"] = "AUTHORIZATION_REQUIRED";
    TimedOrderStatus["ConfirmationRequired"] = "CONFIRMATION_REQUIRED";
    TimedOrderStatus["Scheduled"] = "SCHEDULED";
    TimedOrderStatus["Executed"] = "EXECUTED";
    TimedOrderStatus["Canceled"] = "CANCELED";
    TimedOrderStatus["Failed"] = "FAILED";
})(TimedOrderStatus = exports.TimedOrderStatus || (exports.TimedOrderStatus = {}));
var TransactionCategory;
(function (TransactionCategory) {
    TransactionCategory["Private"] = "PRIVATE";
    TransactionCategory["Vat"] = "VAT";
    TransactionCategory["Vat_0"] = "VAT_0";
    TransactionCategory["Vat_7"] = "VAT_7";
    TransactionCategory["Vat_19"] = "VAT_19";
    TransactionCategory["TaxPayment"] = "TAX_PAYMENT";
    TransactionCategory["VatPayment"] = "VAT_PAYMENT";
    TransactionCategory["TaxRefund"] = "TAX_REFUND";
    TransactionCategory["VatRefund"] = "VAT_REFUND";
})(TransactionCategory = exports.TransactionCategory || (exports.TransactionCategory = {}));
var TransactionFeeStatus;
(function (TransactionFeeStatus) {
    TransactionFeeStatus["Created"] = "CREATED";
    TransactionFeeStatus["Charged"] = "CHARGED";
    TransactionFeeStatus["Refunded"] = "REFUNDED";
    TransactionFeeStatus["Cancelled"] = "CANCELLED";
    TransactionFeeStatus["RefundInitiated"] = "REFUND_INITIATED";
})(TransactionFeeStatus = exports.TransactionFeeStatus || (exports.TransactionFeeStatus = {}));
var TransactionFeeType;
(function (TransactionFeeType) {
    TransactionFeeType["Atm"] = "ATM";
    TransactionFeeType["ForeignTransaction"] = "FOREIGN_TRANSACTION";
    TransactionFeeType["DirectDebitReturn"] = "DIRECT_DEBIT_RETURN";
    TransactionFeeType["SecondReminderEmail"] = "SECOND_REMINDER_EMAIL";
    TransactionFeeType["CardReplacement"] = "CARD_REPLACEMENT";
})(TransactionFeeType = exports.TransactionFeeType || (exports.TransactionFeeType = {}));
var TransactionProjectionType;
(function (TransactionProjectionType) {
    TransactionProjectionType["CreditPresentment"] = "CREDIT_PRESENTMENT";
    TransactionProjectionType["CashManual"] = "CASH_MANUAL";
    TransactionProjectionType["Atm"] = "ATM";
    TransactionProjectionType["CancelManualLoad"] = "CANCEL_MANUAL_LOAD";
    TransactionProjectionType["CardUsage"] = "CARD_USAGE";
    TransactionProjectionType["DirectDebitAutomaticTopup"] = "DIRECT_DEBIT_AUTOMATIC_TOPUP";
    TransactionProjectionType["DirectDebitReturn"] = "DIRECT_DEBIT_RETURN";
    TransactionProjectionType["DisputeClearing"] = "DISPUTE_CLEARING";
    TransactionProjectionType["ManualLoad"] = "MANUAL_LOAD";
    TransactionProjectionType["WireTransferTopup"] = "WIRE_TRANSFER_TOPUP";
    TransactionProjectionType["TransferToBankAccount"] = "TRANSFER_TO_BANK_ACCOUNT";
    TransactionProjectionType["CancellationBooking"] = "CANCELLATION_BOOKING";
    TransactionProjectionType["CancellationDoubleBooking"] = "CANCELLATION_DOUBLE_BOOKING";
    TransactionProjectionType["CreditTransferCancellation"] = "CREDIT_TRANSFER_CANCELLATION";
    TransactionProjectionType["CurrencyTransactionCancellation"] = "CURRENCY_TRANSACTION_CANCELLATION";
    TransactionProjectionType["DirectDebit"] = "DIRECT_DEBIT";
    TransactionProjectionType["ForeignPayment"] = "FOREIGN_PAYMENT";
    TransactionProjectionType["Other"] = "OTHER";
    TransactionProjectionType["SepaCreditTransferReturn"] = "SEPA_CREDIT_TRANSFER_RETURN";
    TransactionProjectionType["SepaCreditTransfer"] = "SEPA_CREDIT_TRANSFER";
    TransactionProjectionType["SepaDirectDebitReturn"] = "SEPA_DIRECT_DEBIT_RETURN";
    TransactionProjectionType["SepaDirectDebit"] = "SEPA_DIRECT_DEBIT";
    TransactionProjectionType["Transfer"] = "TRANSFER";
    TransactionProjectionType["InternationalCreditTransfer"] = "INTERNATIONAL_CREDIT_TRANSFER";
    TransactionProjectionType["CancellationSepaDirectDebitReturn"] = "CANCELLATION_SEPA_DIRECT_DEBIT_RETURN";
    TransactionProjectionType["Rebooking"] = "REBOOKING";
    TransactionProjectionType["CancellationDirectDebit"] = "CANCELLATION_DIRECT_DEBIT";
    TransactionProjectionType["CancellationSepaCreditTransferReturn"] = "CANCELLATION_SEPA_CREDIT_TRANSFER_RETURN";
    TransactionProjectionType["CardTransaction"] = "CARD_TRANSACTION";
})(TransactionProjectionType = exports.TransactionProjectionType || (exports.TransactionProjectionType = {}));
var TransferStatus;
(function (TransferStatus) {
    TransferStatus["Created"] = "CREATED";
    TransferStatus["Authorized"] = "AUTHORIZED";
    TransferStatus["Confirmed"] = "CONFIRMED";
    TransferStatus["Booked"] = "BOOKED";
    TransferStatus["Active"] = "ACTIVE";
    TransferStatus["Inactive"] = "INACTIVE";
    TransferStatus["Canceled"] = "CANCELED";
    TransferStatus["AuthorizationRequired"] = "AUTHORIZATION_REQUIRED";
    TransferStatus["ConfirmationRequired"] = "CONFIRMATION_REQUIRED";
    TransferStatus["Scheduled"] = "SCHEDULED";
    TransferStatus["Executed"] = "EXECUTED";
    TransferStatus["Failed"] = "FAILED";
})(TransferStatus = exports.TransferStatus || (exports.TransferStatus = {}));
var TransferType;
(function (TransferType) {
    TransferType["SepaTransfer"] = "SEPA_TRANSFER";
    TransferType["StandingOrder"] = "STANDING_ORDER";
    TransferType["TimedOrder"] = "TIMED_ORDER";
})(TransferType = exports.TransferType || (exports.TransferType = {}));
//# sourceMappingURL=schema.js.map