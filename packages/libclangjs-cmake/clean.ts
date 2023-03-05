import fs from "fs";

fs.rmSync("build", { recursive: true, force: true });
fs.rmSync("dist", { recursive: true, force: true });
