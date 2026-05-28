import { Page } from "../types/page";
import { OptimizedJobsPanel } from "../components/optimized-jobs-panel";
import { stat } from "node:fs";
import { appState } from "../app-state";

export function CalculatorPage(): Page {
    const optimizedJobs = new OptimizedJobsPanel();

    //added the state so that its easier to connect the backend
    const state = {
        headerTitle: "Calculate Schedule",

        stats: {
            totalProfit: 0,
            totalHours: 0,
            jobsSelected: 0
        },

        insights: {
            title: "Insights",
            message: "No calculations yet."
        }
    };

    let pageHTML: string = `
    <div id="calc-page">

        <div class="calc-page_header">
            Calculate Schedule
        </div>

        <!-- 📊 Stats Overview -->
        <div class="calc-stats">
            <div class="stat-card">
                <span class="stat-title">Total Profit</span>
                <span class="stat-value">${state.stats.totalProfit}</span>
            </div>

            <!-- where the total hours of the optimal schedule -->
            <div class="stat-card">
                <span class="stat-title">Total Hours</span>
                <span class="stat-value">${state.stats.totalHours}</span>
            </div>
            
            <!-- how many jobs there are in the optimal sched -->
            <div class="stat-card">
                <span class="stat-title">Jobs Selected</span>
                <span class="stat-value">${state.stats.jobsSelected}</span>
            </div>
        </div>

        <!-- content where the actual jobs is shown-->
        <div id="calc-page_optimized">
            <div class="algo-settings">
                <span class="section-title">Algorithm Settings</span>
                <div style="margin-top: 10px;">
                    <label style="display: flex; align-items: center; gap: 8px; cursor: pointer;">
                        <input type="checkbox" id="chk-allow-suggestion" value="beam">
                        Allow suggestion
                    </label>
                </div>
            </div>

            

            <!-- 📦 Optimized Jobs -->
            <div class="calc-jobs">
                ${optimizedJobs.render()}
            </div>

            

        </div>

    

    </div>
    `;

    return {
        html: pageHTML,
        attachEvents(root) {
            optimizedJobs.attachEvents(root);
            // Grab the new checkbox
            const suggestionCheckbox = root.querySelector("#chk-allow-suggestion") as HTMLInputElement;

            // Listen for when it is checked or unchecked
            suggestionCheckbox?.addEventListener("change", (e) => {
                const target = e.target as HTMLInputElement;
                const isChecked = target.checked;
                const checkboxValue = target.value; // This will equal "beam"

                if (isChecked) {
                    console.log(`Suggestion enabled! Value is: ${checkboxValue}`);
                    // TODO: Save "beam" to your appState or local state here
                } else {
                    console.log("Suggestion disabled.");
                    // TODO: Remove it from your state here
                }
            });
        }
        
        
    };
}