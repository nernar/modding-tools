class ControlWindow extends UniqueWindow {
	override readonly TYPE: string = "ControlWindow";
	protected level?: number = 10000;
	protected orientate?: number = 2;
	protected unclose?: boolean;
	protected foregroundImage?: IDrawableJson;
	protected backgroundImage?: IDrawableJson;
	protected buttonImage?: IDrawableJson;
	protected buttonBackground?: IDrawableJson;
	protected logotypeBackground?: IDrawableJson;

	protected button: ControlFragment.Button;
	protected collapsed: ControlFragment.CollapsedButton;
	protected queued: ControlFragment.Logotype;
	protected behold: android.transition.Scene;
	protected collapse: android.transition.Scene;
	protected queue: android.transition.Scene;

	onButtonClick?: (window: ControlWindow) => void;
	onCollapsedButtonClick?: (window: ControlWindow) => void;
	onButtonHold?: (window: ControlWindow) => boolean | void;
	onCollapsedButtonHold?: (window: ControlWindow) => boolean | void;

	constructor() {
		super();
		this.setFragment(new FrameFragment());
		if (isAndroid()) {
			this.resetContent();
		}
		this.setButtonBackground("popupButton");
		this.setLogotypeBackground("popupControl");
	}
	resetContent() {
		let button = new ControlFragment.Button(),
			collapsed = new ControlFragment.CollapsedButton(),
			queued = new ControlFragment.Logotype();
		this.button = button;
		this.collapsed = collapsed;
		this.queued = queued;
		let instance = this;
		button.setOnClickListener(() => {
			instance.onButtonClick && instance.onButtonClick(instance);
			if (instance.isHideableInside()) instance.dismiss();
		});
		collapsed.setOnClickListener(() => {
			instance.onCollapsedButtonClick && instance.onCollapsedButtonClick(instance);
		});
		button.setOnHoldListener(() => {
			return (instance.onButtonHold && instance.onButtonHold(instance)) == true;
		});
		collapsed.setOnHoldListener(() => {
			return (instance.onCollapsedButtonHold && instance.onCollapsedButtonHold(instance)) == true;
		});
		let behold = this.makeScene(button.getContainer()),
			collapse = this.makeScene(collapsed.getContainer()),
			queue = this.makeScene(queued.getContainer());
		this.behold = behold;
		this.collapse = collapse;
		this.queue = queue;
		let minimize = this.getCollapseTransition();
		this.setTransition(behold, collapse, minimize);
		this.setTransition(collapse, behold, minimize);
		let transform = this.getQueueTransition();
		this.setTransition(behold, queue, transform);
		this.setTransition(collapse, queue, transform);
		let unqueue = this.getBeholdTransition();
		this.setTransition(queue, behold, unqueue);
		this.setTransition(queue, collapse, unqueue);
	}
	override getFragment() {
		return super.getFragment() as ControlFragment;
	}
	getButtonFragment() {
		return this.button || null;
	}
	getCollapsedButtonFragment() {
		return this.collapsed || null;
	}
	getButtonFragments() {
		let array: ControlFragment[] = [], button: ControlFragment;
		(button = this.getButtonFragment()) && array.push(button);
		(button = this.getCollapsedButtonFragment()) && array.push(button);
		return array;
	}
	/**
	 * @requires `isAndroid()`
	 */
	getLogotypeFragment() {
		return this.queued || null;
	}
	/**
	 * @requires `isAndroid()`
	 */
	getBeholdScene() {
		return this.behold || null;
	}
	/**
	 * @requires `isAndroid()`
	 */
	getCollapseScene() {
		return this.collapse || null;
	}
	/**
	 * @requires `isAndroid()`
	 */
	getEntranceSide() {
		return (this.gravity & $.Gravity.RIGHT) != 0 ?
			$.Gravity.RIGHT : $.Gravity.LEFT;
	}
	/**
	 * @requires `isAndroid()`
	 */
	getQueueScene() {
		return this.queue || null;
	}
	/**
	 * @requires `isAndroid()`
	 */
	makeContainerScene() {
		let fragment = this.getFragment();
		if (fragment == this.getButtonFragment()) {
			return this.getBeholdScene();
		} else if (fragment == this.getCollapsedButtonFragment()) {
			return this.getCollapseScene();
		} else if (fragment == this.getLogotypeFragment()) {
			return this.getQueueScene();
		}
		return UniqueWindow.prototype.makeContainerScene.apply(this, arguments);
	}
	/**
	 * @requires `isAndroid()`
	 */
	getButtonEnterTransition() {
		let slide = new android.transition.Slide(this.getEntranceSide());
		slide.setInterpolator(new android.view.animation.DecelerateInterpolator());
		slide.setDuration(600);
		return slide;
	}
	/**
	 * @requires `isAndroid()`
	 */
	getButtonExitTransition() {
		let actor = new android.transition.Slide(this.getEntranceSide());
		actor.setInterpolator(new android.view.animation.AccelerateInterpolator());
		actor.setDuration(400);
		return actor;
	}
	/**
	 * @requires `isAndroid()`
	 */
	getLogotypeEnterTransition() {
		let actor = new android.transition.Fade();
		actor.setInterpolator(new android.view.animation.DecelerateInterpolator());
		actor.setDuration(800);
		return actor;
	}
	/**
	 * @requires `isAndroid()`
	 */
	getLogotypeExitTransition() {
		let actor = new android.transition.Fade();
		actor.setInterpolator(new android.view.animation.AccelerateInterpolator());
		actor.setDuration(400);
		return actor;
	}
	/**
	 * @requires `isAndroid()`
	 */
	getQueueTransition() {
		let bounds = new android.transition.ChangeBounds();
		bounds.setInterpolator(new android.view.animation.AccelerateDecelerateInterpolator());
		bounds.setDuration(800);
		return bounds;
	}
	/**
	 * @requires `isAndroid()`
	 */
	getBeholdTransition() {
		let slide = this.getButtonEnterTransition();
		slide.setMode(android.transition.Slide.MODE_IN);
		return slide;
	}
	/**
	 * @requires `isAndroid()`
	 */
	getCollapseTransition() {
		let actor = new android.transition.ChangeTransform();
		actor.setInterpolator(new android.view.animation.AccelerateDecelerateInterpolator());
		actor.setDuration(600);
		return actor;
	}
	getLevel() {
		return this.level !== undefined ? this.level : 10000;
	}
	setLevel(level: number) {
		if (level == this.getLevel()) return;
		this.level = preround(level, 0);
		if (this.isOpened()) this.updateLevel();
	}
	getOrientation() {
		return this.orientate !== undefined ? this.orientate : 2;
	}
	setOrientation(orientate: number) {
		this.orientate = preround(Number(orientate), 0);
		if (this.isOpened()) this.updateProgress();
	}
	getProgress() {
		return preround(this.getLevel() / 100, 2);
	}
	setProgress(progress: number) {
		this.setLevel(Number(progress) * 100);
	}
	getImage() {
		let fragment = this.getFragment();
		if (fragment === null) return null;
		return fragment.getImage();
	}
	getForegroundImage() {
		return this.foregroundImage || null;
	}
	setForegroundImage(src: IDrawableJson) {
		this.foregroundImage = src;
		if (this.isOpened()) this.updateProgress();
	}
	getBackgroundImage() {
		return this.backgroundImage || null;
	}
	setBackgroundImage(src: IDrawableJson) {
		this.backgroundImage = src;
		if (this.isOpened()) this.updateProgress();
	}
	updateProgress(force?: boolean) {
		let fragment = this.getLogotypeFragment();
		if (fragment === null) return false;
		let drawable = ImageFactory.clipAndMerge(this.getBackgroundImage(), this.getForegroundImage(), this.getLevel(), this.getOrientation());
		fragment.setImage(drawable);
		if (drawable instanceof android.graphics.drawable.ClipDrawable) {
			if (!force) return this.updateLevel();
		}
		return true;
	}
	updateLevel() {
		let fragment = this.getLogotypeFragment();
		if (fragment === null) return false;
		if (this.getBackgroundImage() !== null && this.getForegroundImage() !== null) {
			this.updateProgress(true);
		} else if (this.getBackgroundImage() !== null) {
			fragment.setLevel(10001 - this.getLevel());
		} else {
			fragment.setLevel(this.getLevel());
		}
		return true;
	}
	setButtonImage(src: IDrawableJson) {
		let founded = this.getButtonFragments();
		for (let i = 0; i < founded.length; i++) {
			founded[i].setImage(src);
		}
		this.buttonImage = src;
	}
	getButtonImage() {
		return this.buttonImage || null;
	}
	setButtonBackground(src: IDrawableJson) {
		let founded = this.getButtonFragments();
		for (let offset = 0; offset < founded.length; offset++) {
			founded[offset].setBackground(src);
		}
		this.buttonBackground = src;
	}
	getButtonBackground() {
		return this.buttonBackground || null;
	}
	setLogotypeBackground(src: IDrawableJson) {
		let fragment = this.getLogotypeFragment();
		if (fragment === null) return;
		fragment.setBackground(src);
		this.logotypeBackground = src;
	}
	getLogotypeBackground() {
		return this.logotypeBackground || null;
	}
	setOnButtonClickListener(action?: (window: ControlWindow) => void) {
		if (typeof action != "function") {
			return delete this.onButtonClick;
		}
		this.onButtonClick = action;
		return true;
	}
	setOnCollapsedButtonClickListener(action?: (window: ControlWindow) => void) {
		if (typeof action != "function") {
			return delete this.onCollapsedButtonClick;
		}
		this.onCollapsedButtonClick = action;
		return true;
	}
	setOnButtonHoldListener(action?: (window: ControlWindow) => boolean | void) {
		if (typeof action != "function") {
			return delete this.onButtonHold;
		}
		this.onButtonHold = action;
		return true;
	}
	setOnCollapsedButtonHoldListener(action?: (window: ControlWindow) => boolean | void) {
		if (typeof action != "function") {
			return delete this.onCollapsedButtonHold;
		}
		this.onCollapsedButtonHold = action;
		return true;
	}
	isHideableInside() {
		return this.unclose !== undefined ? this.unclose : false;
	}
	setHideableInside(enabled: boolean) {
		this.unclose = !!enabled;
	}
	transformButton() {
		if (isAndroid()) {
			this.setEnterTransition(this.getButtonEnterTransition());
			this.setExitTransition(this.getButtonExitTransition());
		}
		this.setFragment(this.getButtonFragment());
	}
	transformCollapsedButton() {
		if (isAndroid()) {
			this.setEnterTransition(this.getButtonEnterTransition());
			this.setExitTransition(this.getButtonExitTransition());
		}
		this.setFragment(this.getCollapsedButtonFragment());
	}
	transformLogotype() {
		if (isAndroid()) {
			this.setEnterTransition(this.getLogotypeEnterTransition());
			this.setExitTransition(this.getLogotypeExitTransition());
		}
		this.setFragment(this.getLogotypeFragment());
	}
	override attach() {
		if (this.getBackgroundImage() != null || this.getForegroundImage() != null) {
			this.updateProgress();
		}
		return super.attach();
	}
}

namespace ControlWindow {
	export function parseJson(json: IControlWindow): ControlWindow;
	export function parseJson(instance: ControlWindow, json?: IControlWindow): ControlWindow;
	export function parseJson(instanceOrJson: ControlWindow | IControlWindow, json?: IControlWindow) {
		if (!(instanceOrJson instanceof ControlWindow)) {
			json = instanceOrJson;
			instanceOrJson = new ControlWindow();
		}
		json = calloutOrParse(this, json, instanceOrJson);
		if (json === null || typeof json != "object") {
			return instanceOrJson;
		}
		if (json.hasOwnProperty("orientation")) {
			instanceOrJson.setOrientation(calloutOrParse(json, json.orientation, [this, instanceOrJson]));
		}
		if (json.hasOwnProperty("logotypeProgress")) {
			instanceOrJson.setForegroundImage(calloutOrParse(json, json.logotypeProgress, [this, instanceOrJson]));
		}
		if (json.hasOwnProperty("logotypeOutside")) {
			instanceOrJson.setBackgroundImage(calloutOrParse(json, json.logotypeOutside, [this, instanceOrJson]));
		}
		if (json.hasOwnProperty("logotype")) {
			instanceOrJson.setButtonImage(calloutOrParse(json, json.logotype, [this, instanceOrJson]));
		}
		if (json.hasOwnProperty("buttonBackground")) {
			instanceOrJson.setButtonBackground(calloutOrParse(json, json.buttonBackground, [this, instanceOrJson]));
		}
		if (json.hasOwnProperty("logotypeBackground")) {
			instanceOrJson.setLogotypeBackground(calloutOrParse(json, json.logotypeBackground, [this, instanceOrJson]));
		}
		if (json.hasOwnProperty("buttonClick")) {
			instanceOrJson.setOnButtonClickListener(parseCallback(json, json.buttonClick, [this, instanceOrJson]));
		}
		if (json.hasOwnProperty("buttonHold")) {
			instanceOrJson.setOnButtonHoldListener(parseCallback(json, json.buttonHold, [this, instanceOrJson]));
		}
		if (json.hasOwnProperty("collapsedClick")) {
			instanceOrJson.setOnCollapsedButtonClickListener(parseCallback(json, json.collapsedClick, [this, instanceOrJson]));
		}
		if (json.hasOwnProperty("collapsedHold")) {
			instanceOrJson.setOnCollapsedButtonHoldListener(parseCallback(json, json.collapsedHold, [this, instanceOrJson]));
		}
		if (json.hasOwnProperty("hideable")) {
			instanceOrJson.setHideableInside(calloutOrParse(json, json.hideable, [this, instanceOrJson]));
		}
		return instanceOrJson;
	}
}
