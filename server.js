var express = require("express");
var app = express();

var mongoose = require("mongoose");

var port = process.env.PORT || 8080;
var apiCont = require("./controllers/apiController");

//mongoose.connect("#");

app.use("/public",express.static(__dirname+"/public"));

app.get('/',(req,res)=>{
  res.sendFile(__dirname+"/public/html/index.html");
});

apiCont(app);

app.listen(port,()=>{
  console.log("App running on port: "+port);
});
