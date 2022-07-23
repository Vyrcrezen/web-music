import { RequestHandler } from "express";
import path from "path";
import { MusicOptions } from "../../models/musicOptions";

// export const getIndexPage: RequestHandler = (_, res) => {
//     res.sendFile('/html/index.html');
// }

export const getDevTestingPage: RequestHandler<{}, {}, {}, MusicOptions> = (_, res) => {
    console.log(path.join(__dirname, '../../managedPages/serverTest.html'));

    res.sendFile(path.join(__dirname, '../../managedPages/serverTest.html'));
}
