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
            <div class="algo-selector-panel">
                <span class="section-title">Select Optimization Engine</span>
                <div class="algo-options">
                    <label class="algo-radio-label">
                        <input type="radio" name="scheduler-algo" value="vanilla" checked>
                        <span>Vanilla WAS</span>
                    </label>
                    <label class="algo-radio-label">
                        <input type="radio" name="scheduler-algo" value="beam">
                        <span>Beam Search (Top K)</span>
                    </label>
                    <label class="algo-radio-label">
                        <input type="radio" name="scheduler-algo" value="restricted">
                        <span>Restricted Scheduler</span>
                    </label>
                </div>
            </div>

            <div class="constraints-panel" style="margin-top: 1rem; padding: 1rem; background: #f5f5f5; border-radius: 8px;">
                <span class="section-title">Exclude Times</span>
                <div style="display: flex; gap: 10px; margin-top: 10px; align-items: center;">
                    <input type="number" id="excl-start" placeholder="Start (e.g. 0)" style="width: 100px;">
                    <input type="number" id="excl-end" placeholder="End (e.g. 2)" style="width: 100px;">
                    <button type="button" id="btn-add-excl">Add</button>
                    <button type="button" id="btn-clear-excl">Clear All</button>
                </div>
                <ul id="excl-times-list" style="margin-top: 10px; padding-left: 20px;">
                    </ul>
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
            const startInput = root.querySelector("#excl-start") as HTMLInputElement;
            const endInput = root.querySelector("#excl-end") as HTMLInputElement;
            const addBtn = root.querySelector("#btn-add-excl") as HTMLButtonElement;
            const clearBtn = root.querySelector("#btn-clear-excl") as HTMLButtonElement;
            const listEl = root.querySelector("#excl-times-list") as HTMLUListElement;

            // Ensure the array exists on appState
            if (!appState.exclTimes) {
                appState.exclTimes = [];
            }

            // Helper to visually update the UI list
            const renderList = () => {
                listEl.innerHTML = appState.exclTimes
                    .map(time => `<li>Excluded: [${time[0]}, ${time[1]}]</li>`)
                    .join("");
            };

            // Render whatever might already be saved in state
            renderList();

            // Add Button Event
            addBtn.addEventListener("click", () => {
                const startVal = parseInt(startInput.value);
                const endVal = parseInt(endInput.value);

                if (!isNaN(startVal) && !isNaN(endVal) && startVal < endVal) {
                    appState.exclTimes.push([startVal, endVal]);
                    renderList();
                    // clear inputs for next entry
                    startInput.value = "";
                    endInput.value = "";
                } else {
                    alert("Please enter valid numbers. Start must be less than End.");
                }
            });
            
            // Clear Button Event
            clearBtn.addEventListener("click", () => {
                appState.exclTimes = []; // Empty the array in state
                renderList();            // Empty the UI list
            });
        }
        
        
    };
}