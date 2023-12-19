import * as vscode from 'vscode';

export default async (element: any) => {
    const version = await vscode.window.showInputBox({
        prompt: 'Enter PHP version',
        placeHolder: "Leave empty to unisolate PHP version"
    });

    if (version == "") {
        _executeCommand(`valet unisolate --site=${element.name}`);
    } else if (version && /^([0-9]+\.[0-9]+)$/.test(version)) {
        _executeCommand(`valet isolate --site=${element.name} php@${version}`);
    } else {
        vscode.window.showErrorMessage('Invalid PHP version');
    }
}

function _executeCommand(command: string) {
    const shellExecution = new vscode.ShellExecution(command);
    const task = new vscode.Task({ type: 'shell' }, vscode.TaskScope.Workspace, 'isolatePHPVersion', 'valet', shellExecution);

    vscode.window.withProgress({
        location: {
            viewId: 'laravel-valet-php-versions'
        },
        title: "Isolating PHP version...",
    }, async (progress) => {
        vscode.tasks.executeTask(task)
        return new Promise((resolve): void => resolve([]));
    });
}