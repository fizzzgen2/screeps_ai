let Tasks = require('creep-tasks');
let rolePick = require('role.pick');
let towers = require('tower');

let roleBoxFiller = {

    // Harvesters harvest from sources, preferring unattended ones and deposit to Spawn1
    // This module demonstrates the RoomObject.targetedBy functionality

    newTask: function (creep, room) {
        if (creep.carry.energy < creep.carryCapacity) {
            var creeps = _.values(Game.creeps);
            
            var sources = room.find(FIND_SOURCES);
            var dropenergys = creep.room.find(FIND_DROPPED_RESOURCES, {
                 filter: (d) => {return (d.resourceType == RESOURCE_ENERGY)}
            });

            while(sources.length > 3){sources.pop();}
            
            var target = Math.floor(Math.random()*sources.length);
            if (creep.memory.target_added == 1){
                target = creep.memory.target;
            }else{
                var creeps = _.values(Game.creeps);
                var miner_creeps = _.filter(creeps, creep => creep.name.includes("DELIVER"));
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
                creep.memory.target_added = 1;
            }
            var index = target;
            console.log(sources + '   ' + dropenergys);
            target = sources[target];
            var target_dropenergy = 0;
            for(var d of dropenergys){
                if(d.room.name == target.room.name && Math.abs(d.pos.x-target.pos.x) + Math.abs(d.pos.y-target.pos.y) < 4){
                    target_dropenergy = d;
                }else{
                    console.log(target.pos.x + ' ' + target.pos.y + '|' + d.pos.x + ' ' + d.pos.y + ' == '+ (Math.abs(d.pos.x-target.pos.x) + Math.abs(d.pos.y-target.pos.y)));
                }
            }
            if (target_dropenergy) {
                if (index == 2){
                console.log('!!!!!!!!!!!!!!!!!' + target.room.name);}
                if(target_dropenergy.room.name != creep.room.name){
                        creep.moveTo(target_dropenergy);}
                else if (creep.pickup(target_dropenergy) == ERR_NOT_IN_RANGE) {
                    
                    if(target_dropenergy.room.name != creep.room.name){
                        creep.moveTo(34, 0);
                        
                    }else{
                    creep.moveTo(target_dropenergy);}
                }
            }
        } else {
            var structures = room.find(FIND_STRUCTURES, {
                filter: (s) => (s.structureType == STRUCTURE_CONTAINER && s.store[RESOURCE_ENERGY] < 2000 - creep.carry.energy)
            });
            var storages = room.find(FIND_STRUCTURES, {
                filter: (s) => (s.structureType == STRUCTURE_STORAGE)
            });
            if (storages.length){
                structures = storages;
            }
            var defense = towers.need_fill(creep.room);
            creep.say('🚚');
            if (defense.length){
                structures = defense;
            }
            if (structures.length){
                creep.task = Tasks.transfer(structures[0]);
            }
        }
    }

};

module.exports = roleBoxFiller;
