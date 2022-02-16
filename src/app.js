const { AceBase } = require('acebase');
let PresenceManager = require('./managers/presence-manager.js');
let RaidHelperClient = require('./client/client.js');
let Event = require('./data/event.js');
const { program } = require('commander');

// setup db.
const options = { logLevel: 'warn', storage: { path: '.' } };
let db = new AceBase('raidhelper', options);

// command line parsing.
program.name('raidhelper-stats')
    .description('CLI to get stats of raidhelper')
    .version('0.0.1');

program.command('import')
    .argument('<string>','event ids separated by comas.')
    .description('Import events into database')
    .option('-c', '--clear', 'Clear the database before import');

program.command('stats')
    .description('Display stats for all players in events in database');

program.parse();

let command = program.args[0];
if (command === 'import') {
    let arg = program.commands[0].args[0];
    let eventIds = arg.split(",");
    let mustClear = program.opts()['c'];
    importCommand(mustClear, eventIds);
}
else if (command === 'stats') {
    statsCommand();
}

function importCommand(mustClear, eventIds) {
    let presenceManager = new PresenceManager(db);
    let client = new RaidHelperClient();
    if (mustClear) {
        presenceManager.clear();
    }

    for (let eventId of eventIds) {
        let data = client.query("event/" + eventId);
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
    }
}

function statsCommand() {
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
}






