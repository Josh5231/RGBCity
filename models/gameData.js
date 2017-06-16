var mongoose = require("mongoose");

/*
  {
   cities : [{
      name: String,
      paths: [ { cityName:String, distance: number } ],
      pop: number,
      popState: String,
      mines: { type:String, rate:Number, storage:Number },
      factories: { type:String, rate:Number, input:[ { type:String, min: Number, max: Number, cur:Number } ]  },
   }],

   player: {
    name: String,
    money: Number,
    storage: { maxCap:Number, amounts:[ { type:String, amount:Number, paid: Number } ] },
    health: Number
   },

   days: Number,

  }
*/

var Schema = mongoose.Schema;

var gameDataSchema = new Schema({
  cities: Array,
  player: Object,
  days: Number
});

var gameData = mongoose.model("gameData",gameDataSchema);

module.exports = gameData;
