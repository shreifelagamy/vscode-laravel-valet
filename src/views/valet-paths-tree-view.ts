import * as vscode from 'vscode';
import type { ValetProject } from '../types/valet';
import ValetCommonTreeView from './valet-common-tree-view';

export default class ValetPathsTreeView extends ValetCommonTreeView implements vscode.TreeDataProvider<Dependency> {
    private _onDidChangeTreeData: vscode.EventEmitter<Dependency | undefined> = new vscode.EventEmitter<Dependency | undefined>();
    readonly onDidChangeTreeData: vscode.Event<Dependency | undefined> = this._onDidChangeTreeData.event;

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
        }, async () => {
            return new Promise((resolve) => {
                const paths: Dependency[] = [];

                if (this._projectslist) {
                    for (const project of this._projectslist) {
                        paths.push(new Dependency(project.name, project.path, vscode.TreeItemCollapsibleState.None));
                    }
                }

                resolve(paths);
            });
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