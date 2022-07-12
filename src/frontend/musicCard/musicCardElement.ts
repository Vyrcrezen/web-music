import { TemplateReader } from "./TemplateReader";
import { MusicDataType } from "../../models/musicDataType";
import { verifyElement } from "../../util/verifyElement";
import { ChildElements } from "../../models/musicCard/childElements";
import { ElementGroup } from "../../models/elementGroup";
import { MusicCardElementIds } from "../../models/musicCard/MusicCardElementIds";
import { TagButtonElement } from "./tagButtonElement";



export class MusicCardElement extends TemplateReader<HTMLElement, HTMLElement> implements ElementGroup<ChildElements> {
    childElements;
    tagButtonElements: TagButtonElement[];

    constructor(
        templateElementId: string,
        hostElementId: string,
        private musicData: MusicDataType
    ) {
        super(templateElementId);

        this.musicData = musicData;

        this.childElements = this.getChildElements({
            coverImageDivId: "#mcard-template-img-container",
            labelId: "#mcard-template-label",
            titleId: "#mcard-template-title",
            authorId: "#mcard-template-author",
            audioId: "#mcard-template-audio",
            audioSrcId: '#mcard-template-audio-source',
            tagsId: "#mcard-template-tags",
            sourceId: "#mcard-template-source",
        });

        this.setElementIds(this.musicData.id);

        this.tagButtonElements = this.generateTagButtonElements(this.musicData.tags);
        this.setTags();

        this.setTitle(this.musicData.title);
        this.setAuthor(this.musicData.artist);
        this.setLabelTheme(this.musicData.coverImageTheme);
        this.setAudioSource(this.musicData.musicBlob);
        this.setCoverImg(this.musicData.coverImageBlob);
        this.setSource(this.musicData.link);

        this.attachToHost(hostElementId, "beforeend");
    }

    getChildElements( elementIds: MusicCardElementIds ) {
        let  childElements: ChildElements;

        const coverImageDiv = this.firstElement.querySelector(elementIds.coverImageDivId);
        const label = this.firstElement.querySelector(elementIds.labelId);
        const title = this.firstElement.querySelector(elementIds.titleId);
        const author = this.firstElement.querySelector(elementIds.authorId);
        const audio = this.firstElement.querySelector(elementIds.audioId);
        const audioSrc = this.firstElement.querySelector(elementIds.audioSrcId);
        const tags = this.firstElement.querySelector(elementIds.tagsId);
        const source = this.firstElement.querySelector(elementIds.sourceId);

        childElements = {
            coverImageDiv: verifyElement<HTMLDivElement>(coverImageDiv, HTMLDivElement.prototype, 'Mcard cover image container'),
            label: verifyElement<HTMLDivElement>(label, HTMLDivElement.prototype, 'Mcard label container'),
            title: verifyElement<HTMLHeadingElement>(title, HTMLHeadingElement.prototype, 'Mcard title header'),
            author: verifyElement<HTMLHeadingElement>(author, HTMLHeadingElement.prototype, 'Mcard author header'),
            audio: verifyElement<HTMLAudioElement>(audio, HTMLAudioElement.prototype, 'Mcard audio element'),
            audioSrc: verifyElement<HTMLSourceElement>(audioSrc, HTMLSourceElement.prototype, 'Mcard audio source element'),
            tags: verifyElement<HTMLDivElement>(tags, HTMLDivElement.prototype, 'Mcard tags container'),
            source: verifyElement<HTMLAnchorElement>(source, HTMLAnchorElement.prototype, 'Mcard source paragraph')
    }

        return childElements;
    }

    generateTagButtonElements(tagNames: string[]) {
        let tagElements: TagButtonElement[] = new Array<TagButtonElement>;

        tagNames.forEach((tagItem, tagIndex) => {
            tagElements.push(new TagButtonElement(tagItem, this.musicData.id, `${tagIndex}`))
        });

        return tagElements;
    }

    setCoverImg(imgBinary: string) { this.childElements.coverImageDiv.style.backgroundImage = `url('${imgBinary}')`; }
    setLabelTheme(coverImageTheme: 'light' | 'dark') {
        const { label } = this.childElements;
        switch (coverImageTheme){
            case 'dark':
                label.style.backgroundColor = 'rgba(230, 230, 230, 0.6)';
                label.style.color = 'black';
                break;
            case 'light':
            default:
                label.style.backgroundColor = 'rgba(30, 30, 30, 0.6)';
                label.style.color = 'white';
        }
    }
    setTitle(title: string) { this.childElements.title.innerHTML = title; }
    setAuthor(author: string) { this.childElements.author.innerHTML = author; }
    setTags() { 
        this.childElements.tags.innerHTML = '';
        this.tagButtonElements.forEach(tagElement => {
            this.childElements.tags.insertAdjacentElement('beforeend', tagElement.childElements.tagButton); 
        });
     }
    setAudio(_: string) { }
    setAudioSource(audio: string) { this.childElements.audioSrc.src = audio; }
    setSource(contentSource: string) { this.childElements.source.setAttribute('href', contentSource); }

    setCustomValues() {}

    setElementIds(uniqueRootId: string) {
        this.childElements.coverImageDiv.id = `mcard-${uniqueRootId}-coverimg`;
        this.childElements.title.id = `mcard-${uniqueRootId}-title`;
        this.childElements.author.id = `mcard-${uniqueRootId}-author`;
        this.childElements.audio.id = `mcard-${uniqueRootId}-audio`;
        this.childElements.audioSrc.id = `mcard-${uniqueRootId}-audio-source`;
        this.childElements.tags.id = `mcard-${uniqueRootId}-tags`;
        this.childElements.source.id = `mcard-${uniqueRootId}-source`;
    }
}
