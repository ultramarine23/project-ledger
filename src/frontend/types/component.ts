/*
Similar to page.ts, this is another wrapper element that bundles
together html string with an attachEvents function (that is called
by the page in its own attachEvents function)

Note: whenever a component is attached to a page, you must either 
call its attachEvents in the page's attachEvent function (in the
case where it is loaded at DOM creation) OR call its attachEvents 
directly after injecting the html (in the case where it is loaded
after DOM creation)

see guys this is what happens when you tell me i cant use react, i
just reinvent react in vanilla TS but more annoying and tedious B)
*/

export interface Component {
    render(): string;
    attachEvents(root: HTMLElement): void;
}