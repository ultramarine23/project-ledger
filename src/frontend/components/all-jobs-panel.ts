import JobCollection from "../../entities/job-collection";
import { Component } from "../types/component";
import { JobCard } from "./job-card";

export class AllJobsPanel implements Component {
    private cards : JobCard[] = [];

    constructor(
    coll: JobCollection,
    private onDelete: (id: number) => void
) {
    coll.jobs.forEach((job) => {
        this.cards.push(
            new JobCard(job, this.onDelete)
        );
    });
}

    render(): string {
        return `
        <div class="comp__jobcard-panel">
            ${this.cards.map(card => card.render()).join("")}
        </div>
        `;
    }

    attachEvents(root: HTMLElement): void {
        this.cards.forEach((card) => {
            card.attachEvents(root)
        });
    }
}