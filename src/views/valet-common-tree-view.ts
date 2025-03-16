import { getEventBus } from '../support/event-bus';
import type { ValetProject } from '../types/valet';

export default class ValetCommonTreeView {
    protected _projectslist: ValetProject[] | undefined;

    constructor(projectsList: ValetProject[]) {
        this._projectslist = projectsList;

        getEventBus().on('valet:refresh', () => {
            this.refresh();
        });
    }

    reassignProjects(projectsList: ValetProject[]) {
        this._projectslist = projectsList;

        return this;
    }
}