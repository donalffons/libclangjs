cmake_minimum_required(VERSION 3.5)

if(NOT DEFINED ENVIRONMENT OR NOT (${ENVIRONMENT} STREQUAL "node"))
  message(FATAL_ERROR "The \"ENVIRONMENT\" variable must be set via the command line. Supported values are: \"node\"")
endif()

project(libclangjs)

add_executable(libclangjs "main.cpp")

find_package(LLVM REQUIRED)
find_package(Clang REQUIRED)
target_include_directories(libclangjs PUBLIC ${CLANG_INCLUDE_DIRS})
link_directories(${LLVM_LIBRARY_DIRS})
target_link_libraries(libclangjs libclang)

set_target_properties(
  libclangjs PROPERTIES
  COMPILE_FLAGS ""
  LINK_FLAGS "-lnodefs.js -sEXPORTED_FUNCTIONS=NODEFS -lembind -sMODULARIZE=1 -sEXPORTED_RUNTIME_METHODS=FS -sALLOW_MEMORY_GROWTH=1 -sENVIRONMENT=${ENVIRONMENT}"
  OUTPUT_NAME "libclangjs-${ENVIRONMENT}"
)
