import {Coalition, Country, Player, Server} from "./server";
import {FrontScript} from "./front-script";
import {Mission} from "./mission";
import {wait} from "./wait"
import {BackScript} from "./back-script";


let server = new Server();
let mission = new Mission();
mission.setCoalition(Country.USA, Coalition.BLUE);
mission.setCoalition(Country.RUSSIA, Coalition.RED);

server.hook = new BackScript(mission, server);

let slot1 = mission.createSlot({
	groupName: "Slot1",
	unitName: "Slot1",
	category: "HELICOPTER",
	country: Country.USA,
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

	await wait(slot1, s => !s.locked);

	player.occupy(slot1);

	console.log(`Player is on side ${player.getCoalition()}`);

	let unit = slot1.spawnUnit();

	//server.close()
})().catch(e => console.log(e))
	.then(() => {
		//server.close()
	});
