import { FieldInfo } from 'mysql';
import { UserType } from '../../models/db/userType';
import { MysqlDb } from './mysqlDb';

export class UserTable {

    private static _instance: UserTable;

    private constructor() { }

    static getInstance() {
        if( UserTable._instance ) {
            return UserTable._instance;
        }

        UserTable._instance = new UserTable();
        return UserTable._instance;
    }

    async findUserOr(userData: {id?: string | number, user_name?: string, user_email?: string}) {
        return this._findUserRoot(userData, 'OR');
    }

    async findUserAnd(userData: {id?: string | number, user_name?: string, user_email?: string}) {
        return this._findUserRoot(userData, 'AND');
    }

    private async _findUserRoot(userData: {id?: string | number, user_name?: string, user_email?: string}, joinWith: 'OR' | 'AND') {
        const mysqlDb = MysqlDb.getInstance();

        const queryWhereParts = [];
        if (userData.id) { queryWhereParts.push(`id = '${userData.id}'`); }
        if (userData.user_name) { queryWhereParts.push(`user_name = '${userData.user_name}'`); }
        if (userData.user_email) { queryWhereParts.push(`user_email = '${userData.user_email}'`); }

        let queryResult: {data: UserType[], fields?: FieldInfo[]} = await mysqlDb.sendQuery(`SELECT id, user_name, user_email, user_password, clearance, registration_time, last_online FROM user_account WHERE ${queryWhereParts.join(`${joinWith} `)};`);

        return queryResult;
    }

    async insertFavouriteMusic(userId: number, musicId: number) {
        return MysqlDb.getInstance().sendQuery(
             `INSERT INTO  user_favourite(user_id, music_id) \r\n`
            +`SELECT '${userId}', '${musicId}' FROM DUAL \r\n`
            +`WHERE NOT EXISTS (SELECT user_id, music_id FROM user_favourite \r\n`
            +`  WHERE user_id='${userId}' AND music_id='${musicId}' LIMIT 1) `
        );
    }

    async deleteFavouriteMusic(userId: number, musicId: number) {
        return MysqlDb.getInstance().sendQuery(`DELETE FROM user_favourite WHERE user_id = '${userId}' AND music_id='${musicId}'`);
    }

    insertNewUser(userData: { user_name: string, user_email: string, user_password: string }) {
        const currentTime = (new Date).getTime();

        const mysqlDb = MysqlDb.getInstance();

        mysqlDb.sendQuery(`INSERT INTO user_account(user_name, user_email, user_password, clearance, registration_time, last_online) VALUES ('${userData.user_name}','${userData.user_email}','${userData.user_password}', 7,'${currentTime}','${currentTime}');`);

        return 'successful registration';
    }
}
