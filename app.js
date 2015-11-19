var coapi = require('./teletask-coap'),
    Teletask  = require('node-teletask'),
    config    = require('./teletask.json')

var app = coapi();
var teletask = new Teletask.connect(config.host,config.port);

app.get('/', function (req, res) {
  res.end('Hello World!');
});

// set the default content format responses
app.use(function(req, res){
  res.setOption("Content-Format", "application/json");
})

// enable CoAP service discovery using /.well-know uri
app.get("/.well-known/core", function(req, res){
  res.setOption("Content-Format", "application/link-format");
  res.end(buildCoreFormat(config))
})

// manage relay resources
app.route("/relay/:number")
  .get(function(req, res){
    teletask.get(Teletask.functions.relay, number, function(data){
      res.end(JSON.stringify(data.value))
		});
  })
  .post(function(req, res){

  })

var server = app.listen();
