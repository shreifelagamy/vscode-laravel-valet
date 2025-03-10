import type { ValetProject } from '../types/valet';

export default class ValetCommonTreeView {
    protected _projectslist: ValetProject[] | undefined;

    constructor(projectsList: ValetProject[]) {
        this._projectslist = projectsList;
    }

    reassignProjects(projectsList: ValetProject[]) {
        this._projectslist = projectsList;

        return this;
    }
}