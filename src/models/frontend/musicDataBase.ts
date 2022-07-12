import { IsIn, IsNumberString, IsOptional, Length } from "class-validator";
import { IsBlobOfType } from "../../decorators/isBlobOfType";

export type MusicDataType = {
    imageBlob: string;
    musicBlob: string;
    title: string;
    link: string;
    artist: string;
    tags: string;
    album?: string;
    label?: string;
    publisher?: string;
    price?: string | number;
    currency?: string;
}

export class MusicDataBase {
    @IsBlobOfType({type: 'image/jpeg'}, { message: 'Image file must be of type jpg / jpeg' })
    private imageBlob: string;
    @IsBlobOfType({type: 'audio/mpeg'}, { message: 'Music file must be of type mp3 or wav' })
    private musicBlob: string;
    @Length(2, 128, { message: 'Title must be between 2 and 128 characters long!' })
    private title: string;
    @Length(2, 128, { message: 'Link must be between 2 and 128 characters long!' })
    private link: string;
    @Length(2, 64, { message: 'Artist must be between 2 and 64 characters long!' })
    private artist: string;
    private tags: string;
    @IsOptional()
    @Length(2, 64, { message: 'Album must be between 2 and 64 characters long!' })
    private album?: string;
    @IsOptional()
    @Length(2, 64, { message: 'Label must be between 2 and 64 characters long!' })
    private label?: string;
    @IsOptional()
    @Length(2, 64, { message: 'Publisher must be between 2 and 64 characters long!' })
    private publisher?: string;
    @IsOptional()
    @IsNumberString({}, { message: "Price must be a number!" })
    private price?: string;
    @IsOptional()
    @IsIn(['HUF', 'USD', 'EUR'])
    private currency?: string;

    constructor( musicData: MusicDataType ) {
        this.imageBlob = musicData.imageBlob;
        this.musicBlob = musicData.musicBlob;
        this.title = musicData.title;
        this.link = musicData.link;
        this.artist = musicData.artist;
        this.tags = musicData.tags;

        if (musicData) {
            if (musicData.album) { this.album = musicData.album; }
            if (musicData.label) { this.label = musicData.label; }
            if (musicData.publisher) { this.publisher = musicData.publisher; }
            if (musicData.price) {
                this.price = `${musicData.price}`;
                if (musicData.currency) { this.currency = musicData.currency; }
            }
            
        }
    }

    getPreparedData() {
        const preparedData = {
            imageBlob: this.imageBlob,
            musicBlob: this.musicBlob,
            title: this.title,
            link: this.link,
            artist: this.artist,
            tags: this.tags,

            album: this.album,
            label: this.label,
            publisher: this.publisher,
            price: this.price,
            currency: this.currency,
        };

        return preparedData;
    }
}
