import * as vscode from 'vscode';
import GetWorkspaceFsPath from '../utils/GetWorkspaceFsPath';
import { getEventBus } from '../support/event-bus';

export default async () => {
    const filePath = await GetWorkspaceFsPath();

    const name = await vscode.window.showInputBox({
        prompt: "Enter project name",
    })

    if (name?.length === 0) {
        vscode.window.showErrorMessage('Project name cannot be empty');
        return;
    }

    vscode.window.withProgress({
        location: vscode.ProgressLocation.Notification,
        title: "linking...",
    }, async (progress) => {
        try {
            const shellExecution = new vscode.ShellExecution(`valet link ${name}`, { cwd: filePath });
            const task = new vscode.Task(
                { type: 'shell' },
                vscode.TaskScope.Workspace,
                'linking',
                'valet',
                shellExecution
            );
            await vscode.tasks.executeTask(task);

            const eventBus = getEventBus();
            // Emit event after successful linking
            eventBus.emit('project:linked', { path: filePath });
            // Trigger refresh to update all views
            eventBus.emit('valet:refresh', undefined);

            vscode.window.showInformationMessage(`Project "${name}" linked successfully`);
        } catch (error) {
            vscode.window.showErrorMessage(`Failed to link project: ${error}`);
        }
    });
}
