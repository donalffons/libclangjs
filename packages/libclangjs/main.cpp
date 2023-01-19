#include <clang-c/Index.h>
#include <iostream>

int main() {
  std::cout << "Hello " << clang_defaultDiagnosticDisplayOptions() << std::endl;
  return 0;
}