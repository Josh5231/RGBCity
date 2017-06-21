


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


var setupGame = function(){

    GameObj.canvas = document.getElementById("gameCanvas");
    GameObj.ctx = GameObj.canvas.getContext("2d");

    GameObj.curData = new GameData({

    gameMap : new GameMap({
      cities: [
        {
          city: new GameObj.City({ name:"City 1", storage:{ "Red":100, "Green":100, "Blue":100 }, usage:{ "Red":1, "Green":1, "Blue":1 } }),
          loc: { x:10, y:10 }
        },
        {
          city: new GameObj.City({ name:"City 2", storage:{ "Red":200, "Green":50, "Blue":500 }, usage:{ "Red":1, "Green":1, "Blue":1 } }),
          loc: { x:100, y:20 }
        }
      ]
    }),
    player: new GameObj.Player({ name:"Player 1", money:1000 })
  });


  //test...
  var City1 = GameObj.curData.gameMap.cities[0].city;
  var City2 = GameObj.curData.gameMap.cities[1].city;
  var Player1 = GameObj.curData.player;
};
