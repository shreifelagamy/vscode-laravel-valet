import * as vscode from 'vscode';
import { data } from '../extension';

export default async (element: any) => {
    if (element == undefined) {
        const projectslist = data.projectslist;

        if (projectslist != undefined && projectslist?.length == 0) {
            vscode.window.showErrorMessage('No projects found');
            return;
        }

        const projectNames= projectslist?.map(project => project.name);

        if( projectNames == undefined ) {
            vscode.window.showErrorMessage('No projects found');
            return;
        }

        const selectProjectName = await vscode.window.showQuickPick(projectNames, {
            placeHolder: 'Select a project',
        })

        if (selectProjectName == undefined) {
            vscode.window.showErrorMessage('Project name cannot be empty');
            return;
        }

        element = projectslist?.filter(project => project.name == selectProjectName)[0];
    }

    vscode.window.showInformationMessage(`Are you sure you want to unlink ${element.name}?`, 'Yes', 'No')
        .then((answer) => {
            if (answer == 'Yes') {
                vscode.window.withProgress({
                    location: {
                        viewId: 'laravel-valet-links'
                    },
                    title: "unlinking...",
                }, async (progress) => {
                    const shellExecution = new vscode.ShellExecution(`valet unlink ${element.name}`);
                    const task = new vscode.Task({ type: 'shell' }, vscode.TaskScope.Workspace, 'unlinking', 'valet', shellExecution);
                    vscode.tasks.executeTask(task)
                    return new Promise((resolve) => resolve([]));
                });
            }
        });
}