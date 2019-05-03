import {FrontScript} from "./front-script";
import {Coalition, Country, Player} from "./server";
import {WaitPublisher} from "./wait";

export class Mission {
	private startTime: Date;
	private script: FrontScript | null;

	private nextId = 1000001;
	public groups: Group[] = [];
	public staticObjects: StaticObject[] = [];
	private slots: Slot[] = [];

	private unitCallback: UnitCallback = {
		onStaticObjectCreated (_) {},
		onStaticObjectDeleted(_) {},
		onUnitCreated (_)  {},
		onUnitMoved(_) {},
		onUnitDeleted(_) {},
	};

	setScript(value: FrontScript) {
		this.script = value;
	}

	start() {
		this.startTime = new Date();
		if(this.script) {
			this.script.runScript();
		}
	}

	createSlot(params: CreateSlotParams): Slot {
		let slot = new Slot(
			this,
			params.groupName,
			params.unitName,
			params.category,
			params.country,
			params.type,
			params.x,
			params.y
		);

		this.slots.push(slot);

		return slot;
	}

	createStaticObject(data: CreateStaticObjectParams): StaticObject {
		let staticObject = new StaticObject(
			data.name,
			data.category,
			data.country,
			data.type,
			data.x,
			data.y
		);

		this.staticObjects.push(staticObject);
		this.unitCallback.onStaticObjectCreated(staticObject);

		return staticObject;
	}

	createGroup(data: CreateGroupParams): Group {
		let newGroup = new Group(
			this.nextId++,
			data.name,
			data.category,
			data.country
		);
		data.units.forEach(unitData => {
			let newUnit = new Unit(
				newGroup,
				this.nextId++,
				unitData.name,
				unitData.type,
				unitData.x,
				unitData.y,
				unitData.player
			);
			newGroup.addUnit(newUnit)
		});

		this.groups.push(newGroup);
		newGroup.units.forEach(unit => {
			this.unitCallback.onUnitCreated(unit)
		});

		return newGroup;
	}

	setUnitCallback(callback: UnitCallback) {
		this.unitCallback = callback;
	}

	getStartTime(): Date {
		return this.startTime;
	}

	getUnitCount() {
		let nbOfGroupUnits = this.groups
			.map(g => g.units)
			.reduce((sum, units) => sum + units.length, 0);

		return this.staticObjects.length + nbOfGroupUnits;
	}

	openSlots() {
		this.slots.forEach(s => s.unlock());
	}

	textGroup(groupId: number, text: string, timeInSec: number) {
		this.groups
			.filter(g => g.id == groupId)
			.forEach(g => g.textUnits(text, timeInSec))
	}

	stop() {
		if(this.script) {
			this.script.stop();
		}
	}

	private coalitionByCountry: {[index: number]: Coalition} = {};

	getCoalition(country: Country): Coalition {
		return this.coalitionByCountry[country] || Coalition.NEUTRAL;
	}

	setCoalition(country: Country, coalition: Coalition) {
		this.coalitionByCountry[country] = coalition;
	}
}

export interface CreateGroupParams {
	name: string
	category: string
	country: Country
	units: CreateUnitParams[]
}

export interface CreateUnitParams {
	name: string
	type: string
	x: number
	y: number
	player: Player
}

export interface CreateStaticObjectParams {
	name: string
	category: string
	country: Country
	type: string
	x: number
	y: number
}

export interface UnitCallback {
	onStaticObjectCreated(staticObject: StaticObject);
	onStaticObjectDeleted(staticObject: StaticObject);
	onUnitCreated(unit: Unit);
	onUnitMoved(unit: Unit);
	onUnitDeleted(unit: Unit);
}

export class StaticObject {
	constructor(
		public name: string,
		public category: string,
		public country: Country,
		public type: string,
		public x: number,
		public y: number,
	){}
}

export class Group {
	public units: Unit[] = [];

	constructor(
		public id: number,
		public name: string,
		public category: string,
		public country: Country,
	) {}

	addUnit(unit: Unit) {
		this.units.push(unit)
	}

	textUnits(text: string, timeInSec: number) {
		this.units.forEach(u => u.textPlayer(text, timeInSec))
	}
}

export class Unit {
	constructor(
		public group: Group,
		public id: number,
		public name: string,
		public type: string,
		public x: number,
		public y: number,
		public player: Player | null
){}

	textPlayer(text: string, timeInSec: number) {
		if(this.player) {
			this.player.addMessage(text, timeInSec)
		}
	}

	acceptPlayer(player: Player) {
		if(this.player) {
			throw new Error("This unit is already occupied");
		}
		this.player = player;
	}
}

interface CreateSlotParams {
	groupName: string
	unitName: string
	category: string
	country: Country
	type: string
	x: number
	y: number
}

export class Slot {
	public player: Player | null;
	public locked = true;
	public unit: Unit | null;

	private waitPublisher = new WaitPublisher();

	constructor(
		public mission: Mission,
		public groupName: string,
		public unitName: string,
		public category: string,
		public country: Country,
		public type: string,
		public x: number,
		public y: number
	) {}

	acceptPlayer(player: Player) {
		if(this.player) {
			throw new Error("This slot is already occupied");
		}
		if(this.locked) {
			throw new Error("This slot is locked");
		}
		if(player.slot != this) {
			throw new Error("Wrong order, use player.occupySlot()")
		}
		this.player = player;
		this.waitPublisher.notify();
	}

	unlock() {
		this.locked = false;
		this.waitPublisher.notify();
	}

	spawnUnit(): Unit {
		if(this.unit) {
			throw new Error("There is already a unit for this slot");
		}

		let group = this.mission.createGroup({
				name: this.groupName,
				category: this.category,
				country: this.country,
				units: [{
					name: this.unitName,
					type: this.type,
					x: this.x,
					y: this.y,
					player: this.player
				}]
			});
		let unit = group.units[0];

		this.unit = unit;
		this.waitPublisher.notify();
		return unit;
	}


	wait(): Promise<void> {
		return this.waitPublisher.wait();
	}

	getCoalition(): Coalition {
		return this.mission.getCoalition(this.country);
	}
}


