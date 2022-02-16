const { AceBase } = require('acebase');
let RaidHelperClient = require('./client/client.js');
let PresenceManager = require('./managers/presence-manager.js');
let Event = require('./data/event.js');
const { program } = require('commander');

// setup db.
const dbOptions = { logLevel: 'warn', storage: { path: '.' } }; // optional settings
let db = new AceBase('raidhelper', dbOptions); // nodejs

// command line parsing.
program.parse();


console.log(program.args[0]);
let eventIds = program.args[0].split(",");

let client = new RaidHelperClient();
let presenceManager = new PresenceManager(db);
for (let eventId of eventIds) {
    client.query("event/" + eventId, function(data) {
        let jsonData = JSON.parse(data);

        // manage case of failed query.
        if (jsonData.status !== undefined && jsonData.status === 'failed') {
            return;
        }

        // build event.
        let event = Event.fromData(jsonData);

        // get players of events.
        let players = [];
        for (let attendance of event.attendances) {
            players.push(attendance.name);
        }

        // store events in database.
        presenceManager.importEvent(event);

        // store players in database.
        presenceManager.importPlayers(players);
    });
}
