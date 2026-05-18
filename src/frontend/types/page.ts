/*
A wrapper type that bundles up the raw HTML string of a full page with
a reference to the function to attach all listener events and possibly
a reference to the function to "clean up" deprecated elements when the
page is exited out of
*/

export type Page = {
    html : string;
    attachEvents : (root : HTMLElement) => void;
    cleanup ?: () => void;
}

