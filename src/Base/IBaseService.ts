import { Observable } from "rxjs";

export interface IBaseService {
    get(): Observable<any>
    getByName(id:string): Observable<any>
    onCreate(item:any):Observable<any>
    onUpdate(id:string,item:any):Observable<any>
    onDelete(id:string):Observable<any>
}
