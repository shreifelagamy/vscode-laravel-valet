import * as cp from 'child_process';
import * as vscode from 'vscode';

export default function getValetList() {
    const workspaces = vscode.workspace.workspaceFolders
    const output = cp.execSync("valet links");
    const result = JSON.stringify(output.toString()).match(/\/{1}[^\s|.]+/gm);

    let projectslist: {
        name: string,
        link: string,
        path: string,
        version: string,
        isCurrent: boolean
    }[] | undefined;

    if (result) {
        let pathsArr = [];

        for (let index = 0; index < result.length; index += 2) {
            pathsArr.push({
                key: result[index],
                value: result[index + 1]
            });
        }

        const paths = pathsArr.map(element => {
            return {
                key: element.key.replace("//", ""),
                value: element.value
            };
        });      
        
        let versions = [...output.toString().matchAll(/php@([0-9.0-9]+)/gm)];

        if(versions.length === 0) {
            versions = [...output.toString().matchAll(/([0-9]+\.[0-9]+)/gm)];
        }

        projectslist = JSON.stringify(output.toString()).match(/https?:[^\s|]+/gm)?.map((link, index) => {
            let name = [...link.matchAll(/^https?:\/\/([^.]+)\./gm)]
            let isCurrentProject: boolean = false;

            workspaces?.map(workspace => {
                if (workspace.uri.path === paths[index].value) {
                    isCurrentProject = true;

                    return;
                }
            });

            return {
                name: name[0][1],
                link: link,
                path: paths[index].value,
                version: versions[index][1],
                isCurrent: isCurrentProject
            };
        });

    }

    return projectslist;
}

export let projectslist = getValetList();