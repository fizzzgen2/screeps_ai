var Tasks = require('creep-tasks');
var rolePick = require('role.pick');

var roleHarvester = {

    // Harvesters harvest from sources, preferring unattended ones and deposit to Spawn1
    // This module demonstrates the RoomObject.targetedBy functionality

    newTask: function (creep) {
        if (creep.carry.energy == 0) {
            rolePick.newTask(creep);
        } else {
            var extensions = creep.room.find(FIND_MY_STRUCTURES, { filter: (s) => s.structureType == STRUCTURE_EXTENSION });
            var spawn = Game.spawns['Spawn1'];
            extensions.push(spawn);
            extensions.reverse();
            for (var s of extensions){
                if(s.energy < s.energyCapacity){
                    creep.task = Tasks.transfer(s);
                    break;
                }
            }
        }
    }

};

module.exports = roleHarvester;
