export const GET_USER = `query {
  viewer {
    birthDate
    birthPlace
    businessPurpose
    city
    companyType
    country
    createdAt
    economicSector
    email
    firstName
    gender
    identificationLink
    identificationStatus
    isUSPerson
    lastName
    mobileNumber
    nationality
    otherEconomicSector
    postCode
    publicId
    referralCode
    street
    taxCutoffLine
    taxPaymentFrequency
    taxRate
    untrustedPhoneNumber
    vatCutoffLine
    vatNumber
    vatPaymentFrequency
    vatRate
  }
}`;

export const GET_ACCOUNT = `query {
  viewer {
    mainAccount {
      iban
      balance
    }
  }
}`;

export const FETCH_TRANSACTIONS = `query fetchTransactions ($first: Int, $last: Int, $after: String, $before: String) {
  viewer {
    mainAccount {
      transactions(first: $first, last: $last, after: $after, before: $before) {
        edges {
          node {
              id
              amount
              name
              iban
              type
              bookingDate
              valutaDate
              originalAmount
              foreignCurrency
              e2eId
              mandateNumber
              paymentMethod
              category
              userSelectedBookingDate
              purpose
              documentNumber
              documentPreviewUrl
              documentDownloadUrl
              documentType
          }
        }
        pageInfo {
          hasNextPage
          hasPreviousPage
          startCursor
          endCursor
        }
      }
    }
  }
}`;

export const CREATE_TRANSFER = `mutation createTransfer($transfer: CreateTransferInput!) {
  createTransfer(transfer: $transfer) {
    id
  }
}`;

export const CONFIRM_TRANSFER = `mutation confirmTransfer(
  $confirmationId: String!
  $authorizationToken: String!
) {
  confirmTransfer(
    transferId: $confirmationId
    authorizationToken: $authorizationToken
  ) {
    id
    status
    amount
    purpose
    recipient
    iban
    e2eId
  }
}`;

export const CREATE_TRANSFERS = `mutation createTransfers($transfers: [CreateTransferInput!]!) {
  createTransfers(transfers: $transfers) {
    confirmationId
  }
}`;

export const CONFIRM_TRANSFERS = `mutation confirmTransfer(
  $confirmationId: String!
  $authorizationToken: String!
) {
  confirmTransfers(
    confirmationId: $confirmationId
    authorizationToken: $authorizationToken
  ) {
    id
    status
    transfers {
      id
      status
      recipient
      iban
      purpose
      amount
      e2eId
    }
  }
}`;
