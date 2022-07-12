import { RequestHandler } from "express";
import * as path from 'path';
import { MusicDataType as oldMusicType } from "../../models/musicDataType";
import { readFileAsBlob } from '../../util/readFileAsBlob';
import { MusicDataType } from "../../models/frontend/musicDataBase";
import { MusicDataDb } from "../db/musicDataDb";
import { validate } from "class-validator";
import { MusicTable } from "../db/musicTable";
// import { MysqlConnection } from "../db/mysqlConnection";

const reqData: oldMusicType[] = [];

reqData.push(new oldMusicType(
    '1656709982142',
    1656709982142,
    'Midnight',
    0,
    'na',
    "sakuya4",
    'na',
    "PeriTune",
    "na",
    readFileAsBlob(path.join(__dirname, '../../../data/MusicCard/1656709982142/music.mp3')),
    readFileAsBlob(path.join(__dirname, '../../../data/MusicCard/1656709982142/cover.jpg')),
    'light',
    ["fantasy", "ambient", "emotional", "piano", "chill", "instrumental"],
    "https://soundcloud.com/sei_peridot/sakuya4"
));

reqData.push(new oldMusicType(
    '1656711661616',
    1656711661616,
    'Midnight',
    0,
    'na',
    "Light Me Up (feat. Caitlin Gare)",
    'Phlex',
    "Argofox",
    "na",
    readFileAsBlob(path.join(__dirname, '../../../data/MusicCard/1656711661616/music.mp3')),
    readFileAsBlob(path.join(__dirname, '../../../data/MusicCard/1656711661616/cover.jpg')),
    'dark',
    ["electronic", "chill", "argofox"],
    "https://soundcloud.com/argofox/phlex-light-me-up"

));

reqData.push(new oldMusicType(
    '1656981079848',
    1656981079848,
    'Midnight',
    0,
    'na',
    "Attraction",
    'Rewayde',
    "Argofox",
    "na",
    readFileAsBlob(path.join(__dirname, '../../../data/MusicCard/1656981079848/music.mp3')),
    readFileAsBlob(path.join(__dirname, '../../../data/MusicCard/1656981079848/cover.jpg')),
    'dark',
    ["argofox", "electronic", "electro house", "dance", "edm"],
    "https://soundcloud.com/argofox/rewayde-attraction"

));

// reqData.push(new MusicData(
//     '1656981089848',
//     1656981089848,
//     'Midnight',
//     0,
//     'na',
//     "na",
//     'na',
//     "na",
//     "na",
//     readFileAsBlob(path.join(__dirname, '../../../data/MusicCard/1656981089848/music.mp3')),
//     readFileAsBlob(path.join(__dirname, '../../../data/MusicCard/1656981089848/cover.jpg')),
//     'dark',
//     ["chill"],
//     "https://soundcloud.com/argofox/rewayde-attraction"

// ));

export const newMusicUpload: RequestHandler<{}, {}, {musicData: MusicDataType}, {}> = async (req, res) => {

    console.log('Uploading a new music');

    if (!req.session.passport?.user?.id) { res.status(401).json({ info: 'User id not found!' }); }
    
    const musicDataDb = new MusicDataDb(req.body.musicData, `${req.session.passport?.user?.id}`);
    const validationError = await validate(musicDataDb);

    if (validationError.length > 0) {
        res.status(401).json({ info: validationError });
    }

    console.log(musicDataDb.getDbData().tags);

    console.log( MusicTable.getInstance().getInsertTags([musicDataDb.getDbData().tags]) );

    res.status(201).json({ message: 'Recieved!' });
}

export const getMusicData: RequestHandler<{}, {}, {}, {tags: string}>= (req, res) => {
    console.log(req.query.tags);
    res.status(201).json(reqData);
}

// let mysqlConnection = MysqlConnection.getInstance();
// mysqlConnection.sendQuery('SELECT * FROM `csapat` ');