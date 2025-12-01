class AsyncSequence<T extends any> extends Sequence {
	requiresProgress?: boolean;

	constructor(obj?: Scriptable) {
		super(obj);
	}

	access(script: string, value?: T) {
		return UNWRAP("sequence/" + script, this, {
			TARGET: value,
			// DEPRECATED: Legacy variable, that will be deleted soon and remained for compatibility.
			INSTANCE: Object.getPrototypeOf(this),
			// DEPRECATED: Legacy variable, that will be deleted soon and remained for compatibility.
			SELF: this
		});
	}
	isRequiredProgress() {
		return showProcesses && this.requiresProgress !== false;
	}
	setIsRequiredProgress(requires: boolean) {
		if (requires !== undefined) {
			this.requiresProgress = requires;
		} else {
			delete this.requiresProgress;
		}
	}

	section(index: number, count: number) {
		this.require(index, count);
	}
	change(index: number, count: number) {
		this.require(index, count);
	}
	finish(index: number, count: number) {
		this.require(index, count);
	}

	/**
	 * @deprecated Legacy method, that will be deleted soon and remained for compatibility.
	 */
	encount(count: number) {
		this.setFixedCount(count);
	}
	/**
	 * @deprecated Legacy method, that will be deleted soon and remained for compatibility.
	 */
	seek(addition: number) {
		if (addition !== undefined) {
			this.require(this.index + addition);
		}
	}
	/**
	 * @deprecated Legacy method, that will be deleted soon and remained for compatibility.
	 */
	sleep(ms: number) {
		java.lang.Thread.sleep(ms);
	}

	static access<T extends any>(script: string, what?: T, then?: (result: RunInScopeResult) => void, sequence?: AsyncSequence<T>) {
		if (!(sequence instanceof AsyncSequence)) {
			sequence = new AsyncSequence();
		}
		let evaluated = false;
		sequence.process = (element: any, value: T, index: number) => {
			if (evaluated) {
				MCSystem.throwException("Modding Tools: Invalid sequence length: " + index + ".." + sequence.getFixedCount());
			}
			let result = sequence.access(script, value);
			then && then(result);
			evaluated = true;
			return sequence.getFixedCount();
		};
		sequence.execute(what);
		return sequence;
	}
}
