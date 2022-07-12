import { MusicDataBase, MusicDataType } from '../../models/frontend/musicDataBase';


export type musicDataDbType = MusicDataType & {
    uploader_id: string,
    upload_time: number
}

export class MusicDataDb extends MusicDataBase {
    userId: string;
    uploadTime: string;


    constructor(musicData: MusicDataType, userId: string) {
         super(musicData);

         this.userId = userId;
         this.uploadTime = (new Date()).getTime().toString();
     }

     getDbData() {
        return Object.assign({uploader_id: this.userId, upload_time: this.uploadTime}, this.getPreparedData());
     }
}
