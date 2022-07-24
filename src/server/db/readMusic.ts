import path from "path";
import { MusicDataType } from "../../models/frontend/musicDataValidatable";
import { readFileAsBlob } from "../../util/readFileAsBlob";
import { MusicTable } from "./musicTable";
import { MysqlDb } from "./mysqlDb";
import { MusicOptions } from "../../models/musicOptions";

export class ReadMusic  {
    private pathRootFolder: string;

    constructor(pathRootFolder: string) {
        this.pathRootFolder = pathRootFolder;
    }

    async getAllMusic(musicOptions: MusicOptions, favOfUserId: number): Promise<MusicDataType[]> {
        const musicData = new Array<MusicDataType>;

        const mysqlDb = MysqlDb.getInstance();
        const musicTable = MusicTable.getInstance();

        console.log(musicOptions);
        console.log('musicOptions');

        const havingParams = new Array<string>;
        if (musicOptions.uploaderNameAny) {
            havingParams.push(`user_account.user_name IN (${musicOptions.uploaderNameAny.split(',').map(uploaderName => `'${uploaderName}'`).join(',')})`);
        }
        if (typeof musicOptions.myFavourites === 'boolean') {
            console.log(musicOptions.myFavourites); console.log('musicOptions.myFavourites');
            // havingParams.push(`is_favourite NOT IN(0)`); favourite_music.user_id AS fav_user_id
            havingParams.push(`is_favourite = ${musicOptions.myFavourites === true ? 1 : 0}`);
        }

        const selectMusicId = 
              `    SELECT \r\n`
            + `    music.id, \r\n`
            + `    upload_time, \r\n`
            + `    uploader_id as user_id, \r\n`
            + `    user_account.user_name, \r\n`
            + `    title, \r\n`
            + `    artist.name AS artist_name, \r\n`
            + `    record_label.name AS label_name, \r\n`
            + `    publisher.name AS publisher_name, \r\n`
            + `    album, \r\n`
            + `    link, \r\n`
            + `    num_played, \r\n`
            + `    avg_rating, \r\n`
            + `    LEAST(1, COALESCE(favourite_music.user_id, 0)) AS is_favourite \r\n`
            + `FROM \r\n`
            + `    music \r\n`
            + `INNER JOIN( \r\n`
            + `    SELECT \r\n`
            + `        tag_pairing.music_id \r\n`
            + `    FROM \r\n`
            + `        tag_pairing \r\n`
            + `    INNER JOIN tag ON tag.id = tag_pairing.tag_id \r\n`
            + `    ${musicOptions.tagsAny ? `WHERE tag.name IN(${musicOptions.tagsAny.split(',').map(tagName => `'${tagName}'`).join(',')})` : ``} \r\n`
            + `    GROUP BY \r\n`
            + `        tag_pairing.music_id \r\n`
            + `) AS tagged_music \r\n`
            + `ON \r\n`
            + `    tagged_music.music_id = music.id \r\n`
            + `INNER JOIN user_account ON user_account.id = music.uploader_id \r\n`
            + `INNER JOIN artist ON artist.id = music.artist_id \r\n`
            + `LEFT JOIN record_label ON record_label.id = music.record_label_id \r\n`
            + `LEFT JOIN publisher ON publisher.id = music.publisher_id \r\n`
            + `LEFT OUTER JOIN ( SELECT music_id, user_id FROM user_favourite WHERE user_favourite.user_id = ${favOfUserId || 0} ) AS favourite_music ON favourite_music.music_id = music.id \r\n`
            + `${havingParams.length > 0 ? `HAVING ${havingParams.join(' AND ')}` :``} \r\n`
            + `ORDER BY music.upload_time DESC \r\n`
            + `LIMIT ${musicOptions.limit ? Math.min(musicOptions.limit, 8) : 8 } \r\n`

        console.log('selectMusicId');
        console.log(selectMusicId);

        // Check tag pairing code!!

        // console.log('selectMusicId');
        // console.log(selectMusicId);

        // if (musicOptions.tagsAny) {
        //     const tagIds = await musicTable.getTagIdsByName(musicOptions.tagsAny);

        //     queryConditions.concat(tagIds.data.map(tagName => ``));
        // }

        // const rawData =( (await mysqlDb.sendQuery(`SELECT id, album, link, title, artist_id, uploader_id FROM  music WHERE ${queryConditions.length > 0 ? queryConditions : 1 }`)).data as Array<{id: number, album: string, link: string, title: string, artist_id: number, uploader_id: number}>);
        const dbMusicData = ((await mysqlDb.sendQuery(selectMusicId)).data as Array<{id: number, upload_time: number, user_id: number, user_name: string, title: string, artist_name: string, label_name: string | null, publisher_name: string | null, album: string, link: string, num_played: number | null, avg_rating: number | null, is_favourite: number }>);

        await Promise.all(
            dbMusicData.map( async (dataSet) => {
                let musicTypeSet: MusicDataType;

                let imgBlob = readFileAsBlob(`${path.join(this.pathRootFolder, `${dataSet.id}`)}/cover.jpg`);
                let musicBlob = readFileAsBlob(`${path.join(this.pathRootFolder, `${dataSet.id}`)}/music.mp3`);

                // let artist_name = ((await musicTable.getArtistNameById(dataSet.artist_id.toString())).data as {name: string}[])[0].name;
                // let uploader_name = ((await userTable.findUserAnd({id: dataSet.uploader_id})).data)[0].user_name;

                let pairedTagIds = ((await musicTable.getPairedTagIds(dataSet.id.toString())).data as {tag_id: number}[]).reduce((acc, tagObject) => { acc.push(tagObject.tag_id.toString());  return acc; }, new Array<string>);
                let pairedTagNames = ((await musicTable.getTagNamesById(pairedTagIds)).data as {name: string}[]).reduce((acc, tagObject) => { acc.push(tagObject.name.toString());  return acc; }, new Array<string>)
                console.log('pairedTagNames'); console.log(pairedTagNames);

                musicTypeSet = {
                    imageBlob: imgBlob,
                    musicBlob: musicBlob,
                    artist: dataSet.artist_name,
                    link: dataSet.link,
                    album: dataSet.album,
                    title: dataSet.title,
                    tags: pairedTagNames.join(','),
                    uploader_name: dataSet.user_name,
                    id: dataSet.id,
                    is_favourite: (dataSet.is_favourite > 0) ? true : false
                }

                musicData.push(musicTypeSet);
            })
        );

        return musicData;
    }

}
