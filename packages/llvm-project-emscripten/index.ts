import { exec, env } from "shelljs";
import path from "path";
import fs from "fs";

{
  // Create directory structure for "build"
  fs.rmSync("build", { recursive: true, force: true });
  fs.mkdirSync("build");
}
{
  // Build
  const buildPath = path.join(__dirname, "build");
  {
    // Git clone
    const res = exec("git clone -b llvmorg-15.0.7 --depth 1 https://github.com/llvm/llvm-project.git .", { cwd: buildPath });
    if (res.code !== 0) throw new Error(res.stderr);
  }
  {
    // Configure
    const res = exec(`
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
      cwd: buildPath,
    });
    if (res.code !== 0) throw new Error(res.stderr);
  }
  {
    // Run build
    const res = exec("cmake --build build", { cwd: buildPath });
    if (res.code !== 0) throw new Error(res.stderr);
  }
}
{
  // Create directory structure for "dist"
  fs.rmSync("dist", { recursive: true, force: true });
  fs.mkdirSync(path.join("dist", "lib"), { recursive: true });
  fs.mkdirSync(path.join("dist", "include"), { recursive: true });
}
{
  // Copy build results
  const resultPath = path.join(__dirname, "build", "build", "lib");
  const distPath = path.join(__dirname, "dist", "lib");
  const buildResults = fs.readdirSync(resultPath, { withFileTypes: true }).filter(f => !f.isDirectory() && f.name.endsWith(".a"));
  for (const r of buildResults) {
    fs.copyFileSync(path.join(resultPath, r.name), path.join(distPath, r.name));
  }
}
{
  // Copy include files
  fs.cpSync(path.join(__dirname, "build", "clang", "include"), path.join(__dirname, "dist", "include"), { recursive: true });
}
