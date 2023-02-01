
export type EnumValue<T> = {
  constructor: {
    name: string;
  };
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
  Break: EnumValue<CXChildVisitResult>;

  /**
   * Continues the cursor traversal with the next sibling of
   * the cursor just visited, without visiting its children.
   */
  Continue: EnumValue<CXChildVisitResult>;

  /**
   * Recursively traverse the children of this cursor, using
   * the same visitor and client data.
   */
  Recurse: EnumValue<CXChildVisitResult>;
};

export type CXGlobalOptFlags = {
  /**
   * Used to indicate that no special CXIndex options are needed.
   */
  None: EnumValue<CXGlobalOptFlags>;

  /**
   * Used to indicate that threads that libclang creates for indexing
   * purposes should use background priority.
   *
   * Affects #indexSourceFile, #indexTranslationUnit,
   * #parseTranslationUnit, #saveTranslationUnit.
   */
  ThreadBackgroundPriorityForIndexing: EnumValue<CXGlobalOptFlags>;

  /**
   * Used to indicate that threads that libclang creates for editing
   * purposes should use background priority.
   *
   * Affects #reparseTranslationUnit, #codeCompleteAt,
   * #annotateTokens
   */
  ThreadBackgroundPriorityForEditing: EnumValue<CXGlobalOptFlags>;

  /**
   * Used to indicate that all threads that libclang creates should use
   * background priority.
   */
  ThreadBackgroundPriorityForAll: EnumValue<CXGlobalOptFlags>;
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
  UnexposedDecl: EnumValue<CXCursorKind>;
  /** A C or C++ struct. */
  StructDecl: EnumValue<CXCursorKind>;
  /** A C or C++ union. */
  UnionDecl: EnumValue<CXCursorKind>;
  /** A C++ class. */
  ClassDecl: EnumValue<CXCursorKind>;
  /** An enumeration. */
  EnumDecl: EnumValue<CXCursorKind>;
  /**
   * A field (in C) or non-static data member (in C++) in a
   * struct, union, or C++ class.
   */
  FieldDecl: EnumValue<CXCursorKind>;
  /** An enumerator constant. */
  EnumConstantDecl: EnumValue<CXCursorKind>;
  /** A function. */
  FunctionDecl: EnumValue<CXCursorKind>;
  /** A variable. */
  VarDecl: EnumValue<CXCursorKind>;
  /** A function or method parameter. */
  ParmDecl: EnumValue<CXCursorKind>;
  /** An Objective-C interface. */
  ObjCInterfaceDecl: EnumValue<CXCursorKind>;
  /** An Objective-C interface for a category. */
  ObjCCategoryDecl: EnumValue<CXCursorKind>;
  /** An Objective-C protocol declaration. */
  ObjCProtocolDecl: EnumValue<CXCursorKind>;
  /** An Objective-C property declaration. */
  ObjCPropertyDecl: EnumValue<CXCursorKind>;
  /** An Objective-C instance variable. */
  ObjCIvarDecl: EnumValue<CXCursorKind>;
  /** An Objective-C instance method. */
  ObjCInstanceMethodDecl: EnumValue<CXCursorKind>;
  /** An Objective-C class method. */
  ObjCClassMethodDecl: EnumValue<CXCursorKind>;
  /** An Objective-C implementation. */
  ObjCImplementationDecl: EnumValue<CXCursorKind>;
  /** An Objective-C implementation for a category. */
  ObjCCategoryImplDecl: EnumValue<CXCursorKind>;
  /** A typedef. */
  TypedefDecl: EnumValue<CXCursorKind>;
  /** A C++ class method. */
  CXXMethod: EnumValue<CXCursorKind>;
  /** A C++ namespace. */
  Namespace: EnumValue<CXCursorKind>;
  /** A linkage specification, e.g. 'extern "C"'. */
  LinkageSpec: EnumValue<CXCursorKind>;
  /** A C++ constructor. */
  Constructor: EnumValue<CXCursorKind>;
  /** A C++ destructor. */
  Destructor: EnumValue<CXCursorKind>;
  /** A C++ conversion function. */
  ConversionFunction: EnumValue<CXCursorKind>;
  /** A C++ template type parameter. */
  TemplateTypeParameter: EnumValue<CXCursorKind>;
  /** A C++ non-type template parameter. */
  NonTypeTemplateParameter: EnumValue<CXCursorKind>;
  /** A C++ template template parameter. */
  TemplateTemplateParameter: EnumValue<CXCursorKind>;
  /** A C++ function template. */
  FunctionTemplate: EnumValue<CXCursorKind>;
  /** A C++ class template. */
  ClassTemplate: EnumValue<CXCursorKind>;
  /** A C++ class template partial specialization. */
  ClassTemplatePartialSpecialization: EnumValue<CXCursorKind>;
  /** A C++ namespace alias declaration. */
  NamespaceAlias: EnumValue<CXCursorKind>;
  /** A C++ using directive. */
  UsingDirective: EnumValue<CXCursorKind>;
  /** A C++ using declaration. */
  UsingDeclaration: EnumValue<CXCursorKind>;
  /** A C++ alias declaration */
  TypeAliasDecl: EnumValue<CXCursorKind>;
  /** An Objective-C synthesize definition. */
  ObjCSynthesizeDecl: EnumValue<CXCursorKind>;
  /** An Objective-C dynamic definition. */
  ObjCDynamicDecl: EnumValue<CXCursorKind>;
  /** An access specifier. */
  CXXAccessSpecifier: EnumValue<CXCursorKind>;

  FirstDecl: EnumValue<CXCursorKind>;
  LastDecl: EnumValue<CXCursorKind>;

  /* References */
  FirstRef: EnumValue<CXCursorKind>; /* Decl references */
  ObjCSuperClassRef: EnumValue<CXCursorKind>;
  ObjCProtocolRef: EnumValue<CXCursorKind>;
  ObjCClassRef: EnumValue<CXCursorKind>;
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
  TypeRef: EnumValue<CXCursorKind>;
  CXXBaseSpecifier: EnumValue<CXCursorKind>;
  /**
   * A reference to a class template, function template, template
   * template parameter, or class template partial specialization.
   */
  TemplateRef: EnumValue<CXCursorKind>;
  /**
   * A reference to a namespace or namespace alias.
   */
  NamespaceRef: EnumValue<CXCursorKind>;
  /**
   * A reference to a member of a struct, union, or class that occurs in
   * some non-expression context, e.g., a designated initializer.
   */
  MemberRef: EnumValue<CXCursorKind>;
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
  LabelRef: EnumValue<CXCursorKind>;

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
   * The functions {@link LibClang.getNumOverloadedDecls | getNumOverloadedDecls()} and
   * {@link LibClang.getOverloadedDecl | getOverloadedDecl()} can be used to retrieve the definitions
   * referenced by this cursor.
   */
  OverloadedDeclRef: EnumValue<CXCursorKind>;

  /**
   * A reference to a variable that occurs in some non-expression
   * context, e.g., a C++ lambda capture list.
   */
  VariableRef: EnumValue<CXCursorKind>;

  LastRef: EnumValue<CXCursorKind>;

  /* Error conditions */
  FirstInvalid: EnumValue<CXCursorKind>;
  InvalidFile: EnumValue<CXCursorKind>;
  NoDeclFound: EnumValue<CXCursorKind>;
  NotImplemented: EnumValue<CXCursorKind>;
  InvalidCode: EnumValue<CXCursorKind>;
  LastInvalid: EnumValue<CXCursorKind>;

  /* Expressions */
  FirstExpr: EnumValue<CXCursorKind>;

  /**
   * An expression whose specific kind is not exposed via this
   * interface.
   *
   * Unexposed expressions have the same operations as any other kind
   * of expression; one can extract their location information,
   * spelling, children, etc. However, the specific kind of the
   * expression is not reported.
   */
  UnexposedExpr: EnumValue<CXCursorKind>;

  /**
   * An expression that refers to some value declaration, such
   * as a function, variable, or enumerator.
   */
  DeclRefExpr: EnumValue<CXCursorKind>;

  /**
   * An expression that refers to a member of a struct, union,
   * class, Objective-C class, etc.
   */
  MemberRefExpr: EnumValue<CXCursorKind>;

  /** An expression that calls a function. */
  CallExpr: EnumValue<CXCursorKind>;

  /** An expression that sends a message to an Objective-C
   object or class. */
  ObjCMessageExpr: EnumValue<CXCursorKind>;

  /** An expression that represents a block literal. */
  BlockExpr: EnumValue<CXCursorKind>;

  /** An integer literal.
   */
  IntegerLiteral: EnumValue<CXCursorKind>;

  /** A floating point number literal.
   */
  FloatingLiteral: EnumValue<CXCursorKind>;

  /** An imaginary number literal.
   */
  ImaginaryLiteral: EnumValue<CXCursorKind>;

  /** A string literal.
   */
  StringLiteral: EnumValue<CXCursorKind>;

  /** A character literal.
   */
  CharacterLiteral: EnumValue<CXCursorKind>;

  /** A parenthesized expression, e.g. "(1)".
   *
   * This AST node is only formed if full location information is requested.
   */
  ParenExpr: EnumValue<CXCursorKind>;

  /** This represents the unary-expression's (except sizeof and
   * alignof).
   */
  UnaryOperator: EnumValue<CXCursorKind>;

  /** [C99 6.5.2.1] Array Subscripting.
   */
  ArraySubscriptExpr: EnumValue<CXCursorKind>;

  /** A builtin binary operation expression such as "x + y" or
   * "x <= y".
   */
  BinaryOperator: EnumValue<CXCursorKind>;

  /** Compound assignment such as "+=".
   */
  CompoundAssignOperator: EnumValue<CXCursorKind>;

  /** The ?: ternary operator.
   */
  ConditionalOperator: EnumValue<CXCursorKind>;

  /** An explicit cast in C (C99 6.5.4) or a C-style cast in C++
   * (C++ [expr.cast]), which uses the syntax (Type)expr.
   *
   * For example: (int)f.
   */
  CStyleCastExpr: EnumValue<CXCursorKind>;

  /** [C99 6.5.2.5]
   */
  CompoundLiteralExpr: EnumValue<CXCursorKind>;

  /** Describes an C or C++ initializer list.
   */
  InitListExpr: EnumValue<CXCursorKind>;

  /** The GNU address of label extension, representing &&label.
   */
  AddrLabelExpr: EnumValue<CXCursorKind>;

  /** This is the GNU Statement Expression extension: ({int X=4; X;})
   */
  StmtExpr: EnumValue<CXCursorKind>;

  /** Represents a C11 generic selection.
   */
  GenericSelectionExpr: EnumValue<CXCursorKind>;

  /** Implements the GNU __null extension, which is a name for a null
   * pointer constant that has integral type (e.g., int or long) and is the same
   * size and alignment as a pointer.
   *
   * The __null extension is typically only used by system headers, which define
   * NULL as __null in C++ rather than using 0 (which is an integer that may not
   * match the size of a pointer).
   */
  GNUNullExpr: EnumValue<CXCursorKind>;

  /** C++'s static_cast<> expression.
   */
  CXXStaticCastExpr: EnumValue<CXCursorKind>;

  /** C++'s dynamic_cast<> expression.
   */
  CXXDynamicCastExpr: EnumValue<CXCursorKind>;

  /** C++'s reinterpret_cast<> expression.
   */
  CXXReinterpretCastExpr: EnumValue<CXCursorKind>;

  /** C++'s const_cast<> expression.
   */
  CXXConstCastExpr: EnumValue<CXCursorKind>;

  /** Represents an explicit C++ type conversion that uses "functional"
   * notion (C++ [expr.type.conv]).
   *
   * Example:
   * ```cpp
   *   x = int(0.5);
   * ```
   */
  CXXFunctionalCastExpr: EnumValue<CXCursorKind>;

  /** A C++ typeid expression (C++ [expr.typeid]).
   */
  CXXTypeidExpr: EnumValue<CXCursorKind>;

  /** [C++ 2.13.5] C++ Boolean Literal.
   */
  CXXBoolLiteralExpr: EnumValue<CXCursorKind>;

  /** [C++0x 2.14.7] C++ Pointer Literal.
   */
  CXXNullPtrLiteralExpr: EnumValue<CXCursorKind>;

  /** Represents the "this" expression in C++
   */
  CXXThisExpr: EnumValue<CXCursorKind>;

  /** [C++ 15] C++ Throw Expression.
   *
   * This handles 'throw' and 'throw' assignment-expression. When
   * assignment-expression isn't present, Op will be null.
   */
  CXXThrowExpr: EnumValue<CXCursorKind>;

  /** A new expression for memory allocation and constructor calls, e.g:
   * "new CXXNewExpr(foo)".
   */
  CXXNewExpr: EnumValue<CXCursorKind>;

  /** A delete expression for memory deallocation and destructor calls,
   * e.g. "delete[] pArray".
   */
  CXXDeleteExpr: EnumValue<CXCursorKind>;

  /** A unary expression. (noexcept, sizeof, or other traits)
   */
  UnaryExpr: EnumValue<CXCursorKind>;

  /** An Objective-C string literal i.e. @"foo".
   */
  ObjCStringLiteral: EnumValue<CXCursorKind>;

  /** An Objective-C encode expression.
   */
  ObjCEncodeExpr: EnumValue<CXCursorKind>;

  /** An Objective-C selector expression.
   */
  ObjCSelectorExpr: EnumValue<CXCursorKind>;

  /** An Objective-C protocol expression.
   */
  ObjCProtocolExpr: EnumValue<CXCursorKind>;

  /** An Objective-C "bridged" cast expression, which casts between
   * Objective-C pointers and C pointers, transferring ownership in the process.
   *
   * ```cpp
   *   NSString *str = (__bridge_transfer NSString *)CFCreateString();
   * ```
   */
  ObjCBridgedCastExpr: EnumValue<CXCursorKind>;

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
  PackExpansionExpr: EnumValue<CXCursorKind>;

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
  SizeOfPackExpr: EnumValue<CXCursorKind>;

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
  LambdaExpr: EnumValue<CXCursorKind>;

  /** Objective-c Boolean Literal.
   */
  ObjCBoolLiteralExpr: EnumValue<CXCursorKind>;

  /** Represents the "self" expression in an Objective-C method.
   */
  ObjCSelfExpr: EnumValue<CXCursorKind>;

  /** OpenMP 5.0 [2.1.5, Array Section].
   */
  OMPArraySectionExpr: EnumValue<CXCursorKind>;

  /** Represents an @available(...) check.
   */
  ObjCAvailabilityCheckExpr: EnumValue<CXCursorKind>;

  /**
   * Fixed point literal
   */
  FixedPointLiteral: EnumValue<CXCursorKind>;

  /** OpenMP 5.0 [2.1.4, Array Shaping].
   */
  OMPArrayShapingExpr: EnumValue<CXCursorKind>;

  /**
   * OpenMP 5.0 [2.1.6 Iterators]
   */
  OMPIteratorExpr: EnumValue<CXCursorKind>;

  /** OpenCL's addrspace_cast<> expression.
   */
  CXXAddrspaceCastExpr: EnumValue<CXCursorKind>;

  LastExpr: EnumValue<CXCursorKind>;

  /* Statements */
  FirstStmt: EnumValue<CXCursorKind>;
  /**
   * A statement whose specific kind is not exposed via this
   * interface.
   *
   * Unexposed statements have the same operations as any other kind of
   * statement; one can extract their location information, spelling,
   * children, etc. However, the specific kind of the statement is not
   * reported.
   */
  UnexposedStmt: EnumValue<CXCursorKind>;

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
  LabelStmt: EnumValue<CXCursorKind>;

  /** A group of statements like { stmt stmt }.
   *
   * This cursor kind is used to describe compound statements, e.g. function
   * bodies.
   */
  CompoundStmt: EnumValue<CXCursorKind>;

  /** A case statement.
   */
  CaseStmt: EnumValue<CXCursorKind>;

  /** A default statement.
   */
  DefaultStmt: EnumValue<CXCursorKind>;

  /** An if statement
   */
  IfStmt: EnumValue<CXCursorKind>;

  /** A switch statement.
   */
  SwitchStmt: EnumValue<CXCursorKind>;

  /** A while statement.
   */
  WhileStmt: EnumValue<CXCursorKind>;

  /** A do statement.
   */
  DoStmt: EnumValue<CXCursorKind>;

  /** A for statement.
   */
  ForStmt: EnumValue<CXCursorKind>;

  /** A goto statement.
   */
  GotoStmt: EnumValue<CXCursorKind>;

  /** An indirect goto statement.
   */
  IndirectGotoStmt: EnumValue<CXCursorKind>;

  /** A continue statement.
   */
  ContinueStmt: EnumValue<CXCursorKind>;

  /** A break statement.
   */
  BreakStmt: EnumValue<CXCursorKind>;

  /** A return statement.
   */
  ReturnStmt: EnumValue<CXCursorKind>;

  /** A GCC inline assembly statement extension.
   */
  GCCAsmStmt: EnumValue<CXCursorKind>;
  AsmStmt: EnumValue<CXCursorKind>;

  /** Objective-C's overall try-catch-finally statement.
   */
  ObjCAtTryStmt: EnumValue<CXCursorKind>;

  /** Objective-C's catch statement.
   */
  ObjCAtCatchStmt: EnumValue<CXCursorKind>;

  /** Objective-C's finally statement.
   */
  ObjCAtFinallyStmt: EnumValue<CXCursorKind>;

  /** Objective-C's throw statement.
   */
  ObjCAtThrowStmt: EnumValue<CXCursorKind>;

  /** Objective-C's synchronized statement.
   */
  ObjCAtSynchronizedStmt: EnumValue<CXCursorKind>;

  /** Objective-C's autorelease pool statement.
   */
  ObjCAutoreleasePoolStmt: EnumValue<CXCursorKind>;

  /** Objective-C's collection statement.
   */
  ObjCForCollectionStmt: EnumValue<CXCursorKind>;

  /** C++'s catch statement.
   */
  CXXCatchStmt: EnumValue<CXCursorKind>;

  /** C++'s try statement.
   */
  CXXTryStmt: EnumValue<CXCursorKind>;

  /** C++'s for (* : *) statement.
   */
  CXXForRangeStmt: EnumValue<CXCursorKind>;

  /** Windows Structured Exception Handling's try statement.
   */
  SEHTryStmt: EnumValue<CXCursorKind>;

  /** Windows Structured Exception Handling's except statement.
   */
  SEHExceptStmt: EnumValue<CXCursorKind>;

  /** Windows Structured Exception Handling's finally statement.
   */
  SEHFinallyStmt: EnumValue<CXCursorKind>;

  /** A MS inline assembly statement extension.
   */
  MSAsmStmt: EnumValue<CXCursorKind>;

  /** The null statement ";": C99 6.8.3p3.
   *
   * This cursor kind is used to describe the null statement.
   */
  NullStmt: EnumValue<CXCursorKind>;

  /** Adaptor class for mixing declarations with statements and
   * expressions.
   */
  DeclStmt: EnumValue<CXCursorKind>;

  /** OpenMP parallel directive.
   */
  OMPParallelDirective: EnumValue<CXCursorKind>;

  /** OpenMP SIMD directive.
   */
  OMPSimdDirective: EnumValue<CXCursorKind>;

  /** OpenMP for directive.
   */
  OMPForDirective: EnumValue<CXCursorKind>;

  /** OpenMP sections directive.
   */
  OMPSectionsDirective: EnumValue<CXCursorKind>;

  /** OpenMP section directive.
   */
  OMPSectionDirective: EnumValue<CXCursorKind>;

  /** OpenMP single directive.
   */
  OMPSingleDirective: EnumValue<CXCursorKind>;

  /** OpenMP parallel for directive.
   */
  OMPParallelForDirective: EnumValue<CXCursorKind>;

  /** OpenMP parallel sections directive.
   */
  OMPParallelSectionsDirective: EnumValue<CXCursorKind>;

  /** OpenMP task directive.
   */
  OMPTaskDirective: EnumValue<CXCursorKind>;

  /** OpenMP master directive.
   */
  OMPMasterDirective: EnumValue<CXCursorKind>;

  /** OpenMP critical directive.
   */
  OMPCriticalDirective: EnumValue<CXCursorKind>;

  /** OpenMP taskyield directive.
   */
  OMPTaskyieldDirective: EnumValue<CXCursorKind>;

  /** OpenMP barrier directive.
   */
  OMPBarrierDirective: EnumValue<CXCursorKind>;

  /** OpenMP taskwait directive.
   */
  OMPTaskwaitDirective: EnumValue<CXCursorKind>;

  /** OpenMP flush directive.
   */
  OMPFlushDirective: EnumValue<CXCursorKind>;

  /** Windows Structured Exception Handling's leave statement.
   */
  SEHLeaveStmt: EnumValue<CXCursorKind>;

  /** OpenMP ordered directive.
   */
  OMPOrderedDirective: EnumValue<CXCursorKind>;

  /** OpenMP atomic directive.
   */
  OMPAtomicDirective: EnumValue<CXCursorKind>;

  /** OpenMP for SIMD directive.
   */
  OMPForSimdDirective: EnumValue<CXCursorKind>;

  /** OpenMP parallel for SIMD directive.
   */
  OMPParallelForSimdDirective: EnumValue<CXCursorKind>;

  /** OpenMP target directive.
   */
  OMPTargetDirective: EnumValue<CXCursorKind>;

  /** OpenMP teams directive.
   */
  OMPTeamsDirective: EnumValue<CXCursorKind>;

  /** OpenMP taskgroup directive.
   */
  OMPTaskgroupDirective: EnumValue<CXCursorKind>;

  /** OpenMP cancellation point directive.
   */
  OMPCancellationPointDirective: EnumValue<CXCursorKind>;

  /** OpenMP cancel directive.
   */
  OMPCancelDirective: EnumValue<CXCursorKind>;

  /** OpenMP target data directive.
   */
  OMPTargetDataDirective: EnumValue<CXCursorKind>;

  /** OpenMP taskloop directive.
   */
  OMPTaskLoopDirective: EnumValue<CXCursorKind>;

  /** OpenMP taskloop simd directive.
   */
  OMPTaskLoopSimdDirective: EnumValue<CXCursorKind>;

  /** OpenMP distribute directive.
   */
  OMPDistributeDirective: EnumValue<CXCursorKind>;

  /** OpenMP target enter data directive.
   */
  OMPTargetEnterDataDirective: EnumValue<CXCursorKind>;

  /** OpenMP target exit data directive.
   */
  OMPTargetExitDataDirective: EnumValue<CXCursorKind>;

  /** OpenMP target parallel directive.
   */
  OMPTargetParallelDirective: EnumValue<CXCursorKind>;

  /** OpenMP target parallel for directive.
   */
  OMPTargetParallelForDirective: EnumValue<CXCursorKind>;

  /** OpenMP target update directive.
   */
  OMPTargetUpdateDirective: EnumValue<CXCursorKind>;

  /** OpenMP distribute parallel for directive.
   */
  OMPDistributeParallelForDirective: EnumValue<CXCursorKind>;

  /** OpenMP distribute parallel for simd directive.
   */
  OMPDistributeParallelForSimdDirective: EnumValue<CXCursorKind>;

  /** OpenMP distribute simd directive.
   */
  OMPDistributeSimdDirective: EnumValue<CXCursorKind>;

  /** OpenMP target parallel for simd directive.
   */
  OMPTargetParallelForSimdDirective: EnumValue<CXCursorKind>;

  /** OpenMP target simd directive.
   */
  OMPTargetSimdDirective: EnumValue<CXCursorKind>;

  /** OpenMP teams distribute directive.
   */
  OMPTeamsDistributeDirective: EnumValue<CXCursorKind>;

  /** OpenMP teams distribute simd directive.
   */
  OMPTeamsDistributeSimdDirective: EnumValue<CXCursorKind>;

  /** OpenMP teams distribute parallel for simd directive.
   */
  OMPTeamsDistributeParallelForSimdDirective: EnumValue<CXCursorKind>;

  /** OpenMP teams distribute parallel for directive.
   */
  OMPTeamsDistributeParallelForDirective: EnumValue<CXCursorKind>;

  /** OpenMP target teams directive.
   */
  OMPTargetTeamsDirective: EnumValue<CXCursorKind>;

  /** OpenMP target teams distribute directive.
   */
  OMPTargetTeamsDistributeDirective: EnumValue<CXCursorKind>;

  /** OpenMP target teams distribute parallel for directive.
   */
  OMPTargetTeamsDistributeParallelForDirective: EnumValue<CXCursorKind>;

  /** OpenMP target teams distribute parallel for simd directive.
   */
  OMPTargetTeamsDistributeParallelForSimdDirective: EnumValue<CXCursorKind>;

  /** OpenMP target teams distribute simd directive.
   */
  OMPTargetTeamsDistributeSimdDirective: EnumValue<CXCursorKind>;

  /** C++2a std::bit_cast expression.
   */
  BuiltinBitCastExpr: EnumValue<CXCursorKind>;

  /** OpenMP master taskloop directive.
   */
  OMPMasterTaskLoopDirective: EnumValue<CXCursorKind>;

  /** OpenMP parallel master taskloop directive.
   */
  OMPParallelMasterTaskLoopDirective: EnumValue<CXCursorKind>;

  /** OpenMP master taskloop simd directive.
   */
  OMPMasterTaskLoopSimdDirective: EnumValue<CXCursorKind>;

  /** OpenMP parallel master taskloop simd directive.
   */
  OMPParallelMasterTaskLoopSimdDirective: EnumValue<CXCursorKind>;

  /** OpenMP parallel master directive.
   */
  OMPParallelMasterDirective: EnumValue<CXCursorKind>;

  /** OpenMP depobj directive.
   */
  OMPDepobjDirective: EnumValue<CXCursorKind>;

  /** OpenMP scan directive.
   */
  OMPScanDirective: EnumValue<CXCursorKind>;

  /** OpenMP tile directive.
   */
  OMPTileDirective: EnumValue<CXCursorKind>;

  /** OpenMP canoniCXCursorcal loop.
   */
  OMPCanonicalLoop: EnumValue<CXCursorKind>;

  /** OpenMP interop directive.
   */
  OMPInteropDirective: EnumValue<CXCursorKind>;

  /** OpenMP dispatch directive.
   */
  OMPDispatchDirective: EnumValue<CXCursorKind>;

  /** OpenMP masked directive.
   */
  OMPMaskedDirective: EnumValue<CXCursorKind>;

  /** OpenMP unroll directive.
   */
  OMPUnrollDirective: EnumValue<CXCursorKind>;

  /** OpenMP metadirective directive.
   */
  OMPMetaDirective: EnumValue<CXCursorKind>;

  /** OpenMP loop directive.
   */
  OMPGenericLoopDirective: EnumValue<CXCursorKind>;

  LastStmt: EnumValue<CXCursorKind>;

  /**
   * Cursor that represents the translation unit itself.
   *
   * The translation unit cursor exists primarily to act as the root
   * cursor for traversing the contents of a translation unit.
   */
  TranslationUnit: EnumValue<CXCursorKind>;

  /* Attributes */
  FirstAttr: EnumValue<CXCursorKind>;
  /**
   * An attribute whose specific kind is not exposed via this
   * interface.
   */
  UnexposedAttr: EnumValue<CXCursorKind>;

  IBActionAttr: EnumValue<CXCursorKind>;
  IBOutletAttr: EnumValue<CXCursorKind>;
  IBOutletCollectionAttr: EnumValue<CXCursorKind>;
  CXXFinalAttr: EnumValue<CXCursorKind>;
  CXXOverrideAttr: EnumValue<CXCursorKind>;
  AnnotateAttr: EnumValue<CXCursorKind>;
  AsmLabelAttr: EnumValue<CXCursorKind>;
  PackedAttr: EnumValue<CXCursorKind>;
  PureAttr: EnumValue<CXCursorKind>;
  ConstAttr: EnumValue<CXCursorKind>;
  NoDuplicateAttr: EnumValue<CXCursorKind>;
  CUDAConstantAttr: EnumValue<CXCursorKind>;
  CUDADeviceAttr: EnumValue<CXCursorKind>;
  CUDAGlobalAttr: EnumValue<CXCursorKind>;
  CUDAHostAttr: EnumValue<CXCursorKind>;
  CUDASharedAttr: EnumValue<CXCursorKind>;
  VisibilityAttr: EnumValue<CXCursorKind>;
  DLLExport: EnumValue<CXCursorKind>;
  DLLImport: EnumValue<CXCursorKind>;
  NSReturnsRetained: EnumValue<CXCursorKind>;
  NSReturnsNotRetained: EnumValue<CXCursorKind>;
  NSReturnsAutoreleased: EnumValue<CXCursorKind>;
  NSConsumesSelf: EnumValue<CXCursorKind>;
  NSConsumed: EnumValue<CXCursorKind>;
  ObjCException: EnumValue<CXCursorKind>;
  ObjCNSObject: EnumValue<CXCursorKind>;
  ObjCIndependentClass: EnumValue<CXCursorKind>;
  ObjCPreciseLifetime: EnumValue<CXCursorKind>;
  ObjCReturnsInnerPointer: EnumValue<CXCursorKind>;
  ObjCRequiresSuper: EnumValue<CXCursorKind>;
  ObjCRootClass: EnumValue<CXCursorKind>;
  ObjCSubclassingRestricted: EnumValue<CXCursorKind>;
  ObjCExplicitProtocolImpl: EnumValue<CXCursorKind>;
  ObjCDesignatedInitializer: EnumValue<CXCursorKind>;
  ObjCRuntimeVisible: EnumValue<CXCursorKind>;
  ObjCBoxable: EnumValue<CXCursorKind>;
  FlagEnum: EnumValue<CXCursorKind>;
  ConvergentAttr: EnumValue<CXCursorKind>;
  WarnUnusedAttr: EnumValue<CXCursorKind>;
  WarnUnusedResultAttr: EnumValue<CXCursorKind>;
  AlignedAttr: EnumValue<CXCursorKind>;
  LastAttr: EnumValue<CXCursorKind>;

  /* Preprocessing */
  PreprocessingDirective: EnumValue<CXCursorKind>;
  MacroDefinition: EnumValue<CXCursorKind>;
  MacroExpansion: EnumValue<CXCursorKind>;
  MacroInstantiation: EnumValue<CXCursorKind>;
  InclusionDirective: EnumValue<CXCursorKind>;
  FirstPreprocessing: EnumValue<CXCursorKind>;
  LastPreprocessing: EnumValue<CXCursorKind>;

  /* Extra Declarations */
  /**
   * A module import declaration.
   */
  ModuleImportDecl: EnumValue<CXCursorKind>;
  TypeAliasTemplateDecl: EnumValue<CXCursorKind>;
  /**
   * A static_assert or _Static_assert node
   */
  StaticAssert: EnumValue<CXCursorKind>;
  /**
   * a friend declaration.
   */
  FriendDecl: EnumValue<CXCursorKind>;
  FirstExtraDecl: EnumValue<CXCursorKind>;
  LastExtraDecl: EnumValue<CXCursorKind>;

  /**
   * A code completion overload candidate.
   */
  OverloadCandidate: EnumValue<CXCursorKind>;
};

export type CXDiagnosticSeverity = {
  /**
   * A diagnostic that has been suppressed, e.g., by a command-line
   * option.
   */
  Ignored: EnumValue<CXDiagnosticSeverity>;

  /**
   * This diagnostic is a note that should be attached to the
   * previous (non-note) diagnostic.
   */
  Note: EnumValue<CXDiagnosticSeverity>;

  /**
   * This diagnostic indicates suspicious code that may not be
   * wrong.
   */
  Warning: EnumValue<CXDiagnosticSeverity>;

  /**
   * This diagnostic indicates that the code is ill-formed.
   */
  Error: EnumValue<CXDiagnosticSeverity>;

  /**
   * This diagnostic indicates that the code is ill-formed such
   * that future parser recovery is unlikely to produce useful
   * results.
   */
  Fatal: EnumValue<CXDiagnosticSeverity>;
};

export type CXLoadDiag_Error = {
  /**
   * Indicates that no error occurred.
   */
  None: EnumValue<CXLoadDiag_Error>;

  /**
   * Indicates that an unknown error occurred while attempting to
   * deserialize diagnostics.
   */
  Unknown: EnumValue<CXLoadDiag_Error>;

  /**
   * Indicates that the file containing the serialized diagnostics
   * could not be opened.
   */
  CannotLoad: EnumValue<CXLoadDiag_Error>;

  /**
   * Indicates that the serialized diagnostics file is invalid or
   * corrupt.
   */
  InvalidFile: EnumValue<CXLoadDiag_Error>;
};

export type CXTranslationUnit_Flags = {
  /**
   * Used to indicate that no special translation-unit options are
   * needed.
   */
  None: EnumValue<CXTranslationUnit_Flags>;

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
  DetailedPreprocessingRecord: EnumValue<CXTranslationUnit_Flags>;

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
  Incomplete: EnumValue<CXTranslationUnit_Flags>;

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
   * reparseTranslationUnit() will re-use the implicit
   * precompiled header to improve parsing performance.
   */
  PrecompiledPreamble: EnumValue<CXTranslationUnit_Flags>;

  /**
   * Used to indicate that the translation unit should cache some
   * code-completion results with each reparse of the source file.
   *
   * Caching of code-completion results is a performance optimization that
   * introduces some overhead to reparsing but improves the performance of
   * code-completion operations.
   */
  CacheCompletionResults: EnumValue<CXTranslationUnit_Flags>;

  /**
   * Used to indicate that the translation unit will be serialized with
   * \c saveTranslationUnit.
   *
   * This option is typically used when parsing a header with the intent of
   * producing a precompiled header.
   */
  ForSerialization: EnumValue<CXTranslationUnit_Flags>;

  /**
   * DEPRECATED: Enabled chained precompiled preambles in C++.
   *
   * Note: this is a *temporary* option that is available only while
   * we are testing C++ precompiled preamble support. It is deprecated.
   */
  CXXChainedPCH: EnumValue<CXTranslationUnit_Flags>;

  /**
   * Used to indicate that function/method bodies should be skipped while
   * parsing.
   *
   * This option can be used to search for declarations/definitions while
   * ignoring the usages.
   */
  SkipFunctionBodies: EnumValue<CXTranslationUnit_Flags>;

  /**
   * Used to indicate that brief documentation comments should be
   * included into the set of code completions returned from this translation
   * unit.
   */
  IncludeBriefCommentsInCodeCompletion: EnumValue<CXTranslationUnit_Flags>;

  /**
   * Used to indicate that the precompiled preamble should be created on
   * the first parse. Otherwise it will be created on the first reparse. This
   * trades runtime on the first parse (serializing the preamble takes time) for
   * reduced runtime on the second parse (can now reuse the preamble).
   */
  CreatePreambleOnFirstParse: EnumValue<CXTranslationUnit_Flags>;

  /**
   * Do not stop processing when fatal errors are encountered.
   *
   * When fatal errors are encountered while parsing a translation unit,
   * semantic analysis is typically stopped early when compiling code. A common
   * source for fatal errors are unresolvable include files. For the
   * purposes of an IDE, this is undesirable behavior and as much information
   * as possible should be reported. Use this flag to enable this behavior.
   */
  KeepGoing: EnumValue<CXTranslationUnit_Flags>;

  /**
   * Sets the preprocessor in a mode for parsing a single file only.
   */
  SingleFileParse: EnumValue<CXTranslationUnit_Flags>;

  /**
   * Used in combination with SkipFunctionBodies to
   * constrain the skipping of function bodies to the preamble.
   *
   * The function bodies of the main file are not skipped.
   */
  LimitSkipFunctionBodiesToPreamble: EnumValue<CXTranslationUnit_Flags>;

  /**
   * Used to indicate that attributed types should be included in CXType.
   */
  IncludeAttributedTypes: EnumValue<CXTranslationUnit_Flags>;

  /**
   * Used to indicate that implicit attributes should be visited.
   */
  VisitImplicitAttributes: EnumValue<CXTranslationUnit_Flags>;

  /**
   * Used to indicate that non-errors from included files should be ignored.
   *
   * If set, getDiagnosticSetFromTU() will not report e.g. warnings from
   * included files anymore. This speeds up getDiagnosticSetFromTU() for
   * the case where these warnings are not of interest, as for an IDE for
   * example, which typically shows only the diagnostics in the main file.
   */
  IgnoreNonErrorsFromIncludedFiles: EnumValue<CXTranslationUnit_Flags>;

  /**
   * Tells the preprocessor not to skip excluded conditional blocks.
   */
  RetainExcludedConditionalBlocks: EnumValue<CXTranslationUnit_Flags>;
};

export type CXSaveTranslationUnit_Flags = {
  /**
   * Used to indicate that no special saving options are needed.
   */
  None: EnumValue<CXSaveTranslationUnit_Flags>;
};

export type CXSaveError = {
  /**
   * Indicates that no error occurred while saving a translation unit.
   */
  None: EnumValue<CXSaveError>;

  /**
   * Indicates that an unknown error occurred while attempting to save
   * the file.
   *
   * This error typically indicates that file I/O failed when attempting to
   * write the file.
   */
  Unknown: EnumValue<CXSaveError>;

  /**
   * Indicates that errors during translation prevented this attempt
   * to save the translation unit.
   *
   * Errors that prevent the translation unit from being saved can be
   * extracted using {@link LibClang.getNumDiagnostics | getNumDiagnostics()} and {@link LibClang.getNumDiagnostics | getNumDiagnostics()}.
   */
  TranslationErrors: EnumValue<CXSaveError>;

  /**
   * Indicates that the translation unit to be saved was somehow
   * invalid (e.g., NULL).
   */
  InvalidTU: EnumValue<CXSaveError>;
};

export type CXReparse_Flags = {
  /**
   * Used to indicate that no special reparsing options are needed.
   */
  None: EnumValue<CXReparse_Flags>;
};

export type CXTUResourceUsageKind = {
  AST: EnumValue<CXTUResourceUsageKind>;
  Identifiers: EnumValue<CXTUResourceUsageKind>;
  Selectors: EnumValue<CXTUResourceUsageKind>;
  GlobalCompletionResults: EnumValue<CXTUResourceUsageKind>;
  SourceManagerContentCache: EnumValue<CXTUResourceUsageKind>;
  AST_SideTables: EnumValue<CXTUResourceUsageKind>;
  SourceManager_Membuffer_Malloc: EnumValue<CXTUResourceUsageKind>;
  SourceManager_Membuffer_MMap: EnumValue<CXTUResourceUsageKind>;
  ExternalASTSource_Membuffer_Malloc: EnumValue<CXTUResourceUsageKind>;
  ExternalASTSource_Membuffer_MMap: EnumValue<CXTUResourceUsageKind>;
  Preprocessor: EnumValue<CXTUResourceUsageKind>;
  PreprocessingRecord: EnumValue<CXTUResourceUsageKind>;
  SourceManager_DataStructures: EnumValue<CXTUResourceUsageKind>;
  Preprocessor_HeaderSearch: EnumValue<CXTUResourceUsageKind>;
  MEMORY_IN_BYTES_BEGIN: EnumValue<CXTUResourceUsageKind>;
  MEMORY_IN_BYTES_END: EnumValue<CXTUResourceUsageKind>;
  First: EnumValue<CXTUResourceUsageKind>;
  Last: EnumValue<CXTUResourceUsageKind>;
};

export type CXLinkageKind = {
  /** This value indicates that no linkage information is available
   * for a provided CXCursor. */
  Invalid: EnumValue<CXLinkageKind>;
  /**
   * This is the linkage for variables, parameters, and so on that
   *  have automatic storage.  This covers normal (non-extern) local variables.
   */
  NoLinkage: EnumValue<CXLinkageKind>;
  /** This is the linkage for static variables and static functions. */
  Internal: EnumValue<CXLinkageKind>;
  /** This is the linkage for entities with external linkage that live
   * in C++ anonymous namespaces.*/
  UniqueExternal: EnumValue<CXLinkageKind>;
  /** This is the linkage for entities with true, external linkage. */
  External: EnumValue<CXLinkageKind>;
};

export type CXVisibilityKind = {
  /** This value indicates that no visibility information is available
   * for a provided CXCursor. */
  Invalid: EnumValue<CXVisibilityKind>;

  /** Symbol not seen by the linker. */
  Hidden: EnumValue<CXVisibilityKind>;
  /** Symbol seen by the linker but resolves to a symbol inside this object. */
  Protected: EnumValue<CXVisibilityKind>;
  /** Symbol seen by the linker and acts like a normal symbol. */
  Default: EnumValue<CXVisibilityKind>;
};

export type CXAvailabilityKind = {
  /**
   * The entity is available.
   */
  Available: EnumValue<CXAvailabilityKind>;
  /**
   * The entity is available, but has been deprecated (and its use is
   * not recommended).
   */
  Deprecated: EnumValue<CXAvailabilityKind>;
  /**
   * The entity is not available; any use of it will be an error.
   */
  NotAvailable: EnumValue<CXAvailabilityKind>;
  /**
   * The entity is available, but not accessible; any use of it will be
   * an error.
   */
  NotAccessible: EnumValue<CXAvailabilityKind>;
};

export type CXLanguageKind = {
  Invalid: EnumValue<CXLanguageKind>;
  C: EnumValue<CXLanguageKind>;
  ObjC: EnumValue<CXLanguageKind>;
  CPlusPlus: EnumValue<CXLanguageKind>;
};

export type CXTLSKind = {
  None: EnumValue<CXTLSKind>;
  Dynamic: EnumValue<CXTLSKind>;
  Static: EnumValue<CXTLSKind>;
};

export type CXTypeKind = {
  /**
   * Represents an invalid type (e.g., where no type is available).
   */
  Invalid: EnumValue<CXTypeKind>;

  /**
   * A type whose specific kind is not exposed via this
   * interface.
   */
  Unexposed: EnumValue<CXTypeKind>;

  /* Builtin types */
  Void: EnumValue<CXTypeKind>;
  Bool: EnumValue<CXTypeKind>;
  Char_U: EnumValue<CXTypeKind>;
  UChar: EnumValue<CXTypeKind>;
  Char16: EnumValue<CXTypeKind>;
  Char32: EnumValue<CXTypeKind>;
  UShort: EnumValue<CXTypeKind>;
  UInt: EnumValue<CXTypeKind>;
  ULong: EnumValue<CXTypeKind>;
  ULongLong: EnumValue<CXTypeKind>;
  UInt128: EnumValue<CXTypeKind>;
  Char_S: EnumValue<CXTypeKind>;
  SChar: EnumValue<CXTypeKind>;
  WChar: EnumValue<CXTypeKind>;
  Short: EnumValue<CXTypeKind>;
  Int: EnumValue<CXTypeKind>;
  Long: EnumValue<CXTypeKind>;
  LongLong: EnumValue<CXTypeKind>;
  Int128: EnumValue<CXTypeKind>;
  Float: EnumValue<CXTypeKind>;
  Double: EnumValue<CXTypeKind>;
  LongDouble: EnumValue<CXTypeKind>;
  NullPtr: EnumValue<CXTypeKind>;
  Overload: EnumValue<CXTypeKind>;
  Dependent: EnumValue<CXTypeKind>;
  ObjCId: EnumValue<CXTypeKind>;
  ObjCClass: EnumValue<CXTypeKind>;
  ObjCSel: EnumValue<CXTypeKind>;
  Float128: EnumValue<CXTypeKind>;
  Half: EnumValue<CXTypeKind>;
  Float16: EnumValue<CXTypeKind>;
  ShortAccum: EnumValue<CXTypeKind>;
  Accum: EnumValue<CXTypeKind>;
  LongAccum: EnumValue<CXTypeKind>;
  UShortAccum: EnumValue<CXTypeKind>;
  UAccum: EnumValue<CXTypeKind>;
  ULongAccum: EnumValue<CXTypeKind>;
  BFloat16: EnumValue<CXTypeKind>;
  Ibm128: EnumValue<CXTypeKind>;
  FirstBuiltin: EnumValue<CXTypeKind>;
  LastBuiltin: EnumValue<CXTypeKind>;

  Complex: EnumValue<CXTypeKind>;
  Pointer: EnumValue<CXTypeKind>;
  BlockPointer: EnumValue<CXTypeKind>;
  LValueReference: EnumValue<CXTypeKind>;
  RValueReference: EnumValue<CXTypeKind>;
  Record: EnumValue<CXTypeKind>;
  Enum: EnumValue<CXTypeKind>;
  Typedef: EnumValue<CXTypeKind>;
  ObjCInterface: EnumValue<CXTypeKind>;
  ObjCObjectPointer: EnumValue<CXTypeKind>;
  FunctionNoProto: EnumValue<CXTypeKind>;
  FunctionProto: EnumValue<CXTypeKind>;
  ConstantArray: EnumValue<CXTypeKind>;
  Vector: EnumValue<CXTypeKind>;
  IncompleteArray: EnumValue<CXTypeKind>;
  VariableArray: EnumValue<CXTypeKind>;
  DependentSizedArray: EnumValue<CXTypeKind>;
  MemberPointer: EnumValue<CXTypeKind>;
  Auto: EnumValue<CXTypeKind>;

  /**
   * Represents a type that was referred to using an elaborated type keyword.
   *
   * E.g., struct S, or via a qualified name, e.g., N::M::type, or both.
   */
  Elaborated: EnumValue<CXTypeKind>;

  /* OpenCL PipeType. */
  Pipe: EnumValue<CXTypeKind>;

  /* OpenCL builtin types. */
  OCLImage1dRO: EnumValue<CXTypeKind>;
  OCLImage1dArrayRO: EnumValue<CXTypeKind>;
  OCLImage1dBufferRO: EnumValue<CXTypeKind>;
  OCLImage2dRO: EnumValue<CXTypeKind>;
  OCLImage2dArrayRO: EnumValue<CXTypeKind>;
  OCLImage2dDepthRO: EnumValue<CXTypeKind>;
  OCLImage2dArrayDepthRO: EnumValue<CXTypeKind>;
  OCLImage2dMSAARO: EnumValue<CXTypeKind>;
  OCLImage2dArrayMSAARO: EnumValue<CXTypeKind>;
  OCLImage2dMSAADepthRO: EnumValue<CXTypeKind>;
  OCLImage2dArrayMSAADepthRO: EnumValue<CXTypeKind>;
  OCLImage3dRO: EnumValue<CXTypeKind>;
  OCLImage1dWO: EnumValue<CXTypeKind>;
  OCLImage1dArrayWO: EnumValue<CXTypeKind>;
  OCLImage1dBufferWO: EnumValue<CXTypeKind>;
  OCLImage2dWO: EnumValue<CXTypeKind>;
  OCLImage2dArrayWO: EnumValue<CXTypeKind>;
  OCLImage2dDepthWO: EnumValue<CXTypeKind>;
  OCLImage2dArrayDepthWO: EnumValue<CXTypeKind>;
  OCLImage2dMSAAWO: EnumValue<CXTypeKind>;
  OCLImage2dArrayMSAAWO: EnumValue<CXTypeKind>;
  OCLImage2dMSAADepthWO: EnumValue<CXTypeKind>;
  OCLImage2dArrayMSAADepthWO: EnumValue<CXTypeKind>;
  OCLImage3dWO: EnumValue<CXTypeKind>;
  OCLImage1dRW: EnumValue<CXTypeKind>;
  OCLImage1dArrayRW: EnumValue<CXTypeKind>;
  OCLImage1dBufferRW: EnumValue<CXTypeKind>;
  OCLImage2dRW: EnumValue<CXTypeKind>;
  OCLImage2dArrayRW: EnumValue<CXTypeKind>;
  OCLImage2dDepthRW: EnumValue<CXTypeKind>;
  OCLImage2dArrayDepthRW: EnumValue<CXTypeKind>;
  OCLImage2dMSAARW: EnumValue<CXTypeKind>;
  OCLImage2dArrayMSAARW: EnumValue<CXTypeKind>;
  OCLImage2dMSAADepthRW: EnumValue<CXTypeKind>;
  OCLImage2dArrayMSAADepthRW: EnumValue<CXTypeKind>;
  OCLImage3dRW: EnumValue<CXTypeKind>;
  OCLSampler: EnumValue<CXTypeKind>;
  OCLEvent: EnumValue<CXTypeKind>;
  OCLQueue: EnumValue<CXTypeKind>;
  OCLReserveID: EnumValue<CXTypeKind>;

  ObjCObject: EnumValue<CXTypeKind>;
  ObjCTypeParam: EnumValue<CXTypeKind>;
  Attributed: EnumValue<CXTypeKind>;

  OCLIntelSubgroupAVCMcePayload: EnumValue<CXTypeKind>;
  OCLIntelSubgroupAVCImePayload: EnumValue<CXTypeKind>;
  OCLIntelSubgroupAVCRefPayload: EnumValue<CXTypeKind>;
  OCLIntelSubgroupAVCSicPayload: EnumValue<CXTypeKind>;
  OCLIntelSubgroupAVCMceResult: EnumValue<CXTypeKind>;
  OCLIntelSubgroupAVCImeResult: EnumValue<CXTypeKind>;
  OCLIntelSubgroupAVCRefResult: EnumValue<CXTypeKind>;
  OCLIntelSubgroupAVCSicResult: EnumValue<CXTypeKind>;
  OCLIntelSubgroupAVCImeResultSingleRefStreamout: EnumValue<CXTypeKind>;
  OCLIntelSubgroupAVCImeResultDualRefStreamout: EnumValue<CXTypeKind>;
  OCLIntelSubgroupAVCImeSingleRefStreamin: EnumValue<CXTypeKind>;

  OCLIntelSubgroupAVCImeDualRefStreamin: EnumValue<CXTypeKind>;

  ExtVector: EnumValue<CXTypeKind>;
  Atomic: EnumValue<CXTypeKind>;
};

export type CXCallingConv = {
  Default: EnumValue<CXTypeKind>;
  C: EnumValue<CXTypeKind>;
  X86StdCall: EnumValue<CXTypeKind>;
  X86FastCall: EnumValue<CXTypeKind>;
  X86ThisCall: EnumValue<CXTypeKind>;
  X86Pascal: EnumValue<CXTypeKind>;
  AAPCS: EnumValue<CXTypeKind>;
  AAPCS_VFP: EnumValue<CXTypeKind>;
  X86RegCall: EnumValue<CXTypeKind>;
  IntelOclBicc: EnumValue<CXTypeKind>;
  Win64: EnumValue<CXTypeKind>;
  /* Alias for compatibility with older versions of API. */
  X86_64Win64: EnumValue<CXTypeKind>;
  X86_64SysV: EnumValue<CXTypeKind>;
  X86VectorCall: EnumValue<CXTypeKind>;
  Swift: EnumValue<CXTypeKind>;
  PreserveMost: EnumValue<CXTypeKind>;
  PreserveAll: EnumValue<CXTypeKind>;
  AArch64VectorCall: EnumValue<CXTypeKind>;
  SwiftAsync: EnumValue<CXTypeKind>;

  Invalid: EnumValue<CXTypeKind>;
  Unexposed: EnumValue<CXTypeKind>;
};

export type CXTemplateArgumentKind = {
  Null: EnumValue<CXTemplateArgumentKind>;
  Type: EnumValue<CXTemplateArgumentKind>;
  Declaration: EnumValue<CXTemplateArgumentKind>;
  NullPtr: EnumValue<CXTemplateArgumentKind>;
  Integral: EnumValue<CXTemplateArgumentKind>;
  Template: EnumValue<CXTemplateArgumentKind>;
  TemplateExpansion: EnumValue<CXTemplateArgumentKind>;
  Expression: EnumValue<CXTemplateArgumentKind>;
  Pack: EnumValue<CXTemplateArgumentKind>;
  /* Indicates an error case, preventing the kind from being deduced. */
  Invalid: EnumValue<CXTemplateArgumentKind>;
};

export type CXTypeNullabilityKind = {
  /**
   * Values of this type can never be null.
   */
  NonNull: EnumValue<CXTypeNullabilityKind>;
  /**
   * Values of this type can be null.
   */
  Nullable: EnumValue<CXTypeNullabilityKind>;
  /**
   * Whether values of this type can be null is (explicitly)
   * unspecified. This captures a (fairly rare) case where we
   * can't conclude anything about the nullability of the type even
   * though it has been considered.
   */
  Unspecified: EnumValue<CXTypeNullabilityKind>;
  /**
   * Nullability is not applicable to this type.
   */
  Invalid: EnumValue<CXTypeNullabilityKind>;

  /**
   * Generally behaves like Nullable, except when used in a block parameter that
   * was imported into a swift async method. There, swift will assume that the
   * parameter can get null even if no error occured. _Nullable parameters are
   * assumed to only get null on error.
   */
  NullableResult: EnumValue<CXTypeNullabilityKind>;
};

export type CXTypeLayoutError = {
  /**
   * Type is of kind CXType_Invalid.
   */
  Invalid: EnumValue<CXTypeLayoutError>;
  /**
   * The type is an incomplete Type.
   */
  Incomplete: EnumValue<CXTypeLayoutError>;
  /**
   * The type is a dependent Type.
   */
  Dependent: EnumValue<CXTypeLayoutError>;
  /**
   * The type is not a constant size type.
   */
  NotConstantSize: EnumValue<CXTypeLayoutError>;
  /**
   * The Field name is not valid for this record.
   */
  InvalidFieldName: EnumValue<CXTypeLayoutError>;
  /**
   * The type is undeduced.
   */
  Undeduced: EnumValue<CXTypeLayoutError>;
};

export type CXRefQualifierKind = {
  /** No ref-qualifier was provided. */
  None: EnumValue<CXRefQualifierKind>;
  /** An lvalue ref-qualifier was provided (\c &). */
  LValue: EnumValue<CXRefQualifierKind>;
  /** An rvalue ref-qualifier was provided (\c &&). */
  RValue: EnumValue<CXRefQualifierKind>;
};

export type CX_CXXAccessSpecifier = {
  InvalidAccessSpecifier: EnumValue<CX_CXXAccessSpecifier>;
  Public: EnumValue<CX_CXXAccessSpecifier>;
  Protected: EnumValue<CX_CXXAccessSpecifier>;
  Private: EnumValue<CX_CXXAccessSpecifier>;
};

export type CX_StorageClass = {
  Invalid: EnumValue<CX_StorageClass>;
  None: EnumValue<CX_StorageClass>;
  Extern: EnumValue<CX_StorageClass>;
  Static: EnumValue<CX_StorageClass>;
  PrivateExtern: EnumValue<CX_StorageClass>;
  OpenCLWorkGroupLocal: EnumValue<CX_StorageClass>;
  Auto: EnumValue<CX_StorageClass>;
  Register: EnumValue<CX_StorageClass>;
};

export type CXPrintingPolicyProperty = {
  Indentation: EnumValue<CXPrintingPolicyProperty>;
  SuppressSpecifiers: EnumValue<CXPrintingPolicyProperty>;
  SuppressTagKeyword: EnumValue<CXPrintingPolicyProperty>;
  IncludeTagDefinition: EnumValue<CXPrintingPolicyProperty>;
  SuppressScope: EnumValue<CXPrintingPolicyProperty>;
  SuppressUnwrittenScope: EnumValue<CXPrintingPolicyProperty>;
  SuppressInitializers: EnumValue<CXPrintingPolicyProperty>;
  ConstantArraySizeAsWritten: EnumValue<CXPrintingPolicyProperty>;
  AnonymousTagLocations: EnumValue<CXPrintingPolicyProperty>;
  SuppressStrongLifetime: EnumValue<CXPrintingPolicyProperty>;
  SuppressLifetimeQualifiers: EnumValue<CXPrintingPolicyProperty>;
  SuppressTemplateArgsInCXXConstructors: EnumValue<CXPrintingPolicyProperty>;
  Bool: EnumValue<CXPrintingPolicyProperty>;
  Restrict: EnumValue<CXPrintingPolicyProperty>;
  Alignof: EnumValue<CXPrintingPolicyProperty>;
  UnderscoreAlignof: EnumValue<CXPrintingPolicyProperty>;
  UseVoidForZeroParams: EnumValue<CXPrintingPolicyProperty>;
  TerseOutput: EnumValue<CXPrintingPolicyProperty>;
  PolishForDeclaration: EnumValue<CXPrintingPolicyProperty>;
  Half: EnumValue<CXPrintingPolicyProperty>;
  MSWChar: EnumValue<CXPrintingPolicyProperty>;
  IncludeNewlines: EnumValue<CXPrintingPolicyProperty>;
  MSVCFormatting: EnumValue<CXPrintingPolicyProperty>;
  ConstantsAsWritten: EnumValue<CXPrintingPolicyProperty>;
  SuppressImplicitBase: EnumValue<CXPrintingPolicyProperty>;
  FullyQualifiedName: EnumValue<CXPrintingPolicyProperty>;
  LastProperty: EnumValue<CXPrintingPolicyProperty>;
};

export type CXObjCPropertyAttrKind = {
  noattr: EnumValue<CXObjCPropertyAttrKind>;
  readonly: EnumValue<CXObjCPropertyAttrKind>;
  getter: EnumValue<CXObjCPropertyAttrKind>;
  assign: EnumValue<CXObjCPropertyAttrKind>;
  readwrite: EnumValue<CXObjCPropertyAttrKind>;
  retain: EnumValue<CXObjCPropertyAttrKind>;
  copy: EnumValue<CXObjCPropertyAttrKind>;
  nonatomic: EnumValue<CXObjCPropertyAttrKind>;
  setter: EnumValue<CXObjCPropertyAttrKind>;
  atomic: EnumValue<CXObjCPropertyAttrKind>;
  weak: EnumValue<CXObjCPropertyAttrKind>;
  strong: EnumValue<CXObjCPropertyAttrKind>;
  unsafe_unretained: EnumValue<CXObjCPropertyAttrKind>;
  class: EnumValue<CXObjCPropertyAttrKind>;
};

export type CXObjCDeclQualifierKind = {
  None: EnumValue<CXObjCDeclQualifierKind>;
  In: EnumValue<CXObjCDeclQualifierKind>;
  Inout: EnumValue<CXObjCDeclQualifierKind>;
  Out: EnumValue<CXObjCDeclQualifierKind>;
  Bycopy: EnumValue<CXObjCDeclQualifierKind>;
  Byref: EnumValue<CXObjCDeclQualifierKind>;
  Oneway: EnumValue<CXObjCDeclQualifierKind>;
};

export type CXNameRefFlags = {
  /**
   * Include the nested-name-specifier, e.g. Foo:: in x.Foo::y, in the
   * range.
   */
  WantQualifier: EnumValue<CXNameRefFlags>;

  /**
   * Include the explicit template arguments, e.g. \<int> in x.f<int>,
   * in the range.
   */
  WantTemplateArgs: EnumValue<CXNameRefFlags>;

  /**
   * If the name is non-contiguous, return the full spanning range.
   *
   * Non-contiguous names occur in Objective-C when a selector with two or more
   * parameters is used, or in C++ when using an operator:
   * ```cpp
   * [object doSomething:here withValue:there]; // Objective-C
   * return some_vector[1]; // C++
   * ```
   */
  WantSinglePiece: EnumValue<CXNameRefFlags>;
};

export type CXTokenKind = {
  /**
   * A token that contains some kind of punctuation.
   */
  Punctuation: EnumValue<CXTokenKind>;

  /**
   * A language keyword.
   */
  Keyword: EnumValue<CXTokenKind>;

  /**
   * An identifier (that is not a keyword).
   */
  Identifier: EnumValue<CXTokenKind>;

  /**
   * A numeric, string, or character literal.
   */
  Literal: EnumValue<CXTokenKind>;

  /**
   * A comment.
   */
  Comment: EnumValue<CXTokenKind>;
};

export type CXCompletionChunkKind = {
  /**
   * A code-completion string that describes "optional" text that
   * could be a part of the template (but is not required).
   *
   * The Optional chunk is the only kind of chunk that has a code-completion
   * string for its representation, which is accessible via
   * {@link LibClang.getCompletionChunkCompletionString | getCompletionChunkCompletionString()}. The code-completion string
   * describes an additional part of the template that is completely optional.
   * For example, optional chunks can be used to describe the placeholders for
   * arguments that match up with defaulted function parameters, e.g. given:
   *
   * ```cpp
   * void f(int x, float y = 3.14, double z = 2.71828);
   * ```
   *
   * The code-completion string for this function would contain:
   *   - a TypedText chunk for "f".
   *   - a LeftParen chunk for "(".
   *   - a Placeholder chunk for "int x"
   *   - an Optional chunk containing the remaining defaulted arguments, e.g.,
   *       - a Comma chunk for ","
   *       - a Placeholder chunk for "float y"
   *       - an Optional chunk containing the last defaulted argument:
   *           - a Comma chunk for ","
   *           - a Placeholder chunk for "double z"
   *   - a RightParen chunk for ")"
   *
   * There are many ways to handle Optional chunks. Two simple approaches are:
   *   - Completely ignore optional chunks, in which case the template for the
   *     function "f" would only include the first parameter ("int x").
   *   - Fully expand all optional chunks, in which case the template for the
   *     function "f" would have all of the parameters.
   */
  Optional: EnumValue<CXCompletionChunkKind>;
  /**
   * Text that a user would be expected to type to get this
   * code-completion result.
   *
   * There will be exactly one "typed text" chunk in a semantic string, which
   * will typically provide the spelling of a keyword or the name of a
   * declaration that could be used at the current code point. Clients are
   * expected to filter the code-completion results based on the text in this
   * chunk.
   */
  TypedText: EnumValue<CXCompletionChunkKind>;
  /**
   * Text that should be inserted as part of a code-completion result.
   *
   * A "text" chunk represents text that is part of the template to be
   * inserted into user code should this particular code-completion result
   * be selected.
   */
  Text: EnumValue<CXCompletionChunkKind>;
  /**
   * Placeholder text that should be replaced by the user.
   *
   * A "placeholder" chunk marks a place where the user should insert text
   * into the code-completion template. For example, placeholders might mark
   * the function parameters for a function declaration, to indicate that the
   * user should provide arguments for each of those parameters. The actual
   * text in a placeholder is a suggestion for the text to display before
   * the user replaces the placeholder with real code.
   */
  Placeholder: EnumValue<CXCompletionChunkKind>;
  /**
   * Informative text that should be displayed but never inserted as
   * part of the template.
   *
   * An "informative" chunk contains annotations that can be displayed to
   * help the user decide whether a particular code-completion result is the
   * right option, but which is not part of the actual template to be inserted
   * by code completion.
   */
  Informative: EnumValue<CXCompletionChunkKind>;
  /**
   * Text that describes the current parameter when code-completion is
   * referring to function call, message send, or template specialization.
   *
   * A "current parameter" chunk occurs when code-completion is providing
   * information about a parameter corresponding to the argument at the
   * code-completion point. For example, given a function
   *
   * ```cpp
   * int add(int x, int y);
   * ```
   *
   * and the source code \c add(, where the code-completion point is after the
   * "(", the code-completion string will contain a "current parameter" chunk
   * for "int x", indicating that the current argument will initialize that
   * parameter. After typing further, to \c add(17, (where the code-completion
   * point is after the ","), the code-completion string will contain a
   * "current parameter" chunk to "int y".
   */
  CurrentParameter: EnumValue<CXCompletionChunkKind>;
  /**
   * A left parenthesis ('('), used to initiate a function call or
   * signal the beginning of a function parameter list.
   */
  LeftParen: EnumValue<CXCompletionChunkKind>;
  /**
   * A right parenthesis (')'), used to finish a function call or
   * signal the end of a function parameter list.
   */
  RightParen: EnumValue<CXCompletionChunkKind>;
  /**
   * A left bracket ('[').
   */
  LeftBracket: EnumValue<CXCompletionChunkKind>;
  /**
   * A right bracket (']').
   */
  RightBracket: EnumValue<CXCompletionChunkKind>;
  /**
   * A left brace ('{').
   */
  LeftBrace: EnumValue<CXCompletionChunkKind>;
  /**
   * A right brace ('}').
   */
  RightBrace: EnumValue<CXCompletionChunkKind>;
  /**
   * A left angle bracket ('<').
   */
  LeftAngle: EnumValue<CXCompletionChunkKind>;
  /**
   * A right angle bracket ('>').
   */
  RightAngle: EnumValue<CXCompletionChunkKind>;
  /**
   * A comma separator (',').
   */
  Comma: EnumValue<CXCompletionChunkKind>;
  /**
   * Text that specifies the result type of a given result.
   *
   * This special kind of informative chunk is not meant to be inserted into
   * the text buffer. Rather, it is meant to illustrate the type that an
   * expression using the given completion string would have.
   */
  ResultType: EnumValue<CXCompletionChunkKind>;
  /**
   * A colon (':').
   */
  Colon: EnumValue<CXCompletionChunkKind>;
  /**
   * A semicolon (';').
   */
  SemiColon: EnumValue<CXCompletionChunkKind>;
  /**
   * An '=' sign.
   */
  Equal: EnumValue<CXCompletionChunkKind>;
  /**
   * Horizontal space (' ').
   */
  HorizontalSpace: EnumValue<CXCompletionChunkKind>;
  /**
   * Vertical space ('\\n'), after which it is generally a good idea to
   * perform indentation.
   */
  VerticalSpace: EnumValue<CXCompletionChunkKind>;
};

export type CXVisitorResult = {
  Break: EnumValue<CXVisitorResult>;
  Continue: EnumValue<CXVisitorResult>;
};

export type CXResult = {
  /**
   * Function returned successfully.
   */
  Success: EnumValue<CXResult>;
  /**
   * One of the parameters was invalid for the function.
   */
  Invalid: EnumValue<CXResult>;
  /**
   * The function was terminated by a callback (e.g. it returned
   * CXVisit_Break)
   */
  VisitBreak: EnumValue<CXResult>;
};

export type CXIdxEntityKind = {
  Unexposed: EnumValue<CXIdxEntityKind>;
  Typedef: EnumValue<CXIdxEntityKind>;
  Function: EnumValue<CXIdxEntityKind>;
  Variable: EnumValue<CXIdxEntityKind>;
  Field: EnumValue<CXIdxEntityKind>;
  EnumConstant: EnumValue<CXIdxEntityKind>;
  ObjCClass: EnumValue<CXIdxEntityKind>;
  ObjCProtocol: EnumValue<CXIdxEntityKind>;
  ObjCCategory: EnumValue<CXIdxEntityKind>;
  ObjCInstanceMethod: EnumValue<CXIdxEntityKind>;
  ObjCClassMethod: EnumValue<CXIdxEntityKind>;
  ObjCProperty: EnumValue<CXIdxEntityKind>;
  ObjCIvar: EnumValue<CXIdxEntityKind>;
  Enum: EnumValue<CXIdxEntityKind>;
  Struct: EnumValue<CXIdxEntityKind>;
  Union: EnumValue<CXIdxEntityKind>;
  CXXClass: EnumValue<CXIdxEntityKind>;
  CXXNamespace: EnumValue<CXIdxEntityKind>;
  CXXNamespaceAlias: EnumValue<CXIdxEntityKind>;
  CXXStaticVariable: EnumValue<CXIdxEntityKind>;
  CXXStaticMethod: EnumValue<CXIdxEntityKind>;
  CXXInstanceMethod: EnumValue<CXIdxEntityKind>;
  CXXConstructor: EnumValue<CXIdxEntityKind>;
  CXXDestructor: EnumValue<CXIdxEntityKind>;
  CXXConversionFunction: EnumValue<CXIdxEntityKind>;
  CXXTypeAlias: EnumValue<CXIdxEntityKind>;
  CXXInterface: EnumValue<CXIdxEntityKind>;
};

export type CXIdxEntityLanguage = {
  None: EnumValue<CXIdxEntityLanguage>;
  C: EnumValue<CXIdxEntityLanguage>;
  ObjC: EnumValue<CXIdxEntityLanguage>;
  CXX: EnumValue<CXIdxEntityLanguage>;
  Swift: EnumValue<CXIdxEntityLanguage>;
};

export type CXIdxEntityCXXTemplateKind = {
  NonTemplate: EnumValue<CXIdxEntityCXXTemplateKind>;
  Template: EnumValue<CXIdxEntityCXXTemplateKind>;
  TemplatePartialSpecialization: EnumValue<CXIdxEntityCXXTemplateKind>;
  TemplateSpecialization: EnumValue<CXIdxEntityCXXTemplateKind>;
};

export type CXIdxAttrKind = {
  Unexposed: EnumValue<CXIdxAttrKind>;
  IBAction: EnumValue<CXIdxAttrKind>;
  IBOutlet: EnumValue<CXIdxAttrKind>;
  IBOutletCollection: EnumValue<CXIdxAttrKind>;
};

export type CXIdxDeclInfoFlags = {
  Skipped: EnumValue<CXIdxDeclInfoFlags>;
};

export type CXIdxObjCContainerKind = {
  ForwardRef: EnumValue<CXIdxObjCContainerKind>;
  Interface: EnumValue<CXIdxObjCContainerKind>;
  Implementation: EnumValue<CXIdxObjCContainerKind>;
};

export type CXIdxEntityRefKind = {
  /**
   * The entity is referenced directly in user's code.
   */
  Direct: EnumValue<CXIdxEntityRefKind>;
  /**
   * An implicit reference, e.g. a reference of an Objective-C method
   * via the dot syntax.
   */
  Implicit: EnumValue<CXIdxEntityRefKind>;
};

export type CXSymbolRole = {
  None: EnumValue<CXSymbolRole>;
  Declaratio: EnumValue<CXSymbolRole>;
  Definitio: EnumValue<CXSymbolRole>;
  Refere: EnumValue<CXSymbolRole>;
  Read: EnumValue<CXSymbolRole>;
  Writ: EnumValue<CXSymbolRole>;
  Call: EnumValue<CXSymbolRole>;
  Dynamic: EnumValue<CXSymbolRole>;
  AddressO: EnumValue<CXSymbolRole>;
  Implicit: EnumValue<CXSymbolRole>;
};
