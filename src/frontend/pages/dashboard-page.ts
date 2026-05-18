import { Page } from "../types/page";

export function DashboardPage() : Page {
    let pageHTML : string = `

    `

    return {
        html : pageHTML,
        attachEvents : attachDashboardPageEvents
    }
}


export function attachDashboardPageEvents() : void {
    
}