// import { MusicData } from '../../src/server/models/musicData';
import { MusicDataType } from "../models/musicDataType";
import { MusicCardElement } from "./musicCard/musicCardElement";
import { loadFileToElement } from '../util/loadFileToElement';
import { MusicDataBase } from '../models/frontend/musicDataBase';
import { loadFileAsBlob } from "../util/loadFileAsBlob";
import { validate } from "class-validator";

// import { MusicCardElement } from "./musicCard/musicCardElement";

fetch('/user/loginTest', {
        method: 'post',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(
            {
                message: 'logout'
            }
        )
    })
    .then((response) => { return response.json();})
    .then((data) => { console.log(data); if(data.username) { mLoginGreet.innerHTML = `Username: ${data.username}` } else {  mLoginGreet.innerHTML = 'Login here' } })
    .catch((err) => { console.log(err); });


const btnMusicCards = document.getElementById('fetch-articles-button') as HTMLButtonElement;

btnMusicCards.addEventListener('click', () => {
    fetch('music/music-cards?tags=techno,chill')
    .then(data => data.json())
    .then((data: MusicDataType[]) => {
        console.log(data);
        data.forEach(MusicDataType => {
            new MusicCardElement('mcard-template', 'mcard-container', MusicDataType);
        });
    })
    .catch( (err: Error) => console.log(err));
});

// -----------------------
// ---- Registration -----
const mReistrationForm = document.getElementById('user-reg-form') as HTMLFormElement;

mReistrationForm.addEventListener('submit', (event) => {
    event.preventDefault();

    fetch('/user/register', {
        method: 'post',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(
            {
                username: (document.getElementById('user-reg-form-username') as HTMLInputElement).value,
                password: (document.getElementById('user-reg-form-password') as HTMLInputElement).value,
                email: (document.getElementById('user-reg-form-email') as HTMLInputElement).value,
            }
        )
    })
    .then((response) => { return response.json();})
    .then((data) => { console.log(data); })
    .catch((err) => { console.log(err); });
});

// -----------------------
// -------- Login --------
const mLoginForm = document.getElementById('user-login-form') as HTMLFormElement;
const mLoginGreet = document.getElementById('user-login-text') as HTMLHeadingElement;

mLoginForm.addEventListener('submit', (event) => {
    event.preventDefault();

    fetch('/user/login', {
        method: 'post',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(
            {
                username: (document.getElementById('user-login-form-username') as HTMLInputElement).value,
                password: (document.getElementById('user-login-form-password') as HTMLInputElement).value,
            }
        )
    })
    .then((response) => { return response.json();})
    .then((data) => { console.log(data); if(data.username) { mLoginGreet.innerHTML = `Username: ${data.username}` } else {  mLoginGreet.innerHTML = 'Login here' } })
    .catch((err) => { console.log(err); });
});

// --------------------------
// --------- Logout ---------
const mLogoutForm = document.getElementById('user-logout-form') as HTMLFormElement;

mLogoutForm.addEventListener('submit', (event) => {
    event.preventDefault();

    fetch('/user/logout', {
        method: 'post',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(
            {
                message: 'logout'
            }
        )
    })
    .then((response) => { return response.json();})
    .then((data) => { console.log(data); mLoginGreet.innerHTML = 'Login here'; })
    .catch((err) => { console.log(err); });
});

// --------------------------
// -------- Login Test ------
const mLoginTest = document.getElementById('login-test-btn') as HTMLButtonElement;
const mLoginText = document.getElementById('login-test-text') as HTMLHeadingElement;

mLoginTest.addEventListener('click', (event) => {
    event.preventDefault();

    fetch('/user/loginTest', {
        method: 'post',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(
            {
                message: 'login test'
            }
        )
    })
    .then((response) => { return response.json();})
    .then((data) => { console.log(data); if(data.username) { mLoginText.innerHTML = `Thank you for helping out, ${data.username}` } else {  mLoginText.innerHTML = 'I don\'t even know who you are!' } })
    .catch((err) => { console.log(err); });
});

// ------------------------------
// -------- Music Upload --------
const mMusicUploadForm = document.getElementById('music-upload-form') as HTMLFormElement;
const mCoverImageBrowser = document.getElementById('music-upload-cover-input') as HTMLInputElement;
const mMusicBrowser = document.getElementById('music-upload-music-input') as HTMLInputElement;

mCoverImageBrowser.onchange = (() => { loadFileToElement('music-upload-cover-input', 'music-upload-cover-image', () => {return true}); });
mMusicBrowser.onchange = (() => { loadFileToElement('music-upload-music-input', 'music-upload-music-audio', () => {return true}); });

//loadFileToElement

mMusicUploadForm.addEventListener('submit', async (event) => {
    event.preventDefault();

    const musicFilePromises: Promise<string>[] = [loadFileAsBlob('music-upload-cover-input'), loadFileAsBlob('music-upload-music-input')];
    const musicBlobData = await Promise.all(musicFilePromises);

    const newMusicData = new MusicDataBase(
        {
            imageBlob: musicBlobData[0],
            musicBlob: musicBlobData[1],
            title: (document.getElementById('music-upload-music-title') as HTMLInputElement).value,
            link: (document.getElementById('music-upload-music-link') as HTMLInputElement).value,
            artist: (document.getElementById('music-upload-music-artist') as HTMLInputElement).value,
            tags: (document.getElementById('music-upload-music-tags') as HTMLInputElement).value,
            album: (document.getElementById('music-upload-music-album') as HTMLInputElement).value,
            label: (document.getElementById('music-upload-music-label') as HTMLInputElement).value,
            publisher: (document.getElementById('music-upload-music-publisher') as HTMLInputElement).value,
            price: (document.getElementById('music-upload-price-amount') as HTMLInputElement).value,
            currency: (document.getElementById('music-upload-music-price-currency') as HTMLInputElement).value,

        }
    );

    const validationError = await validate(newMusicData, { skipMissingProperties: true });
    
    if (validationError.length === 0) {
        fetch('/music/upload', {
            method: 'post',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(
                {
                    musicData: newMusicData.getPreparedData()
                }
            )
        })
        .then((response) => { return response.json();})
        .then((data) => { console.log(data); })
        .catch((err) => { console.log(err); });
    }
    else {
        console.log('New music data failed validation! It wasn\'t forwarded to the server!');
        // console.log(validationError);
        console.log(validationError.map(errorMessage => errorMessage?.constraints));
    }

    
});

// const musicCardTemplate = document.getElementById('mcard-template') as HTMLTemplateElement;
// const musicCardFragment = document.importNode(musicCardTemplate.content, true);
// const musicCardElement = musicCardFragment.firstElementChild as HTMLElement;

// console.log(musicCardElement);

// (musicCardElement.querySelector('#mcard-template-author') as HTMLElement).innerHTML = 'Argofox';
// (musicCardElement.querySelector('#mcard-template-title') as HTMLElement).innerHTML = 'Phlex - Light Me Up (feat. Caitlin Gare)';

// const musicCardHost = document.getElementById('mcard-container') as HTMLElement;

// musicCardHost.insertAdjacentElement('afterbegin', musicCardElement)

// console.log(musicCardFragment);

// new MusicCardElement('mcard-template', 'mcard-container');

// console.log(verifyElement(document.getElementById('mcard-container'), HTMLParagraphElement, 'Card container'));

