var finalhandler = require('finalhandler')
var coap         = require('coap')
var Router       = require('router')
var Teletask     = require('node-teletask')
var config       = require('./teletask.json')
var linkFormat   = require('./lib/link-format')

var router = Router()
var teletask = new Teletask.connect(config.host,config.port);

router.get('/', function (req, res) {
  res.end('Teletask coap api');
});

// set the default content format responses
router.use(function(req, res, next){
  res.setOption("Content-Format", "application/json");
  next()
});

// enable CoAP service discovery using /.well-know uri
router.get("/.well-known/core", function(req, res){
  res.setOption("Content-Format", "application/link-format");
  res.end(linkFormat.build(config));
});

// manage relay resources
router.route("/:function/:number")
  .get(function(req, res){
    teletask.get(Teletask.functions[req.params.function], req.params.number, function(data){
      res.end(JSON.stringify(data.value));
		});
  })
  .post(function(req, res){
    // TODO give error if payload is not json and does not contain setting
    var setting = JSON.parse(req.payload.toString()).setting
    var value = Teletask.settings[setting]
    teletask.set(Teletask.functions[req.params.function], req.params.number, value);
  })
  .all(function(req, res){
    // TODO give error if function and number combination is not in config
  });

var server = coap.createServer(function(req, res) {
  router(req, res, finalhandler(req, res))
})

server.listen()
