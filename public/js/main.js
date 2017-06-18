

var Commodity = function(type,baseValue){
  this.type = type || "default";
  this.baseValue = baseValue || 1;
};

//Master Commodity List is use to establish all possible types of commodities and there base values
var MasterComList = {};

var Player = function( data ){
  this.name = data.name || "default";
  this.money = data.money || 0;
  this.truck = data.truck || { type:"pickup" , maxStorage: 10, storage: {} };
};

Player.prototype.getCount = function(){
  var out = 0;
  for( var i in this.truck.storage ){
    out +=  this.truck.storage[i];
  }
  return i;
};

var City = function(data){
  this.name = data.name || "default";
  this.storage = data.storage || {};
  this.usageRates = data.usage || {};
  this.producers = data.pro || [];
  // [ { type:"Mine", outType:"String", output:Number  }
  // { type:"Factory", outType:"String", outPut:Number, input:[{ type:String, rate:Number },...]  }, storage:[ { type:String, target:Number, amount:Number } ]   ]
  this.prices = {};
  
  this.roads = data.roads || [];
  this.state = data.state || { sat: 100, danger: 0  };
  this.population = data.pop || 25;
};

City.prototype.update = function() {

  //update Mines
  for(var i in this.producers){
    if( this.producers[i].type === "Mine" ){
      if( !this.storage[this.producers[i].outType] ) { this.storage[this.producers[i].outType] = 0; }
      this.storage[ this.producers[i].outType ] += this.producers[i].output;
    }
    //todo - Add support for factories
  }

  var target = 0;
  var sat = 0;
  //Consume commodities from storage
  for(var i in this.usageRates){
      target += this.population;
      if(this.storage[i] && this.storage[i] >= this.usageRates[i]* this.population ){ //if there is enough in storage to cover the demand

        this.storage[i] -= ( this.usageRates[i] * this.population ); //remove Commodities from storage
        sat += this.population;
      }
      else {
        if( this.storage[i] ) { //else if there are some in storage
          var per = Math.floor( this.storage[i] / this.usageRates[i] );
          this.storage[i] -= ( per * this.useageRate[i] );
          sat += per;
        }
      }
  }

  this.state.sat =  sat / target ;

  //If enough of the demand is met, increase the population
  if( this.state.sat > 0.9 ){
    if( this.state.danger > 0 ){ this.state.danger-=1; }
    if( this.population <100 ){ this.population = Math.floor( this.population * 0.2 ); }
    else if( this.population >=100 && this.population<1000 ){ this.population = Math.floor( this.population * 0.15 ); }
    else { this.population = Math.floor( this.population * 0.05 ); }
   }

   //If the demand is not met decrease population
   else if( this.state.sat < 0.3 ){
     if( this.state.danger < 10 ){ this.state.danger+=1; }
     this.population -= Math.floor( this.population * 0.1 );
   }

   this.prices = this.getPrices();

};

City.prototype.getPrices = function() {
  var out = {};
  var target = 0;
  for( var i in this.storage ){
    // Target storage levels === 30 * usageRate for each Commodity
    // Price for commodity === ( Target / Supply ) * baseRate
    target = this.useageRate[i] * this.population * 30;
    out[i] = ( target / this.storage[i] ) * MasterComList[i].baseRate;
  }
  return out;
};

City.prototype.buyCom = function( ply, type, amount ) {
  if( !this.prices[type] ){ return false; }
  if( ply.money >= this.prices[type] * amount && ply.getCount()+amount < ply.truck.maxStorage ){
    if( ply.storage[type] ){ ply.storage[type] += amount; }
    else { ply.storage[type] = amount; }
    ply.money -= this.prices[type] * amount;
    return true;
  }
  return false;
};

City.prototype.sellCom = function( ply, type, amount ) {
  if( !this.prices[type] ){ return false; }
  if( !ply.storage[type] || ply.storage[type] < amount ){ return false; }
  ply.storage[type] -= amount;
  ply.money += this.prices[type] * amount;
  return true;
};
