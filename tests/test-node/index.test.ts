import init from "libclangjs/node";
import { CXCursor, CXFile, CXIndex, CXTranslationUnit, LibClang } from "libclangjs/libclangjs";
import path from "path";
import fs from "fs";

let clang: LibClang;
const cwd = path.join("home", "web_user");

test("Can initialize libclangjs ", async () => {
  clang = await init();
});

test("Can mount shared volume ", async () => {
  clang.FS.mount(clang.NODEFS, { root: "testSrc" }, cwd);
  expect(clang.FS.readdir(cwd)).toContain("header.hpp");
});

let index: CXIndex;

test("Can create libclang index ", async () => {
  index = clang.createIndex(1, 1);
});

test(`Call "CXIndex_setInvocationEmissionPathOption" with both string and null as second parameter`, async () => {
  clang.CXIndex_setInvocationEmissionPathOption(index, null);
  fs.mkdirSync(path.join("testSrc", "log"), { recursive: true });
  clang.CXIndex_setInvocationEmissionPathOption(index, path.join(cwd, "log"));
});

let tu: CXTranslationUnit;

test(`Call "parseTranslationUnit"`, async () => {
  const nullTu = clang.parseTranslationUnit(index, "nonexistingfile", null, null, 0);
  expect(clang.isNullPointer(nullTu)).toBeTruthy();
  tu = clang.parseTranslationUnit(index, path.join(cwd, "main.cpp"), [`-I${path.join(cwd, "dir")}`], null, 0);
  expect(clang.isNullPointer(tu)).toBeFalsy();
  const cursor = clang.getTranslationUnitCursor(tu);
  let foundCookie = false;
  clang.visitChildren(cursor, (c, p) => {
    if (clang.getCursorSpelling(c) === "cookie") {
      foundCookie = true;
    }
    return clang.CXChildVisitResult.Continue;
  });
  expect(foundCookie).toBeTruthy();
});

let mainFile: CXFile;

test("Can get file contents", () => {
  mainFile = clang.getFile(tu, path.join(cwd, "main.cpp"));
  const fileContents = clang.getFileContents(tu, mainFile);
  expect(fileContents).toBe(fs.readFileSync(path.join("testSrc", "main.cpp")).toString());
});

test("Can make simple calls regarding CXSourceLocation", () => {
  const nullLoc = clang.getNullLocation();
  const loc1 = clang.getLocation(tu, mainFile, 0, 1);
  const loc2 = clang.getLocation(tu, mainFile, 0, 2);
  const loc3 = clang.getLocation(tu, mainFile, 3, 1);
  expect(clang.equalLocations(nullLoc, loc3)).toBe(0);
  expect(clang.equalLocations(loc1, loc2)).not.toBe(0);
  expect(clang.equalLocations(loc1, loc3)).toBe(0);
});

test("Can make simple calls regarding CXSourceRange", () => {
  const loc1 = clang.getLocation(tu, mainFile, 0, 1);
  const loc2 = clang.getLocation(tu, mainFile, 0, 2);
  const loc3 = clang.getLocation(tu, mainFile, 3, 1);
  const loc4 = clang.getLocation(tu, mainFile, 3, 2);
  const loc5 = clang.getLocation(tu, mainFile, 5, 1);
  const loc6 = clang.getLocation(tu, mainFile, 5, 2);
  const range1 = clang.getRange(loc1, loc3);
  const range2 = clang.getRange(loc2, loc4);
  const range3 = clang.getRange(loc5, loc6);
  expect(clang.equalRanges(range1, range2)).not.toBe(0)
  expect(clang.equalRanges(range1, range3)).toBe(0);
});

test("Can write / read translation unit to / from disk", () => {
  fs.mkdirSync(path.join("testSrc", "out"), { recursive: true });
  const exportFileName = path.join(cwd, "out", "export.tu");
  const ret = clang.saveTranslationUnit(tu, exportFileName, clang.CXSaveTranslationUnit_Flags.None.value);
  expect(ret).toBe(0);
  expect(fs.existsSync(path.join("testSrc", "out", "export.tu"))).toBeTruthy();
  const readIndex = clang.createIndex(1, 1);
  const readTu = clang.createTranslationUnit(readIndex, exportFileName);
  expect(clang.isNullPointer(readTu)).toBeFalsy();
});

test("Can correctly traverse identify C++ code", () => {
  const cursor = clang.getTranslationUnitCursor(tu);
  const children: { child: CXCursor, parent: CXCursor }[] = [];
  const found = {
    cookie: false,
    TestStruct: false,
    TestClassDecl: false,
    main: false,
    TestClassConstructor: false,
    TestClassDestructor: false,
    TestClassSomething: false,
  };
  clang.visitChildren(cursor, (child, parent) => {
    children.push({ child, parent });
    const loc = clang.getPresumedLocation(clang.getCursorLocation(child));
    const spelling = clang.getCursorSpelling(child);
    const cursorKind = clang.getCursorKind(child);
    if (spelling === "cookie") {
      expect(cursorKind.value).toBe(clang.CXCursorKind.VarDecl.value);
      expect(loc).toEqual({ filename: 'home/web_user/dir/anotherHeader.hpp', line: 1, column: 5, });
      found.cookie = true;
    } else if (spelling === "TestStruct") {
      expect(cursorKind.value).toBe(clang.CXCursorKind.StructDecl.value);
      expect(loc).toEqual({ filename: 'home/web_user/header.hpp', line: 1, column: 8, });
      found.TestStruct = true;
    } else if (spelling === "TestClass" && cursorKind.value === clang.CXCursorKind.ClassDecl.value) {
      expect(loc).toEqual({ filename: 'home/web_user/header.hpp', line: 5, column: 7, });
      found.TestClassDecl = true;
    } else if (spelling === "main" && cursorKind.value === clang.CXCursorKind.FunctionDecl.value) {
      expect(loc).toEqual({ filename: 'home/web_user/main.cpp', line: 4, column: 5 });
      found.main = true;
    } else if (spelling === "TestClass" && cursorKind.value === clang.CXCursorKind.Constructor.value) {
      expect(loc).toEqual({ filename: 'home/web_user/main.cpp', line: 6, column: 12 });
      found.TestClassConstructor = true;
    } else if (spelling === "~TestClass") {
      expect(cursorKind.value).toBe(clang.CXCursorKind.Destructor.value);
      expect(loc).toEqual({ filename: 'home/web_user/main.cpp', line: 8, column: 12 });
      found.TestClassDestructor = true;
    } else if (spelling === "Something") {
      expect(cursorKind.value).toBe(clang.CXCursorKind.CXXMethod.value);
      expect(loc).toEqual({ filename: 'home/web_user/main.cpp', line: 10, column: 24 });
      found.TestClassSomething = true;
    }
    return clang.CXChildVisitResult.Continue;
  });
  const allFound = Object.values(found).reduce((prev, curr) => prev && curr, true);
  expect(allFound).toBe(true);
});

test("Can shutdown all threads", () => {
  clang.PThread.terminateAllThreads();
});
