import { Router } from "express";

import { getDevTestingPage } from "../controllers/hiddenPages";

export const router = Router();

// router.get('/', getIndexPage);

router.get('/testing', getDevTestingPage);
