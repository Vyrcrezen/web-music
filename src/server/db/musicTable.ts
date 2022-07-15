import { validate } from 'class-validator';
import { MusicDataValidatable, MusicDataType } from '../../models/frontend/musicDataValidatable';
import { MysqlDb } from './mysqlDb';

export class MusicTable {
    private static _instance: MusicTable;

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

        const validColumnName = ['upload_time', 'uploader_id', 'title', 'artist_id', 'record_label_id', 'publisher_id', 'album', 'link', 'price', 'currency'];
        const validatedData = validMusicData.getPreparedData();

        const insertColumns = Object.keys(validatedData)
            .reduce((acc, columnName) => {
                if (
                    validatedData[columnName] &&
                    validColumnName.includes(columnName)
                ) {
                    acc.push(columnName);
                }
                return acc;
            }, new Array<string>)
            .join(", ");
        const insertValues = Object.keys(validatedData)
            .reduce((acc, columnName) => {
                if (
                    validatedData[columnName] &&
                    validColumnName.includes(columnName)
                ) {
                    acc.push(`'${String(validatedData[columnName])}'`);
                }
                return acc;
            }, new Array<string>)
            .join(", ");

        const insertMusicQuery = `INSERT INTO music(${insertColumns}) VALUES (${insertValues});`;

        return insertMusicQuery;
    }
    async insertMusic(musicData: MusicDataType) {
        return await MysqlDb.getInstance().sendQuery(await this.getInsertMusic(musicData));
    }

    async getTagIdsByName(tagNames: string[]) {
        const whereName = tagNames.map(tag => `name = '${tag}'`).join(' OR ');
        console.log(`SELECT id FROM tag WHERE ${whereName};`);

        return MysqlDb.getInstance().sendQuery(`SELECT id FROM tag WHERE ${whereName};`);
    }

    async getTagNamesById(tagIds: string[]) {
        const whereId = tagIds.map(tag => `id = '${tag}'`).join(' OR ');
        console.log(`SELECT id FROM tag WHERE ${whereId};`);
        console.log(whereId);
        if(whereId) {
            console.log('inside whereId');
            return MysqlDb.getInstance().sendQuery(`SELECT name FROM tag WHERE ${whereId};`);
        }
        return {data: [], fields: []};
    }


    async getArtistIdByName(artistName: string) { return MysqlDb.getInstance().sendQuery(`SELECT id FROM artist WHERE name = '${artistName}';`); }
    async getRecordLabelIdByName(recordLabelName: string) { return MysqlDb.getInstance().sendQuery(`SELECT id FROM record_label WHERE name = '${recordLabelName}';`); }
    async getPublisherIdByName(publisherName: string) { return MysqlDb.getInstance().sendQuery(`SELECT id FROM record_label WHERE name = '${publisherName}';`); }

    async getTagNameById(tagId: string) { return MysqlDb.getInstance().sendQuery(`SELECT name FROM tag WHERE id = '${tagId}';`); }
    async getArtistNameById(artistId: string) { return MysqlDb.getInstance().sendQuery(`SELECT name FROM artist WHERE id = '${artistId}';`); }
    async getRecordLabelNameById(recordLabelId: string) { return MysqlDb.getInstance().sendQuery(`SELECT name FROM record_label WHERE id = '${recordLabelId}';`); }
    async getPublisherNameById(publisherId: string) { return MysqlDb.getInstance().sendQuery(`SELECT name FROM record_label WHERE id = '${publisherId}';`); }

    async getPairedTagIds(musicId: string) { return MysqlDb.getInstance().sendQuery(`SELECT tag_id FROM tag_pairing WHERE music_id = '${musicId}';`); }

    async getMusicId(musicData: MusicDataType) {
        console.log(`SELECT id FROM music WHERE uploader_id = '${musicData.uploader_id}' AND upload_time = '${musicData.upload_time}' AND title = '${musicData.title}' AND artist_id = '${musicData.artist_id}';`);
        return MysqlDb.getInstance().sendQuery(`SELECT id FROM music WHERE uploader_id = '${musicData.uploader_id}' AND upload_time = '${musicData.upload_time}' AND title = '${musicData.title}' AND artist_id = '${musicData.artist_id}';`);
    }

    getInsertArtist(artistName: string) { return `INSERT IGNORE INTO artist SET name = '${artistName}';`;}
    async insertArtist(artistName: string) {
        const mysqlDb = MysqlDb.getInstance();
        const queryResult = await mysqlDb.sendQuery(this.getInsertArtist(artistName));
        return queryResult;
    }

    getInsertRecordLabel(recordLabelName: string) { return `INSERT IGNORE INTO record_label SET name = '${recordLabelName}';`;}
    async insertRecordLabel(recordLabelName: string) {
        const mysqlDb = MysqlDb.getInstance();
        const queryResult = await mysqlDb.sendQuery(this.getInsertRecordLabel(recordLabelName));
        return queryResult;
    }

    getInserPublisher(publisherName: string) { return `INSERT IGNORE INTO publisher SET name = '${publisherName}';`;}
    async insertPublisher(publisherName: string) {
        const mysqlDb = MysqlDb.getInstance();
        const queryResult = await mysqlDb.sendQuery(this.getInserPublisher(publisherName));
        return queryResult;
    }

    getInsertTags(tags: string[]) {
        const insertTagQueries = tags.map(tagname => {
            return `INSERT IGNORE INTO tag(name) VALUES ('${tagname}');`;
            // return `INSERT IGNORE INTO tag SET name = '${tagname}';`;
        });
        return insertTagQueries;
    }

    async insertTags(tags: string[]) {
        const mysqlDb = MysqlDb.getInstance();
        const tagInsertQueries = this.getInsertTags(tags);

        const queryResult = Promise.all(
            tagInsertQueries.map(async (query) => {
                mysqlDb.sendQuery(query);
            })
        );
        return queryResult;
    }

    getInsertTagPairings(tagIds: string[] | number[], musicId: string) {
        const insertPairingQueries = tagIds.map(tag => {
            return `INSERT INTO tag_pairing(tag_id, music_id) VALUES ('${tag}','${musicId}');`;
            // return `INSERT IGNORE INTO tag SET name = '${tagname}';`;
        });
        return insertPairingQueries;
    }

    async insertTagPairings(tagIds: string[], musicId: string) {
        const mysqlDb = MysqlDb.getInstance();
        const tagInsertQueries = this.getInsertTagPairings(tagIds, musicId);

        const queryResult = Promise.all(
            tagInsertQueries.map(async (query) => {
                mysqlDb.sendQuery(query);
            })
        );
        return queryResult;
    }

    // getInsertTagPairing(tag_id: string, music_id: string) { return `INSERT INTO tag_pairing(tag_id, music_id) VALUES ('${tag_id}','${music_id}');`; }
    // async insertTagPairing(tag_id: string, music_id: string) { await MysqlDb.getInstance().sendQuery(this.getInsertTagPairing(tag_id, music_id)); }
}
