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

        <!-- where settings to what algo to use -->
        <div id="calc-page_optimized">

            <div class="algo-settings">
                <span class="section-title">Algorithm Settings</span>

                <div style="margin-top: 10px;">
                    <label style="display: flex; align-items: center; gap: 8px; cursor: pointer;">
                        <input type="checkbox" id="chk-allow-suggestion" value="beam">
                        Allow suggestion
                    </label>
                </div>

                <div style="margin-top: 15px; border-top: 1px solid #ddd; padding-top: 10px;">
                    <strong>Exclude Time Range:</strong>
                    <div style="display: flex; gap: 10px; margin-top: 5px; align-items: center;">
                        <input type="number" id="algo-excl-start" placeholder="Start" style="width: 80px;">
                        <input type="number" id="algo-excl-end" placeholder="End" style="width: 80px;">
                        <button type="button" id="btn-algo-add-excl">Add</button>
                    </div>
                    <div id = "error-container"> </div>
                    
                    <ul id="algo-excl-list" style="margin-top: 10px; padding-left: 20px; font-size: 0.9em;"></ul>
                </div>

            </div>

            <!-- 📦 Optimized Jobs, jobs that did go through an algo -->
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

            const startInput = root.querySelector("#algo-excl-start") as HTMLInputElement;
            const endInput = root.querySelector("#algo-excl-end") as HTMLInputElement;
            const addBtn = root.querySelector("#btn-algo-add-excl") as HTMLButtonElement;
            const listEl = root.querySelector("#algo-excl-list") as HTMLUListElement;
            
            const errorMssg = root.querySelector("#error-container") as HTMLDivElement;
            
            // (Optional but recommended) Helper function to visually update the list on the screen
            const renderExclList = () => {
                if (!listEl) return;
                listEl.innerHTML = appState.exclTimes
                    .map(time => `<li>Excluded: [${time[0]}, ${time[1]}]</li>`)
                    .join("");
            };

            // Render the list immediately in case there are already times in the state
            renderExclList();

            // 2. Add the Event Listener to the button
            addBtn?.addEventListener("click", () => {
                // Convert the string inputs into integers
                const startVal = parseInt(startInput.value);
                const endVal = parseInt(endInput.value);

                // Validate: Make sure they are real numbers AND start is before end
                if (!isNaN(startVal) && !isNaN(endVal)) {
                    
                    // Push the array pair to your AppState!
                    if ((startVal > endVal)) {
                        errorMssg.innerHTML = "<p style='color:red'>The start can't be greater than the end</p>";
                        return;
                    } else {
                        errorMssg.innerHTML = "<p></p>";
                    }
                    

                    appState.exclTimes.push([startVal, endVal]);
                    
                    // Update the UI list
                    renderExclList();
                    
                    // Clear the inputs so the user can easily type the next ones
                    startInput.value = "";
                    endInput.value = "";
                    
                    console.log("Updated exclTimes:", appState.exclTimes);
                } else {
                    alert("Please enter valid numbers. Start time must be less than End time.");
                }
            });
        }
        
        
    };
}