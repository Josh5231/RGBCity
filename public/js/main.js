


var GameMap = function( data ){
  this.cities = data.cities || []; // [  { city:City, loc:{ x,y }  }, ... ]
  this.images = data.images || {}; //{ name:URI, ... }
};

var GameData = function( data ){
  this.gameMap = data.gameMap || new GameMap( { } );
  this.player = data.player || new Player( { } );
  this.npcs = data.npcs || []; // [ Player(), ... ]
  this.daysLeft = data.daysLeft || 364;
  this.gameState = data.gameState || "init";
};
