import sys
import json

import bisect
from job import Job
from job_collection import JobCollection


def maximize_profit(job_coll : JobCollection):
    # sort by end-time
    jobs_sorted = sorted(job_coll.jobs, key=lambda v: v.end)

    # initialize dp array
    dp = [[0, 0]]

    # weighted activity selection
    for job in jobs_sorted:
        i = bisect.bisect(dp, [job.start + 1]) - 1
        if dp[i][1] + job.profit > dp[-1][1]:
            dp.append([job.end, dp[i][1] + job.profit])
    
    return dp[-1][1]

def main():
    raw_input = sys.stdin.read()
    raw_jsondict = json.loads(raw_input)
    collection = JobCollection.from_jsondict(raw_jsondict)
    
    result = maximize_profit(collection)

    # json.dumps() is the python equivalent to stringify, converts dict -> json
    # output the json string into the output stream, for typescript to read
    test = {"result" : result}
    
    print(json.dumps(test))

if __name__ == "__main__":
    main()