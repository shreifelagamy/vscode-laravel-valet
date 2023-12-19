import * as vscode from 'vscode';

export default async (): Promise<string | undefined> => {
    // Get the workspace folders
    const workspaceFolders = vscode.workspace.workspaceFolders;
    let filePath: string | undefined;

    if (workspaceFolders != undefined && workspaceFolders?.length > 1) {
        const projectNames = workspaceFolders.map(folder => folder.name);
        // Show a dropdown with the project names
        const selectedProject = await vscode.window.showQuickPick(projectNames, {
            placeHolder: 'Select a project',
        });

        if (selectedProject?.length == 0) {
            vscode.window.showErrorMessage('Project name cannot be empty');
            return;
        }

        filePath = workspaceFolders.filter(folder => folder.name == selectedProject)[0].uri.path;
    } else {
        filePath = workspaceFolders?.[0].uri.path;
    }

    return filePath;
}