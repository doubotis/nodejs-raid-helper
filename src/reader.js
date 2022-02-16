const { AceBase } = require('acebase');
let PresenceManager = require('./managers/presence-manager.js');
let RaidHelperClient = require('./client/client.js');
let Event = require('./data/event.js');
let Attendance = require('./data/attendance.js');

// setup db.
const options = { logLevel: 'warn', storage: { path: '.' } }; // optional settings
let db = new AceBase('raidhelper', options); // nodejs

Event.bind(db);
Attendance.bind(db);

let presenceManager = new PresenceManager(db);

let players = presenceManager.getPlayers();
console.log("Players for all events: ", players);

let tableData = [];
for (let player of players) {
    let data = presenceManager.getStatsForPlayer(player);

    tableData.push({
        player: player,
        signups: (data.signups/data.events)*100 + "%",
        attendances: (data.attendances/data.events)*100 + "%"
    });
}
console.table(tableData);


