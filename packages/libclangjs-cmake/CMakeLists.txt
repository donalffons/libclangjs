cmake_minimum_required(VERSION 3.8)
project(libclangjs-cmake)

add_library(libclangjs-cmake STATIC "./node_modules/libclangjs/main.cpp")

find_package(LLVM REQUIRED)
find_package(Clang REQUIRED)
target_include_directories(libclangjs-cmake PUBLIC ${CLANG_INCLUDE_DIRS})

set_target_properties(
  libclangjs-cmake PROPERTIES
  COMPILE_FLAGS "-O3 -pthread"
)
