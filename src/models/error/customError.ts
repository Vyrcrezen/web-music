
export class SqlSyntaxError implements Error {
    name: string;
    message: string;
    stack?: string | undefined;

    constructor(error: Error) {
        this.name = error.name;
        this.message = error.message;

        if (error.stack) {
            this.stack = error.stack;
        }
    }
}

export class AlreadyTakenError implements Error {
    name: string;
    message: string;
    stack?: string | undefined;

    constructor(error: Error) {
        this.name = error.name;
        this.message = error.message;

        if (error.stack) {
            this.stack = error.stack;
        }
    }
}
