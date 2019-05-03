export interface Waitable {
	wait(): Promise<void>
}

export function wait<T extends Waitable>(obj: T, predicate: (T) => boolean, timeoutInMs = 0, timoutError = new Error("Timeout")): Promise<void> {
	let loop = waitLoop(obj, predicate);

	if(timeoutInMs) {
		let timeout = new Promise<void>((_, reject) => {
			setTimeout(reject, timeoutInMs, timoutError)
		});
		return Promise.race([timeout, loop])
	} else {
		return loop
	}
}

export function waitFor(timeInMs: number): Promise<void> {
	return new Promise<void>((resolve, _) => {
		setTimeout(resolve, timeInMs);
	});
}

function waitLoop<T extends Waitable>(obj: T, predicate: (T) => boolean): Promise<void> {
	if(predicate(obj)) {
		return Promise.resolve()
	} else {
		return obj.wait()
			.then(() => wait(obj, predicate))
	}
}

export class WaitPublisher implements Waitable {
	private subscribers: (() => void)[] = [];

	wait(): Promise<void> {
		return new Promise<void>((acc) => {
			this.subscribers.push(acc)
		});
	}

	notify() {
		//To avoid infinite loops when callbacks are added during processing
		let subscribers = this.subscribers;
		this.subscribers = [];

		subscribers.forEach(f => f());
	}
}
