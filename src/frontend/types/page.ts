export type Page = {
    html : string;
    attachEvents : () => void;
    cleanup ?: () => void;
}

