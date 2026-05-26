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

    static async restrictedWAS(
        coll : JobCollection,
        max_hours : number,
        excluded_times : [number, number][],
        excluded_job_ids : number[]
    ) {
        const scriptPath = path.join(
            __dirname,
            "../../python/restricted_scheduler.py"
        )

        const pythonOutput = await PythonService.runScript(
            scriptPath,
            {
                "coll" : coll.toJSON(),
                "maxHours" : max_hours,
                "exclTimes" : excluded_times,
                "exclJobIDs" : excluded_job_ids
            }
        )

        return JobCollection.fromJSON(pythonOutput)
    }

    static async beamWAS(
        coll : JobCollection,
        k : number
    ) {
        const scriptPath = path.join(
            __dirname,
            "../../python/beam_scheduler.py"
        )

        const pythonOutput = await PythonService.runScript(
            scriptPath,
            {
                "coll" : coll.toJSON(),
                "k" : k
            }
        )

        return JobCollection.fromJSON(pythonOutput)
    }
}