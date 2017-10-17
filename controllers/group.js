const	_ = require('lodash'),
		js2lua = require('js2lua');

const dbMapServiceController = require('./dbMapService');

_.set(exports, 'spawnGrndUnit', function (serverName, groupObj, routeArry, unitArry) {
	var curGroup = {};
	var cRnd = _.random(1000000,9000000);

	var newSpawnCountry = 'USA';
	var newSpawnCategory = 'GROUND';
	var newVehicleType = 'AAV7';

	var defGndGroup = '{' +
		'["groupId"] = ' + _.get(groupObj, 'groupId', cRnd) + ',' +
		'["name"] = "' + _.get(groupObj, 'groupName', _.get(groupObj, 'baseName') + '_' + cRnd) + '",' +
		'["visible"] = false,' +
		'["hidden"] = false,' +
		'["task"] = {},' +
		'["units"] = {#UNITS},' +
		'["category"] = Group.Category.' + _.get(groupObj, 'category', newSpawnCategory) +',' +
		'["country"] = "' + _.get(groupObj, 'country', newSpawnCountry) + '"' +
		'}';

	var curUnits = '';
	_.forEach(unitArry, function (unit, k) {
		var curN = k + 1;
		var curUnit = '{' +
			'["x"] = ' + _.get(unit, 'x') + ',' +
			'["y"] = ' + _.get(unit, 'y') + ',' +
			'["type"] = "' + _.get(unit, 'type', newVehicleType) +'",' +
			'["name"] = "' + _.get(unit, 'name', _.get(unit, 'baseName') + '_' + cRnd + '#' + curN ) + '",' +
			'["unitId"] = ' + _.get(unit, 'unitId', cRnd+curN) + ',' +
			'["heading"] = 0,' +
			'["playerCanDrive"] = true,' +
			'["skill"] = "Excellent"' +
			'}';
		curUnits +=  curUnit + ',';
	});

	curGroup = defGndGroup;
	curGroup = _.replace(curGroup,"#UNITS",curUnits);
	return curGroup;
});