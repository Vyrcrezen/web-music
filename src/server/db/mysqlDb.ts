import mysql, { FieldInfo } from 'mysql';
import { SqlSyntaxError } from '../../models/error/customError';

export type QueryReturn = { data: []; fields?: FieldInfo[]; };

// Singleton class
export class MysqlDb {
    private static _instance: MysqlDb;
    private connection: mysql.Connection;
    private pool: mysql.Pool;

    private constructor() {
        this.connection = mysql.createConnection({
            host: 'localhost',
            port: 3306,
            user: 'root',
            password: '',
            database: 'web_music'
        });

        this.pool = mysql.createPool({
            host: 'localhost',
            port: 3306,
            user: 'root',
            password: '',
            database: 'web_music'
        });
    }

    static getInstance(): MysqlDb {
        if(MysqlDb._instance) {
            return MysqlDb._instance;
        }
        
        MysqlDb._instance = new MysqlDb();
        return MysqlDb._instance;
    }

    getConnection() { return this.connection; }
    getPool() { return this.pool; }

    /**
     * 
     * @throws Error
     */
    sendQuery(queryStatement: string, getFields=false): Promise<QueryReturn> {

        let dbPromise: Promise<QueryReturn> = new Promise((resolve, reject) => {

            this.pool.getConnection((err, connection) => {
                if (err) { reject(new SqlSyntaxError(err));}

                connection.query(queryStatement, (err, data, fields) => {
                    connection.release();
                    if(err) { reject(new SqlSyntaxError(err)); }

                    const queryResult: QueryReturn = { data: data }
                    if (getFields) { queryResult.fields = fields; }

                    resolve(queryResult);
                });
            });
        });

        return dbPromise;
    }
}
