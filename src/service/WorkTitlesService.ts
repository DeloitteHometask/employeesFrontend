import { Observable } from "rxjs";
import WorkTitle from "../model/WorkTitle";

export default interface WorkTitleService {
    addWorkTitle(wt: WorkTitle): Promise<WorkTitle>;
    getWorkTitles(): Observable<WorkTitle[] | string>;
    deleteWorkTitle(id: any): Promise<void>;
    updateWorkTitle(wt: WorkTitle): Promise<WorkTitle>;
}