import * as vscode from 'vscode';
import ValetCommonTreeView from './ValetCommonTreeView';

export default class ValetPathsTreeView extends ValetCommonTreeView implements vscode.TreeDataProvider<Dependency> {
    private _onDidChangeTreeData: vscode.EventEmitter<Dependency | undefined | void> = new vscode.EventEmitter<Dependency | undefined | void>();
    readonly onDidChangeTreeData: vscode.Event<Dependency | undefined | void> = this._onDidChangeTreeData.event;

    constructor(projectsList: any) {
        super(projectsList);

        vscode.commands.registerCommand('laravel-valet.refreshPaths', () => this.refresh());
        vscode.commands.registerCommand('laravel-valet.openPath', (element) => vscode.commands.executeCommand('vscode.openFolder', vscode.Uri.file(element.path), true));
    }

    refresh(): void {
        this._onDidChangeTreeData.fire();
    }

    getTreeItem(element: Dependency): vscode.TreeItem {
        return element;
    }

    getChildren(element?: Dependency): Thenable<Dependency[] | undefined> {
        const paths: Thenable<Dependency[] | undefined> = vscode.window.withProgress({
            location: {
                viewId: 'laravel-valet-paths'
            },
            title: "Loading paths...",
        }, async (progress) => {
            return new Promise((resolve) => {
                let paths: Dependency[] = [];

                this._projectslist?.forEach(project => {
                    paths?.push(new Dependency(project.name, project.path, vscode.TreeItemCollapsibleState.None));
                });

                resolve(paths)
            })
        });

        return paths;
    }
}

export class Dependency extends vscode.TreeItem {
    constructor(
        public readonly name: string,
        public readonly path: string,
        public readonly collapsibleState: vscode.TreeItemCollapsibleState,
        public readonly command?: vscode.Command
    ) {
        super(name, collapsibleState);

        this.tooltip = path;
        this.description = path;
    }

    iconPath = new vscode.ThemeIcon('folder', new vscode.ThemeColor('filesExplorerIcon.foreground'));

    contextValue = 'dependency';
}