import * as path from 'node:path';
import * as vscode from 'vscode';
import type { ValetProject } from '../types/valet';
import ValetCommonTreeView from './valet-common-tree-view';
import { valet } from '../services/valet';

export default class ValetPHPVersionsTreeView extends ValetCommonTreeView implements vscode.TreeDataProvider<Dependency>, vscode.Disposable {
    private _onDidChangeTreeData: vscode.EventEmitter<Dependency | undefined> = new vscode.EventEmitter<Dependency | undefined>();
    readonly onDidChangeTreeData: vscode.Event<Dependency | undefined> = this._onDidChangeTreeData.event;

    private readonly disposables: vscode.Disposable[] = [];

    constructor(projectsList: ValetProject[]) {
        super(projectsList);

        // Register isolate command
        this.disposables.push(
            vscode.commands.registerCommand('laravel-valet.isolate', async (project: { name: string; path: string; version: string }) => {
                await valet.isolate({ name: project.name, path: project.path } as ValetProject);
            })
        );
    }

    refresh(): void {
        this._onDidChangeTreeData.fire(undefined);
    }

    getTreeItem(element: Dependency): vscode.TreeItem {
        return element;
    }

    dispose(): void {
        for (const disposable of this.disposables) {
            disposable.dispose();
        }
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
                        versions.push(new Dependency(project.name, project.version, project.path, vscode.TreeItemCollapsibleState.None));
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
        public readonly path: string,
        public readonly collapsibleState: vscode.TreeItemCollapsibleState,
        public readonly command?: vscode.Command
    ) {
        super(name, collapsibleState);

        this.tooltip = name;
        this.description = version;

        // Add command to handle isolate
        this.command = {
            command: 'laravel-valet.isolate',
            title: 'Isolate PHP Version',
            arguments: [{ name: this.name, path: this.path, version: this.version }]
        };
    }

    iconPath = {
        light: path.join(__filename, '..', '..', '..', 'resources', 'light', 'php-logo.svg'),
        dark: path.join(__filename, '..', '..', '..', 'resources', 'dark', 'php-logo.svg')
    };

    contextValue = 'dependency';
}
