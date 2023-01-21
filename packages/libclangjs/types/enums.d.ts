
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
