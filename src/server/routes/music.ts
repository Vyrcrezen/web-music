import { Router } from "express";

import { getMusicData, newMusicUpload } from "../controllers/music";

export const router = Router();

router.get('/music-cards', getMusicData);
router.post('/upload', newMusicUpload);