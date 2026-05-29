import Job from "../../entities/job";
import { Component } from "../types/component"
import { appState } from "../app-state";
import { formatTime } from "../../backend/numberToTime";

export class JobCard implements Component {
    constructor(
        private job: Job,
        private onDelete: (id: number) => void
    ) {}

    render(): string {
        return `
        <div class="comp__jobcard" data-job-id="${this.job.jobID}" style="border: 1px solid #e2e8f0; border-radius: 8px; padding: 16px; margin-bottom: 12px; background-color: #ffffff; box-shadow: 0 2px 4px rgba(0,0,0,0.05); font-family: sans-serif;">
            
            <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid #edf2f7; padding-bottom: 8px; margin-bottom: 12px;">
                <h3 style="margin: 0; font-size: 1.1rem; color: #2d3748;">
                    ${this.job.client || 'Unknown Client'}
                </h3>
                
                <div style="display: flex; gap: 8px;">
                    <button class="jobcard__hide" data-job-id="${this.job.jobID}" style="padding: 4px 8px; font-size: 0.8rem; cursor: pointer; border: 1px solid #cbd5e0; background: #f7fafc; border-radius: 4px; color: #4a5568;">
                        Hide
                    </button>
                    <button class="jobcard__delete" data-job-id="${this.job.jobID}" style="padding: 4px 8px; font-size: 0.8rem; cursor: pointer; border: 1px solid #fc8181; background: #fff5f5; color: #c53030; border-radius: 4px;">
                        ✕
                    </button>
                </div>
            </div>

            <div style="display: flex; justify-content: space-between; align-items: flex-end;">
                
                <div class="job-card_text" style="font-size: 0.9rem; color: #4a5568; line-height: 1.5;">
                    <div style="display: flex; align-items: center; gap: 6px;">
                        <span>⏱️</span>
                        <span>${formatTime(this.job.start)} - ${formatTime(this.job.end)}</span>
                    </div>
                    <div style="display: flex; align-items: center; gap: 6px; margin-top: 4px;">
                        <span>📍</span>
                        <span>${this.job.location || 'TBD'}</span>
                    </div>
                </div>

                <div style="text-align: right;">
                    <span style="font-size: 0.8rem; color: #718096; text-transform: uppercase; letter-spacing: 0.05em;">Profit</span><br>
                    <strong style="font-size: 1.2rem; color: #38a169;">$${this.job.profit}</strong>
                </div>
                
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

    } // Closes attachEvents
} // Closes JobCard Class