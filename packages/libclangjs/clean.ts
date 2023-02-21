import fs from "fs";

fs.rmSync("build", { recursive: true, force: true });
fs.rmSync("node.js", { force: true });
fs.rmSync("node.worker.js", { force: true });
fs.rmSync("web.js", { force: true });
fs.rmSync("web.worker.js", { force: true });
fs.rmSync("libclang.wasm", { force: true });
fs.rmSync("README.md", { force: true });
