
export function parseBlobMeta(blobString: string) {

    if (!blobString.includes('data:') || !blobString.includes('/') || !blobString.includes(';') || !blobString.includes(',')) {
        throw new Error('Input argument is not a blob string!');
    }

    const blobHeader = blobString.substring(blobString.indexOf(':')+1, blobString.indexOf(','))

    const blobMeta = {
        type: blobHeader.substring(0, blobHeader.indexOf(';')),
        extension: blobHeader.substring(blobHeader.indexOf('/')+1, blobHeader.indexOf(';')),
        encoding: blobHeader.substring(blobHeader.indexOf(';')+1) as BufferEncoding,
        full: blobString.substring(0, blobString.indexOf(',')+1)
    }

    return blobMeta;
}
