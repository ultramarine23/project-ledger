/*
This helper class is responsible for mapping string page-names into
respective Page objects

Again, the syntax for triggering a switch of pages is simply:
    loadPage(getPage("dashboard"));
Where loadPage and getPage are imported from app.ts and router.ts
respectively.
*/

import { CalculatorPage } from "../pages/calculator-page";
import { DashboardPage } from "../pages/dashboard-page";
import { JobsPage } from "../pages/jobs-page";
import { Page } from "../types/page";

export function getPage(pageName : string) : Page {
    switch (pageName) {
        case "jobs":
            return JobsPage();
        
        case "dashboard":
            return DashboardPage();
        
        case "calculator":
            return CalculatorPage();

        default:
            return DashboardPage();
    }
}