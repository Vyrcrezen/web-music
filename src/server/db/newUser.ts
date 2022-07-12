import { IsEmail, Length, MaxLength } from "class-validator";
import bcrypt from 'bcrypt';
import { UserTable } from "./userTable";
import { AlreadyTakenError } from "../../models/error/customError";

export class NewUser {
    @Length(3, 16)
    // ts-ignore
    username: string;
    @Length(8, 16)
    password: string;
    @MaxLength(64)
    @IsEmail()
    email: string;

    /**
     * @throws Error: UserData constructor recieved incorrect argument type
     * @param username Will throw error if not string
     * @param password Will throw error if not string
     * @param email Will throw error if not string
     */
    constructor(username: unknown, password: unknown, email: unknown) {

        if(typeof username !== 'string') { throw new TypeError(`Recieved username of type ${typeof username}, but expected string!`); }
        if(typeof password !== 'string') { throw new TypeError(`Recieved password of type ${typeof password}, but expected string!`); }
        if(typeof email !== 'string') { throw new TypeError(`Recieved email of type ${typeof email}, but expected string!`); }

        this.username = username;
        this.password = password;
        this.email = email;
    }

    async registerUser() {
        const userTable = UserTable.getInstance();

        const foundUser = await userTable.findUserOr({ user_name: this.username, user_email: this.email })

        if (foundUser.data.length > 0) {
            if (foundUser.data.find(item => item.user_name === this.username)) { throw new AlreadyTakenError(new Error('username is already taken!')) }
            if (foundUser.data.find(item => item.user_email === this.email)) { throw new AlreadyTakenError(new Error('email is already taken!')) }
        }

        const passwordSalt = await bcrypt.genSalt(6);
        const passwordHash = await bcrypt.hash(this.password, passwordSalt);

        return userTable.insertNewUser({user_name: this.username, user_email: this.email, user_password: passwordHash});
    }
}
