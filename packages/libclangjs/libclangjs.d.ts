import { EmscriptenModule, FS } from "./emscripten";
import { CXAvailabilityKind, CXCallingConv, CXChildVisitResult, CXCompletionChunkKind, CXCursorKind, CXDiagnosticSeverity, CXGlobalOptFlags, CXIdxAttrKind, CXIdxDeclInfoFlags, CXIdxEntityCXXTemplateKind, CXIdxEntityKind, CXIdxEntityLanguage, CXIdxEntityRefKind, CXIdxObjCContainerKind, CXLanguageKind, CXLinkageKind, CXLoadDiag_Error, CXNameRefFlags, CXObjCDeclQualifierKind, CXObjCPropertyAttrKind, CXPrintingPolicyProperty, CXRefQualifierKind, CXReparse_Flags, CXResult, CXSaveError, CXSaveTranslationUnit_Flags, CXSymbolRole, CXTLSKind, CXTUResourceUsageKind, CXTemplateArgumentKind, CXTokenKind, CXTranslationUnit_Flags, CXTypeKind, CXTypeLayoutError, CXTypeNullabilityKind, CXVisibilityKind, CXVisitorResult, CX_CXXAccessSpecifier, CX_StorageClass, EnumValue } from "./enums";
import { CXCursor, CXDiagnostic, CXDiagnosticSet, CXFile, CXIndex, CXModule, CXPrintingPolicy, CXSourceLocation, CXSourceRange, CXToken, CXTranslationUnit, CXType, CXUnsavedFile } from "./structs";

export * from "./emscripten";
export * from "./enums";
export * from "./structs";

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
type CXCursorVisitor = (cursor: CXCursor, parent: CXCursor) => EnumValue<CXChildVisitResult>;

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

  /**
   * Retrieve the file, line, column, and offset represented by
   * the given source location.
   *
   * If the location refers into a macro expansion, retrieves the
   * location of the macro expansion.
   *
   * @param location the location within a source file that will be decomposed
   * into its parts.
   *
   * file is set to the file to which the given
   * source location points.
   *
   * line is set to the line to which the given
   * source location points.
   *
   * column is set to the column to which the given
   * source location points.
   *
   * offset is set to the offset into the
   * buffer to which the given source location points.
   */
  clang_getExpansionLocation: (location: CXSourceLocation) => {
    file: CXFile;
    line: number;
    column: number;
    offset: number;
  };

  /**
   * Retrieve the file, line and column represented by the given source
   * location, as specified in a # line directive.
   *
   * Example: given the following source code in a file somefile.c
   *
   * \code
   * #123 "dummy.c" 1
   *
   * static int func(void)
   * {
   *     return 0;
   * }
   * \endcode
   *
   * the location information returned by this function would be
   *
   * File: dummy.c Line: 124 Column: 12
   *
   * whereas clang_getExpansionLocation would have returned
   *
   * File: somefile.c Line: 3 Column: 12
   *
   * @param location the location within a source file that will be decomposed
   * into its parts.
   *
   * filename will be set to the filename of the
   * source location. Note that filenames returned will be for "virtual" files,
   * which don't necessarily exist on the machine running clang - e.g. when
   * parsing preprocessed output obtained from a different environment. If
   * a non-NULL value is passed in, remember to dispose of the returned value
   * using \c clang_disposeString() once you've finished with it. For an invalid
   * source location, an empty string is returned.
   *
   * line will be set to the line number of the
   * source location. For an invalid source location, zero is returned.
   *
   * column will be set to the column number of the
   * source location. For an invalid source location, zero is returned.
   */
  clang_getPresumedLocation: (location: CXSourceLocation) => {
    filename: string;
    line: number;
    column: number;
  };

  /**
   * Legacy API to retrieve the file, line, column, and offset represented
   * by the given source location.
   *
   * This interface has been replaced by the newer interface
   * #clang_getExpansionLocation(). See that interface's documentation for
   * details.
   */
  clang_getInstantiationLocation: (location: CXSourceLocation) => {
    file: CXFile;
    line: number;
    column: number;
    offset: number;
  };

  /**
   * Retrieve the file, line, column, and offset represented by
   * the given source location.
   *
   * If the location refers into a macro instantiation, return where the
   * location was originally spelled in the source file.
   *
   * @param location the location within a source file that will be decomposed
   * into its parts.
   *
   * file will be set to the file to which the given
   * source location points.
   *
   * line will be set to the line to which the given
   * source location points.
   *
   * column will be set to the column to which the given
   * source location points.
   *
   * offset will be set to the offset into the
   * buffer to which the given source location points.
   */
  clang_getSpellingLocation: (location: CXSourceLocation) => {
    file: CXFile;
    line: number;
    column: number;
    offset: number;
  };

  /**
   * Retrieve the file, line, column, and offset represented by
   * the given source location.
   *
   * If the location refers into a macro expansion, return where the macro was
   * expanded or where the macro argument was written, if the location points at
   * a macro argument.
   *
   * @param location the location within a source file that will be decomposed
   * into its parts.
   *
   * file will be set to the file to which the given
   * source location points.
   *
   * line will be set to the line to which the given
   * source location points.
   *
   * column will be set to the column to which the given
   * source location points.
   *
   * offset will be set to the offset into the
   * buffer to which the given source location points.
   */
  clang_getFileLocation: (location: CXSourceLocation) => {
    file: CXFile;
    line: number;
    column: number;
    offset: number;
  };


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

  // skipped clang_parseTranslationUnit2
  // skipped clang_parseTranslationUnit2FullArgv

  /**
   * Returns the set of flags that is suitable for saving a translation
   * unit.
   *
   * The set of flags returned provide options for
   * {@link LibClang.clang_saveTranslationUnit | clang_saveTranslationUnit()} by default. The returned flag
   * set contains an unspecified set of options that save translation units with
   * the most commonly-requested data.
   */
  clang_defaultSaveOptions: (TU: CXTranslationUnit) => number;

  /**
   * Saves a translation unit into a serialized representation of
   * that translation unit on disk.
   *
   * Any translation unit that was parsed without error can be saved
   * into a file. The translation unit can then be deserialized into a
   * new {@link CXTranslationUnit} with {@link LibClang.clang_createTranslationUnit | clang_createTranslationUnit()} or,
   * if it is an incomplete translation unit that corresponds to a
   * header, used as a precompiled header when parsing other translation
   * units.
   *
   * @param TU The translation unit to save.
   *
   * @param FileName The file to which the translation unit will be saved.
   *
   * @param options A bitmask of options that affects how the translation unit
   * is saved. This should be a bitwise OR of the
   * CXSaveTranslationUnit_XXX flags.
   *
   * @returns A value that will match one of the enumerators of the CXSaveError
   * enumeration. Zero (CXSaveError_None) indicates that the translation unit was
   * saved successfully, while a non-zero value indicates that a problem occurred.
   */
  clang_saveTranslationUnit: (TU: CXTranslationUnit, FileName: string | null, options: number) => number;

  /**
  * Suspend a translation unit in order to free memory associated with it.
  *
  * A suspended translation unit uses significantly less memory but on the other
  * side does not support any other calls than {@link LibClang.clang_reparseTranslationUnit | clang_reparseTranslationUnit}
  * to resume it or {@link LibClang.clang_disposeTranslationUnit | clang_disposeTranslationUnit} to dispose it completely.
  */
  clang_suspendTranslationUnit: (TU: CXTranslationUnit) => number;

  /**
  * Destroy the specified CXTranslationUnit object.
  */
  clang_disposeTranslationUnit: (TU: CXTranslationUnit) => void;

  /**
   * Returns the set of flags that is suitable for reparsing a translation
   * unit.
   *
   * The set of flags returned provide options for
   * {@link LibClang.clang_reparseTranslationUnit | clang_reparseTranslationUnit()} by default. The returned flag
   * set contains an unspecified set of optimizations geared toward common uses
   * of reparsing. The set of optimizations enabled may change from one version
   * to the next.
   */
  clang_defaultReparseOptions: (TU: CXTranslationUnit) => number;

  /**
   * Reparse the source files that produced this translation unit.
   *
   * This routine can be used to re-parse the source files that originally
   * created the given translation unit, for example because those source files
   * have changed (either on disk or as passed via \p unsaved_files). The
   * source code will be reparsed with the same command-line options as it
   * was originally parsed.
   *
   * Reparsing a translation unit invalidates all cursors and source locations
   * that refer into that translation unit. This makes reparsing a translation
   * unit semantically equivalent to destroying the translation unit and then
   * creating a new translation unit with the same command-line arguments.
   * However, it may be more efficient to reparse a translation
   * unit using this routine.
   *
   * @param TU The translation unit whose contents will be re-parsed. The
   * translation unit must originally have been built with
   * {@link LibClang.clang_createTranslationUnitFromSourceFile | clang_createTranslationUnitFromSourceFile()}.
   *
   * @param num_unsaved_files The number of unsaved file entries in \p
   * unsaved_files.
   *
   * @param unsaved_files The files that have not yet been saved to disk
   * but may be required for parsing, including the contents of
   * those files.  The contents and name of these files (as specified by
   * CXUnsavedFile) are copied when necessary, so the client only needs to
   * guarantee their validity until the call to this function returns.
   *
   * @param options A bitset of options composed of the flags in {@link CXReparse_Flags}.
   * The function {@link LibClang.clang_defaultReparseOptions | clang_defaultReparseOptions()} produces a default set of
   * options recommended for most uses, based on the translation unit.
   *
   * @returns 0 if the sources could be reparsed.  A non-zero error code will be
   * returned if reparsing was impossible, such that the translation unit is
   * invalid. In such cases, the only valid call for TU is
   * {@link LibClang.clang_disposeTranslationUnit | clang_disposeTranslationUnit(TU)}.  The error codes returned by this
   * routine are described by the {@link CXErrorCode} enum.
   */
  clang_reparseTranslationUnit: (TU: CXTranslationUnit, unsaved_files: CXUnsavedFile[] | null, options: number) => number;

  /**
   * Returns the human-readable null-terminated C string that represents
   *  the name of the memory category.  This string should never be freed.
   */
  clang_getTUResourceUsageName: (kind: EnumValue<CXTUResourceUsageKind>) => string | null;

  // skipped CXTUResourceUsageEntry
  // skipped CXTUResourceUsage
  // skipped clang_getCXTUResourceUsage
  // skipped clang_disposeCXTUResourceUsage
  // skipped clang_getTranslationUnitTargetInfo
  // skipped clang_TargetInfo_dispose
  // skipped clang_TargetInfo_getTriple
  // skipped clang_TargetInfo_getPointerWidth

  /**
   * Retrieve the NULL cursor, which represents no entity.
   */
  clang_getNullCursor: () => CXCursor;

  /**
   * Retrieve the cursor that represents the given translation unit.
   *
   * The translation unit cursor can be used to start traversing the
   * various declarations within the given translation unit.
   */
  clang_getTranslationUnitCursor: (TU: CXTranslationUnit) => CXCursor;

  /**
   * Determine whether two cursors are equivalent.
   */
  clang_equalCursors: (c1: CXCursor, c2: CXCursor) => number;

  /**
   * Returns non-zero if \p cursor is null.
   */
  clang_Cursor_isNull: (cursor: CXCursor) => number;

  /**
   * Compute a hash value for the given cursor.
   */
  clang_hashCursor: (cursor: CXCursor) => number;

  /**
   * Retrieve the kind of the given cursor.
   */
  clang_getCursorKind: (cursor: CXCursor) => EnumValue<CXCursorKind>;

  /**
   * Determine whether the given cursor kind represents a declaration.
   */
  clang_isDeclaration: (kind: EnumValue<CXCursorKind>) => number;

  /**
   * Determine whether the given declaration is invalid.
   *
   * A declaration is invalid if it could not be parsed successfully.
   *
   * @returns non-zero if the cursor represents a declaration and it is
   * invalid, otherwise NULL.
   */
  clang_isInvalidDeclaration: (cursor: CXCursor) => number;

  /**
   * Determine whether the given cursor kind represents a simple
   * reference.
   *
   * Note that other kinds of cursors (such as expressions) can also refer to
   * other cursors. Use {@link LibClang.clang_getCursorReferenced | clang_getCursorReferenced()} to determine whether a
   * particular cursor refers to another entity.
   */
  clang_isReference: (kind: EnumValue<CXCursorKind>) => number;

  /**
   * Determine whether the given cursor kind represents an expression.
   */
  clang_isExpression: (kind: EnumValue<CXCursorKind>) => number;

  /**
   * Determine whether the given cursor kind represents a statement.
   */
  clang_isStatement: (kind: EnumValue<CXCursorKind>) => number;

  /**
   * Determine whether the given cursor kind represents an attribute.
   */
  clang_isAttribute: (kind: EnumValue<CXCursorKind>) => number;

  /**
   * Determine whether the given cursor has any attributes.
   */
  clang_Cursor_hasAttrs: (C: CXCursor) => number;

  /**
   * Determine whether the given cursor kind represents an invalid
   * cursor.
   */
  clang_isInvalid: (kind: EnumValue<CXCursorKind>) => number;

  /**
   * Determine whether the given cursor kind represents a translation
   * unit.
   */
  clang_isTranslationUnit: (kind: EnumValue<CXCursorKind>) => number;

  /***
   * Determine whether the given cursor represents a preprocessing
   * element, such as a preprocessor directive or macro instantiation.
   */
  clang_isPreprocessing: (kind: EnumValue<CXCursorKind>) => number;

  /***
   * Determine whether the given cursor represents a currently
   *  unexposed piece of the AST (e.g., CXCursor_UnexposedStmt).
   */
  clang_isUnexposed: (kind: EnumValue<CXCursorKind>) => number;

  /**
   * Determine the linkage of the entity referred to by a given cursor.
   */
  clang_getCursorLinkage: (cursor: CXCursor) => EnumValue<CXLinkageKind>;

  /**
   * Describe the visibility of the entity referred to by a cursor.
   *
   * This returns the default visibility if not explicitly specified by
   * a visibility attribute. The default visibility may be changed by
   * commandline arguments.
   *
   * @param cursor The cursor to query.
   *
   * @returns The visibility of the cursor.
   */
  clang_getCursorVisibility: (cursor: CXCursor) => EnumValue<CXVisibilityKind>;

  /**
   * Determine the availability of the entity that this cursor refers to,
   * taking the current target platform into account.
   *
   * @param cursor The cursor to query.
   *
   * @returns The availability of the cursor.
   */
  clang_getCursorAvailability: (cursor: CXCursor) => EnumValue<CXAvailabilityKind>;

  // skipped CXPlatformAvailability
  // skipped clang_getCursorPlatformAvailability
  // skipped clang_disposeCXPlatformAvailability

  /**
   * If cursor refers to a variable declaration and it has initializer returns
   * cursor referring to the initializer otherwise return null cursor.
   */
  clang_Cursor_getVarDeclInitializer: (cursor: CXCursor) => CXCursor;

  /**
   * If cursor refers to a variable declaration that has global storage returns 1.
   * If cursor refers to a variable declaration that doesn't have global storage
   * returns 0. Otherwise returns -1.
   */
  clang_Cursor_hasVarDeclGlobalStorage: (cursor: CXCursor) => number;

  /**
   * If cursor refers to a variable declaration that has external storage
   * returns 1. If cursor refers to a variable declaration that doesn't have
   * external storage returns 0. Otherwise returns -1.
   */
  clang_Cursor_hasVarDeclExternalStorage: (cursor: CXCursor) => number;

  /**
   * Determine the "language" of the entity referred to by a given cursor.
   */
  clang_getCursorLanguage: (cursor: CXCursor) => EnumValue<CXLanguageKind>;

  /**
   * Determine the "thread-local storage (TLS) kind" of the declaration
   * referred to by a cursor.
   */
  clang_getCursorTLSKind: (cursor: CXCursor) => EnumValue<CXTLSKind>;

  /**
   * Returns the translation unit that a cursor originated from.
   */
  clang_Cursor_getTranslationUnit: (cursor: CXCursor) => CXTranslationUnit;

  // skipped clang_createCXCursorSet
  // skipped clang_disposeCXCursorSet
  // skipped clang_CXCursorSet_contains
  // skipped clang_CXCursorSet_insert

  /**
   * Determine the semantic parent of the given cursor.
   *
   * The semantic parent of a cursor is the cursor that semantically contains
   * the given \p cursor. For many declarations, the lexical and semantic parents
   * are equivalent (the lexical parent is returned by
   * {@link libclang.clang_getCursorLexicalParent | clang_getCursorLexicalParent()}). They diverge when declarations or
   * definitions are provided out-of-line. For example:
   *
   * ```cpp
   * class C {
   *  void f();
   * };
   *
   * void C::f() { }
   * ```
   *
   * In the out-of-line definition of \c C::f, the semantic parent is
   * the class \c C, of which this function is a member. The lexical parent is
   * the place where the declaration actually occurs in the source code; in this
   * case, the definition occurs in the translation unit. In general, the
   * lexical parent for a given entity can change without affecting the semantics
   * of the program, and the lexical parent of different declarations of the
   * same entity may be different. Changing the semantic parent of a declaration,
   * on the other hand, can have a major impact on semantics, and redeclarations
   * of a particular entity should all have the same semantic context.
   *
   * In the example above, both declarations of \c C::f have \c C as their
   * semantic context, while the lexical context of the first \c C::f is \c C
   * and the lexical context of the second \c C::f is the translation unit.
   *
   * For global declarations, the semantic parent is the translation unit.
   */
  clang_getCursorSemanticParent: (cursor: CXCursor) => CXCursor;

  /**
   * Determine the lexical parent of the given cursor.
   *
   * The lexical parent of a cursor is the cursor in which the given \p cursor
   * was actually written. For many declarations, the lexical and semantic parents
   * are equivalent (the semantic parent is returned by
   * {@link LibClang.clang_getCursorSemanticParent | clang_getCursorSemanticParent()}). They diverge when declarations or
   * definitions are provided out-of-line. For example:
   *
   * ```cpp
   * class C {
   *  void f();
   * };
   *
   * void C::f() { }
   * ```
   *
   * In the out-of-line definition of \c C::f, the semantic parent is
   * the class \c C, of which this function is a member. The lexical parent is
   * the place where the declaration actually occurs in the source code; in this
   * case, the definition occurs in the translation unit. In general, the
   * lexical parent for a given entity can change without affecting the semantics
   * of the program, and the lexical parent of different declarations of the
   * same entity may be different. Changing the semantic parent of a declaration,
   * on the other hand, can have a major impact on semantics, and redeclarations
   * of a particular entity should all have the same semantic context.
   *
   * In the example above, both declarations of \c C::f have \c C as their
   * semantic context, while the lexical context of the first \c C::f is \c C
   * and the lexical context of the second \c C::f is the translation unit.
   *
   * For declarations written in the global scope, the lexical parent is
   * the translation unit.
   */
  clang_getCursorLexicalParent: (cursor: CXCursor) => CXCursor;

  // skipped clang_getOverriddenCursors
  // skipped clang_disposeOverriddenCursors

  /**
   * Retrieve the file that is included by the given inclusion directive
   * cursor.
   */
  clang_getIncludedFile: (cursor: CXCursor) => CXFile;

  /**
   * Map a source location to the cursor that describes the entity at that
   * location in the source code.
   *
   * clang_getCursor() maps an arbitrary source location within a translation
   * unit down to the most specific cursor that describes the entity at that
   * location. For example, given an expression \c x + y, invoking
   * clang_getCursor() with a source location pointing to "x" will return the
   * cursor for "x"; similarly for "y". If the cursor points anywhere between
   * "x" or "y" (e.g., on the + or the whitespace around it), clang_getCursor()
   * will return a cursor referring to the "+" expression.
   *
   * @returns a cursor representing the entity at the given source location, or
   * a NULL cursor if no such entity can be found.
   */
  clang_getCursor: (tu: CXTranslationUnit, loc: CXSourceLocation) => CXCursor;

  /**
   * Retrieve the physical location of the source constructor referenced
   * by the given cursor.
   *
   * The location of a declaration is typically the location of the name of that
   * declaration, where the name of that declaration would occur if it is
   * unnamed, or some keyword that introduces that particular declaration.
   * The location of a reference is where that reference occurs within the
   * source code.
   */
  clang_getCursorLocation: (cursor: CXCursor) => CXSourceLocation;

  /**
   * Retrieve the physical extent of the source construct referenced by
   * the given cursor.
   *
   * The extent of a cursor starts with the file/line/column pointing at the
   * first character within the source construct that the cursor refers to and
   * ends with the last character within that source construct. For a
   * declaration, the extent covers the declaration itself. For a reference,
   * the extent covers the location of the reference (e.g., where the referenced
   * entity was actually used).
   */
  clang_getCursorExtent: (cursor: CXCursor) => CXSourceRange;

  /**
   * Retrieve the type of a CXCursor (if any).
   */
  clang_getCursorType: (C: CXCursor) => CXType;

  /**
   * Pretty-print the underlying type using the rules of the
   * language of the translation unit from which it came.
   *
   * If the type is invalid, an empty string is returned.
   */
  clang_getTypeSpelling: (CT: CXType) => string;

  /**
   * Retrieve the underlying type of a typedef declaration.
   *
   * If the cursor does not reference a typedef declaration, an invalid type is
   * returned.
   */
  clang_getTypedefDeclUnderlyingType: (C: CXCursor) => CXType;

  /**
   * Retrieve the integer type of an enum declaration.
   *
   * If the cursor does not reference an enum declaration, an invalid type is
   * returned.
   */
  clang_getEnumDeclIntegerType: (C: CXCursor) => CXType;

  /**
   * Retrieve the integer value of an enum constant declaration as a signed
   *  long long.
   *
   * If the cursor does not reference an enum constant declaration, LLONG_MIN is
   * returned. Since this is also potentially a valid constant value, the kind of
   * the cursor must be verified before calling this function.
   */
  clang_getEnumConstantDeclValue: (C: CXCursor) => number;

  /**
   * Retrieve the integer value of an enum constant declaration as an unsigned
   *  long long.
   *
   * If the cursor does not reference an enum constant declaration, ULLONG_MAX is
   * returned. Since this is also potentially a valid constant value, the kind of
   * the cursor must be verified before calling this function.
   */
  clang_getEnumConstantDeclUnsignedValue: (C: CXCursor) => number;

  /**
   * Retrieve the bit width of a bit field declaration as an integer.
   *
   * If a cursor that is not a bit field declaration is passed in, -1 is returned.
   */
  clang_getFieldDeclBitWidth: (C: CXCursor) => number;

  /**
   * Retrieve the number of non-variadic arguments associated with a given
   * cursor.
   *
   * The number of arguments can be determined for calls as well as for
   * declarations of functions or methods. For other cursors -1 is returned.
   */
  clang_Cursor_getNumArguments: (C: CXCursor) => number;

  /**
   * Retrieve the argument cursor of a function or method.
   *
   * The argument cursor can be determined for calls as well as for declarations
   * of functions or methods. For other cursors and for invalid indices, an
   * invalid cursor is returned.
   */
  clang_Cursor_getArgument: (C: CXCursor, i: number) => CXCursor;

  /**
   *Returns the number of template args of a function decl representing a
   * template specialization.
   *
   * If the argument cursor cannot be converted into a template function
   * declaration, -1 is returned.
   *
   * For example, for the following declaration and specialization:
   *   template <typename T, int kInt, bool kBool>
   *   void foo() { ... }
   *
   *   template <>
   *   void foo<float, -7, true>();
   *
   * The value 3 would be returned from this call.
   */
  clang_Cursor_getNumTemplateArguments: (C: CXCursor) => number;

  /**
   * Retrieve the kind of the I'th template argument of the CXCursor C.
   *
   * If the argument CXCursor does not represent a FunctionDecl, an invalid
   * template argument kind is returned.
   *
   * For example, for the following declaration and specialization:
   *   template <typename T, int kInt, bool kBool>
   *   void foo() { ... }
   *
   *   template <>
   *   void foo<float, -7, true>();
   *
   * For I = 0, 1, and 2, Type, Integral, and Integral will be returned,
   * respectively.
   */
  clang_Cursor_getTemplateArgumentKind: (C: CXCursor, I: number) => EnumValue<CXTemplateArgumentKind>;

  /**
   * Retrieve a CXType representing the type of a TemplateArgument of a
   *  function decl representing a template specialization.
   *
   * If the argument CXCursor does not represent a FunctionDecl whose I'th
   * template argument has a kind of CXTemplateArgKind_Integral, an invalid type
   * is returned.
   *
   * For example, for the following declaration and specialization:
   *   template <typename T, int kInt, bool kBool>
   *   void foo() { ... }
   *
   *   template <>
   *   void foo<float, -7, true>();
   *
   * If called with I = 0, "float", will be returned.
   * Invalid types will be returned for I == 1 or 2.
   */
  clang_Cursor_getTemplateArgumentType: (C: CXCursor, I: number) => CXType;

  /**
   * Retrieve the value of an Integral TemplateArgument (of a function
   *  decl representing a template specialization) as a signed long long.
   *
   * It is undefined to call this function on a CXCursor that does not represent a
   * FunctionDecl or whose I'th template argument is not an integral value.
   *
   * For example, for the following declaration and specialization:
   *   template <typename T, int kInt, bool kBool>
   *   void foo() { ... }
   *
   *   template <>
   *   void foo<float, -7, true>();
   *
   * If called with I = 1 or 2, -7 or true will be returned, respectively.
   * For I == 0, this function's behavior is undefined.
   */
  clang_Cursor_getTemplateArgumentValue: (C: CXCursor, I: number) => number;

  /**
   * Retrieve the value of an Integral TemplateArgument (of a function
   *  decl representing a template specialization) as an unsigned long long.
   *
   * It is undefined to call this function on a CXCursor that does not represent a
   * FunctionDecl or whose I'th template argument is not an integral value.
   *
   * For example, for the following declaration and specialization:
   *   template <typename T, int kInt, bool kBool>
   *   void foo() { ... }
   *
   *   template <>
   *   void foo<float, 2147483649, true>();
   *
   * If called with I = 1 or 2, 2147483649 or true will be returned, respectively.
   * For I == 0, this function's behavior is undefined.
   */
  clang_Cursor_getTemplateArgumentUnsignedValue: (C: CXCursor, I: number) => number;

  /**
   * Determine whether two CXTypes represent the same type.
   *
   * \returns non-zero if the CXTypes represent the same type and
   *          zero otherwise.
   */
  clang_equalTypes: (A: CXType, B: CXType) => number;

  /**
   * Return the canonical type for a CXType.
   *
   * Clang's type system explicitly models typedefs and all the ways
   * a specific type can be represented.  The canonical type is the underlying
   * type with all the "sugar" removed.  For example, if 'T' is a typedef
   * for 'int', the canonical type for 'T' would be 'int'.
   */
  clang_getCanonicalType: (T: CXType) => CXType;

  /**
   * Determine whether a CXType has the "const" qualifier set,
   * without looking through typedefs that may have added "const" at a
   * different level.
   */
  clang_isConstQualifiedType: (T: CXType) => number;

  /**
   * Determine whether a  CXCursor that is a macro, is
   * function like.
   */
  clang_Cursor_isMacroFunctionLike: (C: CXCursor) => number;

  /**
   * Determine whether a  CXCursor that is a macro, is a
   * builtin one.
   */
  clang_Cursor_isMacroBuiltin: (C: CXCursor) => number;

  /**
   * Determine whether a  CXCursor that is a function declaration, is an
   * inline declaration.
   */
  clang_Cursor_isFunctionInlined: (C: CXCursor) => number;

  /**
   * Determine whether a CXType has the "volatile" qualifier set,
   * without looking through typedefs that may have added "volatile" at
   * a different level.
   */
  clang_isVolatileQualifiedType: (T: CXType) => number;

  /**
   * Determine whether a CXType has the "restrict" qualifier set,
   * without looking through typedefs that may have added "restrict" at a
   * different level.
   */
  clang_isRestrictQualifiedType: (T: CXType) => number;

  /**
   * Returns the address space of the given type.
   */
  clang_getAddressSpace: (T: CXType) => number;

  /**
   * Returns the typedef name of the given type.
   */
  clang_getTypedefName: (CT: CXType) => string;

  /**
   * For pointer types, returns the type of the pointee.
   */
  clang_getPointeeType: (T: CXType) => CXType;

  /**
   * Return the cursor for the declaration of the given type.
   */
  clang_getTypeDeclaration: (T: CXType) => CXCursor;

  /**
   * Returns the Objective-C type encoding for the specified declaration.
   */
  clang_getDeclObjCTypeEncoding: (C: CXCursor) => string;

  /**
   * Returns the Objective-C type encoding for the specified CXType.
   */
  clang_Type_getObjCEncoding: (type: CXType) => string;

  /**
   * Retrieve the spelling of a given CXTypeKind.
   */
  clang_getTypeKindSpelling: (kind: EnumValue<CXTypeKind>) => string;

  /**
   * Retrieve the calling convention associated with a function type.
   *
   * If a non-function type is passed in, CXCallingConv_Invalid is returned.
   */
  clang_getFunctionTypeCallingConv: (T: CXType) => EnumValue<CXCallingConv>;

  /**
   * Retrieve the return type associated with a function type.
   *
   * If a non-function type is passed in, an invalid type is returned.
   */
  clang_getResultType: (T: CXType) => CXType;

  /**
   * Retrieve the exception specification type associated with a function type.
   * This is a value of type CXCursor_ExceptionSpecificationKind.
   *
   * If a non-function type is passed in, an error code of -1 is returned.
   */
  clang_getExceptionSpecificationType: (T: CXType) => number;

  /**
   * Retrieve the number of non-variadic parameters associated with a
   * function type.
   *
   * If a non-function type is passed in, -1 is returned.
   */
  clang_getNumArgTypes: (T: CXType) => number;

  /**
   * Retrieve the type of a parameter of a function type.
   *
   * If a non-function type is passed in or the function does not have enough
   * parameters, an invalid type is returned.
   */
  clang_getArgType: (T: CXType, i: number) => CXType;

  /**
   * Retrieves the base type of the ObjCObjectType.
   *
   * If the type is not an ObjC object, an invalid type is returned.
   */
  clang_Type_getObjCObjectBaseType: (T: CXType) => CXType;

  /**
   * Retrieve the number of protocol references associated with an ObjC object/id.
   *
   * If the type is not an ObjC object, 0 is returned.
   */
  clang_Type_getNumObjCProtocolRefs: (T: CXType) => number;

  /**
   * Retrieve the decl for a protocol reference for an ObjC object/id.
   *
   * If the type is not an ObjC object or there are not enough protocol
   * references, an invalid cursor is returned.
   */
  clang_Type_getObjCProtocolDecl: (T: CXType, i: number) => CXCursor;

  /**
   * Retrieve the number of type arguments associated with an ObjC object.
   *
   * If the type is not an ObjC object, 0 is returned.
   */
  clang_Type_getNumObjCTypeArgs: (T: CXType) => number;

  /**
   * Retrieve a type argument associated with an ObjC object.
   *
   * If the type is not an ObjC or the index is not valid,
   * an invalid type is returned.
   */
  clang_Type_getObjCTypeArg: (T: CXType, i: number) => CXType;

  /**
   * Return 1 if the CXType is a variadic function type, and 0 otherwise.
   */
  clang_isFunctionTypeVariadic: (T: CXType) => number;

  /**
   * Retrieve the return type associated with a given cursor.
   *
   * This only returns a valid type if the cursor refers to a function or method.
   */
  clang_getCursorResultType: (C: CXCursor) => CXType;

  /**
   * Retrieve the exception specification type associated with a given cursor.
   * This is a value of type CXCursor_ExceptionSpecificationKind.
   *
   * This only returns a valid result if the cursor refers to a function or
   * method.
   */
  clang_getCursorExceptionSpecificationType: (C: CXCursor) => number;

  /**
   * Return 1 if the CXType is a POD (plain old data) type, and 0
   *  otherwise.
   */
  clang_isPODType: (T: CXType) => number;

  /**
   * Return the element type of an array, complex, or vector type.
   *
   * If a type is passed in that is not an array, complex, or vector type,
   * an invalid type is returned.
   */
  clang_getElementType: (T: CXType) => CXType;

  /**
   * Return the number of elements of an array or vector type.
   *
   * If a type is passed in that is not an array or vector type,
   * -1 is returned.
   */
  clang_getNumElements: (T: CXType) => number;

  /**
   * Return the element type of an array type.
   *
   * If a non-array type is passed in, an invalid type is returned.
   */
  clang_getArrayElementType: (T: CXType) => CXType;

  /**
   * Return the array size of a constant array.
   *
   * If a non-array type is passed in, -1 is returned.
   */
  clang_getArraySize: (T: CXType) => number;

  /**
   * Retrieve the type named by the qualified-id.
   *
   * If a non-elaborated type is passed in, an invalid type is returned.
   */
  clang_Type_getNamedType: (T: CXType) => CXType;

  /**
   * Determine if a typedef is 'transparent' tag.
   *
   * A typedef is considered 'transparent' if it shares a name and spelling
   * location with its underlying tag type, as is the case with the NS_ENUM macro.
   *
   * @returns non-zero if transparent and zero otherwise.
   */
  clang_Type_isTransparentTagTypedef: (T: CXType) => number;

  /**
   * Retrieve the nullability kind of a pointer type.
   */
  clang_Type_getNullability: (T: CXType) => EnumValue<CXTypeNullabilityKind>;

  /**
   * Return the alignment of a type in bytes as per C++[expr.alignof]
   *   standard.
   *
   * If the type declaration is invalid, CXTypeLayoutError_Invalid is returned.
   * If the type declaration is an incomplete type, CXTypeLayoutError_Incomplete
   *   is returned.
   * If the type declaration is a dependent type, CXTypeLayoutError_Dependent is
   *   returned.
   * If the type declaration is not a constant size type,
   *   CXTypeLayoutError_NotConstantSize is returned.
   */
  clang_Type_getAlignOf: (T: CXType) => number;

  /**
   * Return the class type of an member pointer type.
   *
   * If a non-member-pointer type is passed in, an invalid type is returned.
   */
  clang_Type_getClassType: (T: CXType) => CXType;

  /**
   * Return the size of a type in bytes as per C++[expr.sizeof] standard.
   *
   * If the type declaration is invalid, CXTypeLayoutError_Invalid is returned.
   * If the type declaration is an incomplete type, CXTypeLayoutError_Incomplete
   *   is returned.
   * If the type declaration is a dependent type, CXTypeLayoutError_Dependent is
   *   returned.
   */
  clang_Type_getSizeOf: (T: CXType) => number;

  /**
   * Return the offset of a field named S in a record of type T in bits
   *   as it would be returned by __offsetof__ as per C++11[18.2p4]
   *
   * If the cursor is not a record field declaration, CXTypeLayoutError_Invalid
   *   is returned.
   * If the field's type declaration is an incomplete type,
   *   CXTypeLayoutError_Incomplete is returned.
   * If the field's type declaration is a dependent type,
   *   CXTypeLayoutError_Dependent is returned.
   * If the field's name S is not found,
   *   CXTypeLayoutError_InvalidFieldName is returned.
   */
  clang_Type_getOffsetOf: (T: CXType, S: string | null) => number;

  /**
   * Return the type that was modified by this attributed type.
   *
   * If the type is not an attributed type, an invalid type is returned.
   */
  clang_Type_getModifiedType: (T: CXType) => CXType;

  /**
   * Gets the type contained by this atomic type.
   *
   * If a non-atomic type is passed in, an invalid type is returned.
   */
  clang_Type_getValueType: (CT: CXType) => CXType;

  /**
   * Return the offset of the field represented by the Cursor.
   *
   * If the cursor is not a field declaration, -1 is returned.
   * If the cursor semantic parent is not a record field declaration,
   *   CXTypeLayoutError_Invalid is returned.
   * If the field's type declaration is an incomplete type,
   *   CXTypeLayoutError_Incomplete is returned.
   * If the field's type declaration is a dependent type,
   *   CXTypeLayoutError_Dependent is returned.
   * If the field's name S is not found,
   *   CXTypeLayoutError_InvalidFieldName is returned.
   */
  clang_Cursor_getOffsetOfField: (C: CXCursor) => number;

  /**
   * Determine whether the given cursor represents an anonymous
   * tag or namespace
   */
  clang_Cursor_isAnonymous: (C: CXCursor) => number;

  /**
   * Determine whether the given cursor represents an anonymous record
   * declaration.
   */
  clang_Cursor_isAnonymousRecordDecl: (C: CXCursor) => number;

  /**
   * Determine whether the given cursor represents an inline namespace
   * declaration.
   */
  clang_Cursor_isInlineNamespace: (C: CXCursor) => number;

  /**
   * Returns the number of template arguments for given template
   * specialization, or -1 if type \c T is not a template specialization.
   */
  clang_Type_getNumTemplateArguments: (T: CXType) => number;

  /**
   * Returns the type template argument of a template class specialization
   * at given index.
   *
   * This function only returns template type arguments and does not handle
   * template template arguments or variadic packs.
   */
  clang_Type_getTemplateArgumentAsType: (T: CXType, i: number) => CXType;

  /**
   * Retrieve the ref-qualifier kind of a function or method.
   *
   * The ref-qualifier is returned for C++ functions or methods. For other types
   * or non-C++ declarations, CXRefQualifier_None is returned.
   */
  clang_Type_getCXXRefQualifier: (T: CXType) => EnumValue<CXRefQualifierKind>;

  /**
   * Returns non-zero if the cursor specifies a Record member that is a
   *   bitfield.
   */
  clang_Cursor_isBitField: (C: CXCursor) => number;

  /**
   * Returns 1 if the base class specified by the cursor with kind
   *   CX_CXXBaseSpecifier is virtual.
   */
  clang_isVirtualBase: (C: CXCursor) => number;

  /**
   * Returns the access control level for the referenced object.
   *
   * If the cursor refers to a C++ declaration, its access control level within
   * its parent scope is returned. Otherwise, if the cursor refers to a base
   * specifier or access specifier, the specifier itself is returned.
   */
  clang_getCXXAccessSpecifier: (C: CXCursor) => EnumValue<CX_CXXAccessSpecifier>;

  /**
   * Returns the storage class for a function or variable declaration.
   *
   * If the passed in Cursor is not a function or variable declaration,
   * CX_SC_Invalid is returned else the storage class.
   */
  clang_Cursor_getStorageClass: (C: CXCursor) => EnumValue<CX_StorageClass>;

  /**
   * Determine the number of overloaded declarations referenced by a
   * {@link LibClang.CXCursor_OverloadedDeclRef | CXCursor_OverloadedDeclRef} cursor.
   *
   * @param cursor The cursor whose overloaded declarations are being queried.
   *
   * @returns The number of overloaded declarations referenced by \c cursor. If it
   * is not a {@link LibClang.CXCursor_OverloadedDeclRef | CXCursor_OverloadedDeclRef} cursor, returns 0.
   */
  clang_getNumOverloadedDecls: (cursor: CXCursor) => number;

  /**
   * Retrieve a cursor for one of the overloaded declarations referenced
   * by a {@link LibClang.CXCursor_OverloadedDeclRef | CXCursor_OverloadedDeclRef} cursor.
   *
   * @param cursor The cursor whose overloaded declarations are being queried.
   *
   * @param index The zero-based index into the set of overloaded declarations in
   * the cursor.
   *
   * @returns A cursor representing the declaration referenced by the given
   * \c cursor at the specified \c index. If the cursor does not have an
   * associated set of overloaded declarations, or if the index is out of bounds,
   * returns {@link LibClang.clang_getNullCursor | clang_getNullCursor()};
   */
  clang_getOverloadedDecl: (cursor: CXCursor, index: number) => CXCursor;

  /**
   * For cursors representing an iboutletcollection attribute,
   *  this function returns the collection element type.
   *
   */
  clang_getIBOutletCollectionType: (C: CXCursor) => CXType;

  /**
   * Visit the children of a particular cursor.
   *
   * This function visits all the direct children of the given cursor,
   * invoking the given \p visitor function with the cursors of each
   * visited child. The traversal may be recursive, if the visitor returns
   * \c CXChildVisit_Recurse. The traversal may also be ended prematurely, if
   * the visitor returns \c CXChildVisit_Break.
   *
   * @param parent the cursor whose child may be visited. All kinds of
   * cursors can be visited, including invalid cursors (which, by
   * definition, have no children).
   *
   * @param visitor the visitor function that will be invoked for each
   * child of \p parent.
   *
   * @param client_data pointer data supplied by the client, which will
   * be passed to the visitor each time it is invoked.
   *
   * @returns a non-zero value if the traversal was terminated
   * prematurely by the visitor returning \c CXChildVisit_Break.
   */
  clang_visitChildren: (parent: CXCursor, visitor: CXCursorVisitor) => number;

  // skipped clang_visitChildrenWithBlock

  /**
   * Retrieve a Unified Symbol Resolution (USR) for the entity referenced
   * by the given cursor.
   *
   * A Unified Symbol Resolution (USR) is a string that identifies a particular
   * entity (function, class, variable, etc.) within a program. USRs can be
   * compared across translation units to determine, e.g., when references in
   * one translation refer to an entity defined in another translation unit.
   */
  clang_getCursorUSR: (C: CXCursor) => string;

  /**
   * Construct a USR for a specified Objective-C class.
   */
  clang_constructUSR_ObjCClass: (class_name: string | null) => string;

  /**
   * Construct a USR for a specified Objective-C category.
   */
  clang_constructUSR_ObjCCategory: (class_name: string | null, category_name: string | null) => string;

  /**
   * Construct a USR for a specified Objective-C protocol.
   */
  clang_constructUSR_ObjCProtocol: (protocol_name: string | null) => string;

  // skipped clang_constructUSR_ObjCIvar
  // skipped clang_constructUSR_ObjCMethod
  // skipped clang_constructUSR_ObjCProperty

  clang_getCursorSpelling: (cursor: CXCursor) => string;

  /**
   * Retrieve a range for a piece that forms the cursors spelling name.
   * Most of the times there is only one range for the complete spelling but for
   * Objective-C methods and Objective-C message expressions, there are multiple
   * pieces for each selector identifier.
   *
   * @param pieceIndex the index of the spelling name piece. If this is greater
   * than the actual number of pieces, it will return a NULL (invalid) range.
   *
   * @param options Reserved.
   */
  clang_Cursor_getSpellingNameRange: (C: CXCursor, pieceIndex: number, options: number) => CXSourceRange;

  /**
   * Get a property value for the given printing policy.
   */

  clang_PrintingPolicy_getProperty: (Policy: CXPrintingPolicy, Property: EnumValue<CXPrintingPolicyProperty>) => number;

  /**
   * Set a property value for the given printing policy.
   */
  clang_PrintingPolicy_setProperty: (Policy: CXPrintingPolicy, Property: EnumValue<CXPrintingPolicyProperty>, Value: number) => void;

  /**
   * Retrieve the default policy for the cursor.
   *
   * The policy should be released after use with {@link LibClang.clang_PrintingPolicy_dispose | clang_PrintingPolicy_dispose}.
   */
  clang_getCursorPrintingPolicy: (C: CXCursor) => CXPrintingPolicy;

  /**
   * Release a printing policy.
   */
  clang_PrintingPolicy_dispose: (Policy: CXPrintingPolicy) => void;

  /**
   * Pretty print declarations.
   *
   * @param Cursor The cursor representing a declaration.
   *
   * @param Policy The policy to control the entities being printed. If
   * NULL, a default policy is used.
   *
   * @returns The pretty printed declaration or the empty string for
   * other cursors.
   */
  clang_getCursorPrettyPrinted: (Cursor: CXCursor, Policy: CXPrintingPolicy) => string;

  /**
   * Retrieve the display name for the entity referenced by this cursor.
   *
   * The display name contains extra information that helps identify the cursor,
   * such as the parameters of a function or template or the arguments of a
   * class template specialization.
   */
  clang_getCursorDisplayName: (c: CXCursor) => string;

  /** For a cursor that is a reference, retrieve a cursor representing the
   * entity that it references.
   *
   * Reference cursors refer to other entities in the AST. For example, an
   * Objective-C superclass reference cursor refers to an Objective-C class.
   * This function produces the cursor for the Objective-C class from the
   * cursor for the superclass reference. If the input cursor is a declaration or
   * definition, it returns that declaration or definition unchanged.
   * Otherwise, returns the NULL cursor.
   */
  clang_getCursorReferenced: (C: CXCursor) => CXCursor;

  /**
   *  For a cursor that is either a reference to or a declaration
   *  of some entity, retrieve a cursor that describes the definition of
   *  that entity.
   *
   *  Some entities can be declared multiple times within a translation
   *  unit, but only one of those declarations can also be a
   *  definition. For example, given:
   *
   *  ```cpp
   *  int f(int, int);
   *  int g(int x, int y) { return f(x, y); }
   *  int f(int a, int b) { return a + b; }
   *  int f(int, int);
   *  ```
   *
   *  there are three declarations of the function "f", but only the
   *  second one is a definition. The clang_getCursorDefinition()
   *  function will take any cursor pointing to a declaration of "f"
   *  (the first or fourth lines of the example) or a cursor referenced
   *  that uses "f" (the call to "f' inside "g") and will return a
   *  declaration cursor pointing to the definition (the second "f"
   *  declaration).
   *
   *  If given a cursor for which there is no corresponding definition,
   *  e.g., because there is no definition of that entity within this
   *  translation unit, returns a NULL cursor.
   */
  clang_getCursorDefinition: (C: CXCursor) => CXCursor;

  /**
   * Determine whether the declaration pointed to by this cursor
   * is also a definition of that entity.
   */
  clang_isCursorDefinition: (C: CXCursor) => number;

  /**
   * Retrieve the canonical cursor corresponding to the given cursor.
   *
   * In the C family of languages, many kinds of entities can be declared several
   * times within a single translation unit. For example, a structure type can
   * be forward-declared (possibly multiple times) and later defined:
   *
   * ```cpp
   * struct X;
   * struct X;
   * struct X {
   *   int member;
   * };
   * ```
   *
   * The declarations and the definition of \c X are represented by three
   * different cursors, all of which are declarations of the same underlying
   * entity. One of these cursor is considered the "canonical" cursor, which
   * is effectively the representative for the underlying entity. One can
   * determine if two cursors are declarations of the same underlying entity by
   * comparing their canonical cursors.
   *
   * @returns The canonical cursor for the entity referred to by the given cursor.
   */
  clang_getCanonicalCursor: (C: CXCursor) => CXCursor;

  /**
   * If the cursor points to a selector identifier in an Objective-C
   * method or message expression, this returns the selector index.
   *
   * After getting a cursor with #clang_getCursor, this can be called to
   * determine if the location points to a selector identifier.
   *
   * @returns The selector index if the cursor is an Objective-C method or message
   * expression and the cursor is pointing to a selector identifier, or -1
   * otherwise.
   */
  clang_Cursor_getObjCSelectorIndex: (c: CXCursor) => number;

  /**
   * Given a cursor pointing to a C++ method call or an Objective-C
   * message, returns non-zero if the method/message is "dynamic", meaning:
   *
   * For a C++ method: the call is virtual.
   * For an Objective-C message: the receiver is an object instance, not 'super'
   * or a specific class.
   *
   * If the method/message is "static" or the cursor does not point to a
   * method/message, it will return zero.
   */
  clang_Cursor_isDynamicCall: (C: CXCursor) => number;

  /**
   * Given a cursor pointing to an Objective-C message or property
   * reference, or C++ method call, returns the CXType of the receiver.
   */
  clang_Cursor_getReceiverType: (C: CXCursor) => CXType;

  /**
   * Given a cursor that represents a property declaration, return the
   * associated property attributes. The bits are formed from
   * {@link CXObjCPropertyAttrKind}.
   *
   * @param reserved Reserved for future use, pass 0.
   */
  clang_Cursor_getObjCPropertyAttributes: (C: CXCursor, reserved: number) => number;

  /**
   * Given a cursor that represents a property declaration, return the
   * name of the method that implements the getter.
   */
  clang_Cursor_getObjCPropertyGetterName: (C: CXCursor) => string;

  /**
   * Given a cursor that represents a property declaration, return the
   * name of the method that implements the setter, if any.
   */
  clang_Cursor_getObjCPropertySetterName: (C: CXCursor) => string;

  /**
   * Given a cursor that represents an Objective-C method or parameter
   * declaration, return the associated Objective-C qualifiers for the return
   * type or the parameter respectively. The bits are formed from
   * {@link CXObjCDeclQualifierKind}.
   */
  clang_Cursor_getObjCDeclQualifiers: (C: CXCursor) => number;

  /**
   * Given a cursor that represents an Objective-C method or property
   * declaration, return non-zero if the declaration was affected by "@optional".
   * Returns zero if the cursor is not such a declaration or it is "@required".
   */
  clang_Cursor_isObjCOptional: (C: CXCursor) => number;

  /**
   * Returns non-zero if the given cursor is a variadic function or method.
   */
  clang_Cursor_isVariadic: (C: CXCursor) => number;

  // skipped clang_Cursor_isExternalSymbol

  /**
   * Given a cursor that represents a declaration, return the associated
   * comment's source range.  The range may include multiple consecutive comments
   * with whitespace in between.
   */
  clang_Cursor_getCommentRange: (C: CXCursor) => CXSourceRange;

  /**
   * Given a cursor that represents a declaration, return the associated
   * comment text, including comment markers.
   */
  clang_Cursor_getRawCommentText: (C: CXCursor) => string;

  /**
   * Given a cursor that represents a documentable entity (e.g.,
   * declaration), return the associated \paragraph; otherwise return the
   * first paragraph.
   */
  clang_Cursor_getBriefCommentText: (C: CXCursor) => string;

  /**
   * Retrieve the CXString representing the mangled name of the cursor.
   */
  clang_Cursor_getMangling: (C: CXCursor) => string;

  // skipped clang_Cursor_getCXXManglings
  // skipped clang_Cursor_getObjCManglings

  /**
   * Given a CXCursor_ModuleImportDecl cursor, return the associated module.
   */
  clang_Cursor_getModule: (C: CXCursor) => CXModule;

  /**
   * Given a CXFile header file, return the module that contains it, if one
   * exists.
   */
  clang_getModuleForFile: (TU: CXTranslationUnit, F: CXFile) => CXModule;

  /**
   * @param Module a module object.
   *
   * @returns the module file where the provided module object came from.
   */
  clang_Module_getASTFile: (Module: CXModule) => CXFile;

  /**
   * @param Module a module object.
   *
   * @returns the parent of a sub-module or NULL if the given module is top-level,
   * e.g. for 'std.vector' it will return the 'std' module.
   */
  clang_Module_getParent: (Module: CXModule) => CXModule;

  /**
   * @param Module a module object.
   *
   * @returns the name of the module, e.g. for the 'std.vector' sub-module it
   * will return "vector".
   */
  clang_Module_getName: (Module: CXModule) => string;

  /**
   * @param Module a module object.
   *
   * @returns the full name of the module, e.g. "std.vector".
   */
  clang_Module_getFullName: (Module: CXModule) => string;

  /**
   * @param Module a module object.
   *
   * @returns non-zero if the module is a system one.
   */
  clang_Module_isSystem: (Module: CXModule) => number;

  /**
   * @param Module a module object.
   *
   * @returns the number of top level headers associated with this module.
   */
  clang_Module_getNumTopLevelHeaders: (TU: CXTranslationUnit, Module: CXModule) => number;

  /**
   * @param Module a module object.
   *
   * @param Index top level header index (zero-based).
   *
   * @returns the specified top level header associated with the module.
   */
  clang_Module_getTopLevelHeader: (TU: CXTranslationUnit, Module: CXModule, Index: number) => CXFile;

  /**
   * Determine if a C++ constructor is a converting constructor.
   */
  clang_CXXConstructor_isConvertingConstructor: (C: CXCursor) => number;

  /**
   * Determine if a C++ constructor is a copy constructor.
   */
  clang_CXXConstructor_isCopyConstructor: (C: CXCursor) => number;

  /**
   * Determine if a C++ constructor is the default constructor.
   */
  clang_CXXConstructor_isDefaultConstructor: (C: CXCursor) => number;

  /**
   * Determine if a C++ constructor is a move constructor.
   */
  clang_CXXConstructor_isMoveConstructor: (C: CXCursor) => number;

  /**
   * Determine if a C++ field is declared 'mutable'.
   */
  clang_CXXField_isMutable: (C: CXCursor) => number;

  /**
   * Determine if a C++ method is declared '= default'.
   */
  clang_CXXMethod_isDefaulted: (C: CXCursor) => number;

  /**
   * Determine if a C++ member function or member function template is
   * pure virtual.
   */
  clang_CXXMethod_isPureVirtual: (C: CXCursor) => number;

  /**
   * Determine if a C++ member function or member function template is
   * declared 'static'.
   */
  clang_CXXMethod_isStatic: (C: CXCursor) => number;

  /**
   * Determine if a C++ member function or member function template is
   * explicitly declared 'virtual' or if it overrides a virtual method from
   * one of the base classes.
   */
  clang_CXXMethod_isVirtual: (C: CXCursor) => number;

  /**
   * Determine if a C++ record is abstract, i.e. whether a class or struct
   * has a pure virtual member function.
   */
  clang_CXXRecord_isAbstract: (C: CXCursor) => number;

  /**
   * Determine if an enum declaration refers to a scoped enum.
   */
  clang_EnumDecl_isScoped: (C: CXCursor) => number;

  /**
   * Determine if a C++ member function or member function template is
   * declared 'const'.
   */
  clang_CXXMethod_isConst: (C: CXCursor) => number;

  /**
   * Given a cursor that represents a template, determine
   * the cursor kind of the specializations would be generated by instantiating
   * the template.
   *
   * This routine can be used to determine what flavor of function template,
   * class template, or class template partial specialization is stored in the
   * cursor. For example, it can describe whether a class template cursor is
   * declared with "struct", "class" or "union".
   *
   * @param C The cursor to query. This cursor should represent a template
   * declaration.
   *
   * @returns The cursor kind of the specializations that would be generated
   * by instantiating the template \p C. If \p C is not a template, returns
   * \c CXCursor_NoDeclFound.
   */
  clang_getTemplateCursorKind: (C: CXCursor) => EnumValue<CXCursorKind>;

  /**
   * Given a cursor that may represent a specialization or instantiation
   * of a template, retrieve the cursor that represents the template that it
   * specializes or from which it was instantiated.
   *
   * This routine determines the template involved both for explicit
   * specializations of templates and for implicit instantiations of the template,
   * both of which are referred to as "specializations". For a class template
   * specialization (e.g., \c std::vector<bool>), this routine will return
   * either the primary template (\c std::vector) or, if the specialization was
   * instantiated from a class template partial specialization, the class template
   * partial specialization. For a class template partial specialization and a
   * function template specialization (including instantiations), this
   * this routine will return the specialized template.
   *
   * For members of a class template (e.g., member functions, member classes, or
   * static data members), returns the specialized or instantiated member.
   * Although not strictly "templates" in the C++ language, members of class
   * templates have the same notions of specializations and instantiations that
   * templates do, so this routine treats them similarly.
   *
   * @param C A cursor that may be a specialization of a template or a member
   * of a template.
   *
   * @returns If the given cursor is a specialization or instantiation of a
   * template or a member thereof, the template or member that it specializes or
   * from which it was instantiated. Otherwise, returns a NULL cursor.
   */
  clang_getSpecializedCursorTemplate: (C: CXCursor) => CXCursor;

  /**
   * Given a cursor that references something else, return the source range
   * covering that reference.
   *
   * @param C A cursor pointing to a member reference, a declaration reference, or
   * an operator call.
   * @param NameFlags A bitset with three independent flags:
   * CXNameRange_WantQualifier, CXNameRange_WantTemplateArgs, and
   * CXNameRange_WantSinglePiece.
   * @param PieceIndex For contiguous names or when passing the flag
   * CXNameRange_WantSinglePiece, only one piece with index 0 is
   * available. When the CXNameRange_WantSinglePiece flag is not passed for a
   * non-contiguous names, this index can be used to retrieve the individual
   * pieces of the name. See also CXNameRange_WantSinglePiece.
   *
   * @returns The piece of the name pointed to by the given cursor. If there is no
   * name, or if the PieceIndex is out-of-range, a null-cursor will be returned.
   */
  clang_getCursorReferenceNameRange: (C: CXCursor, NameFlags: number, PieceIndex: number) => CXSourceRange;

  /**
   * Get the raw lexical token starting with the given location.
   *
   * @param TU the translation unit whose text is being tokenized.
   *
   * @param Location the source location with which the token starts.
   *
   * @returns The token starting with the given location or NULL if no such token
   * exist. The returned pointer must be freed with clang_disposeTokens before the
   * translation unit is destroyed.
   */
  clang_getToken: (TU: CXTranslationUnit, Location: CXSourceLocation) => CXToken;

  /**
  * Determine the kind of the given token.
  */
  clang_getTokenKind: (T: CXToken) => EnumValue<CXTokenKind>;

  /**
  * Determine the spelling of the given token.
  *
  * The spelling of a token is the textual representation of that token, e.g.,
  * the text of an identifier or keyword.
  */
  clang_getTokenSpelling: (TU: CXTranslationUnit, T: CXToken) => string;

  /**
  * Retrieve the source location of the given token.
  */
  clang_getTokenLocation: (TU: CXTranslationUnit, T: CXToken) => CXSourceLocation;

  /**
  * Retrieve a source range that covers the given token.
  */
  clang_getTokenExtent: (TU: CXTranslationUnit, T: CXToken) => CXSourceRange;

  // skipped clang_tokenize
  // skipped clang_annotateTokens
  // skipped clang_disposeTokens

  /**
   * For debug / testing
   */
  clang_getCursorKindSpelling: (Kind: EnumValue<EnumValue<CXCursorKind>>) => string;

  // skipped clang_getDefinitionSpellingAndExtent
  // skipped clang_getDefinitionSpellingAndExtent

  /**
   * For debug / testing
   */
  clang_enableStackTraces: () => void;

  // clang_executeOnThread

  // skipped clang_getCompletionChunkKind
  // skipped clang_getCompletionChunkText
  // skipped clang_getCompletionChunkCompletionString
  // skipped clang_getNumCompletionChunks
  // skipped clang_getCompletionPriority
  // skipped clang_getCompletionAvailability
  // skipped clang_getCompletionNumAnnotations
  // skipped clang_getCompletionAnnotation
  // skipped clang_getCompletionParent
  // skipped clang_getCompletionBriefComment
  // skipped clang_getCursorCompletionString
  // skipped CXCodeCompleteResults
  // skipped clang_getCompletionNumFixIts
  // skipped clang_getCompletionFixIt
  // skipped CXCodeComplete_Flags
  // skipped CXCompletionContext
  // skipped clang_defaultCodeCompleteOptions
  // skipped clang_codeCompleteAt
  // skipped clang_sortCodeCompletionResults
  // skipped clang_disposeCodeCompleteResults
  // skipped clang_codeCompleteGetNumDiagnostics
  // skipped clang_codeCompleteGetDiagnostic
  // skipped clang_codeCompleteGetContexts
  // skipped clang_codeCompleteGetContainerKind
  // skipped clang_codeCompleteGetContainerUSR
  // skipped clang_codeCompleteGetObjCSelector
  // skipped clang_getClangVersion
  // skipped clang_toggleCrashRecovery
  // skipped clang_getInclusions
  // skipped CXEvalResultKind
  // skipped clang_Cursor_Evaluate
  // skipped clang_EvalResult_getKind
  // skipped clang_EvalResult_getAsInt
  // skipped clang_EvalResult_getAsLongLong
  // skipped clang_EvalResult_isUnsignedInt
  // skipped clang_EvalResult_getAsUnsigned
  // skipped clang_EvalResult_getAsDouble
  // skipped clang_EvalResult_getAsStr
  // skipped clang_EvalResult_dispose
  // skipped clang_getRemappings
  // skipped clang_getRemappingsFromFileList
  // skipped clang_remap_getNumFiles
  // skipped clang_remap_getFilenames
  // skipped clang_remap_dispose

  // skipped CXCursorAndRangeVisitor

  // skipped clang_findReferencesInFile
  // skipped clang_findIncludesInFile

  // skipped IndexerCallbacks
  // skipped clang_index_isEntityObjCContainerKind
  // skipped clang_index_getObjCContainerDeclInfo
  // skipped clang_index_getObjCInterfaceDeclInfo
  // skipped clang_index_getObjCCategoryDeclInfo
  // skipped clang_index_getObjCProtocolRefListInfo
  // skipped clang_index_getObjCPropertyDeclInfo
  // skipped clang_index_getIBOutletCollectionAttrInfo
  // skipped clang_index_getCXXClassDeclInfo
  // skipped clang_index_getClientContainer
  // skipped clang_index_setClientContainer
  // skipped clang_index_getClientEntity
  // skipped clang_index_setClientEntity
  // skipped clang_IndexAction_create
  // skipped clang_IndexAction_dispose
  // skipped CXIndexOptFlags
  // skipped clang_indexSourceFile
  // skipped clang_indexSourceFileFullArgv
  // skipped clang_indexTranslationUnit
  // skipped clang_indexLoc_getFileLocation
  // skipped clang_indexLoc_getCXSourceLocation
  // skipped clang_Type_visitFields

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

  /**
   * Flags that control how translation units are saved.
   *
   * The enumerators in this enumeration type are meant to be bitwise
   * ORed together to specify which options should be used when
   * saving the translation unit.
   */
  CXSaveTranslationUnit_Flags: CXSaveTranslationUnit_Flags;

  /**
   * Describes the kind of error that occurred (if any) in a call to
   * {@link LibClang.clang_saveTranslationUnit | clang_saveTranslationUnit()}.
   */
  CXSaveError: CXSaveError;

  /**
   * Flags that control the reparsing of translation units.
   *
   * The enumerators in this enumeration type are meant to be bitwise
   * ORed together to specify which options should be used when
   * reparsing the translation unit.
   */
  CXReparse_Flags: CXReparse_Flags;

  /**
   * Categorizes how memory is being used by a translation unit.
   */
  CXTUResourceUsageKind: CXTUResourceUsageKind;

  /**
   * Describe the linkage of the entity referred to by a cursor.
   */
  CXLinkageKind: CXLinkageKind;

  CXVisibilityKind: CXVisibilityKind;

  /**
   * Describes the availability of a particular entity, which indicates
   * whether the use of this entity will result in a warning or error due to
   * it being deprecated or unavailable.
   */
  CXAvailabilityKind: CXAvailabilityKind;

  /**
   * Describe the "language" of the entity referred to by a cursor.
   */
  CXLanguageKind: CXLanguageKind;

  /**
   * Describe the "thread-local storage (TLS) kind" of the declaration
   * referred to by a cursor.
   */
  CXTLSKind: CXTLSKind;

  /**
   * Describes the kind of type
   */
  CXTypeKind: CXTypeKind;
  /**
   * Describes the calling convention of a function type
   */
  CXCallingConv: CXCallingConv;

  /**
   * Describes the kind of a template argument.
   *
   * See the definition of llvm::clang::TemplateArgument::ArgKind for full
   * element descriptions.
   */
  CXTemplateArgumentKind: CXTemplateArgumentKind;

  CXTypeNullabilityKind: CXTypeNullabilityKind;

  /**
   * List the possible error codes for {@link LibClang.clang_Type_getSizeOf | clang_Type_getSizeOf},
   *   {@link LibClang.clang_Type_getAlignOf | clang_Type_getAlignOf}, {@link LibClang.clang_Type_getOffsetOf | clang_Type_getOffsetOf} and
   *   {@link LibClang.clang_Cursor_getOffsetOf | clang_Cursor_getOffsetOf}.
   *
   * A value of this enumeration type can be returned if the target type is not
   * a valid argument to sizeof, alignof or offsetof.
   */
  CXTypeLayoutError: CXTypeLayoutError;

  CXRefQualifierKind: CXRefQualifierKind;

  /**
   * Represents the C++ access control level to a base class for a
   * cursor with kind CX_CXXBaseSpecifier.
   */
  CX_CXXAccessSpecifier: CX_CXXAccessSpecifier;

  /**
   * Represents the storage classes as declared in the source. CX_SC_Invalid
   * was added for the case that the passed cursor in not a declaration.
   */
  CX_StorageClass: CX_StorageClass;

  /**
   * Properties for the printing policy.
   *
   * See \c clang::PrintingPolicy for more information.
   */
  CXPrintingPolicyProperty: CXPrintingPolicyProperty;

  /**
   * Property attributes for a {@link CXCursor_ObjCPropertyDecl}.
   */
  CXObjCPropertyAttrKind: CXObjCPropertyAttrKind;

  /**
   * 'Qualifiers' written next to the return and parameter types in
   * Objective-C method declarations.
   */
  CXObjCDeclQualifierKind: CXObjCDeclQualifierKind;

  CXNameRefFlags: CXNameRefFlags;

  /**
   * Describes a kind of token.
   */
  CXTokenKind: CXTokenKind;

  /**
   * Describes a single piece of text within a code-completion string.
   *
   * Each "chunk" within a code-completion string (\c CXCompletionString) is
   * either a piece of text with a specific "kind" that describes how that text
   * should be interpreted by the client or is another completion string.
   */
  CXCompletionChunkKind: CXCompletionChunkKind;

  CXVisitorResult: CXVisitorResult;

  CXResult: CXResult;

  CXIdxEntityKind: CXIdxEntityKind;

  CXIdxEntityLanguage: CXIdxEntityLanguage;

  CXIdxEntityCXXTemplateKind: CXIdxEntityCXXTemplateKind;

  CXIdxAttrKind: CXIdxAttrKind;

  CXIdxDeclInfoFlags: CXIdxDeclInfoFlags;

  CXIdxObjCContainerKind: CXIdxObjCContainerKind;

  /**
   * Data for IndexerCallbacks#indexEntityReference.
   *
   * This may be deprecated in a future version as this duplicates
   * the \c CXSymbolRole_Implicit bit in \c CXSymbolRole.
   */
  CXIdxEntityRefKind: CXIdxEntityRefKind;

  /**
   * Roles that are attributed to symbol occurrences.
   *
   * Internal: this currently mirrors low 9 bits of clang::index::SymbolRole with
   * higher bits zeroed. These high bits may be exposed in the future.
   */
  CXSymbolRole: CXSymbolRole;
};
