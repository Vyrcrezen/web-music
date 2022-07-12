// import expSession from 'express-session';
import session from 'express-session';
import MySqlStore from 'express-mysql-session';
import { MysqlDb } from './db/mysqlDb';

export class Session {
    private static _instance: Session;
    private MySqlStoreInstance: any;
    private sessionStore: any;

    public sessionOptions: any;

    private constructor() {

        const mysqlDb = MysqlDb.getInstance();

        this.MySqlStoreInstance = MySqlStore(session as any);
        this.sessionStore = new this.MySqlStoreInstance({}, mysqlDb.getPool());

        this.sessionOptions = {
            key: 'vy_session',
            secret: 'er0903423$@$2424jkoJ@$j23j2k4NLJnjkhesijer93j94U)u-',
            store: this.sessionStore,
            resave: false,
            unset: 'keep',
            saveUninitialized: false,
            cookie: {
                maxAge: 31536000000, // one year
            }
        }

    }

    static getInstance() {
        if (Session._instance) {
            return Session._instance;
        }

        Session._instance = new Session();
        return Session._instance;
    }
}
