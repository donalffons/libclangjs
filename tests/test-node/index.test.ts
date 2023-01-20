import init, { CXIndex, CXTranslationUnit, LibClang } from "libclangjs";
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

let tu: CXTranslationUnit;

test(`call "clang_parseTranslationUnit"`, async () => {
  const nullTu = libclangjs.clang_parseTranslationUnit(index, "nonexistingfile", null, null, 0);
  expect(libclangjs.isNullPointer(nullTu)).toBeTruthy();
  tu = libclangjs.clang_parseTranslationUnit(index, path.join(cwd, "main.cpp"), [`-I${path.join(cwd, "dir")}`], null, 0);
  expect(libclangjs.isNullPointer(tu)).toBeFalsy();
  const cursor = libclangjs.clang_getTranslationUnitCursor(tu);
  let foundCookie = false;
  libclangjs.clang_visitChildren(cursor, (c, p) => {
    if (libclangjs.clang_getCursorSpelling(c) === "cookie") {
      foundCookie = true;
    }
    return libclangjs.CXChildVisitResult.Continue;
  });
  expect(foundCookie).toBeTruthy();
});
