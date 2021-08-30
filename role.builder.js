var Tasks = require('creep-tasks');
var roleUpgrader = require('role.upgrader');
var rolePick = require('role.pick');
var roleBuilder = {
 
    newTask: function(creep) {
        if (creep.carry.energy == 0){
            rolePick.newTask(creep);
            return;
        }
        console.log('working');
        const to_repair = creep.room.find(FIND_STRUCTURES, {
             filter: object => (object.hits < object.hitsMax * 0.8)
        });
        to_repair.sort((a,b) => a.hits/a.hitsMax - b.hits/b.hitsMax);
        if(to_repair.length && Math.random() < 0.5 && to_repair[0].hits < 3000){
            creep.say('🔧');
            creep.task = Tasks.repair(to_repair[0]);
        }else{
            var targets = creep.room.find(FIND_CONSTRUCTION_SITES);
            if(targets.length) {
                    creep.say('🔨');
                    creep.task = Tasks.build(targets[0]);
            } else {
                    roleUpgrader.newTask(creep);
            }
        }
        
    }
};
 
module.exports = roleBuilder;
