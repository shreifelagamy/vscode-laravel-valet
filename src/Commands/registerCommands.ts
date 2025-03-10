import * as vscode from 'vscode';
import isolatePHPVersionCommand from './isolatePHPVersionCommand';
import linkProject from './linkProjectCommand';
import logCommand from './logCommand';
import restartCommand from './restartCommand';
import secureCommand from './secureCommand';
import startCommand from './startCommand';
import stopCommand from './stopCommand';
import unlinkCommand from './unlinkCommand';
import unsecureCommand from './unsecureCommand';
import openCommand from './openCommand';

export function registerCommands(context: vscode.ExtensionContext): void {
    const commands = [
        vscode.commands.registerCommand('laravel-valet.link', linkProject),
        vscode.commands.registerCommand('laravel-valet.unlink', unlinkCommand),
        vscode.commands.registerCommand('laravel-valet.secure', secureCommand),
        vscode.commands.registerCommand('laravel-valet.unsecure', unsecureCommand),
        vscode.commands.registerCommand('laravel-valet.isolate', isolatePHPVersionCommand),
        vscode.commands.registerCommand('laravel-valet.log', logCommand),
        vscode.commands.registerCommand('laravel-valet.restart', restartCommand),
        vscode.commands.registerCommand('laravel-valet.start', startCommand),
        vscode.commands.registerCommand('laravel-valet.stop', stopCommand),
        vscode.commands.registerCommand('laravel-valet.openPath', openCommand),
    ];

    context.subscriptions.push(...commands);
}
