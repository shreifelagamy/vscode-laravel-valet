import * as vscode from 'vscode';
export default () => {
    vscode.window.withProgress({
        location: {
            viewId: 'laravel-valet-main'
        },
        title: 'Stoping valet...',
    }, async (progress) => {
        const shellExecution = new vscode.ShellExecution(`valet stop`);
        const task = new vscode.Task({ type: 'shell' }, vscode.TaskScope.Workspace, 'stop', 'valet', shellExecution);
        vscode.tasks.executeTask(task);
        return new Promise((resolve): void => resolve([]));
    })
}