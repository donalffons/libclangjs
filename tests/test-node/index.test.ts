import init from "libclangjs/node";
import { CXFile, CXIndex, CXTranslationUnit, LibClang } from "libclangjs/libclangjs";
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

test(`Call "clang_CXIndex_setInvocationEmissionPathOption" with both string and null as second parameter`, async () => {
  libclangjs.clang_CXIndex_setInvocationEmissionPathOption(index, null);
  fs.mkdirSync(path.join("testSrc", "log"), { recursive: true });
  libclangjs.clang_CXIndex_setInvocationEmissionPathOption(index, path.join(cwd, "log"));
});

let tu: CXTranslationUnit;

test(`Call "clang_parseTranslationUnit"`, async () => {
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

let mainFile: CXFile;

test("Can get file contents", () => {
  mainFile = libclangjs.clang_getFile(tu, path.join(cwd, "main.cpp"));
  const fileContents = libclangjs.clang_getFileContents(tu, mainFile);
  expect(fileContents).toBe(fs.readFileSync(path.join("testSrc", "main.cpp")).toString());
});

test("Can make simple calls regarding CXSourceLocation", () => {
  const nullLoc = libclangjs.clang_getNullLocation();
  const loc1 = libclangjs.clang_getLocation(tu, mainFile, 0, 1);
  const loc2 = libclangjs.clang_getLocation(tu, mainFile, 0, 2);
  const loc3 = libclangjs.clang_getLocation(tu, mainFile, 3, 1);
  expect(libclangjs.clang_equalLocations(nullLoc, loc3)).toBe(0);
  expect(libclangjs.clang_equalLocations(loc1, loc2)).not.toBe(0);
  expect(libclangjs.clang_equalLocations(loc1, loc3)).toBe(0);
});

test("Can make simple calls regarding CXSourceRange", () => {
  const loc1 = libclangjs.clang_getLocation(tu, mainFile, 0, 1);
  const loc2 = libclangjs.clang_getLocation(tu, mainFile, 0, 2);
  const loc3 = libclangjs.clang_getLocation(tu, mainFile, 3, 1);
  const loc4 = libclangjs.clang_getLocation(tu, mainFile, 3, 2);
  const loc5 = libclangjs.clang_getLocation(tu, mainFile, 5, 1);
  const loc6 = libclangjs.clang_getLocation(tu, mainFile, 5, 2);
  const range1 = libclangjs.clang_getRange(loc1, loc3);
  const range2 = libclangjs.clang_getRange(loc2, loc4);
  const range3 = libclangjs.clang_getRange(loc5, loc6);
  expect(libclangjs.clang_equalRanges(range1, range2)).not.toBe(0)
  expect(libclangjs.clang_equalRanges(range1, range3)).toBe(0);
});

test("Can write / read translation unit to / from disk", () => {
  fs.mkdirSync(path.join("testSrc", "out"), { recursive: true });
  const exportFileName = path.join(cwd, "out", "export.tu");
  const ret = libclangjs.clang_saveTranslationUnit(tu, exportFileName, libclangjs.CXSaveTranslationUnit_Flags.None.value);
  expect(ret).toBe(0);
  expect(fs.existsSync(path.join("testSrc", "out", "export.tu"))).toBeTruthy();
  const readIndex = libclangjs.clang_createIndex(1, 1);
  const readTu = libclangjs.clang_createTranslationUnit(readIndex, exportFileName);
  expect(libclangjs.isNullPointer(readTu)).toBeFalsy();
});

test("Can shutdown all threads", () => {
  libclangjs.PThread.terminateAllThreads();
});
