import init from "libclangjs";

test("Can initialize libclangjs", async () => {
  const libclangjs = await init();
  const index = libclangjs.clang_createIndex(1, 1);
});
