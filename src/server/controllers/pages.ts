import { RequestHandler } from "express";

export const getIndexPage: RequestHandler = (_, res) => {
    res.sendFile('index.html');
}

