nodejs-multisock [![Build Status](https://travis-ci.org/PKuebler/nodejs-multisock.svg?branch=master)](https://travis-ci.org/PKuebler/nodejs-multisock)
===========

## NodeJS TCP and WebSocket Server Interface

Allows TCP and WebSockets to run simultaneously. Use [net](http://nodejs.org/api/net.html) and [WS](https://github.com/websockets/ws).

# Install

```bash
  npm install michaelrhodes/multisock
```

# Examples:

## Initialize (INIT):

```js
var Multisock = require( "nodejs-multisock" );
var ms = new Multisock();
```

### Options

* `tcpPort`: *(default: 8000)* the TCP Port
* `wsPort`: *(default: 7000)* the WebSocket Port
* `maxConnections`: *(default: 0)* Max Connections `0` = unlimited

## Get Started

```js
var Multisock = require( "nodejs-multisock" );

var options = {
    tcpPort: 70000,
    wsPort: 80000
};

var ms = new Multisock(options);

ms.on('connect', function(client) {
    // client.type = tcp | ws
    console.log("New "+client.type+" Client.");
});

ms.on('message', function(client, msg) {
   console.log("Client say: "+msg);

    /*
    {
        client: [Client Object], // (WS|net) Socket
        msg: 'MyMessage' // Socket Message
    }
    */
});

ms.on('disconnect', function(client) {
    console.log(client.type+" Client disconnect.");
});
```

## Send:

`ms.send(client, data)`

Send a Message
**Note:** Select TCP or WS automatic.

* `client` the Client Object.
* `data` Sends data on the socket

```js
ms.send(client, "MyMessage");
```

## Broadcast:

`ms.broadcast(data, [ clients[] ])`

Send to all Clients data.

* `data` Sends data on the socket
* `clients[]` (optimal) list of clients 

```js
ms.broadcast([client1, client3, client5], "MyMessage");

// Send to all Clients
ms.broadcast("MyMessage");
```

## Kick a client:

`ms.kick(client)`

Close a Connection.

* `client` the Client Object

```js
ms.kick(client);
```

## Close

`ms.close()`

Close the Server.

## Get Connections:

`ms.getConnections()`

Return Count of Clients.

```js
var count = ms.getConnections();
console.log(count); // 0
```

## Get Options:

`ms.getOptions()`

Returns the global Options.

```js
var value = ms.getOptions();
console.log(value);

/*
{
    tcpPort: 8000,
    wsPort: 7000,
    maxConnections: 0
}
 */
```

# Events

## message

Fired when becomme a Message.
You will get the `client` and the `msg` as callback argument.

```js
ms.on("message", function( client, msg ){
});
```

## connect

Fired when a Client connect.
You will get the `client` as callback argument.

```js
ms.on("connect", function( client ){
});
```

## disconnect

Fired when a Client disconnect.
You will get the `client` as callback argument.

```js
ms.on("disconnect", function( client ){
});
```

## error

Fired when there was an error.
You will get the `msg` as callback argument.

```js
ms.on("error", function( msg ){
    console.log(msg)
});
```

# ToDo:
* Add more Tests
* Add all WS and NET Functions

# The MIT License (MIT)


