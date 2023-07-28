# libclangjs

## 0.3.2

### Patch Changes

- bac88d6: Fix typo in readme

## 0.3.1

### Patch Changes

- 2547c97: Add simple documentation on how to integrate / extend using libclangjs-cmake

## 0.3.0

### Minor Changes

- 0d967de: Add husky to automate build cache pushing
- ffd3679: Include emscripten version (3.1.31) in build cache
- 0d967de: Release cmake package to allow integration into other C/C++ projects
- 0d967de: Run tests on non-main branches

## 0.2.5

### Patch Changes

- eba5145: Add docs on how to use web version
- 22f1d14: export FS object and use ESM in web builds
- e55730e: fix incorrect asset name in worker file for web build
- 4b56730: Add note on how to use SharedArrayBuffer

## 0.2.4

### Patch Changes

- 2d81be7: Add logos, document NodeJS usage

## 0.2.3

### Patch Changes

- a72b45b: fix signature of clang_getCursorKindSpelling
- d0c76f8: Add constructor and name properties to type definitions for EnumValue
- 7a3e0cd: remove "clang\_" prefix for brevity

## 0.2.2

### Patch Changes

- 1c60ee1: use readme from workspace
- b035294: fix types of init function

## 0.2.1

### Patch Changes

- 360e324: fix usage of enum values
- ef39d23: add repository info and description

## 0.2.0

### Minor Changes

- 613ff3e: added getExpansionLocation, getPresumedLocation, getInstantiationLocation, getSpellingLocation, getFileLocation

### Patch Changes

- 613ff3e: added test case
- 613ff3e: reuse the same wasm file for both web and node to reduce package size
- 613ff3e: fixed clang_File_tryGetRealPathName, clang_getFileTime, clang_getCursorDisplayName
- cbc2324: reuse the same wasm file for both web and node reduces package size
- 630c69c: fix clang_getCursorDisplayName to return string

## 0.1.8

### Patch Changes

- 0d0967c: improved build cache

## 0.1.7

### Patch Changes

- 163a75c: enable multi-threading
- e83d8b9: Use -O3 optimizations for highly optimized builds

## 0.1.6

### Patch Changes

- 9400c17: fix missing build artifacts in package

## 0.1.5

### Patch Changes

- e53e753: fix file name for type definitions file
- 055367f: re-export auxiliary types in type definitions entry point
- ef24599: test writing / reading translation units
- 51d1f45: make current version specific to NodeJS (allow for adding a web version, later)
- df252e8: ship versions for web and node

## 0.1.4

### Patch Changes

- be9d0d3: Added typescript definitions for all currently supported interfaces

## 0.1.3

### Patch Changes

- 03e9661: npmignore irrelevant files

## 0.1.2

### Patch Changes

- 44b8c7d: Added changeset action for automatic versioning and publishing of packages
- 28b803f: Improved documentation

## 0.1.1

### Patch Changes

- 84cf063: NPM publishing improvements

## 0.1.0

### Minor Changes

- c7a0d3e: Initial version
