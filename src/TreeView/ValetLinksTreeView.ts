import * as vscode from 'vscode';
import unlink from '../Commands/unlinkCommand';
import ValetCommonTreeView from './ValetCommonTreeView';
import secureCommand from '../Commands/secureCommand';
import unsecureCommand from '../Commands/unsecureCommand';

export default class ValetLinksTreeView extends ValetCommonTreeView implements vscode.TreeDataProvider<Dependency>
{
    private _onDidChangeTreeData: vscode.EventEmitter<Dependency | undefined | void> = new vscode.EventEmitter<Dependency | undefined | void>();
    readonly onDidChangeTreeData: vscode.Event<Dependency | undefined | void> = this._onDidChangeTreeData.event;

    constructor(projectsList: any) {
        super(projectsList);

        vscode.commands.registerCommand('laravel-valet.openLink', (element) => vscode.env.openExternal(vscode.Uri.parse(element.link)));
    }

    refresh(): void {
        this._onDidChangeTreeData.fire();
    }

    getTreeItem(element: Dependency): vscode.TreeItem {
        return element;
    }

    getChildren(element?: Dependency): Thenable<Dependency[] | undefined> {
        const links: Thenable<Dependency[] | undefined> = vscode.window.withProgress({
            location: {
                viewId: 'laravel-valet-links'
            },
            title: "Loading links...",
        }, async (progress) => {
            return new Promise((resolve) => {
                let links: Dependency[] = [];

                this._projectslist?.forEach(project => {
                    links.push(new Dependency(project.name, project.link, vscode.TreeItemCollapsibleState.None));
                })

                resolve(links);
            })
        });

        return links
    }
}

export class Dependency extends vscode.TreeItem {

    iconName: string;

    constructor(
        public readonly name: string,
        public readonly link: string,
        public readonly collapsibleState: vscode.TreeItemCollapsibleState,
        public readonly command?: vscode.Command
    ) {
        super(name, collapsibleState);

        this.tooltip = name;
        this.description = link;

        this.iconName = link.includes('https') ? 'lock' : 'unlock';

        this.iconPath = new vscode.ThemeIcon(this.iconName),

        this.contextValue = link.includes('https') ? 'link-secured' : 'link-unsecured';
    }
}