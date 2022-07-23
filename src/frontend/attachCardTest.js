import { initMusicDeck } from './musicDeck/deckComponent';

const btnAllId = 'fetch-articles-button';
const btnFavouritesId = 'fetch-favourites-button';
const hostId = 'react-music-deck';

initMusicDeck(hostId, [
    // {eventOriginId: buttonId, eventType: 'click', musicOptions: { tagsAny: 'edm,dance', artistAny: 'Phlex', limit: 5, myFavourites: true }},
    {eventOriginId: btnAllId, eventType: 'click', musicOptions: {}},
    {eventOriginId: btnFavouritesId, eventType: 'click', musicOptions: { myFavourites: true }}

]);

// Available MusicOptions
// -------------------------------
// MusicOptions = {
//     tagsEvery?: string; // string of comma separated values!
//     tagsAny?: string; // string of comma separated values!

//     artistEvery?: string; // string of comma separated values!
//     artistAny?: string; // string of comma separated values!

//     uploaderNameEvery?: string; // string of comma separated values!
//     uploaderNameAny?: string; // string of comma separated values!

//     uploadTimeRangeStart?: number;
//     uploadTimeRangeEnd?: number;

//     releaseTimeRangeStart?: number;
//     releaseTimeRangeEnd?: number;

//     myFavourites?: boolean;
//     limit?: number;

//     paginationPage?: number,
//     musicId?: string,

//     excludeMusicIds?: string; // string of comma separated values!
//     omitLoadingMusic: boolean;

//     order?: [
//         'uploadTimeAsc',
//         'uploadTimeDesc',
//         'releaseTimeAsc',
//         'releaseTimeDesc',
//         'playsAsc',
//         'playsDesc',
//         'favouritesAsc',
//         'favouritesDesc'
//     ],

//     [prop: string]: string | string[] | number | number | boolean | undefined;
// }
