# nodejs-raid-helper
NodeJS Raid Helper Stats

## Usage
### Import data
Begin by importing data from some events.
```
node.exe app.js import -c 936361682324815883,936361851233636352,938564883136532480,938565072979120148,938716702840090686
```
The `-c` flag tells the system to clear the database before importing new data.
At the following, put all event ids. You can get ids of events by browsing  your Discord events :

![IDs examples](https://github.com/doubotis/nodejs-raid-helper/blob/main/images/eventids.png?raw=true)

### Get stats from database
Query to get stats of players in events imported.
```
node.exe app.js stats
```
You'll get the list of players and the % of attendances.

![IDs examples](https://github.com/doubotis/nodejs-raid-helper/blob/main/images/dashboard-signups.png?raw=true)
