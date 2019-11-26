# Changelog
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]
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
