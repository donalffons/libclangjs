import { EmscriptenModule, FS } from "./emscripten";

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

export type EnumEntry<T> = {
  value: number;
  /**
   * @private
   */
  __type: T; // hack to make enum entries unique per __name. Otherwise, typescript would allow EnumEntries to be used interchangeably
};

export type CXChildVisitResult = {
  /**
   * Terminates the cursor traversal.
   */
  Break: EnumEntry<CXChildVisitResult>;

  /**
   * Continues the cursor traversal with the next sibling of
   * the cursor just visited, without visiting its children.
   */
  Continue: EnumEntry<CXChildVisitResult>;

  /**
   * Recursively traverse the children of this cursor, using
   * the same visitor and client data.
   */
  Recurse: EnumEntry<CXChildVisitResult>;
};

export type CXGlobalOptFlags = {
  /**
   * Used to indicate that no special CXIndex options are needed.
   */
  None: EnumEntry<CXGlobalOptFlags>;

  /**
   * Used to indicate that threads that libclang creates for indexing
   * purposes should use background priority.
   *
   * Affects #clang_indexSourceFile, #clang_indexTranslationUnit,
   * #clang_parseTranslationUnit, #clang_saveTranslationUnit.
   */
  ThreadBackgroundPriorityForIndexing: EnumEntry<CXGlobalOptFlags>;

  /**
   * Used to indicate that threads that libclang creates for editing
   * purposes should use background priority.
   *
   * Affects #clang_reparseTranslationUnit, #clang_codeCompleteAt,
   * #clang_annotateTokens
   */
  ThreadBackgroundPriorityForEditing: EnumEntry<CXGlobalOptFlags>;

  /**
   * Used to indicate that all threads that libclang creates should use
   * background priority.
   */
  ThreadBackgroundPriorityForAll: EnumEntry<CXGlobalOptFlags>;
};

/**
 * Describes the kind of entity that a cursor refers to.
 */
export type CXCursorKind = {
  /**
   * A declaration whose specific kind is not exposed via this
   * interface.
   *
   * Unexposed declarations have the same operations as any other kind
   * of declaration; one can extract their location information,
   * spelling, find their definitions, etc. However, the specific kind
   * of the declaration is not reported.
   */
  CXCursor_UnexposedDecl: EnumEntry<CXCursorKind>;
  /** A C or C++ struct. */
  CXCursor_StructDecl: EnumEntry<CXCursorKind>;
  /** A C or C++ union. */
  CXCursor_UnionDecl: EnumEntry<CXCursorKind>;
  /** A C++ class. */
  CXCursor_ClassDecl: EnumEntry<CXCursorKind>;
  /** An enumeration. */
  CXCursor_EnumDecl: EnumEntry<CXCursorKind>;
  /**
   * A field (in C) or non-static data member (in C++) in a
   * struct, union, or C++ class.
   */
  CXCursor_FieldDecl: EnumEntry<CXCursorKind>;
  /** An enumerator constant. */
  CXCursor_EnumConstantDecl: EnumEntry<CXCursorKind>;
  /** A function. */
  CXCursor_FunctionDecl: EnumEntry<CXCursorKind>;
  /** A variable. */
  CXCursor_VarDecl: EnumEntry<CXCursorKind>;
  /** A function or method parameter. */
  CXCursor_ParmDecl: EnumEntry<CXCursorKind>;
  /** An Objective-C interface. */
  CXCursor_ObjCInterfaceDecl: EnumEntry<CXCursorKind>;
  /** An Objective-C interface for a category. */
  CXCursor_ObjCCategoryDecl: EnumEntry<CXCursorKind>;
  /** An Objective-C protocol declaration. */
  CXCursor_ObjCProtocolDecl: EnumEntry<CXCursorKind>;
  /** An Objective-C property declaration. */
  CXCursor_ObjCPropertyDecl: EnumEntry<CXCursorKind>;
  /** An Objective-C instance variable. */
  CXCursor_ObjCIvarDecl: EnumEntry<CXCursorKind>;
  /** An Objective-C instance method. */
  CXCursor_ObjCInstanceMethodDecl: EnumEntry<CXCursorKind>;
  /** An Objective-C class method. */
  CXCursor_ObjCClassMethodDecl: EnumEntry<CXCursorKind>;
  /** An Objective-C implementation. */
  CXCursor_ObjCImplementationDecl: EnumEntry<CXCursorKind>;
  /** An Objective-C implementation for a category. */
  CXCursor_ObjCCategoryImplDecl: EnumEntry<CXCursorKind>;
  /** A typedef. */
  CXCursor_TypedefDecl: EnumEntry<CXCursorKind>;
  /** A C++ class method. */
  CXCursor_CXXMethod: EnumEntry<CXCursorKind>;
  /** A C++ namespace. */
  CXCursor_Namespace: EnumEntry<CXCursorKind>;
  /** A linkage specification, e.g. 'extern "C"'. */
  CXCursor_LinkageSpec: EnumEntry<CXCursorKind>;
  /** A C++ constructor. */
  CXCursor_Constructor: EnumEntry<CXCursorKind>;
  /** A C++ destructor. */
  CXCursor_Destructor: EnumEntry<CXCursorKind>;
  /** A C++ conversion function. */
  CXCursor_ConversionFunction: EnumEntry<CXCursorKind>;
  /** A C++ template type parameter. */
  CXCursor_TemplateTypeParameter: EnumEntry<CXCursorKind>;
  /** A C++ non-type template parameter. */
  CXCursor_NonTypeTemplateParameter: EnumEntry<CXCursorKind>;
  /** A C++ template template parameter. */
  CXCursor_TemplateTemplateParameter: EnumEntry<CXCursorKind>;
  /** A C++ function template. */
  CXCursor_FunctionTemplate: EnumEntry<CXCursorKind>;
  /** A C++ class template. */
  CXCursor_ClassTemplate: EnumEntry<CXCursorKind>;
  /** A C++ class template partial specialization. */
  CXCursor_ClassTemplatePartialSpecialization: EnumEntry<CXCursorKind>;
  /** A C++ namespace alias declaration. */
  CXCursor_NamespaceAlias: EnumEntry<CXCursorKind>;
  /** A C++ using directive. */
  CXCursor_UsingDirective: EnumEntry<CXCursorKind>;
  /** A C++ using declaration. */
  CXCursor_UsingDeclaration: EnumEntry<CXCursorKind>;
  /** A C++ alias declaration */
  CXCursor_TypeAliasDecl: EnumEntry<CXCursorKind>;
  /** An Objective-C synthesize definition. */
  CXCursor_ObjCSynthesizeDecl: EnumEntry<CXCursorKind>;
  /** An Objective-C dynamic definition. */
  CXCursor_ObjCDynamicDecl: EnumEntry<CXCursorKind>;
  /** An access specifier. */
  CXCursor_CXXAccessSpecifier: EnumEntry<CXCursorKind>;

  CXCursor_FirstDecl: EnumEntry<CXCursorKind>;
  CXCursor_LastDecl: EnumEntry<CXCursorKind>;

  /* References */
  CXCursor_FirstRef: EnumEntry<CXCursorKind>; /* Decl references */
  CXCursor_ObjCSuperClassRef: EnumEntry<CXCursorKind>;
  CXCursor_ObjCProtocolRef: EnumEntry<CXCursorKind>;
  CXCursor_ObjCClassRef: EnumEntry<CXCursorKind>;
  /**
   * A reference to a type declaration.
   *
   * A type reference occurs anywhere where a type is named but not
   * declared. For example, given:
   *
   * ```cpp
   * typedef unsigned size_type;
   * size_type size;
   * ```
   *
   * The typedef is a declaration of size_type (CXCursor_TypedefDecl),
   * while the type of the variable "size" is referenced. The cursor
   * referenced by the type of size is the typedef for size_type.
   */
  CXCursor_TypeRef: EnumEntry<CXCursorKind>;
  CXCursor_CXXBaseSpecifier: EnumEntry<CXCursorKind>;
  /**
   * A reference to a class template, function template, template
   * template parameter, or class template partial specialization.
   */
  CXCursor_TemplateRef: EnumEntry<CXCursorKind>;
  /**
   * A reference to a namespace or namespace alias.
   */
  CXCursor_NamespaceRef: EnumEntry<CXCursorKind>;
  /**
   * A reference to a member of a struct, union, or class that occurs in
   * some non-expression context, e.g., a designated initializer.
   */
  CXCursor_MemberRef: EnumEntry<CXCursorKind>;
  /**
   * A reference to a labeled statement.
   *
   * This cursor kind is used to describe the jump to "start_over" in the
   * goto statement in the following example:
   *
   * ```cpp
   *   start_over:
   *     ++counter;
   *
   *     goto start_over;
   * ```
   *
   * A label reference cursor refers to a label statement.
   */
  CXCursor_LabelRef: EnumEntry<CXCursorKind>;

  /**
   * A reference to a set of overloaded functions or function templates
   * that has not yet been resolved to a specific function or function template.
   *
   * An overloaded declaration reference cursor occurs in C++ templates where
   * a dependent name refers to a function. For example:
   *
   * ```cpp
   * template<typename T> void swap(T&, T&);
   *
   * struct X { ... };
   * void swap(X&, X&);
   *
   * template<typename T>
   * void reverse(T* first, T* last) {
   *   while (first < last - 1) {
   *     swap(*first, *--last);
   *     ++first;
   *   }
   * }
   *
   * struct Y { };
   * void swap(Y&, Y&);
   * ```
   *
   * Here, the identifier "swap" is associated with an overloaded declaration
   * reference. In the template definition, "swap" refers to either of the two
   * "swap" functions declared above, so both results will be available. At
   * instantiation time, "swap" may also refer to other functions found via
   * argument-dependent lookup (e.g., the "swap" function at the end of the
   * example).
   *
   * The functions {@link LibClang.clang_getNumOverloadedDecls | clang_getNumOverloadedDecls()} and
   * {@link LibClang.clang_getOverloadedDecl | clang_getOverloadedDecl()} can be used to retrieve the definitions
   * referenced by this cursor.
   */
  CXCursor_OverloadedDeclRef: EnumEntry<CXCursorKind>;

  /**
   * A reference to a variable that occurs in some non-expression
   * context, e.g., a C++ lambda capture list.
   */
  CXCursor_VariableRef: EnumEntry<CXCursorKind>;

  CXCursor_LastRef: EnumEntry<CXCursorKind>;

  /* Error conditions */
  CXCursor_FirstInvalid: EnumEntry<CXCursorKind>;
  CXCursor_InvalidFile: EnumEntry<CXCursorKind>;
  CXCursor_NoDeclFound: EnumEntry<CXCursorKind>;
  CXCursor_NotImplemented: EnumEntry<CXCursorKind>;
  CXCursor_InvalidCode: EnumEntry<CXCursorKind>;
  CXCursor_LastInvalid: EnumEntry<CXCursorKind>;

  /* Expressions */
  CXCursor_FirstExpr: EnumEntry<CXCursorKind>;

  /**
   * An expression whose specific kind is not exposed via this
   * interface.
   *
   * Unexposed expressions have the same operations as any other kind
   * of expression; one can extract their location information,
   * spelling, children, etc. However, the specific kind of the
   * expression is not reported.
   */
  CXCursor_UnexposedExpr: EnumEntry<CXCursorKind>;

  /**
   * An expression that refers to some value declaration, such
   * as a function, variable, or enumerator.
   */
  CXCursor_DeclRefExpr: EnumEntry<CXCursorKind>;

  /**
   * An expression that refers to a member of a struct, union,
   * class, Objective-C class, etc.
   */
  CXCursor_MemberRefExpr: EnumEntry<CXCursorKind>;

  /** An expression that calls a function. */
  CXCursor_CallExpr: EnumEntry<CXCursorKind>;

  /** An expression that sends a message to an Objective-C
   object or class. */
  CXCursor_ObjCMessageExpr: EnumEntry<CXCursorKind>;

  /** An expression that represents a block literal. */
  CXCursor_BlockExpr: EnumEntry<CXCursorKind>;

  /** An integer literal.
   */
  CXCursor_IntegerLiteral: EnumEntry<CXCursorKind>;

  /** A floating point number literal.
   */
  CXCursor_FloatingLiteral: EnumEntry<CXCursorKind>;

  /** An imaginary number literal.
   */
  CXCursor_ImaginaryLiteral: EnumEntry<CXCursorKind>;

  /** A string literal.
   */
  CXCursor_StringLiteral: EnumEntry<CXCursorKind>;

  /** A character literal.
   */
  CXCursor_CharacterLiteral: EnumEntry<CXCursorKind>;

  /** A parenthesized expression, e.g. "(1)".
   *
   * This AST node is only formed if full location information is requested.
   */
  CXCursor_ParenExpr: EnumEntry<CXCursorKind>;

  /** This represents the unary-expression's (except sizeof and
   * alignof).
   */
  CXCursor_UnaryOperator: EnumEntry<CXCursorKind>;

  /** [C99 6.5.2.1] Array Subscripting.
   */
  CXCursor_ArraySubscriptExpr: EnumEntry<CXCursorKind>;

  /** A builtin binary operation expression such as "x + y" or
   * "x <= y".
   */
  CXCursor_BinaryOperator: EnumEntry<CXCursorKind>;

  /** Compound assignment such as "+=".
   */
  CXCursor_CompoundAssignOperator: EnumEntry<CXCursorKind>;

  /** The ?: ternary operator.
   */
  CXCursor_ConditionalOperator: EnumEntry<CXCursorKind>;

  /** An explicit cast in C (C99 6.5.4) or a C-style cast in C++
   * (C++ [expr.cast]), which uses the syntax (Type)expr.
   *
   * For example: (int)f.
   */
  CXCursor_CStyleCastExpr: EnumEntry<CXCursorKind>;

  /** [C99 6.5.2.5]
   */
  CXCursor_CompoundLiteralExpr: EnumEntry<CXCursorKind>;

  /** Describes an C or C++ initializer list.
   */
  CXCursor_InitListExpr: EnumEntry<CXCursorKind>;

  /** The GNU address of label extension, representing &&label.
   */
  CXCursor_AddrLabelExpr: EnumEntry<CXCursorKind>;

  /** This is the GNU Statement Expression extension: ({int X=4; X;})
   */
  CXCursor_StmtExpr: EnumEntry<CXCursorKind>;

  /** Represents a C11 generic selection.
   */
  CXCursor_GenericSelectionExpr: EnumEntry<CXCursorKind>;

  /** Implements the GNU __null extension, which is a name for a null
   * pointer constant that has integral type (e.g., int or long) and is the same
   * size and alignment as a pointer.
   *
   * The __null extension is typically only used by system headers, which define
   * NULL as __null in C++ rather than using 0 (which is an integer that may not
   * match the size of a pointer).
   */
  CXCursor_GNUNullExpr: EnumEntry<CXCursorKind>;

  /** C++'s static_cast<> expression.
   */
  CXCursor_CXXStaticCastExpr: EnumEntry<CXCursorKind>;

  /** C++'s dynamic_cast<> expression.
   */
  CXCursor_CXXDynamicCastExpr: EnumEntry<CXCursorKind>;

  /** C++'s reinterpret_cast<> expression.
   */
  CXCursor_CXXReinterpretCastExpr: EnumEntry<CXCursorKind>;

  /** C++'s const_cast<> expression.
   */
  CXCursor_CXXConstCastExpr: EnumEntry<CXCursorKind>;

  /** Represents an explicit C++ type conversion that uses "functional"
   * notion (C++ [expr.type.conv]).
   *
   * Example:
   * ```cpp
   *   x = int(0.5);
   * ```
   */
  CXCursor_CXXFunctionalCastExpr: EnumEntry<CXCursorKind>;

  /** A C++ typeid expression (C++ [expr.typeid]).
   */
  CXCursor_CXXTypeidExpr: EnumEntry<CXCursorKind>;

  /** [C++ 2.13.5] C++ Boolean Literal.
   */
  CXCursor_CXXBoolLiteralExpr: EnumEntry<CXCursorKind>;

  /** [C++0x 2.14.7] C++ Pointer Literal.
   */
  CXCursor_CXXNullPtrLiteralExpr: EnumEntry<CXCursorKind>;

  /** Represents the "this" expression in C++
   */
  CXCursor_CXXThisExpr: EnumEntry<CXCursorKind>;

  /** [C++ 15] C++ Throw Expression.
   *
   * This handles 'throw' and 'throw' assignment-expression. When
   * assignment-expression isn't present, Op will be null.
   */
  CXCursor_CXXThrowExpr: EnumEntry<CXCursorKind>;

  /** A new expression for memory allocation and constructor calls, e.g:
   * "new CXXNewExpr(foo)".
   */
  CXCursor_CXXNewExpr: EnumEntry<CXCursorKind>;

  /** A delete expression for memory deallocation and destructor calls,
   * e.g. "delete[] pArray".
   */
  CXCursor_CXXDeleteExpr: EnumEntry<CXCursorKind>;

  /** A unary expression. (noexcept, sizeof, or other traits)
   */
  CXCursor_UnaryExpr: EnumEntry<CXCursorKind>;

  /** An Objective-C string literal i.e. @"foo".
   */
  CXCursor_ObjCStringLiteral: EnumEntry<CXCursorKind>;

  /** An Objective-C encode expression.
   */
  CXCursor_ObjCEncodeExpr: EnumEntry<CXCursorKind>;

  /** An Objective-C selector expression.
   */
  CXCursor_ObjCSelectorExpr: EnumEntry<CXCursorKind>;

  /** An Objective-C protocol expression.
   */
  CXCursor_ObjCProtocolExpr: EnumEntry<CXCursorKind>;

  /** An Objective-C "bridged" cast expression, which casts between
   * Objective-C pointers and C pointers, transferring ownership in the process.
   *
   * ```cpp
   *   NSString *str = (__bridge_transfer NSString *)CFCreateString();
   * ```
   */
  CXCursor_ObjCBridgedCastExpr: EnumEntry<CXCursorKind>;

  /** Represents a C++0x pack expansion that produces a sequence of
   * expressions.
   *
   * A pack expansion expression contains a pattern (which itself is an
   * expression) followed by an ellipsis. For example:
   *
   * ```cpp
   * template<typename F, typename ...Types>
   * void forward(F f, Types &&...args) {
   *  f(static_cast<Types&&>(args)...);
   * }
   * ```
   */
  CXCursor_PackExpansionExpr: EnumEntry<CXCursorKind>;

  /** Represents an expression that computes the length of a parameter
   * pack.
   *
   * ```cpp
   * template<typename ...Types>
   * struct count {
   *   static const unsigned value = sizeof...(Types);
   * };
   * ```
   */
  CXCursor_SizeOfPackExpr: EnumEntry<CXCursorKind>;

  /* Represents a C++ lambda expression that produces a local function
   * object.
   *
   * ```cpp
   * void abssort(float *x, unsigned N) {
   *   std::sort(x, x + N,
   *             [](float a, float b) {
   *               return std::abs(a) < std::abs(b);
   *             });
   * }
   * ```
   */
  CXCursor_LambdaExpr: EnumEntry<CXCursorKind>;

  /** Objective-c Boolean Literal.
   */
  CXCursor_ObjCBoolLiteralExpr: EnumEntry<CXCursorKind>;

  /** Represents the "self" expression in an Objective-C method.
   */
  CXCursor_ObjCSelfExpr: EnumEntry<CXCursorKind>;

  /** OpenMP 5.0 [2.1.5, Array Section].
   */
  CXCursor_OMPArraySectionExpr: EnumEntry<CXCursorKind>;

  /** Represents an @available(...) check.
   */
  CXCursor_ObjCAvailabilityCheckExpr: EnumEntry<CXCursorKind>;

  /**
   * Fixed point literal
   */
  CXCursor_FixedPointLiteral: EnumEntry<CXCursorKind>;

  /** OpenMP 5.0 [2.1.4, Array Shaping].
   */
  CXCursor_OMPArrayShapingExpr: EnumEntry<CXCursorKind>;

  /**
   * OpenMP 5.0 [2.1.6 Iterators]
   */
  CXCursor_OMPIteratorExpr: EnumEntry<CXCursorKind>;

  /** OpenCL's addrspace_cast<> expression.
   */
  CXCursor_CXXAddrspaceCastExpr: EnumEntry<CXCursorKind>;

  CXCursor_LastExpr: EnumEntry<CXCursorKind>;

  /* Statements */
  CXCursor_FirstStmt: EnumEntry<CXCursorKind>;
  /**
   * A statement whose specific kind is not exposed via this
   * interface.
   *
   * Unexposed statements have the same operations as any other kind of
   * statement; one can extract their location information, spelling,
   * children, etc. However, the specific kind of the statement is not
   * reported.
   */
  CXCursor_UnexposedStmt: EnumEntry<CXCursorKind>;

  /** A labelled statement in a function.
   *
   * This cursor kind is used to describe the "start_over:" label statement in
   * the following example:
   *
   * ```cpp
   *   start_over:
   *     ++counter;
   * ```
   *
   */
  CXCursor_LabelStmt: EnumEntry<CXCursorKind>;

  /** A group of statements like { stmt stmt }.
   *
   * This cursor kind is used to describe compound statements, e.g. function
   * bodies.
   */
  CXCursor_CompoundStmt: EnumEntry<CXCursorKind>;

  /** A case statement.
   */
  CXCursor_CaseStmt: EnumEntry<CXCursorKind>;

  /** A default statement.
   */
  CXCursor_DefaultStmt: EnumEntry<CXCursorKind>;

  /** An if statement
   */
  CXCursor_IfStmt: EnumEntry<CXCursorKind>;

  /** A switch statement.
   */
  CXCursor_SwitchStmt: EnumEntry<CXCursorKind>;

  /** A while statement.
   */
  CXCursor_WhileStmt: EnumEntry<CXCursorKind>;

  /** A do statement.
   */
  CXCursor_DoStmt: EnumEntry<CXCursorKind>;

  /** A for statement.
   */
  CXCursor_ForStmt: EnumEntry<CXCursorKind>;

  /** A goto statement.
   */
  CXCursor_GotoStmt: EnumEntry<CXCursorKind>;

  /** An indirect goto statement.
   */
  CXCursor_IndirectGotoStmt: EnumEntry<CXCursorKind>;

  /** A continue statement.
   */
  CXCursor_ContinueStmt: EnumEntry<CXCursorKind>;

  /** A break statement.
   */
  CXCursor_BreakStmt: EnumEntry<CXCursorKind>;

  /** A return statement.
   */
  CXCursor_ReturnStmt: EnumEntry<CXCursorKind>;

  /** A GCC inline assembly statement extension.
   */
  CXCursor_GCCAsmStmt: EnumEntry<CXCursorKind>;
  CXCursor_AsmStmt: EnumEntry<CXCursorKind>;

  /** Objective-C's overall try-catch-finally statement.
   */
  CXCursor_ObjCAtTryStmt: EnumEntry<CXCursorKind>;

  /** Objective-C's catch statement.
   */
  CXCursor_ObjCAtCatchStmt: EnumEntry<CXCursorKind>;

  /** Objective-C's finally statement.
   */
  CXCursor_ObjCAtFinallyStmt: EnumEntry<CXCursorKind>;

  /** Objective-C's throw statement.
   */
  CXCursor_ObjCAtThrowStmt: EnumEntry<CXCursorKind>;

  /** Objective-C's synchronized statement.
   */
  CXCursor_ObjCAtSynchronizedStmt: EnumEntry<CXCursorKind>;

  /** Objective-C's autorelease pool statement.
   */
  CXCursor_ObjCAutoreleasePoolStmt: EnumEntry<CXCursorKind>;

  /** Objective-C's collection statement.
   */
  CXCursor_ObjCForCollectionStmt: EnumEntry<CXCursorKind>;

  /** C++'s catch statement.
   */
  CXCursor_CXXCatchStmt: EnumEntry<CXCursorKind>;

  /** C++'s try statement.
   */
  CXCursor_CXXTryStmt: EnumEntry<CXCursorKind>;

  /** C++'s for (* : *) statement.
   */
  CXCursor_CXXForRangeStmt: EnumEntry<CXCursorKind>;

  /** Windows Structured Exception Handling's try statement.
   */
  CXCursor_SEHTryStmt: EnumEntry<CXCursorKind>;

  /** Windows Structured Exception Handling's except statement.
   */
  CXCursor_SEHExceptStmt: EnumEntry<CXCursorKind>;

  /** Windows Structured Exception Handling's finally statement.
   */
  CXCursor_SEHFinallyStmt: EnumEntry<CXCursorKind>;

  /** A MS inline assembly statement extension.
   */
  CXCursor_MSAsmStmt: EnumEntry<CXCursorKind>;

  /** The null statement ";": C99 6.8.3p3.
   *
   * This cursor kind is used to describe the null statement.
   */
  CXCursor_NullStmt: EnumEntry<CXCursorKind>;

  /** Adaptor class for mixing declarations with statements and
   * expressions.
   */
  CXCursor_DeclStmt: EnumEntry<CXCursorKind>;

  /** OpenMP parallel directive.
   */
  CXCursor_OMPParallelDirective: EnumEntry<CXCursorKind>;

  /** OpenMP SIMD directive.
   */
  CXCursor_OMPSimdDirective: EnumEntry<CXCursorKind>;

  /** OpenMP for directive.
   */
  CXCursor_OMPForDirective: EnumEntry<CXCursorKind>;

  /** OpenMP sections directive.
   */
  CXCursor_OMPSectionsDirective: EnumEntry<CXCursorKind>;

  /** OpenMP section directive.
   */
  CXCursor_OMPSectionDirective: EnumEntry<CXCursorKind>;

  /** OpenMP single directive.
   */
  CXCursor_OMPSingleDirective: EnumEntry<CXCursorKind>;

  /** OpenMP parallel for directive.
   */
  CXCursor_OMPParallelForDirective: EnumEntry<CXCursorKind>;

  /** OpenMP parallel sections directive.
   */
  CXCursor_OMPParallelSectionsDirective: EnumEntry<CXCursorKind>;

  /** OpenMP task directive.
   */
  CXCursor_OMPTaskDirective: EnumEntry<CXCursorKind>;

  /** OpenMP master directive.
   */
  CXCursor_OMPMasterDirective: EnumEntry<CXCursorKind>;

  /** OpenMP critical directive.
   */
  CXCursor_OMPCriticalDirective: EnumEntry<CXCursorKind>;

  /** OpenMP taskyield directive.
   */
  CXCursor_OMPTaskyieldDirective: EnumEntry<CXCursorKind>;

  /** OpenMP barrier directive.
   */
  CXCursor_OMPBarrierDirective: EnumEntry<CXCursorKind>;

  /** OpenMP taskwait directive.
   */
  CXCursor_OMPTaskwaitDirective: EnumEntry<CXCursorKind>;

  /** OpenMP flush directive.
   */
  CXCursor_OMPFlushDirective: EnumEntry<CXCursorKind>;

  /** Windows Structured Exception Handling's leave statement.
   */
  CXCursor_SEHLeaveStmt: EnumEntry<CXCursorKind>;

  /** OpenMP ordered directive.
   */
  CXCursor_OMPOrderedDirective: EnumEntry<CXCursorKind>;

  /** OpenMP atomic directive.
   */
  CXCursor_OMPAtomicDirective: EnumEntry<CXCursorKind>;

  /** OpenMP for SIMD directive.
   */
  CXCursor_OMPForSimdDirective: EnumEntry<CXCursorKind>;

  /** OpenMP parallel for SIMD directive.
   */
  CXCursor_OMPParallelForSimdDirective: EnumEntry<CXCursorKind>;

  /** OpenMP target directive.
   */
  CXCursor_OMPTargetDirective: EnumEntry<CXCursorKind>;

  /** OpenMP teams directive.
   */
  CXCursor_OMPTeamsDirective: EnumEntry<CXCursorKind>;

  /** OpenMP taskgroup directive.
   */
  CXCursor_OMPTaskgroupDirective: EnumEntry<CXCursorKind>;

  /** OpenMP cancellation point directive.
   */
  CXCursor_OMPCancellationPointDirective: EnumEntry<CXCursorKind>;

  /** OpenMP cancel directive.
   */
  CXCursor_OMPCancelDirective: EnumEntry<CXCursorKind>;

  /** OpenMP target data directive.
   */
  CXCursor_OMPTargetDataDirective: EnumEntry<CXCursorKind>;

  /** OpenMP taskloop directive.
   */
  CXCursor_OMPTaskLoopDirective: EnumEntry<CXCursorKind>;

  /** OpenMP taskloop simd directive.
   */
  CXCursor_OMPTaskLoopSimdDirective: EnumEntry<CXCursorKind>;

  /** OpenMP distribute directive.
   */
  CXCursor_OMPDistributeDirective: EnumEntry<CXCursorKind>;

  /** OpenMP target enter data directive.
   */
  CXCursor_OMPTargetEnterDataDirective: EnumEntry<CXCursorKind>;

  /** OpenMP target exit data directive.
   */
  CXCursor_OMPTargetExitDataDirective: EnumEntry<CXCursorKind>;

  /** OpenMP target parallel directive.
   */
  CXCursor_OMPTargetParallelDirective: EnumEntry<CXCursorKind>;

  /** OpenMP target parallel for directive.
   */
  CXCursor_OMPTargetParallelForDirective: EnumEntry<CXCursorKind>;

  /** OpenMP target update directive.
   */
  CXCursor_OMPTargetUpdateDirective: EnumEntry<CXCursorKind>;

  /** OpenMP distribute parallel for directive.
   */
  CXCursor_OMPDistributeParallelForDirective: EnumEntry<CXCursorKind>;

  /** OpenMP distribute parallel for simd directive.
   */
  CXCursor_OMPDistributeParallelForSimdDirective: EnumEntry<CXCursorKind>;

  /** OpenMP distribute simd directive.
   */
  CXCursor_OMPDistributeSimdDirective: EnumEntry<CXCursorKind>;

  /** OpenMP target parallel for simd directive.
   */
  CXCursor_OMPTargetParallelForSimdDirective: EnumEntry<CXCursorKind>;

  /** OpenMP target simd directive.
   */
  CXCursor_OMPTargetSimdDirective: EnumEntry<CXCursorKind>;

  /** OpenMP teams distribute directive.
   */
  CXCursor_OMPTeamsDistributeDirective: EnumEntry<CXCursorKind>;

  /** OpenMP teams distribute simd directive.
   */
  CXCursor_OMPTeamsDistributeSimdDirective: EnumEntry<CXCursorKind>;

  /** OpenMP teams distribute parallel for simd directive.
   */
  CXCursor_OMPTeamsDistributeParallelForSimdDirective: EnumEntry<CXCursorKind>;

  /** OpenMP teams distribute parallel for directive.
   */
  CXCursor_OMPTeamsDistributeParallelForDirective: EnumEntry<CXCursorKind>;

  /** OpenMP target teams directive.
   */
  CXCursor_OMPTargetTeamsDirective: EnumEntry<CXCursorKind>;

  /** OpenMP target teams distribute directive.
   */
  CXCursor_OMPTargetTeamsDistributeDirective: EnumEntry<CXCursorKind>;

  /** OpenMP target teams distribute parallel for directive.
   */
  CXCursor_OMPTargetTeamsDistributeParallelForDirective: EnumEntry<CXCursorKind>;

  /** OpenMP target teams distribute parallel for simd directive.
   */
  CXCursor_OMPTargetTeamsDistributeParallelForSimdDirective: EnumEntry<CXCursorKind>;

  /** OpenMP target teams distribute simd directive.
   */
  CXCursor_OMPTargetTeamsDistributeSimdDirective: EnumEntry<CXCursorKind>;

  /** C++2a std::bit_cast expression.
   */
  CXCursor_BuiltinBitCastExpr: EnumEntry<CXCursorKind>;

  /** OpenMP master taskloop directive.
   */
  CXCursor_OMPMasterTaskLoopDirective: EnumEntry<CXCursorKind>;

  /** OpenMP parallel master taskloop directive.
   */
  CXCursor_OMPParallelMasterTaskLoopDirective: EnumEntry<CXCursorKind>;

  /** OpenMP master taskloop simd directive.
   */
  CXCursor_OMPMasterTaskLoopSimdDirective: EnumEntry<CXCursorKind>;

  /** OpenMP parallel master taskloop simd directive.
   */
  CXCursor_OMPParallelMasterTaskLoopSimdDirective: EnumEntry<CXCursorKind>;

  /** OpenMP parallel master directive.
   */
  CXCursor_OMPParallelMasterDirective: EnumEntry<CXCursorKind>;

  /** OpenMP depobj directive.
   */
  CXCursor_OMPDepobjDirective: EnumEntry<CXCursorKind>;

  /** OpenMP scan directive.
   */
  CXCursor_OMPScanDirective: EnumEntry<CXCursorKind>;

  /** OpenMP tile directive.
   */
  CXCursor_OMPTileDirective: EnumEntry<CXCursorKind>;

  /** OpenMP canoniCXCursorcal loop.
   */
  CXCursor_OMPCanonicalLoop: EnumEntry<CXCursorKind>;

  /** OpenMP interop directive.
   */
  CXCursor_OMPInteropDirective: EnumEntry<CXCursorKind>;

  /** OpenMP dispatch directive.
   */
  CXCursor_OMPDispatchDirective: EnumEntry<CXCursorKind>;

  /** OpenMP masked directive.
   */
  CXCursor_OMPMaskedDirective: EnumEntry<CXCursorKind>;

  /** OpenMP unroll directive.
   */
  CXCursor_OMPUnrollDirective: EnumEntry<CXCursorKind>;

  /** OpenMP metadirective directive.
   */
  CXCursor_OMPMetaDirective: EnumEntry<CXCursorKind>;

  /** OpenMP loop directive.
   */
  CXCursor_OMPGenericLoopDirective: EnumEntry<CXCursorKind>;

  CXCursor_LastStmt: EnumEntry<CXCursorKind>;

  /**
   * Cursor that represents the translation unit itself.
   *
   * The translation unit cursor exists primarily to act as the root
   * cursor for traversing the contents of a translation unit.
   */
  CXCursor_TranslationUnit: EnumEntry<CXCursorKind>;

  /* Attributes */
  CXCursor_FirstAttr: EnumEntry<CXCursorKind>;
  /**
   * An attribute whose specific kind is not exposed via this
   * interface.
   */
  CXCursor_UnexposedAttr: EnumEntry<CXCursorKind>;

  CXCursor_IBActionAttr: EnumEntry<CXCursorKind>;
  CXCursor_IBOutletAttr: EnumEntry<CXCursorKind>;
  CXCursor_IBOutletCollectionAttr: EnumEntry<CXCursorKind>;
  CXCursor_CXXFinalAttr: EnumEntry<CXCursorKind>;
  CXCursor_CXXOverrideAttr: EnumEntry<CXCursorKind>;
  CXCursor_AnnotateAttr: EnumEntry<CXCursorKind>;
  CXCursor_AsmLabelAttr: EnumEntry<CXCursorKind>;
  CXCursor_PackedAttr: EnumEntry<CXCursorKind>;
  CXCursor_PureAttr: EnumEntry<CXCursorKind>;
  CXCursor_ConstAttr: EnumEntry<CXCursorKind>;
  CXCursor_NoDuplicateAttr: EnumEntry<CXCursorKind>;
  CXCursor_CUDAConstantAttr: EnumEntry<CXCursorKind>;
  CXCursor_CUDADeviceAttr: EnumEntry<CXCursorKind>;
  CXCursor_CUDAGlobalAttr: EnumEntry<CXCursorKind>;
  CXCursor_CUDAHostAttr: EnumEntry<CXCursorKind>;
  CXCursor_CUDASharedAttr: EnumEntry<CXCursorKind>;
  CXCursor_VisibilityAttr: EnumEntry<CXCursorKind>;
  CXCursor_DLLExport: EnumEntry<CXCursorKind>;
  CXCursor_DLLImport: EnumEntry<CXCursorKind>;
  CXCursor_NSReturnsRetained: EnumEntry<CXCursorKind>;
  CXCursor_NSReturnsNotRetained: EnumEntry<CXCursorKind>;
  CXCursor_NSReturnsAutoreleased: EnumEntry<CXCursorKind>;
  CXCursor_NSConsumesSelf: EnumEntry<CXCursorKind>;
  CXCursor_NSConsumed: EnumEntry<CXCursorKind>;
  CXCursor_ObjCException: EnumEntry<CXCursorKind>;
  CXCursor_ObjCNSObject: EnumEntry<CXCursorKind>;
  CXCursor_ObjCIndependentClass: EnumEntry<CXCursorKind>;
  CXCursor_ObjCPreciseLifetime: EnumEntry<CXCursorKind>;
  CXCursor_ObjCReturnsInnerPointer: EnumEntry<CXCursorKind>;
  CXCursor_ObjCRequiresSuper: EnumEntry<CXCursorKind>;
  CXCursor_ObjCRootClass: EnumEntry<CXCursorKind>;
  CXCursor_ObjCSubclassingRestricted: EnumEntry<CXCursorKind>;
  CXCursor_ObjCExplicitProtocolImpl: EnumEntry<CXCursorKind>;
  CXCursor_ObjCDesignatedInitializer: EnumEntry<CXCursorKind>;
  CXCursor_ObjCRuntimeVisible: EnumEntry<CXCursorKind>;
  CXCursor_ObjCBoxable: EnumEntry<CXCursorKind>;
  CXCursor_FlagEnum: EnumEntry<CXCursorKind>;
  CXCursor_ConvergentAttr: EnumEntry<CXCursorKind>;
  CXCursor_WarnUnusedAttr: EnumEntry<CXCursorKind>;
  CXCursor_WarnUnusedResultAttr: EnumEntry<CXCursorKind>;
  CXCursor_AlignedAttr: EnumEntry<CXCursorKind>;
  CXCursor_LastAttr: EnumEntry<CXCursorKind>;

  /* Preprocessing */
  CXCursor_PreprocessingDirective: EnumEntry<CXCursorKind>;
  CXCursor_MacroDefinition: EnumEntry<CXCursorKind>;
  CXCursor_MacroExpansion: EnumEntry<CXCursorKind>;
  CXCursor_MacroInstantiation: EnumEntry<CXCursorKind>;
  CXCursor_InclusionDirective: EnumEntry<CXCursorKind>;
  CXCursor_FirstPreprocessing: EnumEntry<CXCursorKind>;
  CXCursor_LastPreprocessing: EnumEntry<CXCursorKind>;

  /* Extra Declarations */
  /**
   * A module import declaration.
   */
  CXCursor_ModuleImportDecl: EnumEntry<CXCursorKind>;
  CXCursor_TypeAliasTemplateDecl: EnumEntry<CXCursorKind>;
  /**
   * A static_assert or _Static_assert node
   */
  CXCursor_StaticAssert: EnumEntry<CXCursorKind>;
  /**
   * a friend declaration.
   */
  CXCursor_FriendDecl: EnumEntry<CXCursorKind>;
  CXCursor_FirstExtraDecl: EnumEntry<CXCursorKind>;
  CXCursor_LastExtraDecl: EnumEntry<CXCursorKind>;

  /**
   * A code completion overload candidate.
   */
  CXCursor_OverloadCandidate: EnumEntry<CXCursorKind>;
};

/**
 * Describes the severity of a particular diagnostic.
 */
export type CXDiagnosticSeverity = {
  /**
   * A diagnostic that has been suppressed, e.g., by a command-line
   * option.
   */
  CXDiagnostic_Ignored: EnumEntry<CXDiagnosticSeverity>;

  /**
   * This diagnostic is a note that should be attached to the
   * previous (non-note) diagnostic.
   */
  CXDiagnostic_Note: EnumEntry<CXDiagnosticSeverity>;

  /**
   * This diagnostic indicates suspicious code that may not be
   * wrong.
   */
  CXDiagnostic_Warning: EnumEntry<CXDiagnosticSeverity>;

  /**
   * This diagnostic indicates that the code is ill-formed.
   */
  CXDiagnostic_Error: EnumEntry<CXDiagnosticSeverity>;

  /**
   * This diagnostic indicates that the code is ill-formed such
   * that future parser recovery is unlikely to produce useful
   * results.
   */
  CXDiagnostic_Fatal: EnumEntry<CXDiagnosticSeverity>;
};

/**
 * Describes the kind of error that occurred (if any) in a call to
 * {@link clang_loadDiagnostics}.
 */
export type CXLoadDiag_Error = {
  /**
   * Indicates that no error occurred.
   */
  CXLoadDiag_None: EnumEntry<CXLoadDiag_Error>;

  /**
   * Indicates that an unknown error occurred while attempting to
   * deserialize diagnostics.
   */
  CXLoadDiag_Unknown: EnumEntry<CXLoadDiag_Error>;

  /**
   * Indicates that the file containing the serialized diagnostics
   * could not be opened.
   */
  CXLoadDiag_CannotLoad: EnumEntry<CXLoadDiag_Error>;

  /**
   * Indicates that the serialized diagnostics file is invalid or
   * corrupt.
   */
  CXLoadDiag_InvalidFile: EnumEntry<CXLoadDiag_Error>;
};

/**
 * Flags that control the creation of translation units.
 *
 * The enumerators in this enumeration type are meant to be bitwise
 * ORed together to specify which options should be used when
 * constructing the translation unit.
 */
export type CXTranslationUnit_Flags = {
  /**
   * Used to indicate that no special translation-unit options are
   * needed.
   */
  CXTranslationUnit_None: EnumEntry<CXTranslationUnit_Flags>;

  /**
   * Used to indicate that the parser should construct a "detailed"
   * preprocessing record, including all macro definitions and instantiations.
   *
   * Constructing a detailed preprocessing record requires more memory
   * and time to parse, since the information contained in the record
   * is usually not retained. However, it can be useful for
   * applications that require more detailed information about the
   * behavior of the preprocessor.
   */
  CXTranslationUnit_DetailedPreprocessingRecord: EnumEntry<CXTranslationUnit_Flags>;

  /**
   * Used to indicate that the translation unit is incomplete.
   *
   * When a translation unit is considered "incomplete", semantic
   * analysis that is typically performed at the end of the
   * translation unit will be suppressed. For example, this suppresses
   * the completion of tentative declarations in C and of
   * instantiation of implicitly-instantiation function templates in
   * C++. This option is typically used when parsing a header with the
   * intent of producing a precompiled header.
   */
  CXTranslationUnit_Incomplete: EnumEntry<CXTranslationUnit_Flags>;

  /**
   * Used to indicate that the translation unit should be built with an
   * implicit precompiled header for the preamble.
   *
   * An implicit precompiled header is used as an optimization when a
   * particular translation unit is likely to be reparsed many times
   * when the sources aren't changing that often. In this case, an
   * implicit precompiled header will be built containing all of the
   * initial includes at the top of the main file (what we refer to as
   * the "preamble" of the file). In subsequent parses, if the
   * preamble or the files in it have not changed, \c
   * clang_reparseTranslationUnit() will re-use the implicit
   * precompiled header to improve parsing performance.
   */
  CXTranslationUnit_PrecompiledPreamble: EnumEntry<CXTranslationUnit_Flags>;

  /**
   * Used to indicate that the translation unit should cache some
   * code-completion results with each reparse of the source file.
   *
   * Caching of code-completion results is a performance optimization that
   * introduces some overhead to reparsing but improves the performance of
   * code-completion operations.
   */
  CXTranslationUnit_CacheCompletionResults: EnumEntry<CXTranslationUnit_Flags>;

  /**
   * Used to indicate that the translation unit will be serialized with
   * \c clang_saveTranslationUnit.
   *
   * This option is typically used when parsing a header with the intent of
   * producing a precompiled header.
   */
  CXTranslationUnit_ForSerialization: EnumEntry<CXTranslationUnit_Flags>;

  /**
   * DEPRECATED: Enabled chained precompiled preambles in C++.
   *
   * Note: this is a *temporary* option that is available only while
   * we are testing C++ precompiled preamble support. It is deprecated.
   */
  CXTranslationUnit_CXXChainedPCH: EnumEntry<CXTranslationUnit_Flags>;

  /**
   * Used to indicate that function/method bodies should be skipped while
   * parsing.
   *
   * This option can be used to search for declarations/definitions while
   * ignoring the usages.
   */
  CXTranslationUnit_SkipFunctionBodies: EnumEntry<CXTranslationUnit_Flags>;

  /**
   * Used to indicate that brief documentation comments should be
   * included into the set of code completions returned from this translation
   * unit.
   */
  CXTranslationUnit_IncludeBriefCommentsInCodeCompletion: EnumEntry<CXTranslationUnit_Flags>;

  /**
   * Used to indicate that the precompiled preamble should be created on
   * the first parse. Otherwise it will be created on the first reparse. This
   * trades runtime on the first parse (serializing the preamble takes time) for
   * reduced runtime on the second parse (can now reuse the preamble).
   */
  CXTranslationUnit_CreatePreambleOnFirstParse: EnumEntry<CXTranslationUnit_Flags>;

  /**
   * Do not stop processing when fatal errors are encountered.
   *
   * When fatal errors are encountered while parsing a translation unit,
   * semantic analysis is typically stopped early when compiling code. A common
   * source for fatal errors are unresolvable include files. For the
   * purposes of an IDE, this is undesirable behavior and as much information
   * as possible should be reported. Use this flag to enable this behavior.
   */
  CXTranslationUnit_KeepGoing: EnumEntry<CXTranslationUnit_Flags>;

  /**
   * Sets the preprocessor in a mode for parsing a single file only.
   */
  CXTranslationUnit_SingleFileParse: EnumEntry<CXTranslationUnit_Flags>;

  /**
   * Used in combination with CXTranslationUnit_SkipFunctionBodies to
   * constrain the skipping of function bodies to the preamble.
   *
   * The function bodies of the main file are not skipped.
   */
  CXTranslationUnit_LimitSkipFunctionBodiesToPreamble: EnumEntry<CXTranslationUnit_Flags>;

  /**
   * Used to indicate that attributed types should be included in CXType.
   */
  CXTranslationUnit_IncludeAttributedTypes: EnumEntry<CXTranslationUnit_Flags>;

  /**
   * Used to indicate that implicit attributes should be visited.
   */
  CXTranslationUnit_VisitImplicitAttributes: EnumEntry<CXTranslationUnit_Flags>;

  /**
   * Used to indicate that non-errors from included files should be ignored.
   *
   * If set, clang_getDiagnosticSetFromTU() will not report e.g. warnings from
   * included files anymore. This speeds up clang_getDiagnosticSetFromTU() for
   * the case where these warnings are not of interest, as for an IDE for
   * example, which typically shows only the diagnostics in the main file.
   */
  CXTranslationUnit_IgnoreNonErrorsFromIncludedFiles: EnumEntry<CXTranslationUnit_Flags>;

  /**
   * Tells the preprocessor not to skip excluded conditional blocks.
   */
  CXTranslationUnit_RetainExcludedConditionalBlocks: EnumEntry<CXTranslationUnit_Flags>;
};

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
};

export default function init(module?: EmscriptenModule): LibClang;
