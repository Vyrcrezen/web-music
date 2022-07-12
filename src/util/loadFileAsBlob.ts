/**
 * @throws Error
 */
 export function loadFileAsBlob(inputElementId: string) {

    const sourceElement = document.getElementById(inputElementId) as HTMLInputElement;

    if (!sourceElement) { throw new Error(`Couldn't find source element by id: ${inputElementId}`); }

    const sourceFile = (sourceElement.files || [])[0];

    if (!sourceFile) { throw new Error(`Couldn't find source file inside input element with id: ${inputElementId}`); }

    // console.log('Raw file:');
    // console.log(sourceFile);

    const fileReader = new FileReader();
    const blobString: Promise<string> = new Promise((resolve, reject) => {
        fileReader.onload = (() => {
            // console.log('Read file:');
            // console.log(fileReader.result);
    
            if (!fileReader.result) { reject(`Input element with id: ${inputElementId} was empty!`); }
            else { resolve(fileReader.result.toString()); }
        });
    }) 
    fileReader.readAsDataURL(sourceFile);

    return blobString;
}
