export default class ValetCommonTreeView {
    protected _projectslist: {
        name: string,
        link: string,
        path: string,
        version: string,
        isCurrent: boolean
    }[] | undefined;

    constructor(projectsList: any) {
        this._projectslist = projectsList;
    }

    reassignProjects(projectsList: any) {
        this._projectslist = projectsList;

        return this;
    }
}