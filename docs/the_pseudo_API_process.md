Below is an example of how the pseudo-API (TM) process works under
the hood -- this is the entire process of the communication between
typescript and python via helper classes

note: when actually executing an API call, just use one of the static
methods inside the API classes in src/backend/, which basically does
all of this for you (much cleaner code), just dont forget to prefix
with await (API calls are async!)

Sample flow of app.ts needing 

TS JobCollection class
    ->
toObject()
    ->
JSON.stringify()
    ->
spawned Python process
    ->
json.loads()
    ->
JobCollection.from_dict()
    ->
Python objects
    ->
algorithm
    ->
to_dict()
    ->
json.dumps()
    ->
stdout
    ->
JSON.parse()
    ->
JobCollection.fromObject()
    ->
TS objects restored
