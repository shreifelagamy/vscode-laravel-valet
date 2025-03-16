import * as vscode from 'vscode';
import { valet } from '../services';
import { getEventBus } from '../support/event-bus';
import { info } from '../support/logger';
import type { ValetProject } from '../types/valet';

export default class MainWebView implements vscode.WebviewViewProvider {
    private _view?: vscode.WebviewView;
    private _searchPayload = '';
    private _projects: ValetProject[] | undefined;
    private _currentProjects: ValetProject[] | undefined;
    private _context: vscode.ExtensionContext;

    constructor(projects: ValetProject[], context: vscode.ExtensionContext) {
        this._projects = projects;
        this._currentProjects = projects?.filter((project) => project.isCurrent);
        this._context = context;
    }

    public resolveWebviewView(webviewView: vscode.WebviewView) {
        this._view = webviewView;

        this._view.webview.options = {
            enableScripts: true
        };

        // Handle VSCode's built-in refresh button
        webviewView.onDidChangeVisibility(() => getEventBus().emit('valet:refresh', undefined));
        this._view.webview.onDidReceiveMessage(
            async data => {
                const currentProject = this._projects?.filter(project => project.name === data.payload)[0];
                switch (data.command) {
                    case 'linkProject':
                        void valet.link();
                        break;

                    case 'unlink':
                        void valet.unlink(currentProject);
                        break;

                    case 'secure':
                        void valet.secure(currentProject);
                        break;

                    case 'unsecure':
                        void valet.unsecure(currentProject);
                        break;

                    case 'isolate':
                        if (currentProject) {
                            void valet.isolate(currentProject);
                        }
                        break;

                    case 'searchProjects':
                        info(`Searching projects for: "${data.payload}"`);
                        this._searchPayload = data.payload;
                        this._search(data.payload);
                        break;

                    case 'open':
                        if (currentProject) {
                            void vscode.commands.executeCommand('vscode.openFolder',
                                vscode.Uri.file(currentProject.path)
                            );
                        }
                        break;
                }
            },
            undefined,
            this._context.subscriptions
        );
        this._view.webview.html = this._getHtmlForWebview();
    }

    public updateAndRefresh(projects: ValetProject[]) {
        this._projects = projects;
        this._currentProjects = projects?.filter((project) => project.isCurrent);

        if (this._view) {
            this._view.webview.html = this._getHtmlForWebview();
            if (this._searchPayload !== '') {
                this._search(this._searchPayload);
            }
        }
    }

    private _getHtmlForWebview(): string {
        let html = this._getStyle();

        if (this._currentProjects && this._currentProjects.length > 0) {
            html += '<ul class="project-list">';
            for (const project of this._currentProjects) {
                html += this._getProjectItemHtml(project);
            }
            html += '</ul>';
        } else {
            html += `
                <p>This project doesn't exist in the list.</p>
                <a class='valet-btn' onclick="linkProject()">Link it</a>
            `;
        }

        html += this._getSearchbarHtml();
        html += this._getScript();

        return html;
    }

    private _search(value: string) {
        let html = '<ul class="project-list search">';
        let matchCount = 0;

        if (value !== '') {
            const searchTerm = value.toLowerCase();
            const filteredProjects = this._projects?.filter(project =>
                project.name.toLowerCase().includes(searchTerm)
            );

            if (filteredProjects) {
                matchCount = filteredProjects.length;
                for (const project of filteredProjects) {
                    html += this._getProjectItemHtml(project, true);
                }
            }
        }

        html += '</ul>';

        info(`Found ${matchCount} projects matching "${value}"`);
        this._view?.webview.postMessage({ command: 'searching-done', payload: html });
    }

    private _getSearchbarHtml(): string {
        return `
            <input placeholder='Search valet projects...' class='valet-search-input' onkeyup="searchData(this)" value="${this._searchPayload}" />
        `;
    }

    private _getProjectItemHtml(project: ValetProject, openFolder = false): string {
        const secureBtn = project.link.includes('https')
            ? `<a class='valet-btn' onclick="doAction('unsecure', '${project.name}')">Unsecure</a>`
            : `<a class='valet-btn' onclick="doAction('secure', '${project.name}')">Secure</a>`;

        const openFolderBtn = openFolder
            ? `<a class='valet-btn' onclick="doAction('open', '${project.name}')">Open folder</a>`
            : '';

        return `
                <li class="project-item">
                    <span class="project-name">${project.name} <span>(${project.version})</span></span>
                    <a href="${project.link}" class="project-link">${project.link}</a>
                    <p class="project-path"> ${project.path}</p>
                    <div class="project-actions">
                        <a class='valet-btn' onclick="doAction('unlink', '${project.name}')">Unlink</a>
                        ${secureBtn}
                        <a class='valet-btn' onclick="doAction('isolate', '${project.name}')">Isolate</a>
                        ${openFolderBtn}
                    </div>
                </li>
                `;
    }

    private _getStyle(): string {
        return `
            <style>
            .project-list {
                list-style: none;
                padding: 0;
                margin-bottom: 1px;
            }

            .project-item {
                padding: 2px 0;
                margin-top: 15px;
            }

            .project-name {
                color: var(--vscode-editor-foreground);
                font-weight: 700;
                font-size: inherit;
                flex: 1;
                white-space: nowrap;
                text-overflow: ellipsis;
                overflow: hidden;
                padding: 0;
                margin: 0;
                text-transform: capitalize;
                display: block;
            }

            .project-name span {
                font-weight: 400;
                font-size: smaller;
            }

            .project-link {
                font-size: small;
            }

            .project-path {
                color: var(--vscode-descriptionForeground);
                margin: 5px 0;
                font-size: smaller;
            }

            .project-actions {
                display: flex;
                gap: 7px;
                margin-bottom: 5px;
            }

            .valet-btn {
                background-color: var(--vscode-button-background);
                color: var(--vscode-button-foreground);
                padding: 5px 10px;
                border: none;
                border-radius: 3px;
                cursor: pointer;
            }

            .valet-search-input {
                width: 100%;
                margin-top: 6px;
                margin-bottom: 7px;
                height: 25px;
                padding: 5px 6px;
                background-color: var(--vscode-input-background);
                color: var(--vscode-input-placeholderForeground);
                border: 1px solid var(--vscode-textBlockQuote-background);
                border-radius: 2px;
            }

            .valet-search-input::placeholder {
                color: var(--vscode-input-placeholderForeground);
            }
            </style>
        `;
    }

    private _getScript(): string {
        return `
            <script>
                const vscode = acquireVsCodeApi();
                function debounce(func, delay) {
                    let timer;

                    return function (...args) {
                      clearTimeout(timer);

                      timer = setTimeout(() => {
                        func.apply(this, args);
                      }, delay);
                    };
                  }

                function linkProject() {
                    // Send a message to the extension
                    vscode.postMessage({
                        command: 'linkProject'
                    });
                }

                function doAction(action, payload) {
                    // Send a message to the extension
                    vscode.postMessage({
                        command: action,
                        payload: payload
                    });
                }

                const searchData = debounce((e) => {
                    vscode.postMessage({
                        command: 'searchProjects',
                        payload: e.value
                    });
                }, 1000);

                window.addEventListener('message', event => {
                    switch (event.data.command) {
                        case 'searching-done':
                            const searchContainer = document.getElementsByClassName('search');
                            if (searchContainer.length > 0) {
                                searchContainer[0].remove();
                            }

                            const projectSearchInput = document.getElementsByClassName('valet-search-input')[0];
                            projectSearchInput.insertAdjacentHTML('afterend', event.data.payload);
                            break;
                    }
                });
            </script>`;
    }
}
