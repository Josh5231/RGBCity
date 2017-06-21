

(function(global){

  if(!global.GameObj){ global.GameObj = {}; }

  global.GameObj.Commodity = function(type,baseValue){
    this.type = type || "default";
    this.baseValue = baseValue || 1;
  };

  //Master Commodity List is use to establish all possible types of commodities and there base values
  global.GameObj.MasterComList = {
    "Red": 10,
    "Green": 10,
    "Blue": 10
  };

} (window) );
