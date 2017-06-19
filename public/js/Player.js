
( function(global){

if(!global.GameObj){ global.GameObj = {}; }

global.GameObj.Player = function( data ){
  this.name = data.name || "default";
  this.money = data.money || 0;
  this.truck = data.truck || { type:"pickup" , maxStorage: 10, storage: {} };
};

global.GameObj.Player.prototype.getCount = function(){
  var out = 0;
  for( var i in this.truck.storage ){
    out +=  this.truck.storage[i];
  }
  return i;
};

}(window) );
