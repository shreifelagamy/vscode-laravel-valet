import * as vscode from 'vscode';
import { getEventBus } from '../support/event-bus';
import { runTaskSafely } from '../support/task-runner';
import type { ValetProject } from '../types/valet';
import GetWorkspaceFsPath from '../utils/GetWorkspaceFsPath';

/**
 * Valet service that provides access to all valet commands
 */
class Valet {
    /**
     * Link the current directory
     * @param name Project name
     */
    async link(providedName?: string): Promise<boolean> {
        const filePath = await GetWorkspaceFsPath();

        // If name not provided, prompt for it
        const name = providedName || await vscode.window.showInputBox({
            prompt: "Enter project name"
        });

        if (!name || name.length === 0) {
            vscode.window.showErrorMessage('Project name cannot be empty');
            return false;
        }

        const success = await runTaskSafely('Link Project', `valet link ${name}`, {
            cwd: filePath
        });

        if (success) {
            getEventBus().emit('valet:refresh', undefined);
        }

        return success;
    }

    /**
     * Unlink a project
     * @param project The project to unlink
     */
    async unlink(project?: ValetProject): Promise<boolean> {
        let success: boolean;
        if (!project) {
            const filePath = await GetWorkspaceFsPath();
            success = await runTaskSafely('Unlink Project', 'valet unlink', {
                cwd: filePath
            });
        } else {
            success = await runTaskSafely('Unlink Project', `valet unlink ${project.name}`, {
                cwd: project.path
            });
        }

        if (success) {
            getEventBus().emit('valet:refresh', undefined);
        }

        return success;
    }

    /**
     * Secure a project with HTTPS
     * @param project The project to secure
     */
    async secure(project?: ValetProject): Promise<boolean> {
        if (!project) {
            const filePath = await GetWorkspaceFsPath();
            const success = await runTaskSafely('Secure Project', 'valet secure', {
                cwd: filePath
            });
            if (success) {
                getEventBus().emit('valet:refresh', undefined);
            }
            return success;
        }

        const success = await runTaskSafely('Secure Project', `valet secure ${project.name}`, {
            cwd: project.path
        });

        if (success) {
            getEventBus().emit('valet:refresh', undefined);
        }

        return success;
    }

    /**
     * Remove HTTPS from a project
     * @param project The project to unsecure
     */
    async unsecure(project?: ValetProject): Promise<boolean> {
        if (!project) {
            const filePath = await GetWorkspaceFsPath();
            const success = await runTaskSafely('Unsecure Project', 'valet unsecure', {
                cwd: filePath
            });
            if (success) {
                getEventBus().emit('valet:refresh', undefined);
            }
            return success;
        }

        const success = await runTaskSafely('Unsecure Project', `valet unsecure ${project.name}`, {
            cwd: project.path
        });

        if (success) {
            getEventBus().emit('valet:refresh', undefined);
        }

        return success;
    }

    /**
     * Isolate PHP version for a project
     * @param project The project to isolate
     * @param version PHP version to use
     */
    async isolate(project: ValetProject, providedVersion?: string): Promise<boolean> {
        // If version not provided, prompt for it
        const version = providedVersion || await vscode.window.showInputBox({
            prompt: "Enter PHP version (e.g., 8.2)",
            placeHolder: "Leave empty to unisolate PHP version"
        });

        // If cancelled
        if (version === undefined) {
            return false;
        }

        let success: boolean;

        // If empty string, unisolate
        if (version === "") {
            success = await runTaskSafely('Unisolate PHP Version', `valet unisolate --site=${project.name}`, {
                cwd: project.path
            });
        } else if (/^([0-9]+\.[0-9]+)$/.test(version)) {
            success = await runTaskSafely('Isolate PHP Version', `valet isolate --site=${project.name} php@${version}`, {
                cwd: project.path
            });
        } else {
            vscode.window.showErrorMessage('Invalid PHP version');
            return false;
        }

        if (success) {
            getEventBus().emit('valet:refresh', undefined);
        }

        return success;
    }

    /**
     * View the valet log
     */
    async log(): Promise<boolean> {
        return runTaskSafely('View Log', 'valet log');
    }

    /**
     * Start the valet service
     */
    async start(): Promise<boolean> {
        return runTaskSafely('Start Valet', 'valet start');
    }

    /**
     * Stop the valet service
     */
    async stop(): Promise<boolean> {
        return runTaskSafely('Stop Valet', 'valet stop');
    }

    /**
     * Restart the valet service
     */
    async restart(): Promise<boolean> {
        const success = await runTaskSafely('Restart Valet', 'valet restart');

        if (success) {
            getEventBus().emit('valet:refresh', undefined);
        }

        return success;
    }

    /**
     * Get all linked projects
     */
    async links(): Promise<boolean> {
        return runTaskSafely('Get Links', 'valet links');
    }
}

// Export a singleton instance
export const valet = new Valet();
