import sys
import json
import bisect
from job import Job
from job_collection import JobCollection


def maximize_profit(job_coll: JobCollection) -> JobCollection:
    # sort jobs by end time
    jobs_sorted = sorted(job_coll.jobs, key=lambda j: j.end)
    n = len(jobs_sorted)

    # extract end times for binary search
    end_times = [job.end for job in jobs_sorted]

    # dp[i] = max profit using first i jobs (1-indexed style)
    dp = [0] * (n + 1)

    # parent tracking for reconstruction
    parent = [-1] * n
    take = [False] * n

    for i in range(1, n + 1):
        job = jobs_sorted[i - 1]

        # find last job that doesn't conflict
        j = bisect.bisect_right(end_times, job.start) - 1

        include_profit = job.profit + (dp[j + 1] if j != -1 else 0)
        exclude_profit = dp[i - 1]

        if include_profit > exclude_profit:
            dp[i] = include_profit
            take[i - 1] = True
            parent[i - 1] = j
        else:
            dp[i] = exclude_profit
            take[i - 1] = False
            parent[i - 1] = -2  # mark as not taken
     
    # reconstruction
    optimal_jobs = []
    i = n - 1

    while i >= 0:
        if take[i]:
            optimal_jobs.append(jobs_sorted[i])
            i = parent[i]
        else:
            i -= 1

    optimal_jobs.reverse()

    optimal_coll = JobCollection(optimal_jobs)

    print("optimal profit:", optimal_coll.get_total_profit(), file=sys.stderr)

    return optimal_coll


def main():
    raw_input = sys.stdin.read()
    raw_jsondict = json.loads(raw_input)

    collection = JobCollection.from_jsondict(raw_jsondict)
    print(collection, file=sys.stderr)

    result = maximize_profit(collection).to_jsondict()
    print(json.dumps(result))


if __name__ == "__main__":
    main()