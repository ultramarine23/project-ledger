import sys
import json

import bisect
from job import Job
from job_collection import JobCollection


def vanilla_scheduler(job_coll : JobCollection) -> JobCollection:
    # sort by end-time -> O(n log n) time
    #
    # sorted() uses timsort, an optimized variant of mergesort that
    # hybridizes with insertion sort for smaller chunks
    jobs_sorted = sorted(job_coll.jobs, key=lambda v: v.end)
    ends_sorted = [job.end for job in jobs_sorted]

    # precompute the compatibility array
    compat = [-1] * len(jobs_sorted)
    for i in range(len(jobs_sorted)):
        compat[i] = bisect.bisect_right(
            ends_sorted, 
            jobs_sorted[i].start
        ) - 1
    
    # initialize dp array: dp[i] represents the maximum profit going
    # up to jobs_sorted[i]
    dp = [None] * len(jobs_sorted)
    selected = [False] * len(jobs_sorted)

    # include - profit if the job is included in optimal set
    # (even if this means it is the only job in the set)
    # exclude - profit if it is not
    # the greater of the two is taken as dp[i]
    for i in range(len(jobs_sorted)):
        include = jobs_sorted[i].profit
        exclude = 0

        if compat[i] != -1:
            include += dp[compat[i]]

        if i > 0:
            exclude = dp[i - 1]
        
        if include > exclude:
            dp[i] = include
            selected[i] = True
        else:
            dp[i] = exclude
            selected[i] = False
    

    # backtrack backtrack backtrack!!!!
    optimal_jobs = []
    j = len(jobs_sorted) - 1

    while j != -1:
        if selected[j] == True:
            optimal_jobs.append(jobs_sorted[j])
            j = compat[j]
        else:
            j -= 1

    optimal_jobs.reverse()

    # convert the job array into a JobCollection and then return
    optimal_coll = JobCollection(optimal_jobs)
    return optimal_coll


def main():
    raw_input = sys.stdin.read()
    raw_jsondict = json.loads(raw_input)
    collection = JobCollection.from_jsondict(raw_jsondict)
    print(collection, file=sys.stderr)
    result = vanilla_scheduler(collection).to_jsondict()
    # json.dumps() is the python equivalent to stringify, converts dict -> json
    # output the json string into the output stream, for typescript to read    
    print(json.dumps(result))

if __name__ == "__main__":
    main()

