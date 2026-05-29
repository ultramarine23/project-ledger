// Import the Page interface to ensure this component follows the page structure
import { Page } from "../types/page";
// Import the generic AllJobsPanel instead of the OptimizedJobsPanel
import { AllJobsPanel } from "../components/all-jobs-panel"; 
// Import the shared state so we can read the selected algorithm and job data
import { appState } from "../app-state";
// Import the API to communicate with your Python backend
import { SchedulerAPI } from "../../backend/scheduler-api"; 

export function CalculatorPage(): Page {
    // This local state handles the UI text for the stats at the top
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

    // The raw HTML structure of the page
    let pageHTML: string = `
    <div id="calc-page">

        <div class="calc-page_header">
            Select your settings and run the calculation.
        </div>
        
        <div id="calc-page_optimized">
            <div class="semiheader">Calculator Settings</div>
            <div style="border-radius: 8px;">                
                <div style="display: flex; gap: 15px;">
                    <span class="large-paragraph"> Select calculation mode:<br></span>
                    <label style="cursor: pointer;">
                        <input type="radio" name="algo-select" value="classicAlgo" checked> 
                        <span class="large-paragraph"> Quick Solve </span>
                    </label>
                    <label style="cursor: pointer;">
                        <input type="radio" name="algo-select" value="restrictAlgo">
                        <span class="large-paragraph"> Restricted Solve </span>
                    </label>
                    <label style="cursor: pointer;">
                        <input type="radio" name="algo-select" value="beamAlgo">
                        <span class="large-paragraph"> Top K </span>
                    </label>
                </div>

                <div id="panel-restrict" style="display: none; margin-top: 15px; border-top: 1px solid #ddd; padding-top: 10px;">
                    <strong>Exclude Time Range:</strong>
                    <div style="display: flex; gap: 10px; margin-top: 5px; align-items: center;">
                        <input type="number" id="algo-excl-start" placeholder="Start" style="width: 80px;">
                        <input type="number" id="algo-excl-end" placeholder="End" style="width: 80px;">
                        <button type="button" id="btn-algo-add-excl">Add</button>
                    </div>
                    
                    <div id="sel-max-work-hrs" style="margin-top: 15px;"> 
                        <label style="display: flex; align-items: center; gap: 8px; cursor: pointer;">
                            <input type="checkbox" id="chk-limit-hrs">
                            Limit Max Work Hours
                        </label>
                    </div>
                    <div id="inp-max-work-hrs" style="display: none; margin-top: 5px; padding-left: 24px;"> 
                        <input type="number" id="algo-max-hrs" placeholder="e.g. 40" style="width: 100px;">
                    </div>

                    <div id="error-container"> </div>
                    <ul id="algo-excl-list" style="margin-top: 10px; padding-left: 20px; font-size: 0.9em;"></ul>
                </div>

                <div id="panel-beam" style="display: none; margin-top: 15px; border-top: 1px solid #ddd; padding-top: 10px;">
                    <strong>Beam Search Settings:</strong>
                    <div style="margin-top: 5px;">
                        <label style="display: flex; align-items: center; gap: 8px;">
                            Max Selections: 
                            <input type="number" id="algo-beam-max" placeholder="e.g. 3" style="width: 80px;">
                        </label>
                    </div>
                </div>
            </div>

            <div style="margin-top: 20px;">
                <button id="btn-run-algo" style="padding: 10px 20px; font-size: 16px; cursor: pointer; background: #007bff; color: white; border: none; border-radius: 4px;">
                    Run Calculation
                </button>
            </div>

            <div class="calc-jobs" id="optimized-results-container" style="margin-top: 20px;">
                <p class="color-muted">(Results will show here)</p>
            </div>
        </div>
    </div>
    `;

    return {
        html: pageHTML,
        attachEvents(root) {
            
            // ==========================================
            // 1. ALGORITHM SELECTION LOGIC
            // Swaps the visible settings panels when clicking radio buttons
            // ==========================================
            const radios = root.querySelectorAll('input[name="algo-select"]') as NodeListOf<HTMLInputElement>;
            const panelRestrict = root.querySelector("#panel-restrict") as HTMLDivElement;
            const panelBeam = root.querySelector("#panel-beam") as HTMLDivElement;

            radios.forEach(radio => {
                radio.addEventListener("change", (e) => {
                    const selectedAlgo = (e.target as HTMLInputElement).value;
                    
                    // Update global state so the calculate button knows what to run
                    appState.activeAlgo = selectedAlgo;
                    
                    // Reset panels to hidden
                    panelRestrict.style.display = "none";
                    panelBeam.style.display = "none";

                    // Show the specific panel based on user choice
                    if (selectedAlgo === "restrictAlgo") {
                        panelRestrict.style.display = "block";
                    } else if (selectedAlgo === "beamAlgo") {
                        panelBeam.style.display = "block";
                    }
                });
            });

            // ==========================================
            // 2. BEAM ALGO LOGIC
            // Saves the user's typed 'Max Selections' to the appState
            // ==========================================
            const beamMaxInput = root.querySelector("#algo-beam-max") as HTMLInputElement;
            beamMaxInput?.addEventListener("input", (e) => {
                const val = parseInt((e.target as HTMLInputElement).value);
                if (!isNaN(val)) appState.beamMaxSelections = val;
            });

            // ==========================================
            // 3. RESTRICT ALGO LOGIC
            // Handles excluding times and limiting max work hours
            // ==========================================
            const startInput = root.querySelector("#algo-excl-start") as HTMLInputElement;
            const endInput = root.querySelector("#algo-excl-end") as HTMLInputElement;
            const addBtn = root.querySelector("#btn-algo-add-excl") as HTMLButtonElement;
            const listEl = root.querySelector("#algo-excl-list") as HTMLUListElement;
            const errorMssg = root.querySelector("#error-container") as HTMLDivElement;
            
            // Helper function to draw the list of excluded times
            const renderExclList = () => {
                if (!listEl) return;
                listEl.innerHTML = appState.exclTimes
                    .map(time => `<li>Excluded: [${time[0]}, ${time[1]}]</li>`)
                    .join("");
            };

            renderExclList();

            // Pushes new excluded times to state when "Add" is clicked
            addBtn?.addEventListener("click", () => {
                const startVal = parseInt(startInput.value);
                const endVal = parseInt(endInput.value);

                if (!isNaN(startVal) && !isNaN(endVal)) {
                    if (startVal > endVal) {
                        errorMssg.innerHTML = "<p style='color:red'>The start can't be greater than the end</p>";
                        return;
                    } else {
                        errorMssg.innerHTML = "<p></p>";
                    }

                    appState.exclTimes.push([startVal, endVal]);
                    renderExclList();
                    
                    startInput.value = "";
                    endInput.value = "";
                } else {
                    alert("Please enter valid numbers.");
                }
            });

            // Handles the checkbox to show/hide the max hours input
            const limitHrsCheckbox = root.querySelector("#chk-limit-hrs") as HTMLInputElement;
            const maxHrsContainer = root.querySelector("#inp-max-work-hrs") as HTMLDivElement;
            const maxHrsInput = root.querySelector("#algo-max-hrs") as HTMLInputElement;

            limitHrsCheckbox?.addEventListener("change", (e) => {
                const isChecked = (e.target as HTMLInputElement).checked;
                if (isChecked) {
                    maxHrsContainer.style.display = "block";
                    const val = parseInt(maxHrsInput.value);
                    if (!isNaN(val)) appState.maxHrs = val;
                } else {
                    maxHrsContainer.style.display = "none";
                    appState.maxHrs = 0; 
                }
            });

            // Updates state as the user types a max hour limit
            maxHrsInput?.addEventListener("input", (e) => {
                const val = parseInt((e.target as HTMLInputElement).value);
                // If they delete everything manually, default back to 0
                if (!isNaN(val)) {
                    appState.maxHrs = val;
                } else {
                    appState.maxHrs = 0; 
                }
            });


            // ==========================================
            // 4. EXECUTION LOGIC (Connecting frontend to backend)
            // ==========================================
            const runBtn = root.querySelector("#btn-run-algo") as HTMLButtonElement;
            const resultsContainer = root.querySelector("#optimized-results-container") as HTMLDivElement;
            console.log(resultsContainer);
            // This function runs when the user clicks "Run Calculation"
            runBtn?.addEventListener("click", async () => {
                // Temporarily disable the button so the user doesn't spam click it
                runBtn.disabled = true;
                runBtn.textContent = "Calculating...";
                resultsContainer.innerHTML = "<p>Loading...</p>";

                try {
                    let optimizedSchedules;
                    let optimizedJobs; // This will hold the JobCollection returned by Python

                    // Check which algorithm is currently active in the state
                    if (appState.activeAlgo === "classicAlgo") {
                        optimizedJobs = await SchedulerAPI.classicWAS(appState.allJobs);
                        
                    } else if (appState.activeAlgo === "restrictAlgo") {
                        // Note: Using "as number" because AppState defines it as uppercase 'Number', 
                        // but your API expects lowercase 'number' primitives.
                        optimizedJobs = await SchedulerAPI.restrictedWAS(
                            appState.allJobs,
                            appState.maxHrs as number,
                            appState.exclTimes as [number, number][],
                            appState.exclJobIDs as number[]
                        );
                        
                    } else if (appState.activeAlgo === "beamAlgo") {
                        optimizedSchedules = await SchedulerAPI.beamWAS(
                            appState.allJobs,
                            appState.beamMaxSelections as number
                        );
                    }

                    // Once Python is done, we update the app state
                    if (optimizedJobs) {
                        appState.optimalSubset = optimizedJobs;
                        
                        // Instantiate the AllJobsPanel with the newly returned data.
                        // We pass an empty arrow function `() => {}` for the onDelete parameter
                        // because we likely don't want users deleting jobs straight out of the results screen.
                        const resultsPanel = new AllJobsPanel(optimizedJobs, () => {
                            console.log("Delete disabled in results view.");
                        });

                        // Inject the generated HTML into our container
                        resultsContainer.innerHTML = resultsPanel.render();
                        // Attach the event listeners to the new cards inside the container
                        resultsPanel.attachEvents(resultsContainer);
                    } else if (optimizedSchedules) {

                    }

                } catch (error) {
                    console.error("Failed to calculate schedule:", error);
                    resultsContainer.innerHTML = `<p style="color:red;">Error running calculation. Check console.</p>`;
                } finally {
                    // Turn the button back on
                    runBtn.disabled = false;
                    runBtn.textContent = "Run Calculation";
                }
            });
        }
    };
}