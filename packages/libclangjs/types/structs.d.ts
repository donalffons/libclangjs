import { CXCursorKind, CXTypeKind } from "./enums";

/**
 * An "index" that consists of a set of translation units that would
 * typically be linked together into an executable or library.
 */
export type CXIndex = {};

/**
 * A particular source file that is part of a translation unit.
 */
export type CXFile = {};

/**
 * A single translation unit, which resides in an index.
 */

export type CXTranslationUnit = {};

/**
 * Provides the contents of a file that has not yet been saved to disk.
 *
 * Each CXUnsavedFile instance provides the name of a file on the
 * system along with the current contents of that file that have not
 * yet been saved to disk.
 */
export type CXUnsavedFile = {
  /**
   * The file whose contents have not yet been saved.
   *
   * This file must already exist in the file system.
   */
  filename: string;

  /**
   * A buffer containing the unsaved contents of this file.
   */
  contents: string;
};

/**
 * A cursor representing some element in the abstract syntax tree for
 * a translation unit.
 *
 * The cursor abstraction unifies the different kinds of entities in a
 * program--declaration, statements, expressions, references to declarations,
 * etc.--under a single "cursor" abstraction with a common set of operations.
 * Common operation for a cursor include: getting the physical location in
 * a source file where the cursor points, getting the name associated with a
 * cursor, and retrieving cursors for any child nodes of a particular cursor.
 *
 * Cursors can be produced in two specific ways.
 * clang_getTranslationUnitCursor() produces a cursor for a translation unit,
 * from which one can use clang_visitChildren() to explore the rest of the
 * translation unit. clang_getCursor() maps from a physical source location
 * to the entity that resides at that location, allowing one to map from the
 * source code into the AST.
 */
export type CXCursor = {
  kind: CXCursorKind;
  xdata: number;
};

/**
 * Identifies a specific source location within a translation
 * unit.
 *
 * Use {@link LibClang.clang_getExpansionLocation | clang_getExpansionLocation()} or {@link LibClang.clang_getSpellingLocation | clang_getSpellingLocation()}
 * to map a source location to a particular file, line, and column.
 */
export type CXSourceLocation = {
  int_data: number;
};

/**
 * Identifies a half-open character range in the source code.
 *
 * Use {@link LibClang.clang_getRangeStart | clang_getRangeStart()} and {@link LibClang.clang_getRangeEnd | clang_getRangeEnd()} to retrieve the
 * starting and end locations from a source range, respectively.
 */
export type CXSourceRange = {
  begin_int_data: number;
  end_int_data: number;
};

/**
 * A single diagnostic, containing the diagnostic's severity,
 * location, text, source ranges, and fix-it hints.
 */
export type CXDiagnostic = {};

/**
 * A group of CXDiagnostics.
 */
export type CXDiagnosticSet = {};

/**
 * A fast container representing a set of CXCursors.
 */
export type CXCursorSetImpl = {};

/**
 * The type of an element in the abstract syntax tree.
 *
 */
export type CXType = {
  kind: CXTypeKind;
};

/**
 * Opaque pointer representing a policy that controls pretty printing
 * for {@link LibClang.clang_getCursorPrettyPrinted | clang_getCursorPrettyPrinted}.
 */
export type CXPrintingPolicy = {};
