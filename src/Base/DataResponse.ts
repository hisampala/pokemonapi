export class DataRespon<T> {
    public statusCode: number;
    public status: string;
    public data = {} as T;
    constructor(data: T, status?: string, statusCode?: number) {
        this.data = data;
        this.status = status;
        this.statusCode = statusCode;
    }
}