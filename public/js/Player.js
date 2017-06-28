
( function(global){

if(!global.GameObj){ global.GameObj = {}; }

global.GameObj.Player = function( data ){
  this.name = data.name || "default";
  this.money = data.money || 0;
  this.truck = data.truck || { type:"pickup" , maxStorage: 100, storage: {} };
  this.curCity = data.curCity || 0; //City index #
};

global.GameObj.Player.prototype.getCount = function(){
  var out = 0;
  for( var i in this.truck.storage ){
    out +=  this.truck.storage[i];
  }
  return out;
};

}(window) );
