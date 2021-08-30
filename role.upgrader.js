let Tasks = require('creep-tasks');
let rolePick = require('role.pick');

let roleUpgrader = {

    // Upgraders will harvest to get energy, then upgrade the controller

    newTask: function(creep) {
        if (creep.carry.energy < creep.carryCapacity) {
            rolePick.newTask(creep);
        } else {
            var creeps = _.values(Game.creeps);
            creep.say('😈');
            var static_upgrader_creeps = _.filter(creeps, creep => creep.name.includes("STATIC_UPGRADER"));
            if (static_upgrader_creeps.length){
                creep.task = Tasks.transfer(static_upgrader_creeps[0]);
                return;
            }
            creep.task = Tasks.upgrade(creep.room.controller);
        }
    }

};

module.exports = roleUpgrader;
