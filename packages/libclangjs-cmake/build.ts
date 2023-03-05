import { exec } from "shelljs";
import path from "path";
import fs from "fs";
import os from "os";

const buildPath = path.join(__dirname, "build");
const distPath = path.join(__dirname, "dist");

const configureAndRunBuild = () => {
  {
    // Configure
    fs.rmSync("build", { recursive: true, force: true });
    fs.mkdirSync("build", { recursive: true });
    const res = exec(`emcmake cmake .. ${[
      `-DLLVM_DIR="${path.join(__dirname, "node_modules", "llvm-project-emscripten", "dist", "lib", "cmake", "llvm")}"`,
      `-DClang_DIR="${path.join(__dirname, "node_modules", "llvm-project-emscripten", "dist", "lib", "cmake", "clang")}"`,
    ].join(" ")}`, { cwd: buildPath });
    if (res.code !== 0) throw new Error(res.stderr);
  }
  {
    // Run build
    const res = exec("cmake --build .", { cwd: buildPath });
    if (res.code !== 0) throw new Error(res.stderr);
  }
  {
    // Copy assets
    fs.rmSync("dist", { recursive: true, force: true });
    fs.mkdirSync(path.join("dist", "lib"), { recursive: true });
    fs.copyFileSync(path.join(buildPath, "liblibclangjs-cmake.a"), path.join(distPath, "lib", "liblibclangjs-cmake.a"));
    fs.copyFileSync(path.join(__dirname, "libclangjs-cmakeConfig.cmake"), path.join(distPath, "libclangjs-cmakeConfig.cmake"));
    fs.cpSync(path.join(__dirname, "node_modules", "llvm-project-emscripten", "dist"), path.join(distPath, "llvm-project-emscripten"), { recursive: true });
    fs.copyFileSync(path.join(__dirname, "package.json"), path.join(distPath, "package.json"));
  }
};

configureAndRunBuild();
