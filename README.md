[![Release libclangjs](https://github.com/donalffons/libclangjs/actions/workflows/build.yml/badge.svg)](https://github.com/donalffons/libclangjs/actions/workflows/build.yml)

<p align="center">
  <img src="https://github.com/donalffons/libclangjs/raw/dev/logo-transparent.png" alt="Logo" width="50%">

  <h3 align="center">Libclangjs</h3>

  <p align="center">
    JavaScript bindings to the libClang API via WebAssembly and Emscripten.
  </p>
</p>

# Quickstart

## 1. Install the package from NPM

```bash
$ npm install libclangjs
```

## 2.a. Usage with NodeJS

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
import init from "libclangjs/node.js"; // The NodeJS version of libclang uses the CommonJS module format

const cwd = "/home/web_user";

init().then(clang => {
  clang.FS.mount(clang.NODEFS, { root: "." }, cwd); // Share the current directory with libclang
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

## 2.b. Usage with the browser

```js
const code =
`class TestClass {
public:
  TestClass();
  ~TestClass();
};
`;

// ...

import init from "libclangjs/web"; // The web version of libclang uses the ESM module format

const cwd = "/home/web_user";
init().then(clang => {
  clang.FS.writeFile(`${cwd}/main.cpp`, code); // Create a source file in the memory file system (sharing is not possible, here)
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

Libclang uses multi-threading for maximum performance, which requires the use of a SharedArrayBuffer, which is a [well supported feature](https://caniuse.com/sharedarraybuffer) in modern browsers. Enabling this feature requires setting the `Cross-Origin-Opener-Policy: same-origin` and `Cross-Origin-Embedder-Policy: require-corp` headers on the top level document, as described [here](https://web.dev/cross-origin-isolation-guide/). An example config for NextJS would look like this:

```js
// next.config.js
const nextConfig = {
  headers: async () => [{
    source: "/:path*",
    headers: [{
      key: "Cross-Origin-Opener-Policy",
      value: "same-origin",
    }, {
      key: "Cross-Origin-Embedder-Policy",
      value: "require-corp",
    }],
  }],
}

module.exports = nextConfig
```

## 3. Output

```txt
ClassDecl TestClass { filename: '/home/web_user/main.cpp', line: 1, column: 7 }
CXXAccessSpecifier  { filename: '/home/web_user/main.cpp', line: 2, column: 1 }
CXXConstructor TestClass { filename: '/home/web_user/main.cpp', line: 3, column: 3 }
CXXDestructor ~TestClass { filename: '/home/web_user/main.cpp', line: 4, column: 3 }
```

The execution will take several seconds to complete. A big part of that time is taken by the call to `init`. Subsequent function calls should run fast - but so far no benchmarking against the native version has been done.

# Extending / Integrating with other C/C++ code

Check out [Libclangjs-cmake on NPM](https://www.npmjs.com/package/libclangjs-cmake) and [this test](https://github.com/donalffons/libclangjs/tree/main/tests/test-cmake) for an example on how this can be achieved.

# Contribution and release workflow

This project ist using [Changesets](https://github.com/changesets) for publishing and managing versions.

1. Create a new branch / PR with the desired canges
2. After the changes are made, run `pnpm changeset` and answer the questionnaire. Commit the results.
