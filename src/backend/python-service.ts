import { rejects } from "assert";
import { parse } from "path";

const { spawn } = require("child_process");

export class PythonService {

    static runScript(
        scriptPath : string,
        payload : unknown,
    ) : Promise<any> {
        return new Promise((resolve, reject) => {
            // spawn new instance of python script
            const python = spawn("python", [scriptPath]);

            // console.log("running:", scriptPath);
            let result = "";

            // whenever stdout outputs data, add to result string
            python.stdout.on("data", (data : any) => {
                result += data.toString();
            });

            // register any python error on the console
            python.stderr.on("data", (data : any) => {
                console.log("STDERR:");
                console.log(data.toString());
                console.log(" ");
            });

            // when python closes, resolve promise
            python.on("close", (code : any) => {
                // uncomment code below for debugging
                // console.log("python closed");
                // console.log("RAW OUTPUT:");
                // console.log(result);
                // console.log("RAW STDOUT:", JSON.stringify(result));
                // console.log("EXIT CODE:");
                // console.log(code);

                try {
                    const parsed = JSON.parse(result);
                    resolve(parsed);
                } catch (err) {
                    reject(err);
                }
            });

            // actually write payload onto stdin
            python.stdin.write(JSON.stringify(payload));

            // mark stdin as finished (stdout will be automatically collected)
            python.stdin.end();
        });
    }
}