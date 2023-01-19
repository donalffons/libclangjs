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
  if (!fs.existsSync(distPath)) {
    fs.mkdirSync("dist");
    const res = exec(`
        emcmake cmake -S llvm -B "${distPath}" -G Ninja ${[
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
      cwd: buildPath,
    });
    if (res.code !== 0) throw new Error(res.stderr);
  } else {
    console.log("dist directory already exists, skipping configure...");
  }
}
{
  // Run build
  const res = exec(`cmake --build .`, { cwd: distPath });
  if (res.code !== 0) throw new Error(res.stderr);
}
