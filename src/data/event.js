let Attendance = require('./attendance.js');

class Event {

    constructor(id, timestamp) {
        this.id = id;
        this.attendances = [];
        this.timestamp = timestamp;
    }

    static create(snap) {
        let obj = snap.val();
        let event = new Event(obj.id, obj.timestamp);
        event.attendances = obj.attendances;
        return event;
    }

    static bind(db) {
        db.types.bind("events", Event);
    }
}

Event.fromData = function(json) {
    let date = new Date(json['unixtime']);
    let id = json['raidid'];
    let event = new Event(id, date);

    let signups = json['signups'];
    let attendances = [];
    for (let signup of signups) {
        let attendance = Attendance.fromData(signup);
        attendances.push(attendance);
    }
    event.attendances = attendances;
    return event;
}

module.exports = Event;