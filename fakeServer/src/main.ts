import {Player, Server} from "./server";
import {FrontScript} from "./front-script";
import {Mission} from "./mission";
import {wait} from "./wait"
import {BackScript} from "./back-script";


let server = new Server();
let mission = new Mission();
server.hook = new BackScript(mission, server);

let slot1 = mission.createSlot({
	groupName: "Slot1",
	unitName: "Slot1",
	coalition: 2,
	category: "HELICOPTER",
	country: "GEORGIA",
	type: "UH-1H",
	x: 4,
	y: 10
});

let script = new FrontScript(mission, server);
mission.setScript(script);

let player = new Player(
	1,
	"Player1",
	"11111111111111111111111111111111",
	"en",
	"1.1.1.1:1111",
	1
);

(async () => {
	server.start(mission);
	server.acceptPlayer(player);

	await wait(slot1, _ => false, 30000);

	slot1.acceptPlayer(player);
	let unit = slot1.spawnUnit();

	//server.close()
})().catch(e => console.log(e))
	.then(() => server.close());
