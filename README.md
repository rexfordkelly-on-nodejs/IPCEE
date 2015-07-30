# IPC EE [![Build Status](https://travis-ci.org/soyuka/IPCEE.svg?branch=master)](https://travis-ci.org/soyuka/IPCEE)

IPC combined with EventEmitter

## Usage

### Server

```javascript
  var ipc = IPCEE(process)

  ipc.send('started')

  ipc.on('ping', function() {
    ipc.send('pong') 
  })
```

### Client

```javascript
  var server = fork('some/node/app.js')
  client = IPCEE(server)

  client.once('started', function() {
    client.send('ping')
  })

  client.once('pong', function() {
    console.log('\o/') 
  })
```

## Caveat

Nodejs IPC will transport strings. Javascript objects are encoded with json internally. That said, You won't be able to pass instances.

Example:
```
process.on('uncaughtException', function(err) {
  //Temptation would be to send the full Error object
  //but JSON.stringify(new Error('test')) will return '{}'
  ipc.send('error', err.toString(), err.stack)

  process.nextTick(function() {
    process.exit(1) 
  })
})
```

### Licence

> The MIT License (MIT)
> [OSI Approved License]
> The MIT License (MIT)
> 
> Copyright (c) 2015 Antoine Bluchet
> 
> Permission is hereby granted, free of charge, to any person obtaining a copy
> of this software and associated documentation files (the "Software"), to deal
> in the Software without restriction, including without limitation the rights
> to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
> copies of the Software, and to permit persons to whom the Software is
> furnished to do so, subject to the following conditions:
> 
> The above copyright notice and this permission notice shall be included in
> all copies or substantial portions of the Software.
> 
> THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
> IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
> FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
> AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
> LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
> OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
> THE SOFTWARE.
