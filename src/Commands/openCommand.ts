import * as vscode from 'vscode'

export default (element: any) => {
    vscode.commands.executeCommand('vscode.openFolder', vscode.Uri.file(element.path), true);
}