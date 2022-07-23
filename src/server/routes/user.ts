import { Router } from "express";
import { registerUserAccount, loginUserAccount, logoutUserAccount, loginTest, favouriteMusic } from "../controllers/user";
import { AuthPassport } from "../authPassport";

const authPassport = AuthPassport.getInstance();

export const router = Router();

router.post('/login', authPassport.customAuthenticate, loginUserAccount);
router.post('/logout', authPassport.requiresLogin, logoutUserAccount);
router.post('/loginTest', authPassport.requiresLogin, loginTest);
router.post('/register', registerUserAccount);

router.post('/favourite/music', authPassport.requiresLogin, favouriteMusic);
