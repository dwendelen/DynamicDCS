import {LuaLikeServer, LuaLikeSocket, LuaRunner} from "./lua";
import {LuaContext} from "./front-script";
import {Mission} from "./mission";
import {Server} from "./server";

export class BackScript {
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
		//todo extract lua context
		let luaContext = new LuaContext(this.mission, this.server);
		this.luaRunner = new LuaRunner(luaContext, luaContext);

		this.luaLikeServer = new LuaLikeServer();
		this.luaLikeServer.listen(3002, socket => {
			if(this.socket) {
				throw "Already a socket connected, the fake server can not yet handle this"
			}
			this.socket = socket;
		});

		this.stepLoop = setInterval(() => this.step(), 1000)
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

	private createOutbound(): OutboundMessage {
		let playerData = this.server.players.map(p => {
			return new PlayersData(
				p.id,
				p.ipAdderess,
				p.lang,
				p.name,
				p.ping,
				0,// todo get side
				"",//todo fix slot
				p.ucid
			)
		});
		this.actionsToPush.push(new PlayersAction(playerData));
		let msg = new OutboundMessage(
			this.actionsToPush
		);
		this.actionsToPush = [];

		return msg;
	}

	private handleInbound(inbound: InboundMessage) {
		switch (inbound.action) {
			case "NONE":
				break;
			default:
				console.log("Unknown action " + inbound.action + ", ignoring it.");
		}
	}

	stop() {
		if(this.socket) {
			this.socket.close();
			this.socket = null;
		}
		if(this.luaLikeServer) {
			this.luaLikeServer.close();
			this.luaLikeServer = null;
		}
		clearInterval(this.stepLoop);
		this.stepLoop = null;
	}
}

//Inbound messages

interface InboundMessage {
	action:  "NONE" | string
}

//Outbound messages

class OutboundMessage {
	constructor(
		public que: OutboundAction[]
	) {
	}
}

type OutboundAction = MissionAction | PlayersAction;

class PlayersAction {
	public action = "players";

	constructor(
		public data: PlayersData[]
	) {}
}

class PlayersData {
	public started = true;

	constructor(
		public id: number,
		public ipaddr: string,//"80.183.67.38:10308"
		public lang: string,//"en"
		public name: string,//"Xtrit"
		public ping: number,
		public side: number,//0 = spectator, 1 = red, 2 = blue
		public slot: string,//"12910" (unit id, it seems)
		public ucid: string //"8f37c6976abc0f1098efd1fe421940dc"
	){}
}

class MissionAction {
	public action = "mission";

	constructor(
		public data: string //"C:\\Users\\....\\DynamicDCS\\devEnvironment\\Missions\\DDCSExample-CA-0.01_Run_Day.miz"}]
	) {}
}

class ChangeSlotAction {
	public action = "change_slot";

	constructor(
		public data: ChangeSlotData
	) {}
}

class ChangeSlotData {
	public name = "change_slot";

	constructor(
		arg1: number, //player_id
		arg2: string, //slotId
		arg3: number //prevSide
	) {}
}
