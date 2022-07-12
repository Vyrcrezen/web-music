export interface ElementGroup<T extends {[property: string]: HTMLElement}> {
    childElements: T;

    getChildElements(elementIds: {[property: string]: string}): T;
    
    setElementIds: (...prop: string[]) => void;
}
