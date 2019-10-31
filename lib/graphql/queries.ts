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
