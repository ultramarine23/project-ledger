import { Component } from "../types/component";

export class Sidebar implements Component {
    render(): string {
        return `
        <div class="sidebar-header">
            <img src="../../assets/ledger-logo.png" class="sidebar-logo-icon">
        </div>

        <nav class="sidebar-nav">

            <button id="nav-jobs" type="button" class="sidebar-link">
                <span class="sidebar-link-icon">💼</span>
                <span class="paragraph">Jobs</span>
            </button>


            <button id="nav-calc" type="button" class="sidebar-link">
                <span class="sidebar-link-icon">🔢</span>
                <span class="paragraph">Calculator</span>
            </button>

            <button id="nav-settings" type="button" class="sidebar-link">
                <span class="sidebar-link-icon">⚙</span>
                <span class="paragraph">Settings</span>
            </button>

        </nav>
        `
    }

    attachEvents(root: HTMLElement): void {
        
    }
}