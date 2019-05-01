import {Mission, UnitCallback, StaticObject, Unit, Group, CreateUnitParams} from "./mission";
import {LuaLikeServer, LuaLikeSocket, LuaRunner} from "./lua";
import {Server} from "./server";

export class FrontScript implements UnitCallback {
	private luaLikeServer: LuaLikeServer | null = null;
	private socket: LuaLikeSocket | null = null;
	private stepLoop: NodeJS.Timeout | null;
	private stepLock: boolean = false;
	private actionsToPush: OutboundAction[] = [];

	private luaRunner: LuaRunner;

	constructor(
		private mission: Mission,
		private server: Server
	) {}

	runScript() {
		this.mission.setUnitCallback(this);
		//todo extract lua context
		let luaContext = new LuaContext(this.mission, this.server);
		this.luaRunner = new LuaRunner(luaContext, luaContext);

		this.luaLikeServer = new LuaLikeServer();
		this.luaLikeServer.listen(3001, socket => {
			if(this.socket) {
				throw "Already a socket connected, the fake server can not yet handle this"
			}
			this.socket = socket;
		});

		this.stepLoop = setInterval(() => this.step(), 200)
	}

	private step() {
		if (this.stepLock) {
			return
		}

		if (this.socket == null) {
			return
		}

		this.stepLock = true;

		this.socket.nextLine()
			.then(line => {
				if (line == null) {
					this.socket = null;
					console.log("Connection closed");
					return
				}
				let inbound = JSON.parse(line) as InboundMessage;

				this.handleInbound(inbound);
				let msg = this.createOutbound();

				this.socket.write(JSON.stringify(msg) + "\n");
			})
			.then(() => {
				this.stepLock = false;
			}, err => {
				console.error("Could not handle message, socket closing", err);
				this.stepLock = false;
			});
	}

	private handleInbound(inbound: InboundMessage) {
		switch (inbound.action) {
			case "NONE":
				break;
			case "CMD":
				let commandAction = inbound as CommandAction;
				commandAction.cmd.forEach(cmd => this.executeCommand(cmd));
				break;
			case "GETUNITSALIVE":
				throw "TODO"//TODO
			case "SETISOPENSLOT":
				this.mission.openSlots();
				break;
			case "SETBASEFLAGS":
				//{
				//   "action": "SETBASEFLAGS",
				//   "data": [
				//     {
				//       "name": "Sukhumi-Babushara",
				//       "side": 2
				//     },
				//     {
				//       "name": "Carrier_East B",
				//       "side": 0
				//     }
				//   ]
				// }
				console.log("Setting base flags");
				break;
			case "SETSIDELOCK":

				//{
				//   "action": "SETSIDELOCK",
				//   "data": []
				// }
				console.log("Setting side lock");
				break;
			default:
				console.log("Unknown action " + inbound.action + ", ignoring it.");
		}
	}

	private createOutbound(): OutboundMessage {
		let now = new Date();
		let startTime = this.mission.getStartTime();
		let epoc = startTime.valueOf();
		let startAbsTime = ((startTime.getHours() * 60) + startTime.getMinutes()) * 60 + startTime.getSeconds();
		let curAbsTime = ((now.getHours() * 60) + now.getMinutes()) * 60 + now.getSeconds() + now.getMilliseconds() / 1000;
		let unitCount = this.mission.getUnitCount();

		let msg = new OutboundMessage(
			curAbsTime,
			epoc,
			this.actionsToPush,
			startAbsTime,
			unitCount
		);
		this.actionsToPush = [];

		return msg;
	}

	private executeCommand(cmd: string) {
		try {
			this.luaRunner.run(cmd)
		} catch (e) {
			console.error("Could not execute " + cmd, e)
		}
	}

	onStaticObjectCreated(staticObject: StaticObject) {
		this.actionsToPush.push(new CreateAction(new CreateStaticObjectData(
			staticObject.name,
			staticObject.name,
			staticObject.type,
			staticObject.category,
			staticObject.coalition == 0 ? 1 : staticObject.coalition,
			staticObject.country,
			0,
			0,
			[staticObject.x, staticObject.y],
			staticObject.x,
			staticObject.y
		)));

		this.actionsToPush.push(new BirthAction(new StaticBirthData()));
	}

	onUnitCreated(unit: Unit) {
		if(unit.player) {
			let now = new Date();
			let time = ((now.getHours() * 60) + now.getMinutes()) * 60 + now.getSeconds() + now.getMilliseconds() / 1000;

			this.actionsToPush.push(new PlayerEnterUnitAction(new PlayerEnterUnitData(
				time,
				unit.id
			)));
		}
		this.actionsToPush.push(new CreateAction(new CreateUnitData(
			unit.id,
			unit.group.id,
			unit.group.name,
			unit.type,
			unit.group.category,
			unit.group.coalition == 0 ? 1 : unit.group.coalition, //TODO proper concept of red, neutral, blue
			unit.group.country,
			0,
			0,
			false,//TODO
			[unit.x, unit.y],
			unit.name,
			unit.player ? unit.player.name : ""
		)));
		this.actionsToPush.push(new BirthAction(new UnitBirthData(
			unit.id
		)));
	}

	onStaticObjectDeleted(staticObject: StaticObject) {
		throw new Error("Method not implemented.");
	}

	onUnitMoved(unit: Unit) {
		throw new Error("Method not implemented.");
	}

	onUnitDeleted(unit: Unit) {
		throw new Error("Method not implemented.");
	}

	stop() {
		this.socket.close();
		this.socket = null;
		this.luaLikeServer.close();
		this.luaLikeServer = null;
		clearInterval(this.stepLoop);
		this.stepLoop = null;
	}
}

export class LuaContext {
	constructor(
		private mission: Mission,
		private server: Server
	) {}

	coalition = {
		addGroup: (coalition: number, category: string, any: any) => {
			let units = Object.values(any.units)
				.map((unit: any) => {
					return {
						name: unit.name,
						type: unit.type,
						x: unit.x,
						y: unit.y,
						player: null
					}
				});
			let group = {
				name: any.name,
				category: any.category,
				coalition: coalition,
				country: any.country,
				units: units
			};
			this.mission.createGroup(group);
		},
		addStaticObject: (coalition: number, any: any) => {
			this.mission.createStaticObject({
				name: any.name,
				category: (any.category == "Fortifications") ? "STRUCTURE" : any.category,
				coalition: coalition,
				country: any.country,
				type: any.type,
				x: any.x,
				y: any.y
			});
		}
	};

	Group = {
		Category: {
			GROUND: "GROUND"
		}
	};

	coord = {
		LLtoLO: (x: number, y: number) => {
			return {x: x, z: y}
		}
	};

	trigger = {
		action: {
			outText: (text: string, timeInSec: number) => {
				this.server.textAll(text, timeInSec);
			},
			outTextForGroup: (groupId: number, text: string, timeInSec: number) => {
				this.mission.textGroup(groupId, text, timeInSec)
			},
			markToCoalition: (markId: number, text: string, coordinate: { x: number, z: number }, coalition: number, boolean: boolean) => {

			},
			removeMark: (markId: number) => {

			},
		}
	};

	missionCommands = {
		addSubMenuForGroup: (groupId: number, text: string, path: any = {}) => {
			console.log("addSubMenuForGroup " + groupId + ", " + text + ", [" + Object.values(path) + "]");
		},
		addCommandForGroup: (groupId: number, text: string, path: any, command: (any) => void, data: any) => {
			console.log("addCommandForGroup " + groupId + ", " + text + ", [" + Object.values(path) + "]");
		},
		removeItemForGroup: (groupId: number, item: string, _: any) => {
			console.log("removeItemForGroup " + groupId + ", " + item );
		}
	};

	sendCmd = function(data: any) {
		console.log("Should send command with data " + data);
	}
}

//Inbound messages

interface InboundMessage {
	action: "CMD" | "NONE" | "GETUNITSALIVE" | "SETISOPENSLOT" | "SETBASEFLAGS" | "SETSIDELOCK" | string
}

interface CommandAction extends InboundMessage {
	cmd: string[]
}


//Outbound messages

class OutboundMessage {
	constructor(
		public curAbsTime: number,
		public epoc: number,
		public que: OutboundAction[],
		public startAbsTime: number,
		public unitCount: number
	) {
	}
}

type OutboundAction = CreateAction | PlayerEnterUnitAction | BirthAction;

class CreateAction {
	public action = "C";

	constructor(public data: CreateData) {
	}
}

type CreateData = CreateUnitData | CreateStaticObjectData;


class CreateUnitData {
	public uType = "unit";
	public speed = 0; //TODO

	constructor(
		public unitId: number,
		public groupId: number,
		public groupName: string,
		public type: string,
		public category: string,
		public coalition: number,
		public country: string,
		public alt: number,
		public hdg: number,
		public inAir: boolean,
		public lonLatLoc: number[],
		public name: string,
		public playername: string
	) {
	}
}

class CreateStaticObjectData {
	public uType = "static";

	constructor(
		public name: string,
		public groupName: string,
		public type: string,
		public category: string,
		public coalition: number,
		public country: string,
		public alt: number,
		public hdg: number,
		public lonLatLoc: number[],
		public lon: number,
		public lat: number,
	) {
	}
}
//enter - C - birth
class PlayerEnterUnitAction {
	public action = "S_EVENT_PLAYER_ENTER_UNIT";

	constructor(public data: PlayerEnterUnitData) {
	}
}

class PlayerEnterUnitData {
	public name = "S_EVENT_PLAYER_ENTER_UNIT";
	public arg1 = 19;

	constructor(
		public arg2: number, //time
		public arg3: number //unit id
	) {}
}

class BirthAction {
	public action = "S_EVENT_BIRTH";

	constructor(public data: UnitBirthData | StaticBirthData) {
	}
}

class UnitBirthData {
	public name = "S_EVENT_BIRTH";
	public arg1 = 15;
	public arg2 = 0;
	constructor(
		public arg3: number //unit id
	) {}
}
class StaticBirthData {
	public name = "S_EVENT_BIRTH";
	public arg1 = 15;
	public arg2 = 0
}
