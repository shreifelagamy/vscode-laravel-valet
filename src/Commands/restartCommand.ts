import * as vscode from 'vscode';
export default () => {
    vscode.window.withProgress({
        location: {
            viewId: 'laravel-valet-links'
        },
        title: 'Restarting...',
    }, async (progress) => {
        const shellExecution = new vscode.ShellExecution(`valet restart`);
        const task = new vscode.Task({ type: 'shell' }, vscode.TaskScope.Workspace, 'restart', 'valet', shellExecution);
        vscode.tasks.executeTask(task);
        return new Promise((resolve): void => resolve([]));
    })
};