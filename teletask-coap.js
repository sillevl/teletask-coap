var server      = require('coap').createServer()

var HOST = '192.168.1.5';
var PORT = 55957;

var Teletask = require('teletask-api');

var teletask = new Teletask.connect(HOST,PORT, function(){
  console.log("Teletask Ready")
});

Relais = new function(){
  this.get = function(number, callback){
    teletask.get(Teletask.functions.relay, 21, function(data){
			console.log('done with 21 ' + data)
      callback(data)
		});
  }
  this.put = function(number, argument){}
}

server.on('request', function(req, res) {
  var url = req.url.split('/')
  var resource = url[1]
  var number = url[2]
  var argument = url[3]
  console.log("Resource: " + resource + " number: " + number + " arg: " + argument)
  Relais.get(number, function(data){
    res.end('Hello ' + data + '\n')
  })


})

// the default CoAP port is 5683
server.listen(function() {
  console.log("Coap ready")
})

module.exports = server;
