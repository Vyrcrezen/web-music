import React, { useState } from 'react';
import { createRoot } from 'react-dom/client';
import { MusicDataType } from '../../models/frontend/musicDataValidatable';
import { MusicCard } from './musicCard';

function Main() {
    const [musicDataSets, setMusicDataSets] = useState(new Array<MusicDataType>);

    const fetchMusicBtn = document.getElementById('fetch-articles-button') as HTMLButtonElement;

    fetchMusicBtn.addEventListener('click', () => {
        console.log('fetching');
        fetch('/music/music-cards?tags=techno,chill')
        .then(data => data.json())
        .then(data => { console.log(data); return data; })
        .then((data: MusicDataType[]) => {
            console.log(data);
            setMusicDataSets(data);
        });
    });

    const musicDeck = new Array<JSX.Element>;

    console.log('Reacting');

    musicDataSets.forEach(data => {
        musicDeck.push(<MusicCard key={data.id} musicData={data} />);
    });

    return (
        <>
            {musicDeck}
        </>
    );
}

const reactContainer = document.getElementById('react-music-deck') as HTMLDivElement;
const reactRoot = createRoot(reactContainer);
reactRoot.render(<Main />);