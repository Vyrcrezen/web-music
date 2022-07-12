import * as path from 'path';
import express from "express";
import { json } from "body-parser";
import cors from 'cors';

import { router as pageRouter } from "./routes/pages";
import { router as musicRouter } from "./routes/music";
import { router as userRouter } from "./routes/user";
import expressSession from 'express-session';
import { Session } from './session';

import { AuthPassport } from './authPassport';

const app = express();

const authPassport = AuthPassport.getInstance();

app.use(express.static(path.join(__dirname, '../../dist/pages')));
app.use(express.static(path.join(__dirname, '../../dist/frontend')));
app.use(express.static(path.join(__dirname, '../../dist/img')));
app.use('/bootstrap',express.static(path.join(__dirname, '../../node_modules/bootstrap/dist')));

app.use(express.json({ limit: '50mb' }));

app.use(json());
app.use(cors());

app.use(expressSession( Session.getInstance().sessionOptions ));

app.use(authPassport.getPassport().initialize());
app.use(authPassport.getPassport().session());

app.use('/', pageRouter);
app.use('/music', musicRouter);
app.use('/user', userRouter);

app.listen(3001);

