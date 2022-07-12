
export function parseBlobMeta(blobString: string) {

    if (!blobString.includes('data:') || !blobString.includes('/') || !blobString.includes(';') || !blobString.includes(',')) {
        throw new Error('Input argument is not a blob string!');
    }

    const blobHeader = blobString.substring(blobString.indexOf(':')+1, blobString.indexOf(','))

    const blobMeta = {
        type: blobHeader.substring(0, blobHeader.indexOf(';')),
        encoding: blobHeader.substring(blobHeader.indexOf(';')+1)
    }

    return blobMeta;
}
