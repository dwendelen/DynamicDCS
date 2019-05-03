import {Mission, Slot} from "./mission";
import {BackScript} from "./back-script";
import {Waitable, WaitPublisher} from "./wait";

export class Server {
	private mission: Mission;
	public hook: BackScript | null = null;
	public players: Player[] = [];

	start(mission: Mission) {
		if (this.hook) {
			this.hook.runScript();
		}
		this.mission = mission;
		this.mission.start();
	}

	acceptPlayer(player: Player) {
		this.players.push(player);
	}

	textAll(text: string, timeInSec: number) {
		this.players.forEach(p => p.addMessage(text, timeInSec))
	}

	close() {
		this.mission.stop();
		if(this.hook) {
			this.hook.stop()
		}
	}
}

/*
"id":1,
"ipaddr":"80.201.67.38:10308",
"lang":"en",
"name":"Xtrit",
"ping":0,
"side":0,
"slot":"",
"started":false,
"ucid":"9a31c6c86fbf0f909eafd125f2e3405c"
 */


export enum Coalition {
	NEUTRAL = 0,
	RED = 1,
	BLUE = 2
}

export enum Country {
	RUSSIA = 0,
	UKRAINE = 1,
	USA = 2,
	TURKEY = 3,
	UK = 4,
	FRANCE = 5,
	GERMANY = 6,
	AGGRESSORS = 7,
	CANADA = 8,
	SPAIN = 9,
	THE_NETHERLANDS = 10,
	BELGIUM = 11,
	NORWAY = 12,
	DENMARK = 13,
	ISRAEL = 15,
	GEORGIA = 16,
	INSURGENTS = 17,
	ABKHAZIA = 18,
	SOUTH_OSETIA = 19,
	ITALY = 20,
	AUSTRALIA = 21,
	SWITZERLAND = 22,
	AUSTRIA = 23,
	BELARUS = 24,
	BULGARIA = 25,
	CHEZH_REPUBLIC = 26,
	CHINA = 27,
	CROATIA = 28,
	EGYPT = 29,
	FINLAND = 30,
	GREECE = 31,
	HUNGARY = 32,
	INDIA = 33,
	IRAN = 34,
	IRAQ = 35,
	JAPAN = 36,
	KAZAKHSTAN = 37,
	NORTH_KOREA = 38,
	PAKISTAN = 39,
	POLAND = 40,
	ROMANIA = 41,
	SAUDI_ARABIA = 42,
	SERBIA = 43,
	SLOVAKIA = 44,
	SOUTH_KOREA = 45,
	SWEDEN = 46,
	SYRIA = 47,
	YEMEN = 48,
	VIETNAM = 49,
	VENEZUELA = 50,
	TUNISIA = 51,
	THAILAND = 52,
	SUDAN = 53,
	PHILIPPINES = 54,
	MOROCCO = 55,
	MEXICO = 56,
	MALAYSIA = 57,
	LIBYA = 58,
	JORDAN = 59,
	INDONESIA = 60,
	HONDURAS = 61,
	ETHIOPIA = 62,
	CHILE = 63,
	BRAZIL = 64,
	BAHRAIN = 65,
	THIRDREICH = 66,
	YUGOSLAVIA = 67,
	USSR = 68,
	ITALIAN_SOCIAL_REPUBLIC = 69,
	ALGERIA = 70,
	KUWAIT = 71,
	QATAR = 72,
	OMAN = 73,
	UNITED_ARAB_EMIRATES = 74
}

export class Player {
	public slot: Slot | null = null;
	public messageBox = new MessageBox();
	public chatbox = new Chatbox();

	constructor(
		public id: number,
		public name: string,
		public ucid: string,
		public lang: string,
		public ipAdderess: string,
		public ping: number
	) {}

	addMessage(message: string, timeInSec: number) {
		this.messageBox.addMessage(message, timeInSec * 1000)
	}

	occupy(slot: Slot) {
		if(this.slot) {
			throw new Error("Switching slots is not yet supported")
		}
		this.slot = slot;
		try {
			slot.acceptPlayer(this);
		} catch (e) {
			this.slot = null; //old value
			throw e;
		}
	}

	getCoalition(): Coalition {
		if(this.slot) {
			return this.slot.getCoalition();
		} else {
			return Coalition.NEUTRAL;
		}
	}
}

class MessageBox implements Waitable {
	private waitPublisher = new WaitPublisher();

	public messages: string[] = [];

	public addMessage(message: string, timeInMs: number) {
		this.messages.push(message);
		setTimeout(() => {
			let idx = this.messages.indexOf(message);
			if(idx >= 0) {
				this.messages.splice(idx, 1)
			}
		}, timeInMs);
		this.waitPublisher.notify();
	}

	wait(): Promise<void> {
		return this.waitPublisher.wait();
	}
}

class Chatbox implements Waitable{
	private waitPublisher = new WaitPublisher();

	public messages: string[] = [];

	public addMessage(message: string) {
		this.messages.push(message);

		this.waitPublisher.notify();
	}

	wait(): Promise<void> {
		return this.waitPublisher.wait();
	}
}


class Aircraft {
	takeoff() {

	}

	land() {

	}

	crash() {

	}

	die() {

	}

	eject() {

	}

	letPilotDie() {

	}
}


/*
test = new test()
player = test.createPlayer()
player.joinServer()

FRONTEND
aircraft = player.spawn() //S_EVENT_BIRTH // Occurs when any object is spawned into the mission.
aircraft.takeoff() //S_EVENT_TAKEOFF // Occurs when an aircraft takes off from an airbase, farp, or ship.
aircraft.land() //S_EVENT_LAND	// Occurs when an aircraft lands at an airbase, farp or ship
aircraft.crash() //S_EVENT_CRASH // Occurs when any aircraft crashes into the ground and is completely destroyed.
aircraft.dead() //S_EVENT_DEAD // Occurs when an object is completely destroyed.
aircraft.eject() //S_EVENT_EJECTION // Occurs when a pilot ejects from an aircraft
aircraft.pilotDead() //S_EVENT_PILOT_DEAD
	// Occurs when the pilot of an aircraft is killed.
	// Can occur either if the player is alive and crashes or
	// if a weapon kills the pilot without completely destroying the plane.

aircraft1.hit(aircraft2, weapon) //S_EVENT_HIT

//S_EVENT_PLAYER_ENTER_UNIT // Occurs when any player assumes direct control of a unit.
//S_EVENT_PLAYER_LEAVE_UNIT // Occurs when any player relieves control of a unit to the AI.
//S_EVENT_REFUELING // Occurs when an aircraft connects with a tanker and begins taking on fuel.
//S_EVENT_REFUELING_STOP // Occurs when an aircraft is finished taking fuel.

//OTHER
S_EVENT_PLAYER_COMMENT

 */
