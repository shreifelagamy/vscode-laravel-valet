import * as vscode from 'vscode';
export default (element: any) => {
    vscode.window.withProgress({
        location: {
            viewId: 'laravel-valet-links'
        },
        title: `secure link...`,
    }, async (progress) => {
        const shellExecution = new vscode.ShellExecution(`valet secure ${element.name}`);
        const task = new vscode.Task({ type: 'shell' }, vscode.TaskScope.Workspace, `secureLink`, 'valet', shellExecution);
        vscode.tasks.executeTask(task);
        return new Promise((resolve): void => resolve([]));
    })
}