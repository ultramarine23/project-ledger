export default class Job {
    constructor(
        public jobID : number,
        public start: number,
        public end: number,
        public profit: number,
        public location : string = "",
        public client : string = ""
    ) {}
    
    toJSON() {
        return {
            jobID : this.jobID,
            start : this.start,
            end : this.end,
            profit : this.profit,
            location : this.location,
            client : this.client
        };
    }

    static fromJSON(jsonObj : any) {
        return new Job(
            jsonObj.jobID,
            jsonObj.start,
            jsonObj.end,
            jsonObj.profit,
            jsonObj.location,
            jsonObj.client
        );
    }
}