import path from "path";
import { MusicDataType } from "../../models/frontend/musicDataValidatable";
import { readFileAsBlob } from "../../util/readFileAsBlob";
import { MusicTable } from "./musicTable";
import { UserTable } from './userTable';
import { MysqlDb } from "./mysqlDb";

export class ReadMusic  {
    private pathRootFolder: string;

    constructor(pathRootFolder: string) {
        this.pathRootFolder = pathRootFolder;
    }

    async getAllMusic(): Promise<MusicDataType[]> {
        const musicData = new Array<MusicDataType>;

        const mysqlDb = MysqlDb.getInstance();

        const rawData =( (await mysqlDb.sendQuery(`SELECT id, album, link, title, artist_id, uploader_id FROM  music WHERE 1`)).data as Array<{id: number, album: string, link: string, title: string, artist_id: number, uploader_id: number}>);

        await Promise.all(
            rawData.map( async (dataSet) => {
                const musicTable = MusicTable.getInstance();
                const userTable = UserTable.getInstance();
                let musicTypeSet: MusicDataType;

                let imgBlob = readFileAsBlob(`${path.join(this.pathRootFolder, `${dataSet.id}`)}/cover.jpg`);
                let musicBlob = readFileAsBlob(`${path.join(this.pathRootFolder, `${dataSet.id}`)}/music.mp3`);

                let artist_name = ((await musicTable.getArtistNameById(dataSet.artist_id.toString())).data as {name: string}[])[0].name;
                let uploader_name = ((await userTable.findUserAnd({id: dataSet.uploader_id})).data)[0].user_name;

                let pairedTagIds = ((await musicTable.getPairedTagIds(dataSet.id.toString())).data as {tag_id: number}[]).reduce((acc, tagObject) => { acc.push(tagObject.tag_id.toString());  return acc; }, new Array<string>);
                console.log('pairedTagIds'); console.log(pairedTagIds);
                console.log('(await musicTable.getTagNamesById(pairedTagIds)).data'); console.log((await musicTable.getTagNamesById(pairedTagIds)).data);
                let pairedTagNames = ((await musicTable.getTagNamesById(pairedTagIds)).data as {name: string}[]).reduce((acc, tagObject) => { acc.push(tagObject.name.toString());  return acc; }, new Array<string>)
                console.log('pairedTagNames'); console.log(pairedTagNames);

                musicTypeSet = {
                    imageBlob: imgBlob,
                    musicBlob: musicBlob,
                    artist: artist_name,
                    link: dataSet.link,
                    album: dataSet.album,
                    title: dataSet.title,
                    tags: pairedTagNames.join(','),
                    uploader_name: uploader_name,
                    id: dataSet.id
                }

                musicData.push(musicTypeSet);
            })
        );

        return musicData;
    }

}
