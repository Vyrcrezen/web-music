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

    getInsertMusic() {
        
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
    async insertPublishert(publisherName: string) {
        const mysqlDb = MysqlDb.getInstance();
        const queryResult = await mysqlDb.sendQuery(this.getInserPublisher(publisherName));
        return queryResult;
    }

    getInsertTags(tags: string[]) {
        const insertTagQueries = tags.map(tagname => {
            return `INSERT IGNORE INTO tag SET name = '${tagname}';`;
        });
        return insertTagQueries;
    }

    async insertTags(tags: string[]) {
        const mysqlDb = MysqlDb.getInstance();
        const queryResult = await mysqlDb.sendQuery(this.getInsertTags(tags).join('\r\n'));
        return queryResult;
    }

}
