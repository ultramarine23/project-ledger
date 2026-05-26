import sys
import json

import bisect
from job import Job
from job_collection import JobCollection


def restricted_scheduler(
        job_coll : JobCollection, 
        max_hours : int, 
        excl_times : list[tuple],
        excl_job_ids : list[int]
    ) -> JobCollection:

    # convert excluded job ids to a set cuz O(1) lookups (123 mentioned!!)
    excl_job_ids = set(excl_job_ids)

    # remove all invalid jobs based on excluded jobs/times
    # this additional step technically makes this O(nE + nlogn) time
    # where E is the length of the excluded times array
    filtered_jobs = []

    for job in job_coll.jobs:
        # this'd be quite expensive if we didnt convert to set()
        if job.job_id in excl_job_ids:
            continue
        
        overlaps = False

        for excl_start, excl_end in excl_times:
            if job.end > excl_start and job.start < excl_end:
                overlaps = True
                break
        
        if overlaps == False:
            filtered_jobs.append(job)

    # sort by end-time -> O(n log n) time
    #
    # sorted() uses timsort, an optimized variant of mergesort that
    # hybridizes with insertion sort for smaller chunks
    jobs_sorted = sorted(filtered_jobs, key=lambda v: v.end)
    ends_sorted = [job.end for job in jobs_sorted]

    # precompute the compatibility array
    compat = [-1] * len(jobs_sorted)
    for i in range(len(jobs_sorted)):
        compat[i] = bisect.bisect_right(
            ends_sorted, 
            jobs_sorted[i].start
        ) - 1
    
    # the arrays have evolved into matrices .-.
    # dp[i][h] = max profit going up to jobs_sorted[i],
    # with maximum hours h
    # knapsack-esque?
    dp = [[None] * (max_hours + 1) for _ in range(len(jobs_sorted))]
    selected = [[False] * (max_hours + 1) for _ in range(len(jobs_sorted))]

    # include - profit if the job is included in optimal set
    # (even if this means it is the only job in the set)
    # exclude - profit if it is not
    # the greater of the two is taken as dp[i][h]
    for i in range(len(jobs_sorted)):
        duration = jobs_sorted[i].end - jobs_sorted[i].start

        for h in range(max_hours + 1):
            # include is now -1 by default, as it is only modified when
            # duration fits into cur_max_hours; exclude is prioritized
            include = -1
            exclude = 0

            if duration <= h:
                include = jobs_sorted[i].profit 

                if compat[i] != -1:
                    include += dp[compat[i]][h - duration]
            
            if i > 0:
                exclude = dp[i - 1][h]
            
            if include > exclude:
                dp[i][h] = include
                selected[i][h] = True
            else:
                dp[i][h] = exclude
                selected[i][h] = False
    

    # backtrack backtrack backtrack!!!!
    optimal_jobs = []
    j = len(jobs_sorted) - 1
    h = max_hours

    while j != -1:
        if selected[j][h] == True:
            optimal_jobs.append(jobs_sorted[j])

            h -= jobs_sorted[j].end - jobs_sorted[j].start
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
    result = restricted_scheduler(collection, 8).to_jsondict()
    # json.dumps() is the python equivalent to stringify, converts dict -> json
    # output the json string into the output stream, for typescript to read    
    print(json.dumps(result))

if __name__ == "__main__":
    main()

