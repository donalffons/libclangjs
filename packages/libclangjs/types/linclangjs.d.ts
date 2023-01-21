import { EmscriptenModule, FS } from "./emscripten";
import { CXChildVisitResult, CXCursorKind, CXDiagnosticSeverity, CXGlobalOptFlags, CXLoadDiag_Error, CXTranslationUnit_Flags } from "./enums";
import { CXCursor, CXDiagnostic, CXDiagnosticSet, CXFile, CXIndex, CXSourceLocation, CXSourceRange, CXTranslationUnit, CXUnsavedFile } from "./structs";

/**
 * Visitor invoked for each cursor found by a traversal.
 *
 * This visitor function will be invoked for each cursor found by
 * {@link LibClang.clang_visitCursorChildren | clang_visitCursorChildren()}. Its first argument is the cursor being
 * visited, its second argument is the parent visitor for that cursor,
 * and its third argument is the client data provided to
 * clang_visitCursorChildren().
 *
 * The visitor should return one of the {@link CXChildVisitResult} values
 * to direct clang_visitCursorChildren().
 */
type CXCursorVisitor = (cursor: CXCursor, parent: CXCursor) => CXChildVisitResult[keyof CXChildVisitResult];

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

  /**
   * Retrieve the complete file and path name of the given file.
   */
  clang_getFileName: (SFile: CXFile) => string;

  /**
   * Retrieve the last modification time of the given file.
   */
  clang_getFileTime: (SFile: CXFile) => number;

  // skipped CXFileUniqueID
  // skipped clang_getFileUniqueID

  /**
   * Determine whether the given header is guarded against
   * multiple inclusions, either with the conventional
   * `#ifndef #define #endif` macro guards or with `#pragma once`.
   */
  clang_isFileMultipleIncludeGuarded: (tu: CXTranslationUnit, file: CXFile) => number;

  /**
   * Retrieve a file handle within the given translation unit.
   *
   * @param tu the translation unit
   *
   * @param file_name the name of the file.
   *
   * @returns the file handle for the named file in the translation unit `tu`,
   * or a NULL file handle if the file was not a part of this translation unit.
   */
  clang_getFile: (tu: CXTranslationUnit, file_name: string | null) => CXFile;

  /**
   * Retrieve the buffer associated with the given file.
   *
   * @param tu the translation unit
   *
   * @param file the file for which to retrieve the buffer.
   *
   * @returns a pointer to the buffer in memory that holds the contents of
   * `file`, or a NULL pointer when the file is not loaded.
   */
  clang_getFileContents: (tu: CXTranslationUnit, file: CXFile) => string;

  /**
   * Returns non-zero if the `file1` and `file2` point to the same file,
   * or they are both NULL.
   */
  clang_File_isEqual: (file1: CXFile, file2: CXFile) => number;

  /**
   * Returns the real path name of \c file.
   *
   * An empty string may be returned. Use \c clang_getFileName() in that case.
   */
  clang_File_tryGetRealPathName: (file: CXFile) => string;

  /**
   * Retrieve a NULL (invalid) source location.
   */
  clang_getNullLocation: () => CXSourceLocation;

  /**
   * Determine whether two source locations, which must refer into
   * the same translation unit, refer to exactly the same point in the source
   * code.
   *
   * @returns non-zero if the source locations refer to the same location, zero
   * if they refer to different locations.
   */
  clang_equalLocations: (loc1: CXSourceLocation, loc2: CXSourceLocation) => number;

  /**
   * Retrieves the source location associated with a given file/line/column
   * in a particular translation unit.
   */
  clang_getLocation: (tu: CXTranslationUnit, file: CXFile, line: number, column: number) => CXSourceLocation;

  /**
  * Retrieves the source location associated with a given character offset
  * in a particular translation unit.
  */
  clang_getLocationForOffset: (tu: CXTranslationUnit, file: CXFile, offset: number) => CXSourceLocation;

  /**
  * Returns non-zero if the given source location is in a system header.
  */
  clang_Location_isInSystemHeader: (location: CXSourceLocation) => number;

  /**
  * Returns non-zero if the given source location is in the main file of
  * the corresponding translation unit.
  */
  clang_Location_isFromMainFile: (location: CXSourceLocation) => number;

  /**
   * Retrieve a NULL (invalid) source range.
   */
  clang_getNullRange: () => CXSourceRange;

  /**
   * Retrieve a source range given the beginning and ending source
   * locations.
   */
  clang_getRange: (begin: CXSourceLocation, end: CXSourceLocation) => CXSourceRange;

  /**
   * Determine whether two ranges are equivalent.
   *
   * @returns non-zero if the ranges are the same, zero if they differ.
   */
  clang_equalRanges: (range1: CXSourceRange, range2: CXSourceRange) => number;

  /**
   * @returns non-zero if `range` is null.
   */
  clang_Range_isNull: (range: CXSourceRange) => number;

  // skipped clang_getExpansionLocation
  // skipped clang_getPresumedLocation
  // skipped clang_getInstantiationLocation
  // skipped clang_getSpellingLocation
  // skipped clang_getFileLocation

  /**
   * Retrieve a source location representing the first character within a
   * source range.
   */
  clang_getRangeStart: (range: CXSourceRange) => CXSourceLocation;

  /**
   * Retrieve a source location representing the last character within a
   * source range.
   */
  clang_getRangeEnd: (range: CXSourceRange) => CXSourceLocation;

  // skipped CXSourceRangeList
  // skipped clang_getSkippedRanges
  // skipped clang_getAllSkippedRanges
  // skipped clang_disposeSourceRangeList

  /**
   * Determine the number of diagnostics in a {@link CXDiagnosticSet}.
   */
  clang_getNumDiagnosticsInSet: (Diags: CXDiagnosticSet) => number;

  /**
   * Retrieve a diagnostic associated with the given {@link CXDiagnosticSet}.
   *
   * @param Diags the CXDiagnosticSet to query.
   * @param Index the zero-based diagnostic number to retrieve.
   *
   * @returns the requested diagnostic. This diagnostic must be freed
   * via a call to {@link LibClang.clang_disposeDiagnostic | clang_disposeDiagnostic()}.
   */
  clang_getDiagnosticInSet: (Diags: CXDiagnosticSet, Index: number) => CXDiagnostic;

  // skipped clang_loadDiagnostics

  /**
   * Release a CXDiagnosticSet and all of its contained diagnostics.
   */
  clang_disposeDiagnosticSet: (Diags: CXDiagnosticSet) => void;

  /**
   * Retrieve the child diagnostics of a CXDiagnostic.
   *
   * This CXDiagnosticSet does not need to be released by
   * {@link clang_disposeDiagnosticSet}.
   */
  clang_getChildDiagnostics: (D: CXDiagnostic) => CXDiagnosticSet;

  // skipped clang_getNumDiagnostics
  // skipped clang_getDiagnostic
  // skipped clang_getDiagnosticSetFromTU
  // skipped clang_disposeDiagnostic
  // skipped CXDiagnosticDisplayOptions
  // skipped clang_formatDiagnostic
  // skipped clang_defaultDiagnosticDisplayOptions
  // skipped clang_getDiagnosticSeverity
  // skipped clang_getDiagnosticLocation
  // skipped clang_getDiagnosticSpelling
  // skipped clang_getDiagnosticOption
  // skipped clang_getDiagnosticCategory
  // skipped clang_getDiagnosticCategoryName
  // skipped clang_getDiagnosticCategoryText
  // skipped clang_getDiagnosticNumRanges
  // skipped clang_getDiagnosticRange
  // skipped clang_getDiagnosticNumFixIts
  // skipped clang_getDiagnosticFixIt

  /**
   * Get the original translation unit source file name.
   */
  clang_getTranslationUnitSpelling: (CTUnit: CXTranslationUnit) => string;

  /**
   * Return the CXTranslationUnit for a given source file and the provided
   * command line arguments one would pass to the compiler.
   *
   * Note: The 'source_filename' argument is optional.  If the caller provides a
   * NULL pointer, the name of the source file is expected to reside in the
   * specified command line arguments.
   *
   * Note: When encountered in 'clang_command_line_args', the following options
   * are ignored:
   *
   *   '-c'
   *   '-emit-ast'
   *   '-fsyntax-only'
   *   '-o \<output file>'  (both '-o' and '\<output file>' are ignored)
   *
   * @param CIdx The index object with which the translation unit will be
   * associated.
   *
   * @param source_filename The name of the source file to load, or NULL if the
   * source file is included in \p clang_command_line_args.
   *
   * @param num_clang_command_line_args The number of command-line arguments in
   * clang_command_line_args.
   *
   * @param clang_command_line_args The command-line arguments that would be
   * passed to the \c clang executable if it were being invoked out-of-process.
   * These command-line options will be parsed and will affect how the translation
   * unit is parsed. Note that the following options are ignored: '-c',
   * '-emit-ast', '-fsyntax-only' (which is the default), and '-o \<output file>'.
   *
   * @param num_unsaved_files the number of unsaved file entries in \p
   * unsaved_files.
   *
   * @param unsaved_files the files that have not yet been saved to disk
   * but may be required for code completion, including the contents of
   * those files.  The contents and name of these files (as specified by
   * CXUnsavedFile) are copied when necessary, so the client only needs to
   * guarantee their validity until the call to this function returns.
   */
  clang_createTranslationUnitFromSourceFile: (CIdx: CXIndex, source_filename: null | string, clang_command_line_args: string[] | null, unsaved_files: CXUnsavedFile[] | null) => CXTranslationUnit;

  /**
   * Same as {@link LibClang.clang_createTranslationUnit2 | clang_createTranslationUnit2}, but returns
   * the \c CXTranslationUnit instead of an error code.  In case of an error this
   * routine returns a \c NULL \c CXTranslationUnit, without further detailed
   * error codes.
   */
  clang_createTranslationUnit: (CIdx: CXIndex, ast_filename: string | null) => CXTranslationUnit;

  // skipped clang_createTranslationUnit2

  /**
   * Returns the set of flags that is suitable for parsing a translation
   * unit that is being edited.
   *
   * The set of flags returned provide options for {@link clang_parseTranslationUnit | clang_parseTranslationUnit()}
   * to indicate that the translation unit is likely to be reparsed many times,
   * either explicitly (via {@link clang_reparseTranslationUnit | clang_reparseTranslationUnit()}) or implicitly
   * (e.g., by code completion ({@link clang_codeCompletionAt | clang_codeCompletionAt()})). The returned flag
   * set contains an unspecified set of optimizations (e.g., the precompiled
   * preamble) geared toward improving the performance of these routines. The
   * set of optimizations enabled may change from one version to the next.
   */
  clang_defaultEditingTranslationUnitOptions: () => void;

  /**
   * Same as `clang_parseTranslationUnit2`, but returns
   * the `CXTranslationUnit` instead of an error code.  In case of an error this
   * routine returns a `NULL` `CXTranslationUnit`, without further detailed
   * error codes.
   */
  clang_parseTranslationUnit: (CIdx: CXIndex, source_filename: string | null, command_line_args: string[] | null, unsaved_files: CXUnsavedFile[] | null, options: number) => CXTranslationUnit;

  // ################# TODO: skipped some functions

  /**
   * Retrieve the cursor that represents the given translation unit.
   *
   * The translation unit cursor can be used to start traversing the
   * various declarations within the given translation unit.
   */
  clang_getTranslationUnitCursor: (tu: CXTranslationUnit) => CXCursor;

  // ################# TODO: skipped some functions

  clang_visitChildren: (parent: CXCursor, visitor: CXCursorVisitor) => number;

  // ################# TODO: skipped some functions

  clang_getCursorSpelling: (cursor: CXCursor) => string;

  // ################# TODO: skipped some functions

  isNullPointer: (pointer: any) => boolean;

  FS: FS;

  CXGlobalOptFlags: CXGlobalOptFlags;

  /**
   * Describes how the traversal of the children of a particular
   * cursor should proceed after visiting a particular child cursor.
   *
   * A value of this enumeration type should be returned by each
   * {@link CXCursorVisitor} to indicate how {@link LibClang.clang_visitChildren | clang_visitChildren()} proceed.
   */
  CXChildVisitResult: CXChildVisitResult;

  /**
   * Describes the kind of entity that a cursor refers to.
   */
  CXCursorKind: CXCursorKind;

  /**
   * Describes the severity of a particular diagnostic.
   */
  CXDiagnosticSeverity: CXDiagnosticSeverity;

  /**
   * Describes the kind of error that occurred (if any) in a call to
   * {@link clang_loadDiagnostics}.
   */
  CXLoadDiag_Error: CXLoadDiag_Error;

  /**
   * Flags that control the creation of translation units.
   *
   * The enumerators in this enumeration type are meant to be bitwise
   * ORed together to specify which options should be used when
   * constructing the translation unit.
   */
  CXTranslationUnit_Flags: CXTranslationUnit_Flags;
};

export default function init(module?: EmscriptenModule): LibClang;
