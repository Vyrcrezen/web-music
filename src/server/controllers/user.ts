import { validateOrReject, ValidationError } from "class-validator";
import { RequestHandler } from "express";
import { NewUser } from '../db/newUser';
import { SqlSyntaxError, AlreadyTakenError } from '../../models/error/customError';
import { ErrorResponse } from '../../models/errorResponse';
import { UserTable } from "../db/userTable";

export const loginUserAccount: RequestHandler<any, any, {username: unknown, password: unknown}, any> = async (req, res) => {

    console.log('Logging in');
    console.log(req.session);

    const {passport: passportData } = req.session;

    if (!passportData) { throw new Error('Passport is unavailable in loginUserAccount'); }
    if (!passportData.user) { throw new Error('Passport could not retrieve user id in loginUserAccount'); }

    const {data} = await UserTable.getInstance().findUserAnd({id: passportData.user.id});

    res.end(JSON.stringify(Object.assign({info: 'login test'}, {username: data[0].user_name} )));
};

export const logoutUserAccount: RequestHandler<any, any, {username: unknown, password: unknown}, any> = async (req, res) => {

    console.log('Logging out');
    console.log(req.session);

    req.logout( (err) => { if (err) throw err; } );

    res.end(JSON.stringify({info: 'logged out'}));
};

export const loginTest: RequestHandler<any, any, {username: unknown, password: unknown}, any> = async (req, res) => {

    console.log('Login test');
    console.log(req.session);

    const { passport: passportData } = req.session;

    if (!passportData) { throw new Error('Passport is unavailable in loginTest'); }
    if (!passportData.user) { throw new Error('Passport could not retrieve user id in loginTest'); }

    const {data} = await UserTable.getInstance().findUserAnd({id: passportData.user.id});

    res.end(JSON.stringify(Object.assign({info: 'login test'}, {username: data[0].user_name} )));
};

export const registerUserAccount: RequestHandler<any, { info: string } | ErrorResponse, {username: unknown, password: unknown, email: unknown}, any> = async (req, res) => {
    console.log('recieved user account registration request');
    console.log(req.body);

    try{
        const newUserData = new NewUser(req.body.username, req.body.password, req.body.email);

        await validateOrReject(newUserData);

        const reply = await newUserData.registerUser();

        res.status(201).json({ info: reply});
    }
    catch (error) {

        // Handle validation error, username might be too short, or email might have wrong signature
        if (error instanceof Array<ValidationError>) {
            const minError = (error as Array<ValidationError>).map(item => {
                return { target: item.property, message: (item.constraints ?? {})[Object.keys(item?.constraints || {})[0]] };
            });
            res.status(400).json({ type: 'validation', details: minError});
        }

        // Handle bad type error, when either username, password or email isn't a string
        if (error instanceof TypeError) {
            res.status(400).json({ type: 'type', info: error.message });
        }

        // This is if the Sql syntax sent to the database is wrong
        if (error instanceof SqlSyntaxError) {
            console.log(error.message)
            res.status(500).json({ type: 'database', details: [{target: 'user', message: 'The database is experiencing difficulties. Please try again later.'}]});
        }

        // Error indicating that either the username or the email address is already in use
        if (error instanceof AlreadyTakenError) {
            res.status(400).json({ type: 'taken', info: error.message });
        }
    }

}