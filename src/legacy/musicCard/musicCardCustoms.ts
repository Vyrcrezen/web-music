// import { verifyElement } from "../../util/verifyElement";

// export class MusicCardCustoms<T extends HTMLElement> {
//     coverImageDiv: HTMLDivElement;
//     label: HTMLDivElement;
//     title: HTMLHeadElement;
//     author: HTMLHeadElement;
//     audio: HTMLAudioElement;
//     audioSrc: HTMLSourceElement;
//     tags: HTMLDivElement;
//     source: HTMLAnchorElement;

//     /**
//      * @throws 'Element is wrong type error!'
//      * @param parentElement 
//      * @param newUniqueRootId 
//      * @param elementIds 
//      */
//     constructor(
//         parentElement: T,
//         newUniqueRootId: string,
//         elementIds: {
//             coverImageDivId: string,
//             labelId: string,
//             titleId: string,
//             authorId: string,
//             audioId: string,
//             audioSrcId: string,
//             tagsId: string,
//             sourceId: string
//         }
//     ) {
//         const coverImageDiv = parentElement.querySelector(elementIds.coverImageDivId);
//         const label = parentElement.querySelector(elementIds.labelId);
//         const title = parentElement.querySelector(elementIds.titleId);
//         const author = parentElement.querySelector(elementIds.authorId);
//         const audio = parentElement.querySelector(elementIds.audioId);
//         const audioSrc = parentElement.querySelector(elementIds.audioSrcId);
//         const tags = parentElement.querySelector(elementIds.tagsId);
//         const source = parentElement.querySelector(elementIds.sourceId);

//         this.coverImageDiv = verifyElement<HTMLDivElement>(coverImageDiv, HTMLDivElement.prototype, 'Mcard cover image container');
//         this.label = verifyElement<HTMLDivElement>(label, HTMLDivElement.prototype, 'Mcard label container');
//         this.title = verifyElement<HTMLHeadingElement>(title, HTMLHeadingElement.prototype, 'Mcard title header');
//         this.author = verifyElement<HTMLHeadingElement>(author, HTMLHeadingElement.prototype, 'Mcard author header');
//         this.audio = verifyElement<HTMLAudioElement>(audio, HTMLAudioElement.prototype, 'Mcard audio element');
//         this.audioSrc = verifyElement<HTMLSourceElement>(audioSrc, HTMLSourceElement.prototype, 'Mcard audio source element');
//         this.tags = verifyElement<HTMLDivElement>(tags, HTMLDivElement.prototype, 'Mcard tags container');
//         this.source = verifyElement<HTMLAnchorElement>(source, HTMLAnchorElement.prototype, 'Mcard source paragraph');

//         this.setElementIds(newUniqueRootId);
//     }

//     setCoverImg(imgBinary: string) { this.coverImageDiv.style.backgroundImage = `url('${imgBinary}')`; }
//     setLabelTheme(coverImageTheme: 'light' | 'dark') {
//         switch (coverImageTheme){
//             case 'dark':
//                 this.label.style.backgroundColor = 'rgba(230, 230, 230, 0.6)';
//                 this.label.style.color = 'black';
//                 break;
//             case 'light':
//             default:
//                 this.label.style.backgroundColor = 'rgba(30, 30, 30, 0.6)';
//                 this.label.style.color = 'white';
//         }
//     }
//     setTitle(title: string) { this.title.innerHTML = title; }
//     setAuthor(author: string) { this.author.innerHTML = author; }
//     setTags(tags: string[]) { this.tags.innerHTML = tags.join(', '); }
//     setAudio(_: string) { }
//     setAudioSource(audio: string) { this.audioSrc.src = audio; }
//     setSource(contentSource: string) { this.source.setAttribute('href', contentSource); }

//     setCustomValues() {}

//     setElementIds(uniqueRootId: string) {
//         this.coverImageDiv.id = `mcard-${uniqueRootId}-coverimg`;
//         this.title.id = `mcard-${uniqueRootId}-title`;
//         this.author.id = `mcard-${uniqueRootId}-author`;
//         this.audio.id = `mcard-${uniqueRootId}-audio`;
//         this.audioSrc.id = `mcard-${uniqueRootId}-audio-source`;
//         this.tags.id = `mcard-${uniqueRootId}-tags`;
//         this.source.id = `mcard-${uniqueRootId}-source`;
//     }
// }
