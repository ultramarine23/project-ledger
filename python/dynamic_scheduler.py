from job_collection import JobCollection
from job import Job
from scheduler_node import SchedulerNode

import sys
from bisect import bisect_right

def dynamic_scheduler(
        base_coll : JobCollection,
        top_count : int,
    ) -> list[JobCollection]:
    # dp[i] represents the top [top_count] best schedulings
    # up to the event with index i, basically a cooler WAS >B)
    jobs = base_coll.jobs
    dp : list[list[SchedulerNode]] = [None] * len(jobs)

    # similar to vanilla WAS, sort the jobs based on ends
    # this runs in O(n log n) time
    jobs_sorted = sorted(base_coll.jobs, key=lambda v : v.end)
    ends_sorted = [j.end for j in jobs_sorted]
    
    # compute compat array; compat[i] represents the latest
    # job (rightmost in the array) that is also compatible with 
    # jobs[i] (jobs are sorted so this is basically ends)
    compat = []
    for i in range(len(jobs)):
        compat.append(bisect_right(ends_sorted, jobs_sorted[i].start) - 1)
    
    # the main DP loop
    for j in range(len(jobs)):
        # we consider two arrays, include and exclude; include has
        # all the Schedules where jobs[j] has been included and
        # exclude has all the Schedules where jobs[j] was not
        include = []
        exclude = []

        # we copy all the Schedules from dp[j - 1] as our "exclude"
        if j > 0:
            exclude.extend(dp[j - 1])

        #
        if compat[j] != -1:
            for sched in dp[compat[j]]:
                include.append(sched.extend(jobs[j]))
        
        merged = include + exclude
        merged.sort(key=lambda n : n.total_profit, reverse=True)

        result = []

        k = 0
        l = 0
        while (k < top_count) and (l < len(merged)):
            if merged[l] not in result:
                result.append(merged[l])
                k += 1
            l += 1
        
        dp[j] = result
        
    return dp[-1]



dynamic_scheduler(
    JobCollection([
        Job(1, 2, 4),
        Job(1, 3, 3),
        Job(4, 7, 7)
    ])
)

print("")