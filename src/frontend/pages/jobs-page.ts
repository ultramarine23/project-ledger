import { SchedulerAPI } from "../../backend/scheduler-api";
import Job from "../../entities/job";
import JobCollection from "../../entities/job-collection";
import { loadPage } from "../app";
import { appState } from "../app-state";
import { AllJobsPanel } from "../components/all-jobs-panel";
import { OptimizedJobsPanel } from "../components/optimized-jobs-panel";
import { JobAdder } from "../components/job-adder";
import { getPage } from "../router/router";
import { Page } from "../types/page";

export function JobsPage() : Page {
    // instantiate block components
    const allJobsPanel = new AllJobsPanel(
    appState.allJobs,
    (id: number) => {
        appState.allJobs.delete(id);
        loadPage(getPage("jobs")); // or re-render
    }
);
    
    const jobAdder: JobAdder = new JobAdder(() => { loadPage(getPage("jobs")) });
    const optimizedJobsPanel : OptimizedJobsPanel = new OptimizedJobsPanel();

    let pageHTML: string = `
    <div id="jobs-page">
        <div class="sectionblock" id="jobs-page__form">
            <span class="semiheader color-primary">+ Add new Job</span>
            ${jobAdder.render()}
        </div>

        <div class="sectionblock" id="jobs-page__queue">
            <span class="subheader text-color4">Jobs Queue</span>
            ${allJobsPanel.render()}
        </div>
    </div>
    `

    return {
        html : pageHTML,

        attachEvents(root) {
            allJobsPanel.attachEvents(root);
            jobAdder.attachEvents(root);
            optimizedJobsPanel.attachEvents(root);

            const calRedirect = document.getElementById("page-redirect_link")

            calRedirect?.addEventListener("click", () => {

                loadPage(
                    getPage("calculator")
                );
            })
        }
    }
}


// async function recomputeSchedule() {
//     appState.optimalSubset = await SchedulerAPI.classicWAS(appState.allJobs);
// }


// async function refreshOptimalJobset(event : MouseEvent) {
//     event.preventDefault();

//     const result = await SchedulerAPI.classicWAS(appState.allJobs);
//     const optimizedJobsTimeline = document.getElementsByClassName("comp__optimized-timeline")[0] as HTMLDivElement;
//     optimizedJobsTimeline.textContent = result.getTotalProfit().toString();
// }
