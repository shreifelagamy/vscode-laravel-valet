# Laravel Valet VSCode Extension Conventions

This document outlines the coding conventions and structural guidelines based on the actual implementation patterns found in the codebase.

## 1. File Naming Conventions

### General Rules
- Use kebab-case for all file names
- File names should be descriptive and indicate their purpose
- Add appropriate suffixes based on the file's responsibility

### Specific Naming Patterns
1. **Services**
   - Base service files: `name.ts` (e.g., `valet.ts`)
   - Command services: `name-command.ts` (e.g., `valet-command.ts`)
   - Project services: `name-projects.ts` (e.g., `valet-projects.ts`)

2. **Parsers**
   - Always use `-parser.ts` suffix
   - Describe the type of data being parsed
   - Examples: `link-parser.ts`, `path-parser.ts`, `version-parser.ts`

3. **Views**
   - Tree views: `name-tree-view.ts` (e.g., `valet-links-tree-view.ts`)
   - Web views: `name-web-view.ts` (e.g., `main-web-view.ts`)
   - Common base classes: `name-common-view.ts` (e.g., `valet-common-tree-view.ts`)

## 2. Directory Structure

### src/
Main source code directory with the following organization:

```
src/
├── services/          # Core business logic
│   ├── parsers/      # Data parsing implementations
│   └── factories/    # Object creation and initialization
├── views/            # UI components and views
├── types/            # TypeScript type definitions
├── utils/            # Utility functions
└── support/          # Support infrastructure
```

### Directory Responsibilities

#### services/
- Contains core business logic and service implementations
- Files handle specific functionality domains
- Includes sub-directories for specialized service types:
  - `parsers/`: Handle data transformation and parsing
  - `factories/`: Manage object creation and initialization

**Pattern Example:**
```typescript
// Service class pattern
class ServiceName {
    async methodName(): Promise<boolean> {
        // Implementation
    }
}
```

#### parsers/
- Each parser is responsible for one specific data type
- Parsers return strongly typed data structures
- Follow functional programming patterns

**Pattern Example:**
```typescript
export function parseData(output: string): ParsedType[] | undefined {
    // Parsing implementation
}
```

#### views/
- Implements VSCode's view interfaces
- Organized by view type (tree view, web view)
- Common base classes for shared functionality
- Each view class focuses on a specific display responsibility

**Pattern Example:**
```typescript
export default class FeatureTreeView extends CommonTreeView
    implements vscode.TreeDataProvider<Dependency> {
    // View implementation
}
```

## 3. Code Organization Patterns

### Class Structure
- Extension of base classes when sharing common functionality
- Implementation of VSCode interfaces where required
- Clear separation between public and private methods
- Consistent use of TypeScript features

### Method Patterns
1. **Public Methods**
   - Async methods return Promise<boolean> for operation status
   - Clear parameter typing
   - Consistent error handling

2. **Private Methods**
   - Prefix with underscore (_)
   - Handle internal implementation details
   - Support public method functionality

## 4. Type Safety

### Types Directory Usage
- Define interfaces and types in dedicated files
- Use meaningful names that reflect the data structure
- Export all types for reuse across the codebase

### Type Implementation
- Strong typing for all parameters and return values
- Use of undefined for nullable values
- Consistent interface implementation

## 5. View Implementation Guidelines

### Tree Views
1. **Common Patterns**
   - Extend `ValetCommonTreeView`
   - Implement `vscode.TreeDataProvider`
   - Include refresh mechanism
   - Define clear data model

2. **Required Methods**
   ```typescript
   refresh(): void
   getTreeItem(element: Dependency): vscode.TreeItem
   getChildren(element?: Dependency): Thenable<Dependency[] | undefined>
   ```

### Web Views
1. **Structure**
   - Implement `vscode.WebviewViewProvider`
   - Handle HTML generation
   - Manage view state and updates

2. **Required Methods**
   ```typescript
   resolveWebviewView(webviewView: vscode.WebviewView)
   updateAndRefresh(data: DataType[])
   ```

## 6. Best Practices

### Code Style
- Consistent method naming
- Clear type definitions
- Proper error handling
- Async/await usage for asynchronous operations

### File Organization
- One class per file
- Related functionality grouped in directories
- Clear separation of concerns
- Consistent import ordering

### Documentation
- Update this document when adding new patterns
- Maintain consistent documentation style
- Document complex logic and business rules

## 7. Testing Conventions

### Test File Organization
- Mirror the source directory structure
- Use descriptive test names
- Group related tests together
- Include both unit and integration tests

This document should be used as a reference for maintaining consistency in the codebase and should be updated as new patterns emerge or requirements change.
