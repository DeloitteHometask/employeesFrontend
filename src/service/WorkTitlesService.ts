import { Observable } from "rxjs";
import WorkTitle from "../model/WorkTitle";

export default interface WorkTitleService {
    addWorkTitle(wt: WorkTitle): Promise<WorkTitle>;
    getWorkTitles(): Observable<WorkTitle[] | string>;
}