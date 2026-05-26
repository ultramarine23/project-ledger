import { SchedulerAPI } from "../../backend/scheduler-api";
import JobCollection from "../../entities/job-collection";
import { appState } from "../app-state";
import { Component } from "../types/component";
import { JobCard } from "./job-card";

export class OptimizedJobsPanel implements Component {
    private cards : JobCard[] = [];

    constructor() {
        
    }

    render(): string {
        const coll = appState.optimalSubset;

        coll.jobs.map((job) => {
            this.cards.push(new JobCard(job));
        })

        return `
        <div class="comp__optimized">
            <button class="comp__optimized-refresher" type="button">Refresh</button>

            <div class="comp__optimized-timeline">
                ${this.cards.map((card) => card.render()).join("")}
            </div>
        </div>
        `
    }

    attachEvents(root: HTMLElement): void {
        //const button = root.querySelector(".comp__optimized-refresher") as HTMLButtonElement;
        //button.addEventListener("click", async (event : Event) => {
        //    appState.optimalSubset = await SchedulerAPI.classicWAS(appState.allJobs);
        //});
    }
}