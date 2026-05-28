import Job from "../../entities/job";
import { Component } from "../types/component";
import { appState } from "../app-state";

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

           <button class="jobcard__hide" data-job-id="${this.job.jobID}">
                Hide
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

        // 1. Delete Button Logic (Fixed the missing closing syntax here)
        deleteBtn?.addEventListener("click", () => {
            this.onDelete(this.job.jobID);
        }); 

        // 2. New Hide Button Logic
        const hideBtn = root.querySelector(
            `.jobcard__hide[data-job-id="${this.job.jobID}"]`
        );
        
        // Grab the main container of this specific job card
        const cardElement = root.querySelector(
            `.comp__jobcard[data-job-id="${this.job.jobID}"]`
        );

        hideBtn?.addEventListener("click", () => {
            if (!cardElement) return;

            // Toggle a CSS class that makes it transparent
            cardElement.classList.toggle("unselected");

            // Check if it is currently unselected
            const isUnselected = cardElement.classList.contains("unselected");
           

            if (isUnselected) {
                // Add the Job ID to the appState
                appState.exclJobIDs.push(this.job.jobID);
            } else {
                // If they click it again to "un-hide" it, remove it from the state
                appState.exclJobIDs = appState.exclJobIDs.filter(id => id !== this.job.jobID);
            }
        });
    } // Closes attachEvents
} // Closes JobCard Class