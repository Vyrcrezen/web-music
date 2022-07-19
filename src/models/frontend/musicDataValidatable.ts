import { IsNumber, IsOptional, Length } from "class-validator";
import { IsBlobOfType } from "../../decorators/isBlobOfType";

export type MusicDataType = {
    imageBlob: string;
    musicBlob: string;
    title: string;
    link: string;
    artist: string;
    artist_id?: number;
    tags: string;
    album?: string;
    record_label?: string;
    record_label_id?: number;
    publisher?: string;
    publisher_id?: number;
    // price?: number;
    // currency?: string;
    uploader_id?: number;
    uploader_name?: string;
    upload_time?: number;
    id?: number;

    [prop: string | symbol]: string | symbol | number | undefined;
}

export class MusicDataValidatable {
    @IsBlobOfType({type: 'image/jpeg'}, { message: 'Image file must be of type jpg / jpeg' })
    protected imageBlob: string;
    @IsBlobOfType({type: 'audio/mpeg'}, { message: 'Music file must be of type mp3 or wav' })
    protected musicBlob: string;
    @Length(2, 128, { message: 'title must be between 2 and 128 characters long!' })
    protected title: string;
    @Length(2, 128, { message: 'link must be between 2 and 128 characters long!' })
    protected link: string;
    @Length(2, 64, { message: 'artist must be between 2 and 64 characters long!' })
    protected artist: string;
    @IsOptional()
    @IsNumber({}, { message: "artist_id must be a number!" })
    protected artist_id?: number;
    protected tags: string;
    @IsOptional()
    @Length(2, 64, { message: 'album must be between 2 and 64 characters long!' })
    protected album?: string;
    @IsOptional()
    @Length(2, 64, { message: 'record_label must be between 2 and 64 characters long!' })
    protected record_label?: string;
    @IsOptional()
    @IsNumber({}, { message: "record_label_id must be a number!" })
    protected record_label_id?: number;
    @IsOptional()
    @Length(2, 64, { message: 'publisher must be between 2 and 64 characters long!' })
    protected publisher?: string;
    @IsOptional()
    @IsNumber({}, { message: "publisher_id id must be a number!" })
    protected publisher_id?: number;
    // @IsOptional()
    // @IsNumber({}, { message: "price must be a number!" })
    // protected price?: number;
    // @IsOptional()
    // @IsIn(['HUF', 'USD', 'EUR'])
    // protected currency?: string;
    @IsOptional()
    @IsNumber({}, { message: "uploader_id must be a number!" })
    protected uploader_id?: number;
    @IsOptional()
    protected uploader_name?: string;
    @IsOptional()
    @IsNumber({}, { message: "upload_time must be a posix number!" })
    protected upload_time?: number;
    @IsOptional()
    @IsNumber({}, { message: "id must be a number!" })
    protected id?: number;

    constructor( musicData: MusicDataType ) {
        this.imageBlob = musicData.imageBlob;
        this.musicBlob = musicData.musicBlob;
        this.title = musicData.title;
        this.link = musicData.link;
        this.artist = musicData.artist;
        this.tags = musicData.tags;

        if (musicData) {
            if (musicData.album) { this.album = musicData.album; }
            if (musicData.record_label) { this.record_label = musicData.record_label; }
            if (musicData.publisher) { this.publisher = musicData.publisher; }
            // if (musicData.price) {
            //     this.price = musicData.price;
            //     if (musicData.currency) { this.currency = musicData.currency; }
            // }
            if (musicData.uploader_id) { this.uploader_id = musicData.uploader_id; }
            if (musicData.upload_time) { this.upload_time = musicData.upload_time; }
            if (musicData.artist_id) { this.artist_id = musicData.artist_id; }
            if (musicData.record_label_id) { this.record_label_id = musicData.record_label_id; }
            if (musicData.publisher_id) { this.publisher_id = musicData.publisher_id; }
            if (musicData.id) { this.id = musicData.id; }
            if (musicData.uploader_name) { this.uploader_name = musicData.uploader_name; }
            
        }
    }

    getPreparedData() {
        const preparedData: MusicDataType = {
            imageBlob: this.imageBlob,
            musicBlob: this.musicBlob,
            title: this.title,
            link: this.link,
            artist: this.artist,
            tags: this.tags,

            album: this.album,
            record_label: this.record_label,
            publisher: this.publisher,
            // price: this.price,
            // currency: this.currency,

            uploader_id: this.uploader_id,
            uploader_name: this.uploader_name,
            upload_time: this.upload_time,

            artist_id: this.artist_id,
            record_label_id: this.record_label_id,
            publisher_id: this.publisher_id,
            id: this.id,
        };

        return preparedData;
    }
}
