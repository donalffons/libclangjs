#include <algorithm>
#include <clang-c/Index.h>
#include <emscripten.h>
#include <emscripten/bind.h>
#include <emscripten/val.h>
#include <iostream>
#include <string.h>
#include <string>
#include <vector>

using namespace std;

struct Pointer {
  void *ptr;
};

struct ConvertJSStringArrayResult {
  const char *const *stringArray;
  size_t length;
};

ConvertJSStringArrayResult convertJSStringArray(emscripten::val v) {
  std::vector<std::string> vs = emscripten::vecFromJSArray<std::string>(v);
  const char **ret = new const char *[vs.size()];
  for (int i = 0; i < vs.size(); i++) {
    ret[i] = strdup(vs[i].c_str());
  }
  return {ret, vs.size()};
}

std::vector<CXUnsavedFile> convertUnsavedFiles(emscripten::val f) {
  std::vector<emscripten::val> vuf =
      emscripten::vecFromJSArray<emscripten::val>(f);
  std::vector<CXUnsavedFile> ret;
  std::function<CXUnsavedFile(emscripten::val)> bla =
      [](emscripten::val v) -> CXUnsavedFile {
    return {strdup(v["filename"].as<std::string>().c_str()),
            strdup(v["contents"].as<std::string>().c_str()),
            v["contents"].as<std::string>().size()};
  };
  std::transform(vuf.begin(), vuf.end(), std::back_inserter(ret), bla);
  return ret;
}

std::string cxStringToStdString(CXString str) {
  std::string result = clang_getCString(str);
  clang_disposeString(str);
  return result;
}

EMSCRIPTEN_BINDINGS(my_module) {
  emscripten::function(
      "clang_createIndex",
      emscripten::optional_override(
          [](int excludeDeclarationsFromPCH, int displayDiagnostics) {
            return Pointer({clang_createIndex(excludeDeclarationsFromPCH,
                                              displayDiagnostics)});
          }));
  emscripten::function("clang_disposeIndex",
                       emscripten::optional_override([](Pointer &index) {
                         return clang_disposeIndex(index.ptr);
                       }));
  emscripten::enum_<CXGlobalOptFlags>("CXGlobalOptFlags")
      .value("None", CXGlobalOpt_None)
      .value("ThreadBackgroundPriorityForIndexing",
             CXGlobalOpt_ThreadBackgroundPriorityForIndexing)
      .value("ThreadBackgroundPriorityForEditing",
             CXGlobalOpt_ThreadBackgroundPriorityForEditing)
      .value("ThreadBackgroundPriorityForAll",
             CXGlobalOpt_ThreadBackgroundPriorityForAll);
  emscripten::function(
      "clang_CXIndex_setGlobalOptions",
      emscripten::optional_override([](Pointer &index, unsigned options) {
        return clang_CXIndex_setGlobalOptions(index.ptr, options);
      }));
  emscripten::function("clang_CXIndex_getGlobalOptions",
                       emscripten::optional_override([](Pointer &index) {
                         return clang_CXIndex_getGlobalOptions(index.ptr);
                       }));
  emscripten::function(
      "clang_CXIndex_setInvocationEmissionPathOption",
      emscripten::optional_override([](Pointer &index, std::string path) {
        return clang_CXIndex_setInvocationEmissionPathOption(index.ptr,
                                                             path.c_str());
      }));
  emscripten::function(
      "clang_getFileName", emscripten::optional_override([](Pointer &SFile) {
        return cxStringToStdString(clang_getFileName(SFile.ptr));
      }));
  emscripten::function("clang_getFileTime",
                       emscripten::optional_override([](Pointer &SFile) {
                         return clang_getFileTime(SFile.ptr);
                       }));
  // skipped CXFileUniqueID
  // skipped clang_getFileUniqueID
  emscripten::function(
      "clang_isFileMultipleIncludeGuarded",
      emscripten::optional_override([](Pointer &tu, Pointer &file) {
        return clang_isFileMultipleIncludeGuarded(
            static_cast<CXTranslationUnit>(tu.ptr), file.ptr);
      }));
  emscripten::function(
      "clang_getFile",
      emscripten::optional_override([](Pointer &tu, std::string file_name) {
        return Pointer({clang_getFile(static_cast<CXTranslationUnit>(tu.ptr),
                                      file_name.c_str())});
      }));
  emscripten::function(
      "clang_getFileContents",
      emscripten::optional_override([](Pointer &tu, Pointer &file) {
        return std::string(clang_getFileContents(
            static_cast<CXTranslationUnit>(tu.ptr), file.ptr, nullptr));
      }));
  emscripten::function(
      "clang_File_isEqual",
      emscripten::optional_override([](Pointer &file1, Pointer &file2) {
        return clang_File_isEqual(file1.ptr, file2.ptr);
      }));
  emscripten::function("clang_File_tryGetRealPathName",
                       emscripten::optional_override([](Pointer &file) {
                         return clang_File_tryGetRealPathName(file.ptr);
                       }));
  emscripten::class_<CXSourceLocation>("CXSourceLocation")
      .property("int_data", &CXSourceLocation::int_data);
  emscripten::class_<CXSourceRange>("CXSourceRange")
      .property("begin_int_data", &CXSourceRange::begin_int_data)
      .property("end_int_data", &CXSourceRange::end_int_data);
  emscripten::function("clang_getNullLocation", &clang_getNullLocation);
  emscripten::function("clang_equalLocations", &clang_equalLocations);
  emscripten::function(
      "clang_getLocation",
      emscripten::optional_override(
          [](Pointer &tu, Pointer &file, unsigned line, unsigned column) {
            return clang_getLocation(static_cast<CXTranslationUnit>(tu.ptr),
                                     file.ptr, line, column);
          }));
  emscripten::function("clang_getLocationForOffset",
                       emscripten::optional_override(
                           [](Pointer &tu, Pointer &file, unsigned offset) {
                             return clang_getLocationForOffset(
                                 static_cast<CXTranslationUnit>(tu.ptr),
                                 file.ptr, offset);
                           }));
  emscripten::function("clang_Location_isInSystemHeader",
                       &clang_Location_isInSystemHeader);
  emscripten::function("clang_Location_isFromMainFile",
                       &clang_Location_isFromMainFile);
  emscripten::function("clang_getNullRange", &clang_getNullRange);
  emscripten::function("clang_getRange", &clang_getRange);
  emscripten::function("clang_equalRanges", &clang_equalRanges);
  emscripten::function("clang_Range_isNull", &clang_Range_isNull);
  // skipped clang_getExpansionLocation
  // skipped clang_getPresumedLocation
  // skipped clang_getInstantiationLocation
  // skipped clang_getSpellingLocation
  // skipped clang_getFileLocation
  emscripten::function("clang_getRangeStart", &clang_getRangeStart);
  emscripten::function("clang_getRangeEnd", &clang_getRangeEnd);
  // skipped CXSourceRangeList
  // skipped clang_getSkippedRanges
  // skipped clang_getAllSkippedRanges
  // skipped clang_disposeSourceRangeList
  emscripten::enum_<CXDiagnosticSeverity>("CXDiagnosticSeverity")
      .value("Ignored", CXDiagnostic_Ignored)
      .value("Note", CXDiagnostic_Note)
      .value("Warning", CXDiagnostic_Warning)
      .value("Error", CXDiagnostic_Error)
      .value("Fatal", CXDiagnostic_Fatal);
  emscripten::function("clang_getNumDiagnosticsInSet",
                       emscripten::optional_override([](Pointer &Diags) {
                         return clang_getNumDiagnosticsInSet(Diags.ptr);
                       }));
  emscripten::function(
      "clang_getDiagnosticInSet",
      emscripten::optional_override([](Pointer &Diags, unsigned Index) {
        return Pointer({clang_getDiagnosticInSet(Diags.ptr, Index)});
      }));
  emscripten::enum_<CXLoadDiag_Error>("CXLoadDiag_Error")
      .value("None", CXLoadDiag_None)
      .value("Unknown", CXLoadDiag_Unknown)
      .value("CannotLoad", CXLoadDiag_CannotLoad)
      .value("InvalidFile", CXLoadDiag_InvalidFile);
  // skipped clang_loadDiagnostics
  emscripten::function("clang_disposeDiagnosticSet",
                       emscripten::optional_override([](Pointer &Diags) {
                         return clang_disposeDiagnosticSet(Diags.ptr);
                       }));
  emscripten::function("clang_getChildDiagnostics",
                       emscripten::optional_override([](Pointer &D) {
                         return Pointer({clang_getChildDiagnostics(D.ptr)});
                       }));
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
  emscripten::function("clang_getTranslationUnitSpelling",
                       emscripten::optional_override([](Pointer &CTUnit) {
                         return cxStringToStdString(
                             clang_getTranslationUnitSpelling(
                                 static_cast<CXTranslationUnit>(CTUnit.ptr)));
                       }));
  emscripten::function(
      "clang_createTranslationUnitFromSourceFile",
      emscripten::optional_override(
          [](Pointer CIdx, emscripten::val source_filename,
             emscripten::val command_line_args, emscripten::val unsaved_files) {
            auto [convertedCommandLineArgs, numConvertedCommandLineArgs] =
                (command_line_args.isNull() || command_line_args.isUndefined())
                    ? ConvertJSStringArrayResult({nullptr, 0})
                    : convertJSStringArray(command_line_args);
            unsigned numConvertedUnsavedFiles = 0;
            CXUnsavedFile *convertedUnsavedFiles = nullptr;
            if (!(unsaved_files.isNull() || unsaved_files.isUndefined())) {
              auto f = convertUnsavedFiles(unsaved_files);
              numConvertedUnsavedFiles = f.size();
              convertedUnsavedFiles = &f[0];
            }
            return Pointer({clang_createTranslationUnitFromSourceFile(
                CIdx.ptr,
                (source_filename.isNull() || source_filename.isUndefined())
                    ? nullptr
                    : source_filename.as<std::string>().c_str(),
                numConvertedCommandLineArgs, convertedCommandLineArgs,
                numConvertedUnsavedFiles, convertedUnsavedFiles)});
          }));
  emscripten::function(
      "clang_createTranslationUnit",
      emscripten::optional_override([](Pointer CIdx, std::string ast_filename) {
        return Pointer(
            {clang_createTranslationUnit(CIdx.ptr, ast_filename.c_str())});
      }));
  // skipped clang_createTranslationUnit2
  emscripten::enum_<CXTranslationUnit_Flags>("CXTranslationUnit_Flags")
      .value("None", CXTranslationUnit_None)
      .value("DetailedPreprocessingRecord",
             CXTranslationUnit_DetailedPreprocessingRecord)
      .value("Incomplete", CXTranslationUnit_Incomplete)
      .value("PrecompiledPreamble", CXTranslationUnit_PrecompiledPreamble)
      .value("CacheCompletionResults", CXTranslationUnit_CacheCompletionResults)
      .value("ForSerialization", CXTranslationUnit_ForSerialization)
      .value("CXXChainedPCH", CXTranslationUnit_CXXChainedPCH)
      .value("SkipFunctionBodies", CXTranslationUnit_SkipFunctionBodies)
      .value("IncludeBriefCommentsInCodeCompletion",
             CXTranslationUnit_IncludeBriefCommentsInCodeCompletion)
      .value("CreatePreambleOnFirstParse",
             CXTranslationUnit_CreatePreambleOnFirstParse)
      .value("KeepGoing", CXTranslationUnit_KeepGoing)
      .value("SingleFileParse", CXTranslationUnit_SingleFileParse)
      .value("LimitSkipFunctionBodiesToPreamble",
             CXTranslationUnit_LimitSkipFunctionBodiesToPreamble)
      .value("IncludeAttributedTypes", CXTranslationUnit_IncludeAttributedTypes)
      .value("VisitImplicitAttributes",
             CXTranslationUnit_VisitImplicitAttributes)
      .value("IgnoreNonErrorsFromIncludedFiles",
             CXTranslationUnit_IgnoreNonErrorsFromIncludedFiles)
      .value("RetainExcludedConditionalBlocks",
             CXTranslationUnit_RetainExcludedConditionalBlocks);
  emscripten::function("clang_defaultEditingTranslationUnitOptions",
                       &clang_defaultEditingTranslationUnitOptions);
  emscripten::function(
      "clang_parseTranslationUnit",
      emscripten::optional_override(
          [](Pointer CIdx, emscripten::val source_filename,
             emscripten::val command_line_args, emscripten::val unsaved_files,
             unsigned options) {
            auto [convertedCommandLineArgs, numConvertedCommandLineArgs] =
                (command_line_args.isNull() || command_line_args.isUndefined())
                    ? ConvertJSStringArrayResult({nullptr, 0})
                    : convertJSStringArray(command_line_args);
            unsigned numConvertedUnsavedFiles = 0;
            CXUnsavedFile *convertedUnsavedFiles = nullptr;
            if (!(unsaved_files.isNull() || unsaved_files.isUndefined())) {
              auto f = convertUnsavedFiles(unsaved_files);
              numConvertedUnsavedFiles = f.size();
              convertedUnsavedFiles = &f[0];
            }
            return Pointer({clang_parseTranslationUnit(
                CIdx.ptr,
                (source_filename.isNull() || source_filename.isUndefined())
                    ? nullptr
                    : source_filename.as<std::string>().c_str(),
                convertedCommandLineArgs, numConvertedCommandLineArgs,
                convertedUnsavedFiles, numConvertedUnsavedFiles, options)});
          }));
  // skipped clang_parseTranslationUnit2
  // skipped clang_parseTranslationUnit2FullArgv
  emscripten::enum_<CXSaveTranslationUnit_Flags>("CXSaveTranslationUnit_Flags")
      .value("None", CXSaveTranslationUnit_None);
  emscripten::function(
      "clang_defaultSaveOptions", emscripten::optional_override([](Pointer TU) {
        return clang_defaultSaveOptions(static_cast<CXTranslationUnit>(TU.ptr));
      }));
  emscripten::enum_<CXSaveError>("CXSaveError")
      .value("None", CXSaveError_None)
      .value("Unknown", CXSaveError_Unknown)
      .value("TranslationErrors", CXSaveError_TranslationErrors)
      .value("InvalidTU", CXSaveError_InvalidTU);
  emscripten::function(
      "clang_saveTranslationUnit",
      emscripten::optional_override([](Pointer TU, std::string FileName,
                                       unsigned options) {
        return clang_saveTranslationUnit(static_cast<CXTranslationUnit>(TU.ptr),
                                         FileName.c_str(), options);
      }));
  emscripten::function("clang_suspendTranslationUnit",
                       emscripten::optional_override([](Pointer TU) {
                         return clang_suspendTranslationUnit(
                             static_cast<CXTranslationUnit>(TU.ptr));
                       }));
  emscripten::function("clang_disposeTranslationUnit",
                       emscripten::optional_override([](Pointer TU) {
                         return clang_disposeTranslationUnit(
                             static_cast<CXTranslationUnit>(TU.ptr));
                       }));
  emscripten::enum_<CXReparse_Flags>("CXReparse_Flags")
      .value("None", CXReparse_None);
  emscripten::function("clang_defaultReparseOptions",
                       emscripten::optional_override([](Pointer TU) {
                         return clang_defaultReparseOptions(
                             static_cast<CXTranslationUnit>(TU.ptr));
                       }));
  emscripten::function(
      "clang_reparseTranslationUnit",
      emscripten::optional_override(
          [](Pointer TU, emscripten::val unsaved_files, unsigned options) {
            unsigned numConvertedUnsavedFiles = 0;
            CXUnsavedFile *convertedUnsavedFiles = nullptr;
            if (!(unsaved_files.isNull() || unsaved_files.isUndefined())) {
              auto f = convertUnsavedFiles(unsaved_files);
              numConvertedUnsavedFiles = f.size();
              convertedUnsavedFiles = &f[0];
            }
            return clang_reparseTranslationUnit(
                static_cast<CXTranslationUnit>(TU.ptr),
                numConvertedUnsavedFiles, convertedUnsavedFiles, options);
          }));
  emscripten::enum_<CXTUResourceUsageKind>("CXTUResourceUsageKind")
      .value("AST", CXTUResourceUsage_AST)
      .value("Identifiers", CXTUResourceUsage_Identifiers)
      .value("Selectors", CXTUResourceUsage_Selectors)
      .value("GlobalCompletionResults",
             CXTUResourceUsage_GlobalCompletionResults)
      .value("SourceManagerContentCache",
             CXTUResourceUsage_SourceManagerContentCache)
      .value("AST_SideTables", CXTUResourceUsage_AST_SideTables)
      .value("SourceManager_Membuffer_Malloc",
             CXTUResourceUsage_SourceManager_Membuffer_Malloc)
      .value("SourceManager_Membuffer_MMap",
             CXTUResourceUsage_SourceManager_Membuffer_MMap)
      .value("ExternalASTSource_Membuffer_Malloc",
             CXTUResourceUsage_ExternalASTSource_Membuffer_Malloc)
      .value("ExternalASTSource_Membuffer_MMap",
             CXTUResourceUsage_ExternalASTSource_Membuffer_MMap)
      .value("Preprocessor", CXTUResourceUsage_Preprocessor)
      .value("PreprocessingRecord", CXTUResourceUsage_PreprocessingRecord)
      .value("SourceManager_DataStructures",
             CXTUResourceUsage_SourceManager_DataStructures)
      .value("Preprocessor_HeaderSearch",
             CXTUResourceUsage_Preprocessor_HeaderSearch)
      .value("MEMORY_IN_BYTES_BEGIN", CXTUResourceUsage_MEMORY_IN_BYTES_BEGIN)
      .value("MEMORY_IN_BYTES_END", CXTUResourceUsage_MEMORY_IN_BYTES_END)
      .value("First", CXTUResourceUsage_First)
      .value("Last", CXTUResourceUsage_Last);
  emscripten::function(
      "clang_getTUResourceUsageName",
      emscripten::optional_override([](CXTUResourceUsageKind kind) {
        return std::string(clang_getTUResourceUsageName(kind));
      }));
  // skipped CXTUResourceUsageEntry
  // skipped CXTUResourceUsage
  // skipped clang_getCXTUResourceUsage
  // skipped clang_disposeCXTUResourceUsage
  // skipped clang_getTranslationUnitTargetInfo
  // skipped clang_TargetInfo_dispose
  // skipped clang_TargetInfo_getTriple
  // skipped clang_TargetInfo_getPointerWidth
  emscripten::enum_<CXCursorKind>("CXCursorKind")
      .value("UnexposedDecl", CXCursor_UnexposedDecl)
      .value("StructDecl", CXCursor_StructDecl)
      .value("UnionDecl", CXCursor_UnionDecl)
      .value("ClassDecl", CXCursor_ClassDecl)
      .value("EnumDecl", CXCursor_EnumDecl)
      .value("FieldDecl", CXCursor_FieldDecl)
      .value("EnumConstantDecl", CXCursor_EnumConstantDecl)
      .value("FunctionDecl", CXCursor_FunctionDecl)
      .value("VarDecl", CXCursor_VarDecl)
      .value("ParmDecl", CXCursor_ParmDecl)
      .value("ObjCInterfaceDecl", CXCursor_ObjCInterfaceDecl)
      .value("ObjCCategoryDecl", CXCursor_ObjCCategoryDecl)
      .value("ObjCProtocolDecl", CXCursor_ObjCProtocolDecl)
      .value("ObjCPropertyDecl", CXCursor_ObjCPropertyDecl)
      .value("ObjCIvarDecl", CXCursor_ObjCIvarDecl)
      .value("ObjCInstanceMethodDecl", CXCursor_ObjCInstanceMethodDecl)
      .value("ObjCClassMethodDecl", CXCursor_ObjCClassMethodDecl)
      .value("ObjCImplementationDecl", CXCursor_ObjCImplementationDecl)
      .value("ObjCCategoryImplDecl", CXCursor_ObjCCategoryImplDecl)
      .value("TypedefDecl", CXCursor_TypedefDecl)
      .value("CXXMethod", CXCursor_CXXMethod)
      .value("Namespace", CXCursor_Namespace)
      .value("LinkageSpec", CXCursor_LinkageSpec)
      .value("Constructor", CXCursor_Constructor)
      .value("Destructor", CXCursor_Destructor)
      .value("ConversionFunction", CXCursor_ConversionFunction)
      .value("TemplateTypeParameter", CXCursor_TemplateTypeParameter)
      .value("NonTypeTemplateParameter", CXCursor_NonTypeTemplateParameter)
      .value("TemplateTemplateParameter", CXCursor_TemplateTemplateParameter)
      .value("FunctionTemplate", CXCursor_FunctionTemplate)
      .value("ClassTemplate", CXCursor_ClassTemplate)
      .value("ClassTemplatePartialSpecialization",
             CXCursor_ClassTemplatePartialSpecialization)
      .value("NamespaceAlias", CXCursor_NamespaceAlias)
      .value("UsingDirective", CXCursor_UsingDirective)
      .value("UsingDeclaration", CXCursor_UsingDeclaration)
      .value("TypeAliasDecl", CXCursor_TypeAliasDecl)
      .value("ObjCSynthesizeDecl", CXCursor_ObjCSynthesizeDecl)
      .value("ObjCDynamicDecl", CXCursor_ObjCDynamicDecl)
      .value("CXXAccessSpecifier", CXCursor_CXXAccessSpecifier)
      .value("FirstDecl", CXCursor_FirstDecl)
      .value("LastDecl", CXCursor_LastDecl)
      .value("FirstRef", CXCursor_FirstRef)
      .value("ObjCSuperClassRef", CXCursor_ObjCSuperClassRef)
      .value("ObjCProtocolRef", CXCursor_ObjCProtocolRef)
      .value("ObjCClassRef", CXCursor_ObjCClassRef)
      .value("TypeRef", CXCursor_TypeRef)
      .value("CXXBaseSpecifier", CXCursor_CXXBaseSpecifier)
      .value("TemplateRef", CXCursor_TemplateRef)
      .value("NamespaceRef", CXCursor_NamespaceRef)
      .value("MemberRef", CXCursor_MemberRef)
      .value("LabelRef", CXCursor_LabelRef)
      .value("OverloadedDeclRef", CXCursor_OverloadedDeclRef)
      .value("VariableRef", CXCursor_VariableRef)
      .value("LastRef", CXCursor_LastRef)
      .value("FirstInvalid", CXCursor_FirstInvalid)
      .value("InvalidFile", CXCursor_InvalidFile)
      .value("NoDeclFound", CXCursor_NoDeclFound)
      .value("NotImplemented", CXCursor_NotImplemented)
      .value("InvalidCode", CXCursor_InvalidCode)
      .value("LastInvalid", CXCursor_LastInvalid)
      .value("FirstExpr", CXCursor_FirstExpr)
      .value("UnexposedExpr", CXCursor_UnexposedExpr)
      .value("DeclRefExpr", CXCursor_DeclRefExpr)
      .value("MemberRefExpr", CXCursor_MemberRefExpr)
      .value("CallExpr", CXCursor_CallExpr)
      .value("ObjCMessageExpr", CXCursor_ObjCMessageExpr)
      .value("BlockExpr", CXCursor_BlockExpr)
      .value("IntegerLiteral", CXCursor_IntegerLiteral)
      .value("FloatingLiteral", CXCursor_FloatingLiteral)
      .value("ImaginaryLiteral", CXCursor_ImaginaryLiteral)
      .value("StringLiteral", CXCursor_StringLiteral)
      .value("CharacterLiteral", CXCursor_CharacterLiteral)
      .value("ParenExpr", CXCursor_ParenExpr)
      .value("UnaryOperator", CXCursor_UnaryOperator)
      .value("ArraySubscriptExpr", CXCursor_ArraySubscriptExpr)
      .value("BinaryOperator", CXCursor_BinaryOperator)
      .value("CompoundAssignOperator", CXCursor_CompoundAssignOperator)
      .value("ConditionalOperator", CXCursor_ConditionalOperator)
      .value("CStyleCastExpr", CXCursor_CStyleCastExpr)
      .value("CompoundLiteralExpr", CXCursor_CompoundLiteralExpr)
      .value("InitListExpr", CXCursor_InitListExpr)
      .value("AddrLabelExpr", CXCursor_AddrLabelExpr)
      .value("StmtExpr", CXCursor_StmtExpr)
      .value("GenericSelectionExpr", CXCursor_GenericSelectionExpr)
      .value("GNUNullExpr", CXCursor_GNUNullExpr)
      .value("CXXStaticCastExpr", CXCursor_CXXStaticCastExpr)
      .value("CXXDynamicCastExpr", CXCursor_CXXDynamicCastExpr)
      .value("CXXReinterpretCastExpr", CXCursor_CXXReinterpretCastExpr)
      .value("CXXConstCastExpr", CXCursor_CXXConstCastExpr)
      .value("CXXFunctionalCastExpr", CXCursor_CXXFunctionalCastExpr)
      .value("CXXTypeidExpr", CXCursor_CXXTypeidExpr)
      .value("CXXBoolLiteralExpr", CXCursor_CXXBoolLiteralExpr)
      .value("CXXNullPtrLiteralExpr", CXCursor_CXXNullPtrLiteralExpr)
      .value("CXXThisExpr", CXCursor_CXXThisExpr)
      .value("CXXThrowExpr", CXCursor_CXXThrowExpr)
      .value("CXXNewExpr", CXCursor_CXXNewExpr)
      .value("CXXDeleteExpr", CXCursor_CXXDeleteExpr)
      .value("UnaryExpr", CXCursor_UnaryExpr)
      .value("ObjCStringLiteral", CXCursor_ObjCStringLiteral)
      .value("ObjCEncodeExpr", CXCursor_ObjCEncodeExpr)
      .value("ObjCSelectorExpr", CXCursor_ObjCSelectorExpr)
      .value("ObjCProtocolExpr", CXCursor_ObjCProtocolExpr)
      .value("ObjCBridgedCastExpr", CXCursor_ObjCBridgedCastExpr)
      .value("PackExpansionExpr", CXCursor_PackExpansionExpr)
      .value("SizeOfPackExpr", CXCursor_SizeOfPackExpr)
      .value("LambdaExpr", CXCursor_LambdaExpr)
      .value("ObjCBoolLiteralExpr", CXCursor_ObjCBoolLiteralExpr)
      .value("ObjCSelfExpr", CXCursor_ObjCSelfExpr)
      .value("OMPArraySectionExpr", CXCursor_OMPArraySectionExpr)
      .value("ObjCAvailabilityCheckExpr", CXCursor_ObjCAvailabilityCheckExpr)
      .value("FixedPointLiteral", CXCursor_FixedPointLiteral)
      .value("OMPArrayShapingExpr", CXCursor_OMPArrayShapingExpr)
      .value("OMPIteratorExpr", CXCursor_OMPIteratorExpr)
      .value("CXXAddrspaceCastExpr", CXCursor_CXXAddrspaceCastExpr)
      .value("LastExpr", CXCursor_LastExpr)
      .value("FirstStmt", CXCursor_FirstStmt)
      .value("UnexposedStmt", CXCursor_UnexposedStmt)
      .value("LabelStmt", CXCursor_LabelStmt)
      .value("CompoundStmt", CXCursor_CompoundStmt)
      .value("CaseStmt", CXCursor_CaseStmt)
      .value("DefaultStmt", CXCursor_DefaultStmt)
      .value("IfStmt", CXCursor_IfStmt)
      .value("SwitchStmt", CXCursor_SwitchStmt)
      .value("WhileStmt", CXCursor_WhileStmt)
      .value("DoStmt", CXCursor_DoStmt)
      .value("ForStmt", CXCursor_ForStmt)
      .value("GotoStmt", CXCursor_GotoStmt)
      .value("IndirectGotoStmt", CXCursor_IndirectGotoStmt)
      .value("ContinueStmt", CXCursor_ContinueStmt)
      .value("BreakStmt", CXCursor_BreakStmt)
      .value("ReturnStmt", CXCursor_ReturnStmt)
      .value("GCCAsmStmt", CXCursor_GCCAsmStmt)
      .value("AsmStmt", CXCursor_AsmStmt)
      .value("ObjCAtTryStmt", CXCursor_ObjCAtTryStmt)
      .value("ObjCAtCatchStmt", CXCursor_ObjCAtCatchStmt)
      .value("ObjCAtFinallyStmt", CXCursor_ObjCAtFinallyStmt)
      .value("ObjCAtThrowStmt", CXCursor_ObjCAtThrowStmt)
      .value("ObjCAtSynchronizedStmt", CXCursor_ObjCAtSynchronizedStmt)
      .value("ObjCAutoreleasePoolStmt", CXCursor_ObjCAutoreleasePoolStmt)
      .value("ObjCForCollectionStmt", CXCursor_ObjCForCollectionStmt)
      .value("CXXCatchStmt", CXCursor_CXXCatchStmt)
      .value("CXXTryStmt", CXCursor_CXXTryStmt)
      .value("CXXForRangeStmt", CXCursor_CXXForRangeStmt)
      .value("SEHTryStmt", CXCursor_SEHTryStmt)
      .value("SEHExceptStmt", CXCursor_SEHExceptStmt)
      .value("SEHFinallyStmt", CXCursor_SEHFinallyStmt)
      .value("MSAsmStmt", CXCursor_MSAsmStmt)
      .value("NullStmt", CXCursor_NullStmt)
      .value("DeclStmt", CXCursor_DeclStmt)
      .value("OMPParallelDirective", CXCursor_OMPParallelDirective)
      .value("OMPSimdDirective", CXCursor_OMPSimdDirective)
      .value("OMPForDirective", CXCursor_OMPForDirective)
      .value("OMPSectionsDirective", CXCursor_OMPSectionsDirective)
      .value("OMPSectionDirective", CXCursor_OMPSectionDirective)
      .value("OMPSingleDirective", CXCursor_OMPSingleDirective)
      .value("OMPParallelForDirective", CXCursor_OMPParallelForDirective)
      .value("OMPParallelSectionsDirective",
             CXCursor_OMPParallelSectionsDirective)
      .value("OMPTaskDirective", CXCursor_OMPTaskDirective)
      .value("OMPMasterDirective", CXCursor_OMPMasterDirective)
      .value("OMPCriticalDirective", CXCursor_OMPCriticalDirective)
      .value("OMPTaskyieldDirective", CXCursor_OMPTaskyieldDirective)
      .value("OMPBarrierDirective", CXCursor_OMPBarrierDirective)
      .value("OMPTaskwaitDirective", CXCursor_OMPTaskwaitDirective)
      .value("OMPFlushDirective", CXCursor_OMPFlushDirective)
      .value("SEHLeaveStmt", CXCursor_SEHLeaveStmt)
      .value("OMPOrderedDirective", CXCursor_OMPOrderedDirective)
      .value("OMPAtomicDirective", CXCursor_OMPAtomicDirective)
      .value("OMPForSimdDirective", CXCursor_OMPForSimdDirective)
      .value("OMPParallelForSimdDirective",
             CXCursor_OMPParallelForSimdDirective)
      .value("OMPTargetDirective", CXCursor_OMPTargetDirective)
      .value("OMPTeamsDirective", CXCursor_OMPTeamsDirective)
      .value("OMPTaskgroupDirective", CXCursor_OMPTaskgroupDirective)
      .value("OMPCancellationPointDirective",
             CXCursor_OMPCancellationPointDirective)
      .value("OMPCancelDirective", CXCursor_OMPCancelDirective)
      .value("OMPTargetDataDirective", CXCursor_OMPTargetDataDirective)
      .value("OMPTaskLoopDirective", CXCursor_OMPTaskLoopDirective)
      .value("OMPTaskLoopSimdDirective", CXCursor_OMPTaskLoopSimdDirective)
      .value("OMPDistributeDirective", CXCursor_OMPDistributeDirective)
      .value("OMPTargetEnterDataDirective",
             CXCursor_OMPTargetEnterDataDirective)
      .value("OMPTargetExitDataDirective", CXCursor_OMPTargetExitDataDirective)
      .value("OMPTargetParallelDirective", CXCursor_OMPTargetParallelDirective)
      .value("OMPTargetParallelForDirective",
             CXCursor_OMPTargetParallelForDirective)
      .value("OMPTargetUpdateDirective", CXCursor_OMPTargetUpdateDirective)
      .value("OMPDistributeParallelForDirective",
             CXCursor_OMPDistributeParallelForDirective)
      .value("OMPDistributeParallelForSimdDirective",
             CXCursor_OMPDistributeParallelForSimdDirective)
      .value("OMPDistributeSimdDirective", CXCursor_OMPDistributeSimdDirective)
      .value("OMPTargetParallelForSimdDirective",
             CXCursor_OMPTargetParallelForSimdDirective)
      .value("OMPTargetSimdDirective", CXCursor_OMPTargetSimdDirective)
      .value("OMPTeamsDistributeDirective",
             CXCursor_OMPTeamsDistributeDirective)
      .value("OMPTeamsDistributeSimdDirective",
             CXCursor_OMPTeamsDistributeSimdDirective)
      .value("OMPTeamsDistributeParallelForSimdDirective",
             CXCursor_OMPTeamsDistributeParallelForSimdDirective)
      .value("OMPTeamsDistributeParallelForDirective",
             CXCursor_OMPTeamsDistributeParallelForDirective)
      .value("OMPTargetTeamsDirective", CXCursor_OMPTargetTeamsDirective)
      .value("OMPTargetTeamsDistributeDirective",
             CXCursor_OMPTargetTeamsDistributeDirective)
      .value("OMPTargetTeamsDistributeParallelForDirective",
             CXCursor_OMPTargetTeamsDistributeParallelForDirective)
      .value("OMPTargetTeamsDistributeParallelForSimdDirective",
             CXCursor_OMPTargetTeamsDistributeParallelForSimdDirective)
      .value("OMPTargetTeamsDistributeSimdDirective",
             CXCursor_OMPTargetTeamsDistributeSimdDirective)
      .value("BuiltinBitCastExpr", CXCursor_BuiltinBitCastExpr)
      .value("OMPMasterTaskLoopDirective", CXCursor_OMPMasterTaskLoopDirective)
      .value("OMPParallelMasterTaskLoopDirective",
             CXCursor_OMPParallelMasterTaskLoopDirective)
      .value("OMPMasterTaskLoopSimdDirective",
             CXCursor_OMPMasterTaskLoopSimdDirective)
      .value("OMPParallelMasterTaskLoopSimdDirective",
             CXCursor_OMPParallelMasterTaskLoopSimdDirective)
      .value("OMPParallelMasterDirective", CXCursor_OMPParallelMasterDirective)
      .value("OMPDepobjDirective", CXCursor_OMPDepobjDirective)
      .value("OMPScanDirective", CXCursor_OMPScanDirective)
      .value("OMPTileDirective", CXCursor_OMPTileDirective)
      .value("OMPCanonicalLoop", CXCursor_OMPCanonicalLoop)
      .value("OMPInteropDirective", CXCursor_OMPInteropDirective)
      .value("OMPDispatchDirective", CXCursor_OMPDispatchDirective)
      .value("OMPMaskedDirective", CXCursor_OMPMaskedDirective)
      .value("OMPUnrollDirective", CXCursor_OMPUnrollDirective)
      .value("OMPMetaDirective", CXCursor_OMPMetaDirective)
      .value("OMPGenericLoopDirective", CXCursor_OMPGenericLoopDirective)
      .value("LastStmt", CXCursor_LastStmt)
      .value("TranslationUnit", CXCursor_TranslationUnit)
      .value("FirstAttr", CXCursor_FirstAttr)
      .value("UnexposedAttr", CXCursor_UnexposedAttr)
      .value("IBActionAttr", CXCursor_IBActionAttr)
      .value("IBOutletAttr", CXCursor_IBOutletAttr)
      .value("IBOutletCollectionAttr", CXCursor_IBOutletCollectionAttr)
      .value("CXXFinalAttr", CXCursor_CXXFinalAttr)
      .value("CXXOverrideAttr", CXCursor_CXXOverrideAttr)
      .value("AnnotateAttr", CXCursor_AnnotateAttr)
      .value("AsmLabelAttr", CXCursor_AsmLabelAttr)
      .value("PackedAttr", CXCursor_PackedAttr)
      .value("PureAttr", CXCursor_PureAttr)
      .value("ConstAttr", CXCursor_ConstAttr)
      .value("NoDuplicateAttr", CXCursor_NoDuplicateAttr)
      .value("CUDAConstantAttr", CXCursor_CUDAConstantAttr)
      .value("CUDADeviceAttr", CXCursor_CUDADeviceAttr)
      .value("CUDAGlobalAttr", CXCursor_CUDAGlobalAttr)
      .value("CUDAHostAttr", CXCursor_CUDAHostAttr)
      .value("CUDASharedAttr", CXCursor_CUDASharedAttr)
      .value("VisibilityAttr", CXCursor_VisibilityAttr)
      .value("DLLExport", CXCursor_DLLExport)
      .value("DLLImport", CXCursor_DLLImport)
      .value("NSReturnsRetained", CXCursor_NSReturnsRetained)
      .value("NSReturnsNotRetained", CXCursor_NSReturnsNotRetained)
      .value("NSReturnsAutoreleased", CXCursor_NSReturnsAutoreleased)
      .value("NSConsumesSelf", CXCursor_NSConsumesSelf)
      .value("NSConsumed", CXCursor_NSConsumed)
      .value("ObjCException", CXCursor_ObjCException)
      .value("ObjCNSObject", CXCursor_ObjCNSObject)
      .value("ObjCIndependentClass", CXCursor_ObjCIndependentClass)
      .value("ObjCPreciseLifetime", CXCursor_ObjCPreciseLifetime)
      .value("ObjCReturnsInnerPointer", CXCursor_ObjCReturnsInnerPointer)
      .value("ObjCRequiresSuper", CXCursor_ObjCRequiresSuper)
      .value("ObjCRootClass", CXCursor_ObjCRootClass)
      .value("ObjCSubclassingRestricted", CXCursor_ObjCSubclassingRestricted)
      .value("ObjCExplicitProtocolImpl", CXCursor_ObjCExplicitProtocolImpl)
      .value("ObjCDesignatedInitializer", CXCursor_ObjCDesignatedInitializer)
      .value("ObjCRuntimeVisible", CXCursor_ObjCRuntimeVisible)
      .value("ObjCBoxable", CXCursor_ObjCBoxable)
      .value("FlagEnum", CXCursor_FlagEnum)
      .value("ConvergentAttr", CXCursor_ConvergentAttr)
      .value("WarnUnusedAttr", CXCursor_WarnUnusedAttr)
      .value("WarnUnusedResultAttr", CXCursor_WarnUnusedResultAttr)
      .value("AlignedAttr", CXCursor_AlignedAttr)
      .value("LastAttr", CXCursor_LastAttr)
      .value("PreprocessingDirective", CXCursor_PreprocessingDirective)
      .value("MacroDefinition", CXCursor_MacroDefinition)
      .value("MacroExpansion", CXCursor_MacroExpansion)
      .value("MacroInstantiation", CXCursor_MacroInstantiation)
      .value("InclusionDirective", CXCursor_InclusionDirective)
      .value("FirstPreprocessing", CXCursor_FirstPreprocessing)
      .value("LastPreprocessing", CXCursor_LastPreprocessing)
      .value("ModuleImportDecl", CXCursor_ModuleImportDecl)
      .value("TypeAliasTemplateDecl", CXCursor_TypeAliasTemplateDecl)
      .value("StaticAssert", CXCursor_StaticAssert)
      .value("FriendDecl", CXCursor_FriendDecl)
      .value("FirstExtraDecl", CXCursor_FirstExtraDecl)
      .value("LastExtraDecl", CXCursor_LastExtraDecl)
      .value("OverloadCandidate", CXCursor_OverloadCandidate);
  emscripten::class_<CXCursor>("CXCursor")
      .property("kind", &CXCursor::kind)
      .property("xdata", &CXCursor::xdata);
  emscripten::function("clang_getNullCursor", &clang_getNullCursor);
  emscripten::function("clang_getTranslationUnitCursor",
                       emscripten::optional_override([](Pointer &p) {
                         return clang_getTranslationUnitCursor(
                             static_cast<CXTranslationUnit>(p.ptr));
                       }));
  emscripten::function("clang_equalCursors", &clang_equalCursors);
  emscripten::function("clang_Cursor_isNull", &clang_Cursor_isNull);
  emscripten::function("clang_hashCursor", &clang_hashCursor);
  emscripten::function("clang_getCursorKind", &clang_getCursorKind);
  emscripten::function("clang_isDeclaration", &clang_isDeclaration);
  emscripten::function("clang_isInvalidDeclaration",
                       &clang_isInvalidDeclaration);
  emscripten::function("clang_isReference", &clang_isReference);
  emscripten::function("clang_isExpression", &clang_isExpression);
  emscripten::function("clang_isStatement", &clang_isStatement);
  emscripten::function("clang_isAttribute", &clang_isAttribute);
  emscripten::function("clang_Cursor_hasAttrs", &clang_Cursor_hasAttrs);
  emscripten::function("clang_isInvalid", &clang_isInvalid);
  emscripten::function("clang_isTranslationUnit", &clang_isTranslationUnit);
  emscripten::function("clang_isPreprocessing", &clang_isPreprocessing);
  emscripten::function("clang_isUnexposed", &clang_isUnexposed);
  emscripten::enum_<CXLinkageKind>("CXLinkageKind")
      .value("Invalid", CXLinkage_Invalid)
      .value("NoLinkage", CXLinkage_NoLinkage)
      .value("Internal", CXLinkage_Internal)
      .value("UniqueExternal", CXLinkage_UniqueExternal)
      .value("External", CXLinkage_External);
  emscripten::function("clang_getCursorLinkage", &clang_getCursorLinkage);
  emscripten::enum_<CXVisibilityKind>("CXVisibilityKind")
      .value("Invalid", CXVisibility_Invalid)
      .value("Hidden", CXVisibility_Hidden)
      .value("Protected", CXVisibility_Protected)
      .value("Default", CXVisibility_Default);
  emscripten::function("clang_getCursorVisibility", &clang_getCursorVisibility);
  emscripten::function("clang_getCursorAvailability",
                       &clang_getCursorAvailability);
  // skipped CXPlatformAvailability
  // skipped clang_getCursorPlatformAvailability
  // skipped clang_disposeCXPlatformAvailability
  emscripten::function("clang_Cursor_getVarDeclInitializer",
                       &clang_Cursor_getVarDeclInitializer);
  emscripten::function("clang_Cursor_hasVarDeclGlobalStorage",
                       &clang_Cursor_hasVarDeclGlobalStorage);
  emscripten::function("clang_Cursor_hasVarDeclExternalStorage",
                       &clang_Cursor_hasVarDeclExternalStorage);
  emscripten::enum_<CXLanguageKind>("CXLanguageKind")
      .value("Invalid", CXLanguage_Invalid)
      .value("C", CXLanguage_C)
      .value("ObjC", CXLanguage_ObjC)
      .value("CPlusPlus", CXLanguage_CPlusPlus);
  emscripten::function("clang_getCursorLanguage", &clang_getCursorLanguage);
  emscripten::enum_<CXTLSKind>("CXTLSKind")
      .value("None", CXTLS_None)
      .value("Dynamic", CXTLS_Dynamic)
      .value("Static", CXTLS_Static);
  emscripten::function("clang_getCursorTLSKind", &clang_getCursorTLSKind);
  emscripten::function("clang_Cursor_getTranslationUnit",
                       emscripten::optional_override([](CXCursor cursor) {
                         return Pointer(
                             {clang_Cursor_getTranslationUnit(cursor)});
                       }));
  // skipped clang_createCXCursorSet
  // skipped clang_disposeCXCursorSet
  // skipped clang_CXCursorSet_contains
  // skipped clang_CXCursorSet_insert
  emscripten::function("clang_getCursorSemanticParent",
                       &clang_getCursorSemanticParent);
  emscripten::function("clang_getCursorLexicalParent",
                       &clang_getCursorLexicalParent);
  // skipped clang_getOverriddenCursors
  // skipped clang_disposeOverriddenCursors
  emscripten::function("clang_getIncludedFile",
                       emscripten::optional_override([](CXCursor cursor) {
                         return Pointer({clang_getIncludedFile(cursor)});
                       }));
  emscripten::function(
      "clang_getCursor",
      emscripten::optional_override([](Pointer tu, CXSourceLocation l) {
        return clang_getCursor(static_cast<CXTranslationUnit>(tu.ptr), l);
      }));
  emscripten::function("clang_getCursorLocation", &clang_getCursorLocation);
  emscripten::function("clang_getCursorExtent", &clang_getCursorExtent);
  emscripten::enum_<CXTypeKind>("CXTypeKind")
      .value("Invalid", CXType_Invalid)
      .value("Unexposed", CXType_Unexposed)
      .value("Void", CXType_Void)
      .value("Bool", CXType_Bool)
      .value("Char_U", CXType_Char_U)
      .value("UChar", CXType_UChar)
      .value("Char16", CXType_Char16)
      .value("Char32", CXType_Char32)
      .value("UShort", CXType_UShort)
      .value("UInt", CXType_UInt)
      .value("ULong", CXType_ULong)
      .value("ULongLong", CXType_ULongLong)
      .value("UInt128", CXType_UInt128)
      .value("Char_S", CXType_Char_S)
      .value("SChar", CXType_SChar)
      .value("WChar", CXType_WChar)
      .value("Short", CXType_Short)
      .value("Int", CXType_Int)
      .value("Long", CXType_Long)
      .value("LongLong", CXType_LongLong)
      .value("Int128", CXType_Int128)
      .value("Float", CXType_Float)
      .value("Double", CXType_Double)
      .value("LongDouble", CXType_LongDouble)
      .value("NullPtr", CXType_NullPtr)
      .value("Overload", CXType_Overload)
      .value("Dependent", CXType_Dependent)
      .value("ObjCId", CXType_ObjCId)
      .value("ObjCClass", CXType_ObjCClass)
      .value("ObjCSel", CXType_ObjCSel)
      .value("Float128", CXType_Float128)
      .value("Half", CXType_Half)
      .value("Float16", CXType_Float16)
      .value("ShortAccum", CXType_ShortAccum)
      .value("Accum", CXType_Accum)
      .value("LongAccum", CXType_LongAccum)
      .value("UShortAccum", CXType_UShortAccum)
      .value("UAccum", CXType_UAccum)
      .value("ULongAccum", CXType_ULongAccum)
      .value("BFloat16", CXType_BFloat16)
      .value("Ibm128", CXType_Ibm128)
      .value("FirstBuiltin", CXType_FirstBuiltin)
      .value("LastBuiltin", CXType_LastBuiltin)
      .value("Complex", CXType_Complex)
      .value("Pointer", CXType_Pointer)
      .value("BlockPointer", CXType_BlockPointer)
      .value("LValueReference", CXType_LValueReference)
      .value("RValueReference", CXType_RValueReference)
      .value("Record", CXType_Record)
      .value("Enum", CXType_Enum)
      .value("Typedef", CXType_Typedef)
      .value("ObjCInterface", CXType_ObjCInterface)
      .value("ObjCObjectPointer", CXType_ObjCObjectPointer)
      .value("FunctionNoProto", CXType_FunctionNoProto)
      .value("FunctionProto", CXType_FunctionProto)
      .value("ConstantArray", CXType_ConstantArray)
      .value("Vector", CXType_Vector)
      .value("IncompleteArray", CXType_IncompleteArray)
      .value("VariableArray", CXType_VariableArray)
      .value("DependentSizedArray", CXType_DependentSizedArray)
      .value("MemberPointer", CXType_MemberPointer)
      .value("Auto", CXType_Auto)
      .value("Elaborated", CXType_Elaborated)
      .value("Pipe", CXType_Pipe)
      .value("OCLImage1dRO", CXType_OCLImage1dRO)
      .value("OCLImage1dArrayRO", CXType_OCLImage1dArrayRO)
      .value("OCLImage1dBufferRO", CXType_OCLImage1dBufferRO)
      .value("OCLImage2dRO", CXType_OCLImage2dRO)
      .value("OCLImage2dArrayRO", CXType_OCLImage2dArrayRO)
      .value("OCLImage2dDepthRO", CXType_OCLImage2dDepthRO)
      .value("OCLImage2dArrayDepthRO", CXType_OCLImage2dArrayDepthRO)
      .value("OCLImage2dMSAARO", CXType_OCLImage2dMSAARO)
      .value("OCLImage2dArrayMSAARO", CXType_OCLImage2dArrayMSAARO)
      .value("OCLImage2dMSAADepthRO", CXType_OCLImage2dMSAADepthRO)
      .value("OCLImage2dArrayMSAADepthRO", CXType_OCLImage2dArrayMSAADepthRO)
      .value("OCLImage3dRO", CXType_OCLImage3dRO)
      .value("OCLImage1dWO", CXType_OCLImage1dWO)
      .value("OCLImage1dArrayWO", CXType_OCLImage1dArrayWO)
      .value("OCLImage1dBufferWO", CXType_OCLImage1dBufferWO)
      .value("OCLImage2dWO", CXType_OCLImage2dWO)
      .value("OCLImage2dArrayWO", CXType_OCLImage2dArrayWO)
      .value("OCLImage2dDepthWO", CXType_OCLImage2dDepthWO)
      .value("OCLImage2dArrayDepthWO", CXType_OCLImage2dArrayDepthWO)
      .value("OCLImage2dMSAAWO", CXType_OCLImage2dMSAAWO)
      .value("OCLImage2dArrayMSAAWO", CXType_OCLImage2dArrayMSAAWO)
      .value("OCLImage2dMSAADepthWO", CXType_OCLImage2dMSAADepthWO)
      .value("OCLImage2dArrayMSAADepthWO", CXType_OCLImage2dArrayMSAADepthWO)
      .value("OCLImage3dWO", CXType_OCLImage3dWO)
      .value("OCLImage1dRW", CXType_OCLImage1dRW)
      .value("OCLImage1dArrayRW", CXType_OCLImage1dArrayRW)
      .value("OCLImage1dBufferRW", CXType_OCLImage1dBufferRW)
      .value("OCLImage2dRW", CXType_OCLImage2dRW)
      .value("OCLImage2dArrayRW", CXType_OCLImage2dArrayRW)
      .value("OCLImage2dDepthRW", CXType_OCLImage2dDepthRW)
      .value("OCLImage2dArrayDepthRW", CXType_OCLImage2dArrayDepthRW)
      .value("OCLImage2dMSAARW", CXType_OCLImage2dMSAARW)
      .value("OCLImage2dArrayMSAARW", CXType_OCLImage2dArrayMSAARW)
      .value("OCLImage2dMSAADepthRW", CXType_OCLImage2dMSAADepthRW)
      .value("OCLImage2dArrayMSAADepthRW", CXType_OCLImage2dArrayMSAADepthRW)
      .value("OCLImage3dRW", CXType_OCLImage3dRW)
      .value("OCLSampler", CXType_OCLSampler)
      .value("OCLEvent", CXType_OCLEvent)
      .value("OCLQueue", CXType_OCLQueue)
      .value("OCLReserveID", CXType_OCLReserveID)
      .value("ObjCObject", CXType_ObjCObject)
      .value("ObjCTypeParam", CXType_ObjCTypeParam)
      .value("Attributed", CXType_Attributed)
      .value("OCLIntelSubgroupAVCMcePayload",
             CXType_OCLIntelSubgroupAVCMcePayload)
      .value("OCLIntelSubgroupAVCImePayload",
             CXType_OCLIntelSubgroupAVCImePayload)
      .value("OCLIntelSubgroupAVCRefPayload",
             CXType_OCLIntelSubgroupAVCRefPayload)
      .value("OCLIntelSubgroupAVCSicPayload",
             CXType_OCLIntelSubgroupAVCSicPayload)
      .value("OCLIntelSubgroupAVCMceResult",
             CXType_OCLIntelSubgroupAVCMceResult)
      .value("OCLIntelSubgroupAVCImeResult",
             CXType_OCLIntelSubgroupAVCImeResult)
      .value("OCLIntelSubgroupAVCRefResult",
             CXType_OCLIntelSubgroupAVCRefResult)
      .value("OCLIntelSubgroupAVCSicResult",
             CXType_OCLIntelSubgroupAVCSicResult)
      .value("OCLIntelSubgroupAVCImeResultSingleRefStreamout",
             CXType_OCLIntelSubgroupAVCImeResultSingleRefStreamout)
      .value("OCLIntelSubgroupAVCImeResultDualRefStreamout",
             CXType_OCLIntelSubgroupAVCImeResultDualRefStreamout)
      .value("OCLIntelSubgroupAVCImeSingleRefStreamin",
             CXType_OCLIntelSubgroupAVCImeSingleRefStreamin)
      .value("OCLIntelSubgroupAVCImeDualRefStreamin",
             CXType_OCLIntelSubgroupAVCImeDualRefStreamin)
      .value("ExtVector", CXType_ExtVector)
      .value("Atomic", CXType_Atomic);
  emscripten::enum_<CXCallingConv>("CXCallingConv")
      .value("Default", CXCallingConv_Default)
      .value("C", CXCallingConv_C)
      .value("X86StdCall", CXCallingConv_X86StdCall)
      .value("X86FastCall", CXCallingConv_X86FastCall)
      .value("X86ThisCall", CXCallingConv_X86ThisCall)
      .value("X86Pascal", CXCallingConv_X86Pascal)
      .value("AAPCS", CXCallingConv_AAPCS)
      .value("AAPCS_VFP", CXCallingConv_AAPCS_VFP)
      .value("X86RegCall", CXCallingConv_X86RegCall)
      .value("IntelOclBicc", CXCallingConv_IntelOclBicc)
      .value("Win64", CXCallingConv_Win64)
      .value("X86_64Win64", CXCallingConv_X86_64Win64)
      .value("X86_64SysV", CXCallingConv_X86_64SysV)
      .value("X86VectorCall", CXCallingConv_X86VectorCall)
      .value("Swift", CXCallingConv_Swift)
      .value("PreserveMost", CXCallingConv_PreserveMost)
      .value("PreserveAll", CXCallingConv_PreserveAll)
      .value("AArch64VectorCall", CXCallingConv_AArch64VectorCall)
      .value("SwiftAsync", CXCallingConv_SwiftAsync)
      .value("Invalid", CXCallingConv_Invalid)
      .value("Unexposed", CXCallingConv_Unexposed);
  emscripten::class_<CXType>("CXType").property("kind", &CXType::kind);
  emscripten::function("clang_getCursorType", &clang_getCursorType);
  emscripten::function("clang_getTypeSpelling",
                       emscripten::optional_override([](CXType CT) {
                         return cxStringToStdString(clang_getTypeSpelling(CT));
                       }));
  emscripten::function("clang_getTypedefDeclUnderlyingType",
                       &clang_getTypedefDeclUnderlyingType);
  emscripten::function("clang_getEnumDeclIntegerType",
                       &clang_getEnumDeclIntegerType);
  emscripten::function("clang_getEnumConstantDeclValue",
                       &clang_getEnumConstantDeclValue);
  emscripten::function("clang_getEnumConstantDeclUnsignedValue",
                       &clang_getEnumConstantDeclUnsignedValue);
  emscripten::function("clang_getFieldDeclBitWidth",
                       &clang_getFieldDeclBitWidth);
  emscripten::function("clang_Cursor_getNumArguments",
                       &clang_Cursor_getNumArguments);
  emscripten::function("clang_Cursor_getArgument", &clang_Cursor_getArgument);
  emscripten::enum_<CXTemplateArgumentKind>("CXTemplateArgumentKind")
      .value("Null", CXTemplateArgumentKind_Null)
      .value("Type", CXTemplateArgumentKind_Type)
      .value("Declaration", CXTemplateArgumentKind_Declaration)
      .value("NullPtr", CXTemplateArgumentKind_NullPtr)
      .value("Integral", CXTemplateArgumentKind_Integral)
      .value("Template", CXTemplateArgumentKind_Template)
      .value("TemplateExpansion", CXTemplateArgumentKind_TemplateExpansion)
      .value("Expression", CXTemplateArgumentKind_Expression)
      .value("Pack", CXTemplateArgumentKind_Pack)
      .value("Invalid", CXTemplateArgumentKind_Invalid);
  emscripten::function("clang_Cursor_getNumTemplateArguments",
                       &clang_Cursor_getNumTemplateArguments);
  emscripten::function("clang_Cursor_getTemplateArgumentKind",
                       &clang_Cursor_getTemplateArgumentKind);
  emscripten::function("clang_Cursor_getTemplateArgumentType",
                       &clang_Cursor_getTemplateArgumentType);
  emscripten::function("clang_Cursor_getTemplateArgumentValue",
                       &clang_Cursor_getTemplateArgumentValue);
  emscripten::function("clang_Cursor_getTemplateArgumentUnsignedValue",
                       &clang_Cursor_getTemplateArgumentUnsignedValue);
  emscripten::function("clang_equalTypes", &clang_equalTypes);
  emscripten::function("clang_getCanonicalType", &clang_getCanonicalType);
  emscripten::function("clang_isConstQualifiedType",
                       &clang_isConstQualifiedType);
  emscripten::function("clang_Cursor_isMacroFunctionLike",
                       &clang_Cursor_isMacroFunctionLike);
  emscripten::function("clang_Cursor_isMacroBuiltin",
                       &clang_Cursor_isMacroBuiltin);
  emscripten::function("clang_Cursor_isFunctionInlined",
                       &clang_Cursor_isFunctionInlined);
  emscripten::function("clang_isVolatileQualifiedType",
                       &clang_isVolatileQualifiedType);
  emscripten::function("clang_isRestrictQualifiedType",
                       &clang_isRestrictQualifiedType);
  emscripten::function("clang_getAddressSpace", &clang_getAddressSpace);
  emscripten::function("clang_getTypedefName",
                       emscripten::optional_override([](CXType CT) {
                         return cxStringToStdString(clang_getTypedefName(CT));
                       }));
  emscripten::function("clang_getPointeeType", &clang_getPointeeType);
  emscripten::function("clang_getTypeDeclaration", &clang_getTypeDeclaration);
  emscripten::function("clang_getDeclObjCTypeEncoding",
                       emscripten::optional_override([](CXCursor C) {
                         return cxStringToStdString(
                             clang_getDeclObjCTypeEncoding(C));
                       }));
  emscripten::function("clang_Type_getObjCEncoding",
                       emscripten::optional_override([](CXType type) {
                         return cxStringToStdString(
                             clang_Type_getObjCEncoding(type));
                       }));
  emscripten::function("clang_getTypeKindSpelling",
                       emscripten::optional_override([](CXTypeKind K) {
                         return cxStringToStdString(
                             clang_getTypeKindSpelling(K));
                       }));
  emscripten::function("clang_getFunctionTypeCallingConv",
                       &clang_getFunctionTypeCallingConv);
  emscripten::function("clang_getResultType", &clang_getResultType);
  emscripten::function("clang_getExceptionSpecificationType",
                       &clang_getExceptionSpecificationType);
  emscripten::function("clang_getNumArgTypes", &clang_getNumArgTypes);
  emscripten::function("clang_getArgType", &clang_getArgType);
  emscripten::function("clang_Type_getObjCObjectBaseType",
                       &clang_Type_getObjCObjectBaseType);
  emscripten::function("clang_Type_getNumObjCProtocolRefs",
                       &clang_Type_getNumObjCProtocolRefs);
  emscripten::function("clang_Type_getObjCProtocolDecl",
                       &clang_Type_getObjCProtocolDecl);
  emscripten::function("clang_Type_getNumObjCTypeArgs",
                       &clang_Type_getNumObjCTypeArgs);
  emscripten::function("clang_Type_getObjCTypeArg", &clang_Type_getObjCTypeArg);
  emscripten::function("clang_isFunctionTypeVariadic",
                       &clang_isFunctionTypeVariadic);
  emscripten::function("clang_getCursorResultType", &clang_getCursorResultType);
  emscripten::function("clang_getCursorExceptionSpecificationType",
                       &clang_getCursorExceptionSpecificationType);
  emscripten::function("clang_isPODType", &clang_isPODType);
  emscripten::function("clang_getElementType", &clang_getElementType);
  emscripten::function("clang_getNumElements", &clang_getNumElements);
  emscripten::function("clang_getArrayElementType", &clang_getArrayElementType);
  emscripten::function("clang_getArraySize", &clang_getArraySize);
  emscripten::function("clang_Type_getNamedType", &clang_Type_getNamedType);
  emscripten::function("clang_Type_isTransparentTagTypedef",
                       &clang_Type_isTransparentTagTypedef);
  emscripten::enum_<CXTypeNullabilityKind>("CXTypeNullabilityKind")
      .value("NonNull", CXTypeNullability_NonNull)
      .value("Nullable", CXTypeNullability_Nullable)
      .value("Unspecified", CXTypeNullability_Unspecified)
      .value("Invalid", CXTypeNullability_Invalid)
      .value("NullableResult", CXTypeNullability_NullableResult);
  emscripten::function("clang_Type_getNullability", &clang_Type_getNullability);
  emscripten::enum_<CXTypeLayoutError>("CXTypeLayoutError")
      .value("Invalid", CXTypeLayoutError_Invalid)
      .value("Incomplete", CXTypeLayoutError_Incomplete)
      .value("Dependent", CXTypeLayoutError_Dependent)
      .value("NotConstantSize", CXTypeLayoutError_NotConstantSize)
      .value("InvalidFieldName", CXTypeLayoutError_InvalidFieldName)
      .value("Undeduced", CXTypeLayoutError_Undeduced);
  emscripten::function("clang_Type_getAlignOf", &clang_Type_getAlignOf);
  emscripten::function("clang_Type_getClassType", &clang_Type_getClassType);
  emscripten::function("clang_Type_getSizeOf", &clang_Type_getSizeOf);
  emscripten::function(
      "clang_Type_getOffsetOf",
      emscripten::optional_override([](CXType T, std::string S) {
        return clang_Type_getOffsetOf(T, S.c_str());
      }));
  emscripten::function("clang_Type_getModifiedType",
                       &clang_Type_getModifiedType);
  emscripten::function("clang_Type_getValueType", &clang_Type_getValueType);
  emscripten::function("clang_Cursor_getOffsetOfField",
                       &clang_Cursor_getOffsetOfField);
  emscripten::function("clang_Cursor_isAnonymous", &clang_Cursor_isAnonymous);
  emscripten::function("clang_Cursor_isAnonymousRecordDecl",
                       &clang_Cursor_isAnonymousRecordDecl);
  emscripten::function("clang_Cursor_isInlineNamespace",
                       &clang_Cursor_isInlineNamespace);
  emscripten::enum_<CXRefQualifierKind>("CXRefQualifierKind")
      .value("None", CXRefQualifier_None)
      .value("LValue", CXRefQualifier_LValue)
      .value("RValue", CXRefQualifier_RValue);
  emscripten::function("clang_Type_getNumTemplateArguments",
                       &clang_Type_getNumTemplateArguments);
  emscripten::function("clang_Type_getTemplateArgumentAsType",
                       &clang_Type_getTemplateArgumentAsType);
  emscripten::function("clang_Type_getCXXRefQualifier",
                       &clang_Type_getCXXRefQualifier);
  emscripten::function("clang_Cursor_isBitField", &clang_Cursor_isBitField);
  emscripten::function("clang_isVirtualBase", &clang_isVirtualBase);
  emscripten::enum_<CX_CXXAccessSpecifier>("CX_CXXAccessSpecifier")
      .value("InvalidAccessSpecifier", CX_CXXInvalidAccessSpecifier)
      .value("Public", CX_CXXPublic)
      .value("Protected", CX_CXXProtected)
      .value("Private", CX_CXXPrivate);
  emscripten::function("clang_getCXXAccessSpecifier",
                       &clang_getCXXAccessSpecifier);
  emscripten::enum_<CX_StorageClass>("CX_StorageClass")
      .value("Invalid", CX_SC_Invalid)
      .value("None", CX_SC_None)
      .value("Extern", CX_SC_Extern)
      .value("Static", CX_SC_Static)
      .value("PrivateExtern", CX_SC_PrivateExtern)
      .value("OpenCLWorkGroupLocal", CX_SC_OpenCLWorkGroupLocal)
      .value("Auto", CX_SC_Auto)
      .value("Register", CX_SC_Register);
  emscripten::function("clang_Cursor_getStorageClass",
                       &clang_Cursor_getStorageClass);
  emscripten::function("clang_getNumOverloadedDecls",
                       &clang_getNumOverloadedDecls);
  emscripten::function("clang_getOverloadedDecl", &clang_getOverloadedDecl);
  emscripten::function("clang_getIBOutletCollectionType",
                       &clang_getIBOutletCollectionType);
  emscripten::enum_<CXChildVisitResult>("CXChildVisitResult")
      .value("Break", CXChildVisit_Break)
      .value("Continue", CXChildVisit_Continue)
      .value("Recurse", CXChildVisit_Recurse);
  emscripten::function(
      "clang_visitChildren",
      emscripten::optional_override([](CXCursor &parent,
                                       emscripten::val visitor) {
        typedef std::function<CXChildVisitResult(CXCursor &, CXCursor &)>
            Callback;
        Callback callback = [&visitor](CXCursor &cursor,
                                       CXCursor &parent) -> CXChildVisitResult {
          return static_cast<CXChildVisitResult>(
              visitor(cursor, parent)["value"].as<int>());
        };
        clang_visitChildren(
            parent,
            [](CXCursor cursor, CXCursor parent, CXClientData client_data) {
              Callback *myClientData = static_cast<Callback *>(client_data);
              return (*myClientData)(cursor, parent);
            },
            &callback);
      }));
  emscripten::function("clang_getCursorUSR",
                       emscripten::optional_override([](CXCursor C) {
                         return cxStringToStdString(clang_getCursorUSR(C));
                       }));
  emscripten::function(
      "clang_constructUSR_ObjCClass",
      emscripten::optional_override([](std::string class_name) {
        return cxStringToStdString(
            clang_constructUSR_ObjCClass(class_name.c_str()));
      }));
  emscripten::function(
      "clang_constructUSR_ObjCCategory",
      emscripten::optional_override(
          [](std::string class_name, std::string category_name) {
            return cxStringToStdString(clang_constructUSR_ObjCCategory(
                class_name.c_str(), category_name.c_str()));
          }));
  emscripten::function(
      "clang_constructUSR_ObjCProtocol",
      emscripten::optional_override([](std::string protocol_name) {
        return cxStringToStdString(
            clang_constructUSR_ObjCProtocol(protocol_name.c_str()));
      }));
  emscripten::function("clang_getCursorSpelling",
                       emscripten::optional_override([](CXCursor C) {
                         return cxStringToStdString(clang_getCursorSpelling(C));
                       }));
  // skipped clang_constructUSR_ObjCIvar
  // skipped clang_constructUSR_ObjCMethod
  // skipped clang_constructUSR_ObjCProperty
  emscripten::function("clang_Cursor_getSpellingNameRange",
                       &clang_Cursor_getSpellingNameRange);
  emscripten::enum_<CXPrintingPolicyProperty>("CXPrintingPolicyProperty")
      .value("Indentation", CXPrintingPolicy_Indentation)
      .value("SuppressSpecifiers", CXPrintingPolicy_SuppressSpecifiers)
      .value("SuppressTagKeyword", CXPrintingPolicy_SuppressTagKeyword)
      .value("IncludeTagDefinition", CXPrintingPolicy_IncludeTagDefinition)
      .value("SuppressScope", CXPrintingPolicy_SuppressScope)
      .value("SuppressUnwrittenScope", CXPrintingPolicy_SuppressUnwrittenScope)
      .value("SuppressInitializers", CXPrintingPolicy_SuppressInitializers)
      .value("ConstantArraySizeAsWritten",
             CXPrintingPolicy_ConstantArraySizeAsWritten)
      .value("AnonymousTagLocations", CXPrintingPolicy_AnonymousTagLocations)
      .value("SuppressStrongLifetime", CXPrintingPolicy_SuppressStrongLifetime)
      .value("SuppressLifetimeQualifiers",
             CXPrintingPolicy_SuppressLifetimeQualifiers)
      .value("SuppressTemplateArgsInCXXConstructors",
             CXPrintingPolicy_SuppressTemplateArgsInCXXConstructors)
      .value("Bool", CXPrintingPolicy_Bool)
      .value("Restrict", CXPrintingPolicy_Restrict)
      .value("Alignof", CXPrintingPolicy_Alignof)
      .value("UnderscoreAlignof", CXPrintingPolicy_UnderscoreAlignof)
      .value("UseVoidForZeroParams", CXPrintingPolicy_UseVoidForZeroParams)
      .value("TerseOutput", CXPrintingPolicy_TerseOutput)
      .value("PolishForDeclaration", CXPrintingPolicy_PolishForDeclaration)
      .value("Half", CXPrintingPolicy_Half)
      .value("MSWChar", CXPrintingPolicy_MSWChar)
      .value("IncludeNewlines", CXPrintingPolicy_IncludeNewlines)
      .value("MSVCFormatting", CXPrintingPolicy_MSVCFormatting)
      .value("ConstantsAsWritten", CXPrintingPolicy_ConstantsAsWritten)
      .value("SuppressImplicitBase", CXPrintingPolicy_SuppressImplicitBase)
      .value("FullyQualifiedName", CXPrintingPolicy_FullyQualifiedName)
      .value("LastProperty", CXPrintingPolicy_LastProperty);
  emscripten::function(
      "clang_PrintingPolicy_getProperty",
      emscripten::optional_override(
          [](Pointer Policy, CXPrintingPolicyProperty Property) {
            return clang_PrintingPolicy_getProperty(Policy.ptr, Property);
          }));
  emscripten::function(
      "clang_PrintingPolicy_setProperty",
      emscripten::optional_override([](Pointer Policy,
                                       CXPrintingPolicyProperty Property,
                                       unsigned Value) {
        return clang_PrintingPolicy_setProperty(Policy.ptr, Property, Value);
      }));
  emscripten::function("clang_getCursorPrintingPolicy",
                       emscripten::optional_override([](CXCursor C) {
                         return Pointer({clang_getCursorPrintingPolicy(C)});
                       }));
  emscripten::function("clang_PrintingPolicy_dispose",
                       emscripten::optional_override([](Pointer Policy) {
                         return clang_PrintingPolicy_dispose(Policy.ptr);
                       }));
  emscripten::function(
      "clang_getCursorPrettyPrinted",
      emscripten::optional_override([](CXCursor Cursor, Pointer Policy) {
        return cxStringToStdString(
            clang_getCursorPrettyPrinted(Cursor, Policy.ptr));
      }));
  emscripten::function("clang_getCursorDisplayName",
                       &clang_getCursorDisplayName);
  emscripten::function("clang_getCursorReferenced", &clang_getCursorReferenced);
  emscripten::function("clang_getCursorDefinition", &clang_getCursorDefinition);
  emscripten::function("clang_isCursorDefinition", &clang_isCursorDefinition);
  emscripten::function("clang_getCanonicalCursor", &clang_getCanonicalCursor);
  emscripten::function("clang_Cursor_getObjCSelectorIndex",
                       &clang_Cursor_getObjCSelectorIndex);
  emscripten::function("clang_Cursor_isDynamicCall",
                       &clang_Cursor_isDynamicCall);
  emscripten::function("clang_Cursor_getReceiverType",
                       &clang_Cursor_getReceiverType);
  emscripten::enum_<CXObjCPropertyAttrKind>("CXObjCPropertyAttrKind")
      .value("noattr", CXObjCPropertyAttr_noattr)
      .value("readonly", CXObjCPropertyAttr_readonly)
      .value("getter", CXObjCPropertyAttr_getter)
      .value("assign", CXObjCPropertyAttr_assign)
      .value("readwrite", CXObjCPropertyAttr_readwrite)
      .value("retain", CXObjCPropertyAttr_retain)
      .value("copy", CXObjCPropertyAttr_copy)
      .value("nonatomic", CXObjCPropertyAttr_nonatomic)
      .value("setter", CXObjCPropertyAttr_setter)
      .value("atomic", CXObjCPropertyAttr_atomic)
      .value("weak", CXObjCPropertyAttr_weak)
      .value("strong", CXObjCPropertyAttr_strong)
      .value("unsafe_unretained", CXObjCPropertyAttr_unsafe_unretained)
      .value("class", CXObjCPropertyAttr_class);
  emscripten::function("clang_Cursor_getObjCPropertyAttributes",
                       &clang_Cursor_getObjCPropertyAttributes);
  emscripten::function("clang_Cursor_getObjCPropertyGetterName",
                       emscripten::optional_override([](CXCursor C) {
                         return cxStringToStdString(
                             clang_Cursor_getObjCPropertyGetterName(C));
                       }));
  emscripten::function("clang_Cursor_getObjCPropertySetterName",
                       emscripten::optional_override([](CXCursor C) {
                         return cxStringToStdString(
                             clang_Cursor_getObjCPropertySetterName(C));
                       }));
  emscripten::enum_<CXObjCDeclQualifierKind>("CXObjCDeclQualifierKind")
      .value("None", CXObjCDeclQualifier_None)
      .value("In", CXObjCDeclQualifier_In)
      .value("Inout", CXObjCDeclQualifier_Inout)
      .value("Out", CXObjCDeclQualifier_Out)
      .value("Bycopy", CXObjCDeclQualifier_Bycopy)
      .value("Byref", CXObjCDeclQualifier_Byref)
      .value("Oneway", CXObjCDeclQualifier_Oneway);
  emscripten::function("clang_Cursor_getObjCDeclQualifiers",
                       &clang_Cursor_getObjCDeclQualifiers);
  emscripten::function("clang_Cursor_isObjCOptional",
                       &clang_Cursor_isObjCOptional);
  emscripten::function("clang_Cursor_isVariadic", &clang_Cursor_isVariadic);
  // skipped clang_Cursor_isExternalSymbol
  emscripten::function("clang_Cursor_getCommentRange",
                       &clang_Cursor_getCommentRange);
  emscripten::function("clang_Cursor_getRawCommentText",
                       emscripten::optional_override([](CXCursor C) {
                         return cxStringToStdString(
                             clang_Cursor_getRawCommentText(C));
                       }));
  emscripten::function("clang_Cursor_getBriefCommentText",
                       emscripten::optional_override([](CXCursor C) {
                         return cxStringToStdString(
                             clang_Cursor_getBriefCommentText(C));
                       }));
  emscripten::function(
      "clang_Cursor_getMangling", emscripten::optional_override([](CXCursor C) {
        return cxStringToStdString(clang_Cursor_getMangling(C));
      }));
  // skipped clang_Cursor_getCXXManglings
  // skipped clang_Cursor_getObjCManglings
  emscripten::function("clang_Cursor_getModule",
                       emscripten::optional_override([](CXCursor C) {
                         return Pointer({clang_Cursor_getModule(C)});
                       }));
  emscripten::function(
      "clang_getModuleForFile",
      emscripten::optional_override([](Pointer TU, Pointer File) {
        return Pointer({clang_getModuleForFile(
            static_cast<CXTranslationUnit>(TU.ptr), File.ptr)});
      }));
  emscripten::function("clang_Module_getASTFile",
                       emscripten::optional_override([](Pointer Module) {
                         return Pointer({clang_Module_getASTFile(Module.ptr)});
                       }));
  emscripten::function("clang_Module_getParent",
                       emscripten::optional_override([](Pointer Module) {
                         return Pointer({clang_Module_getParent(Module.ptr)});
                       }));
  emscripten::function(
      "clang_Module_getName", emscripten::optional_override([](Pointer Module) {
        return cxStringToStdString(clang_Module_getName(Module.ptr));
      }));
  emscripten::function("clang_Module_getFullName",
                       emscripten::optional_override([](Pointer Module) {
                         return cxStringToStdString(
                             clang_Module_getFullName(Module.ptr));
                       }));
  emscripten::function("clang_Module_isSystem",
                       emscripten::optional_override([](Pointer Module) {
                         return clang_Module_isSystem(Module.ptr);
                       }));
  emscripten::function(
      "clang_Module_getNumTopLevelHeaders",
      emscripten::optional_override([](Pointer TU, Pointer Module) {
        return clang_Module_getNumTopLevelHeaders(
            static_cast<CXTranslationUnit>(TU.ptr), Module.ptr);
      }));
  emscripten::function(
      "clang_Module_getTopLevelHeader",
      emscripten::optional_override(
          [](Pointer TU, Pointer Module, unsigned Index) {
            return Pointer({clang_Module_getTopLevelHeader(
                static_cast<CXTranslationUnit>(TU.ptr), Module.ptr, Index)});
          }));
  emscripten::function("clang_CXXConstructor_isConvertingConstructor",
                       &clang_CXXConstructor_isConvertingConstructor);
  emscripten::function("clang_CXXConstructor_isCopyConstructor",
                       &clang_CXXConstructor_isCopyConstructor);
  emscripten::function("clang_CXXConstructor_isDefaultConstructor",
                       &clang_CXXConstructor_isDefaultConstructor);
  emscripten::function("clang_CXXConstructor_isMoveConstructor",
                       &clang_CXXConstructor_isMoveConstructor);
  emscripten::function("clang_CXXField_isMutable", &clang_CXXField_isMutable);
  emscripten::function("clang_CXXMethod_isDefaulted",
                       &clang_CXXMethod_isDefaulted);
  emscripten::function("clang_CXXMethod_isPureVirtual",
                       &clang_CXXMethod_isPureVirtual);
  emscripten::function("clang_CXXMethod_isStatic", &clang_CXXMethod_isStatic);
  emscripten::function("clang_CXXMethod_isVirtual", &clang_CXXMethod_isVirtual);
  emscripten::function("clang_CXXRecord_isAbstract",
                       &clang_CXXRecord_isAbstract);
  emscripten::function("clang_EnumDecl_isScoped", &clang_EnumDecl_isScoped);
  emscripten::function("clang_CXXMethod_isConst", &clang_CXXMethod_isConst);
  emscripten::function("clang_getTemplateCursorKind",
                       &clang_getTemplateCursorKind);
  emscripten::function("clang_getSpecializedCursorTemplate",
                       &clang_getSpecializedCursorTemplate);
  emscripten::function("clang_getCursorReferenceNameRange",
                       &clang_getCursorReferenceNameRange);
  emscripten::enum_<CXNameRefFlags>("CXNameRefFlags")
      .value("WantQualifier", CXNameRange_WantQualifier)
      .value("WantTemplateArgs", CXNameRange_WantTemplateArgs)
      .value("WantSinglePiece", CXNameRange_WantSinglePiece);
  emscripten::enum_<CXTokenKind>("CXTokenKind")
      .value("CXToken_Punctuation", CXToken_Punctuation)
      .value("CXToken_Keyword", CXToken_Keyword)
      .value("CXToken_Identifier", CXToken_Identifier)
      .value("CXToken_Literal", CXToken_Literal)
      .value("CXToken_Comment", CXToken_Comment);
  emscripten::class_<CXToken>("CXToken");
  emscripten::function(
      "clang_getToken",
      emscripten::optional_override([](Pointer TU, CXSourceLocation Location) {
        return clang_getToken(static_cast<CXTranslationUnit>(TU.ptr), Location);
      }),
      emscripten::allow_raw_pointers());
  emscripten::function("clang_getTokenKind", &clang_getTokenKind);
  emscripten::function(
      "clang_getTokenSpelling",
      emscripten::optional_override([](Pointer TU, CXToken Token) {
        return cxStringToStdString(clang_getTokenSpelling(
            static_cast<CXTranslationUnit>(TU.ptr), Token));
      }));
  emscripten::function(
      "clang_getTokenLocation",
      emscripten::optional_override([](Pointer TU, CXToken Token) {
        return clang_getTokenLocation(static_cast<CXTranslationUnit>(TU.ptr),
                                      Token);
      }));
  emscripten::function(
      "clang_getTokenExtent",
      emscripten::optional_override([](Pointer TU, CXToken Token) {
        return clang_getTokenExtent(static_cast<CXTranslationUnit>(TU.ptr),
                                    Token);
      }));
  // skipped clang_tokenize
  // skipped clang_annotateTokens
  // skipped clang_disposeTokens
  emscripten::function("clang_getCursorKindSpelling",
                       emscripten::optional_override([](CXCursorKind Kind) {
                         return cxStringToStdString(
                             clang_getCursorKindSpelling(Kind));
                       }));
  // skipped clang_getDefinitionSpellingAndExtent
  // skipped clang_getDefinitionSpellingAndExtent
  emscripten::function("clang_enableStackTraces", &clang_enableStackTraces);
  // clang_executeOnThread
  emscripten::class_<CXCompletionResult>("CXCompletionResult")
      .property("CursorKind", &CXCompletionResult::CursorKind);
  emscripten::enum_<CXCompletionChunkKind>("CXCompletionChunkKind")
      .value("Optional", CXCompletionChunk_Optional)
      .value("TypedText", CXCompletionChunk_TypedText)
      .value("Text", CXCompletionChunk_Text)
      .value("Placeholder", CXCompletionChunk_Placeholder)
      .value("Informative", CXCompletionChunk_Informative)
      .value("CurrentParameter", CXCompletionChunk_CurrentParameter)
      .value("LeftParen", CXCompletionChunk_LeftParen)
      .value("RightParen", CXCompletionChunk_RightParen)
      .value("LeftBracket", CXCompletionChunk_LeftBracket)
      .value("RightBracket", CXCompletionChunk_RightBracket)
      .value("LeftBrace", CXCompletionChunk_LeftBrace)
      .value("RightBrace", CXCompletionChunk_RightBrace)
      .value("LeftAngle", CXCompletionChunk_LeftAngle)
      .value("RightAngle", CXCompletionChunk_RightAngle)
      .value("Comma", CXCompletionChunk_Comma)
      .value("ResultType", CXCompletionChunk_ResultType)
      .value("Colon", CXCompletionChunk_Colon)
      .value("SemiColon", CXCompletionChunk_SemiColon)
      .value("Equal", CXCompletionChunk_Equal)
      .value("HorizontalSpace", CXCompletionChunk_HorizontalSpace)
      .value("VerticalSpace", CXCompletionChunk_VerticalSpace);
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
  emscripten::enum_<CXVisitorResult>("CXVisitorResult")
      .value("Break", CXVisit_Break)
      .value("Continue", CXVisit_Continue);
  // skipped CXCursorAndRangeVisitor
  emscripten::enum_<CXResult>("CXResult")
      .value("Success", CXResult_Success)
      .value("Invalid", CXResult_Invalid)
      .value("VisitBreak", CXResult_VisitBreak);
  // skipped clang_findReferencesInFile
  // skipped clang_findIncludesInFile
  emscripten::class_<CXIdxLoc>("CXIdxLoc")
      .property("int_data", &CXIdxLoc::int_data);
  emscripten::class_<CXIdxIncludedFileInfo>("CXIdxIncludedFileInfo")
      .property("hashLoc", &CXIdxIncludedFileInfo::hashLoc)
      .property("isImport", &CXIdxIncludedFileInfo::isImport)
      .property("isAngled", &CXIdxIncludedFileInfo::isAngled)
      .property("isModuleImport", &CXIdxIncludedFileInfo::isModuleImport);
  emscripten::class_<CXIdxImportedASTFileInfo>("CXIdxImportedASTFileInfo")
      .property("loc", &CXIdxImportedASTFileInfo::loc)
      .property("isImplicit", &CXIdxImportedASTFileInfo::isImplicit);
  emscripten::enum_<CXIdxEntityKind>("CXIdxEntityKind")
      .value("Unexposed", CXIdxEntity_Unexposed)
      .value("Typedef", CXIdxEntity_Typedef)
      .value("Function", CXIdxEntity_Function)
      .value("Variable", CXIdxEntity_Variable)
      .value("Field", CXIdxEntity_Field)
      .value("EnumConstant", CXIdxEntity_EnumConstant)
      .value("ObjCClass", CXIdxEntity_ObjCClass)
      .value("ObjCProtocol", CXIdxEntity_ObjCProtocol)
      .value("ObjCCategory", CXIdxEntity_ObjCCategory)
      .value("ObjCInstanceMethod", CXIdxEntity_ObjCInstanceMethod)
      .value("ObjCClassMethod ", CXIdxEntity_ObjCClassMethod)
      .value("ObjCProperty ", CXIdxEntity_ObjCProperty)
      .value("ObjCIvar ", CXIdxEntity_ObjCIvar)
      .value("Enum ", CXIdxEntity_Enum)
      .value("Struct ", CXIdxEntity_Struct)
      .value("Union ", CXIdxEntity_Union)
      .value("CXXClass ", CXIdxEntity_CXXClass)
      .value("CXXNamespace ", CXIdxEntity_CXXNamespace)
      .value("CXXNamespaceAlias ", CXIdxEntity_CXXNamespaceAlias)
      .value("CXXStaticVariable ", CXIdxEntity_CXXStaticVariable)
      .value("CXXStaticMethod ", CXIdxEntity_CXXStaticMethod)
      .value("CXXInstanceMethod ", CXIdxEntity_CXXInstanceMethod)
      .value("CXXConstructor ", CXIdxEntity_CXXConstructor)
      .value("CXXDestructor ", CXIdxEntity_CXXDestructor)
      .value("CXXConversionFunction ", CXIdxEntity_CXXConversionFunction)
      .value("CXXTypeAlias ", CXIdxEntity_CXXTypeAlias)
      .value("CXXInterface ", CXIdxEntity_CXXInterface);
  emscripten::enum_<CXIdxEntityLanguage>("CXIdxEntityLanguage")
      .value("None", CXIdxEntityLang_None)
      .value("C", CXIdxEntityLang_C)
      .value("ObjC", CXIdxEntityLang_ObjC)
      .value("CXX", CXIdxEntityLang_CXX)
      .value("Swift", CXIdxEntityLang_Swift);
  emscripten::enum_<CXIdxEntityCXXTemplateKind>("CXIdxEntityCXXTemplateKind")
      .value("NonTemplate", CXIdxEntity_NonTemplate)
      .value("Template", CXIdxEntity_Template)
      .value("TemplatePartialSpecialization",
             CXIdxEntity_TemplatePartialSpecialization)
      .value("TemplateSpecialization", CXIdxEntity_TemplateSpecialization);
  emscripten::enum_<CXIdxAttrKind>("CXIdxAttrKind")
      .value("Unexposed", CXIdxAttr_Unexposed)
      .value("IBAction", CXIdxAttr_IBAction)
      .value("IBOutlet", CXIdxAttr_IBOutlet)
      .value("IBOutletCollection", CXIdxAttr_IBOutletCollection);
  emscripten::class_<CXIdxAttrInfo>("CXIdxAttrInfo")
      .property("kind", &CXIdxAttrInfo::kind)
      .property("cursor", &CXIdxAttrInfo::cursor)
      .property("loc", &CXIdxAttrInfo::loc);
  emscripten::class_<CXIdxEntityInfo>("CXIdxEntityInfo")
      .property("kind", &CXIdxEntityInfo::kind)
      .property("templateKind", &CXIdxEntityInfo::templateKind)
      .property("lang", &CXIdxEntityInfo::lang)
      .property("cursor", &CXIdxEntityInfo::cursor)
      .property("numAttributes", &CXIdxEntityInfo::numAttributes);
  emscripten::class_<CXIdxContainerInfo>("CXIdxContainerInfo")
      .property("cursor", &CXIdxContainerInfo::cursor);
  emscripten::class_<CXIdxIBOutletCollectionAttrInfo>(
      "CXIdxIBOutletCollectionAttrInfo")
      .property("classCursor", &CXIdxIBOutletCollectionAttrInfo::classCursor)
      .property("classLoc", &CXIdxIBOutletCollectionAttrInfo::classLoc);
  emscripten::enum_<CXIdxDeclInfoFlags>("CXIdxDeclInfoFlags")
      .value("Skipped", CXIdxDeclFlag_Skipped);
  emscripten::class_<CXIdxDeclInfo>("CXIdxDeclInfo")
      .property("cursor", &CXIdxDeclInfo::cursor)
      .property("loc", &CXIdxDeclInfo::loc)
      .property("isRedeclaration", &CXIdxDeclInfo::isRedeclaration)
      .property("isDefinition", &CXIdxDeclInfo::isDefinition)
      .property("isContainer", &CXIdxDeclInfo::isContainer)
      .property("isImplicit", &CXIdxDeclInfo::isImplicit)
      .property("numAttributes", &CXIdxDeclInfo::numAttributes)
      .property("flags", &CXIdxDeclInfo::flags);
  emscripten::enum_<CXIdxObjCContainerKind>("CXIdxObjCContainerKind")
      .value("CXIdxObjCContainer_ForwardRef", CXIdxObjCContainer_ForwardRef)
      .value("CXIdxObjCContainer_Interface", CXIdxObjCContainer_Interface)
      .value("CXIdxObjCContainer_Implementation",
             CXIdxObjCContainer_Implementation);
  emscripten::class_<CXIdxObjCContainerDeclInfo>("CXIdxObjCContainerDeclInfo")
      .property("kind", &CXIdxObjCContainerDeclInfo::kind);
  emscripten::class_<CXIdxBaseClassInfo>("CXIdxBaseClassInfo")
      .property("cursor", &CXIdxBaseClassInfo::cursor)
      .property("loc", &CXIdxBaseClassInfo::loc);
  emscripten::class_<CXIdxObjCProtocolRefInfo>("CXIdxObjCProtocolRefInfo")
      .property("cursor", &CXIdxObjCProtocolRefInfo::cursor)
      .property("loc", &CXIdxObjCProtocolRefInfo::loc);
  emscripten::class_<CXIdxObjCProtocolRefListInfo>(
      "CXIdxObjCProtocolRefListInfo")
      .property("numProtocols", &CXIdxObjCProtocolRefListInfo::numProtocols);
  emscripten::class_<CXIdxObjCInterfaceDeclInfo>("CXIdxObjCInterfaceDeclInfo");
  emscripten::class_<CXIdxObjCCategoryDeclInfo>("CXIdxObjCCategoryDeclInfo")
      .property("classCursor", &CXIdxObjCCategoryDeclInfo::classCursor)
      .property("classLoc", &CXIdxObjCCategoryDeclInfo::classLoc);
  emscripten::class_<CXIdxObjCPropertyDeclInfo>("CXIdxObjCPropertyDeclInfo");
  emscripten::class_<CXIdxCXXClassDeclInfo>("CXIdxCXXClassDeclInfo")
      .property("numBases", &CXIdxCXXClassDeclInfo::numBases);
  emscripten::enum_<CXIdxEntityRefKind>("CXIdxEntityRefKind")
      .value("Direct", CXIdxEntityRef_Direct)
      .value("Implicit", CXIdxEntityRef_Implicit);
  emscripten::enum_<CXSymbolRole>("CXSymbolRole")
      .value("None", CXSymbolRole_None)
      .value("Declaration", CXSymbolRole_Declaration)
      .value("Definition", CXSymbolRole_Definition)
      .value("Reference", CXSymbolRole_Reference)
      .value("Read", CXSymbolRole_Read)
      .value("Write", CXSymbolRole_Write)
      .value("Call", CXSymbolRole_Call)
      .value("Dynamic", CXSymbolRole_Dynamic)
      .value("AddressOf", CXSymbolRole_AddressOf)
      .value("Implicit", CXSymbolRole_Implicit);
  emscripten::class_<CXIdxEntityRefInfo>("CXIdxEntityRefInfo")
      .property("kind", &CXIdxEntityRefInfo::kind)
      .property("cursor", &CXIdxEntityRefInfo::cursor)
      .property("loc", &CXIdxEntityRefInfo::loc)
      .property("role", &CXIdxEntityRefInfo::role);
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
  emscripten::class_<Pointer>("Pointer");
  emscripten::function("isNullPointer",
                       emscripten::optional_override(
                           [](const Pointer &p) { return p.ptr == nullptr; }));
}
