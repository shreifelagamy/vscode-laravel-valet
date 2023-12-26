import * as path from 'path';
import * as vscode from 'vscode';
import ValetCommonTreeView from './ValetCommonTreeView';

export default class ValetPHPVersionsTreeView extends ValetCommonTreeView implements vscode.TreeDataProvider<Dependency> {
    private _onDidChangeTreeData: vscode.EventEmitter<Dependency | undefined | void> = new vscode.EventEmitter<Dependency | undefined | void>();
    readonly onDidChangeTreeData: vscode.Event<Dependency | undefined | void> = this._onDidChangeTreeData.event;

    constructor(projectsList: any) {
        super(projectsList);
    }

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
        }, async (progress) => {
            return new Promise((resolve) => {
                let versions: Dependency[] = [];

                this._projectslist?.forEach(project => {
                    versions?.push(new Dependency(project.name, project.version, vscode.TreeItemCollapsibleState.None));
                });

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