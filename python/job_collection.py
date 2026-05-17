from job import Job
import sys
from datetime import datetime

class JobCollection:
    def __init__(self, jobs : list[Job] = [], generation_time : datetime = ""):
        self.jobs = jobs
        self.generation_time = generation_time
    
    def add_job(self, job : Job):
        self.jobs.append(job)
    
    def remove_job(self, job : Job):
        self.jobs.remove(job)

    def get_total_profit(self):
        total_profit = 0

        for job in self.jobs:
            total_profit += job.profit
        
        return total_profit


    def to_jsondict(self):
        return {
            "generationTime" : self.generation_time.isoformat().replace("+00:00", "+Z"),
            "jobs" : [j.to_dict() for j in self.jobs]
        }

    @staticmethod
    def from_jsondict(json_dict : dict):
        _jobs = [Job.from_jsondict(j) for j in json_dict["jobs"]]
        _time_gen = datetime.fromisoformat(json_dict["generationTime"].replace("+Z", "+00:00"))
        
        return JobCollection(
            _jobs,
            _time_gen
        )

