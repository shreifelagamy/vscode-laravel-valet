import * as vscode from 'vscode';
import { info, error as logError, show } from './logger';

/**
 * Options for running a task
 */
interface TaskOptions {
    /** The working directory for the task */
    cwd?: string;
    /** Whether to show a progress notification */
    showProgress?: boolean;
}

/**
 * Format a task name to kebab case (e.g., "Link Project" -> "link-project")
 */
function formatTaskName(name: string): string {
    return name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '');
}

/**
 * Show error message with output button
 * @param message Error message to show
 */
function showErrorWithOutput(message: string): void {
    void vscode.window.showErrorMessage(
        message,
        'Show Output'
    ).then(selection => {
        if (selection === 'Show Output') {
            show();
        }
    });
}

/**
 * Run a task with a specific name and progress notification
 * @param taskName The name of the task for identification
 * @param command The command to execute
 * @param options Task execution options
 * @returns Promise that resolves when the task completes
 */
export async function runTask(taskName: string, command: string, options: TaskOptions = {}): Promise<void> {
    const {
        cwd = process.cwd(),
        showProgress = true
    } = options;

    const formattedTaskName = formatTaskName(taskName);
    info(`Running task "${taskName}": ${command}`);

    const executeTask = async (): Promise<void> => {
        return new Promise((resolve, reject) => {
            const shellExecution = new vscode.ShellExecution(command, { cwd });
            const task = new vscode.Task(
                { type: 'shell' },
                vscode.TaskScope.Workspace,
                formattedTaskName,
                'valet',
                shellExecution
            );

            // Listen for task completion
            const disposable = vscode.tasks.onDidEndTaskProcess((e) => {
                if (e.execution.task === task) {
                    disposable.dispose();
                    if (e.exitCode === 0) {
                        info(`Task "${taskName}" completed successfully`);
                        resolve();
                    } else {
                        const errorMessage = `Task "${taskName}" failed with exit code ${e.exitCode}`;
                        logError(errorMessage);
                        reject(new Error(errorMessage));
                    }
                }
            });

            // Execute the task
            vscode.tasks.executeTask(task).then(undefined, reject);
        });
    };

    if (showProgress) {
        await vscode.window.withProgress({
            location: vscode.ProgressLocation.Notification,
            title: `Running ${taskName}...`,
            cancellable: false
        }, async () => {
            try {
                await executeTask();
            } catch (error) {
                if (error instanceof Error) {
                    showErrorWithOutput(error.message);
                    throw error;
                }
                const errorMessage = `An unknown error occurred while executing task "${taskName}"`;
                logError(errorMessage);
                showErrorWithOutput(errorMessage);
                throw new Error(errorMessage);
            }
        });
    } else {
        await executeTask();
    }
}

/**
 * Run a task safely with error handling
 * @param taskName The name of the task for identification
 * @param command The command to execute
 * @param options Task execution options
 * @returns Promise that resolves to true if successful, false if there was an error
 */
export async function runTaskSafely(taskName: string, command: string, options: TaskOptions = {}): Promise<boolean> {
    try {
        await runTask(taskName, command, options);
        return true;
    } catch (error) {
        const errorMessage = error instanceof Error
            ? `Task "${taskName}" failed: ${error.message}`
            : `An unknown error occurred while executing task "${taskName}"`;
        logError(errorMessage);
        showErrorWithOutput(errorMessage);
        return false;
    }
}
