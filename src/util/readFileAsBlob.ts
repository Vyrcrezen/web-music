import * as fs from 'fs';

export function readFileAsBlob(pathToFile: string) {
    const mPreparedImgData: {fileData: string, fileHeader: string} = {
        fileData: '',
        fileHeader: ''
    };

    if (fs.existsSync(`${pathToFile}`)) {
        let FileExtension = pathToFile.substring(pathToFile.indexOf('.') + 1, pathToFile.length);

        mPreparedImgData.fileData = fs.readFileSync(`${pathToFile}`, { encoding: 'base64' });
        mPreparedImgData.fileHeader = `data:image/${FileExtension};base64`;

        switch(FileExtension.toLowerCase()) {
            case 'jpeg':
            case 'jpg': mPreparedImgData.fileHeader = `data:image/jpeg;base64`;
            break;
            case 'mp3': mPreparedImgData.fileHeader = `data:audio/mpeg;base64`;
            break;
            case 'wav': mPreparedImgData.fileHeader = `data:audio/wav;base64`;
            break;
            default: mPreparedImgData.fileHeader = ``;
        }

    }
    else {
        throw new Error(`Didn't find file at location: ${pathToFile}`);
    }

    return `${mPreparedImgData.fileHeader},${mPreparedImgData.fileData}`;
}
