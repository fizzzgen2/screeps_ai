let Tasks = require('creep-tasks');
let rolePick = require('role.pick');

let roleStaticUpgrader = {

    // Upgraders will harvest to get energy, then upgrade the controller

    newTask: function(creep) {
        if (creep.carry.energy == 0) {
            creep.say('no energy');
            creep.moveTo(43, 27);
        } else {
            creep.say('😈');
            if(creep.pos.x == 43 && creep.pos.y == 27){
            creep.task = Tasks.upgrade(creep.room.controller);} else{creep.moveTo(43, 27);}
        }
    }

};

module.exports = roleStaticUpgrader;
