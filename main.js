// Example Screeps bot built using creep-tasks

var roleHarvester = require('role.harvester');
var roleBuilder = require('role.builder');
var roleUpgrader = require('role.upgrader');
var roleStaticUpgrader = require('role.static_upgrader');
var rolePatroller = require('role.patroller');
var roleMiner = require('role.miner');
var roleBoxFiller = require('role.box_filler');
var unitsConfig = require('units_config');
var towers = require('tower');
var structuresUpdater = require('structures_updater');
var Tasks = require('creep-tasks');

function uuid() {
  return 'xxxx:xxxx:xxxx'.replace(/[xy]/g, function(c) {
    var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

function bodyCost (body) {
    return body.reduce(function (cost, part) {
        return cost + BODYPART_COST[part];
    }, 0);
}

module.exports.loop = function () {
    Memory.gold_income = 0.0;
    if(! Memory.gold){
        Memory.gold = 1;
    }

    var totalBodyCost = 1;
    var spawn = Game.spawns['Spawn1'];
    var room = spawn.room;


    var boxes = room.find(FIND_STRUCTURES, {
                          filter: (s) => (s.structureType == STRUCTURE_CONTAINER)
            });
    var extensions = room.find(FIND_MY_STRUCTURES, { filter: (s) => s.structureType == STRUCTURE_EXTENSION });
    var creeps = _.values(Game.creeps);
    for (var c of creeps){
        for (var b in c.body){
            totalBodyCost = totalBodyCost + 75;
        }
    }
    var sources = room.find(FIND_SOURCES);
    var utility_creeps = _.filter(creeps, creep => creep.name.includes("UTILITY"));
    var miner_creeps = _.filter(creeps, creep => creep.name.includes("MINER"));
    var static_upgrader_creeps = _.filter(creeps, creep => creep.name.includes("STATIC_UPGRADER"));
    var war_creeps = _.filter(creeps, creep => creep.name.includes("WAR"));
    var deliver_creeps = _.filter(creeps, creep => creep.name.includes("DELIVER"));
    var need_harvest = 0;

    var UTILITY_UNITS = 3;
    if(UTILITY_UNITS < 3){UTILITY_UNITS = 3};
    var WAR_UNITS = 1;
    var MINER_UNITS = sources.length;
    var DELIVER_UNITS = sources.length;
    if (boxes.length == 0){
        MINER_UNITS = 0;
        DELIVER_UNITS = 0;
    }

    // SET UP EXTENSIONS
    var UTILITY_EXTENSIONS = unitsConfig.UTILITY_EXTENSIONS;
    var WAR_EXTENSIONS = unitsConfig.WAR_EXTENSIONS;
    var MINER_EXTENSIONS = unitsConfig.MINER_EXTENSIONS;
    var DELIVER_EXTENSIONS = unitsConfig.DELIVER_EXTENSIONS;
    var STATIC_UPGRADER_EXTENSIONS = unitsConfig.STATIC_UPGRADER_EXTENSIONS;
    

//         FILL SPAWNS IF NOT FULL
    var _extensions = room.find(FIND_MY_STRUCTURES, { filter: (s) => s.structureType == STRUCTURE_EXTENSION });
    var _spawn = Game.spawns['Spawn1'];
    _extensions.push(_spawn);
    _extensions.reverse();
    for (var s of _extensions){
        if(s.energy < s.energyCapacity){
            need_harvest = 1;
        }
    }
//          #######################



    structuresUpdater.update(room, spawn);


    if (utility_creeps.length < UTILITY_UNITS && miner_creeps.length ==  MINER_UNITS || utility_creeps.length < 4) {
        spawn.spawnCreep([WORK, CARRY, MOVE], "UTILITY::" + uuid());
    }else
    if (miner_creeps.length < MINER_UNITS) {
        spawn.spawnCreep(MINER_EXTENSIONS, "MINER::" + uuid());
    }else
    if (deliver_creeps.length < DELIVER_UNITS) {
        spawn.spawnCreep(DELIVER_EXTENSIONS, "DELIVER::" + uuid());
    }else
    if (war_creeps.length < WAR_UNITS) {
        spawn.spawnCreep(WAR_EXTENSIONS, "WAR::" + uuid());
    }else if(static_upgrader_creeps.length < 1){
        spawn.spawnCreep(MINER_EXTENSIONS, "STATIC_UPGRADER::" + uuid());
    }

    // Handle all roles, assigning each creep a new task if they are currently idle
    for (var harvester of utility_creeps) {
        if (harvester.isIdle) {
            if(boxes.length && deliver_creeps.length == DELIVER_UNITS && miner_creeps.length == MINER_UNITS){ // elements need to be set up before miner-delivery-box-utility system
            harvester.memory.only_base=1;}else{harvester.memory.only_base=0;} // else utility units are all-role units
            if (need_harvest>0){
                roleHarvester.newTask(harvester);
                continue;
            }else{
            var rand = Math.random();
            if (rand<0.4){
                roleUpgrader.newTask(harvester);
               }
            if (rand>0.4){
               roleBuilder.newTask(harvester);
            }}
        }
    }
    var sources_len = room.find(FIND_SOURCES).length;
    for (var harvester of miner_creeps) {
        if (harvester.isIdle) {
            harvester.memory.only_base=0;
            roleMiner.newTask(harvester, sources);
        }
    }
    for (var harvester of static_upgrader_creeps) {
            roleStaticUpgrader.newTask(harvester);
    }
    for (var harvester of deliver_creeps) {
        if (harvester.isIdle) {
            roleBoxFiller.newTask(harvester, room);
        }
    }
    
    var all_war_creeps_idle = true;
    for (var creep of war_creeps){
        if (! creep.isIdle){
            all_war_creeps_idle = false;
        }
    }
    if (all_war_creeps_idle){
        
        var flags = _.values(Game.flags);
        var target = flags[Math.floor(Math.random()*flags.length)];
        for (var creep of war_creeps){
            rolePatroller.newTask(creep, target);
        }
    }


    for (var creep of creeps) {
        creep.run();
    }
    towers.tick();
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    var tick_ms=0;
    if (! Memory.latest_tick_time_ms){
        Memory.latest_tick_time_ms = Date.now();
    }else{
        tick_ms =  -(Memory.latest_tick_time_ms - Date.now());
        Memory.latest_tick_time_ms = Date.now();
    }
    Memory.gold = (Memory.gold * 100 +  Memory.gold_income)/101;
    var statsConsole = require("statsConsole");
    // sample data format ["Name for Stat", variableForStat]
    let myStats = [
    ['Tick MilliSeconds', tick_ms],
    ["Creeps count", creeps.length],
    ["Energy per tick", Memory.gold],
	["Creeps per tick cost", totalBodyCost/1500]
    ];

statsConsole.run(myStats); // Run Stats collection

	statsConsole.log("Tick: " + Game.time);

if ((Game.time % 10) === 0) {
	console.log(statsConsole.displayHistogram());
	console.log(statsConsole.displayStats());
	console.log(statsConsole.displayLogs());
}

};
