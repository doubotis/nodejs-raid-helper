let deasync = require("deasync");
let Attendance = require('../data/attendance.js');

class PresenceManager {
    constructor(db) {
        this.db = db;
    }

    // public methods
    /** Returns the stats extraced from all the events in database, for specified player name. */
    getStatsForPlayer(username) {
        let self = this;
        let fn = deasync(function(username, cb) {
            self._asyncStatsForUser(username).then(result => {
                cb(null, result);
            });
        });
        return fn(username);
    }

    /** Clears the content of database. */
    clear() {
        let self = this;
        let fn = deasync(function(cb) {
            self._clear().then(result => {
                cb(null, null);
            })
        });
        return fn();
    }

    /** Import an event into the database. Players must be stored with the specific method. */
    importEvent(event) {
        let self = this;
        let fn = deasync(function(cb) {
            self._importEvent(event).then(result => {
                cb(null, null);
            })
        });
        return fn();
    }

    /** Import players into the database. If some players are already present, no errors are thrown. */
    importPlayers(players) {
        let self = this;
        let fn = deasync(function(cb) {
           self._importPlayers(players).then(result => {
               cb(null, null);
           })
        });
        return fn();
    }

    /** Returns the list of players stored in database. */
    getPlayers() {
        let self = this;
        let fn = deasync(function(cb) {
            self._asyncPlayers().then(result => {
                cb(null, result.val());
            });
        });
        return fn();
    }

    // private methods
    async _clear() {
        await this.db.ref('players')
            .remove();
        await this.db.ref('events')
            .remove();
    }

    async _importEvent(event) {
        await this.db.ref('events/' + event.id)
            .update(event)
            .then(ref => {
                console.log(event.id + " stored/updated");
            });
    }

    async _importPlayers(players) {
        await this.db.ref('players')
            .update(players)
            .then(ref => {
                console.log(players.length + " players stored/updated");
            });
    }

    async _asyncStatsForUser(username) {
        let eventIds = [];
        await this.db.ref('events').forEach(eventSnapshot => {
            const event = eventSnapshot.val();
            eventIds.push(event.id);
        });

        let countOfAttendances = 0;
        let countOfSignups = 0;
        for (let i=0; i < eventIds.length; i++) {
            countOfAttendances += await this._asyncAttendancesForEvent(eventIds[i], username);
            countOfSignups += await this._asyncSignupsForEvent(eventIds[i], username);
        }
        return {
            signups: countOfSignups,
            attendances: countOfAttendances,
            events: eventIds.length
        };
    }

    async _asyncPlayers() {
        return await this.db.ref('players')
            .get();
    }

    async _asyncAttendancesForEvent(eventId, username) {
        return await this.db.query('events/' + eventId + '/attendances')
            .filter('name','==',username)
            .filter('register','==', Attendance.Register.Ready)
            .take(5000)
            .count();
    }

    async _asyncSignupsForEvent(eventId, username) {
        return await this.db.query('events/' + eventId + '/attendances')
            .filter('name','==',username)
            .take(5000)
            .count();
    }
}

module.exports = PresenceManager;