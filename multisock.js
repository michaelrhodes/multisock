// Connection TCP & Websocket
var util = require('util'),
	events = require('events'),
	net = require('net'),
	WebSocketServer = require('uws').Server;

function Multisock(options) {

	this.options = {
		tcpPort: 8000,
		wsPort: 7000,
		maxConnections: 0
	}

	this._connections = [];
	this._tcp = null;
	this._ws = null;

	this.on('message', function(client, msg) {});
	this.on('connect', function(client) {});
	this.on('disconnect', function(client) {});
	this.on('error', function(err) {});

	if (typeof options !== 'undefined' && options.hasOwnProperty('tcpPort') && parseInt(options.tcpPort) != options.tcpPort) {
		this.emit("error", 'options.tcpPort `'+parseInt(options.tcpPort)+'` is not a number.');
		delete options.tcpPort;
	}
	if (typeof options !== 'undefined' && options.hasOwnProperty('wsPort') && parseInt(options.wsPort) != options.wsPort) {
		this.emit("error", 'options.wsPort `'+parseInt(options.wsPort)+'` is not a number.');
		delete options.wsPort;
	}

	this.options = util._extend(this.options, options);

	this._initTCP(this.options.tcpPort);
	this._initWS(this.options.wsPort);
}

util.inherits(Multisock, events.EventEmitter);

Multisock.prototype._initTCP = function(port) {
	var self = this;

	this._tcp = net.createServer(function(client) {
		client.type = 'tcp';
		self._connect(client);
	    
	    // Incoming Data
	    client.on('data', function(data) {
	    	self._msg(client, data);
	    });
	    
	    // Verbindung beendet sich.
	    client.on('close', function() {
			self._disconnect(client);
	    });

	    client.on('error', function(err) {
	    	self._error(err);
	    });
	    
	}).listen(port);
};

Multisock.prototype._initWS = function(port) {
	var self = this;

	this._ws = new WebSocketServer({port: port});

	this._ws.on('connection', function(client) {
		// New Client
		client.type = 'ws';
		self._connect(client);

		// Incoming Data
		client.on('message', function(message) {
	    	self._msg(client, message);
		});

		// Verbindung beendet sich.
		client.on('close', function() {
			// Ende
			self._disconnect(client);
		});

		client.on('error', function(err) {
			self._error(err);
		});

	});
};

Multisock.prototype._msg = function(client, msg) {
	this.emit('data', client, msg);
};

Multisock.prototype._connect = function(client) {
	if (this.options.maxConnections > 0 && this._connections.length >= this.options.maxConnections) {
		// Max Connections
		this.kick(client);
		return;
	}

	this._connections.push(client);

	this.emit('connect', client);
};

Multisock.prototype._disconnect = function(client) {
	var index = this._connections.indexOf(client);
	if (index > -1)
		this._connections.splice(index, 1);

	this.emit('disconnect', client);
};

Multisock.prototype._error = function(err) {
	this.emit('error', err);
};

Multisock.prototype.send = function(client, data) {
	if (client.type == 'ws') {
		client.send(data);
	} else if (client.type == 'tcp') {
		client.write(data);
	}
};

Multisock.prototype.broadcast = function(data, clients) {
	if (typeof clients === 'undefined')
		var clients = this._connections;

	for(var i = 0; i < clients.length; i++) {
		this.send(clients[i], data);
	}
};

Multisock.prototype.kick = function(client) {
	// Kick Client
	if (client.type == 'ws') {
		client.terminate();
	} else if (client.type == 'tcp') {
		client.destroy();
	}
}

Multisock.prototype.close = function() {
	// Server close
	try {
		if (this._tcp != null)
			this._tcp.close();
	} catch(e) {}

	try {
		if (this._ws != null && typeof this._ws._server != 'undefined')
			this._ws.close();
	} catch(e) {}

	this._ws = null;
	this._tcp = null;
}
Multisock.prototype.getConnections = function() {
	return this.clients.length;
}

Multisock.prototype.getOptions = function() {
	return this.options;
}

module.exports = Multisock;
