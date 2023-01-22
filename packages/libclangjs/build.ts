import { exec, env } from "shelljs";
import path from "path";
import fs from "fs";
import os from "os";

const buildPath = path.join(__dirname, "build");
const distPath = path.join(__dirname);

const configureAndRunBuild = (environment: "node" | "web") => {
  {
    // Configure
    fs.rmSync("build", { recursive: true, force: true });
    fs.mkdirSync("build", { recursive: true });
    const res = exec(`emcmake cmake .. ${[
      `-DENVIRONMENT=${environment}`,
      `-DCMAKE_RUNTIME_OUTPUT_DIRECTORY="${distPath}"`,
      `-DLLVM_DIR="${path.join(__dirname, "node_modules", "llvm-project-emscripten", "dist", "lib", "cmake", "llvm")}"`,
      `-DClang_DIR="${path.join(__dirname, "node_modules", "llvm-project-emscripten", "dist", "lib", "cmake", "clang")}"`,
    ].join(" ")}`, { cwd: buildPath });
    if (res.code !== 0) throw new Error(res.stderr);
  }
  {
    // Run build
    const res = exec(`emmake make -j${os.cpus().length}`, { cwd: buildPath });
    if (res.code !== 0) throw new Error(res.stderr);
  }
};

configureAndRunBuild("node");
configureAndRunBuild("web");
