
var dist = function(x1,y1,x2,y2){
  var x=x1-x2;
  var y=y1-y2;
  return Math.sqrt((x*x)+(y*y));
};

var GameMap = function( data ){
  this.cities = data.cities || []; // [  { city:City, loc:{ x,y }  }, ... ]
  this.images = data.images || {}; //{ name:URI, ... }
};

var GameData = function( data ){
  this.gameMap = data.gameMap || new GameMap( { } );
  this.player = data.player || new Player( { } );
  this.npcs = data.npcs || []; // [ Player(), ... ]
  this.daysLeft = data.daysLeft || 364;
  this.gameState = data.gameState || "City";
  this.marketData = { item: -1, type: "", buyAmount: 0, sellAmount: 0 };
};

var handleClick = function(e){
  var posX = e.clientX - GameObj.canvas.offsetLeft;
  var posY = e.clientY - GameObj.canvas.offsetTop;
  var city = GameObj.curData.gameMap.cities[GameObj.curData.player.curCity].city;
  var ply = GameObj.curData.player;
  var item = GameObj.curData.marketData.type;

  //console.log(posX+" - "+posY);
  if(GameObj.curData.gameState === "City" ){

    if(posX < 333){ //If over map
      var cities = GameObj.curData.gameMap.cities;
      var roads = GameObj.curData.gameMap.cities[GameObj.curData.player.curCity].city.roads;
      var oc = -1;
      for( var i = 0; i < cities.length; i++ ){
        if( dist(posX, posY, cities[i].loc.x, cities[i].loc.y) < 25 ){ oc = i; }
      }
      if( oc === -1 ){ return; }
      for( var i = 0; i < roads.length; i++ ){
        if( roads[i].city === oc ){
          progressGame(roads[i].time);
          GameObj.curData.player.curCity = oc;
          GameObj.curData.daysLeft -= roads[i].time;
          drawGame();
          return;
        }
      }
    }
    else if( posX < 666 ){ //If over City panel
      if( posX > 340 && posX < 660 ){
        if( posY > 190 && posY < 340 ){
          GameObj.curData.marketData.item = Math.floor( ( posY - 190 ) / 30 );
          GameObj.curData.gameState = "BuySell";
          var temp = 0;
          for( var i in  GameObj.curData.gameMap.cities[GameObj.curData.player.curCity].city.storage ){
            if(temp === GameObj.curData.marketData.item){ GameObj.curData.marketData.type = i; }
            temp += 1;
          }
          drawGame();
        }
      }
    }

  }

  else if( GameObj.curData.gameState === "BuySell" ){
    //440,175  135x180
    if( posX < 440 || posX > 575 || posY < 175 || posY > 355 ){ //If not over box, return to city view
      GameObj.curData.gameState = "City";
      GameObj.curData.marketData.buyAmount = 0;
      GameObj.curData.marketData.sellAmount = 0;
      drawGame();
      return;
    }
    if( posX > 445 && posX < 440+57 ){
      //Buy - Max
      if( posY > 175+35 && posY < 175+55 ){
        //Max === max( city.storage || player.money/itemCost)
        if( city.storage[item] * city.prices[item] <= ply.money ){
          GameObj.curData.marketData.buyAmount = city.storage[item];
        }
        else {
          GameObj.curData.marketData.buyAmount = Math.floor( ply.money/city.prices[item] );
        }
      }
      //Buy - +
      else if( posY > 175+55 && posY < 175+75 ){
        if( ( GameObj.curData.marketData.buyAmount + 1 ) * city.prices[item] <= ply.money ){
          GameObj.curData.marketData.buyAmount += 1;
        }
      }

      //Buy - -
      else if( posY > 175+105 && posY < 175+125 ){
        if(GameObj.curData.marketData.buyAmount > 0){
          GameObj.curData.marketData.buyAmount -= 1;
        }
      }

      if(ply.getCount() +  GameObj.curData.marketData.buyAmount > ply.truck.maxStorage ){
          GameObj.curData.marketData.buyAmount = ply.truck.maxStorage - ply.getCount();
      }

      //Buy - buy button
      if( posY > 175+150 && posY < 175+170 ){
        city.buyCom( ply, item, GameObj.curData.marketData.buyAmount );
        GameObj.curData.gameState = "City";
        GameObj.curData.marketData.buyAmount = 0;
        GameObj.curData.marketData.sellAmount = 0;
      }
    }

    else if( posX > 440+72 && posX< 440+72+57 ){

      if(posY > 175+35 && posY < 175+55){ //Max
        GameObj.curData.marketData.sellAmount = ply.truck.storage[item];
      }

      else if( posY > 175+55 && posY < 175+75 ){ //+
          if(GameObj.curData.marketData.sellAmount < ply.truck.storage[item] ){
            GameObj.curData.marketData.sellAmount += 1;
          }
      }

      else if( posY > 175+105 && posY < 175+125 ){ //-
          if( GameObj.curData.marketData.sellAmount > 0 ){
              GameObj.curData.marketData.sellAmount -= 1;
          }
      }

      else if( posY > 175+150 && posY < 175+170 ){ // Sell Button
        city.sellCom(ply,item,GameObj.curData.marketData.sellAmount);
        GameObj.curData.gameState = "City";
        GameObj.curData.marketData.buyAmount = 0;
        GameObj.curData.marketData.sellAmount = 0;
      }
    }
    drawGame();
  }

};

var mouseMove = function(e){
  var posX = e.clientX - GameObj.canvas.offsetLeft;
  var posY = e.clientY - GameObj.canvas.offsetTop;
  var cities = GameObj.curData.gameMap.cities;
  if(GameObj.curData.gameState === "City"){
    drawGame();

    if(posX<333){
      var oc = -1;
      for( var i = 0; i < cities.length; i++ ){
        if( dist(posX, posY, cities[i].loc.x, cities[i].loc.y) < 25 ){ oc = i; }
      }
      if( oc !== GameObj.curData.player.curCity ){
        //drawCityTT( posX, posY, oc ); //Draw "ToolTip" for city
      }
    }

    else if( posX < 666 ){
      highlightMarket(posX,posY);
    }
  }

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
              storage:{ "Red":1000, "Green":1000, "Blue":1000, "White":500, "Black":500 },
              usage:{ "Red":1, "Green":1, "Blue":1, "White":0.5, "Black":0.2 },
              pro: [ { type:"Mine", outType:"Red", output: 500 } ],
              pop: 25,
              roads: [ { city:1, time: 2 }, { city:2, time: 2 } ]
            }),
          loc: { x:134, y:62 }
        },
        {
          city: new GameObj.City({
            name:"City 2",
            storage:{ "Red":1000, "Green":1000, "Blue":1000, "White":500, "Black":500   },
            usage:{ "Red":1, "Green":1, "Blue":1, "White":0.75, "Black":0.5 },
            pro: [ { type:"Mine", outType:"Green", output: 500 } ],
            pop: 40,
            roads: [ { city:0, time: 2 }, { city:2, time: 3 }, { city:3, time:4 } ]
           }),
          loc: { x:75, y:210 }
        },
        {
          city: new GameObj.City({
            name:"City 3",
            storage:{ "Red":1000, "Green":1000, "Blue":1000, "White":500, "Black":500   },
             usage:{ "Red":1, "Green":1, "Blue":1, "White":0.75, "Black":0.5 },
             pro: [ { type:"Mine", outType:"Blue", output: 500 } ],
             pop: 25,
             roads: [ { city:0, time: 2 }, { city:1, time: 3 }, { city:3, time:4 } ]
            }),
          loc: { x:298, y:170 }
        },
        {
          city: new GameObj.City({
            name:"City 4",
            storage:{ "Red":1000, "Green":1000, "Blue":1000, "White":500, "Black":500   },
            usage:{ "Red":1, "Green":1, "Blue":1, "White":0.75, "Black":0.5 },
            pro: [ { type:"Mine", outType:"White", output: 300 } ],
            pop: 50,
            roads: [ { city:1, time: 3 }, { city:2, time: 3 }, { city:4, time:3 }, { city:5, time:1 } ]
           }),
          loc: { x:243, y:322 }
        },
        {
          city: new GameObj.City({
            name:"City 5",
            storage:{ "Red":1000, "Green":1000, "Blue":1000, "White":500, "Black":500   },
            usage:{ "Red":1, "Green":1, "Blue":1, "White":0.75, "Black":0.5 },
            pro: [ { type:"Mine", outType:"Black", output: 500 } ],
            pop: 30,
            roads: [ { city:3, time: 3 }, { city:5, time: 3 } ]
           }),
          loc: { x:92, y:423 }
        },
        {
          city: new GameObj.City({
            name:"City 6",
            storage:{ "Red":1000, "Green":1000, "Blue":1000, "White":500, "Black":500   },
            usage:{ "Red":1, "Green":1, "Blue":1, "White":0.75, "Black":0.5 },
            pro: [ { type:"Mine", outType:"Red", output: 400 }, { type:"Mine", outType:"Green", output: 400 } ],
            pop: 45,
            roads: [ { city:4, time:3 }, { city:3, time:1 }]
           }),
          loc: { x:303, y:419 }
        }
      ]
    }),
    player: new GameObj.Player({ name:"Player 1", money:1000 })
  });


  //test...
  var npc = GameObj.curData.npcs;
  npc.push(new GameObj.Player({ name:"Bot1", money:1000, curCity:0, truck:{ type:"Semi", maxStorage:10000, storage:{} } }));
  npc.push(new GameObj.Player({ name:"Bot2", money:1000, curCity:1, truck:{ type:"Semi", maxStorage:10000, storage:{} } }));
  npc.push(new GameObj.Player({ name:"Bot3", money:1000, curCity:2, truck:{ type:"Semi", maxStorage:10000, storage:{} } }));
  npc.push(new GameObj.Player({ name:"Bot4", money:1000, curCity:3, truck:{ type:"Semi", maxStorage:10000, storage:{} } }));
  npc.push(new GameObj.Player({ name:"Bot5", money:1000, curCity:4, truck:{ type:"Semi", maxStorage:10000, storage:{} } }));
  npc.push(new GameObj.Player({ name:"Bot6", money:1000, curCity:5, truck:{ type:"Semi", maxStorage:10000, storage:{} } }));

  for(var i = 0; i< GameObj.curData.gameMap.cities.length; i++ ){
    GameObj.curData.gameMap.cities[i].city.update();
  }
  drawGame();

};

var updateNPCs = function(){
  var npcs = GameObj.curData.npcs;
  var curCity,storageAva, ava;

  for( var i = 0; i < npcs.length; i++ ){
    curCity = GameObj.curData.gameMap.cities[ npcs[i].curCity ].city;
    if(npcs[i].npcData.trav > 0 ){  npcs[i].npcData.trav -= 1; }

    else {
      //1. If items in storage check if needed and sell if so
      if( npcs[i].getCount() > 0 ){//if it has inventory
        for( var t in npcs[i].truck.storage ){
          //check if this city needs it
          if( curCity.storage[t] < ( curCity.usageRates[t] * curCity.population ) ){
            curCity.sellCom( npcs[i], t, npcs[i].truck.storage[t] ); //Sell all in storage
          }
        }
      }
      //2. Check city storage for coms that it has extra of and buy up as much as it can
      for( var t in curCity.storage ){ //loop through each item in storage
          ava = Math.floor( curCity.storage[t] - ( curCity.usageRates[t] * curCity.population *2 ) );
          if( ava > 0 ){ //check if there are extra
            storageAva = npcs[i].truck.maxStorage - npcs[i].getCount();
            if( ava > 0 && ava <= storageAva ){ //if we can fit them all
              if( ava * curCity.prices[t] <= npcs[i].money ){ //if it has enough money
                curCity.buyCom( npcs[i], t, ava );
              }
              else { //If we don't have enough money
                  ava = Math.floor( npcs[i].money / curCity.prices[t] );
                  //console.log(" *** ava - "+ava);
                  if( ava > storageAva ){ ava = storageAva; }
                  if( ava > 0 ){
                    curCity.buyCom( npcs[i], t, ava );
                  }
              }
            }
            else { //If we don't have enough money
                ava = Math.floor( npcs[i].money / curCity.prices[t] );
                //console.log(" *** ava - "+ava);
                if( ava > storageAva ){ ava = storageAva; }
                if( ava > 0 ){
                  curCity.buyCom( npcs[i], t, ava );
                }
            }

          }
      }
      //3. Randomly select a road to the next city and set it to "go there"
      var next = curCity.roads[ Math.floor( Math.random() * curCity.roads.length ) ];
      npcs[i].curCity = next.city;
      npcs[i].npcData.trav = next.time;
    }
  }
}

var progressGame = function(days){
  console.log("-------------------------");
  for(var i = 0; i< GameObj.curData.gameMap.cities.length; i++ ){
    GameObj.curData.gameMap.cities[i].city.update();
  }
  updateNPCs();
  if(days>1){ progressGame(days-1); }
  return;
};

var highlightMarket = function(x,y){
  var ctx = GameObj.ctx;
    if( x > 340 && x < 660 ){
      if( y > 190 && y < 340 ){
        var select = Math.floor( ( y - 190 ) / 30 );
        ctx.beginPath();
        ctx.strokeStyle = "#F00";
        ctx.rect( 340, 190 + ( select * 30 ), 320 , 30 );
        ctx.stroke();
      }
    }

};

var drawBuySell = function(x,y){
  var ctx = GameObj.ctx;
  var curCity = GameObj.curData.gameMap.cities[GameObj.curData.player.curCity].city;
  var data = GameObj.curData.marketData;

  ctx.beginPath();
  ctx.lineWidth = 1;
  ctx.strokeStyle = "#000";
  ctx.fillStyle = "#FFF";
  ctx.font="14px Georgia";

  ctx.rect( x, y, 135, 180);
  ctx.fill();
  ctx.stroke();

  ctx.fillStyle = "#000";

    //Buy section

  ctx.fillText(data.type + "  :  $"+curCity.prices[data.type], x+67, y+20 );
  ctx.fillText( "Max", x + 33, y + 52 );
  ctx.fillText( "+", x + 33, y + 72 );
  ctx.fillText( data.buyAmount, x + 33, y + 97 );
  ctx.fillText( "-", x + 33, y + 122 );

  ctx.fillText( "Buy", x + 33, y + 166 );

  ctx.rect( x+5, y+35, 57, 20 ); //Max Button
  ctx.stroke();
  ctx.rect( x+5, y+55, 57, 20 ); // + Button
  ctx.stroke();
  ctx.rect( x+5, y+75, 57, 30 ); // # box
  ctx.stroke();
  ctx.rect( x+5, y+105, 57, 20 ); // - Button
  ctx.stroke();

  ctx.rect( x + 5, y + 150, 57, 20); // Buy Button
  ctx.stroke();

  ctx.font="12px Georgia";
  ctx.fillText("$"+(curCity.prices[data.type] * data.buyAmount), x + 33, y + 140 );

  //Sell section
  ctx.font="14px Georgia";
  ctx.fillText( "Max", x + 100, y + 52 );
  ctx.fillText( "+", x + 100, y + 72 );
  ctx.fillText( data.sellAmount, x + 100, y + 97 );
  ctx.fillText( "-", x + 100, y + 122 );

  ctx.fillText( "Sell", x + 100, y + 166 );

  ctx.rect( x+72, y+35, 57, 20 ); //Max Button
  ctx.stroke();
  ctx.rect( x+72, y+55, 57, 20 ); // + Button
  ctx.stroke();
  ctx.rect( x+72, y+75, 57, 30 ); // # box
  ctx.stroke();
  ctx.rect( x+72, y+105, 57, 20 ); // - Button
  ctx.stroke();

  ctx.rect( x + 72, y + 150, 57, 20); // Buy Button
  ctx.stroke();

  ctx.font="12px Georgia";
  ctx.fillText("$"+(curCity.prices[data.type] * data.sellAmount), x + 100, y + 140 );

}

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

  //Storage Box
  ctx.rect(676,300,318,150);
  ctx.stroke();

  //upgrade Button
  ctx.rect(796,235,108,20);
  ctx.stroke();

  //Save Button
  ctx.rect(676,470,108,20);
  ctx.stroke();

  //Quit Button
  ctx.rect(886,470,108,20);
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
  ctx.fillText("Storage",666+166,295);

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

  ctx.fillText("Save",730,485);

  ctx.fillText("Quit",940,485);

  var cnt = 0;
  for(var i in city.storage){
    ctx.fillText(i,338+50,210+(cnt*30));
    ctx.fillText( Math.floor( city.usageRates[i]*city.population ),338+120,210+(cnt*30));
    ctx.fillText(Math.floor(city.storage[i]),338+200,210+(cnt*30));
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

  ctx.drawImage(document.getElementById("map1"),10,40);

  ctx.strokeStyle = "#F2F26F";
  var curLoc = GameObj.curData.gameMap.cities[ply1.curCity].loc;
  ctx.beginPath();
  ctx.arc(curLoc.x,curLoc.y,20,0,2*Math.PI);
  ctx.stroke();

  ctx.strokeStyle = "#00FF00";
  for(var i = 0; i < city.roads.length; i++ ){
    curLoc = GameObj.curData.gameMap.cities[city.roads[i].city].loc;
    ctx.beginPath();
    ctx.arc( curLoc.x, curLoc.y, 20, 0, 2*Math.PI);
    ctx.stroke();
  }

  ctx.beginPath();
  ctx.arc( 587, 70, 10, 0, 2*Math.PI );
  ctx.strokeStyle = "#000";
  if(city.state.danger< 4 ){  ctx.fillStyle = "#0F0";  }
  else if( city.state.danger < 8 ){ ctx.fillStyle = "#F2F26F"; }
  else { ctx.fillStyle = "#F00"; }
  ctx.fill();
  ctx.stroke();
  ctx.fillStyle = "#000";

  if(GameObj.curData.gameState === "BuySell" ){
    drawBuySell(440,175);
  }
};
