const _ = require('lodash');
const constants = require('../../constants');
const dbMapServiceController = require('../../db/dbMapService');
const DCSLuaCommands = require('../../player/DCSLuaCommands');
const playersEvent = require('../../events/backend/players');

_.set(exports, 'processEventRefuelingStop', function (serverName, sessionName, eventObj) {
	// Occurs when an aircraft is finished taking fuel.
	dbMapServiceController.unitActions('read', serverName, {unitId: _.get(eventObj, ['data', 'arg3'])})
		.then(function (iunit) {
			dbMapServiceController.srvPlayerActions('read', serverName, {sessionName: sessionName})
				.then(function (playerArray) {
					var curIUnit = _.get(iunit, 0);
					if (curIUnit) {
						var iPlayer;
						var iCurObj;
						iPlayer = _.find(playerArray, {name: _.get(curIUnit, 'playername')});
						if(iPlayer) {
							iCurObj = {
								sessionName: sessionName,
								eventCode: constants.shortNames[eventObj.action],
								iucid: _.get(iPlayer, 'ucid'),
								iName: _.get(curIUnit, 'playername'),
								displaySide: _.get(curIUnit, 'coalition'),
								roleCode: 'I',
								msg: 'C: '+ _.get(curIUnit, 'type') + '('+ _.get(curIUnit, 'playername') + ') ended refueling',
								showInChart: true
							};
							if (_.get(iCurObj, 'iucid')) {
								// curServers[serverName].updateQue.leaderboard.push(_.cloneDeep(iCurObj));
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
			console.log('err line39: ', err);
		})
	;
});
