# [1.1.0](https://github.com/fullchico/cortex/compare/v1.0.1...v1.1.0) (2026-04-01)


### Bug Fixes

* wrap JSON.parse in try/catch in archiveVault and readFreestyledRoot ([4c38468](https://github.com/fullchico/cortex/commit/4c38468b398743a9b251518dc87a1059ee66f309))


### Features

* add cross-links to vault builders for graph topology ([a1f9ea6](https://github.com/fullchico/cortex/commit/a1f9ea6e49f33025c8ba6e8ef57112ef59d02f6b))
* add readVaultName to read vault location from .cortex marker ([d495b66](https://github.com/fullchico/cortex/commit/d495b666dffcc17bc2cc22a8828653304f8615cc))
* add slugifyVaultName for dynamic vault folder naming ([410f1de](https://github.com/fullchico/cortex/commit/410f1dee66e66fb645fff235e9785cc0f3581b47))
* createVault writes .cortex marker and uses slugified project name as vault folder ([e22e815](https://github.com/fullchico/cortex/commit/e22e8150f051d26dca558eed8284463c5c971f67))
* implement dynamic vault naming and update detection functions to utilize .cortex marker ([8c6ee32](https://github.com/fullchico/cortex/commit/8c6ee32e19cc9232d44bf896dcf2fc68ccf5a7c8))
* update vault detection functions to use dynamic vault name from marker ([e929619](https://github.com/fullchico/cortex/commit/e929619eb53cab1f9f77294985030f389e875119))
* updateGitignore uses dynamic vault name from project ([2630e6c](https://github.com/fullchico/cortex/commit/2630e6c7c6831f895a7d6626d2b2840b7de20d17))

## [1.0.1](https://github.com/fullchico/cortex/compare/v1.0.0...v1.0.1) (2026-04-01)


### Bug Fixes

* rename vault folder from .cortex to cortex for Obsidian visibility ([a0eedc0](https://github.com/fullchico/cortex/commit/a0eedc034f33fea1211541cd7723c4991a2b3309))

# 1.0.0 (2026-04-01)


### Bug Fixes

* improve error handling during vault archiving ([88e1676](https://github.com/fullchico/cortex/commit/88e1676655c6631daaa0c15b4a91f5179ae86352))
* update vault path references from ./cortex/ to ./.cortex/ ([24b5201](https://github.com/fullchico/cortex/commit/24b52013283cae40ec7ddd6fc3b4ad6c21cb7c9d))
* use non-globbed test path for cross-platform compatibility ([ddc6426](https://github.com/fullchico/cortex/commit/ddc642649f7beca1ed89f68371272ecafd5452f7))


### Features

* add Cortex protocol documentation and update .gitignore ([12583f3](https://github.com/fullchico/cortex/commit/12583f3ddabf85b98b1b5dcb45bd74e4829d6c2e))
* enhance detection and handling of AI tools and vaults ([933eefd](https://github.com/fullchico/cortex/commit/933eefd1ea046a24ef29743c35491e87eda6c871))
* enhance language handling and testing framework ([69f27fc](https://github.com/fullchico/cortex/commit/69f27fcde6c4f4a4d7209e542c16f913c92b4e42))
* enhance vault archiving process with conflict resolution ([ecc1201](https://github.com/fullchico/cortex/commit/ecc1201fef7f83c816e40740308c2457d5ce1223))
* enhance vault migration and project setup process ([bd5e1c3](https://github.com/fullchico/cortex/commit/bd5e1c32cfc0ca73568809cade86484d5c9375a8))
* implement Cortex protocol for file installation and appending ([6f0bb4f](https://github.com/fullchico/cortex/commit/6f0bb4f0dcca28d6ea5df9b720df5e484386f664))
* implement project archiving and enhanced initialization flow ([075b92f](https://github.com/fullchico/cortex/commit/075b92f051066f31268f69254abb4d999f0667d0))
* initialize Cortex framework with project structure and configuration ([76af396](https://github.com/fullchico/cortex/commit/76af396edc4807183dc2295376a0b363414695bf))
* refine vault migration options and initialization flow ([68b5f68](https://github.com/fullchico/cortex/commit/68b5f68215b9ad70462cf2ca2a24a89d0c434359))
* reorganize language selection prompt in cortex.js ([b821303](https://github.com/fullchico/cortex/commit/b821303b672205d506622ab737e3591e5b3f1ff8))
* streamline language handling in cortex.js ([2b8058c](https://github.com/fullchico/cortex/commit/2b8058c4b2101436d89cd746244ad22af415cb81))
* update language selection process in cortex.js ([e4fb79e](https://github.com/fullchico/cortex/commit/e4fb79ec0b428d89d4c750d57e8a0cfbeccad57b))

# 1.0.0 (2026-04-01)


### Bug Fixes

* improve error handling during vault archiving ([88e1676](https://github.com/fullchico/cortex/commit/88e1676655c6631daaa0c15b4a91f5179ae86352))
* update vault path references from ./cortex/ to ./.cortex/ ([24b5201](https://github.com/fullchico/cortex/commit/24b52013283cae40ec7ddd6fc3b4ad6c21cb7c9d))
* use non-globbed test path for cross-platform compatibility ([ddc6426](https://github.com/fullchico/cortex/commit/ddc642649f7beca1ed89f68371272ecafd5452f7))


### Features

* add Cortex protocol documentation and update .gitignore ([12583f3](https://github.com/fullchico/cortex/commit/12583f3ddabf85b98b1b5dcb45bd74e4829d6c2e))
* enhance detection and handling of AI tools and vaults ([933eefd](https://github.com/fullchico/cortex/commit/933eefd1ea046a24ef29743c35491e87eda6c871))
* enhance language handling and testing framework ([69f27fc](https://github.com/fullchico/cortex/commit/69f27fcde6c4f4a4d7209e542c16f913c92b4e42))
* enhance vault archiving process with conflict resolution ([ecc1201](https://github.com/fullchico/cortex/commit/ecc1201fef7f83c816e40740308c2457d5ce1223))
* enhance vault migration and project setup process ([bd5e1c3](https://github.com/fullchico/cortex/commit/bd5e1c32cfc0ca73568809cade86484d5c9375a8))
* implement Cortex protocol for file installation and appending ([6f0bb4f](https://github.com/fullchico/cortex/commit/6f0bb4f0dcca28d6ea5df9b720df5e484386f664))
* implement project archiving and enhanced initialization flow ([075b92f](https://github.com/fullchico/cortex/commit/075b92f051066f31268f69254abb4d999f0667d0))
* initialize Cortex framework with project structure and configuration ([76af396](https://github.com/fullchico/cortex/commit/76af396edc4807183dc2295376a0b363414695bf))
* refine vault migration options and initialization flow ([68b5f68](https://github.com/fullchico/cortex/commit/68b5f68215b9ad70462cf2ca2a24a89d0c434359))
* reorganize language selection prompt in cortex.js ([b821303](https://github.com/fullchico/cortex/commit/b821303b672205d506622ab737e3591e5b3f1ff8))
* streamline language handling in cortex.js ([2b8058c](https://github.com/fullchico/cortex/commit/2b8058c4b2101436d89cd746244ad22af415cb81))
* update language selection process in cortex.js ([e4fb79e](https://github.com/fullchico/cortex/commit/e4fb79ec0b428d89d4c750d57e8a0cfbeccad57b))
