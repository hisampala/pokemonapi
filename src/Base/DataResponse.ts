export class DataRespon<T> {
    private statusCode: number;
    private status: string;
    private data = {} as T;
    constructor(data: T, status?: string, statusCode?: number) {
        this.data = data;
        this.status = status;
        this.statusCode = statusCode;
    
    }
}