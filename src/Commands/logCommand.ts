import * as vscode from 'vscode';
export default () => {
    vscode.window.withProgress({
        location: {
            viewId: 'laravel-valet-main'
        },
        title: `Tailling logs...`,
    }, async (progress) => {
        const shellExecution = new vscode.ShellExecution(`valet log`);
        const task = new vscode.Task({ type: 'shell' }, vscode.TaskScope.Workspace, `log`, 'valet', shellExecution);
        vscode.tasks.executeTask(task);
        return new Promise((resolve): void => resolve([]));
    })
}