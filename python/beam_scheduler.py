from job_collection import JobCollection
from job import Job
from scheduler_node import SchedulerNode
import json

import sys
from bisect import bisect_right

BEAM_SIZE = 5

# important terms: 
#   Schedule      = an SLL of SchedulerNodes, usually represented by its
#                   tail node
#   SchedulerNode = an SLL node representing

def beam_scheduler(base_coll : JobCollection, k : int) -> list[JobCollection]:
    # dp[i] represents the top K best schedulings
    # up to the event with index i, basically a cooler WAS >B)
    jobs = base_coll.jobs
    dp : list[SchedulerNode] = [None] * len(jobs)

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

        # we copy all the Schedules from the previous dp entry
        # -- "the best" as our "exclude"
        if j > 0:
            exclude.extend(dp[j - 1])

        # if the current job is compatible with ANY other job,
        # we go to the rightmost compartible job, take the SLLs
        # from there, append jobs[j] as their new tails, and add
        # them to include
        if compat[j] != -1:
            for sched_node in dp[compat[j]]:
                include.append(sched_node.append_tail(jobs[j]))
        # otherwise if current job is incompatible with any job,
        # include will only contain jobs[j] itself
        include.append(SchedulerNode(jobs[j]))

        merged = include + exclude
        merged.sort(key=lambda n : n.total_profit, reverse=True)

        k_adjusted = min(k, len(merged))
        
        dp[j] = merged[0:k_adjusted]
    
    return dp


def main():
    raw_input = sys.stdin.read()
    raw_jsondict = json.loads(raw_input)
    
    collection = JobCollection.from_jsondict(raw_jsondict['coll'])
    k = raw_jsondict['k']

    result = beam_scheduler(
        collection, 
        k
    ).to_jsondict()

    # json.dumps() is the python equivalent to stringify, converts dict -> json
    # output the json string into the output stream, for typescript to read    
    print(json.dumps(result))

if __name__ == "__main__":
    main()


# res = beam_scheduler(
#     JobCollection([
#         Job(1, 2, 5),
#         Job(3, 4, 10),
#         Job(5, 6, 20),
#         Job(7, 8, 15),
#         Job(9, 10, 12),
#     ]), 100
# )

# for subarr in res:
#     num = 1
#     for elem in subarr:
#         print(f"#{num} : {elem} = {elem.total_profit}")
#         num += 1
#     print()