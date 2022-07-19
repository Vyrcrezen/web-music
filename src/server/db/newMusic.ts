// import { validate } from 'class-validator';
import { MusicDataValidatable, MusicDataType } from '../../models/frontend/musicDataValidatable';
import { parseBlobMeta } from '../../util/parseBlobMeta';
import { MusicTable } from './musicTable';
import * as fs from 'fs';
import path from 'path';

export class NewMusic extends MusicDataValidatable {
    pathRootFolder: string;

    constructor(musicData: MusicDataType, userId: number, pathRootFolder: string) {
        musicData.uploader_id = userId;
        musicData.upload_time = (new Date()).getTime();

        super(musicData);
        // validate(this);

        this.pathRootFolder = pathRootFolder;
     }

     async saveNewMusic() {
        const musicTable = MusicTable.getInstance();

        // Insert names into foreign tables
        // Artist
        await musicTable.insertArtist(this.artist);
        this.artist_id = ((await musicTable.getArtistIdByName(this.artist))?.data as Array<{ id: number }>)[0].id;
        // Record Label
        if (this.record_label) {
            await musicTable.insertRecordLabel(this.record_label);
            this.record_label_id = ((await musicTable.getRecordLabelIdByName(this.record_label))?.data as Array<{ id: number }>)[0].id;
        }
        // Publisher
        if (this.publisher) {
            await musicTable.insertPublisher(this.publisher);
            this.publisher_id = ((await musicTable.getPublisherIdByName(this.publisher))?.data as Array<{ id: number }>)[0].id;
        }
        // ------------------------------------
        // Upload music data into music table
        await musicTable.insertMusic(this.getPreparedData());

        this.id = ((await musicTable.getMusicId(this.getPreparedData())).data as Array<{ id: number }>)[0].id;
        // ------------------------------------
        // Store new tag names in Tag table
        const tagNames = this.tags.split(',').map(name => name.trim().toLowerCase());
        await musicTable.insertTags(tagNames);
        // Retrieve the tag ids from the table
        const rawTagIds = ((await musicTable.getTagIdsByName(tagNames)).data as { id: number }[]);

        const tagIds = rawTagIds.reduce((acc, idObject) => { acc.push(idObject.id.toString()); return acc; }, new Array<string>);
        // -----------------------------------
        // Insert Tag pairings
        await musicTable.insertTagPairings(tagIds, this.id);

        // Image processing
        const imageMeta = parseBlobMeta(this.imageBlob);

        let imgExtension: string;
        switch(imageMeta.extension) {
            case ('jpg'):
            case ('jpeg'): imgExtension = 'jpg';
            break;
            default: throw new Error(`Unhandled cover image extension in saveNewMusic method of NewMusic class: ${imageMeta.extension}`);
        }

        const imgBuffer = Buffer.from(this.imageBlob.replace(imageMeta.full, ''), imageMeta.encoding);

        if (!fs.existsSync(path.join(this.pathRootFolder, `${this.id}`))) { fs.mkdirSync(path.join(this.pathRootFolder, `${this.id}`), { recursive: true }); }
        fs.writeFileSync(`${path.join(this.pathRootFolder, `${this.id}`)}/cover.${imgExtension}`, imgBuffer);

        // Music processing
        const musicMeta = parseBlobMeta(this.musicBlob);

        let musicExtension: string;
        switch(musicMeta.extension) {
            case ('mpeg'): musicExtension = 'mp3';
            break;
            default: throw new Error(`Unhandled cover image extension in saveNewMusic method of NewMusic class: ${imageMeta.extension}`);
        }

        const musicBuffer = Buffer.from(this.musicBlob.replace(musicMeta.full, ''), musicMeta.encoding);

        if (!fs.existsSync(path.join(this.pathRootFolder, `${this.id}`))) { fs.mkdirSync(path.join(this.pathRootFolder, `${this.id}`), { recursive: true }); }
        fs.writeFileSync(`${path.join(this.pathRootFolder, `${this.id}`)}/music.${musicExtension}`, musicBuffer);
     }
}
