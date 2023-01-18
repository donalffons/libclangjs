import { exec, env, cd } from "shelljs";

exec("rm -fr build && mkdir build");
cd("build");
exec("git clone -b llvmorg-15.0.7 --depth 1 https://github.com/llvm/llvm-project.git")
cd("llvm-project");
exec("rm -fr build");
exec(`
  emcmake cmake -S llvm -B build -G Ninja ${[
    "-DCMAKE_BUILD_TYPE=Release",
    "-DLLVM_TARGETS_TO_BUILD=WebAssembly",
    "-DLLVM_BUILD_LLVM_DYLIB=OFF",
    "-DLLVM_INCLUDE_TESTS=OFF",
    "-DLLVM_ENABLE_PROJECTS=clang",
  ].join(" ")}
`, {
  env: {
    ...env,
    "CXXFLAGS": "-Dwait4=__syscall_wait4",
  },
});
exec("cmake --build build");
