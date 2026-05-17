/*
This class is a singleton (so di sya pwede i instantiate liwat) that
controls shared data between pages

the appState constant is exported to app.ts for manipulation there
*/

import JobCollection from "../entities/job-collection";

class AppState {
    constructor(
        public allJobs : JobCollection = new JobCollection(),
        public optimalSubset : JobCollection = new JobCollection(),
    ) {}
}

export const appState = new AppState();