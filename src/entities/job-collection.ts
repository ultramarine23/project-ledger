import Job from "./job.js";


export default class JobCollection {
    constructor(
        public jobs : Job[] = [],
        public generationTime : Date = new Date()
    ) {}

    addJob(newJob : Job) : void {
        this.jobs.push(newJob);
    }

    removeJob(targJob : Job) : void {
        this.jobs = this.jobs.filter(job => job.jobID !== targJob.jobID);
    }

    toJSON() : object {
        return {
            jobs : this.jobs.map(job => job.toJSON()),
            generationTime : this.generationTime.toISOString()
        };
    }
       
    static fromJSON(jsonObj : any) : JobCollection {
        return new JobCollection(
            jsonObj.jobs.map((j: any) => Job.fromJSON(j)),
            new Date(jsonObj.generationTime)
        );
    }
}