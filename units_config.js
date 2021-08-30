/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports.thing = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('units_config');
 * mod.thing == 'a thing'; // true
 */

var spawn = Game.spawns['Spawn1'];
var room = spawn.room;
var extensions = room.find(FIND_MY_STRUCTURES, { filter: (s) => s.structureType == STRUCTURE_EXTENSION });
function bodyCost (body) {
    return body.reduce(function (cost, part) {
        return cost + BODYPART_COST[part];
    }, 0);
}
var AVAILIABLE_BODY_COST = Math.min(extensions.length * 50 + spawn.energyCapacity, 500);

    // SET UP EXTENSIONS

    var UTILITY_EXTENSIONS = [];
    var WAR_EXTENSIONS = [];
    var MINER_EXTENSIONS = [CARRY,];
    var DELIVER_EXTENSIONS = [];

    for(i=0;i<100;i++){
        if (i%3 == 0){
            UTILITY_EXTENSIONS.push(MOVE);
            WAR_EXTENSIONS.push(TOUGH);
            MINER_EXTENSIONS.push(WORK);
            DELIVER_EXTENSIONS.push(MOVE);
        }
        if (i%3 == 1){
            UTILITY_EXTENSIONS.push(WORK);
            WAR_EXTENSIONS.push(RANGED_ATTACK);
            MINER_EXTENSIONS.push(WORK);
            DELIVER_EXTENSIONS.push(CARRY);
        }
        if (i%3 == 2){
            UTILITY_EXTENSIONS.push(CARRY);
            WAR_EXTENSIONS.push(MOVE);
            MINER_EXTENSIONS.push(MOVE);
            DELIVER_EXTENSIONS.push(CARRY);
        }
        if(bodyCost(UTILITY_EXTENSIONS) || bodyCost(UTILITY_EXTENSIONS) > AVAILIABLE_BODY_COST){UTILITY_EXTENSIONS.pop();}
        if(bodyCost(WAR_EXTENSIONS) > AVAILIABLE_BODY_COST){WAR_EXTENSIONS.pop();}
        if(bodyCost(MINER_EXTENSIONS) > AVAILIABLE_BODY_COST){MINER_EXTENSIONS.pop();}
        if(bodyCost(DELIVER_EXTENSIONS) > AVAILIABLE_BODY_COST){DELIVER_EXTENSIONS.pop();}
    }
    var STATIC_UPGRADER_EXTENSIONS = MINER_EXTENSIONS;

module.exports.UTILITY_EXTENSIONS = UTILITY_EXTENSIONS;
module.exports.WAR_EXTENSIONS = WAR_EXTENSIONS;
module.exports.MINER_EXTENSIONS = MINER_EXTENSIONS;
module.exports.DELIVER_EXTENSIONS = DELIVER_EXTENSIONS;
