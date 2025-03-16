import { getEventBus } from '../support/event-bus';
import type { ValetProject } from '../types/valet';

export default abstract class ValetCommonTreeView {
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

    protected abstract refresh(): void;
}