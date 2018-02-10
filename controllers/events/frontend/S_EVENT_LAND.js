const _ = require('lodash');
const constants = require('../../constants');
const dbMapServiceController = require('../../db/dbMapService');
const DCSLuaCommands = require('../../player/DCSLuaCommands');
const playersEvent = require('../../events/backend/players');
const groupController = require('../../spawn/group');
const webPushCommands = require('../../socketIO/webPush');

_.set(exports, 'processEventLand', function (serverName, sessionName, eventObj) {
	// Occurs when an aircraft lands at an airbase, farp or ship
	if (_.get(eventObj, 'data.arg6')){
		place = ' at '+_.get(eventObj, 'data.arg6');
	} else if (_.get(eventObj, 'data.arg5')) {
		place = ' at '+_.get(eventObj, 'data.arg5');
	} else {
		place = '';
	}

	dbMapServiceController.unitActions('read', serverName, {unitId: _.get(eventObj, ['data', 'arg3']), isCrate: false})
		.then(function (iunit) {
			dbMapServiceController.srvPlayerActions('read', serverName, {sessionName: sessionName})
				.then(function (playerArray) {
					var iPlayer;
					var iCurObj;
					var curIUnit = _.get(iunit, 0);
					if (curIUnit) {
						//landed logistic planes/helis spawn new group for area
						var curUnitName = _.get(curIUnit, 'name');
						if (_.includes(curUnitName, 'LOGISTICS|')) {
							var bName = _.split(curUnitName, '|')[2];
							var curSide = _.get(curIUnit, 'coalition');
							dbMapServiceController.baseActions('read', serverName, {_id: bName})
								.then(function (bases) {
									var curBase = _.get(bases, [0], {}); // does this work?
									if (curBase.side === curSide) {
										groupController.replenishUnits( serverName, bName, curSide);
										groupController.healBase(serverName, bName);
									}
								})
								.catch(function (err) {
									console.log('err line1323: ', err);
								})
							;
						}

						iPlayer = _.find(playerArray, {name: _.get(curIUnit, 'playername')});
						if(iPlayer) {
							iCurObj = {
								sessionName: sessionName,
								eventCode: constants.shortNames[eventObj.action],
								iucid: _.get(iPlayer, 'ucid'),
								iName: _.get(curIUnit, 'playername'),
								displaySide: _.get(curIUnit, 'coalition'),
								roleCode: 'I',
								msg: 'C: '+ _.get(curIUnit, 'type') + '(' + _.get(curIUnit, 'playername') + ') has landed' + place
							};
							if(_.get(iCurObj, 'iucid')) {
								webPushCommands.sendToCoalition(serverName, {payload: {action: eventObj.action, data: _.cloneDeep(iCurObj)}});
								dbMapServiceController.simpleStatEventActions('save', serverName, iCurObj);
							}

							DCSLuaCommands.sendMesgToCoalition(
								_.get(iCurObj, 'displaySide'),
								serverName,
								_.get(iCurObj, 'msg'),
								5
							);
						}
					}
				})
				.catch(function (err) {
					console.log('err line45: ', err);
				})
			;
		})
		.catch(function (err) {
			console.log('err line69: ', err);
		})
	;
});
