import { ElementGroup } from "../../models/elementGroup";
import { verifyElement } from "../../util/verifyElement";
import { TemplateReader } from "./TemplateReader";

export class TagButtonElement extends TemplateReader<HTMLElement, HTMLElement> implements ElementGroup<{tagButton: HTMLButtonElement}> {
    childElements;

    constructor(tagName: string, uniqueParentIdRoot: string, uniqueButtonIdRoot: string) {
        super('mcard-tag-template');

        this.childElements = this.getChildElements({tagButtonId: "#mcard-tag-template-button"});

        this.setElementIds(uniqueParentIdRoot, uniqueButtonIdRoot);
        this.setButtonText(tagName);

    }

    getChildElements(elementIds: {tagButtonId: string}) {
        let  childElements: {tagButton: HTMLButtonElement};

        const tagButton = this.firstElement.querySelector(elementIds.tagButtonId);

        childElements = {
            tagButton: verifyElement<HTMLButtonElement>(tagButton, HTMLButtonElement.prototype, 'Tag button')
        }

        return childElements;
    };
    
    setButtonText(text: string) {
        this.childElements.tagButton.innerHTML = text;
    }

    setElementIds (uniqueParentIdRoot: string, uniqueButtonIdRoot: string) {
        this.childElements.tagButton.id = `mcard-${uniqueParentIdRoot}-tag-${uniqueButtonIdRoot}`;
    }
}