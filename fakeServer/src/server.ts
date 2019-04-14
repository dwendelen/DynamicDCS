import {Mission} from "./mission";
import {Script} from "./script";

export class Server {
	private mission: Mission | null;

	start() {
		this.mission = new Mission();
		let script = new Script(this.mission);

		this.mission.start();
		script.runScript();
	}

	createPlayer(id: number, name: String): Player {
		return new Player()
	}
}

class Player {
	private messages: string[] = [];

	addMessage(message: string) {
		this.messages.push(message)
	}

	spawn(): Aircraft {
		return new Aircraft()
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
