import React, { useState, useRef } from 'react';
import { createRoot } from 'react-dom/client';
import { MusicDataType } from '../../models/frontend/musicDataValidatable';
import { MusicCard } from './musicCard';
import { MusicOptions } from '../../models/musicOptions';
import { ExpandType as Expand } from '../../util/expandType';


export function initMusicDeck(hostId: string, eventDescriptions: Array<{eventOriginId: string, eventType: keyof HTMLElementEventMap, musicOptions: Expand<MusicOptions>}>) {

    function Main() {
        const [musicDataSets, setMusicDataSets] = useState(new Array<MusicDataType>);
        const isInitialized = useRef(false);

        let musicDeck = new Array<JSX.Element>;

        if (!isInitialized.current) {
            const hrefParam = (window.location.href.includes('?')) ? window.location.href.substring( window.location.href.indexOf('?') + 1 ) : '';

            console.log(`/music/music-cards?${hrefParam}`);

            fetch(`/music/music-cards?${hrefParam}`)
                .then(data => data.json())
                .then((data: MusicDataType[]) => {
                    console.log(data);
                    setMusicDataSets(data);
                })
                .catch(error => { throw error; });

            eventDescriptions.forEach(descriptor => {
                const domElement = document.getElementById(descriptor.eventOriginId);
                if (!domElement) { throw new Error(`Didn't find DOM element with id: ${descriptor.eventOriginId}`); }

                const queryParam = Object.keys(descriptor.musicOptions).reduce((queryAcc, optionName) => {
                    
                    if (descriptor.musicOptions[optionName]) {
                        // if (Array.isArray(descriptor.musicOptions[optionName])) {
                        //     queryAcc.push(`${optionName}=${(descriptor.musicOptions[optionName] as (string | number)[]).join(',')}`);
                        // }
                        queryAcc.push(`${optionName}=${descriptor.musicOptions[optionName]}`);
                    }

                    return queryAcc;

                }, new Array<string>);

                console.log(queryParam);

                domElement.addEventListener(descriptor.eventType, () => {
                    console.log(`${window.location.href.substring(0, window.location.href.indexOf('?'))}?${queryParam.join('&')}`);
                    history.pushState({}, '', `${window.location.href.substring(0, window.location.href.indexOf('?'))}?${queryParam.join('&')}`);

                    fetch(`/music/music-cards?${queryParam.join('&')}`)
                    // fetch(`/music/music-cards?tagsAny=${['edm', 'dance'].join(',')}&artistAny=${['Phlex'].join(',')}`)
                        .then(data => data.json())
                        .then((data: MusicDataType[]) => {
                            console.log(data);
                            setMusicDataSets(data);
                        })
                        .catch(error => { throw error; });
                });
            });

            isInitialized.current = true;
        }

        musicDataSets.forEach(data => {
            musicDeck.push(<MusicCard key={data.id} musicData={data} />);
        });

        return ( <>{musicDeck}</> );
    }

    const reactContainer = document.getElementById(hostId) as HTMLDivElement;
    const reactRoot = createRoot(reactContainer);
    reactRoot.render(<Main />);
}
