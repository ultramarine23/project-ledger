import { Page } from "../types/page";

export function JobsPage() : Page {
    let pageHTML : string = `
    <span class="header text-color6">Freelancer Scheduler</span>

    <form class="body-section" id="job-input-form">
        <div class="job-input-form-section">
            <label class="system text-color4" for="start-time-input">Start Time:</label>
            <input type=number id="start-time-input" name="start">
        </div>
        <div class="job-input-form-section">
            <label class="system text-color4" for="end-time-input">End Time:</label>
            <input type=number id="end-time-input" name="end">
        </div>
        <div class="job-input-form-section">
            <label class="system text-color4" for="profit-input">Profit:</label>
            <input type=number id="profit-input" name="profit">
        </div>
        <div class="job-input-form-section">
            <button type="submit">Submit</button>
        </div>
    </form>

    <div class="body-section" id="job-display-block">
        <span class="subheader text-color4">Jobs Queue</span>

        <div id="job-display-cards">
        </div>
    </div>

    <div class="body-section" id="optimized-jobs-block">
        <span class="subheader text-color4">Optimized Jobs</span>
        <button id="optimized-jobs-refresh" type="button">Refresh</button>

        <div id="optimized-jobs-timeline">
        </div>
    </div>
    `

    return {
        html : pageHTML,
        attachEvents : attachJobsPageEvents
    }
}


export function attachJobsPageEvents() : void {

}