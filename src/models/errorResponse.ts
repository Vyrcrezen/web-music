
export type ErrorResponse = {
    type: string;
    details: Array<{target: string, message: string}>;
}
