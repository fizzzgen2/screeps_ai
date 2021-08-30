let Tasks = require('creep-tasks');

let rolePatroller = {

    // Patroller will patrol in a cycle from Spawn1 to all placed flags.
    // This role demonstrates using parents, via Task.chain(), with creep-tasks.

    newTask: function (creep, flag) {
        var closestHostile = creep.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
        if(closestHostile) {
                creep.moveTo(closestHostile);
                creep.attack(closestHostile);
        }else{
            creep.moveTo(flag);
        }
        
    }

};

module.exports = rolePatroller;
