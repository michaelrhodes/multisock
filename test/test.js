var test   = require('utest');
var assert = require('assert');
var crypto = require('crypto');

var multisock = require('../multisock');

test('MultiSock', {
	'Set Options': function() {
		var options = {
			tcpPort: 70000,
			wsPort: 80000
		};

		var ms = new multisock(options);

		assert.equal(ms.getOptions().tcpPort, options.tcpPort);
		assert.equal(ms.getOptions().wsPort, options.wsPort);

		ms.close();
	}
});
