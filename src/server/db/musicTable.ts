import { validate } from 'class-validator';
import { MusicDataValidatable, MusicDataType } from '../../models/frontend/musicDataValidatable';
import { MysqlDb, QueryReturn } from './mysqlDb';

export class MusicTable {
    private static _instance: MusicTable;
    static dbMusicColumns = ['upload_time', 'uploader_id', 'title', 'artist_id', 'record_label_id', 'publisher_id', 'album', 'link', 'price', 'currency'];

    constructor() {}

    static getInstance() {
        if (MusicTable._instance) {
            return MusicTable._instance;
        }

        MusicTable._instance = new MusicTable();
        return MusicTable._instance;
    }

    /**
     * @throws Error with stringified message
     * @param musicData 
     */
    async getInsertMusic(musicData: MusicDataType) {
        const validMusicData = new MusicDataValidatable(musicData);
        const validationError = await validate(validMusicData);

        if (validationError.length > 0) {
            throw new Error(JSON.stringify({ message: `Validation of music data failed in getInsertMusic of MusicTable class`, details: validationError}));
        }

        // Retrieve the verified music data in MusicDataType format
        const validatedData = validMusicData.getPreparedData();

        // Pick out db column names where: column name is related to music table, and its data isn't nullish
        const insertColumns = Object.keys(validatedData)
            .reduce((acc, columnName) => {
                if (
                    MusicTable.dbMusicColumns.includes(columnName)
                    && validatedData[columnName]
                    
                ) {
                    acc.push(columnName);
                }
                return acc;
            }, new Array<string>)
            .join(", ");
        // Pick out values where: it's related to a column in the music table, and it isn't nullish
        const insertValues = Object.keys(validatedData)
            .reduce((acc, columnName) => {
                if (
                    validatedData[columnName] &&
                    MusicTable.dbMusicColumns.includes(columnName)
                ) {
                    acc.push(`'${String(validatedData[columnName])}'`);
                }
                return acc;
            }, new Array<string>)
            .join(", ");
        // Create the query with the column names and values
        const insertMusicQuery = `INSERT INTO music(${insertColumns}) VALUES (${insertValues});`;

        return insertMusicQuery;
    }
    async insertMusic(musicData: MusicDataType) {
        const insertQuery = await this.getInsertMusic(musicData);
        return MysqlDb.getInstance().sendQuery(insertQuery);
    }

    async getTagIdsByName(tagNames: string[]) {
        const nameConditions = tagNames.map(tag => `name = '${tag}'`);
        if (nameConditions.length === 0) { return { data: [] } as QueryReturn; }

        console.log('getTagIdsByName');
        console.log('tagNames'); console.log(tagNames);
        console.log('nameConditions'); console.log(nameConditions);
        console.log(`SELECT id FROM tag WHERE ${nameConditions.join(' OR ')};`);

        return MysqlDb.getInstance().sendQuery(`SELECT id FROM tag WHERE ${nameConditions.join(' OR ')};`);
    }

    async getTagNamesById(tagIds: string[]) {
        const idConditions = tagIds.map(tag => `id = '${tag}'`);
        if (idConditions.length === 0) { return { data: [] } as QueryReturn; }
        return MysqlDb.getInstance().sendQuery(`SELECT name FROM tag WHERE ${idConditions.join(' OR ')};`);
    }

    async getArtistIdByName(artistName: string) {
        return MysqlDb.getInstance().sendQuery(`SELECT id FROM artist WHERE name = '${artistName}';`);
    }

    async getRecordLabelIdByName(recordLabelName: string) {
        return MysqlDb.getInstance().sendQuery(`SELECT id FROM record_label WHERE name = '${recordLabelName}';`);
    }

    async getPublisherIdByName(publisherName: string) {
        return MysqlDb.getInstance().sendQuery(`SELECT id FROM record_label WHERE name = '${publisherName}';`);
    }

    async getTagNameById(tagId: string | number) {
        return MysqlDb.getInstance().sendQuery(`SELECT name FROM tag WHERE id = '${tagId}';`);
    }

    async getArtistNameById(artistId: string | number) {
        return MysqlDb.getInstance().sendQuery(`SELECT name FROM artist WHERE id = '${artistId}';`);
    }

    async getRecordLabelNameById(recordLabelId: string | number) {
        return MysqlDb.getInstance().sendQuery(`SELECT name FROM record_label WHERE id = '${recordLabelId}';`);
    }

    async getPublisherNameById(publisherId: string | number) {
        return MysqlDb.getInstance().sendQuery(`SELECT name FROM record_label WHERE id = '${publisherId}';`);
    }

    async getPairedTagIds(musicId: string | number) {
        return MysqlDb.getInstance().sendQuery(`SELECT tag_id FROM tag_pairing WHERE music_id = '${musicId}';`);
    }

    async getMusicId(musicData: MusicDataType) {
        return MysqlDb.getInstance().sendQuery(`SELECT id FROM music WHERE uploader_id = '${musicData.uploader_id}' AND upload_time = '${musicData.upload_time}' AND title = '${musicData.title}' AND artist_id = '${musicData.artist_id}';`);
    }

    getInsertArtist(artistName: string) {
        return `INSERT IGNORE INTO artist SET name = '${artistName}';`;
    }

    async insertArtist(artistName: string) {
        return MysqlDb.getInstance().sendQuery(this.getInsertArtist(artistName));
    }

    getInsertRecordLabel(recordLabelName: string) {
        return `INSERT IGNORE INTO record_label SET name = '${recordLabelName}';`;
    }

    async insertRecordLabel(recordLabelName: string) {
        return MysqlDb.getInstance().sendQuery(this.getInsertRecordLabel(recordLabelName));
    }

    getInserPublisher(publisherName: string) {
        return `INSERT IGNORE INTO publisher SET name = '${publisherName}';`;
    }

    async insertPublisher(publisherName: string) {
        return MysqlDb.getInstance().sendQuery(this.getInserPublisher(publisherName));
    }

    getInsertTags(tags: string[]) {
        return tags.map(tagname => `INSERT IGNORE INTO tag(name) VALUES ('${tagname}');` );
    }

    async insertTags(tags: string[]) {
        const tagInsertQueries = this.getInsertTags(tags);
        const mysqlDb = MysqlDb.getInstance();

        console.log('Insert Tags:');
        console.log(tagInsertQueries);

        const queryResult = Promise.all(
            tagInsertQueries.map(async (query) => {
                mysqlDb.sendQuery(query);
            })
        );
        return queryResult;
    }

    getInsertTagPairings(tagIds: string[] | number[], musicId: string | number) {
        return tagIds.map(tag => `INSERT INTO tag_pairing(tag_id, music_id) VALUES ('${tag}','${musicId}');` );
    }

    async insertTagPairings(tagIds: string[] | number[], musicId: string | number) {
        const mysqlDb = MysqlDb.getInstance();
        const tagInsertQueries = this.getInsertTagPairings(tagIds, musicId);

        const queryResult = Promise.all(
            tagInsertQueries.map(async (query) => {
                mysqlDb.sendQuery(query);
            })
        );
        return queryResult;
    }
}
