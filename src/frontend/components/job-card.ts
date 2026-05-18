import Job from "../../entities/job";
import { Component } from "../types/component";

export class JobCard implements Component {
    constructor(
        private job : Job
    ) {}

    render(): string {
        return `
        <div class="comp__jobcard">
            <span class="large-paragraph emp text-color4">
                ${this.job.profit}
            </span>

            <span class="paragraph">
                ${this.job.start} to ${this.job.end}
            </span>
        </div>
        `
    }

    attachEvents(root: HTMLElement): void {
        
    }
}
