
var bodyParser = require("body-parser");

var gameData = require("../models/gameData.js");

module.exports = function(app) {

  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended:true }));

  app.get("/api/",(req,res)=>{

  });

};
