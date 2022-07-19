import { RequestHandler } from "express";
import path from "path";

// export const getIndexPage: RequestHandler = (_, res) => {
//     res.sendFile('/html/index.html');
// }

export const getDevTestingPage: RequestHandler = (_, res) => {
    console.log(path.join(__dirname, '../../hiddenPages/serverTest.html'));

    res.sendFile(path.join(__dirname, '../../hiddenPages/serverTest.html'));
}
