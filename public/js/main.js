


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
          city: new GameObj.City(
            {
              name:"City 1",
              storage:{ "Red":100, "Green":100, "Blue":100, "White":10, "Black":10 },
              usage:{ "Red":1, "Green":1, "Blue":1, "White":0.5, "Black":0.2 },
              pro: [ { type:"Mine", outType:"Red", output: 100 }, { type:"Mine", outType:"White", output: 50 }, ],
              pop: 25
            }),
          loc: { x:10, y:10 }
        },
        {
          city: new GameObj.City({ name:"City 2", storage:{ "Red":200, "Green":50, "Blue":500, "White":100, "Black":2  }, usage:{ "Red":1, "Green":1, "Blue":1, "White":0.75, "Black":0.5 } }),
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

  for(var i = 0; i< GameObj.curData.gameMap.cities.length; i++ ){
    GameObj.curData.gameMap.cities[i].city.update();
  }
  drawGame();

};


var drawGame = function(){
  var ctx = GameObj.ctx;
  var ply1 = GameObj.curData.player;
  var city = GameObj.curData.gameMap.cities[ply1.curCity].city;

  ctx.clearRect(0,0,1000,500);
  ctx.strokeStyle = "#000";
  ctx.lineWidth = 4;
  ctx.textAlign="center";

  ctx.beginPath();
  ctx.moveTo(333,5);
  ctx.lineTo(333,495);
  ctx.stroke();

  ctx.moveTo(666,5);
  ctx.lineTo(666,495);
  ctx.stroke();

  ctx.moveTo(338,50);
  ctx.lineTo(661,50);
  ctx.stroke();

  ctx.moveTo(338,90);
  ctx.lineTo(661,90);
  ctx.stroke();

  ctx.moveTo(671, 35);
  ctx.lineTo(995, 35);
  ctx.stroke();

  ctx.moveTo(671, 155);
  ctx.lineTo(995, 155);
  ctx.stroke();

  ctx.lineWidth = 1;
  //Map Box
  ctx.rect(10,40,310,440);
  ctx.stroke();

  //Market Box
  ctx.rect(338,150,323,200);
  ctx.stroke();

  //Mine Box
  ctx.rect(338,398,150,90);
  ctx.stroke();

  //avatar Box
  ctx.rect(676,55,80,80);
  ctx.stroke();

  //veh Box
  ctx.rect(676,185,80,80);
  ctx.stroke();

  //upgrade Button
  ctx.rect(796,235,108,20);
  ctx.stroke();

  //Market Line
  ctx.moveTo(338,180);
  ctx.lineTo(661,180);
  ctx.stroke();

  //Mine Line
  ctx.moveTo(338,420);
  ctx.lineTo(488,420);
  ctx.stroke();


  ctx.font="20px Georgia";
  ctx.fillText("Map",166,25);
  ctx.fillText("Market",500,130);
  ctx.fillText("Mines",388,385);
  ctx.fillText("Info",666+166,25);

  ctx.font="14px Georgia";
  ctx.fillText("Population: "+city.population,393,75);
  ctx.fillText("Status:",550,75);

  ctx.fillText("Type",338+50,170);
  ctx.fillText("Demand",338+120,170);
  ctx.fillText("Supply",338+200,170);
  ctx.fillText("Price",338+270,170);

  ctx.fillText("Type",318+50,415);
  ctx.fillText("Output",318+120,415);

  ctx.fillText(ply1.name,850,75);
  ctx.fillText("Money: $"+ply1.money,850,95);
  ctx.fillText("Days left: "+GameObj.curData.daysLeft,850,115);

  ctx.fillText("Vehicle type: "+ply1.truck.type,850,205);
  ctx.fillText("Storage: "+ply1.getCount()+" / "+ply1.truck.maxStorage,850,225);
  ctx.fillText("Upgrade",850,250);

  var cnt = 0;
  for(var i in city.storage){
    ctx.fillText(i,338+50,210+(cnt*30));
    ctx.fillText( ( city.usageRates[i]*city.population ),338+120,210+(cnt*30));
    ctx.fillText(city.storage[i],338+200,210+(cnt*30));
    ctx.fillText(city.prices[i],338+270,210+(cnt*30));
    cnt++;
  }

  for( var i = 0; i < city.producers.length; i++ ){
    if(city.producers[i].type === "Mine" ){
      ctx.fillText(city.producers[i].outType,318+50,440+(i*20));
      ctx.fillText(city.producers[i].output,318+120,440+(i*20));
    }
  }

  ctx.font="26px Georgia";
  ctx.fillText(city.name,500,35);


};
