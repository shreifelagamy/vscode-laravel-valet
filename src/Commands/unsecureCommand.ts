import * as vscode from 'vscode';
export default (element: any) => {
    vscode.window.withProgress({
        location: {
            viewId: 'laravel-valet-links'
        },
        title: `unsecure link...`,
    }, async (progress) => {
        const shellExecution = new vscode.ShellExecution(`valet unsecure ${element.name}`);
        const task = new vscode.Task({ type: 'shell' }, vscode.TaskScope.Workspace, `unsecureLink`, 'valet', shellExecution);
        vscode.tasks.executeTask(task);
        return new Promise((resolve): void => resolve([]));
    })
}