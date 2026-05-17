import { Page } from "../types/page";

export function CalculatorPage() : Page {
    let pageHTML : string = `
    <div>
    </div>
    `

    return {
        html : pageHTML,
        attachEvents : attachCalculatorPageEvents
    }
}


export function attachCalculatorPageEvents() : void {
    
}