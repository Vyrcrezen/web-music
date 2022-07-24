import { RequestHandler } from "express";
import * as path from 'path';
import { MusicDataType } from "../../models/frontend/musicDataValidatable";
import { NewMusic } from "../db/newMusic";
import { validate } from "class-validator";
import { ReadMusic } from "../db/readMusic";
import { MusicOptions } from '../../models/musicOptions';

export const newMusicUpload: RequestHandler<{}, {}, {musicData: MusicDataType}, {}> = async (req, res) => {

    console.log('Uploading a new music');

    if (!req.session.passport?.user?.id) { res.status(401).json({ info: 'User id not found!' }); }
    
    else {
        const newMusic = new NewMusic(req.body.musicData,  parseInt(req.session.passport.user.id), path.join(__dirname, '../../../data/MusicCard'));
        const validationError = await validate(newMusic);

        if (validationError.length > 0) {
            console.log(req.session.passport);
            res.status(401).json({ infoo: validationError });
        }
        else {
            await newMusic.saveNewMusic();
    
            res.status(201).json({ message: 'Recieved!' });
        }
    }
}

export const getMusicData: RequestHandler<{}, {}, {}, MusicOptions> = async (req, res) => {
    const readMusic = new ReadMusic(path.join(__dirname, '../../../data/MusicCard'));

    let musicResult: MusicDataType[];

    if (req.query.omitLoadingMusic) {
        musicResult = [];
    }
    else {
        const resolvedUserId =  +(req.session.passport?.user?.id || 0);

        if (req.query.myFavourites && resolvedUserId === 0) {
            res.status(400).json([]);
        }
        else {
            musicResult = await readMusic.getAllMusic(req.query, resolvedUserId);
            res.status(201).json(musicResult);
        }
    }
}
