import { registerDecorator, ValidationOptions, ValidationArguments } from "class-validator";
import { parseBlobMeta } from "../util/parseBlobMeta";

export function IsBlobOfType(blobConstraint: { type?: string, encoding?: string }, validationOptions?: ValidationOptions) {
    
    return function(object: Object, propertyName: string) {

        registerDecorator({
            name: 'IsBlobOfType',
            target: object.constructor,
            propertyName: propertyName,
            constraints: [blobConstraint],
            options: validationOptions,
            validator: {
                validate(value: any, _args: ValidationArguments) {
                    // console.log('args');
                    // console.log(args);

                    try {
                        const blobMeta = parseBlobMeta(value);

                        // console.log('blobMeta, blobConstraint');
                        // console.log(blobMeta);
                        // console.log(blobConstraint);

                        let isValidated = true;

                        if (blobConstraint.type) {
                            if (!(blobConstraint.type === blobMeta.type)) {
                                isValidated = false;
                            }
                        }

                        if (blobConstraint.encoding) {
                            if (!(blobConstraint.encoding === blobMeta.encoding)) {
                                isValidated = false;
                            }
                        }

                        // console.log(`Blob string is validated: ${isValidated}`);

                        return isValidated;
                    }
                    catch { return false; }
                }
            }
        });
    }
}
