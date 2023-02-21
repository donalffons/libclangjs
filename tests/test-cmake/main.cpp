#include <clang-c/Index.h>
#include <emscripten/emscripten.h>
#include <iostream>

int main() {
  auto i = clang_createIndex(1, 1);
  clang_parseTranslationUnit(i, "nonexistingfile", nullptr, 0, nullptr, 0, 0);
  EM_ASM({
    const index = Module.createIndex(1, 1);
    Module.parseTranslationUnit(index, "nonexistingfile", null, null, 0);
  });
  std::cout << "Hello, World!" << std::endl;
  return 0;
}
