import path from "path";

import JobCollection from "../entities/job-collection.js";
import { PythonService } from "./python-service.js";

export class SchedulerAPI {
    // fetch wrapper for python/scheduler.py
    static async classicWAS(
        coll : JobCollection
    ) {
        const scriptPath = path.join(
            __dirname,
            "../../python/vanilla_scheduler.py"
        );

        const pythonOutput = await PythonService.runScript(
            scriptPath,
            coll.toJSON()
        );
        
        return JobCollection.fromJSON(pythonOutput);
    }
}