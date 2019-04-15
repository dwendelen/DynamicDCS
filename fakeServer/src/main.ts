import {Player, Server} from "./server";
import {Script} from "./script";
import {Mission} from "./mission";

let server = new Server();
let mission = new Mission();

let slot1 = mission.createSlot({
	groupName: "Slot1",
	unitName: "Slot1",
	coalition: 1,
	category: "HELICOPTER",
	country: "GEORGIA",
	type: "UH-1H",
	x: 4,
	y: 10
});

let script = new Script(mission, server);
mission.setScript(script);

server.start(mission);

let player = new Player(1, "Player1");
slot1.waitForUnlock()
	.then(() => {
		slot1.acceptPlayer(player);
		let unit = slot1.spawnUnit();
	});
