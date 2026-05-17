import Job from "../entities/job.js"
import JobCollection from "../entities/job-collection.js";
import { SchedulerAPI } from "../backend/scheduler-api.js";


let jobs : JobCollection = new JobCollection();
const jobInputForm = document.getElementById("job-input-form") as HTMLFormElement;
const optimizeRefreshButton = document.getElementById("optimized-jobs-refresh") as HTMLButtonElement;

jobInputForm.addEventListener("submit", receiveJobInputData);
optimizeRefreshButton.addEventListener("click", refreshOptimalJobset);

function receiveJobInputData(event : SubmitEvent) {
    event.preventDefault();

    // collect form data
    const formData = new FormData(jobInputForm);
    const start = Number(formData.get("start"));
    const end = Number(formData.get("end"));
    const profit = Number(formData.get("profit"));

    // consolidate form data into a Job object
    jobs.addJob(new Job(
        67,
        start,
        end,
        profit
    ));

    // create and display a job card
    const jobDisplayBlock = document.getElementById("job-display-cards") as HTMLDivElement;
    const jobCard = document.createElement("div");
    jobCard.className = "job-display-card";

    const title = document.createElement("span");
    title.className = "large-paragraph emp text-color4";
    title.textContent = String(profit);

    const details = document.createElement("span");
    details.className = "paragraph";
    details.textContent = String(start) + " => " + String(end);

    jobCard.appendChild(title);
    jobCard.appendChild(details);

    jobDisplayBlock.appendChild(jobCard);
}

async function refreshOptimalJobset(event : MouseEvent) {
    event.preventDefault();

    const result = await SchedulerAPI.optimizeSchedule(jobs);
    const optimizedJobsTimeline = document.getElementById("optimized-jobs-timeline") as HTMLDivElement;
    optimizedJobsTimeline.textContent = result.getTotalProfit().toString();

}

function displayOptimalJobset(jobset : JobCollection) : void {
    const optimizedJobsTimeline = document.getElementById("optimized-jobs-timeline") as HTMLDivElement;
    
    const tile = document.createElement("div");
    tile.className = "optimized-job-tile";
    tile.textContent = "ABCD"

    optimizedJobsTimeline.appendChild(tile);
}