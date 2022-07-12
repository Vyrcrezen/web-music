import { Length } from "class-validator";
import bcrypt from 'bcrypt';
import { UserTable } from "./userTable";
import { UserType } from "../../models/db/userType";


export class LoginUser {
    
    @Length(3, 16)
    // ts-ignore
    username: string;
    @Length(8, 16)
    password: string;

    /**
     * @throws Error: UserData constructor recieved incorrect argument type
     * @param username Will throw error if not string
     * @param password Will throw error if not string
     */
    constructor(username: unknown, password: unknown) {

        if(typeof username !== 'string') { throw new TypeError(`Recieved username of type ${typeof username}, but expected string!`); }
        if(typeof password !== 'string') { throw new TypeError(`Recieved password of type ${typeof password}, but expected string!`); }

        this.username = username;
        this.password = password;
    }

    async authenticateUser(): Promise<{ authenticated: true, result: UserType } | { authenticated: false, result: string }> {

        const userTable = UserTable.getInstance();

        let authOutcome;

        const {data: dbUserData} = await userTable.findUserOr({ user_name: this.username })

        if (dbUserData.length > 1) { throw new Error('Found multiple users with the same username!'); }

        if (dbUserData.length === 1) {
            const isAuthenticated = await bcrypt.compare(this.password, dbUserData[0].user_password);

            if (isAuthenticated) { authOutcome = { authenticated: true, result: dbUserData[0]} as { authenticated: true, result: UserType };  }
            else { authOutcome = { authenticated: false, result: "Password didn't match!" } as { authenticated: false, result: string }; }
        }
        else { authOutcome = { authenticated: false, result: `Didn't find user with username: ${this.username}!` } as { authenticated: false, result: string }; }

        return authOutcome;
    }
}
