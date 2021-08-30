var Tasks = require('creep-tasks');

var rolePick = {

    // Harvesters harvest from sources, preferring unattended ones and deposit to Spawn1
    // This module demonstrates the RoomObject.targetedBy functionality

    newTask: function (creep) {
        creep.say('💤');
        if (creep.name.includes("UTILITY")){
            var box = creep.pos.findClosestByPath(FIND_STRUCTURES, { filter: (s) => ((s.structureType == STRUCTURE_STORAGE || s.structureType == STRUCTURE_CONTAINER) && s.store[RESOURCE_ENERGY] >= creep.carryCapacity - creep.carry.energy)});
            if (box){
                creep.task = Tasks.withdraw(box);
                return;
            }

            

        }
        if (creep.carry.energy < creep.carryCapacity) {
            // Harvest from an empty source if there is one, else pick any source
                let sources = creep.room.find(FIND_SOURCES);
                let target = sources[Math.floor(Math.random()*sources.length)];
                creep.task = Tasks.harvest(target);
        }
    }

};

module.exports = rolePick;
