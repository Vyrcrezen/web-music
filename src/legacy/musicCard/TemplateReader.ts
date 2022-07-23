export abstract class TemplateReader<
    T extends HTMLElement,
    U extends HTMLElement
> {
    private hostElement?: T;
    private templateElement: HTMLTemplateElement;
    protected firstElement: U;

    constructor(templateElementId: string) {
        const unknownTemplate = document.getElementById(templateElementId);

        if (!(unknownTemplate instanceof HTMLTemplateElement)) {
            throw new Error(
                `TemplateReader constructor expected host element to be a HTMLTemplateElement, ${
                    unknownTemplate === null
                        ? "but element doesn't exist!"
                        : `element is an instance of ${unknownTemplate.constructor.name}`
                }`
            );
        }

        this.templateElement = unknownTemplate;

        const unknownFirstElement = document.importNode(
            this.templateElement.content,
            true
        );

        if (!(unknownFirstElement.firstElementChild instanceof HTMLElement)) {
            throw new Error(
                `TemplateReader expected a template with a first child, that is an instance of HTMLElement, but ${
                    unknownFirstElement.firstElementChild === null
                        ? "it doesn't have any element children!"
                        : `it's first element child is and instance of ${unknownFirstElement.firstElementChild.constructor.name}`
                }`
            );
        }

        this.firstElement = unknownFirstElement.firstElementChild as U;
    }

    attachToHost(hostElementId: string, insertPosition: InsertPosition) {
        const unknownHost = document.getElementById(hostElementId);
        if (!(unknownHost instanceof HTMLElement)) {
                    throw new Error(
                        `TemplateReader constructor expected host element to be a HTMLElement, but element doesn\'t exist!`
                    );
                }
        this.hostElement = unknownHost as T;

        this.hostElement.insertAdjacentElement(insertPosition, this.firstElement)
    }

    detachFromHost() {
        if(this.hostElement) {
            this.hostElement.removeChild(this.firstElement);
        }
    }
}
