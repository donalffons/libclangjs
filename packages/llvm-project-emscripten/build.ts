import { exec, env } from "shelljs";
import path from "path";
import fs from "fs";

const buildPath = path.join(__dirname, "build");
const distPath = path.join(__dirname, "dist");
{
  // Git clone
  if (!fs.existsSync(buildPath)) {
    fs.mkdirSync("build");
    const res = exec("git clone -b llvmorg-15.0.7 --depth 1 https://github.com/llvm/llvm-project.git .", { cwd: buildPath });
    if (res.code !== 0) throw new Error(res.stderr);
  } else {
    console.log("build directory already exists, skipping git clone...");
  }
}
{
  // Configure
  const res = exec(`
      emcmake cmake -S llvm -B build -G Ninja ${[
      "-DCMAKE_BUILD_TYPE=Release",
      "-DLLVM_TARGETS_TO_BUILD=WebAssembly",
      "-DLLVM_INCLUDE_TESTS=OFF",
      "-DLLVM_ENABLE_PROJECTS=clang",
      "-DLLVM_ENABLE_PIC=OFF"
    ].join(" ")}
    `, {
    env: {
      ...env,
      "CXXFLAGS": "-Dwait4=__syscall_wait4 -pthread",
      "LDFLAGS": "-pthread",
    },
    cwd: buildPath,
  });
  if (res.code !== 0) throw new Error(res.stderr);
}
{
  // Run build
  const res = exec(`cmake --build build`, { cwd: buildPath });
  if (res.code !== 0) throw new Error(res.stderr);
}
{
  // Install
  fs.mkdirSync("dist", { recursive: true });
  const res = exec(`cmake -DCMAKE_INSTALL_PREFIX="${distPath}" -P build/cmake_install.cmake`, { cwd: buildPath });
  if (res.code !== 0) throw new Error(res.stderr);
}
