import {
	to_luastring,
	lauxlib,
	lualib,
	lua
} from 'fengari';
import * as interop from 'fengari-interop';
import lua_State = lua.lua_State;
import lua_pushstring = lua.lua_pushstring;
import lua_pushjsclosure = lua.lua_pushjsclosure;
import lua_dump = lua.lua_dump;
import LUA_ERRSYNTAX = lua.LUA_ERRSYNTAX;
import lua_tojsstring = lua.lua_tojsstring;
import lua_pop = lua.lua_pop;
import LUA_OK = lua.LUA_OK;




const {
	luaL_loadbuffer,
	luaL_newstate,
	luaL_requiref,
} = lauxlib;
const {
	luaopen_js,
	tojs
} = interop;

let L = luaL_newstate();

/* open standard libraries */
lualib.luaL_openlibs(L);
luaL_requiref(L, to_luastring("js"), luaopen_js, 1);
lua.lua_pop(L, 1); /* remove lib */

function bla(L: lua_State) {
	return 0;
}

lua_pushstring(L, "ba");
lua_pushjsclosure(L, bla, 1);
lua_dump(L, (L: lua_State, p: any, sz: number, ud: number) => {
	return 0;
}, {}, 1);




/* Helper function to load a JS string of Lua source */
function load(source) {
	source = to_luastring(source);

	let ok = luaL_loadbuffer(L, source, null, null);
	let res;
	if (ok === LUA_ERRSYNTAX) {
		res = new SyntaxError(lua_tojsstring(L, -1));
	} else {
		res = tojs(L, -1);
	}
	lua_pop(L, 1);
	if (ok !== LUA_OK) {
		throw res;
	}
	return res;
}

var script;

function run() {

//	var vm = new shine.VM();
	//vm.load(script);

	let toRun = load(script, "bla");
	toRun();
	//new LuaRunner(new LuaContext(null,null) , null)
	//	.run(script);
}

script = `


Unit = {
	Category = {
		AIRPLANE = "AIRPLANE",
		HELICOPTER = "HELICOPTER",
		GROUND_UNIT = "GROUND_UNIT",
		SHIP = "SHIP",
		STRUCTURE = "STRUCTURE"
	}
}

package.cpath = ""

dynamicDCS = { require = require }

clientEventHandler = {}


--in missionScripting.lua file: dynamicDCS = { require = require }
function tprint(tbl, indent)
\tif not indent then indent = 0 end
\tfor k, v in pairs(tbl) do
\t\tformatting = string.rep("  ", indent) .. k .. ": "
\t\tif type(v) == "table" then
\t\t\tenv.info(formatting)
\t\t\ttprint(v, indent + 1)
\t\telseif type(v) == 'boolean' then
\t\t\tenv.info(formatting .. tostring(v))
\t\telse
\t\t\tenv.info(formatting .. tostring(v))
\t\tend
\tend
end

function string:split(inSplitPattern, outResults)
\tif not outResults then
\t\toutResults = {}
\tend
\tlocal theStart = 1
\tlocal theSplitStart, theSplitEnd = string.find(self, inSplitPattern, theStart)
\twhile theSplitStart do
\t\ttable.insert(outResults, string.sub(self, theStart, theSplitStart - 1))
\t\ttheStart = theSplitEnd + 1
\t\ttheSplitStart, theSplitEnd = string.find(self, inSplitPattern, theStart)
\tend
\ttable.insert(outResults, string.sub(self, theStart))
\treturn outResults
end

local CategoryNames = {
\t[Unit.Category.AIRPLANE] = "AIRPLANE",
\t[Unit.Category.HELICOPTER] = "HELICOPTER",
\t[Unit.Category.GROUND_UNIT] = "GROUND",
\t[Unit.Category.SHIP] = "SHIP",
\t[Unit.Category.STRUCTURE] = "STRUCTURE"
}

local CountryNames = {
\t[0] = "RUSSIA",
\t[1] = "UKRAINE",
\t[2] = "USA",
\t[3] = "TURKEY",
\t[4] = "UK",
\t[5] = "FRANCE",
\t[6] = "GERMANY",
\t[7] = "AGGRESSORS",
\t[8] = "CANADA",
\t[9] = "SPAIN",
\t[10] = "THE_NETHERLANDS",
\t[11] = "BELGIUM",
\t[12] = "NORWAY",
\t[13] = "DENMARK",
\t[14] = "SECRET",
\t[15] = "ISRAEL",
\t[16] = "GEORGIA",
\t[17] = "INSURGENTS",
\t[18] = "ABKHAZIA",
\t[19] = "SOUTH_OSETIA",
\t[20] = "ITALY",
\t[21] = "AUSTRALIA",
\t[22] = "SWITZERLAND",
\t[23] = "AUSTRIA",
\t[24] = "BELARUS",
\t[25] = "BULGARIA",
\t[26] = "CHEZH_REPUBLIC",
\t[27] = "CHINA",
\t[28] = "CROATIA",
\t[29] = "EGYPT",
\t[30] = "FINLAND",
\t[31] = "GREECE",
\t[32] = "HUNGARY",
\t[33] = "INDIA",
\t[34] = "IRAN",
\t[35] = "IRAQ",
\t[36] = "JAPAN",
\t[37] = "KAZAKHSTAN",
\t[38] = "NORTH_KOREA",
\t[39] = "PAKISTAN",
\t[40] = "POLAND",
\t[41] = "ROMANIA",
\t[42] = "SAUDI_ARABIA",
\t[43] = "SERBIA",
\t[44] = "SLOVAKIA",
\t[45] = "SOUTH_KOREA",
\t[46] = "SWEDEN",
\t[47] = "SYRIA",
\t[48] = "YEMEN",
\t[49] = "VIETNAM",
\t[51] = "TUNISIA",
\t[52] = "THAILAND",
\t[53] = "SUDAN",
\t[54] = "PHILIPPINES",
\t[55] = "MOROCCO",
\t[56] = "MEXICO",
\t[57] = "MALAYSIA",
\t[58] = "LIBYA",
\t[59] = "JORDAN",
\t[60] = "INDONESIA",
\t[61] = "HONDURAS",
\t[62] = "ETHIOPIA",
\t[63] = "CHILE",
\t[64] = "BRAZIL",
\t[65] = "BAHRAIN",
\t[66] = "THIRDREICH",
\t[67] = "YUGOSLAVIA",
\t[68] = "USSR",
\t[69] = "ITALIAN_SOCIAL_REPUBLIC",
\t[70] = "ALGERIA",
\t[71] = "KUWAIT",
\t[72] = "QATAR",
\t[73] = "OMAN",
\t[74] = "UNITED_ARAB_EMIRATES"
}

do
\t--
\tlocal PORT = 3001
\tlocal DATA_TIMEOUT_SEC = 0.2

\tlocal isResetUnits = false
\tlocal lockBaseUpdates = true
\tlocal unitCache = {}
\tlocal airbaseCache = {}
\tlocal staticCache = {}
\tlocal crateCache = {}
\tlocal sideLockCache = {}
\tlocal completeAliveNames = {}
\tlocal updateQue = { ["que"] = {} }

\tlocal unitCnt = 0
\tlocal checkUnitDead = {}
\tlocal staticCnt = 0
\tlocal checkStaticDead = {}
\tlocal laserSpots = {}
\t--local IRSpots = {}

\tpackage.path = package.path .. ";.\\\\LuaSocket\\\\?.lua"
\tpackage.cpath = package.cpath .. ";.\\\\LuaSocket\\\\?.dll"

\trequire = dynamicDCS.require
\tlocal socket = require("socket")
\tlocal JSON = loadfile("Scripts\\\\JSON.lua")()
\trequire = nil
\tlocal missionStartTime = os.time()
\tlocal airbases = {}

\tlocal function log(msg)
\t\t--env.info("DynamicDCS (t=" .. timer.getTime() .. "): " .. msg)
\tend

\tlog('REALTIME ' .. missionStartTime)

\tlocal function addGroups(groups, coalition, Init)
\t\tfor groupIndex = 1, #groups do
\t\t\tlocal group = groups[groupIndex]
\t\t\tlocal units = group:getUnits()
\t\t\tfor unitIndex = 1, #units do
\t\t\t\tlocal unit = units[unitIndex]
\t\t\t\tif Unit.isActive(unit) then
\t\t\t\t\tlocal curUnit = {
\t\t\t\t\t\tuType = "unit",
\t\t\t\t\t\tdata = {}
\t\t\t\t\t}
\t\t\t\t\tcurUnit.data.category = CategoryNames[unit:getDesc().category]
\t\t\t\t\tif curUnit.data.category ~= "SHIP" then
\t\t\t\t\t\tcurUnit.data.groupId = group:getID()
\t\t\t\t\t\tcurUnit.data.unitId = tonumber(unit:getID())
\t\t\t\t\t\tcurUnit.data.name = unit:getName()
\t\t\t\t\t\ttable.insert(completeAliveNames, curUnit.data.name)
\t\t\t\t\t\t--curUnit.data.life = tonumber(unit:getLife())
\t\t\t\t\t\tlocal unitPosition = unit:getPosition()
\t\t\t\t\t\tlocal lat, lon, alt = coord.LOtoLL(unitPosition.p)
\t\t\t\t\t\tcurUnit.data.lonLatLoc = {
\t\t\t\t\t\t\tlon,
\t\t\t\t\t\t\tlat
\t\t\t\t\t\t}
\t\t\t\t\t\tcurUnit.data.alt = alt
\t\t\t\t\t\tlocal unitXYZNorthCorr = coord.LLtoLO(lat + 1, lon)
\t\t\t\t\t\tlocal headingNorthCorr = math.atan2(unitXYZNorthCorr.z - unitPosition.p.z, unitXYZNorthCorr.x - unitPosition.p.x)
\t\t\t\t\t\tlocal heading = math.atan2(unitPosition.x.z, unitPosition.x.x) + headingNorthCorr
\t\t\t\t\t\tif heading < 0 then
\t\t\t\t\t\t\theading = heading + 2 * math.pi
\t\t\t\t\t\tend
\t\t\t\t\t\tcurUnit.data.hdg = math.floor(heading / math.pi * 180);
\t\t\t\t\t\tlocal velocity = unit:getVelocity()
\t\t\t\t\t\tif (velocity) then
\t\t\t\t\t\t\tcurUnit.data.speed = math.sqrt(velocity.x ^ 2 + velocity.z ^ 2)
\t\t\t\t\t\tend
\t\t\t\t\t\tlocal PlayerName = unit:getPlayerName()
\t\t\t\t\t\tif PlayerName ~= nil then
\t\t\t\t\t\t\tcurUnit.data.playername = PlayerName
\t\t\t\t\t\t\tlocal curFullAmmo = unit:getAmmo()
\t\t\t\t\t\t\tif curFullAmmo ~= nil then
\t\t\t\t\t\t\t\t--tprint(curFullAmmo)
\t\t\t\t\t\t\t\tcurUnit.data.ammo = {}
\t\t\t\t\t\t\t\tfor ammoIndex = 1, #curFullAmmo do
\t\t\t\t\t\t\t\t\t--tprint(curFullAmmo[ammoIndex])
\t\t\t\t\t\t\t\t\ttable.insert(curUnit.data.ammo, {
\t\t\t\t\t\t\t\t\t\t["typeName"] = curFullAmmo[ammoIndex].desc.typeName,
\t\t\t\t\t\t\t\t\t\t["count"] = curFullAmmo[ammoIndex].count
\t\t\t\t\t\t\t\t\t})
\t\t\t\t\t\t\t\tend
\t\t\t\t\t\t\tend
\t\t\t\t\t\telse
\t\t\t\t\t\t\tcurUnit.data.playername = ""
\t\t\t\t\t\tend
\t\t\t\t\t\tcurUnit.data.inAir = unit:inAir()
\t\t\t\t\t\tif unitCache[curUnit.data.name] ~= nil and not Init then
\t\t\t\t\t\t\tif unitCache[curUnit.data.name].lat ~= lat or unitCache[curUnit.data.name].lon ~= lon then
\t\t\t\t\t\t\t\tunitCache[curUnit.data.name] = {}
\t\t\t\t\t\t\t\tunitCache[curUnit.data.name].lat = lat
\t\t\t\t\t\t\t\tunitCache[curUnit.data.name].lon = lon
\t\t\t\t\t\t\t\tcurUnit.action = "U"
\t\t\t\t\t\t\t\ttable.insert(updateQue.que, curUnit)
\t\t\t\t\t\t\tend
\t\t\t\t\t\telse
\t\t\t\t\t\t\tunitCache[curUnit.data.name] = {}
\t\t\t\t\t\t\tunitCache[curUnit.data.name].lat = lat
\t\t\t\t\t\t\tunitCache[curUnit.data.name].lon = lon
\t\t\t\t\t\t\t--local maxLife = unit:getLife0()
\t\t\t\t\t\t\t--if maxLife ~= nil then
\t\t\t\t\t\t\t--\tcurUnit.data.maxLife = tonumber(maxLife)
\t\t\t\t\t\t\t--end
\t\t\t\t\t\t\tcurUnit.data.groupName = group:getName()
\t\t\t\t\t\t\tcurUnit.data.type = unit:getTypeName()
\t\t\t\t\t\t\tcurUnit.data.coalition = coalition
\t\t\t\t\t\t\tcurUnit.data.country = CountryNames[unit:getCountry()]
\t\t\t\t\t\t\tcurUnit.action = "C"
\t\t\t\t\t\t\ttable.insert(updateQue.que, curUnit)
\t\t\t\t\t\tend
\t\t\t\t\t\tcheckUnitDead[curUnit.data.name] = 1
\t\t\t\t\tend
\t\t\t\tend
\t\t\tend
\t\tend
\tend

\tlocal function updateGroups(Init)
\t\tunitCnt = 0
\t\tcheckUnitDead = {}

\t\tlocal redGroups = coalition.getGroups(coalition.side.RED)
\t\tif redGroups ~= nil then
\t\t\taddGroups(redGroups, 1, Init)
\t\tend
\t\tlocal blueGroups = coalition.getGroups(coalition.side.BLUE)
\t\tif blueGroups ~= nil then
\t\t\taddGroups(blueGroups, 2, Init)
\t\tend
\t\t--check dead, send delete action to server if dead detected
\t\tfor k, v in pairs(unitCache) do
\t\t\tif checkUnitDead[k] == nil then
\t\t\t\tlocal curUnit = {
\t\t\t\t\taction = "D",
\t\t\t\t\tuType = "unit",
\t\t\t\t\tdata = {
\t\t\t\t\t\tname = k
\t\t\t\t\t}
\t\t\t\t}
\t\t\t\ttable.insert(updateQue.que, curUnit)
\t\t\t\tunitCache[k] = nil
\t\t\tend
\t\t\tunitCnt = unitCnt + 1
\t\tend
\tend

\tlocal function addStatics(statics, coalition, Init)
\t\tfor staticIndex = 1, #statics do
\t\t\tlocal static = statics[staticIndex]
\t\t\tlocal curStatic = {
\t\t\t\tuType = "static",
\t\t\t\tdata = {}
\t\t\t}
\t\t\tcurStatic.data.name = static:getName()
\t\t\tif curStatic.data.name:split(" #")[1] ~= 'New Static Object' then
\t\t\t\ttable.insert(completeAliveNames, curStatic.data.name)
\t\t\t\t--curStatic.data.life = static:getLife()
\t\t\t\tlocal staticPosition = static:getPosition()
\t\t\t\tcurStatic.data.lat, curStatic.data.lon, curStatic.data.alt = coord.LOtoLL(staticPosition.p)
\t\t\t\tlocal lat, lon, alt = coord.LOtoLL(staticPosition.p)
\t\t\t\tcurStatic.data.lonLatLoc = {
\t\t\t\t\tlon,
\t\t\t\t\tlat
\t\t\t\t}
\t\t\t\tcurStatic.data.alt = alt
\t\t\t\tlocal unitXYZNorthCorr = coord.LLtoLO(lat + 1, lon)
\t\t\t\tlocal unitXYZNorthCorr = coord.LLtoLO(curStatic.data.lat + 1, curStatic.data.lon)
\t\t\t\tlocal headingNorthCorr = math.atan2(unitXYZNorthCorr.z - staticPosition.p.z, unitXYZNorthCorr.x - staticPosition.p.x)
\t\t\t\tlocal heading = math.atan2(staticPosition.x.z, staticPosition.x.x) + headingNorthCorr
\t\t\t\tif heading < 0 then
\t\t\t\t\theading = heading + 2 * math.pi
\t\t\t\tend
\t\t\t\tcurStatic.data.hdg = math.floor(heading / math.pi * 180);
\t\t\t\tif staticCache[curStatic.data.name] ~= nil and not Init then
\t\t\t\t\tif staticCache[curStatic.data.name].lat ~= lat or staticCache[curStatic.data.name].lon ~= lon then
\t\t\t\t\t\tstaticCache[curStatic.data.name] = {}
\t\t\t\t\t\tstaticCache[curStatic.data.name].lat = lat
\t\t\t\t\t\tstaticCache[curStatic.data.name].lon = lon
\t\t\t\t\t\tcurStatic.action = "U"
\t\t\t\t\t\ttable.insert(updateQue.que, curStatic)
\t\t\t\t\tend
\t\t\t\telse
\t\t\t\t\tstaticCache[curStatic.data.name] = {}
\t\t\t\t\tstaticCache[curStatic.data.name].lat = lat
\t\t\t\t\tstaticCache[curStatic.data.name].lon = lon
\t\t\t\t\tcurStatic.data.groupName = curStatic.data.name
\t\t\t\t\t--curStatic.data.maxLife = tonumber(static:getLife())
\t\t\t\t\tcurStatic.data.category = CategoryNames[static:getDesc().category]
\t\t\t\t\tcurStatic.data.type = static:getTypeName()
\t\t\t\t\tcurStatic.data.coalition = coalition
\t\t\t\t\tcurStatic.data.country = CountryNames[static:getCountry()]
\t\t\t\t\tcurStatic.action = "C"
\t\t\t\t\ttable.insert(updateQue.que, curStatic)
\t\t\t\tend
\t\t\t\tcheckStaticDead[curStatic.data.name] = 1
\t\t\tend
\t\tend

\tend

\tlocal function updateStatics(Init)
\t\tstaticCnt = 0
\t\tcheckStaticDead = {}
\t\tlocal redStatics = coalition.getStaticObjects(coalition.side.RED)
\t\tif redStatics ~= nil then
\t\t\taddStatics(redStatics, 1, Init)
\t\tend
\t\tlocal blueStatics = coalition.getStaticObjects(coalition.side.BLUE)
\t\tif blueStatics ~= nil then
\t\t\taddStatics(blueStatics, 2, Init)
\t\tend
\t\tfor k, v in pairs(staticCache) do
\t\t\tif checkStaticDead[k] == nil then
\t\t\t\tlocal curStatic = {
\t\t\t\t\taction = "D",
\t\t\t\t\tuType = "static",
\t\t\t\t\tdata = {
\t\t\t\t\t\tname = k
\t\t\t\t\t}
\t\t\t\t}
\t\t\t\ttable.insert(updateQue.que, curStatic)
\t\t\t\tstaticCache[k] = nil
\t\t\tend
\t\t\tif k:split(" #")[1] ~= 'New Static Object' then
\t\t\t\tstaticCnt = staticCnt + 1
\t\t\tend
\t\tend
\tend

\tlocal function getDataMessage()
\t\tcompleteAliveNames = {}
\t\tupdateGroups()
\t\tupdateStatics()

\t\t--env.info('paySize: '..table.getn(updateQue.que));
\t\tlocal chkSize = 100
\t\tlocal payload = {}
\t\tpayload.que = {}
\t\tfor i = 1, chkSize do
\t\t\ttable.insert(payload.que, updateQue.que[i])
\t\t\ttable.remove(updateQue.que, i)
\t\tend
\t\tpayload.unitCount = unitCnt + staticCnt
\t\tpayload.startAbsTime = timer.getTime0()
\t\tpayload.curAbsTime = timer.getAbsTime()
\t\tpayload.epoc = missionStartTime * 1000
\t\treturn payload
\tend

\tlocal function runRequest(request)
\t\tif request.action ~= nil then
\t\t\t--env.info('REQ_ACTION: '..request.action)
\t\t\tif request.action == "CRATEUPDATE" then
\t\t\t\tif type(request.crateNames) == 'table' then
\t\t\t\t\tlocal crateObjs = {};
\t\t\t\t\tfor nIndex = 1, #request.crateNames do
\t\t\t\t\t\tlocal curCrateName = request.crateNames[nIndex]
\t\t\t\t\t\tlocal crate = StaticObject.getByName(curCrateName)
\t\t\t\t\t\tif crate ~= nil and crate:getLife() > 0 then
\t\t\t\t\t\t\tlocal cratePosition = crate:getPosition()
\t\t\t\t\t\t\tlocal lat, lon, alt = coord.LOtoLL(cratePosition.p)
\t\t\t\t\t\t\tcrateObjs[curCrateName] = {}
\t\t\t\t\t\t\tcrateObjs[curCrateName].lat = lat
\t\t\t\t\t\t\tcrateObjs[curCrateName].lon = lon
\t\t\t\t\t\t\tcrateObjs[curCrateName].alive = true
\t\t\t\t\t\telse
\t\t\t\t\t\t\tcrateObjs[curCrateName] = {}
\t\t\t\t\t\t\tcrateObjs[curCrateName].alive = false
\t\t\t\t\t\tend
\t\t\t\t\tend
\t\t\t\t\ttable.insert(updateQue.que, {
\t\t\t\t\t\taction = 'CRATEOBJUPDATE',
\t\t\t\t\t\tcallback = request.callback,
\t\t\t\t\t\tunitId = request.unitId,
\t\t\t\t\t\tdata = crateObjs
\t\t\t\t\t})
\t\t\t\tend
\t\t\tend
\t\t\tif request.action == "REMOVEOBJECT" then
\t\t\t\t--env.info('REMOVE OBJECT')
\t\t\t\tlocal removeObj = Unit.getByName(request.removeObject)
\t\t\t\tlocal removeObjStat = StaticObject.getByName(request.removeObject)
\t\t\t\tif removeObj ~= nil then
\t\t\t\t\t--env.info('Destroying '..request.removeObject)
\t\t\t\t\tremoveObj:destroy()
\t\t\t\telseif removeObjStat ~= nil then
\t\t\t\t\t--env.info('Destroying Static '..request.removeObject)
\t\t\t\t\tremoveObjStat:destroy()
\t\t\t\tend
\t\t\tend
\t\t\tif request.action == "ADDTASK" then
\t\t\t\t--env.info('ADD TASK')
\t\t\t\tif request.taskType == 'EWR' then
\t\t\t\t\tlocal taskUnit = Unit.getByName(request.unitName)
\t\t\t\t\tif taskUnit ~= nil then
\t\t\t\t\t\tlocal _controller = taskUnit:getController();
\t\t\t\t\t\tlocal _EWR = {
\t\t\t\t\t\t\tid = 'EWR',
\t\t\t\t\t\t\tauto = true,
\t\t\t\t\t\t\tparams = {
\t\t\t\t\t\t\t}
\t\t\t\t\t\t}
\t\t\t\t\t\t_controller:setTask(_EWR)
\t\t\t\t\tend
\t\t\t\tend
\t\t\tend
\t\t\tif request.action == "SETLASERSMOKE" then
\t\t\t\t--env.info('SET LASER SMOKE')
\t\t\t\tlocal curJtacUnit = Unit.getByName(request.jtacUnitName)
\t\t\t\tlocal curEnemyUnit = Unit.getByName(request.enemyUnitName)

\t\t\t\tif curJtacUnit ~= nil and curEnemyUnit ~= nil then
\t\t\t\t\tlocal _spots = {}

\t\t\t\t\tlocal _enemyVector = curEnemyUnit:getPoint()
\t\t\t\t\tlocal _enemyVectorUpdated = { x = _enemyVector.x, y = _enemyVector.y + 2.0, z = _enemyVector.z }

\t\t\t\t\tlocal _oldLase = laserSpots[request.jtacUnitName]
\t\t\t\t\t--local _oldIR = IRSpots[request.jtacUnitName]

\t\t\t\t\t--if _oldLase == nil or _oldIR == nil then
\t\t\t\t\tif _oldLase == nil then

\t\t\t\t\t\tlocal _status, _result = pcall(function()
\t\t\t\t\t\t\t--_spots['irPoint'] = Spot.createInfraRed(curJtacUnit, { x = 0, y = 2.0, z = 0 }, _enemyVectorUpdated)
\t\t\t\t\t\t\t_spots['laserPoint'] = Spot.createLaser(curJtacUnit, { x = 0, y = 2.0, z = 0 }, _enemyVectorUpdated, request.laserCode)
\t\t\t\t\t\t\treturn _spots
\t\t\t\t\t\tend)

\t\t\t\t\t\tif not _status then
\t\t\t\t\t\t\tenv.error('ERROR: ' .. _result, false)
\t\t\t\t\t\telse
\t\t\t\t\t\t\t--if _result.irPoint then
\t\t\t\t\t\t\t--\tIRSpots[request.jtacUnitName] = _result.irPoint
\t\t\t\t\t\t\t--end
\t\t\t\t\t\t\tif _result.laserPoint then
\t\t\t\t\t\t\t\tlaserSpots[request.jtacUnitName] = _result.laserPoint
\t\t\t\t\t\t\tend
\t\t\t\t\t\tend
\t\t\t\t\telse
\t\t\t\t\t\tif _oldLase ~= nil then
\t\t\t\t\t\t\t_oldLase:setPoint(_enemyVectorUpdated)
\t\t\t\t\t\tend

\t\t\t\t\t\t--if _oldIR ~= nil then
\t\t\t\t\t\t--\t_oldIR:setPoint(_enemyVectorUpdated)
\t\t\t\t\t\t--end
\t\t\t\t\tend
\t\t\t\t\tlocal elat, elon, ealt = coord.LOtoLL(_enemyVectorUpdated)
\t\t\t\t\tlocal MGRS = coord.LLtoMGRS(coord.LOtoLL(_enemyVectorUpdated))
\t\t\t\t\tlocal enemyType = curEnemyUnit:getTypeName()
\t\t\t\t\tlocal mesg = "JTAC Has Placed Smoke And Is Now Lasing a "..enemyType.." on "..request.laserCode.." Lat:"..elat.." Lon:"..elon.." MGRS:"..MGRS.UTMZone..MGRS.MGRSDigraph.." "..MGRS.Easting.." "..MGRS.Northing
\t\t\t\t\ttrigger.action.outTextForCoalition(request.coalition, mesg, 15)
\t\t\t\t\tif request.coalition == 1 then
\t\t\t\t\t\ttrigger.action.smoke(_enemyVectorUpdated, 4 )
\t\t\t\t\tend
\t\t\t\t\tif request.coalition == 2 then
\t\t\t\t\t\ttrigger.action.smoke(_enemyVectorUpdated, 1 )
\t\t\t\t\tend
\t\t\t\tend
\t\t\tend
\t\t\tif request.action == "REMOVELASERIR" then
\t\t\t\t--env.info('REMOVE LASER')
\t\t\t\tlocal _tempLase = laserSpots[request.jtacUnitName]

\t\t\t\tif _tempLase ~= nil then
\t\t\t\t\tSpot.destroy(_tempLase)
\t\t\t\t\tlaserSpots[request.jtacUnitName] = nil
\t\t\t\t\t_tempLase = nil
\t\t\t\tend

\t\t\t\t--local _tempIR = IRSpots[request.jtacUnitName]

\t\t\t\t--if _tempIR ~= nil then
\t\t\t\t--\tSpot.destroy(_tempIR)
\t\t\t\t--\tIRSpots[request.jtacUnitName] = nil
\t\t\t\t--\t_tempIR = nil
\t\t\t\t--end
\t\t\tend
\t\t\tif request.action == "ISLOSVISIBLE" then
\t\t\t\t--env.info('IS LOS VISIBLE')
\t\t\t\t--tprint(request, 1)
\t\t\t\tlocal jtacUnit = Unit.getByName(request.jtacUnitName)
\t\t\t\tif jtacUnit ~= nil then
\t\t\t\t\tlocal jtacPOS = jtacUnit:getPoint()
\t\t\t\t\t--tprint(jtacPOS, 1)
\t\t\t\t\tlocal visableUnits = {}
\t\t\t\t\tif type(request.enemyUnitNames) == 'table' then
\t\t\t\t\t\tfor nIndex = 1, #request.enemyUnitNames do
\t\t\t\t\t\t\tlocal curUnit = Unit.getByName(request.enemyUnitNames[nIndex])
\t\t\t\t\t\t\tif curUnit ~= nil then
\t\t\t\t\t\t\t\tlocal enemyPOS = curUnit:getPoint()
\t\t\t\t\t\t\t\t--tprint(enemyPOS, 1)
\t\t\t\t\t\t\t\tlocal offsetEnemyPos = { x = enemyPOS.x, y = enemyPOS.y + 2.0, z = enemyPOS.z }
\t\t\t\t\t\t\t\tlocal offsetJTACPos = { x = jtacPOS.x, y = jtacPOS.y + 2.0, z = jtacPOS.z }
\t\t\t\t\t\t\t\tif land.isVisible(offsetEnemyPos, offsetJTACPos) then
\t\t\t\t\t\t\t\t\ttable.insert(visableUnits, request.enemyUnitNames[nIndex])
\t\t\t\t\t\t\t\tend
\t\t\t\t\t\t\tend
\t\t\t\t\t\tend
\t\t\t\t\tend
\t\t\t\t\ttable.insert(updateQue.que, {
\t\t\t\t\t\taction = 'LOSVISIBLEUNITS',
\t\t\t\t\t\tjtacUnitName = request.jtacUnitName,
\t\t\t\t\t\tdata = visableUnits
\t\t\t\t\t})
\t\t\t\tend
\t\t\tend
\t\t\tif request.action == "GETUNITSALIVE" then
\t\t\t\t--env.info('GET UNITS ALIVE')
\t\t\t\ttable.insert(updateQue.que, {
\t\t\t\t\taction = 'unitsAlive',
\t\t\t\t\tdata = completeAliveNames
\t\t\t\t})
\t\t\tend
\t\t\tif request.action == "SETBASEFLAGS" then
\t\t\t\t--env.info('SET BASE FLAGS')
\t\t\t\tif type(request.data) == 'table' then
\t\t\t\t\tfor rIndex = 1, #request.data do
\t\t\t\t\t\ttrigger.action.setUserFlag(request.data[rIndex].name, request.data[rIndex].side)
\t\t\t\t\tend
\t\t\t\tend
\t\t\tend
\t\t\tif request.action == "SETISOPENSLOT" then
\t\t\t\ttrigger.action.setUserFlag('isOpenSlot', request.val)
\t\t\tend
\t\t\tif request.action == "SETSIDELOCK" then
\t\t\t\t--env.info('SET SIDE LOCK')
\t\t\t\tif type(request.data) == 'table' then
\t\t\t\t\tfor rIndex = 1, #request.data do
\t\t\t\t\t\tlocal curUcid = request.data[rIndex]
\t\t\t\t\t\ttrigger.action.setUserFlag(curUcid.ucid, curUcid.val)
\t\t\t\t\tend
\t\t\t\tend
\t\t\tend
\t\t\tif request.action == "INIT" then
\t\t\t\tcompleteAliveNames = {}
\t\t\t\tupdateGroups(true)
\t\t\t\tupdateStatics(true)
\t\t\tend
\t\t\tif request.action == "CMD" and request.reqID ~= nil then
\t\t\t\tif type(request.cmd) == 'table' then
\t\t\t\t\tfor rIndex = 1, #request.cmd do
\t\t\t\t\t\t--env.info('CMD: '..request.cmd[rIndex])
\t\t\t\t\t\tpcallCommand(request.cmd[rIndex], request.reqID)
\t\t\t\t\tend
\t\t\t\tend
\t\t\tend
\t\tend
\tend

\tlog("Starting DCS unit data server")

\tlocal tcp = socket.tcp()
\ttcp:settimeout(0)
\tlocal bound, error = tcp:bind('*', PORT)
\tif not bound then
\t\tlog("Could not bind: " .. error)
\t\treturn
\tend
\tlog("Port " .. PORT .. " bound")

\tlocal serverStarted, error = tcp:listen(1)
\tif not serverStarted then
\t\tlog("Could not start server: " .. error)
\t\treturn
\tend
\tlog("Server started")

\tlocal function checkJSON(jsonstring, code)
\t\tif code == 'encode' then
\t\t\tif type(JSON:encode(jsonstring)) ~= "string" then
\t\t\t\terror("encode expects a string after function")
\t\t\tend
\t\tend
\t\tif code == 'decode' then
\t\t\tif type(jsonstring) ~= "string" then
\t\t\t\terror("decode expects string")
\t\t\tend
\t\tend
\tend

\tlocal client
\tlocal function step()
\t\tif not client then
\t\t\tclient = tcp:accept()
\t\t\ttcp:settimeout(0)

\t\t\tif client then
\t\t\t\tlog("Connection established")
\t\t\t\t--send all unit updates
\t\t\t\tcompleteAliveNames = {}
\t\t\t\tupdateGroups(true)
\t\t\t\tupdateStatics(true)
\t\t\tend
\t\tend

\t\tif client then
\t\t\tlocal line, err = client:receive('*l')
\t\t\tif line ~= nil then
\t\t\t\t--log(line)
\t\t\t\tlocal success, error = pcall(checkJSON, line, 'decode')
\t\t\t\tif success then
\t\t\t\t\tlocal incMsg = JSON:decode(line)
\t\t\t\t\trunRequest(incMsg);
\t\t\t\telse
\t\t\t\t\tlog("Error: " .. error)
\t\t\t\tend
\t\t\tend
\t\t\t-- if there was no error, send it back to the client
\t\t\tif not err then
\t\t\t\tlocal dataPayload = getDataMessage()
\t\t\t\tlocal success, error = pcall(checkJSON, dataPayload, 'encode')
\t\t\t\tif success then
\t\t\t\t\tlocal outMsg = JSON:encode(dataPayload)
\t\t\t\t\tlocal bytes, status, lastbyte = client:send(outMsg .. "\\n")
\t\t\t\t\tif not bytes then
\t\t\t\t\t\tlog("Connection lost")
\t\t\t\t\t\tclient = nil
\t\t\t\t\tend;
\t\t\t\telse
\t\t\t\t\tlog("Error: " .. error)
\t\t\t\tend
\t\t\telse
\t\t\t\tlog("Connection lost")
\t\t\t\tclient = nil
\t\t\tend
\t\tend
\tend

\ttimer.scheduleFunction(function(arg, time)
\t\tlocal success, error = pcall(step)
\t\tif not success then
\t\t\tlog("Error: " .. error)
\t\tend
\t\treturn timer.getTime() + DATA_TIMEOUT_SEC
\tend, nil, timer.getTime() + DATA_TIMEOUT_SEC)

\tfunction sendCmd (cmdObj)
\t\ttable.insert(updateQue.que, cmdObj)
\tend

\t--Protected call to command execute
\tfunction pcallCommand(s, respId)
\t\tlocal success, resp = pcall(commandExecute, s)
\t\tif success then
\t\t\tif resp ~= nil then
\t\t\t\t--local curUpdate;
\t\t\t\t--curUpdate = {
\t\t\t\t--\taction = 'CMDRESPONSE',
\t\t\t\t--\tdata = {
\t\t\t\t--\t\trespId = respId,
\t\t\t\t--\t\tcmd = s,
\t\t\t\t--\t\tresponse = resp
\t\t\t\t--\t}
\t\t\t\t--}
\t\t\t\t--table.insert(updateQue.que, curUpdate)
\t\t\tend
\t\telse
\t\t\tlog("Error: " .. resp)
\t\tend
\tend

\tfunction commandExecute(s)
\t\t--env.info(s)
\t\treturn loadstring("return " .. s)()
\tend

\t--Send Mission Events Back
\tlocal eventTypes = {
\t\t--[0] = "S_EVENT_INVALID",
\t\t--[1] = "S_EVENT_SHOT",
\t\t[2] = "S_EVENT_HIT",
\t\t[3] = "S_EVENT_TAKEOFF",
\t\t[4] = "S_EVENT_LAND",
\t\t[5] = "S_EVENT_CRASH",
\t\t[6] = "S_EVENT_EJECTION",
\t\t--[7] = "S_EVENT_REFUELING",
\t\t[8] = "S_EVENT_DEAD",
\t\t[9] = "S_EVENT_PILOT_DEAD",
\t\t--[10] = "S_EVENT_BASE_CAPTURED",
\t\t--[11] = "S_EVENT_MISSION_START",
\t\t--[12] = "S_EVENT_MISSION_END",
\t\t--[13] = "S_EVENT_TOOK_CONTROL",
\t\t--[14] = "S_EVENT_REFUELING_STOP",
\t\t[15] = "S_EVENT_BIRTH",
\t\t--[16] = "S_EVENT_HUMAN_FAILURE",
\t\t--[17] = "S_EVENT_ENGINE_STARTUP",
\t\t--[18] = "S_EVENT_ENGINE_SHUTDOWN",
\t\t[19] = "S_EVENT_PLAYER_ENTER_UNIT",
\t\t[20] = "S_EVENT_PLAYER_LEAVE_UNIT",
\t\t[21] = "S_EVENT_PLAYER_COMMENT",
\t\t--[22] = "S_EVENT_SHOOTING_START",
\t\t--[23] = "S_EVENT_SHOOTING_END",
\t\t--[24] = "S_EVENT_MAX"
\t}
\tlocal birthTypes = {
\t\t"wsBirthPlace_Air",
\t\t"wsBirthPlace_RunWay",
\t\t"wsBirthPlace_Park",
\t\t"wsBirthPlace_Heliport_Hot",
\t\t"wsBirthPlace_Heliport_Cold"
\t}

\tlocal weaponCategory = {
\t\t"SHELL",
\t\t"MISSILE",
\t\t"ROCKET",
\t\t"BOMB"
\t}


\tfunction clientEventHandler:onEvent(_event)
\t\tlocal status, err = pcall(function(_event)
\t\t\tif _event == nil or _event.initiator == nil or eventTypes[_event.id] == nil then
\t\t\t\treturn false
\t\t\telse
\t\t\t\tlocal curEvent = {}
\t\t\t\tif _event.id ~= nil then
\t\t\t\t\tcurEvent.name = eventTypes[_event.id]
\t\t\t\t\tcurEvent.arg1 = _event.id
\t\t\t\tend
\t\t\t\tif _event.time ~= nil then
\t\t\t\t\tcurEvent.arg2 = _event.time
\t\t\t\tend
\t\t\t\tif _event.initiator ~= nil then
\t\t\t\t\tlocal getIId = _event.initiator:getID()
\t\t\t\t\tif getIId ~= nil then
\t\t\t\t\t\tcurEvent.arg3 = tonumber(getIId)
\t\t\t\t\tend

\t\t\t\tend
\t\t\t\tif _event.target ~= nil then
\t\t\t\t\tlocal getTId = _event.target:getID()
\t\t\t\t\tif getTId ~= nil then
\t\t\t\t\t\tcurEvent.arg4 = tonumber(getTId)
\t\t\t\t\tend
\t\t\t\tend
\t\t\t\tif _event.place ~= nil then
\t\t\t\t\tcurEvent.arg5 = _event.place:getName()
\t\t\t\tend
\t\t\t\tif _event.subPlace ~= nil then
\t\t\t\t\tcurEvent.arg6 = birthTypes[_event.subPlace]
\t\t\t\tend
\t\t\t\tif _event.weapon ~= nil then
\t\t\t\t\tlocal curWeapon = _event.weapon:getDesc()
\t\t\t\t\tcurEvent.arg7 = {
\t\t\t\t\t\t["typeName"] = curWeapon.typeName,
\t\t\t\t\t\t["displayName"] = curWeapon.displayName,
\t\t\t\t\t\t["category"] = weaponCategory[curWeapon.category + 1]
\t\t\t\t\t}
\t\t\t\tend
\t\t\t\tif client then
\t\t\t\t\t--env.info('EVENT RUNNING')
\t\t\t\t\ttable.insert(updateQue.que, {
\t\t\t\t\t\taction = eventTypes[_event.id],
\t\t\t\t\t\tdata = curEvent
\t\t\t\t\t})
\t\t\t\t\treturn true
\t\t\t\tend
\t\t\tend
\t\tend, _event)
\t\tif (not status) then
\t\t\t--env.info(string.format("Error while handling event %s", err), false)
\t\tend
\tend
end

world.addEventHandler(clientEventHandler)
env.info("dynamicDCSTrue event handler added")
`;


run();

