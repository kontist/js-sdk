# Changelog
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]
## [0.50.4] - 2023-09-20
## Revert remove
- Put back `title, description, button, featuresToggleLabel, featureGroups` from the `subscriptionPlans` query, for backward compatibility
- Update the schema with the above deprecated fields

## [0.50.3] - 2023-09-12
## Removed
- Removed `title, description, button, featuresToggleLabel, featureGroups` from the `subscriptionPlans` query

## [0.49.0] - 2023-01-31
## Added
- Updated types in schema
- Added `getPinKey` and `changePINEncrypted` methods to `Card` module

## [0.48.0] - 2022-09-16
## Added
- Updated types in schema
- Added solarisBalance graphQL API
## [0.46.2] - 2022-07-05
- Updated types in schema
## [0.46.0] - 2022-06-08
### Added
- Added `id` field to `category` in document metadata query

## [0.46.0] - 2022-06-08
### Added
- Added `metadata` field to `Document` type

## [0.45.0] - 2022-05-05
### Added
- Added `EmailDocument` class with `fetchOne`, `fetchAll` and `matchEmailDocumentToTransaction` functions
## [0.44.0] - 2022-04-06
### Added
- Added `hasBusinessTaxNumber` field to `User` type
- Added `hasBusinessTaxNumberUpdatedAt` field to `User` type
## [0.43.0] - 2022-03-24

- Downgrades `client-oauth2` to `4.3.0` for compatibility reasons
## [0.38.0] - 2022-03-15
### Added
- Added `discountAmount` field to `Money` type
- Added `couponValidFor` field to `SubscriptionPlansResponse` type
## [0.36.0] - 2021-08-13
### Changed
- Replace `elsterCode` by `categoryCode`. Keep `elsterCode` for backward compatibility.

## [0.35.41] - 2021-06-29
- Remove deprecated `categorizeTransaction` mutation
### Added
- Added `isYearlyTaxServiceOnboardingCompleted` field to `User` type
## [0.35.26] - 2021-03-24
### Added
- Added `isYearlyTaxServiceOnboardingCompleted` field to `User` type

## [0.35.23] - 2021-03-15
### Added
- Added `invoicePdf` field to `User` type

## [0.35.20] - 2021-03-05
### Added
- Added `createInvoiceLogo` and `deleteInvoiceLogo` mutations to GraphQL schema
- Added `logoUrl` field to `InvoiceSettingsOutput` type

## [0.35.16] - 2021-03-01
### Changed
- Allow making GQL request to public endpoint [#153](https://github.com/kontist/js-sdk/pull/153)

### Added
- Added `poaUrl` field in schema for `viewer` [#169](https://github.com/kontist/js-sdk/pull/169)
- Added `signPOA` mutation to schema [#169](https://github.com/kontist/js-sdk/pull/169)

## [0.35.15] - 2021-02-24
### Added
- Added `categorizationType` field of `TransactionSplit` to the schema and the transactions query [#167](https://github.com/kontist/js-sdk/pull/167)

## [0.34.6] - 2020-09-02
### Changed
- Build correct verifier during oauth handshake [#145](https://github.com/kontist/js-sdk/pull/145)

## [0.33.0] - 2020-08-18

### Changed
- *Breaking*: removed several transaction fields from the results of the fetch and fetchAll transaction methods (see `TRANSACTION_DETAILS` in `lib/graphql/transaction` for the details) [#132](https://github.com/kontist/js-sdk/pull/132)

### Added
- Added `fetchOne` method on transaction model which will return all transaction fields for a given transaction ID [#132](https://github.com/kontist/js-sdk/pull/132)

## [0.31.3] - 2020-07-16

### Added
- Added `isSelfEmployed` field in schema for `UserUpdateInput` and `viewer`

## [0.31.2] - 2020-07-10

### Changed
- Move graphql back to dependencies [#122](https://github.com/kontist/js-sdk/pull/122)

## [0.31.0] - 2020-07-10

### Changed
- Updated dependencies (client-oauth2, graphql, graphql-request, ws) and dev dependencies
- Added cross-fetch ponyfill
- Resolve schema issues with transaction assets

## [0.30.0] - 2020-07-08

### Added
- Added helpers for uploading and deleting transaction assets (`models.transaction.createTransactionAsset`, `models.transaction.finalizeTransactionAssetUpload`, `models.transaction.deleteTransactionAsset`)

### Changed
- `updatePlan` method of `subscription` model extended with optional `couponCode` param

## [0.29.1] - 2020-06-11

### Added
- Added a new `personalNote` field on transactions and transfers - this field allows users to annotate their transactions with text that will only be available to them
- Added a new `update` method on `transaction` model, which allows to update category, userSelectedBookingDate and personalNote for a given transaction

### Changed
- `categorize` method of `transaction` model is now deprecated in favor of `update`

## [0.28.7] - 2020-06-09

### Added
- Added `createdAt` field to transactions

### Changed
- *Breaking*: renamed `taxPastYearAmount` field to `taxPastYearsAmount` for `getStats` method of `account` model

## [0.28.6] - 2020-05-29

### Changed
- *Breaking*: removed `taxCutoffLine` field from `user` model `get` method

## [0.28.3] - 2020-05-06

### Changed
- Extended Overdraft with requestedAt field

## [0.28.2] - 2020-05-05

### Added
- Added mutations for adding/deleting card token reference ids for Google Pay

### Changed
- card query now includes an array of added Google Pay card tokens

## [0.28.1] - 2020-05-04

### Changed
- Update vulnerable dependencies (`yargs`, `yargs-parser`)

## [0.28.0] - 2020-05-04

### Added
- Add helpers to split transactions (`models.transaction.createSplit`, `models.transaction.deleteSplit`, `models.transaction.updateSplit`)
- Add method to fetch account stats (`models.account.getStats`)

### Changed
- *Breaking*: renamed `StandingOrderReoccurenceType` to `StandingOrderReoccurrenceType`

## [0.27.0] - 2020-04-20
### Added
- Add flow type definitions in `lib/graphql/schema.flow.js`

## [0.26.0] - 2020-04-07
### Added
- Add `subscription` model with a method to update subscription plan (`subscription.updatePlan`)

## [0.25.8] - 2020-03-10
### Changed
- extended account query to return cardHolderRepresentation and cardHolderRepresentations fields

## [0.25.7] - 2020-03-06
### Added
- Card model now has a method to set card holder representation independently (`card.setCardHolderRepresentation`)

## [0.25.4] - 2020-03-01
### Changed
- Transaction search (`models.transaction.search`) will no longer consider numbers > 20M for the amount filter.

## [0.25.2] - 2020-02-28
### Changed
- *Breaking*: update transfer can now return confirmation request (Standing Order) or Transfer (Sepa Transfer, Timed Order)
- create transfer mutation allows now to provide category and booking date for Sepa Transfer, Standing Order and Timed Order
- update transfer mutation allows now to provide category and booking date for pending Sepa Transfer, Standing Order, and Timed Order. `category` and `userSelectedBookingDate` are the only editable fields for Timed Order and pending Sepa Transfer
- amount is not required anymore for an update of Standing Order
- Transaction search method will now only look for IBAN matches when user provides terms comprised of 2 letters followed by 2+ numbers

## [0.25.0] - 2020-02-19
### Added
- Add a filter argument to transaction fetch query
- Add a method to search for transactions matching a user's input string

## [0.24.0] - 2020-01-22
### Added
- Add a method to replace a card (`models.card.replace`)
- Add a method to reorder a card (`models.card.reorder`)
- Add a method to update standing orders (`models.transfer.update`)

### Changed
- *Breaking*: changed card types to use schema types (CreateCardOptions, ActivateCardOptions, ChangeCardPINOptions, ConfirmChangeCardPINOptions, ChangeCardStatusOptions, UpdateCardSettingsOptions).

## [0.23.0] - 2020-01-17
### Added
- Add `card` model and associated methods (see: `lib/graphql/card.ts`)
- Add a method to categorize transactions (`models.transaction.categorize`)
- Add a method to fetch wire transfer suggestions (`models.transfer.suggestions`)

## [0.22.2] - 2019-11-26
### Fixed
- Async iterators now return results in the correct order (latest transactions / transfers first by default)
- Status filter for transfers is now working properly

## [0.22.0] - 2019-11-26
### Added
- Introduce a method to subscribe to new transactions (`models.transaction.subscribe`)
- Introduce methods for fetching transfers (`models.transfer.fetch`, `models.transfer.fetchAll`)

### Changed
- *Breaking*: changed transaction async iterator from `models.transaction` to `models.transaction.fetchAll`.

## [0.21.0] - 2019-11-22
### Changed
- Type for `Transaction.category` changed from `string` to `TransactionCategory` enum. This is a *breaking* change.

## [0.20.0] - 2019-11-18
### Added
- Introduce methods for transfers cancellation (`cancelTransfer` and `confirmCancelTransfer`)
- Introduce basic CLI to fetch token with `npx kontist token` [#35](https://github.com/kontist/js-sdk/pull/35)

### Changed
- Refactored `Auth` module with separate namespaces:
  - `auth.push` for push notification MFA
  - `auth.device` for device binding MFA
  - `auth.tokenManager` for token management logic and state. *Note:* existing methods on the `auth` namespace (`getAuthUri`, `fetchToken`, `fetchTokenFromCredentials`, `refresh`, `setToken`, and `token`) are deprecated and will be removed in an upcoming major version. They were all moved to this new `auth.tokenManager` namespace.

## [0.19.0] - 2019-11-12
### Added
- Expose Interfaces, Types and Errors [#30](https://github.com/kontist/js-sdk/pull/30)
- Intergrate basic Code Coverage [#27](https://github.com/kontist/js-sdk/pull/27)
- Add changelog [#29](https://github.com/kontist/js-sdk/pull/29)

### Changed
- Extended validation of client options [#25](https://github.com/kontist/js-sdk/pull/25)


## [0.18.0] - 2019-11-09
### Added
- Introduce refresh method when doing browser auth via PKCE [#19](https://github.com/kontist/js-sdk/pull/19)
- Expose `Schema` in "kontist" namespace
- Improved handling of GraphQL error messages

### Changed
- Rename package to "kontist" instead of "@kontist/client"
- Upgrade to TypeScript 3.7 and remove lodash [#22](https://github.com/kontist/js-sdk/pull/22)
