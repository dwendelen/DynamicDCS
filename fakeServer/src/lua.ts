import * as luaparse from 'luaparse';
import {Server, Socket} from "net";
import * as net from "net";

export class LuaRunner {
	constructor(private context: any, private bind:any = null) {
	}

	run(command: string) {
		let parsed = luaparse.parse(command);
		this.exec(parsed)
	}

	private exec(ast: any): any {
		switch (ast.type) {
			case "Chunk":
				return this.execChuck(ast);
			case "CallStatement":
				return this.execCallStatement(ast);
			case "CallExpression":
				return this.execCallExpression(ast);
			case "MemberExpression":
				return this.execMemberExpression(ast);
			case "Identifier":
				return this.execIdentifier(ast);
			case "NumericLiteral":
				return this.execNumericLiteral(ast);
			case "TableConstructorExpression":
				return this.execTableConstructorExpression(ast);
			case "BooleanLiteral":
				return this.execBooleanLiteral(ast);
			case "StringLiteral":
				return this.execStringLiteral(ast);
			default:
				throw "Unknown type " + ast.type;
		}
	}

	private execChuck(ast: any) {
		ast.body.forEach(a => {
			this.exec(a);
		});
	}

	private execCallStatement(ast: any) {
		this.exec(ast.expression);
	}

	private execCallExpression(ast: any) {
		let base = this.exec(ast.base);
		let args = ast.arguments.map(arg => this.exec(arg));

		return base.apply(this.bind, args);
	}

	private execMemberExpression(ast: any) {
		let base = this.exec(ast.base);
		let val = base[ast.identifier.name];
		if(typeof val === "undefined") {
			throw "Unknown member " + ast.identifier.name;
		}
		return val;
	}

	private execIdentifier(ast: any) {
		let val = this.context[ast.name];
		if(typeof val === "undefined") {
			throw "Unknown identifier " + ast.name;
		}
		return val;
	}

	private execNumericLiteral(ast: any) {
		return ast.value;
	}

	private execTableConstructorExpression(ast: any) {
		let result = {};
		let i = 0;

		ast.fields.forEach(field => {
			let key;
			if(typeof field.key === "undefined") {
				key = i;
				i++;
			} else {
				key = this.exec(field.key);
			}
			let val = this.exec(field.value);

			result[key] = val;
		});

		return result;
	}

	private execStringLiteral(ast: any) {
		return ast.value;
	}

	private execBooleanLiteral(ast: any) {
		return ast.value;
	}
}

export class LuaLikeServer {
	private server: Server | null = null;

	listen(port: number, onNewSocket:(LuaLikeSocket) => void) {
		if(this.server) {
			throw new Error("Can not listen to the server twice")
		}

		this.server = net.createServer(socket => {
			onNewSocket(new LuaLikeSocket(socket))
		});
		this.server.listen(port);
	}

	close() {
		if(this.server) {
			this.server.close();
			this.server = null;
		}
	}
}

export class LuaLikeSocket {
	private readBuffer: string = '';
	private readCallback: (string) => void | null = null;
	private open = true;

	constructor(private socket: Socket) {
		socket.setEncoding("UTF8");
		socket.on('data', (data: String) => {
			this.readBuffer = this.readBuffer + data;
			this.checkBuffer()
		});
		socket.on('error', err => {
			console.error("Socket error", err);
		});
		socket.on('close', data => {
			this.open = false;
			if(this.readCallback) {
				this.readCallback(null);
				this.readCallback = null;
			}
		});
	}

	nextLine(): Promise<string | null> {
		if(!this.open) {
			return Promise.resolve(null)
		}

		let promise = new Promise<string>((res, rej) => {
			if(this.readCallback) {
				rej("Already waiting for a line");
			}
			this.readCallback = res;
		});
		this.checkBuffer();
		return promise;
	}

	write(data: string) {
		console.log(">>  " + data);
		this.socket.write(data)
	}

	private checkBuffer() {
		if(!this.readCallback) {
			return
		}

		let idx = this.readBuffer.indexOf('\n');
		if(idx !== -1) {
			let line = this.readBuffer.substr(0, idx);
			console.log("<<  " + line);
			this.readCallback(line);
			this.readCallback = null;

			this.readBuffer = this.readBuffer.substr(idx + 1);
		}
	}

	close() {
		this.socket.end()
	}
}
