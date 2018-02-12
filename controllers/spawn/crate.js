const _ = require('lodash');
const constants = require('../constants');
const dbMapServiceController = require('../db/dbMapService');
const dbSystemServiceController = require('../db/dbSystemService');
const zoneController = require('../proxZone/zone');
const groupController = require('../spawn/group');


_.set(exports, 'spawnLogiCrate', function (serverName, crateObj) {
	_.set(crateObj, 'lonLatLoc',  zoneController.getLonLatFromDistanceDirection(_.get(crateObj, ['unitLonLatLoc']), crateObj.heading, 0.05));
	var curCMD = groupController.spawnStatic(serverName, groupController.staticTemplate(crateObj), crateObj.country, crateObj.name, true);
	var sendClient = {action: "CMD", cmd: curCMD, reqID: 0};
	var actionObj = {actionObj: sendClient, queName: 'clientArray'};
	dbMapServiceController.cmdQueActions('save', serverName, actionObj)
		.catch(function (err) {
			console.log('erroring line592: ', err);
		})
	;
});

