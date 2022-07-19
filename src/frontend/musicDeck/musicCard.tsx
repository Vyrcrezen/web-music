import React, { useState } from "react";
import { MusicDataType } from '../../models/frontend/musicDataValidatable'

export function MusicCard({ musicData }: { musicData: MusicDataType }) {
    const [isHearted, setIsHearted] = useState(false);

    function MusicHeart() {
        let HeartElement: JSX.Element;
        
        if (isHearted) { HeartElement = <button className="btn p-1"><img src="/img/svg/heart-filled.svg" alt="" onClick={() => setIsHearted(false)} /></button>; }
        else { HeartElement = <button className="btn p-1"><img src="/img/svg/heart-empty.svg" alt="" onClick={() => setIsHearted(true)} /></button>; }

        return (HeartElement);
    }

    console.log(musicData);
    return (
        <div className="m-3">
            {/* <!-- Card Body Template --> */}
            <div className="card vy-music-card justify-content-center p-2">
                {/* <!-- Card title --> */}
                <div id="mcard-template-label" className="d-flex rounded p-1 justify-content-between vy-bg-white">
                    <span id="mcard-template-title" className="fs-5 text-start">{musicData.title}</span>
                    <MusicHeart />
                </div>
                {/* <!-- Card Image --> */}
                <div id="mcard-template-img-container" className="w-100 align-self-center vy-border-dark-beige vy-music-card-bg-image" style={{ backgroundImage: `url(${musicData.imageBlob})` }}>
                    <div className="d-flex justify-content-center h-100 w-100 vy-backdrop-blur-strong">
                        <img className="h-100 vy-fit-contain vy-mw-100" src={musicData.imageBlob} alt={`card-image-${musicData.title}`} title={musicData.title} />
                    </div>
                </div>
                {/* <!-- Card Audio Player --> */}
                <audio id="mcard-template-audio" className="align-self-center" onEnded={(event) => {console.log('onEnded'); event.currentTarget.play(); }} controls>
                    <source id="mcard-template-audio-source" src={musicData.musicBlob} type="audio/mpeg" />
                        Your browser does not support the audio element.
                </audio>
                {/* <!-- Card Details --> */}
                <table className="table table-sm m-1 ps-2">
                    <tbody>
                        <tr>
                            <td className="fs-small vy-w-80px">Artist:</td>
                            <td className="text-start">{musicData.artist}</td>
                        </tr>
                        <tr>
                            <td className="fs-small vy-w-80px">Label:</td>
                            <td className="text-start">{musicData.record_label}</td>
                        </tr>
                    </tbody>
                </table>
                {/* <!-- Card Tags --> */}
                <ul id="mcard-template-tags" className="card-body p-1 my-1 vy-tag-container">
                    {musicData.tags.split(',').map((tagName, index) =>(
                        <a key={`${musicData.id}-${index}`} href="#">
                            <li  className="d-inline-block rounded-pill fs-small mb-1 py-1 px-2 vy-bg-dark-beige  vy-tag-text">{tagName}</li>
                        </a>
                    ))}
                </ul>
                {/* <!-- Card Footer --> */}
                <div className="card-footer d-flex justify-content-between align-items-center">
                    <p className="card-text m-0">
                        <a id="mcard-template-source"
                            href={musicData.link}
                            target="_blank"
                        >
                            Source
                        </a>
                    </p>
                    <small className="align-self-end">Uploader: <a href="#">{musicData.uploader_name}</a></small>
                </div>
            </div>
        </div>
    );
}
