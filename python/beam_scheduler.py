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
    # dp[i] is a list of the top K best schedulings up to jobs[i]
    # ordered from most to least promising, basically a cooler WAS >B)
    # but also more greedy and less accurate
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
    
    top_scheds_sll = dp[-1]
    top_scheds_lists = []

    for sll in top_scheds_sll:
        top_scheds_lists.append(JobCollection(sll.to_list()))
    print("TOPSCHEDS YALL", top_scheds_lists, file=sys.stderr)

    return top_scheds_lists


def main():
    raw_input = sys.stdin.read()
    raw_jsondict = json.loads(raw_input)
    
    collection = JobCollection.from_jsondict(raw_jsondict['coll'])
    k = raw_jsondict['k']

    raw_result = beam_scheduler(
        collection, 
        k
    )

    result = [coll.to_jsondict() for coll in raw_result]

    # json.dumps() is the python equivalent to stringify, converts dict -> json
    # output the json string into the output stream, for typescript to read    
    print("DIS DA RESULT! ", result, file=sys.stderr)
    print(json.dumps(result))

if __name__ == "__main__":
    main()

# for subcoll in res:
#     num = 1
#     for elem in subcoll.jobs:
#         print(f"#{num} : {elem} = {subcoll.get_total_profit()}", file=sys.stderr)
#         num += 1
#     print("----", file=sys.stderr)