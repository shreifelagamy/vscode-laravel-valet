import * as vscode from 'vscode';
import { registerCommands } from './commands/registerCommands';
import { getValetProjects } from './services/valet-projects';
import { getEventBus } from './support/event-bus';
import { info } from './support/logger';
import MainWebView from './views/main-web-view';
import ValetLinksTreeView from './views/valet-links-tree-view';
import ValetPathsTreeView from './views/valet-paths-tree-view';
import ValetPHPVersionsTreeView from './views/valet-php-versions-tree-view';

export async function activate(context: vscode.ExtensionContext) {
    let projects = await getValetProjects();

    // Register Commands
    registerCommands(context);

    // Register Webview
    const mainProvider = new MainWebView(projects, context);

    // Register Tree Views
    const linksProvider = new ValetLinksTreeView(projects);
    const pathsProvider = new ValetPathsTreeView(projects);
    const phpVersionsProvider = new ValetPHPVersionsTreeView(projects);

    // Register providers in VSCode
    context.subscriptions.push(
        vscode.window.registerWebviewViewProvider('laravel-valet-main', mainProvider),
        vscode.window.registerTreeDataProvider('laravel-valet-links', linksProvider),
        vscode.window.registerTreeDataProvider('laravel-valet-paths', pathsProvider),
        vscode.window.registerTreeDataProvider('laravel-valet-php-versions', phpVersionsProvider),
    );

    // Set up refresh listener
    const eventBus = getEventBus();
    const refreshHandler = async () => {
        projects = await getValetProjects();
        if (projects) {
            mainProvider.updateAndRefresh(projects);
            linksProvider.reassignProjects(projects);
            pathsProvider.reassignProjects(projects);
            phpVersionsProvider.reassignProjects(projects);
        }
    };
    eventBus.on('valet:refresh', refreshHandler);

    // Add cleanup to remove event listener
    context.subscriptions.push(
        new vscode.Disposable(() => {
            eventBus.off('valet:refresh', refreshHandler);
        })
    );

    info('Laravel Valet extension activated');
}

export function deactivate() { }
