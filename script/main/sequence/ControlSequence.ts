class ControlSequence<T extends any> extends Sequence {
	window?: Nullable<ControlWindow>;
	dismissWhenCancelled?: boolean;
	inherited?: boolean;

	constructor(obj?: T) {
		super(obj);
	}

	getWindow() {
		return this.window || null;
	}
	getForegroundImage() {
		return requireLogotype();
	}
	getBackgroundImage() {
		return requireInvertedLogotype();
	}
	getExpirationTime() {
		return 1500;
	}
	isDismissingWhenCancelled() {
		return this.dismissWhenCancelled !== undefined ? this.dismissWhenCancelled : false;
	}
	getCancellationBackground(error?: Error) {
		if (error == null || (typeof error == "object" && error.message == "java.lang.InterruptedException: null")) {
			return "popupSelectionQueued";
		}
		return "popupSelectionLocked";
	}

	override execute(value: T, control?: ControlWindow) {
		if (control != null) {
			this.window = control;
		} else {
			delete this.window;
			this.inherited = true;
		}
		super.execute(value);
	}
	override uncount = (value: T) => {
		java.lang.Thread.sleep(this.getExpirationTime());
		return this.count;
	}
	override create = (value: T, startMs: number) => {
		if (this.inherited) {
			this.window = new ControlWindow();
			this.window.setForegroundImage(this.getForegroundImage());
			this.window.setBackgroundImage(this.getBackgroundImage());
			this.window.transformLogotype();
		}
		let window = this.getWindow();
		if (window != null) {
			window.setProgress(0);
			window.attach();
		}
	}
	override update = (progress: number, index: number) => {
		let window = this.getWindow();
		if (window != null) {
			window.setProgress(progress);
		}
	}
	override complete = (ellapsedMs: number, startMs: number) => {
		this.requestDismiss();
	}
	override cancel = (error?: Error) => {
		let window = this.getWindow();
		if (window != null) {
			window.setLogotypeBackground(this.getCancellationBackground(error));
		}
		super.cancel(error);
		this.requestDismiss();
	}
	requestDismiss(milliseconds?: number) {
		handle.call(this, function () {
			if (this.inherited) {
				delete this.inherited;
			} else if (!this.isDismissingWhenCancelled() || this.isAlright()) {
				delete this.window;
				return;
			}
			this.window.dismiss();
			delete this.window;
		}, milliseconds !== undefined ? milliseconds : this.getExpirationTime() * 2);
	}
}
