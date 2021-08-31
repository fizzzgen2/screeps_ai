let Tasks = require('creep-tasks');
let rolePick = require('role.pick');

let roleStaticUpgrader = {

    // Upgraders will harvest to get energy, then upgrade the controller

    newTask: function(creep) {
        if (creep.carry.energy == 0) {
            creep.say('no energy');
            creep.moveTo(creep.room.controller);
        } else {
            creep.say('😈');
            creep.task = Tasks.upgrade(creep.room.controller);
        }
    }

};

module.exports = roleStaticUpgrader;
