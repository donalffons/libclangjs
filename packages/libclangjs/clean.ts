import fs from "fs";

fs.rmSync("build", { recursive: true, force: true });
fs.rmSync("node.js", { force: true });
fs.rmSync("node.wasm", { force: true });
fs.rmSync("web.js", { force: true });
fs.rmSync("web.wasm", { force: true });
fs.rmSync("README.md", { force: true });
