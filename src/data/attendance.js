class Attendance {
    constructor(registerType, classType, roleType, name, timestamp) {
        this.register = registerType;
        this.class = classType;
        this.role = roleType;
        this.timestamp = timestamp;
        this.name = name;
    }

    static create(snap) {
        let obj = snap.val();
        let attendance = new Attendance(obj.register, obj.class, obj.role, obj.name, obj.timestamp);
        return attendance;
    }

    static bind(db) {
        db.types.bind("events/*/attendances", Attendance);
    }
}

Attendance.Role = {
    Tank: "Tank",
    Healers: "Healers",
    Ranged: "Ranged",
    Melee: "Melee"
};

Attendance.Class = {
    Druid: "Druid",
    Monk: "Monk"
}

Attendance.Register = {
    Ready: "Ready",
    Tentative: "Tentative",
    Absent: "Absent",
    Late: "Late"
}

Attendance.fromData = function(json) {
    let name = json['name'];
    let registerType = json['role'];
    if (Attendance.Register.hasOwnProperty(registerType) === false) {
        registerType = Attendance.Register.Ready;
    }
    let classType = json['spec'];
    let roleType = json['class'];
    if (Attendance.Register.hasOwnProperty(roleType) === true) {
        registerType = roleType;
        roleType = null;
    }
    let timestamp = new Date(json['timestamp']);

    let attendance = new Attendance(registerType, classType, roleType, name, timestamp);
    return attendance;
}

module.exports = Attendance;