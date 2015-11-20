var coap = require('coap');


exports = module.exports = createApplication;

function createApplication() {

  var app = function(req, res, next) {
    app.handle(req, res, next);
  };

  var server;

  var root;

  app.listen = function(){
    server = coap.createServer();
    server.on('request', function(req, res) {
      console.log("request....");
      root(req, res);
    });
    return server;
  };

  app.get = function(path, callback){
    console.log("adding path: " + path + " to router");
    root = callback;
  };

  app.route = function(){
    return this;
  };

  app.post = function(){
    return this;
  };

  app.use = function(){
    return this;
  };

  return app;
}



// Relais = new function(){
//   this.get = function(number, callback){
//     teletask.get(Teletask.functions.relay, number, function(data){
//       callback(data)
// 		});
//   }
//   this.put = function(number, argument){}
// }

// var buildCoreFormat = function(config){
//   var coreFormat
//   for (var resource in config.resources){
//     if (config.resources.hasOwnProperty(resource)) {
//          for(var item in config.resources[resource]){
//             coreFormat += "</"+resource+"/"+config.resources[resource][item].number+">;title=\""+config.resources[resource][item].description+"\","
//          }
//     }
//   }
//   return coreFormat
// }
