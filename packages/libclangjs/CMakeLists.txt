cmake_minimum_required(VERSION 3.5)

project(libclangjs)

add_executable(libclangjs "main.cpp")

find_package(LLVM REQUIRED)
find_package(Clang REQUIRED)
target_include_directories(libclangjs PUBLIC ${CLANG_INCLUDE_DIRS})
target_link_libraries(libclangjs "${LLVM_LIBRARY_DIRS}/libclang.a")
