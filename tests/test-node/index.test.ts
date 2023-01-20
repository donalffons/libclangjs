import init from "libclangjs";

test("Can initialize libclangjs", async () => {
  const libclangjs = await init();
  const index = libclangjs.clang_createIndex(1, 1);
  libclangjs.FS.mount(libclangjs.NODEFS, { root: "./testSrc" }, "/home/web_user")
  console.log(libclangjs.FS.readdir("/home/web_user"));
});
