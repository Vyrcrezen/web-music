import { Router } from "express";

import { getDevTestingPage } from "../controllers/managedPages";

export const router = Router();

// router.get('/', getIndexPage);

router.get('/testing', getDevTestingPage);
