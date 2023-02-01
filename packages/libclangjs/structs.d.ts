import { CXCursorKind, CXIdxAttrKind, CXIdxEntityCXXTemplateKind, CXIdxEntityKind, CXIdxEntityLanguage, CXIdxEntityRefKind, CXIdxObjCContainerKind, CXSymbolRole, CXTypeKind, EnumValue } from "./enums";

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
 * getTranslationUnitCursor() produces a cursor for a translation unit,
 * from which one can use visitChildren() to explore the rest of the
 * translation unit. getCursor() maps from a physical source location
 * to the entity that resides at that location, allowing one to map from the
 * source code into the AST.
 */
export type CXCursor = {
  kind: EnumValue<CXCursorKind>;
  xdata: number;
};

/**
 * Identifies a specific source location within a translation
 * unit.
 *
 * Use {@link LibClang.getExpansionLocation | getExpansionLocation()} or {@link LibClang.getSpellingLocation | getSpellingLocation()}
 * to map a source location to a particular file, line, and column.
 */
export type CXSourceLocation = {
  int_data: number;
};

/**
 * Identifies a half-open character range in the source code.
 *
 * Use {@link LibClang.getRangeStart | getRangeStart()} and {@link LibClang.getRangeEnd | getRangeEnd()} to retrieve the
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
  kind: EnumValue<CXTypeKind>;
};

/**
 * Opaque pointer representing a policy that controls pretty printing
 * for {@link LibClang.getCursorPrettyPrinted | getCursorPrettyPrinted}.
 */
export type CXPrintingPolicy = {};

export type CXModule = {};

/**
 * Describes a single preprocessing token.
 */
export type CXToken = {};

/**
 * A semantic string that describes a code-completion result.
 *
 * A semantic string that describes the formatting of a code-completion
 * result as a single "template" of text that should be inserted into the
 * source buffer when a particular code-completion result is selected.
 * Each semantic string is made up of some number of "chunks", each of which
 * contains some text along with a description of what that text means, e.g.,
 * the name of the entity being referenced, whether the text chunk is part of
 * the template, or whether it is a "placeholder" that the user should replace
 * with actual code,of a specific kind. See \c CXCompletionChunkKind for a
 * description of the different kinds of chunks.
 */
export type CXCompletionString = {};

/**
 * A single result of code completion.
 */
export type CXCompletionResult = {
  /**
   * The kind of entity that this completion refers to.
   *
   * The cursor kind will be a macro, keyword, or a declaration (one of the
   * *Decl cursor kinds), describing the entity that the completion is
   * referring to.
   *
   * @todo In the future, we would like to provide a full cursor, to allow
   * the client to extract additional information from declaration.
   */
  CursorKind: EnumValue<CXCursorKind>;

  /**
   * The code-completion string that describes how to insert this
   * code-completion result into the editing buffer.
   */
  CompletionString: EnumValue<CXCompletionString>;
};

/**
 * The client's data object that is associated with a CXFile.
 */
export type CXIdxClientFile = {};

/**
 * The client's data object that is associated with a semantic entity.
 */
export type CXIdxClientEntity = {};

/**
 * The client's data object that is associated with a semantic container
 * of entities.
 */
export type CXIdxClientContainer = {};

/**
 * The client's data object that is associated with an AST file (PCH
 * or module).
 */
export type CXIdxClientASTFile = {};

/**
 * Source location passed to index callbacks.
 */
export type CXIdxLoc = {
  int_data: number;
};

/**
 * Data for ppIncludedFile callback.
 */
export type CXIdxIncludedFileInfo = {
  /**
   * Location of '#' in the \#include/\#import directive.
   */
  hashLoc: CXIdxLoc;
  /**
   * The actual file that the \#include/\#import directive resolved to.
   */
  file: CXFile;
  isImport: number;
  isAngled: number;
  /**
   * Non-zero if the directive was automatically turned into a module
   * import.
   */
  isModuleImport: number;
};

/**
 * Data for IndexerCallbacks#importedASTFile.
 */
export type CXIdxImportedASTFileInfo = {
  /**
   * Top level AST file containing the imported PCH, module or submodule.
   */
  file: CXFile;
  /**
   * The imported module or NULL if the AST file is a PCH.
   */
  module: CXModule;
  /**
   * Location where the file is imported. Applicable only for modules.
   */
  loc: CXIdxLoc;
  /**
   * Non-zero if an inclusion directive was automatically turned into
   * a module import. Applicable only for modules.
   */
  isImplicit: number;
};

export type CXIdxAttrInfo = {
  kind: EnumValue<CXIdxAttrKind>;
  cursor: CXCursor;
  loc: CXIdxLoc;
};

export type CXIdxEntityInfo = {
  kind: EnumValue<CXIdxEntityKind>;
  templateKind: EnumValue<CXIdxEntityCXXTemplateKind>;
  lang: EnumValue<CXIdxEntityLanguage>;
  cursor: CXCursor;
  numAttributes: number;
};

export type CXIdxContainerInfo = {
  cursor: CXCursor;
};

export type CXIdxIBOutletCollectionAttrInfo = {
  classCursor: CXCursor;
  classLoc: CXIdxLoc;
};

export type CXIdxDeclInfo = {
  cursor: CXCursor;
  loc: CXIdxLoc;
  isRedeclaration: number;
  isDefinition: number;
  isContainer: number;
  /**
   * Whether the declaration exists in code or was created implicitly
   * by the compiler, e.g. implicit Objective-C methods for properties.
   */
  isImplicit: number;
  numAttributes: number;
  flags: number;
};

export type CXIdxObjCContainerDeclInfo = {
  kind: EnumValue<CXIdxObjCContainerKind>;
};

export type CXIdxBaseClassInfo = {
  cursor: CXCursor;
  loc: CXIdxLoc;
};

export type CXIdxObjCProtocolRefInfo = {
  cursor: CXCursor;
  loc: CXIdxLoc;
};

export type CXIdxObjCProtocolRefListInfo = {
  numProtocols: number;
};

export type CXIdxObjCInterfaceDeclInfo = {};

export type CXIdxObjCCategoryDeclInfo = {
  classCursor: CXCursor;
  classLoc: CXIdxLoc;
};

export type CXIdxObjCPropertyDeclInfo = {};

export type CXIdxCXXClassDeclInfo = {
  numBases: number;
};

/**
 * Data for IndexerCallbacks#indexEntityReference.
 */
export type CXIdxEntityRefInfo = {
  kind: EnumValue<CXIdxEntityRefKind>;
  /**
   * Reference cursor.
   */
  cursor: CXCursor;
  loc: CXIdxLoc;

  /**
   * Sets of symbol roles of the reference.
   */
  role: EnumValue<CXSymbolRole>;
};
