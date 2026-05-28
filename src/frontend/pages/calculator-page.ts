import { Page } from "../types/page";
import { OptimizedJobsPanel } from "../components/optimized-jobs-panel";
import { appState } from "../app-state";

export function CalculatorPage(): Page {
    const optimizedJobs = new OptimizedJobsPanel();

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

        <div class="calc-stats">
            <div class="stat-card">
                <span class="stat-title">Total Profit</span>
                <span class="stat-value">${state.stats.totalProfit}</span>
            </div>
            <div class="stat-card">
                <span class="stat-title">Total Hours</span>
                <span class="stat-value">${state.stats.totalHours}</span>
            </div>
            <div class="stat-card">
                <span class="stat-title">Jobs Selected</span>
                <span class="stat-value">${state.stats.jobsSelected}</span>
            </div>
        </div>

        <div id="calc-page_optimized">
            <div class="algo-settings" style="margin-top: 1rem; padding: 1rem; background: #f5f5f5; border-radius: 8px;">
                <span class="section-title">Algorithm Settings</span>

                <div style="margin-top: 10px; display: flex; gap: 15px;">
                    <label style="cursor: pointer;">
                        <input type="radio" name="algo-select" value="classicAlgo" checked> Classic
                    </label>
                    <label style="cursor: pointer;">
                        <input type="radio" name="algo-select" value="restrictAlgo"> Restrict
                    </label>
                    <label style="cursor: pointer;">
                        <input type="radio" name="algo-select" value="beamAlgo"> Beam
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

            // --- 1. ALGORITHM SELECTION LOGIC ---
            const radios = root.querySelectorAll('input[name="algo-select"]') as NodeListOf<HTMLInputElement>;
            const panelRestrict = root.querySelector("#panel-restrict") as HTMLDivElement;
            const panelBeam = root.querySelector("#panel-beam") as HTMLDivElement;

            radios.forEach(radio => {
                radio.addEventListener("change", (e) => {
                    const selectedAlgo = (e.target as HTMLInputElement).value;
                    
                    // Save to state
                    appState.activeAlgo = selectedAlgo;
                    console.log(`Algorithm selected: ${appState.activeAlgo}`);

                    // Hide all panels first
                    panelRestrict.style.display = "none";
                    panelBeam.style.display = "none";

                    // Show specific panel based on selection
                    if (selectedAlgo === "restrictAlgo") {
                        panelRestrict.style.display = "block";
                    } else if (selectedAlgo === "beamAlgo") {
                        panelBeam.style.display = "block";
                    }
                });
            });

            // --- 2. BEAM ALGO LOGIC ---
            const beamMaxInput = root.querySelector("#algo-beam-max") as HTMLInputElement;
            beamMaxInput?.addEventListener("input", (e) => {
                const val = parseInt((e.target as HTMLInputElement).value);
                if (!isNaN(val)) {
                    appState.beamMaxSelections = val;
                    console.log(`Beam max selections set to: ${appState.beamMaxSelections}`);
                }
            });


            // --- 3. RESTRICT ALGO LOGIC (Exclude Times & Max Hours) ---
            const startInput = root.querySelector("#algo-excl-start") as HTMLInputElement;
            const endInput = root.querySelector("#algo-excl-end") as HTMLInputElement;
            const addBtn = root.querySelector("#btn-algo-add-excl") as HTMLButtonElement;
            const listEl = root.querySelector("#algo-excl-list") as HTMLUListElement;
            const errorMssg = root.querySelector("#error-container") as HTMLDivElement;
            
            const renderExclList = () => {
                if (!listEl) return;
                listEl.innerHTML = appState.exclTimes
                    .map(time => `<li>Excluded: [${time[0]}, ${time[1]}]</li>`)
                    .join("");
            };

            renderExclList();

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

            // Max Work Hours Checkbox
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

            maxHrsInput?.addEventListener("input", (e) => {
                const val = parseInt((e.target as HTMLInputElement).value);
                if (!isNaN(val)) appState.maxHrs = val;
            });
        }
    };
}