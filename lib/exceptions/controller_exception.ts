export class ControllerError extends Error {
    public status: number;

    constructor(message: string, status?: number) {
        super(message);
        this.status = status || 404;
    }
}