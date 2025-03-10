import * as cp from 'node:child_process';
import * as vscode from 'vscode';
import { info, error as logError, show } from '../support/logger';

export async function executeCommand(command: string): Promise<string | undefined> {
    info(`Executing "${command}" command...`);

    try {
        const output = await cp.execSync(command, { encoding: 'utf-8' });
        info('Command executed successfully');
        info(`Raw output:\n${output}`);
        return output;
    } catch (execError) {
        console.error('[Valet] Error Happend');
        const errorMessage = execError instanceof Error ? execError.message : String(execError);
        logError(`Failed to execute "${command}" command: ${errorMessage}`);

        // Show detailed error message with a button to open output channel
        void vscode.window.showErrorMessage(
            `Laravel Valet: Command '${command}' failed.`,
            'Show Output'
        ).then(selection => {
            if (selection === 'Show Output') {
                show();
            }
        });

        return undefined;
    }
}

export async function getLinks(): Promise<string | undefined> {
    return executeCommand('valet links');
}
