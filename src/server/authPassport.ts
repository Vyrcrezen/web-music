import { Request, Response, NextFunction, RequestHandler } from 'express';
import passport, { PassportStatic }  from "passport";
import { IVerifyOptions, Strategy as LocalStrategy } from 'passport-local';
import { LoginUser } from "./db/loginUser";
import { UserResult } from '../models/userResult';

export class AuthPassport {

    private static _instance: AuthPassport;
    private passport: PassportStatic;

    constructor() {
        this.passport = passport;

        this.configSerialization();
        this.configStrategy();
    }

    public static getInstance() {
        if(AuthPassport._instance) {
            return AuthPassport._instance;
        }

        AuthPassport._instance = new AuthPassport();
        return AuthPassport._instance;
    }

    getPassport() {
        return this.passport;
    }

    requiresLogin(req: Request, res: Response, next: NextFunction) {

        if (req.isAuthenticated()) {
            return next();
        }
        else {
            res.status(401).json({message: 'You need to be logged in to do that!'});
        }

    }

    customAuthenticate: RequestHandler = (req, res, next) => {

        this.passport.authenticate('local-login', {}, (_err: any, user?: any, options?: IVerifyOptions) => {
            console.log('authenticate callback');

            if (!user) {
                res.status(401).json(options);
            } else {
                req.login(user, options, (err) => {
                    if (err) {
                        return next(err);
                    }
                    return next();
                });
            }

        })(req, res, next);
    }

    configSerialization() {
        // After being done with our strategy, this method uploads the second argument into the session table
        // Also, done's second argument is passed forward to the request's session.passport property
        this.passport.serializeUser((session: any, done) => {
            done(null, session);
        });

        this.passport.deserializeUser((session: any, done) => {
            done(null, session);
        });
    }

    configStrategy() {
        this.passport.use('local-login', new LocalStrategy(
            async (username, password, done) => {

                let sessionData: UserResult;
                let info: IVerifyOptions | undefined;
                
                const loginUser = new LoginUser(username, password);
                const authResult =  await loginUser.authenticateUser();

                if (authResult.authenticated) {
                    sessionData = { authenticated: true, id: authResult.result.id };
                }
                else {
                    info = { message: authResult.result }
                    sessionData = false;
                }

                return done(null, sessionData, info );
            }
        ));
    }
}
