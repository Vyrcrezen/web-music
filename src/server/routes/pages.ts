import { Router } from "express";

import { getIndexPage } from "../controllers/pages";

export const router = Router();

router.get('/', getIndexPage);
