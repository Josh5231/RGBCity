

var Commodity = function(type,baseValue){
  this.type = type || "default";
  this.baseValue = baseValue || 1;
};

var City = function(data){
  this.name = data.name || "default";
  this.storage = data.storage || {};
  this.usageRates = data.usage || {};
  //this.mines = data.mines || [];
  this.producers = data.pro || [];
  // [ { type:"Mine", outType:"String", outPut:Number  }  || { type:"Factory", outType:"String", outPut:Number, input:[{ type:String, rate:Number },...]  }, storage:[ { type:String, target:Number, amount:Number } ]   ]

  this.roads = data.roads || [];
  this.state = data.state || { sat: 100, danger: 0  };
  this.population = data.pop || 25;
};

City.prototype.update = function() {

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
          var per = Math.floor( this.storage[i] / this.usageRates );
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



};
