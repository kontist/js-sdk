# Changelog
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]
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
