export function verifyElement<T extends Object>(
    element: unknown,
    type: T,
    designation: string
) : T | never {
    if (!(element instanceof type.constructor)) {
        throw new Error(
            `${designation} is ${
                element instanceof Object
                    ? `an instance of ${element.constructor.name}`
                    : `a(n) ${typeof element}`
            }, and not an instance of ${type.constructor.name}!`
        );
    }
    return element as T;
}

// export function verifyElements<T extends { new (...args: any[]): any }>(elementParameters: {element: unknown, type: T, designation: string}[]) {
//     let verifiedElements = new Array<T>;

//     elementParameters.forEach(param => {
//         if (!(param.element instanceof param.type)) {
//             throw new Error(
//                 `${param.designation} is ${
//                     param.element instanceof Object
//                         ? `an instance of ${param.element.constructor.name}`
//                         : `a(n) ${typeof param.element}`
//                 }, and not an instance of ${param.type.prototype.constructor.name}!`
//             );
//         }
//         verifyElement(param.element, param.type, param.designation);
//         verifiedElements.push(param.element);
//     });

//     return verifiedElements;
// }
