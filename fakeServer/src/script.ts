import {Mission, MissionCallback, StaticObject, Unit} from "./mission";
import {LuaLikeSocket} from "./lua";

export class Script implements MissionCallback {
	private socket: LuaLikeSocket | null = null;
	private stepLock: boolean = false;
	private actionsToPush: OutboundAction[] = [];

	constructor(private mission:Mission) {}

	runScript() {
		this.mission.setCallback(this);

		LuaLikeSocket.listen(3001, socket => {
			this.socket = socket;
		});

		setInterval(() => this.step(), 200);
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
				if(line == null) {
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
				//{
				//   "action": "SETISOPENSLOT",
				//   "val": 1
				// }
				console.log("Slots are open");
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
			this.mission.runLua(cmd)
		} catch (e) {
			console.error("Could not execute " + cmd, e)
		}
	}

	onStaticObjectAdded(staticObject: StaticObject) {
		this.actionsToPush.push(new CreateAction(new CreateStaticObjectData(
			staticObject.name,
			staticObject.name,
			staticObject.type,
			staticObject.category,
			staticObject.coalition,
			staticObject.country,
			staticObject.altitude,
			staticObject.heading,
			[staticObject.x, staticObject.y],
			staticObject.x,
			staticObject.y
		)))
	}
	onUnitAdded(unit: Unit) {
		this.actionsToPush.push(new CreateAction(new CreateUnitData(
			unit.id,
			unit.group.id,
			unit.group.name,
			unit.type,
			unit.group.category,
			unit.group.coalition, //TODO proper concept of red, neutral, blue
			unit.group.country,
			unit.altitude,
			unit.heading,
			false,//TODO
			[unit.x, unit.y],
			unit.name
		)));
	}
}

interface InboundMessage {
	action: "CMD" | "NONE" | "GETUNITSALIVE" | "SETISOPENSLOT" | "SETBASEFLAGS" | "SETSIDELOCK" | string
}

class OutboundMessage {
	constructor(
		public curAbsTime: number,
		public epoc: number,
		public que: OutboundAction[],
		public startAbsTime: number,
		public unitCount: number
	) {}
}

class CreateAction {
	public action = "C";

	constructor(public data: CreateData) {}
}

class CreateUnitData {
	public uType = "unit";
	public playername = ""; //todo
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
	) {}
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
	) {}
}

type CreateData = CreateUnitData | CreateStaticObjectData;
type OutboundAction = CreateAction;

interface CommandAction extends InboundMessage {
	cmd: string[]
}
