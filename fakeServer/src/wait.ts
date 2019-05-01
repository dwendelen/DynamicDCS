export interface Waitable {
	wait(): Promise<void>
}

export function wait<T extends Waitable>(obj: T, predicate: (T) => Boolean): Promise<void> {
	if(predicate(obj)) {
		return Promise.resolve()
	} else {
		return obj.wait()
			.then(() => wait(obj, predicate))
	}
}
