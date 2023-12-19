import * as vscode from 'vscode';
export default () => {
    vscode.window.withProgress({
        location: {
            viewId: 'laravel-valet-main'
        },
        title: 'Starting valet...',
    }, async (progress) => {
        const shellExecution = new vscode.ShellExecution(`valet start`);
        const task = new vscode.Task({ type: 'shell' }, vscode.TaskScope.Workspace, 'start', 'valet', shellExecution);
        vscode.tasks.executeTask(task);
        return new Promise((resolve): void => resolve([]));
    })
}