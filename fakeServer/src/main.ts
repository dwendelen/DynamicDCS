import {Server} from "./server";


let server = new Server();
server.start();
let player = server.createPlayer(2, "bla");
let aircraft = player.spawn();
aircraft.takeoff();
