import * as vscode from 'vscode';
import { getEventBus } from '../support/event-bus';
import type { ValetProject } from '../types/valet';
import ValetCommonTreeView from './valet-common-tree-view';

export default class ValetLinksTreeView extends ValetCommonTreeView implements vscode.TreeDataProvider<Dependency> {
    private _onDidChangeTreeData: vscode.EventEmitter<Dependency | undefined> = new vscode.EventEmitter<Dependency | undefined>();
    readonly onDidChangeTreeData: vscode.Event<Dependency | undefined> = this._onDidChangeTreeData.event;

    private readonly disposables: vscode.Disposable[] = [];

    constructor(projectsList: ValetProject[]) {
        super(projectsList);

        // Register command
        this.disposables.push(
            vscode.commands.registerCommand('laravel-valet.openLink', (element) => {
                vscode.env.openExternal(vscode.Uri.parse(element.link));
            })
        );

        const eventBus = getEventBus();

        // Listen to events
        const refreshHandler = () => this.refresh();
        eventBus.on('valet:refresh', refreshHandler);

        const projectLinkedHandler = ({ path }: { path: string }) => {
            this.refresh();
        };
        eventBus.on('project:linked', projectLinkedHandler);

        const projectUnlinkedHandler = ({ path }: { path: string }) => {
            this.refresh();
        };
        eventBus.on('project:unlinked', projectUnlinkedHandler);

        // Store cleanup functions
        this.disposables.push(new vscode.Disposable(() => {
            eventBus.off('valet:refresh', refreshHandler);
            eventBus.off('project:linked', projectLinkedHandler);
            eventBus.off('project:unlinked', projectUnlinkedHandler);
        }));
    }

    refresh(): void {
        this._onDidChangeTreeData.fire();
    }

    getTreeItem(element: Dependency): vscode.TreeItem {
        return element;
    }

    getChildren(element?: Dependency): Thenable<Dependency[] | undefined> {
        return vscode.window.withProgress({
            location: {
                viewId: 'laravel-valet-links'
            },
            title: "Loading links...",
        }, async () => {
            const links: Dependency[] = [];

            if (this._projectslist) {
                for (const project of this._projectslist) {
                    links.push(new Dependency(project.name, project.link, vscode.TreeItemCollapsibleState.None));
                }
            }

            return links;
        });
    }

    dispose(): void {
        for (const disposable of this.disposables) {
            disposable.dispose();
        }
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
        this.iconPath = new vscode.ThemeIcon(this.iconName);
        this.contextValue = link.includes('https') ? 'link-secured' : 'link-unsecured';
    }
}
