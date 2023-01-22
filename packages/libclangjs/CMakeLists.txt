cmake_minimum_required(VERSION 3.8)

if(NOT DEFINED ENVIRONMENT OR NOT (${ENVIRONMENT} STREQUAL "node" OR ${ENVIRONMENT} STREQUAL "web"))
  message(FATAL_ERROR "The \"ENVIRONMENT\" variable must be set via the command line. Supported values are: \"node\", \"web\"")
endif()

project(libclangjs)

add_executable(libclangjs "main.cpp")

find_package(LLVM REQUIRED)
find_package(Clang REQUIRED)
target_include_directories(libclangjs PUBLIC ${CLANG_INCLUDE_DIRS})
link_directories(${LLVM_LIBRARY_DIRS})
target_link_libraries(libclangjs libclang)

set(LINK_FLAGS "")
if(${ENVIRONMENT} STREQUAL "node")
  set(LINK_FLAGS "${LINK_FLAGS} -lnodefs.js -sEXPORTED_FUNCTIONS=NODEFS -sPTHREAD_POOL_SIZE='require(\"os\").cpus().length'")
else()
  set(LINK_FLAGS "-sPTHREAD_POOL_SIZE='navigator.hardwareConcurrency'")
endif()

set_target_properties(
  libclangjs PROPERTIES
  COMPILE_FLAGS "-O3 -pthread"
  LINK_FLAGS "-O3 ${LINK_FLAGS} -lembind -sMODULARIZE=1 -sEXPORTED_RUNTIME_METHODS=FS -sALLOW_MEMORY_GROWTH=1 -sENVIRONMENT=${ENVIRONMENT},worker -pthread -sEXPORT_NAME=libclangjs"
  OUTPUT_NAME "${ENVIRONMENT}"
)
