
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
  UnexposedDecl: EnumEntry<CXCursorKind>;
  /** A C or C++ struct. */
  StructDecl: EnumEntry<CXCursorKind>;
  /** A C or C++ union. */
  UnionDecl: EnumEntry<CXCursorKind>;
  /** A C++ class. */
  ClassDecl: EnumEntry<CXCursorKind>;
  /** An enumeration. */
  EnumDecl: EnumEntry<CXCursorKind>;
  /**
   * A field (in C) or non-static data member (in C++) in a
   * struct, union, or C++ class.
   */
  FieldDecl: EnumEntry<CXCursorKind>;
  /** An enumerator constant. */
  EnumConstantDecl: EnumEntry<CXCursorKind>;
  /** A function. */
  FunctionDecl: EnumEntry<CXCursorKind>;
  /** A variable. */
  VarDecl: EnumEntry<CXCursorKind>;
  /** A function or method parameter. */
  ParmDecl: EnumEntry<CXCursorKind>;
  /** An Objective-C interface. */
  ObjCInterfaceDecl: EnumEntry<CXCursorKind>;
  /** An Objective-C interface for a category. */
  ObjCCategoryDecl: EnumEntry<CXCursorKind>;
  /** An Objective-C protocol declaration. */
  ObjCProtocolDecl: EnumEntry<CXCursorKind>;
  /** An Objective-C property declaration. */
  ObjCPropertyDecl: EnumEntry<CXCursorKind>;
  /** An Objective-C instance variable. */
  ObjCIvarDecl: EnumEntry<CXCursorKind>;
  /** An Objective-C instance method. */
  ObjCInstanceMethodDecl: EnumEntry<CXCursorKind>;
  /** An Objective-C class method. */
  ObjCClassMethodDecl: EnumEntry<CXCursorKind>;
  /** An Objective-C implementation. */
  ObjCImplementationDecl: EnumEntry<CXCursorKind>;
  /** An Objective-C implementation for a category. */
  ObjCCategoryImplDecl: EnumEntry<CXCursorKind>;
  /** A typedef. */
  TypedefDecl: EnumEntry<CXCursorKind>;
  /** A C++ class method. */
  CXXMethod: EnumEntry<CXCursorKind>;
  /** A C++ namespace. */
  Namespace: EnumEntry<CXCursorKind>;
  /** A linkage specification, e.g. 'extern "C"'. */
  LinkageSpec: EnumEntry<CXCursorKind>;
  /** A C++ constructor. */
  Constructor: EnumEntry<CXCursorKind>;
  /** A C++ destructor. */
  Destructor: EnumEntry<CXCursorKind>;
  /** A C++ conversion function. */
  ConversionFunction: EnumEntry<CXCursorKind>;
  /** A C++ template type parameter. */
  TemplateTypeParameter: EnumEntry<CXCursorKind>;
  /** A C++ non-type template parameter. */
  NonTypeTemplateParameter: EnumEntry<CXCursorKind>;
  /** A C++ template template parameter. */
  TemplateTemplateParameter: EnumEntry<CXCursorKind>;
  /** A C++ function template. */
  FunctionTemplate: EnumEntry<CXCursorKind>;
  /** A C++ class template. */
  ClassTemplate: EnumEntry<CXCursorKind>;
  /** A C++ class template partial specialization. */
  ClassTemplatePartialSpecialization: EnumEntry<CXCursorKind>;
  /** A C++ namespace alias declaration. */
  NamespaceAlias: EnumEntry<CXCursorKind>;
  /** A C++ using directive. */
  UsingDirective: EnumEntry<CXCursorKind>;
  /** A C++ using declaration. */
  UsingDeclaration: EnumEntry<CXCursorKind>;
  /** A C++ alias declaration */
  TypeAliasDecl: EnumEntry<CXCursorKind>;
  /** An Objective-C synthesize definition. */
  ObjCSynthesizeDecl: EnumEntry<CXCursorKind>;
  /** An Objective-C dynamic definition. */
  ObjCDynamicDecl: EnumEntry<CXCursorKind>;
  /** An access specifier. */
  CXXAccessSpecifier: EnumEntry<CXCursorKind>;

  FirstDecl: EnumEntry<CXCursorKind>;
  LastDecl: EnumEntry<CXCursorKind>;

  /* References */
  FirstRef: EnumEntry<CXCursorKind>; /* Decl references */
  ObjCSuperClassRef: EnumEntry<CXCursorKind>;
  ObjCProtocolRef: EnumEntry<CXCursorKind>;
  ObjCClassRef: EnumEntry<CXCursorKind>;
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
   * The typedef is a declaration of size_type (TypedefDecl),
   * while the type of the variable "size" is referenced. The cursor
   * referenced by the type of size is the typedef for size_type.
   */
  TypeRef: EnumEntry<CXCursorKind>;
  CXXBaseSpecifier: EnumEntry<CXCursorKind>;
  /**
   * A reference to a class template, function template, template
   * template parameter, or class template partial specialization.
   */
  TemplateRef: EnumEntry<CXCursorKind>;
  /**
   * A reference to a namespace or namespace alias.
   */
  NamespaceRef: EnumEntry<CXCursorKind>;
  /**
   * A reference to a member of a struct, union, or class that occurs in
   * some non-expression context, e.g., a designated initializer.
   */
  MemberRef: EnumEntry<CXCursorKind>;
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
  LabelRef: EnumEntry<CXCursorKind>;

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
  OverloadedDeclRef: EnumEntry<CXCursorKind>;

  /**
   * A reference to a variable that occurs in some non-expression
   * context, e.g., a C++ lambda capture list.
   */
  VariableRef: EnumEntry<CXCursorKind>;

  LastRef: EnumEntry<CXCursorKind>;

  /* Error conditions */
  FirstInvalid: EnumEntry<CXCursorKind>;
  InvalidFile: EnumEntry<CXCursorKind>;
  NoDeclFound: EnumEntry<CXCursorKind>;
  NotImplemented: EnumEntry<CXCursorKind>;
  InvalidCode: EnumEntry<CXCursorKind>;
  LastInvalid: EnumEntry<CXCursorKind>;

  /* Expressions */
  FirstExpr: EnumEntry<CXCursorKind>;

  /**
   * An expression whose specific kind is not exposed via this
   * interface.
   *
   * Unexposed expressions have the same operations as any other kind
   * of expression; one can extract their location information,
   * spelling, children, etc. However, the specific kind of the
   * expression is not reported.
   */
  UnexposedExpr: EnumEntry<CXCursorKind>;

  /**
   * An expression that refers to some value declaration, such
   * as a function, variable, or enumerator.
   */
  DeclRefExpr: EnumEntry<CXCursorKind>;

  /**
   * An expression that refers to a member of a struct, union,
   * class, Objective-C class, etc.
   */
  MemberRefExpr: EnumEntry<CXCursorKind>;

  /** An expression that calls a function. */
  CallExpr: EnumEntry<CXCursorKind>;

  /** An expression that sends a message to an Objective-C
   object or class. */
  ObjCMessageExpr: EnumEntry<CXCursorKind>;

  /** An expression that represents a block literal. */
  BlockExpr: EnumEntry<CXCursorKind>;

  /** An integer literal.
   */
  IntegerLiteral: EnumEntry<CXCursorKind>;

  /** A floating point number literal.
   */
  FloatingLiteral: EnumEntry<CXCursorKind>;

  /** An imaginary number literal.
   */
  ImaginaryLiteral: EnumEntry<CXCursorKind>;

  /** A string literal.
   */
  StringLiteral: EnumEntry<CXCursorKind>;

  /** A character literal.
   */
  CharacterLiteral: EnumEntry<CXCursorKind>;

  /** A parenthesized expression, e.g. "(1)".
   *
   * This AST node is only formed if full location information is requested.
   */
  ParenExpr: EnumEntry<CXCursorKind>;

  /** This represents the unary-expression's (except sizeof and
   * alignof).
   */
  UnaryOperator: EnumEntry<CXCursorKind>;

  /** [C99 6.5.2.1] Array Subscripting.
   */
  ArraySubscriptExpr: EnumEntry<CXCursorKind>;

  /** A builtin binary operation expression such as "x + y" or
   * "x <= y".
   */
  BinaryOperator: EnumEntry<CXCursorKind>;

  /** Compound assignment such as "+=".
   */
  CompoundAssignOperator: EnumEntry<CXCursorKind>;

  /** The ?: ternary operator.
   */
  ConditionalOperator: EnumEntry<CXCursorKind>;

  /** An explicit cast in C (C99 6.5.4) or a C-style cast in C++
   * (C++ [expr.cast]), which uses the syntax (Type)expr.
   *
   * For example: (int)f.
   */
  CStyleCastExpr: EnumEntry<CXCursorKind>;

  /** [C99 6.5.2.5]
   */
  CompoundLiteralExpr: EnumEntry<CXCursorKind>;

  /** Describes an C or C++ initializer list.
   */
  InitListExpr: EnumEntry<CXCursorKind>;

  /** The GNU address of label extension, representing &&label.
   */
  AddrLabelExpr: EnumEntry<CXCursorKind>;

  /** This is the GNU Statement Expression extension: ({int X=4; X;})
   */
  StmtExpr: EnumEntry<CXCursorKind>;

  /** Represents a C11 generic selection.
   */
  GenericSelectionExpr: EnumEntry<CXCursorKind>;

  /** Implements the GNU __null extension, which is a name for a null
   * pointer constant that has integral type (e.g., int or long) and is the same
   * size and alignment as a pointer.
   *
   * The __null extension is typically only used by system headers, which define
   * NULL as __null in C++ rather than using 0 (which is an integer that may not
   * match the size of a pointer).
   */
  GNUNullExpr: EnumEntry<CXCursorKind>;

  /** C++'s static_cast<> expression.
   */
  CXXStaticCastExpr: EnumEntry<CXCursorKind>;

  /** C++'s dynamic_cast<> expression.
   */
  CXXDynamicCastExpr: EnumEntry<CXCursorKind>;

  /** C++'s reinterpret_cast<> expression.
   */
  CXXReinterpretCastExpr: EnumEntry<CXCursorKind>;

  /** C++'s const_cast<> expression.
   */
  CXXConstCastExpr: EnumEntry<CXCursorKind>;

  /** Represents an explicit C++ type conversion that uses "functional"
   * notion (C++ [expr.type.conv]).
   *
   * Example:
   * ```cpp
   *   x = int(0.5);
   * ```
   */
  CXXFunctionalCastExpr: EnumEntry<CXCursorKind>;

  /** A C++ typeid expression (C++ [expr.typeid]).
   */
  CXXTypeidExpr: EnumEntry<CXCursorKind>;

  /** [C++ 2.13.5] C++ Boolean Literal.
   */
  CXXBoolLiteralExpr: EnumEntry<CXCursorKind>;

  /** [C++0x 2.14.7] C++ Pointer Literal.
   */
  CXXNullPtrLiteralExpr: EnumEntry<CXCursorKind>;

  /** Represents the "this" expression in C++
   */
  CXXThisExpr: EnumEntry<CXCursorKind>;

  /** [C++ 15] C++ Throw Expression.
   *
   * This handles 'throw' and 'throw' assignment-expression. When
   * assignment-expression isn't present, Op will be null.
   */
  CXXThrowExpr: EnumEntry<CXCursorKind>;

  /** A new expression for memory allocation and constructor calls, e.g:
   * "new CXXNewExpr(foo)".
   */
  CXXNewExpr: EnumEntry<CXCursorKind>;

  /** A delete expression for memory deallocation and destructor calls,
   * e.g. "delete[] pArray".
   */
  CXXDeleteExpr: EnumEntry<CXCursorKind>;

  /** A unary expression. (noexcept, sizeof, or other traits)
   */
  UnaryExpr: EnumEntry<CXCursorKind>;

  /** An Objective-C string literal i.e. @"foo".
   */
  ObjCStringLiteral: EnumEntry<CXCursorKind>;

  /** An Objective-C encode expression.
   */
  ObjCEncodeExpr: EnumEntry<CXCursorKind>;

  /** An Objective-C selector expression.
   */
  ObjCSelectorExpr: EnumEntry<CXCursorKind>;

  /** An Objective-C protocol expression.
   */
  ObjCProtocolExpr: EnumEntry<CXCursorKind>;

  /** An Objective-C "bridged" cast expression, which casts between
   * Objective-C pointers and C pointers, transferring ownership in the process.
   *
   * ```cpp
   *   NSString *str = (__bridge_transfer NSString *)CFCreateString();
   * ```
   */
  ObjCBridgedCastExpr: EnumEntry<CXCursorKind>;

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
  PackExpansionExpr: EnumEntry<CXCursorKind>;

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
  SizeOfPackExpr: EnumEntry<CXCursorKind>;

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
  LambdaExpr: EnumEntry<CXCursorKind>;

  /** Objective-c Boolean Literal.
   */
  ObjCBoolLiteralExpr: EnumEntry<CXCursorKind>;

  /** Represents the "self" expression in an Objective-C method.
   */
  ObjCSelfExpr: EnumEntry<CXCursorKind>;

  /** OpenMP 5.0 [2.1.5, Array Section].
   */
  OMPArraySectionExpr: EnumEntry<CXCursorKind>;

  /** Represents an @available(...) check.
   */
  ObjCAvailabilityCheckExpr: EnumEntry<CXCursorKind>;

  /**
   * Fixed point literal
   */
  FixedPointLiteral: EnumEntry<CXCursorKind>;

  /** OpenMP 5.0 [2.1.4, Array Shaping].
   */
  OMPArrayShapingExpr: EnumEntry<CXCursorKind>;

  /**
   * OpenMP 5.0 [2.1.6 Iterators]
   */
  OMPIteratorExpr: EnumEntry<CXCursorKind>;

  /** OpenCL's addrspace_cast<> expression.
   */
  CXXAddrspaceCastExpr: EnumEntry<CXCursorKind>;

  LastExpr: EnumEntry<CXCursorKind>;

  /* Statements */
  FirstStmt: EnumEntry<CXCursorKind>;
  /**
   * A statement whose specific kind is not exposed via this
   * interface.
   *
   * Unexposed statements have the same operations as any other kind of
   * statement; one can extract their location information, spelling,
   * children, etc. However, the specific kind of the statement is not
   * reported.
   */
  UnexposedStmt: EnumEntry<CXCursorKind>;

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
  LabelStmt: EnumEntry<CXCursorKind>;

  /** A group of statements like { stmt stmt }.
   *
   * This cursor kind is used to describe compound statements, e.g. function
   * bodies.
   */
  CompoundStmt: EnumEntry<CXCursorKind>;

  /** A case statement.
   */
  CaseStmt: EnumEntry<CXCursorKind>;

  /** A default statement.
   */
  DefaultStmt: EnumEntry<CXCursorKind>;

  /** An if statement
   */
  IfStmt: EnumEntry<CXCursorKind>;

  /** A switch statement.
   */
  SwitchStmt: EnumEntry<CXCursorKind>;

  /** A while statement.
   */
  WhileStmt: EnumEntry<CXCursorKind>;

  /** A do statement.
   */
  DoStmt: EnumEntry<CXCursorKind>;

  /** A for statement.
   */
  ForStmt: EnumEntry<CXCursorKind>;

  /** A goto statement.
   */
  GotoStmt: EnumEntry<CXCursorKind>;

  /** An indirect goto statement.
   */
  IndirectGotoStmt: EnumEntry<CXCursorKind>;

  /** A continue statement.
   */
  ContinueStmt: EnumEntry<CXCursorKind>;

  /** A break statement.
   */
  BreakStmt: EnumEntry<CXCursorKind>;

  /** A return statement.
   */
  ReturnStmt: EnumEntry<CXCursorKind>;

  /** A GCC inline assembly statement extension.
   */
  GCCAsmStmt: EnumEntry<CXCursorKind>;
  AsmStmt: EnumEntry<CXCursorKind>;

  /** Objective-C's overall try-catch-finally statement.
   */
  ObjCAtTryStmt: EnumEntry<CXCursorKind>;

  /** Objective-C's catch statement.
   */
  ObjCAtCatchStmt: EnumEntry<CXCursorKind>;

  /** Objective-C's finally statement.
   */
  ObjCAtFinallyStmt: EnumEntry<CXCursorKind>;

  /** Objective-C's throw statement.
   */
  ObjCAtThrowStmt: EnumEntry<CXCursorKind>;

  /** Objective-C's synchronized statement.
   */
  ObjCAtSynchronizedStmt: EnumEntry<CXCursorKind>;

  /** Objective-C's autorelease pool statement.
   */
  ObjCAutoreleasePoolStmt: EnumEntry<CXCursorKind>;

  /** Objective-C's collection statement.
   */
  ObjCForCollectionStmt: EnumEntry<CXCursorKind>;

  /** C++'s catch statement.
   */
  CXXCatchStmt: EnumEntry<CXCursorKind>;

  /** C++'s try statement.
   */
  CXXTryStmt: EnumEntry<CXCursorKind>;

  /** C++'s for (* : *) statement.
   */
  CXXForRangeStmt: EnumEntry<CXCursorKind>;

  /** Windows Structured Exception Handling's try statement.
   */
  SEHTryStmt: EnumEntry<CXCursorKind>;

  /** Windows Structured Exception Handling's except statement.
   */
  SEHExceptStmt: EnumEntry<CXCursorKind>;

  /** Windows Structured Exception Handling's finally statement.
   */
  SEHFinallyStmt: EnumEntry<CXCursorKind>;

  /** A MS inline assembly statement extension.
   */
  MSAsmStmt: EnumEntry<CXCursorKind>;

  /** The null statement ";": C99 6.8.3p3.
   *
   * This cursor kind is used to describe the null statement.
   */
  NullStmt: EnumEntry<CXCursorKind>;

  /** Adaptor class for mixing declarations with statements and
   * expressions.
   */
  DeclStmt: EnumEntry<CXCursorKind>;

  /** OpenMP parallel directive.
   */
  OMPParallelDirective: EnumEntry<CXCursorKind>;

  /** OpenMP SIMD directive.
   */
  OMPSimdDirective: EnumEntry<CXCursorKind>;

  /** OpenMP for directive.
   */
  OMPForDirective: EnumEntry<CXCursorKind>;

  /** OpenMP sections directive.
   */
  OMPSectionsDirective: EnumEntry<CXCursorKind>;

  /** OpenMP section directive.
   */
  OMPSectionDirective: EnumEntry<CXCursorKind>;

  /** OpenMP single directive.
   */
  OMPSingleDirective: EnumEntry<CXCursorKind>;

  /** OpenMP parallel for directive.
   */
  OMPParallelForDirective: EnumEntry<CXCursorKind>;

  /** OpenMP parallel sections directive.
   */
  OMPParallelSectionsDirective: EnumEntry<CXCursorKind>;

  /** OpenMP task directive.
   */
  OMPTaskDirective: EnumEntry<CXCursorKind>;

  /** OpenMP master directive.
   */
  OMPMasterDirective: EnumEntry<CXCursorKind>;

  /** OpenMP critical directive.
   */
  OMPCriticalDirective: EnumEntry<CXCursorKind>;

  /** OpenMP taskyield directive.
   */
  OMPTaskyieldDirective: EnumEntry<CXCursorKind>;

  /** OpenMP barrier directive.
   */
  OMPBarrierDirective: EnumEntry<CXCursorKind>;

  /** OpenMP taskwait directive.
   */
  OMPTaskwaitDirective: EnumEntry<CXCursorKind>;

  /** OpenMP flush directive.
   */
  OMPFlushDirective: EnumEntry<CXCursorKind>;

  /** Windows Structured Exception Handling's leave statement.
   */
  SEHLeaveStmt: EnumEntry<CXCursorKind>;

  /** OpenMP ordered directive.
   */
  OMPOrderedDirective: EnumEntry<CXCursorKind>;

  /** OpenMP atomic directive.
   */
  OMPAtomicDirective: EnumEntry<CXCursorKind>;

  /** OpenMP for SIMD directive.
   */
  OMPForSimdDirective: EnumEntry<CXCursorKind>;

  /** OpenMP parallel for SIMD directive.
   */
  OMPParallelForSimdDirective: EnumEntry<CXCursorKind>;

  /** OpenMP target directive.
   */
  OMPTargetDirective: EnumEntry<CXCursorKind>;

  /** OpenMP teams directive.
   */
  OMPTeamsDirective: EnumEntry<CXCursorKind>;

  /** OpenMP taskgroup directive.
   */
  OMPTaskgroupDirective: EnumEntry<CXCursorKind>;

  /** OpenMP cancellation point directive.
   */
  OMPCancellationPointDirective: EnumEntry<CXCursorKind>;

  /** OpenMP cancel directive.
   */
  OMPCancelDirective: EnumEntry<CXCursorKind>;

  /** OpenMP target data directive.
   */
  OMPTargetDataDirective: EnumEntry<CXCursorKind>;

  /** OpenMP taskloop directive.
   */
  OMPTaskLoopDirective: EnumEntry<CXCursorKind>;

  /** OpenMP taskloop simd directive.
   */
  OMPTaskLoopSimdDirective: EnumEntry<CXCursorKind>;

  /** OpenMP distribute directive.
   */
  OMPDistributeDirective: EnumEntry<CXCursorKind>;

  /** OpenMP target enter data directive.
   */
  OMPTargetEnterDataDirective: EnumEntry<CXCursorKind>;

  /** OpenMP target exit data directive.
   */
  OMPTargetExitDataDirective: EnumEntry<CXCursorKind>;

  /** OpenMP target parallel directive.
   */
  OMPTargetParallelDirective: EnumEntry<CXCursorKind>;

  /** OpenMP target parallel for directive.
   */
  OMPTargetParallelForDirective: EnumEntry<CXCursorKind>;

  /** OpenMP target update directive.
   */
  OMPTargetUpdateDirective: EnumEntry<CXCursorKind>;

  /** OpenMP distribute parallel for directive.
   */
  OMPDistributeParallelForDirective: EnumEntry<CXCursorKind>;

  /** OpenMP distribute parallel for simd directive.
   */
  OMPDistributeParallelForSimdDirective: EnumEntry<CXCursorKind>;

  /** OpenMP distribute simd directive.
   */
  OMPDistributeSimdDirective: EnumEntry<CXCursorKind>;

  /** OpenMP target parallel for simd directive.
   */
  OMPTargetParallelForSimdDirective: EnumEntry<CXCursorKind>;

  /** OpenMP target simd directive.
   */
  OMPTargetSimdDirective: EnumEntry<CXCursorKind>;

  /** OpenMP teams distribute directive.
   */
  OMPTeamsDistributeDirective: EnumEntry<CXCursorKind>;

  /** OpenMP teams distribute simd directive.
   */
  OMPTeamsDistributeSimdDirective: EnumEntry<CXCursorKind>;

  /** OpenMP teams distribute parallel for simd directive.
   */
  OMPTeamsDistributeParallelForSimdDirective: EnumEntry<CXCursorKind>;

  /** OpenMP teams distribute parallel for directive.
   */
  OMPTeamsDistributeParallelForDirective: EnumEntry<CXCursorKind>;

  /** OpenMP target teams directive.
   */
  OMPTargetTeamsDirective: EnumEntry<CXCursorKind>;

  /** OpenMP target teams distribute directive.
   */
  OMPTargetTeamsDistributeDirective: EnumEntry<CXCursorKind>;

  /** OpenMP target teams distribute parallel for directive.
   */
  OMPTargetTeamsDistributeParallelForDirective: EnumEntry<CXCursorKind>;

  /** OpenMP target teams distribute parallel for simd directive.
   */
  OMPTargetTeamsDistributeParallelForSimdDirective: EnumEntry<CXCursorKind>;

  /** OpenMP target teams distribute simd directive.
   */
  OMPTargetTeamsDistributeSimdDirective: EnumEntry<CXCursorKind>;

  /** C++2a std::bit_cast expression.
   */
  BuiltinBitCastExpr: EnumEntry<CXCursorKind>;

  /** OpenMP master taskloop directive.
   */
  OMPMasterTaskLoopDirective: EnumEntry<CXCursorKind>;

  /** OpenMP parallel master taskloop directive.
   */
  OMPParallelMasterTaskLoopDirective: EnumEntry<CXCursorKind>;

  /** OpenMP master taskloop simd directive.
   */
  OMPMasterTaskLoopSimdDirective: EnumEntry<CXCursorKind>;

  /** OpenMP parallel master taskloop simd directive.
   */
  OMPParallelMasterTaskLoopSimdDirective: EnumEntry<CXCursorKind>;

  /** OpenMP parallel master directive.
   */
  OMPParallelMasterDirective: EnumEntry<CXCursorKind>;

  /** OpenMP depobj directive.
   */
  OMPDepobjDirective: EnumEntry<CXCursorKind>;

  /** OpenMP scan directive.
   */
  OMPScanDirective: EnumEntry<CXCursorKind>;

  /** OpenMP tile directive.
   */
  OMPTileDirective: EnumEntry<CXCursorKind>;

  /** OpenMP canoniCXCursorcal loop.
   */
  OMPCanonicalLoop: EnumEntry<CXCursorKind>;

  /** OpenMP interop directive.
   */
  OMPInteropDirective: EnumEntry<CXCursorKind>;

  /** OpenMP dispatch directive.
   */
  OMPDispatchDirective: EnumEntry<CXCursorKind>;

  /** OpenMP masked directive.
   */
  OMPMaskedDirective: EnumEntry<CXCursorKind>;

  /** OpenMP unroll directive.
   */
  OMPUnrollDirective: EnumEntry<CXCursorKind>;

  /** OpenMP metadirective directive.
   */
  OMPMetaDirective: EnumEntry<CXCursorKind>;

  /** OpenMP loop directive.
   */
  OMPGenericLoopDirective: EnumEntry<CXCursorKind>;

  LastStmt: EnumEntry<CXCursorKind>;

  /**
   * Cursor that represents the translation unit itself.
   *
   * The translation unit cursor exists primarily to act as the root
   * cursor for traversing the contents of a translation unit.
   */
  TranslationUnit: EnumEntry<CXCursorKind>;

  /* Attributes */
  FirstAttr: EnumEntry<CXCursorKind>;
  /**
   * An attribute whose specific kind is not exposed via this
   * interface.
   */
  UnexposedAttr: EnumEntry<CXCursorKind>;

  IBActionAttr: EnumEntry<CXCursorKind>;
  IBOutletAttr: EnumEntry<CXCursorKind>;
  IBOutletCollectionAttr: EnumEntry<CXCursorKind>;
  CXXFinalAttr: EnumEntry<CXCursorKind>;
  CXXOverrideAttr: EnumEntry<CXCursorKind>;
  AnnotateAttr: EnumEntry<CXCursorKind>;
  AsmLabelAttr: EnumEntry<CXCursorKind>;
  PackedAttr: EnumEntry<CXCursorKind>;
  PureAttr: EnumEntry<CXCursorKind>;
  ConstAttr: EnumEntry<CXCursorKind>;
  NoDuplicateAttr: EnumEntry<CXCursorKind>;
  CUDAConstantAttr: EnumEntry<CXCursorKind>;
  CUDADeviceAttr: EnumEntry<CXCursorKind>;
  CUDAGlobalAttr: EnumEntry<CXCursorKind>;
  CUDAHostAttr: EnumEntry<CXCursorKind>;
  CUDASharedAttr: EnumEntry<CXCursorKind>;
  VisibilityAttr: EnumEntry<CXCursorKind>;
  DLLExport: EnumEntry<CXCursorKind>;
  DLLImport: EnumEntry<CXCursorKind>;
  NSReturnsRetained: EnumEntry<CXCursorKind>;
  NSReturnsNotRetained: EnumEntry<CXCursorKind>;
  NSReturnsAutoreleased: EnumEntry<CXCursorKind>;
  NSConsumesSelf: EnumEntry<CXCursorKind>;
  NSConsumed: EnumEntry<CXCursorKind>;
  ObjCException: EnumEntry<CXCursorKind>;
  ObjCNSObject: EnumEntry<CXCursorKind>;
  ObjCIndependentClass: EnumEntry<CXCursorKind>;
  ObjCPreciseLifetime: EnumEntry<CXCursorKind>;
  ObjCReturnsInnerPointer: EnumEntry<CXCursorKind>;
  ObjCRequiresSuper: EnumEntry<CXCursorKind>;
  ObjCRootClass: EnumEntry<CXCursorKind>;
  ObjCSubclassingRestricted: EnumEntry<CXCursorKind>;
  ObjCExplicitProtocolImpl: EnumEntry<CXCursorKind>;
  ObjCDesignatedInitializer: EnumEntry<CXCursorKind>;
  ObjCRuntimeVisible: EnumEntry<CXCursorKind>;
  ObjCBoxable: EnumEntry<CXCursorKind>;
  FlagEnum: EnumEntry<CXCursorKind>;
  ConvergentAttr: EnumEntry<CXCursorKind>;
  WarnUnusedAttr: EnumEntry<CXCursorKind>;
  WarnUnusedResultAttr: EnumEntry<CXCursorKind>;
  AlignedAttr: EnumEntry<CXCursorKind>;
  LastAttr: EnumEntry<CXCursorKind>;

  /* Preprocessing */
  PreprocessingDirective: EnumEntry<CXCursorKind>;
  MacroDefinition: EnumEntry<CXCursorKind>;
  MacroExpansion: EnumEntry<CXCursorKind>;
  MacroInstantiation: EnumEntry<CXCursorKind>;
  InclusionDirective: EnumEntry<CXCursorKind>;
  FirstPreprocessing: EnumEntry<CXCursorKind>;
  LastPreprocessing: EnumEntry<CXCursorKind>;

  /* Extra Declarations */
  /**
   * A module import declaration.
   */
  ModuleImportDecl: EnumEntry<CXCursorKind>;
  TypeAliasTemplateDecl: EnumEntry<CXCursorKind>;
  /**
   * A static_assert or _Static_assert node
   */
  StaticAssert: EnumEntry<CXCursorKind>;
  /**
   * a friend declaration.
   */
  FriendDecl: EnumEntry<CXCursorKind>;
  FirstExtraDecl: EnumEntry<CXCursorKind>;
  LastExtraDecl: EnumEntry<CXCursorKind>;

  /**
   * A code completion overload candidate.
   */
  OverloadCandidate: EnumEntry<CXCursorKind>;
};

export type CXDiagnosticSeverity = {
  /**
   * A diagnostic that has been suppressed, e.g., by a command-line
   * option.
   */
  Ignored: EnumEntry<CXDiagnosticSeverity>;

  /**
   * This diagnostic is a note that should be attached to the
   * previous (non-note) diagnostic.
   */
  Note: EnumEntry<CXDiagnosticSeverity>;

  /**
   * This diagnostic indicates suspicious code that may not be
   * wrong.
   */
  Warning: EnumEntry<CXDiagnosticSeverity>;

  /**
   * This diagnostic indicates that the code is ill-formed.
   */
  Error: EnumEntry<CXDiagnosticSeverity>;

  /**
   * This diagnostic indicates that the code is ill-formed such
   * that future parser recovery is unlikely to produce useful
   * results.
   */
  Fatal: EnumEntry<CXDiagnosticSeverity>;
};

export type CXLoadDiag_Error = {
  /**
   * Indicates that no error occurred.
   */
  None: EnumEntry<CXLoadDiag_Error>;

  /**
   * Indicates that an unknown error occurred while attempting to
   * deserialize diagnostics.
   */
  Unknown: EnumEntry<CXLoadDiag_Error>;

  /**
   * Indicates that the file containing the serialized diagnostics
   * could not be opened.
   */
  CannotLoad: EnumEntry<CXLoadDiag_Error>;

  /**
   * Indicates that the serialized diagnostics file is invalid or
   * corrupt.
   */
  InvalidFile: EnumEntry<CXLoadDiag_Error>;
};

export type CXTranslationUnit_Flags = {
  /**
   * Used to indicate that no special translation-unit options are
   * needed.
   */
  None: EnumEntry<CXTranslationUnit_Flags>;

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
  DetailedPreprocessingRecord: EnumEntry<CXTranslationUnit_Flags>;

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
  Incomplete: EnumEntry<CXTranslationUnit_Flags>;

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
  PrecompiledPreamble: EnumEntry<CXTranslationUnit_Flags>;

  /**
   * Used to indicate that the translation unit should cache some
   * code-completion results with each reparse of the source file.
   *
   * Caching of code-completion results is a performance optimization that
   * introduces some overhead to reparsing but improves the performance of
   * code-completion operations.
   */
  CacheCompletionResults: EnumEntry<CXTranslationUnit_Flags>;

  /**
   * Used to indicate that the translation unit will be serialized with
   * \c clang_saveTranslationUnit.
   *
   * This option is typically used when parsing a header with the intent of
   * producing a precompiled header.
   */
  ForSerialization: EnumEntry<CXTranslationUnit_Flags>;

  /**
   * DEPRECATED: Enabled chained precompiled preambles in C++.
   *
   * Note: this is a *temporary* option that is available only while
   * we are testing C++ precompiled preamble support. It is deprecated.
   */
  CXXChainedPCH: EnumEntry<CXTranslationUnit_Flags>;

  /**
   * Used to indicate that function/method bodies should be skipped while
   * parsing.
   *
   * This option can be used to search for declarations/definitions while
   * ignoring the usages.
   */
  SkipFunctionBodies: EnumEntry<CXTranslationUnit_Flags>;

  /**
   * Used to indicate that brief documentation comments should be
   * included into the set of code completions returned from this translation
   * unit.
   */
  IncludeBriefCommentsInCodeCompletion: EnumEntry<CXTranslationUnit_Flags>;

  /**
   * Used to indicate that the precompiled preamble should be created on
   * the first parse. Otherwise it will be created on the first reparse. This
   * trades runtime on the first parse (serializing the preamble takes time) for
   * reduced runtime on the second parse (can now reuse the preamble).
   */
  CreatePreambleOnFirstParse: EnumEntry<CXTranslationUnit_Flags>;

  /**
   * Do not stop processing when fatal errors are encountered.
   *
   * When fatal errors are encountered while parsing a translation unit,
   * semantic analysis is typically stopped early when compiling code. A common
   * source for fatal errors are unresolvable include files. For the
   * purposes of an IDE, this is undesirable behavior and as much information
   * as possible should be reported. Use this flag to enable this behavior.
   */
  KeepGoing: EnumEntry<CXTranslationUnit_Flags>;

  /**
   * Sets the preprocessor in a mode for parsing a single file only.
   */
  SingleFileParse: EnumEntry<CXTranslationUnit_Flags>;

  /**
   * Used in combination with SkipFunctionBodies to
   * constrain the skipping of function bodies to the preamble.
   *
   * The function bodies of the main file are not skipped.
   */
  LimitSkipFunctionBodiesToPreamble: EnumEntry<CXTranslationUnit_Flags>;

  /**
   * Used to indicate that attributed types should be included in CXType.
   */
  IncludeAttributedTypes: EnumEntry<CXTranslationUnit_Flags>;

  /**
   * Used to indicate that implicit attributes should be visited.
   */
  VisitImplicitAttributes: EnumEntry<CXTranslationUnit_Flags>;

  /**
   * Used to indicate that non-errors from included files should be ignored.
   *
   * If set, clang_getDiagnosticSetFromTU() will not report e.g. warnings from
   * included files anymore. This speeds up clang_getDiagnosticSetFromTU() for
   * the case where these warnings are not of interest, as for an IDE for
   * example, which typically shows only the diagnostics in the main file.
   */
  IgnoreNonErrorsFromIncludedFiles: EnumEntry<CXTranslationUnit_Flags>;

  /**
   * Tells the preprocessor not to skip excluded conditional blocks.
   */
  RetainExcludedConditionalBlocks: EnumEntry<CXTranslationUnit_Flags>;
};

export type CXSaveTranslationUnit_Flags = {
  /**
   * Used to indicate that no special saving options are needed.
   */
  None: EnumEntry<CXSaveTranslationUnit_Flags>;
};

export type CXSaveError = {
  /**
   * Indicates that no error occurred while saving a translation unit.
   */
  None: EnumEntry<CXSaveError>;

  /**
   * Indicates that an unknown error occurred while attempting to save
   * the file.
   *
   * This error typically indicates that file I/O failed when attempting to
   * write the file.
   */
  Unknown: EnumEntry<CXSaveError>;

  /**
   * Indicates that errors during translation prevented this attempt
   * to save the translation unit.
   *
   * Errors that prevent the translation unit from being saved can be
   * extracted using {@link LibClang.clang_getNumDiagnostics | clang_getNumDiagnostics()} and {@link LibClang.clang_getNumDiagnostics | clang_getNumDiagnostics()}.
   */
  TranslationErrors: EnumEntry<CXSaveError>;

  /**
   * Indicates that the translation unit to be saved was somehow
   * invalid (e.g., NULL).
   */
  InvalidTU: EnumEntry<CXSaveError>;
};

export type CXReparse_Flags = {
  /**
   * Used to indicate that no special reparsing options are needed.
   */
  None: EnumEntry<CXReparse_Flags>;
};

export type CXTUResourceUsageKind = {
  AST: EnumEntry<CXTUResourceUsageKind>;
  Identifiers: EnumEntry<CXTUResourceUsageKind>;
  Selectors: EnumEntry<CXTUResourceUsageKind>;
  GlobalCompletionResults: EnumEntry<CXTUResourceUsageKind>;
  SourceManagerContentCache: EnumEntry<CXTUResourceUsageKind>;
  AST_SideTables: EnumEntry<CXTUResourceUsageKind>;
  SourceManager_Membuffer_Malloc: EnumEntry<CXTUResourceUsageKind>;
  SourceManager_Membuffer_MMap: EnumEntry<CXTUResourceUsageKind>;
  ExternalASTSource_Membuffer_Malloc: EnumEntry<CXTUResourceUsageKind>;
  ExternalASTSource_Membuffer_MMap: EnumEntry<CXTUResourceUsageKind>;
  Preprocessor: EnumEntry<CXTUResourceUsageKind>;
  PreprocessingRecord: EnumEntry<CXTUResourceUsageKind>;
  SourceManager_DataStructures: EnumEntry<CXTUResourceUsageKind>;
  Preprocessor_HeaderSearch: EnumEntry<CXTUResourceUsageKind>;
  MEMORY_IN_BYTES_BEGIN: EnumEntry<CXTUResourceUsageKind>;
  MEMORY_IN_BYTES_END: EnumEntry<CXTUResourceUsageKind>;
  First: EnumEntry<CXTUResourceUsageKind>;
  Last: EnumEntry<CXTUResourceUsageKind>;
};

export type CXLinkageKind = {
  /** This value indicates that no linkage information is available
   * for a provided CXCursor. */
  Invalid: EnumEntry<CXLinkageKind>;
  /**
   * This is the linkage for variables, parameters, and so on that
   *  have automatic storage.  This covers normal (non-extern) local variables.
   */
  NoLinkage: EnumEntry<CXLinkageKind>;
  /** This is the linkage for static variables and static functions. */
  Internal: EnumEntry<CXLinkageKind>;
  /** This is the linkage for entities with external linkage that live
   * in C++ anonymous namespaces.*/
  UniqueExternal: EnumEntry<CXLinkageKind>;
  /** This is the linkage for entities with true, external linkage. */
  External: EnumEntry<CXLinkageKind>;
};

export type CXVisibilityKind = {
  /** This value indicates that no visibility information is available
   * for a provided CXCursor. */
  Invalid: EnumEntry<CXVisibilityKind>;

  /** Symbol not seen by the linker. */
  Hidden: EnumEntry<CXVisibilityKind>;
  /** Symbol seen by the linker but resolves to a symbol inside this object. */
  Protected: EnumEntry<CXVisibilityKind>;
  /** Symbol seen by the linker and acts like a normal symbol. */
  Default: EnumEntry<CXVisibilityKind>;
};

export type CXAvailabilityKind = {
  /**
   * The entity is available.
   */
  Available: EnumEntry<CXAvailabilityKind>;
  /**
   * The entity is available, but has been deprecated (and its use is
   * not recommended).
   */
  Deprecated: EnumEntry<CXAvailabilityKind>;
  /**
   * The entity is not available; any use of it will be an error.
   */
  NotAvailable: EnumEntry<CXAvailabilityKind>;
  /**
   * The entity is available, but not accessible; any use of it will be
   * an error.
   */
  NotAccessible: EnumEntry<CXAvailabilityKind>;
};

export type CXLanguageKind = {
  Invalid: EnumEntry<CXLanguageKind>;
  C: EnumEntry<CXLanguageKind>;
  ObjC: EnumEntry<CXLanguageKind>;
  CPlusPlus: EnumEntry<CXLanguageKind>;
};

export type CXTLSKind = {
  None: EnumEntry<CXTLSKind>;
  Dynamic: EnumEntry<CXTLSKind>;
  Static: EnumEntry<CXTLSKind>;
};
