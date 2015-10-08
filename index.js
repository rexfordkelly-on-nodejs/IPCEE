var assert = require('assert')
var util = require('util')
var EE = require('eventemitter2').EventEmitter2
var debug = require('debug')('IPCEE')

/**
 * @param ChildProcess child_process an instantiated child process that supports ipc
 * @param object options EventEmitter2 options https://github.com/asyncly/EventEmitter2
 * @throws AssertionError if ipc is not enabled
 */
function IPCEE(child_process, options) {

  if(!(this instanceof IPCEE)) { return new IPCEE(child_process, options) }

  assert(child_process.hasOwnProperty('send'), 'IPC is not enabled')

  this.client = child_process

  this._hookEvents()

  this.on('error', function() { })

  EE.call(this, options)
}

util.inherits(IPCEE, EE)

/**
 * Replicate the child_process.send with an array of arguments
 * @param mixed
 * @return this
 */
IPCEE.prototype.send = function() {
 var args = [].slice.call(arguments)

 this.client.send(args)

 return this
}

/**
 * Replicate the child_process.on('message') by taking an array of arguments
 * @param array args
 * @return this
 */
IPCEE.prototype.onmessage = function(args) {
  if(util.isArray(args)) {
    debug('Received message', args)
    //emit the real event (args[0]) with arguments
    this.emit.apply(this, args)

    return this
  }

  //no array keep the default behavior
  this.emit('message', args)
  return this
}

/**
 * Replicate the exit event and clean IPCEE events
 * @param integer code
 * @return void
 */
IPCEE.prototype.onexit = function(code) {
  debug('Process exited with code %d', code)
  this._removeEvents()
  this.emit('exit', code)
  delete this.client
}

/**
 * Add listeners (message and exit)
 * @return void
 */
IPCEE.prototype._hookEvents = function() {
  this.client.addListener('message', this.onmessage.bind(this))
  this.client.addListener('exit', this.onexit.bind(this))
}

/**
 * Remove listeners (message and exit)
 * @return void
 */
IPCEE.prototype._removeEvents = function() {
  this.client.removeListener('message', this.onmessage.bind(this))
  this.client.removeListener('exit', this.onexit.bind(this))
}

module.exports = IPCEE
