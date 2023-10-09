import ts from 'typescript';

export function addImportIfMissing(
  context: ts.TransformationContext,
  importName: string,
  packageName: string,
): ts.Transformer<ts.SourceFile> {
  const hasInjectImport = (node: ts.SourceFile) => {
    let found = false;
    ts.forEachChild(node, childNode => {
      if (ts.isImportDeclaration(childNode)) {
        const importText = childNode.moduleSpecifier.getText();
        if (importText.includes(packageName)) {
          const namedBindings = childNode.importClause?.namedBindings;
          if (namedBindings && ts.isNamedImports(namedBindings)) {
            namedBindings.elements.forEach(element => {
              if (element.name.getText() === importName) {
                found = true;
              }
            });
          }
        }
      }
    });
    return found;
  };

  const addInjectImport = (sourceFile: ts.SourceFile) => {
    const identifier = context.factory.createIdentifier(importName);

    const importInjectorClause = context.factory.createImportClause(
      false,
      undefined,
      context.factory.createNamedImports([
        context.factory.createImportSpecifier(false, identifier, identifier),
      ]),
    );

    const importInjector = context.factory.createImportDeclaration(
      undefined,
      importInjectorClause,
      context.factory.createStringLiteral(packageName),
    );

    const updatedStatements = [importInjector, ...sourceFile.statements];

    return context.factory.updateSourceFile(sourceFile, updatedStatements);
  };

  return sourceFile => {
    if (!hasInjectImport(sourceFile)) {
      return addInjectImport(sourceFile);
    }
    return sourceFile;
  };
}