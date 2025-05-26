class CustomError extends Error {
    code: number;

    errorCode?: string;

    constructor({
        code,
        message,
        // eslint-disable-next-line camelcase
        error_code
    }: {
        code: number;
        message: string;
        // eslint-disable-next-line camelcase
        error_code?: string;
    }) {
        super(message);
        this.code = code;
        // eslint-disable-next-line camelcase
        this.errorCode = error_code;
    }
}

export default CustomError;
