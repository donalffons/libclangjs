import fs from "fs";

fs.rmSync("build", { recursive: true, force: true });
fs.rmSync("libclangjs-node.js", { force: true });
fs.rmSync("libclangjs-node.wasm", { force: true });
fs.rmSync("libclangjs-web.js", { force: true });
fs.rmSync("libclangjs-web.wasm", { force: true });
