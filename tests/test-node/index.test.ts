import init, { CXIndex, LibClang } from "libclangjs";
import path from "path";
import fs from "fs";

let libclangjs: LibClang;
const cwd = path.join("home", "web_user");

test("Can initialize libclangjs ", async () => {
  libclangjs = await init();
});

test("Can mount shared volume ", async () => {
  libclangjs.FS.mount(libclangjs.NODEFS, { root: "testSrc" }, cwd);
  expect(libclangjs.FS.readdir(cwd)).toContain("header.hpp");
});

let index: CXIndex;

test("Can create libclang index ", async () => {
  index = libclangjs.clang_createIndex(1, 1);
});

test(`call "clang_CXIndex_setInvocationEmissionPathOption" with both string and null as second parameter`, async () => {
  libclangjs.clang_CXIndex_setInvocationEmissionPathOption(index, null);
  fs.mkdirSync(path.join("testSrc", "log"), { recursive: true });
  libclangjs.clang_CXIndex_setInvocationEmissionPathOption(index, path.join(cwd, "log"));
});
