import { EmscriptenModule, FS } from "./emscripten";

export type CXIndex = {};

export type EnumEntry = {
  value: number;
};

export type LibClang = EmscriptenModule & {
  /**
   * Provides a shared context for creating translation units.
   * 
   * It provides two options:
   *
   * - excludeDeclarationsFromPCH: When non-zero, allows enumeration of "local"
   * declarations (when loading any new translation units). A "local" declaration
   * is one that belongs in the translation unit itself and not in a precompiled
   * header that was used by the translation unit. If zero, all declarations
   * will be enumerated.
   *
   * Here is an example:
   *
   * ```cpp
   *   // excludeDeclsFromPCH = 1, displayDiagnostics=1
   *   Idx = clang_createIndex(1, 1);
   *
   *   // IndexTest.pch was produced with the following command:
   *   // "clang -x c IndexTest.h -emit-ast -o IndexTest.pch"
   *   TU = clang_createTranslationUnit(Idx, "IndexTest.pch");
   *
   *   // This will load all the symbols from 'IndexTest.pch'
   *   clang_visitChildren(clang_getTranslationUnitCursor(TU),
   *                       TranslationUnitVisitor, 0);
   *   clang_disposeTranslationUnit(TU);
   *
   *   // This will load all the symbols from 'IndexTest.c', excluding symbols
   *   // from 'IndexTest.pch'.
   *   char *args[] = { "-Xclang", "-include-pch=IndexTest.pch" };
   *   TU = clang_createTranslationUnitFromSourceFile(Idx, "IndexTest.c", 2, args,
   *                                                  0, 0);
   *   clang_visitChildren(clang_getTranslationUnitCursor(TU),
   *                       TranslationUnitVisitor, 0);
   *   clang_disposeTranslationUnit(TU);
   * ```
   *
   * This process of creating the 'pch', loading it separately, and using it (via
   * -include-pch) allows 'excludeDeclsFromPCH' to remove redundant callbacks
   * (which gives the indexer the same performance benefit as the compiler).
   */
  clang_createIndex: (excludeDeclarationsFromPCH: number, displayDiagnostics: number) => CXIndex;

  /**
   * Destroy the given index.
   *
   * The index must not be destroyed until all of the translation units created
   * within that index have been destroyed.
   */
  clang_disposeIndex: (index: CXIndex) => void;

  CXGlobalOptFlags: {
    /**
     * Used to indicate that no special CXIndex options are needed.
     */
    None: EnumEntry;

    /**
     * Used to indicate that threads that libclang creates for indexing
     * purposes should use background priority.
     *
     * Affects #clang_indexSourceFile, #clang_indexTranslationUnit,
     * #clang_parseTranslationUnit, #clang_saveTranslationUnit.
     */
    ThreadBackgroundPriorityForIndexing: EnumEntry;

    /**
     * Used to indicate that threads that libclang creates for editing
     * purposes should use background priority.
     *
     * Affects #clang_reparseTranslationUnit, #clang_codeCompleteAt,
     * #clang_annotateTokens
     */
    ThreadBackgroundPriorityForEditing: EnumEntry;

    /**
     * Used to indicate that all threads that libclang creates should use
     * background priority.
     */
    ThreadBackgroundPriorityForAll: EnumEntry;
  };

  /**
   * Sets general options associated with a CXIndex.
   *
   * For example:
   * ```cpp
   * CXIndex idx = ...;
   * clang_CXIndex_setGlobalOptions(idx,
   *     clang_CXIndex_getGlobalOptions(idx) |
   *     CXGlobalOpt_ThreadBackgroundPriorityForIndexing);
   * ```
   *
   * @param options A bitmask of options, a bitwise OR of CXGlobalOpt_XXX flags.
   */
  clang_CXIndex_setGlobalOptions: (index: CXIndex, options: number) => void;

  /**
   * Gets the general options associated with a CXIndex.
   *
   * @returns A bitmask of options, a bitwise OR of CXGlobalOpt_XXX flags that
   * are associated with the given CXIndex object.
   */
  clang_CXIndex_getGlobalOptions: (index: CXIndex) => number;

  /**
   * Sets the invocation emission path option in a CXIndex.
   *
   * The invocation emission path specifies a path which will contain log
   * files for certain libclang invocations. A null value (default) implies that
   * libclang invocations are not logged..
   */
  clang_CXIndex_setInvocationEmissionPathOption: (index: CXIndex, path: string | null) => void;

  FS: FS;
};

export default function init(module?: EmscriptenModule): LibClang;
