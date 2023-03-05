[![Release libclangjs](https://github.com/donalffons/libclangjs/actions/workflows/build.yml/badge.svg)](https://github.com/donalffons/libclangjs/actions/workflows/build.yml)

<p align="center">
  <img src="https://github.com/donalffons/libclangjs/raw/dev/logo-transparent.png" alt="Logo" width="50%">

  <h3 align="center">Libclangjs</h3>

  <p align="center">
    JavaScript bindings to the libClang API via WebAssembly and Emscripten.
  </p>
</p>

CMake package to be used for integrating / extending Libclangjs. This project is meant to be used with another CMake project and Emscripten.

# Quickstart

Check the [test-cmake package](https://github.com/donalffons/libclangjs/tree/main/tests/test-cmake) (part of libclangjs) for a simple example on how to use this package in your project.

Create a new npm project, which will extend the functionality of libclangjs.

```sh
$ mkdir my-libclangjs-project && cd my-libclangjs-project
$ npm init -y
```

Now, add a `CMakeLists.txt` for your project.

```CMake
cmake_minimum_required(VERSION 3.8)

project(my-libclangjs-project)

add_executable(my-libclangjs-project "main.cpp")

find_package(libclangjs-cmake REQUIRED)
target_include_directories(my-libclangjs-project PUBLIC ${CLANG_INCLUDE_DIRS})
target_link_libraries(my-libclangjs-project
  -Wl,--whole-archive libclangjs-cmake -Wl,--no-whole-archive
)

set_target_properties(
  my-libclangjs-project PROPERTIES
  COMPILE_FLAGS "-pthread"
  LINK_FLAGS "-pthread -lembind -sALLOW_MEMORY_GROWTH=1 -sENVIRONMENT=node,worker"
)
```

Please note:
- In the `target_link_libraries` call, the library `libclangjs-cmake` is embedded using the `--whole-archive` flag. Using these flags forces the compiler to evaluate all global constructors in that file. Emscripten's binding system relies on that mechanism to provide bindings from JavaScript.
- In the `set_target_properties` call, the `COMPILE_FLAGS` and `LINK_FLAGS` can be used to customize Emscripten to produce the desired output. [Check their documentation for more info](https://emscripten.org/docs/api_reference/advanced-apis.html#settings-js).

Add a `main.cpp` file to your project.

```cpp
#include <clang-c/Index.h>
#include <emscripten/emscripten.h>
#include <iostream>

int main() {
  auto i = clang_createIndex(1, 1);
  clang_parseTranslationUnit(i, "nonexistingfile", nullptr, 0, nullptr, 0, 0);
  EM_ASM({
    const index = Module.createIndex(1, 1);
    const nullTu = Module.parseTranslationUnit(index, "nonexistingfile", null, null, 0);
    console.log("nullTu is a null pointer?", Module.isNullPointer(nullTu));
  });
  return 0;
}
```

Configure and build your project.

```sh
$ mkdir build && cd build
$ emcmake cmake -B build -Dlibclangjs-cmake_DIR=./node_modules/libclangjs-cmake
$ cmake --build build
```

Now, you can simply run the application.

```sh
$ node my-libclangjs-project.js
> nullTu is a null pointer? true
```

This example is trivial, but shows how the functionality of Libclangjs can be extended. This extension is not limited to adding a main function, but can also include the addition of bindings (using [Embind](https://emscripten.org/docs/porting/connecting_cpp_and_javascript/embind.html)) and arbitrary code.
