We will have *three* variations of the same WAS algo in this program:

> **CLASSIC WAS**
    <img src="image.png" width="60"/>
    
    time complexity: O(nlogn)
    space complexity: O(n)

    * this runs when you hit calculate on the calculator, returns the most optimal schedule using vanilla dp -- very straightforward
    * first sort jobs by descending end times, then keep dp array where dp[i] = max profit considering subset jobs[0] to jobs[i]; 
    * but vanilla is boring so we also have some additions
    * located at python/vanilla_scheduler.py

> **BEAM SEARCH WAS** 
    <img src="image-1.png" height="60"/>

    time complexity: O(nk )

    * while you are entering jobs in the jobs page, if you are entering
    over three jobs, the program will start suggesting the top 5 most
    promising schedules using beam search
    * can be suboptimal (heuristic prioritizes short term profit) but
    can give the user alternatives if theyre looking for it
    * located at python/beam_scheduler.py

> **RESTRICTED WAS**
    <img src="image-2.png" height="60"/>
    * calculator is extended to have three restrictions: maximum
    work hours, off-limits jobs, and off-limits intervals
    * because of the first restriction, the implementation now has to
    use a dp matrix, sort of fusing the vanilla implementation with
    knapsack principles, where for every cell dp[i][h], its value is the maximum possible