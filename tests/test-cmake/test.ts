import { exec } from "shelljs";
import path from "path";
import fs from "fs";

const buildPath = path.join(__dirname, "build");

const configureAndRunBuild = () => {
  {
    fs.rmSync("build", { recursive: true, force: true });
    fs.mkdirSync("build", { recursive: true });
    fs.cpSync(path.join(__dirname, "node_modules", "libclangjs-cmake"), path.join(buildPath, "libclangjs-cmake"), { recursive: true });
  }
  {
    // Configure
    const res = exec(`emcmake cmake .. ${[
      `-Dlibclangjs-cmake_DIR="${path.join(buildPath, "libclangjs-cmake")}"`,
    ].join(" ")}`, { cwd: buildPath });
    if (res.code !== 0) throw new Error(res.stderr);
  }
  {
    // Run build
    const res = exec("cmake --build .", { cwd: buildPath });
    if (res.code !== 0) throw new Error(res.stderr);
  }
  {
    // Run executable
    const res = exec("node test-cmake.js", { cwd: buildPath });
    if (res.code !== 0) throw new Error(res.stderr);
  }
};

configureAndRunBuild();
