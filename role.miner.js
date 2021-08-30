let Tasks = require('creep-tasks');

let roleMiner = {

    // Harvesters harvest from sources, preferring unattended ones and deposit to Spawn1
    // This module demonstrates the RoomObject.targetedBy functionality

    newTask: function (creep, sources) {

        if (creep.carry.energy < creep.carryCapacity) {
            // Harvest from an empty source if there is one, else pick any source
            var target = Math.floor(Math.random()*sources.length);
            if (creep.memory.target_added){
                target = creep.memory.target;
                creep.say('⛏ ' + target);
            }else{
                var creeps = _.values(Game.creeps);
                var miner_creeps = _.filter(creeps, creep => creep.name.includes("MINER"));
                for(var i=0;i<sources.length; ++i){
                    var already_mining = false;
                    for(var miner of miner_creeps){
                        if (miner.memory.target_added && miner.memory.target == i){already_mining = true;}
                    }
                    if (!already_mining){
                        target = i;
                        break;
                    }
                }
                creep.memory.target = target;
                creep.say('⛏ ' + target);
                creep.memory.target_added = 1;
            }
                creep.task = Tasks.harvest(sources[target]);
        } else {
            creep.drop(RESOURCE_ENERGY);
            creep.memory.working = 1;
        }

    }

};


module.exports = roleMiner;
