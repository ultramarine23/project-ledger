from job import Job

class SchedulerNode:
    def __init__(self, job : Job, prev : SchedulerNode | None = None):
        self.job = job
        self.prev = prev

        if prev != None:
            self.total_profit = prev.total_profit + job.profit
        else:
            self.total_profit = job.profit
    
    def __repr__(self):
        jobs_reprs = [repr(node.job) for node in self.to_list()]
        return " -> ".join(jobs_reprs)

    # basically creates a new tail (the current node becomes the 
    # one next to the tail) 
    def append_tail(self, job : Job) -> SchedulerNode:
        node = SchedulerNode(job, self)
        return node
    
    def to_list(self) -> list[SchedulerNode]:
        node = self
        out = []

        while node != None:
            out.append(node)
            node = node.prev
        
        return out[::-1]
    
