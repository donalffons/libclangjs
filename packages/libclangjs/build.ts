import { exec } from "shelljs";
import path from "path";
import fs from "fs";
import os from "os";
import { findWorkspaceDir } from "@pnpm/find-workspace-dir";

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
  {
    // Fix naming of assets
    const mainJs = path.join(distPath, `${environment}.js`);
    const workerJs = path.join(distPath, `${environment}.worker.js`);

    fs.renameSync(path.join(distPath, "LIBCLANG_OUTPUT_NAME.js"), mainJs);
    fs.renameSync(path.join(distPath, "LIBCLANG_OUTPUT_NAME.worker.js"), workerJs);
    fs.renameSync(path.join(distPath, "LIBCLANG_OUTPUT_NAME.wasm"), path.join(distPath, "libclang.wasm"));

    fs.writeFileSync(mainJs,
      fs.readFileSync(mainJs, { encoding: "utf8" })
        .replace("LIBCLANG_OUTPUT_NAME.worker.js", `${environment}.worker.js`)
        .replace("LIBCLANG_OUTPUT_NAME.wasm", "libclang.wasm")
    );
  }
};

const copyReadme = async () => {
  const workspaceDir = await findWorkspaceDir(__dirname);
  if (!workspaceDir) throw new Error("Cannot find workspace directory");
  fs.copyFileSync(path.join(workspaceDir, "README.md"), "README.md")
};

configureAndRunBuild("node");
configureAndRunBuild("web");
copyReadme();
