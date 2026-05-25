import Job from "../../entities/job";
import { Component } from "../types/component";

export class JobCard implements Component {
    constructor(
        private job: Job,
        private onDelete: (id: number) => void
    ) {}

    render(): string {
        return `
        <div class="comp__jobcard" data-job-id="${this.job.jobID}">
            
            <button
                class="jobcard__delete"
                data-job-id="${this.job.jobID}"
            >
                ✕
            </button>

            <div class="job-card_text">
                <strong>${this.job.client}</strong><br>
                Start: ${this.job.start}<br>
                End: ${this.job.end}<br>
                Profit: $${this.job.profit}
            </div>

        </div>
        `;
    }

    attachEvents(root: HTMLElement): void {
        const deleteBtn = root.querySelector(
            `.jobcard__delete[data-job-id="${this.job.jobID}"]`
        );

        deleteBtn?.addEventListener("click", () => {
            this.onDelete(this.job.jobID);
        });
    }
}