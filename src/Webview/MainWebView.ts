import * as vscode from 'vscode';

export default class MainWebView implements vscode.WebviewViewProvider {
    private _view?: vscode.WebviewView;
    private _currentProjects: {
        name: string,
        link: string,
        path: string,
        version: string,
        isCurrent: boolean
    }[] | undefined;
    private _context: vscode.ExtensionContext;

    constructor(currentProject: any, context: vscode.ExtensionContext) {
        this._currentProjects = currentProject;
        this._context = context;
    }

    public resolveWebviewView(webviewView: vscode.WebviewView) {
        this._view = webviewView;

        this._view.webview.options = {
            enableScripts: true
        };
        this._view.webview.onDidReceiveMessage(
            data => {
                const currentProject = this._currentProjects?.filter(project => project.name == data.payload)[0];
                switch (data.command) {
                    case 'linkProject':
                        vscode.commands.executeCommand('laravel-valet.link');
                        break;

                    case 'unlink':
                        vscode.commands.executeCommand('laravel-valet.unlink', currentProject);
                        break;

                    case 'secure':
                        vscode.commands.executeCommand('laravel-valet.secure', currentProject);
                        break;

                    case 'unsecure':
                        vscode.commands.executeCommand('laravel-valet.unsecure', currentProject);
                        break;

                    case 'isolate':
                        vscode.commands.executeCommand('laravel-valet.isolate', currentProject);
                        break;
                }
            },
            undefined,
            this._context.subscriptions
        )
        this._view.webview.html = this._getHtmlForWebview();
    }

    public updateAndRefresh(currentProject: any) {
        // Update the data
        this._currentProjects = currentProject;

        // Refresh the WebView's HTML
        if (this._view) {
            this._view.webview.html = this._getHtmlForWebview();
        }
    }

    private _getHtmlForWebview(): string {
        let html: string = '';

        if (this._currentProjects != undefined && this._currentProjects?.length > 0) {
            html += `
                <style>
                    table {
                        width: 100%;
                        border-collapse: collapse;
                        margin-bottom: 5px;
                    }
                    th, td {
                        border: none;
                        padding: 2px 3px;
                        text-align: left;
                    }
                    th {
                        color: white;
                    }
                </style>
                `;

            this._currentProjects.forEach((project) => {
                const secureBtn = project.link.includes('https') ?
                    `<button onclick="doAction('unsecure', '${project.name}')">Unsecure</button>` :
                    `<button onclick="doAction('secure', '${project.name}')">Secure</button>`;

                html += `
                <table>
                    <tbody>
                        <tr>
                            <th colspan="2" style="text-transform: uppercase">${project.name}</th>
                        </tr>
                        <tr>
                            <th>Link</th>
                            <td><a href="${project.link}">${project.link}</a></td>
                        </tr>
                        <tr>
                            <th>PHP Version</th>
                            <td>${project.version}</td>
                        </tr>
                        <tr>
                            <th>Path</th>
                            <td>${project.path}</td>
                        </tr>
                        <tr>
                            <td colspan="2">
                                <button onclick="doAction('unlink', '${project.name}')">Unlink</button>
                                ${secureBtn}
                                <button onclick="doAction('isolate', '${project.name}')">Isolate</button>
                            </td>
                        </tr>
                    </tbody>
                </table>
                `
            });

            html += `
            <script>
                const vscode = acquireVsCodeApi();
                function doAction(action, payload) {
                    // Send a message to the extension
                    vscode.postMessage({
                        command: action,
                        payload: payload
                    });
                }
            </script>
            `
        } else {
            html = `<p>This project doesn't exist in the list.</p>
                    <button onclick="linkProject()">Link it</button>
                    <script>
                        const vscode = acquireVsCodeApi();
                        function linkProject() {
                            // Send a message to the extension
                            vscode.postMessage({
                                command: 'linkProject'
                            });
                        }
                    </script>
                    `;
        }

        return html;
    }
}