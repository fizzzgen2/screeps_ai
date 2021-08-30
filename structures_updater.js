/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports.thing = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('structures_updater');
 * mod.thing == 'a thing'; // true
 */

 
 
var _update = function(room, spawn){
    var boxes = room.find(FIND_STRUCTURES, {
                          filter: (s) => (s.structureType == STRUCTURE_CONTAINER)
            });
    var extensions = room.find(FIND_MY_STRUCTURES, { filter: (s) => s.structureType == STRUCTURE_EXTENSION });
    var BOXES_UNITS = CONTROLLER_STRUCTURES[STRUCTURE_CONTAINER][room.controller.level];;
    var EXTENSIONS_UNITS = CONTROLLER_STRUCTURES[STRUCTURE_EXTENSION][room.controller.level];
    var TOWER_UNITS = CONTROLLER_STRUCTURES[STRUCTURE_TOWER][room.controller.level];
    var constructionSites = room.find(FIND_CONSTRUCTION_SITES);
    var full_terrain = [];
    var WALL_RANGE = 16;
    var spawn_xy = [spawn.pos.x, spawn.pos.y];
    var LEFTX = Math.max(0, (spawn.pos.x - WALL_RANGE - 1));
    var LEFTY = Math.max(0, (spawn.pos.y - WALL_RANGE - 1));
    var RIGHTX = Math.min(50, (spawn.pos.x + WALL_RANGE + 1));
    var RIGHTY = Math.min(50, (spawn.pos.y + WALL_RANGE + 1));

    if (Math.random() < 0.03 && constructionSites.length == 0){
                    const terrain = Game.map.getRoomTerrain(room.name);
                    for(var i=LEFTX;i<RIGHTX;i++){
                           var terrain_line = [];
                           for(var j=LEFTY;j<RIGHTY;++j){
                               terrain_line.push(terrain.get(i,j));
                           }
                           full_terrain.push(terrain_line);
                           // terrain is 0 if empty
                        }
                    var structs = room.find(FIND_STRUCTURES, {filter: (s) => (
                            s.structureType != STRUCTURE_ROAD && !(s.structureType == STRUCTURE_WALL) && !(s.structureType == STRUCTURE_RAMPART) && s.pos.x >= LEFTX && s.pos.y >= LEFTY && s.pos.x < RIGHTX && s.pos.y < RIGHTY
                    )});
                    var main_poses = [];
                    for(var struct of structs){
                        main_poses.push(struct.pos);
                        for(var i=-1;i<=1;++i){
                            for(var j=-1;j<=1;++j){
                                if (j==0 || i==0){
                                    full_terrain[struct.pos.x + i - LEFTX][struct.pos.y + j - LEFTY] = 55;  //structure is 55
                                }
                        }}
                    }
                    var roads = room.find(FIND_STRUCTURES, {
                                          filter: (s) => (s.structureType == STRUCTURE_ROAD && s.pos.x >= LEFTX && s.pos.y >= LEFTY && s.pos.x < RIGHTX && s.pos.y < RIGHTY)});
                    for(var struct of roads){
                            full_terrain[struct.pos.x - LEFTX][struct.pos.y - LEFTY] = 44;  //roads is 44
                    }
                    var walls = room.find(FIND_STRUCTURES, {
                                          filter: (s) => (s.structureType == STRUCTURE_WALL && s.pos.x >= LEFTX && s.pos.y >= LEFTY && s.pos.x < RIGHTX && s.pos.y < RIGHTY)});
                    for(var struct of walls){
                            full_terrain[struct.pos.x - LEFTX][struct.pos.y - LEFTY] = 33;  //wall is 33
                    }
                    
                    var minimal_distance = 10000000000;
                    var target_x = -1;
                    var target_y = -1;
                    for(var i=0;i<RIGHTX - LEFTX;i++){
                        var ii = i + LEFTX;
                        for(var j=0;j<RIGHTY - LEFTY;++j){
                               var jj = j + LEFTY;
                               if(
                                   (spawn_xy[0]-ii)*(spawn_xy[0]-ii) + (spawn_xy[1]-jj)*(spawn_xy[1]-jj) < minimal_distance && full_terrain[i][j] == 0
                                   && ii < 48 && ii > 1
                                   && jj < 48 && jj > 1
                                )
                                   {
                                   minimal_distance = (spawn_xy[0]-ii)*(spawn_xy[0]-ii) + (spawn_xy[1]-jj)*(spawn_xy[1]-jj);
                                   target_x = ii;
                                   target_y = jj;
                               }
                           }
                    }

                    
                    if (extensions.length < EXTENSIONS_UNITS) {
                       room.createConstructionSite(target_x, target_y , STRUCTURE_EXTENSION);

                    }else if(extensions.length > 5 && boxes.length < 1){
                       room.createConstructionSite(target_x, target_y , STRUCTURE_CONTAINER);
                    }

                
                    var sources = spawn.room.find(FIND_SOURCES)
                    for (var s of sources){
                        for (e of extensions){
                            for (b of boxes){
                                    var chemin1 = room.findPath(s.pos, b.pos, {ignoreCreeps: true});
                                    var chemin2 = room.findPath(b.pos, e.pos, {ignoreCreeps: true});
                                    var chemin3 = room.findPath(b.pos, s.pos, {ignoreCreeps: true});
                                    for (var i = 1; i < chemin1.length - 1; i++) {spawn.room.createConstructionSite(chemin1[i].x,chemin1[i].y, STRUCTURE_ROAD);}
                                    for (var i = 1; i < chemin2.length - 1; i++) {spawn.room.createConstructionSite(chemin2[i].x,chemin2[i].y, STRUCTURE_ROAD);}
                                    for (var i = 1; i < chemin3.length - 1; i++) {spawn.room.createConstructionSite(chemin3[i].x,chemin3[i].y, STRUCTURE_ROAD);}
                            }
                        }
                    }
                    
                    if (extensions.length < 16){
                        return;
                    }
                    
                    // RAMPARTS
                    minimal_distance = Math.sqrt(minimal_distance);
                    for(var i=0;i<RIGHTX - LEFTX;i++){
                        var ii = i + LEFTX;
                        for(var j=0;j<RIGHTY - LEFTY;++j){
                               var jj = j + LEFTY;
                               var dist = Math.sqrt((spawn_xy[0]-ii)*(spawn_xy[0]-ii) + (spawn_xy[1]-jj)*(spawn_xy[1]-jj));
                               if (dist >= minimal_distance && dist < minimal_distance + 1){
                                   room.createConstructionSite(ii, jj , STRUCTURE_RAMPART);
                               }
                        }
                    }
                    var all_roads = room.find(FIND_STRUCTURES, {
                                          filter: (s) => (s.structureType == STRUCTURE_ROAD)})
                    for(var r of all_roads){
                        var dist = Math.sqrt((spawn_xy[0]-r.pos.x)*(spawn_xy[0]-r.pos.x) + (spawn_xy[1]-r.pos.y)*(spawn_xy[1]-r.pos.y));
                        if (dist >= minimal_distance){
                            room.createConstructionSite(r.pos.x, r.pos.y , STRUCTURE_RAMPART);
                        }
                    }
                    
    }
    
 }

module.exports = {
    update: _update,
};
