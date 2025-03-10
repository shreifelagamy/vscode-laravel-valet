import * as path from 'node:path';
import * as vscode from 'vscode';
import type { ValetProject } from '../types/valet';
import ValetCommonTreeView from './valet-common-tree-view';

export default class ValetPHPVersionsTreeView extends ValetCommonTreeView implements vscode.TreeDataProvider<Dependency> {
    private _onDidChangeTreeData: vscode.EventEmitter<Dependency | undefined> = new vscode.EventEmitter<Dependency | undefined>();
    readonly onDidChangeTreeData: vscode.Event<Dependency | undefined> = this._onDidChangeTreeData.event;

    refresh(): void {
        this._onDidChangeTreeData.fire();
    }

    getTreeItem(element: Dependency): vscode.TreeItem {
        return element;
    }

    async getChildren(element?: Dependency): Promise<Dependency[] | undefined> {
        const versions: Dependency[] | undefined = await vscode.window.withProgress({
            location: {
                viewId: 'laravel-valet-php-versions'
            },
            title: "Loading PHP versions...",
        }, async () => {
            return new Promise((resolve) => {
                const versions: Dependency[] = [];

                if (this._projectslist) {
                    for (const project of this._projectslist) {
                        versions.push(new Dependency(project.name, project.version, vscode.TreeItemCollapsibleState.None));
                    }
                }

                resolve(versions);
            });
        });

        return versions;
    }
}

export class Dependency extends vscode.TreeItem {
    constructor(
        public readonly name: string,
        public readonly version: string,
        public readonly collapsibleState: vscode.TreeItemCollapsibleState,
        public readonly command?: vscode.Command
    ) {
        super(name, collapsibleState);

        this.tooltip = name;
        this.description = version;
    }

    iconPath = {
        light: path.join(__filename, '..', '..', '..', 'resources', 'light', 'php-logo.svg'),
        dark: path.join(__filename, '..', '..', '..', 'resources', 'dark', 'php-logo.svg')
    };

    contextValue = 'dependency';
}