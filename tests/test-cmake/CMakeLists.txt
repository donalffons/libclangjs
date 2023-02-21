cmake_minimum_required(VERSION 3.8)

project(test-cmake)

add_executable(test-cmake "main.cpp")

find_package(libclangjs-cmake REQUIRED)
target_include_directories(test-cmake PUBLIC ${CLANG_INCLUDE_DIRS})
target_link_libraries(test-cmake
  -Wl,--whole-archive libclangjs-cmake -Wl,--no-whole-archive
)

set_target_properties(
  test-cmake PROPERTIES
  COMPILE_FLAGS "-O3 -pthread"
  LINK_FLAGS "-O3 -pthread -lembind -sALLOW_MEMORY_GROWTH=1 -sENVIRONMENT=node,worker"
)
