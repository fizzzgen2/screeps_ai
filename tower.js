var towers = {

    /** @param {Game} game **/
    tick: function() {
        var towers = Game.spawns.Spawn1.room.find(FIND_MY_STRUCTURES, {
                    filter: { structureType: STRUCTURE_TOWER }
                })
        _.forEach(towers, function(tower){
            var closestHostile = tower.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
            if(closestHostile) {
                tower.attack(closestHostile);
                return;
            }
            var closestHeal = tower.pos.findClosestByRange( FIND_MY_CREEPS, { filter: (creep) => {return ( creep.hits < creep.hitsMax ); } } );
            console.log(closestHeal);
            if(closestHeal) {
                console.log('HEALING '+closestHeal);
                tower.heal(closestHeal);
                return;
            }

            var to_repair = tower.room.find(FIND_STRUCTURES, {
                filter: object => (object.hits < object.hitsMax * 0.9 && ! (object.structureType == STRUCTURE_WALL || object.structureType == STRUCTURE_RAMPART))
            });
            to_repair.sort((a,b) => a.hits/a.hitsMax - b.hits/b.hitsMax);

            if (to_repair.length == 0){
                //to_repair = tower.room.find(FIND_STRUCTURES, {
                    filter: (structure) => ((structure.hits < structure.hitsMax * 0.9 && (structure.structureType == STRUCTURE_WALL || structure.structureType == STRUCTURE_RAMPART)))
                //});
                //to_repair.sort((a,b) => a.hits/a.hitsMax - b.hits/b.hitsMax);
            }
            if(to_repair.length) {
                tower.repair(to_repair[0]);
                return;
            }
        })
	},
	need_fill: function(room) {
	    var _towers =  room.find(FIND_STRUCTURES, {
                filter: (s) => (s.structureType == STRUCTURE_TOWER && s.store[RESOURCE_ENERGY] / s.store.getCapacity(RESOURCE_ENERGY) <= 0.75)
        });
        return _towers;
	}
};
module.exports = towers;
