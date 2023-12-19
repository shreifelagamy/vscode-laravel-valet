import * as vscode from 'vscode';
import GetWorkspaceFsPath from '../utils/GetWorkspaceFsPath';

export default async () => {
    let filePath = await GetWorkspaceFsPath();

    const name = await vscode.window.showInputBox({
        prompt: "Enter project name",
    })

    if (name?.length == 0) {
        vscode.window.showErrorMessage('Project name cannot be empty');
        return;
    }

    vscode.window.withProgress({
        location: vscode.ProgressLocation.Notification,
        title: "linking...",
    }, async (progress) => {
        const shellExecution = new vscode.ShellExecution(`valet link ${name}`, { cwd: filePath });
        const task = new vscode.Task({ type: 'shell' }, vscode.TaskScope.Workspace, 'linking', 'valet', shellExecution);
        vscode.tasks.executeTask(task)
        return new Promise((resolve) => resolve([]));
    });
}