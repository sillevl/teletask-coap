var coap = require('coap')
var teletask = require('../teletask-coap')

var req = coap.request('coap://localhost/relais/21')

req.on('response', function(res) {
  res.pipe(process.stdout)
  res.on('end', function() {
    process.exit(0)
  })
})

req.end()
