import { exec, env } from "shelljs";
import path from "path";
import fs from "fs";
import os from "os";

const buildPath = path.join(__dirname, "build");
const distPath = path.join(__dirname, "dist");

{
  // Configure
  fs.mkdirSync("build", { recursive: true });
  const res = exec(`emcmake cmake .. ${[
    `-DLLVM_DIR=${path.join(__dirname, "node_modules", "llvm-project-emscripten", "dist", "lib", "cmake", "llvm")}`,
    `-DClang_DIR=${path.join(__dirname, "node_modules", "llvm-project-emscripten", "dist", "lib", "cmake", "clang")}`,
  ].join(" ")}`, { cwd: buildPath });
  if (res.code !== 0) throw new Error(res.stderr);
}
{
  // Run build
  const res = exec(`make -j${os.cpus().length}`, { cwd: buildPath });
  if (res.code !== 0) throw new Error(res.stderr);
}
