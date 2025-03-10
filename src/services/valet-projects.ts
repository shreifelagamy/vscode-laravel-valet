import * as vscode from 'vscode';
import type { ValetProject } from '../types/valet';
import { error as logError } from '../support/logger';
import { getLinks } from './valet-command';
import { parsePaths } from './parsers/path-parser';
import { parseVersions } from './parsers/version-parser';
import { parseLinks } from './parsers/link-parser';
import { createProject } from './factories/project-factory';

export async function getValetProjects(): Promise<ValetProject[] | undefined> {
    try {
        // Get command output
        const output = await getLinks();
        if (!output) {
            return undefined;
        }

        // Parse components
        const paths = parsePaths(output);
        if (!paths) {
            return undefined;
        }

        const versions = parseVersions(output);
        const parsedLinks = parseLinks(output);
        if (!parsedLinks) {
            return undefined;
        }

        // Create projects
        const workspaces = vscode.workspace.workspaceFolders || [];
        return parsedLinks.map((linkInfo, index) =>
            createProject(
                linkInfo.name,
                linkInfo.link,
                paths[index],
                versions[index],
                workspaces
            )
        );
    } catch (error) {
        logError(`Error in getValetProjects: ${error instanceof Error ? error.message : String(error)}`);
        if (error instanceof Error && error.stack) {
            logError(`Stack trace:\n${error.stack}`);
        }
        return undefined;
    }
}
