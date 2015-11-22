/*!
 * finalhandler
 * Copyright(c) 2014-2015 Douglas Christopher Wilson
 * MIT Licensed
 */

'use strict'

/**
 * Module dependencies.
 * @private
 */

var debug = require('debug')('finalhandler')
var escapeHtml = require('escape-html')
var coap = require('coap')
var onFinished = require('on-finished')
var unpipe = require('unpipe')

/**
 * Module variables.
 * @private
 */

/* istanbul ignore next */
var defer = typeof setImmediate === 'function'
  ? setImmediate
  : function(fn){ process.nextTick(fn.bind.apply(fn, arguments)) }
var isFinished = onFinished.isFinished

/**
 * Module exports.
 * @public
 */

module.exports = finalhandler

/**
 * Create a function to handle the final response.
 *
 * @param {Request} req
 * @param {Response} res
 * @param {Object} [options]
 * @return {Function}
 * @public
 */

function finalhandler(req, res, options) {
  var opts = options || {}

  // get environment
  var env = opts.env || process.env.NODE_ENV || 'development'

  // get error callback
  var onerror = opts.onerror

  return function (err) {
    var status = res.statusCode

    // unhandled error
    if (err) {
      // respect err.statusCode
      if (err.statusCode) {
        status = err.statusCode
      }

      // respect err.status
      if (err.status) {
        status = err.status
      }

      // default status code to 500
      if (!status || parseInt(status.charAt(0)) < 4) {
        status = '5.00'
      }

      // production gets a basic error message
      var msg = env === 'production'
        ? coap.STATUS_CODES[status]
        : err.stack || err.toString()
      msg = escapeHtml(msg)
        .replace(/\n/g, '<br>')
        .replace(/  /g, ' &nbsp;') + '\n'
    } else {
      status = '4.04'
      msg = 'Cannot ' + escapeHtml(req.method) + ' ' + escapeHtml(req.originalUrl || req.url) + '\n'
    }

    debug('default %s', status)

    // schedule onerror callback
    if (err && onerror) {
      defer(onerror, err, req, res)
    }

    // cannot actually respond
    if (res._header) {
      return req.socket.destroy()
    }

    send(req, res, status, msg)
  }
}

/**
 * Send response.
 *
 * @param {IncomingMessage} req
 * @param {OutgoingMessage} res
 * @param {number} status
 * @param {string} body
 * @private
 */

function send(req, res, status, body) {
  function write() {
    res.statusCode = status
    res.setOption("Content-Format", "text/plain");
    res.end(body, 'utf8')
  }

  if (isFinished(req)) {
    write()
    return
  }

  // unpipe everything from the request
  unpipe(req)

  // flush the request
  onFinished(req, write)
  req.resume()
}
