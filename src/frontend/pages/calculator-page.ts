import { Page } from "../types/page";
import { OptimizedJobsPanel } from "../components/optimized-jobs-panel";

export function CalculatorPage(): Page {
    const optimizedJobs = new OptimizedJobsPanel();

    let pageHTML: string = `
    <div id="calc-page">

        <div class="calc-page_header">
            Calculate Schedule
        </div>

        <!-- 📊 Stats Overview -->
        <div class="calc-stats">
            <div class="stat-card">
                <span class="stat-title">Total Profit</span>
                <span class="stat-value">$0</span>
            </div>

            <!-- where the total hours of the optimal schedule -->
            <div class="stat-card">
                <span class="stat-title">Total Hours</span>
                <span class="stat-value">0h</span>
            </div>
            
            <!-- how many jobs there are in the optimal sched -->
            <div class="stat-card">
                <span class="stat-title">Jobs Selected</span>
                <span class="stat-value">0</span>
            </div>
        </div>

        <!-- content where the actual jobs is shown-->
        <div id="calc-page_optimized">

            <!-- 📌 Left panel placeholder -->
            <div class="calc-sidebar">
                <span class="section-title">Insights</span>
                <p>No calculations yet.</p>
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
        }
    };
}