export const generateErrorWithStatusCode = (customErrorMessage: string, statusCode: number, baseError?: unknown,) => {
    const duplicateError = new Error(customErrorMessage);
    (duplicateError as any).statusCode = statusCode;
    if (baseError) console.error(baseError);
    throw duplicateError;
}