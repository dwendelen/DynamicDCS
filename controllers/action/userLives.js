const	_ = require('lodash');
const dbMapServiceController = require('../db/dbMapService');
const DCSLuaCommands = require('../player/DCSLuaCommands');

_.set(exports, 'getPlayerBalance', function (serverName) {
	var blueAll;
	var nowTime = new Date().getTime();
	var oneMin = 60 * 1000;
	var redAll;
	var serverAlloc = {};
	return dbMapServiceController.statSessionActions('readLatest', serverName, {})
		.then(function (latestSession) {
			if (latestSession.name) {
				return dbMapServiceController.srvPlayerActions('read', serverName, {sessionName: latestSession.name})
					.then(function (playerArray) {
						_.forEach(playerArray, function (ePlayer) {
							if ((new Date(_.get(ePlayer, 'updatedAt', 0)).getTime() + oneMin > nowTime) && ePlayer.slot) {
								_.set(serverAlloc, [_.get(ePlayer, 'side')], _.get(serverAlloc, [_.get(ePlayer, 'side')], []));
								serverAlloc[_.get(ePlayer, 'side')].push(ePlayer);
							}
						});
						redAll = _.size(_.get(serverAlloc, 1));
						blueAll = _.size(_.get(serverAlloc, 2));
						if(redAll < blueAll && redAll !== 0) {
							return {
								side: 1,
								modifier: (redAll/blueAll) + 1,
								players: playerArray
							}
						} else if (redAll > blueAll && blueAll !== 0) {
							return {
								side: 2,
								modifier: (blueAll/redAll) + 1,
								players: playerArray
							};
						}
						return {
							side: 0,
							modifier: 1,
							players: playerArray
						};
					})
					.catch(function (err) {
						console.log('line41', err);
					})
				;
			}
		})
		.catch(function (err) {
			console.log('line47', err);
		})
	;
});

//var oneHour = 600 * 1000;
// updateServerLives
_.set(exports, 'updateServerLifePoints', function (serverName) {
	var addFracPoint;
	// update life points every 10 mins to start
	console.log('UPDATING LIFE POINTS');
	exports.getPlayerBalance(serverName)
		.then(function(playerBalance) {
			_.forEach(playerBalance.players, function (cPlayer) {
				if (cPlayer) {
					if (!_.isEmpty(cPlayer.slot)) {
						if (cPlayer.side === playerBalance.side) {
							addFracPoint = playerBalance.modifier
						} else {
							addFracPoint = 1;
						}
						if (cPlayer.slot) {
							dbMapServiceController.unitActions('read', serverName, {unitId: _.toNumber(cPlayer.slot)})
								.then(function (cUnit) {
									var curUnit = _.get(cUnit, [0]);
									dbMapServiceController.srvPlayerActions('addLifePoints', serverName, {
										_id: cPlayer._id,
										execAction: 'PeriodicAdd',
										groupId: curUnit.groupId,
										addLifePoints: addFracPoint
									});
								})
								.catch(function (err) {
									console.log('line81', err);
								})
							;
						} else {
							dbMapServiceController.srvPlayerActions('addLifePoints', serverName, {
								_id: cPlayer._id,
								execAction: 'PeriodicAdd',
								groupId: null,
								addLifePoints: addFracPoint
							});
						}
					}
				}
			});
		})
		.catch(function (err) {
			console.log('line47', err);
		})
	;
});

// checkCapLives
_.set(exports, 'checkLifeResource', function (serverName, playerUcid) {
	dbMapServiceController.srvPlayerActions('read', serverName, {_id: playerUcid})
		.then(function(srvPlayer) {
			var curPlayer = _.get(srvPlayer, [0]);
			if (curPlayer) {
				if (!_.isEmpty(curPlayer.slot)) {
					dbMapServiceController.unitActions('read', serverName, {unitId: _.toNumber(curPlayer.slot)})
						.then(function(cUnit) {
							var curUnit = _.get(cUnit, [0]);
							DCSLuaCommands.sendMesgToGroup(
								curUnit.groupId,
								serverName,
								"G: You Have " + curPlayer.curLifePoints + " Life Resource Points.",
								5
							);
						})
						.catch(function (err) {
							console.log('line112', err);
						})
					;
				}
			}
		})
		.catch(function (err) {
			console.log('line119', err);
		})
	;
});
