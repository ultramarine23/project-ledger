/*
This class is a singleton (so di sya pwede i instantiate liwat) that
controls shared data between pages

the appState constant is exported to app.ts for manipulation there
this is the "app-state.ts"
*/

import { SchedulerAPI } from "../backend/scheduler-api";
import Job from "../entities/job";
import JobCollection from "../entities/job-collection";

class AppState {
    constructor(
        public allJobs : JobCollection = new JobCollection(
            [
                new Job(1, 2, 3, 4),
                new Job(5, 6, 7, 8),
                new Job(9, 10, 11, 12),
            ]
        ),
        public optimalSubset: JobCollection = new JobCollection(),
        public exclTimes: [Number, Number][] = [],
        public exclJobIDs: Number[] = []
    ) {}

    async registerJob(job : Job) {
        this.allJobs.addJob(job);
        this.optimalSubset = await SchedulerAPI.classicWAS(this.allJobs);
    }

    async deregisterJob(job : Job) {
        this.allJobs.removeJob(job);
        this.optimalSubset = await SchedulerAPI.classicWAS(this.allJobs);
    }
}

export const appState = new AppState();