[![Release libclangjs](https://github.com/donalffons/libclangjs/actions/workflows/build.yml/badge.svg)](https://github.com/donalffons/libclangjs/actions/workflows/build.yml)

<p align="center">
  <img src="https://github.com/donalffons/libclangjs/raw/dev/logo-transparent.png" alt="Logo" width="50%">

  <h3 align="center">Libclangjs</h3>

  <p align="center">
    JavaScript bindings to the libClang API via WebAssembly and Emscripten.
  </p>
</p>

## Usage with NodeJS

Install the package from NPM

```bash
$ npm install libclangjs
```

Add the Code you want to analyze using clang

```cpp
// main.cpp in the root of your project, alongside the package.json
class TestClass {
public:
  TestClass();
  ~TestClass();
};
```

Analyze the code using clang

```js
import init from "libclangjs/node.js";

const cwd = "/home/web_user";

init().then(clang => {
  clang.FS.mount(clang.NODEFS, { root: "." }, cwd);
  const index = clang.createIndex(1, 1);
  const tu = clang.parseTranslationUnit(index, `${cwd}/main.cpp`, null, null, 0);
  const cursor = clang.getTranslationUnitCursor(tu);

  clang.visitChildren(cursor, (c, p) => {
    console.log(clang.getCursorKindSpelling(clang.getCursorKind(c)), clang.getCursorSpelling(c), clang.getPresumedLocation(clang.getCursorLocation(c)));
    return clang.CXChildVisitResult.Recurse;
  });

  clang.PThread.terminateAllThreads();
});
```

Output

```txt
ClassDecl TestClass { filename: '/home/web_user/main.cpp', line: 1, column: 7 }
CXXAccessSpecifier  { filename: '/home/web_user/main.cpp', line: 2, column: 1 }
CXXConstructor TestClass { filename: '/home/web_user/main.cpp', line: 3, column: 3 }
CXXDestructor ~TestClass { filename: '/home/web_user/main.cpp', line: 4, column: 3 }
```

The execution will take several seconds to complete. A big part of that time is taken by the call to `init`. Subsequent function calls should run fast - but so far no benchmarking against the native version has been done.

## Contribution and release workflow

This project ist using [Changesets](https://github.com/changesets) for publishing and managing versions.

1. Create a new branch / PR with the desired canges
2. After the changes are made, run `pnpm changeset` and answer the questionnaire. Commit the results.
