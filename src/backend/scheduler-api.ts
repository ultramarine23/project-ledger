import path from "path";

import JobCollection from "../entities/job-collection.js";
import { PythonService } from "./python-service.js";

export class SchedulerAPI {
    // fetch wrapper for python/scheduler.py
    static async optimizeSchedule(
        coll : JobCollection
    ) {
        const scriptPath = path.join(
            __dirname,
            "../../python/scheduler.py"
        );

        const pythonOutput = await PythonService.runScript(
            scriptPath,
            coll.toJSON()
        );
        
        return JobCollection.fromJSON(pythonOutput);
    }
}