import { IsIn, IsNumber, IsNumberString, IsOptional, Length } from "class-validator";
import { IsBlobOfType } from "../../decorators/isBlobOfType";

export type MusicDataType = {
    imageBlob: string;
    musicBlob: string;
    title: string;
    link: string;
    artist: string;
    artist_id?: string;
    tags: string;
    album?: string;
    record_label?: string;
    record_label_id?: string;
    publisher?: string;
    publisher_id?: string;
    price?: string | number;
    currency?: string;
    uploader_id?: string;
    uploader_name?: string;
    upload_time?: number;
    id?: string;

    [prop: string | symbol]: string | symbol | number | undefined;
}

export class MusicDataValidatable {
    @IsBlobOfType({type: 'image/jpeg'}, { message: 'Image file must be of type jpg / jpeg' })
    protected imageBlob: string;
    @IsBlobOfType({type: 'audio/mpeg'}, { message: 'Music file must be of type mp3 or wav' })
    protected musicBlob: string;
    @Length(2, 128, { message: 'Title must be between 2 and 128 characters long!' })
    protected title: string;
    @Length(2, 128, { message: 'Link must be between 2 and 128 characters long!' })
    protected link: string;
    @Length(2, 64, { message: 'Artist must be between 2 and 64 characters long!' })
    protected artist: string;
    @IsOptional()
    @IsNumberString({}, { message: "Artist id must be a number string!" })
    protected artist_id?: string;
    protected tags: string;
    @IsOptional()
    @Length(2, 64, { message: 'Album must be between 2 and 64 characters long!' })
    protected album?: string;
    @IsOptional()
    @Length(2, 64, { message: 'Label must be between 2 and 64 characters long!' })
    protected record_label?: string;
    @IsOptional()
    @IsNumberString({}, { message: "Label id must be a number string!" })
    protected record_label_id?: string;
    @IsOptional()
    @Length(2, 64, { message: 'Publisher must be between 2 and 64 characters long!' })
    protected publisher?: string;
    @IsOptional()
    @IsNumberString({}, { message: "Publisher id must be a number string!" })
    protected publisher_id?: string;
    @IsOptional()
    @IsNumberString({}, { message: "Price must be a number!" })
    protected price?: string;
    @IsOptional()
    @IsIn(['HUF', 'USD', 'EUR'])
    protected currency?: string;
    @IsOptional()
    @IsNumberString({}, { message: "Uploader id must be a number string!" })
    protected uploader_id?: string;
    @IsOptional()
    @IsNumberString({}, { message: "Uploader id must be a number string!" })
    protected uploader_name?: string;
    @IsOptional()
    @IsNumber({}, { message: "Upload time must be a posix number!" })
    protected upload_time?: number;
    @IsOptional()
    @IsNumberString({}, { message: "Uploader id must be a number string!" })
    protected id?: string;

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
            if (musicData.price) {
                this.price = `${musicData.price}`;
                if (musicData.currency) { this.currency = musicData.currency; }
            }
            if (musicData.uploader_id) { this.uploader_id = musicData.uploader_id; }
            if (musicData.upload_time) { this.upload_time = musicData.upload_time; }
            if (musicData.artist_id) { this.artist_id = musicData.artist_id; }
            if (musicData.record_label_id) { this.record_label_id = musicData.record_label_id; }
            if (musicData.publisher_id) { this.publisher_id = musicData.publisher_id; }
            if (musicData.id) { this.id = musicData.id; }
            if (musicData.uploader_name) { this.id = musicData.uploader_name; }
            
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
            price: this.price,
            currency: this.currency,

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
