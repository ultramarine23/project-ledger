We will have *three* variations of the same WAS algo in this program:

> **CLASSIC WAS**
    <img src="image.png" width="60"/>
    * this runs when you hit calculate on the calculator, returns the most optimal schedule using vanilla dp -- very straightforward
    * but vanilla is boring so we also have some additions
    * located at python/scheduler.py

> **BEAM SEARCH WAS** 
    <img src="image-1.png" height="60"/>
    * while you are entering jobs in the jobs page, if you are entering
    over three jobs, the program will start suggesting the top 5 most
    promising schedules using beam search
    * can be suboptimal (heuristic prioritizes short term profit) but
    can give the user alternatives if theyre looking for it
    * located at python/beam_scheduler.py

> **RESTRICTED WAS**
    <img src="image-2.png" height="60"/>
    * calculator has an option to set 