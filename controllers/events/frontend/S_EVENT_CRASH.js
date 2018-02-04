const _ = require('lodash');
const constants = require('../../constants');
const dbMapServiceController = require('../../db/dbMapService');
const DCSLuaCommands = require('../../player/DCSLuaCommands');
const capLivesController = require('../../action/capLives');
const unitsStaticsController = require('../../serverToDbSync/unitsStatics');

_.set(exports, 'processEventCrash', function (serverName, sessionName, eventObj) {
	// Occurs when any aircraft crashes into the ground and is completely destroyed.
	dbMapServiceController.unitActions('read', serverName, {unitId: _.get(eventObj, ['data', 'arg3'])})
		.then(function (iunit) {
			dbMapServiceController.srvPlayerActions('read', serverName, {sessionName: sessionName})
				.then(function (playerArray) {
					var iPlayer;
					var iCurObj;
					var curIUnit = _.get(iunit, 0);
					if (curIUnit) {

						unitsStaticsController.processUnitUpdates(serverName, sessionName, {action: 'D', data: {unitId: curIUnit.unitId}});

						iPlayer = _.find(playerArray, {name: _.get(curIUnit, 'playername')});
						if (iPlayer) {
							iCurObj = {
								sessionName: sessionName,
								eventCode: constants.shortNames[eventObj.action],
								iucid: _.get(iPlayer, 'ucid'),
								iName: _.get(curIUnit, 'playername'),
								displaySide: 'A',
								roleCode: 'I',
								msg: 'A: '+ constants.side[_.get(curIUnit, 'coalition')] + ' '+ _.get(curIUnit, 'type') + '(' + _.get(curIUnit, 'playername') +') has crashed'
							};
							if(_.get(iCurObj, 'iucid')) {
								// curServers[serverName].updateQue.leaderboard.push(_.cloneDeep(iCurObj));
								dbMapServiceController.simpleStatEventActions('save', serverName, iCurObj);
							}

							console.log('CRASHED: ', _.includes(capLivesController.capLivesEnabled, curIUnit.type), curIUnit.inAir);
							if (_.includes(capLivesController.capLivesEnabled, curIUnit.type) && curIUnit.inAir) {
								//take life away
								capLivesController.removeLife(serverName, iPlayer.ucid, curIUnit.groupId);
							}

							DCSLuaCommands.sendMesgToAll(
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
			console.log('err line1297: ', err);
		})
	;
});
