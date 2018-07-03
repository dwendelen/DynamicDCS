const _ = require('lodash');
const DCSSocket = require('../../controllers/net/DCSSocket');
const dbSystemServiceController = require('../../controllers/db/dbSystemService');
const dbMapServiceController = require('../../controllers/db/dbMapService');
const sychrontronController = require('../../controllers/sychronize/Sychrontron');
const playersEvent = require('../../controllers/events/backend/players');
const friendlyFireEvent = require('../../controllers/events/backend/friendlyFire');
const selfKillEvent = require('../../controllers/events/backend/selfKill');
const connectEvent = require('../../controllers/events/backend/connect');
const disconnectEvent = require('../../controllers/events/backend/disconnect');
const groupController = require('../../controllers/spawn/group');

var DCB = {};

//config
_.assign(DCB, {
	serverName: 'DDCS-Hardcore-PG',
	serverIP: '127.0.0.1',
	serverPort: '3002',
	queName: 'gameGuiArray',
	db: {
		systemHost: 'localhost',
		systemDatabase: 'DynamicDCS',
		dynamicHost: 'localhost',
		dynamicDatabase: 'DDCS-Hardcore-PG'
	}
});

dbSystemServiceController.connectSystemDB(DCB.db.systemHost, DCB.db.systemDatabase);
dbMapServiceController.connectMapDB(DCB.db.dynamicHost, DCB.db.dynamicDatabase);

//checks to see if socket needs restarting every 3 secs
setInterval(function () {
	if (DCB.DCSSocket) {
		if (DCB.DCSSocket.connOpen) {
			console.log('Connecting to ' + DCB.serverName + ' Backend');
			DCB.DCSSocket.connSocket();
		}
	} else {
		DCB.DCSSocket = new DCSSocket.createSocket(DCB.serverName, DCB.serverIP, DCB.serverPort, DCB.queName, DCB.socketCallback);
	}
}, 10 * 1000);

_.set(DCB, 'getLatestSession', function (serverName) {
	dbMapServiceController.statSessionActions('readLatest', serverName, {})
		.then(function (latestSession) {
			if (latestSession) {
				if (_.get(DCB, 'sessionName') !== latestSession.name) {
					console.log('New Session: ', latestSession);
					_.set(DCB, 'sessionName', latestSession.name);
				}
			}
		})
		.catch(function (err) {
			console.log('line43', err);
		})
	;
});

_.set(DCB, 'socketCallback', function (serverName, cbArray) {
	console.log('BB: ', cbArray.que);
	DCB.getLatestSession(serverName);
	_.forEach(_.get(cbArray, 'que', []), function (queObj) {
		if (_.get(queObj, 'action') === 'players') {
			playersEvent.processPlayerEvent(serverName, DCB.sessionName, queObj);
		}

		if (_.get(queObj, 'action') === 'friendly_fire') {
			friendlyFireEvent.processFriendlyFire(serverName, DCB.sessionName, queObj);
		}

		if (_.get(queObj, 'action') === 'self_kill') {
			selfKillEvent.processSelfKill(serverName, DCB.sessionName, queObj);
		}

		if (_.get(queObj, 'action') === 'connect') {
			connectEvent.processConnect(serverName, DCB.sessionName, queObj);
		}

		if (_.get(queObj, 'action') === 'disconnect') {
			disconnectEvent.processDisconnect(serverName, DCB.sessionName, queObj);
		}

	});
});
groupController.initDbs(DCB.serverName);

