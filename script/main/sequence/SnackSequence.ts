class SnackSequence<T extends any> extends AsyncSequence<T> {
	static locks: SnackSequence<any>[];

	stacked?: SnackSequence.StackedMessage[];
	maximumStacked?: number;
	mode?: SnackSequence.Mode;
	window?: HintAlert;
	view?: android.view.ViewGroup;
	inherited?: boolean;
	requiresStartupChanging?: boolean;
	performedStartupChanging?: boolean;
	alreadyAttachedMessage?: boolean;

	message?: string;
	background?: IDrawableJson;
	color?: number;
	clippedBackground?: IDrawableJson;
	clippedForeground?: IDrawableJson;
	startupMessage?: string;
	startupBackground?: IDrawableJson;
	startupColor?: number;
	queueMessage?: string;
	interruptMessage?: string;
	queueBackground?: IDrawableJson;
	interruptBackground?: IDrawableJson;
	queueColor?: number;
	interruptColor?: number;
	completionMessage?: string;
	completionBackground?: IDrawableJson;
	completionColor?: number;

	constructor(obj?: Scriptable) {
		super(obj);
	}

	getWindow() {
		return this.window || null;
	}
	getView() {
		return this.view || null;
	}
	getStacked() {
		return this.stacked || null;
	}
	getMode() {
		return this.mode !== undefined ? this.mode : SnackSequence.Mode.INLINE;
	}
	setMode(mode?: SnackSequence.Mode) {
		if (mode !== undefined) {
			this.mode = mode;
		} else {
			delete this.mode;
		}
	}
	getStackedSize() {
		return this.maximumStacked !== undefined ? this.maximumStacked : 7;
	}
	setStackedSize(limit?: number) {
		if (limit !== undefined) {
			this.maximumStacked = limit;
		} else {
			delete this.maximumStacked;
		}
	}
	isRequiredProgress() {
		return super.isRequiredProgress() && (showHint.launchStacked === undefined || this.requiresProgress === true);
	}

	getMessage(progress: number, index: number, custom?: string) {
		let phrase = custom !== undefined ? custom : this.message !== undefined ? this.message : translate("Working");
		return this.count !== undefined ? phrase + " (" + preround(progress, 1) + "%)" : phrase;
	}
	getBackground(progress: number, index: number, custom?: IDrawableJson) {
		return custom !== undefined ? custom : this.background !== undefined ? this.background : ImageFactory.clipAndMerge(this.getClippedBackground(), this.getClippedForeground(), preround(progress * 100, 0) + 1);
	}
	getColor(progress: number, index: number, custom?: number) {
		return custom !== undefined ? custom : this.color !== undefined ? this.color : null;
	}
	getClippedBackground() {
		return this.clippedBackground !== undefined ? this.clippedBackground : "popup";
	}
	getClippedForeground() {
		return this.clippedForeground !== undefined ? this.clippedForeground : "popupSelectionSelected";
	}
	getStartupMessage(value: T, startMs: number) {
		return this.startupMessage !== undefined ? this.startupMessage : translate("Preparing");
	}
	getStartupBackground(value: T, startMs: number) {
		return this.startupBackground !== undefined ? this.startupBackground : "popupSelectionQueued";
	}
	getStartupColor(value: T, startMs: number) {
		return this.startupColor !== undefined ? this.startupColor : null;
	}
	getCancellationMessage(error?: Error) {
		if (error != null && typeof error == "object" && error.message == "java.lang.InterruptedException: null") {
			return this.queueMessage !== undefined ? this.queueMessage : translate("Interrupted");
		}
		return this.interruptMessage !== undefined ? this.interruptMessage : translate("Something happened");
	}
	getCancellationBackground(error?: Error) {
		if (error != null && typeof error == "object" && error.message == "java.lang.InterruptedException: null") {
			return this.queueBackground !== undefined ? this.queueBackground : "popupSelectionQueued";
		}
		return this.interruptBackground !== undefined ? this.interruptBackground : "popupSelectionLocked";
	}
	getCancellationColor(error?: Error) {
		if (error != null && typeof error == "object" && error.message == "java.lang.InterruptedException: null") {
			return this.queueColor !== undefined ? this.queueColor : null;
		}
		return this.interruptColor !== undefined ? this.interruptColor : $.Color.RED;
	}
	getCompletionMessage(ellapsedMs: number, startMs: number) {
		let phrase = this.completionMessage !== undefined ? this.completionMessage : translate("Completed");
		return phrase + " " + translate("as %ss", preround(ellapsedMs / 1000, 1));
	}
	getCompletionBackground(ellapsedMs: number, startMs: number) {
		return this.completionBackground !== undefined ? this.completionBackground : "popupSelectionSelected";
	}
	getCompletionColor(ellapsedMs: number, startMs: number) {
		return this.completionColor !== undefined ? this.completionColor : null;
	}

	/**
	 * @deprecated Legacy method, that will be deleted soon and remained for compatibility.
	 */
	setStartupMessage(message: string) {
		if (this.requiresStartupChanging) {
			this.change(0, 0, message);
		}
	}
	/**
	 * @deprecated Legacy method, that will be deleted soon and remained for compatibility.
	 */
	setCompletionMessage(message: string) {
		this.finish(0, 0, message);
	}
	/**
	 * @deprecated Legacy method, that will be deleted soon and remained for compatibility.
	 */
	setQueueMessage(message: string) {
		this.queueMessage = message;
	}
	/**
	 * @deprecated Legacy method, that will be deleted soon and remained for compatibility.
	 */
	setInterruptMessage(message: string) {
		this.interruptMessage = message;
	}
	/**
	 * @deprecated Legacy method, that will be deleted soon and remained for compatibility.
	 */
	setQueueBackground(background: IDrawableJson) {
		this.queueBackground = background;
	}
	/**
	 * @deprecated Legacy method, that will be deleted soon and remained for compatibility.
	 */
	setInterruptBackground(background: IDrawableJson) {
		this.interruptBackground = background;
	}
	/**
	 * @deprecated Legacy method, that will be deleted soon and remained for compatibility.
	 */
	setForeground(foreground: IDrawableJson) {
		this.clippedForeground = foreground;
	}
	/**
	 * @deprecated Legacy method, that will be deleted soon and remained for compatibility.
	 */
	setBackground(background: IDrawableJson) {
		this.clippedBackground = background;
	}
	/**
	 * @deprecated Legacy method, that will be deleted soon and remained for compatibility.
	 */
	setProgressBackground(background?: IDrawableJson, foreground?: IDrawableJson) {
		if (background !== undefined) {
			this.setBackground(background);
		}
		if (foreground !== undefined) {
			this.setForeground(foreground);
		}
	}
	/**
	 * @deprecated Legacy method, that will be deleted soon and remained for compatibility.
	 */
	setMessage(message: string) {
		this.change(0, 0, message);
	}
	/**
	 * @deprecated Legacy method, that will be deleted soon and remained for compatibility.
	 */
	prepare(message: string, color?: number) {
		this.change(0, 0, message, undefined, color);
	}
	/**
	 * @deprecated Legacy method, that will be deleted soon and remained for compatibility.
	 */
	override seek(addition: number, message?: string) {
		this.change(addition, 0, message);
	}

	override execute(value: T, snack?: HintAlert) {
		if (this.isRequiredProgress()) {
			if (snack != null) {
				this.window = snack;
			} else {
				delete this.window;
				this.inherited = true;
			}
		}
		this.stacked = [];
		this.requiresStartupChanging = true;
		super.execute(value);
	}
	override create = (value: T, startMs: number) => {
		let mode = this.getMode();
		if (this.inherited) {
			this.window = new HintAlert();
		}
		let window = this.getWindow();
		if (window != null) {
			window.setMaximumStacked(this.getStackedSize());
			window.setConsoleMode(true);
			if (mode != SnackSequence.Mode.INLINE) {
				window.setStackable(true);
			}
		}
		if (this.getView() != null && mode == SnackSequence.Mode.INLINE) {
			this.updateMessage(
				this.getStartupMessage(value, startMs),
				this.getStartupBackground(value, startMs),
				this.getStartupColor(value, startMs)
			);
		} else {
			this.attachMessage(
				this.getStartupMessage(value, startMs),
				this.getStartupBackground(value, startMs),
				this.getStartupColor(value, startMs)
			);
		}
		if (window != null) {
			if (SnackSequence.locks.indexOf(this) == -1) {
				SnackSequence.locks.push(this);
			}
			window.pin();
			window.attach();
		}
	}
	attachMessage(hint: string, background?: IDrawableJson, color?: number) {
		let window = this.getWindow();
		if (window != null) {
			if (!window.canStackedMore()) {
				window.removeFirstStacked();
			}
			this.view = window.attachMessage(hint, background, color);
		}
	}
	updateMessage(hint: string, background?: IDrawableJson, color?: number) {
		let message = this.getView();
		if (message != null) {
			let text = message.getChildAt(0);
			if (background !== undefined) {
				if (!(background instanceof Drawable)) {
					background = Drawable.parseJson.call(this, background);
				}
				background.attachAsBackground(message);
			}
			if (text instanceof android.widget.TextView) {
				hint !== undefined && (text.setText(hint));
				color !== undefined && (text.setTextColor(color));
			} else {
				Logger.Log("Modding Tools: SnackSequence.updateMessage should receive TextView as first child of window, got " + text + "!", "WARNING")
			}
		}
	}
	override update = (progress: number, index: number) => {
		let stack = this.getStacked();
		if (this.performedStartupChanging) {
			// TODO
			// this.updateMessage(
			// 	this.getStartupMessage(),
			// 	this.getStartupBackground(),
			// 	this.getStartupColor()
			// );
			delete this.performedStartupChanging;
			if (stack == null || stack.length == 0) {
				return;
			}
		}
		let mode = this.getMode();
		if (stack == null || stack.length == 0) {
			if (mode != SnackSequence.Mode.VERBOSE) {
				this.updateMessage(
					this.getMessage(progress, index),
					this.getBackground(progress, index),
					this.getColor(progress, index)
				);
			}
			return;
		}
		if (mode == SnackSequence.Mode.INLINE || (mode == SnackSequence.Mode.STACKABLE && this.alreadyAttachedMessage)) {
			let target = mode == SnackSequence.Mode.STACKABLE ? stack.length > 1 ? stack.shift() : stack[0] : stack[stack.length - 1];
			if (target != null) {
				this.require(target.index, target.count);
				this.updateMessage(
					this.getMessage(progress, index, target.hint),
					this.getBackground(progress, index, target.background),
					this.getColor(progress, index, target.color)
				);
			}
			if (stack.length <= 1 || mode == SnackSequence.Mode.INLINE) {
				return;
			}
		}
		let window = this.getWindow();
		if (window != null) {
			while (stack.length > 0) {
				let target = stack.length > 1 || mode == SnackSequence.Mode.VERBOSE ? stack.shift() : stack[stack.length - 1];
				this.require(target.index, target.count);
				this.attachMessage(
					this.getMessage(progress, index, target.hint),
					this.getBackground(progress, index, target.background),
					this.getColor(progress, index, target.color)
				);
				if (stack.length == 1 && mode == SnackSequence.Mode.STACKABLE) {
					break;
				}
			}
			this.alreadyAttachedMessage = true;
			window.attach();
		}
	}
	override section = (index: number, count: number, hint?: string, background?: IDrawableJson, color?: number) => {
		let stack = this.getStacked();
		if (stack != null) {
			if (this.getMode() == SnackSequence.Mode.INLINE) {
				if (stack.length > 0) {
					stack.splice(0, stack.length);
				}
			}
			stack.push({
				index: index || 0,
				count: count || 0,
				hint: hint,
				background: background,
				color: color
			});
			this.updated = true;
		}
		delete this.requiresStartupChanging;
	}
	override change = (index: number, count: number, hint?: string, background?: IDrawableJson, color?: number) => {
		if (this.requiresStartupChanging) {
			this.require(index, count);
			hint !== undefined && (this.startupMessage = hint);
			background !== undefined && (this.startupBackground = background);
			color !== undefined && (this.startupColor = color);
			this.performedStartupChanging = true;
			delete this.requiresStartupChanging;
		} else {
			let stack = this.getStacked();
			if (stack == null) {
				return;
			}
			let mode = this.getMode();
			if (stack.length == 0 || mode == SnackSequence.Mode.VERBOSE) {
				this.section(index, count, hint, background, color);
				return;
			}
			if (mode == SnackSequence.Mode.INLINE) {
				if (stack.length > 1) {
					stack.splice(0, stack.length - 1);
				}
			}
			let target = stack[stack.length - 1];
			if (target != null) {
				index !== undefined && (target.index += index);
				count !== undefined && (target.count += count);
				hint !== undefined && (target.hint = hint);
				background !== undefined && (target.background = background);
				color !== undefined && (target.color = color);
			}
		}
		this.updated = true;
	}
	override finish = (index: number, count: number, hint?: string, background?: IDrawableJson, color?: number) => {
		super.finish(index, count);
		hint !== undefined && (this.completionMessage = hint);
		background !== undefined && (this.completionBackground = background);
		color !== undefined && (this.completionColor = color);
	}
	override cancel = (error?: Error) => {
		if (this.getMode() == SnackSequence.Mode.INLINE) {
			this.updateMessage(
				this.getCancellationMessage(error),
				this.getCancellationBackground(error),
				this.getCancellationColor(error)
			);
		} else {
			this.attachMessage(
				this.getCancellationMessage(error),
				this.getCancellationBackground(error),
				this.getCancellationColor(error)
			);
		}
		delete this.view;
		super.cancel && super.cancel(error);
		this.requestUnpinning();
	}
	override complete = (ellapsedMs: number, startMs: number) => {
		if (this.getMode() == SnackSequence.Mode.INLINE) {
			this.updateMessage(
				this.getCompletionMessage(ellapsedMs, startMs),
				this.getCompletionBackground(ellapsedMs, startMs),
				this.getCompletionColor(ellapsedMs, startMs)
			);
		} else {
			this.attachMessage(
				this.getCompletionMessage(ellapsedMs, startMs),
				this.getCompletionBackground(ellapsedMs, startMs),
				this.getCompletionColor(ellapsedMs, startMs)
			);
		}
		delete this.view;
		this.requestUnpinning();
	}
	requestUnpinning() {
		let index = SnackSequence.locks.indexOf(this);
		if (index != -1) {
			SnackSequence.locks.splice(index, 1);
		}
		if (this.inherited) {
			let window = this.getWindow();
			if (window != null) {
				window.unpin();
			}
			delete this.inherited;
		} else if (SnackSequence.locks.length == 0) {
			let window = this.getWindow();
			if (window != null) {
				window.setMaximumStacked(HintAlert.prototype.maximumStacked);
				window.setConsoleMode(HintAlert.prototype.consoleMode);
				window.setStackable(!hintStackableDenied);
				window.unpin();
			}
		}
		delete this.requiresStartupChanging;
		delete this.alreadyAttachedMessage;
		delete this.stacked;
		delete this.window;
	}
}

namespace SnackSequence {
	export interface StackedMessage {
		index: number
		count: number
		hint: string
		background: IDrawableJson
		color: number
	}
	export enum Mode {
		INLINE = 0,
		STACKABLE = 1,
		VERBOSE = 2,
	}
}
