import * as vscode from 'vscode';
import { valet } from '../services';
import type { ValetProject } from '../types/valet';
import { info } from '../support/logger';

export function registerCommands(context: vscode.ExtensionContext): void {

    const commands = [
        { id: 'laravel-valet.unsecure', run: (project?: ValetProject) => valet.unsecure(project) },
        { id: 'laravel-valet.secure', run: (project?: ValetProject) => valet.secure(project) },
        { id: 'laravel-valet.link', run: () => valet.link() },
        { id: 'laravel-valet.unlink', run: (project?: ValetProject) => valet.unlink(project) },
        { id: 'laravel-valet.log', run: () => valet.log() },
        { id: 'laravel-valet.restart', run: () => valet.restart() },
        { id: 'laravel-valet.start', run: () => valet.start() },
        { id: 'laravel-valet.stop', run: () => valet.stop() },
        { id: 'laravel-valet.openPath', run: (element: { path: string }) => {
            if (element?.path) {
                vscode.commands.executeCommand('vscode.openFolder', vscode.Uri.file(element.path), true);
            }
        }}

    ];

    for (const command of commands) {
        context.subscriptions.push(vscode.commands.registerCommand(command.id, command.run));
    }
}
