export interface IBaseController {
    get(...item:any):any;
    getByName(...item:any):any
    onCreate(...item:any):any
    onUpdate(...item:any):any
    onDelete(...item:any):any
}

