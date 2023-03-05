if("${CMAKE_MAJOR_VERSION}.${CMAKE_MINOR_VERSION}" LESS 2.8)
   message(FATAL_ERROR "CMake >= 2.8.0 required")
endif()
if(CMAKE_VERSION VERSION_LESS "2.8.3")
   message(FATAL_ERROR "CMake >= 2.8.3 required")
endif()
cmake_policy(PUSH)
cmake_policy(VERSION 2.8.3...3.23)

get_filename_component(LIBCLANGJS_INSTALL_PREFIX "${CMAKE_CURRENT_LIST_FILE}" PATH)

if(NOT LLVM_DIR)
    set(LLVM_DIR "${LIBCLANGJS_INSTALL_PREFIX}/llvm-project-emscripten/lib/cmake/llvm")
endif()
if(NOT Clang_DIR)
    set(Clang_DIR "${LIBCLANGJS_INSTALL_PREFIX}/llvm-project-emscripten/lib/cmake/clang")
endif()
find_package(LLVM REQUIRED)
find_package(Clang REQUIRED)

set(CMAKE_IMPORT_FILE_VERSION 1)

add_library(libclangjs-cmake STATIC IMPORTED)

set_target_properties(libclangjs-cmake PROPERTIES
  INTERFACE_LINK_LIBRARIES libclang
)

set_property(TARGET libclangjs-cmake APPEND PROPERTY IMPORTED_CONFIGURATIONS NOCONFIG)
set_target_properties(libclangjs-cmake PROPERTIES
  IMPORTED_LINK_INTERFACE_LANGUAGES_NOCONFIG "CXX"
  IMPORTED_LOCATION_NOCONFIG "${LIBCLANGJS_INSTALL_PREFIX}/lib/liblibclangjs-cmake.a"
)

set(CMAKE_IMPORT_FILE_VERSION)
cmake_policy(POP)
