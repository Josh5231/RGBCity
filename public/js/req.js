
var head = document.getElementsByTagName('head')[0];

//Req.js - Loads one or more js scripts.

//Notes:
//  -Due to ansyc nature of file loading all code that needs the passed in file/s
//   should be called in the callback function or triggered by it.
//  -This is not the same as node's require. It loads the passed in files in the same
//   manner as if they were directly written into the html file.

// Sample use:
/*
index.html :
  <script src="./js/req.js" ></script>
  <script src="./js/main.js" ></script>

main.js :
  //For loading 1 file
  require("./js/somejs.js",function(){
    //all code that requires access to include js
  });
  //For loading multiple js files
  require(["./js/file1.js","./js/file2.js"...],function(){
    //main code..
  })
*/

(function(global){

  this.GroupScript = function(arr,cb){
    var cnt = arr.length;
    var loaded = 0;

    this.update = function(){
      loaded+=1;
      if(cnt<=loaded){ cb(); }
    };

    var script;
    for(var i=0;i<arr.length;i+=1){
      script = document.createElement('script');
      script.type = 'text/javascript';
      script.src = arr[i];
      script.async = false;
      script.onload = this.update;
      head.appendChild(script);
    }
  };

  global.require = function(url,cb){
    if(typeof(url) !== "string" ){
      this.GroupScript(url,cb);
      return;
     }
    var script = document.createElement('script');
    script.type = 'text/javascript';
    script.src = url;
    script.async = false;
    script.onload = cb;
    head.appendChild(script);
  };

}(window)
);
