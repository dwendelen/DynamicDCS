import {LuaRunner} from "./lua";

export class Mission {
	private startTime: Date;

	private nextId = 1000001;
	private groups: Group[] = [];
	private staticObjects: StaticObject[] = [];

	start() {
		this.startTime = new Date();
	}

	public callback: MissionCallback = {
		onStaticObjectAdded: _ =>  {},
		onUnitAdded: _ =>  {}
	};

	private addStaticObject(staticObject: StaticObject) {
		this.staticObjects.push(staticObject);
		this.callback.onStaticObjectAdded(staticObject);
	}

	private addGroup(group: Group) {
		this.groups.push(group);
		group.units.forEach(unit => {
			this.callback.onUnitAdded(unit)
		});
	}

	setCallback(callback: MissionCallback) {
		this.callback = callback;
	}

	runLua(code: string) {
		this.luaRunner.run(code)
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

	private luaRunner = new LuaRunner({
		coalition: {
			addGroup: (coalition: number, category: string, any: any) => {
				console.log("Add group " + coalition + " " + category + " " + any.name);
				let newGroup = new Group(
					this.nextId++,
					any.name,
					(any.category == "Fortifications") ? "STRUCTURE" : any.category,
					coalition == 0 ? 1 : coalition,
					any.country
				);
				Object.values(any.units).forEach((unit: any) => {
					let newUnit = new Unit(
						newGroup,
						this.nextId++,
						unit.name,
						unit.type,
						0,
						unit.heading,
						unit.x,
						unit.y
					);
					newGroup.addUnit(newUnit);
				});

				this.addGroup(newGroup)
			},
			addStaticObject: (coalition: number, any: any) => {
				console.log("Add static group " + coalition + " " + any.name)
				let newObject = new StaticObject(
					any.name,
					(any.category == "Fortifications") ? "STRUCTURE" : any.category,
					coalition == 0 ? 1 : coalition,
					any.country,
					any.type,
					0,
					any.heading,
					any.x,
					any.y
				);
				this.addStaticObject(newObject);
			}
		},
		Group: {
			Category: {
				GROUND: "GROUND"
			}
		},
		coord: {
			LLtoLO: (x: number, y: number) => {
				return {x: x, z: y}
			}
		},
		trigger: {
			action: {
				outText: (text: string, timeInSec: number) => {
					console.log("Text " + text + " num " + timeInSec)
				},
				outTextForGroup: (groupId: number, text: string, timeInSec: number) => {

				},
				markToCoalition: (markId: number, text: string, coordinate: { x: number, z: number }, coalition: number, boolean: boolean) => {

				},
				removeMark: (markId: number) => {

				},
			}
		},
		missionCommands: {
			addSubMenuForGroup: (groupId: number, text: string, path: any = {}) => {

			},
			addCommandForGroup: (groupId: number, text: string, path: any, command: (any) => void, data: any) => {

			},
			removeItemForGroup: (groupId: number, item: string, _: any) => {

			}
		}
	}, this);

}

export interface MissionCallback {
	onStaticObjectAdded(staticObject: StaticObject);
	onUnitAdded(unit: Unit);
}

export class StaticObject {
	constructor(
		public name: string,
		public category: string,
		public coalition: number,
		public country: string,
		public type: string,
		public altitude: number,
		public heading: number,
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
		public coalition: number,
		public country: string,
	) {}

	addUnit(unit: Unit) {
		this.units.push(unit)
	}
}

export class Unit {
	constructor(
		public group: Group,
		public id: number,
		public name: string,
		public type: string,
		public altitude: number,
		public heading: number,
		public x: number,
		public y: number
	){}
}
