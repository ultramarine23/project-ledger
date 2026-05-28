/*
app.ts is the "brain" TS file (the only script attached to index.html)

app.ts has the loadPage function which fully loads a page from a Page 
object; remember that the syntax for switching pages is:
    loadPage(getPage("dashboard"));
where loadPage is imported from app.ts and getPage is imported from router.ts

if you wanna edit the actual pages, the pages folder is ur friend ;))
*/

import { Page } from "./types/page.js";
import { getPage } from "./router/router.js";
import { SchedulerAPI } from "../backend/scheduler-api.js";
import JobCollection from "../entities/job-collection.js";
import Job from "../entities/job.js";
import { Sidebar } from "./components/sidebar.js";

let currentPage: Page | null = null;

export function loadPage(page: Page) {
    const app: HTMLDivElement = document.getElementById("app") as HTMLDivElement;

    currentPage?.cleanup?.();
    app.innerHTML = page.html;
    page.attachEvents(app);   
    currentPage = page;
}

const sidebar_inst : Sidebar = new Sidebar();
const container : HTMLDivElement = document.getElementById("sidebar") as HTMLDivElement;
container.innerHTML = sidebar_inst.render();

window.addEventListener("DOMContentLoaded", () => {
    loadPage(getPage("jobs"));

    const jobsBtn = document.getElementById("nav-jobs") as HTMLButtonElement;
    const calcBtn = document.getElementById("nav-calc") as HTMLButtonElement;

    jobsBtn.addEventListener("click", () => {
        loadPage(getPage("jobs"));
    });

    calcBtn.addEventListener("click", () => {
        loadPage(getPage("calculator"));
    });
});
