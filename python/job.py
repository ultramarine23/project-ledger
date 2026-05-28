from client import Client

class Job:
    def __init__(
            self, 
            start : int, 
            end : int, 
            profit : float, 
            job_id : int = 0,
            location : str = "", 
            client : str = ""
        ):
        self.job_id = job_id # change later to have auto-incrementing ids
        self.start = start
        self.end = end
        self.profit = profit
        self.location = location
        self.client = client

    def __repr__(self):
        return f"{self.profit}"
    
    def to_jsondict(self):
        return {
            "jobID" : self.job_id,
            "start" : self.start,
            "end" : self.end,
            "profit" : self.profit,
            "location" : self.location,
            "client" : self.client
        }
    
    @staticmethod
    def from_jsondict(dict):
        return Job(
            dict["start"],
            dict["end"],
            dict["profit"],
            dict["jobID"],
            dict["location"],
            dict["client"]
        )