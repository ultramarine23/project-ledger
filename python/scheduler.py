## MARK

import sys
import json

import bisect
from job import Job
from job_collection import JobCollection


def maximize_profit(job_coll : JobCollection) -> JobCollection:
    # sort by end-time -> O(n log n) time
    #
    # sorted() uses timsort, an optimized variant of mergesort that
    # hybridizes with insertion sort for smaller chunks
    jobs_sorted = sorted(job_coll.jobs, key=lambda v: v.end)


    # initialize dp array, each element representing a column
    # for each subarr: [endtime, max_possible_profit, prev_index]
    dp_jobs = [None]
    dp_ends = [0]
    max_profits = [0]
    dp_prev = [-1]
    chosen = [False]

    # weighted activity selection
    for job in jobs_sorted:
        i = bisect.bisect(dp_ends, job.start + 1) - 1

        max_candidate = max_profits[i] + job.profit

        if max_candidate > max_profits[-1]:
            max_profits.append(max_candidate)
            dp_prev.append(i)
            chosen.append(True)
        else:
            max_profits.append(max_profits[-1])
            dp_prev.append(len(max_profits) - 2)
            chosen.append(False)
    

    # reconstruction
    optimal_jobs = []
    j = len(max_profits) - 1

    while j > 0:
        if chosen[j]:
            optimal_jobs.append(jobs_sorted[j - 1])
            j = dp_prev[j]
        else:
            j -= 1

    optimal_coll = JobCollection(optimal_jobs)
    return optimal_coll


def main():
    raw_input = sys.stdin.read()
    raw_jsondict = json.loads(raw_input)
    collection = JobCollection.from_jsondict(raw_jsondict)
    print(collection, file=sys.stderr)
    result = maximize_profit(collection).to_jsondict()
    # json.dumps() is the python equivalent to stringify, converts dict -> json
    # output the json string into the output stream, for typescript to read    
    print(json.dumps(result))

if __name__ == "__main__":
    main()