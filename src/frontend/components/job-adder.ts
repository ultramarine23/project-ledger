import Job from "../../entities/job";
import { appState } from "../app-state";
import { Component } from "../types/component";

export class JobAdder implements Component {
    constructor(
        private onSubmit : () => void
    ) {}

    render() : string {
        return `
        <form class="comp__job-adder">
            <div>
                <div class="formblock">
                    <label class="system text-color4" for="start-time-input">
                        Start Time:
                    </label>
                    <input type=number id="start-time-input" name="start">
                </div>
                <div class="formblock">
                    <label class="system text-color4" for="end-time-input">
                        End Time:
                    </label>
                    <input type=number id="end-time-input" name="end">
                </div>
                <div class="formblock">
                    <label class="system text-color4" for="profit-input">
                        Profit:
                    </label>
                    <input type=number id="profit-input" name="profit">
                </div>
                <div class="formblock">
                    <button type="submit">Submit</button>
                </div>
            </div>
            <div>
                <div class="formblock">
                    <label class="system text-color4" for="client-input">
                        Client:
                    </label>
                    <input type=text id="client-input" name="client">
                </div>
                <div class="formblock">
                    <label class="system text-color4" for="task-input">
                        Task:
                    </label>
                    <input type=text id="task-input" name="task">
                </div>
            </div>
        </form>
        `
    }

    attachEvents(root: HTMLElement): void {
        const form = root.querySelector(".comp__job-adder") as HTMLFormElement;
        
        form.addEventListener("submit", (event : SubmitEvent) => {
            event.preventDefault();

            const formData = new FormData(form);
            const start = Number(formData.get("start"));
            const end = Number(formData.get("end"));
            const profit = Number(formData.get("profit"));
        
            // consolidate form data into a Job object
            appState.registerJob(new Job(67, start, end, profit));

            // trigger the callback passed in (reloads the current page)
            this.onSubmit();
        });
    }
}