import Job from "../../entities/job";
import { Component } from "../types/component";

export class JobCard implements Component {
    constructor(
        private job : Job
    ) {}

    render(): string {
        return `
        <div class="comp__jobcard">
            <div class="jobcard__top">
                <span class="job-card_text">
                    ${this.job.profit}
                </span>
            </div>

            <div class="jobcard__meta">
                <span class="job-card_text">
                    Client: ${this.job.client}
                </span>

                <span class="job-card_text">
                    Location: ${this.job.location}
                </span>
            </div>

            <div class="jobcard_footer">
                <p class = "job-card_text">${this.job.start} to ${this.job.end}</p>
            </div>
        </div>
        `
    }

    attachEvents(root: HTMLElement): void {
        
    }
}
