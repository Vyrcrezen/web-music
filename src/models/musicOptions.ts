export type MusicOptions = {
    tagsEvery?: string; // string of comma separated values!
    tagsAny?: string; // string of comma separated values!

    artistEvery?: string; // string of comma separated values!
    artistAny?: string; // string of comma separated values!

    uploaderNameEvery?: string; // string of comma separated values!
    uploaderNameAny?: string; // string of comma separated values!

    uploadTimeRangeStart?: number;
    uploadTimeRangeEnd?: number;

    releaseTimeRangeStart?: number;
    releaseTimeRangeEnd?: number;

    myFavourites?: boolean;
    limit?: number;

    paginationPage?: number,
    musicId?: string,

    excludeMusicIds?: string; // string of comma separated values!
    omitLoadingMusic: boolean;

    order?: [
        'uploadTimeAsc',
        'uploadTimeDesc',
        'releaseTimeAsc',
        'releaseTimeDesc',
        'playsAsc',
        'playsDesc',
        'favouritesAsc',
        'favouritesDesc'
    ],

    [prop: string]: string | string[] | number | number | boolean | undefined;
}

export class MusicOptionsValidatable {
    
}
