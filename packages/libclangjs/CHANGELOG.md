# libclangjs

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
