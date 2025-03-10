import type * as vscode from 'vscode';
import type { ValetProject, PathMapping } from '../../types/valet';
import { info } from '../../support/logger';

export function createProject(
    name: string,
    link: string,
    path: PathMapping,
    version: string,
    workspaces: readonly vscode.WorkspaceFolder[]
): ValetProject {
    const isCurrentProject = workspaces?.some(
        workspace => workspace.uri.path === path.value
    ) ?? false;

    const project: ValetProject = {
        name,
        link,
        path: path.value,
        version,
        isCurrent: isCurrentProject
    };

    info(`Created project: ${project.name} (${project.link})`);
    return project;
}
