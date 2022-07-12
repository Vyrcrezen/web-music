import { musicTags } from "./musicTags";

export class MusicDataType {
    public constructor(
        public id: string,
        public timeUpload: number,
        public uploader: string,
        public timeLatestEdit: number,
        public latestEditBy: string,
        public title: string,
        public artist: string,
        public recordLabel: string,
        public album: string,
        public musicBlob: string,
        public coverImageBlob: string,
        public coverImageTheme: 'dark' | 'light',
        public tags: musicTags[],
        public link: string
    ) {}
}

