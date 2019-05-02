export interface Waitable {
	wait(): Promise<void>
}

export function wait<T extends Waitable>(obj: T, predicate: (T) => Boolean, timeoutInMs = 0, timoutError = new Error("Timeout")): Promise<void> {
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

function waitLoop<T extends Waitable>(obj: T, predicate: (T) => Boolean): Promise<void> {
	if(predicate(obj)) {
		return Promise.resolve()
	} else {
		return obj.wait()
			.then(() => wait(obj, predicate))
	}
}
