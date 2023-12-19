'use strict';

import * as vscode from 'vscode';
import logCommand from './Commands/logCommand';
import isolatePHPVersionCommand from './Commands/isolatePHPVersionCommand';
import linkProject from './Commands/linkProjectCommand';
import restartCommand from './Commands/restartCommand';
import secureCommand from './Commands/secureCommand';
import startCommand from './Commands/startCommand';
import stopCommand from './Commands/stopCommand';
import unlinkCommand from './Commands/unlinkCommand';
import unsecureCommand from './Commands/unsecureCommand';
import ValetLinksTreeView from './TreeView/ValetLinksTreeView';
import ValetPHPVersionsTreeView from './TreeView/ValetPHPVersionsTreeView';
import ValetPathsTreeView from './TreeView/ValetPathsTreeView';
import MainWebView from './Webview/MainWebView';
import getValetList from './utils/GetValetList';

export const data = {
    projectslist: getValetList()
}

export function activate(context: vscode.ExtensionContext) {
    let projectslist = data.projectslist;
    let currentProjects = projectslist?.filter((project) => project.isCurrent);
    let linksTreeProvider = new ValetLinksTreeView(projectslist);
    let phpVersionTreeProvider = new ValetPHPVersionsTreeView(projectslist);
    let pathsTreeProvider = new ValetPathsTreeView(projectslist);
    let mainWebview = new MainWebView(currentProjects, context);

    let commands = [
        vscode.commands.registerCommand('laravel-valet.link', linkProject),
        vscode.commands.registerCommand('laravel-valet.unlink', unlinkCommand),
        vscode.commands.registerCommand('laravel-valet.secure', secureCommand),
        vscode.commands.registerCommand('laravel-valet.unsecure', unsecureCommand),
        vscode.commands.registerCommand('laravel-valet.isolate', isolatePHPVersionCommand),
        vscode.commands.registerCommand('laravel-valet.log', logCommand),
        vscode.commands.registerCommand('laravel-valet.restart', restartCommand),
        vscode.commands.registerCommand('laravel-valet.start', startCommand),
        vscode.commands.registerCommand('laravel-valet.stop', stopCommand),
    ]

    vscode.tasks.onDidEndTask((e) => {
        let projectslist = data.projectslist = getValetList();
        currentProjects = projectslist?.filter((project) => project.isCurrent);

        switch (e.execution.task.name) {
            case 'linking':
            case 'unlinking':
            case 'stop':
            case 'start':
                linksTreeProvider.reassignProjects(projectslist).refresh();
                phpVersionTreeProvider.reassignProjects(projectslist).refresh();
                pathsTreeProvider.reassignProjects(projectslist).refresh();
                mainWebview.updateAndRefresh(currentProjects);
                break;

            case 'isolatePHPVersion':
                phpVersionTreeProvider.reassignProjects(projectslist).refresh();
                mainWebview.updateAndRefresh(currentProjects);
                break;

            case 'secureLink':
            case 'unsecureLink':
                linksTreeProvider.reassignProjects(projectslist).refresh();
                mainWebview.updateAndRefresh(currentProjects);
                break
        }
    })

    // Register commands
    context.subscriptions.push(...commands)

    context.subscriptions.push(
        vscode.window.registerWebviewViewProvider('laravel-valet-main', mainWebview)
    );

    context.subscriptions.push(
        vscode.window.createTreeView('laravel-valet-links', {
            treeDataProvider: linksTreeProvider
        })
    );

    context.subscriptions.push(
        vscode.window.createTreeView('laravel-valet-php-versions', {
            treeDataProvider: phpVersionTreeProvider
        })
    )

    context.subscriptions.push(
        vscode.window.createTreeView('laravel-valet-paths', {
            treeDataProvider: pathsTreeProvider,
        })
    )
}

export function deactivate() { }
