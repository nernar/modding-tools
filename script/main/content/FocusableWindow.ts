class FocusableWindow {
	readonly TYPE: string = "FocusableWindow";
	popupId?: number;

	protected touchable?: boolean = true;
	protected focusable?: boolean = false;
	protected x?: number = 0;
	protected y?: number = 0;
	protected gravity?: number;
	protected width?: number;
	protected height?: number;
	protected content?: android.view.ViewGroup;
	protected fragment?: Fragment;
	protected enterTransition?: android.transition.Transition;
	protected exitTransition?: android.transition.Transition;
 
	onAttach?: () => void;
	onUpdate?: (...opts: any[]) => void;
	onClose?: () => void;

	constructor() {
		if (isAndroid()) {
			this.gravity = android.view.Gravity.NO_GRAVITY;
			this.width = android.view.ViewGroup.LayoutParams.WRAP_CONTENT;
			this.height = android.view.ViewGroup.LayoutParams.WRAP_CONTENT;
		}
		Logger.Log(this.TYPE + ".<constructor>", "FocusableWindow");
	}

	reattach() {
		this.isOpened() && this.dismiss();
		this.attach();
	}
	getContainer() {
		return this.getLayout();
	}
	getLayout() {
		if (this.content != null) {
			return this.content;
		}
		let fragment = this.getFragment();
		if (fragment != null) {
			let container = fragment.getContainer();
			if (container instanceof android.view.ViewGroup) {
				return container;
			} else if (container != null) {
				Logger.Log("Modding Tools: FocusableWindow.getLayout received " + container + " as container, but expected ViewGroup!", "WARNING");
			}
		}
		return null;
	}
	setLayout(content: android.view.ViewGroup) {
		let currently = this.getLayout();
		this.content = content;
		if (this.isOpened() && currently != this.getLayout()) {
			this.updateWindow();
		}
	}
	getFragment() {
		return this.fragment || null;
	}
	setFragment(fragment: Fragment) {
		let currently = this.getFragment();
		if (currently == fragment) {
			return;
		}
		currently != null && currently.deattach();
		this.fragment = fragment;
		fragment != null && fragment.attach(this);
		this.isOpened() && this.updateWindow();
	}
	isTouchable() {
		return this.touchable;
	}
	setTouchable(touchable: boolean) {
		this.touchable = !!touchable;
		this.isOpened() && this.updateWindow();
	}
	isFocusable() {
		return this.focusable;
	}
	setFocusable(focusable: boolean) {
		this.focusable = !!focusable;
		this.isOpened() && this.updateWindow();
	}
	isFullscreen() {
		return (this.width == android.view.ViewGroup.LayoutParams.MATCH_PARENT || this.width == getDisplayWidth()) &&
			(this.height == android.view.ViewGroup.LayoutParams.MATCH_PARENT || this.height == getDisplayHeight());
	}
	/**
	 * @requires `isAndroid()`
	 */
	getParams(flags: number) {
		let params = new android.view.WindowManager.LayoutParams(this.width, this.height, this.x, this.y, 1000, flags || WindowProvider.BASE_WINDOW_FLAGS, -3);
		return (params.gravity = this.gravity, params);
	}
	getGravity() {
		return this.gravity;
	}
	setGravity(gravity: number) {
		let currently = this.getGravity();
		this.gravity = gravity - 0;
		if (this.isOpened() && currently != this.getGravity()) {
			this.updateWindow();
		}
	}
	getX() {
		return this.x;
	}
	getY() {
		return this.y;
	}
	setX(x: number) {
		let currently = this.getX();
		this.x = x - 0;
		if (this.isOpened() && currently != this.getX()) {
			this.updateWindow();
		}
	}
	setY(y: number) {
		let currently = this.getY();
		this.y = y - 0;
		if (this.isOpened() && currently != this.getY()) {
			this.updateWindow();
		}
	}
	getWidth() {
		return this.width;
	}
	getHeight() {
		return this.height;
	}
	setWidth(width: number) {
		let currently = this.getWidth();
		this.width = width - 0;
		if (this.isOpened() && currently != this.getWidth()) {
			this.updateWindow();
		}
	}
	setHeight(height: number) {
		let currently = this.getHeight();
		this.height = height - 0;
		if (this.isOpened() && currently != this.getHeight()) {
			this.updateWindow();
		}
	}
	setOnAttachListener(listener: typeof this.onAttach) {
		if (typeof listener != "function") {
			return delete this.onAttach;
		}
		this.onAttach = listener;
		return true;
	}
	setOnUpdateListener(listener: typeof this.onUpdate) {
		if (typeof listener != "function") {
			return delete this.onUpdate;
		}
		this.onUpdate = listener;
		return true;
	}
	setOnDismissListener(listener: typeof this.onClose) {
		if (typeof listener != "function") {
			return delete this.onClose;
		}
		this.onClose = listener;
		return true;
	}
	isOpened() {
		if (isAndroid()) {
			return WindowProvider.hasOpenedPopup(this);
		}
		return ShellObserver.includes(this);
	}
	getPopup() {
		if (isAndroid()) {
			return WindowProvider.getByPopupId(this.popupId);
		}
		return ShellObserver.attachedLayers.indexOf(this);
	}
	updateWindow() {
		let fragment = this.getFragment();
		if (fragment != null && fragment.isRequiresFocusable()) {
			this.focusable = true;
		}
		if (isAndroid()) {
			WindowProvider.updateWindow(this);
		}
	}
	/**
	 * @requires `isAndroid()`
	 */
	getEnterTransition() {
		return this.enterTransition || null;
	}
	/**
	 * @requires `isAndroid()`
	 */
	setEnterTransition(actor) {
		if (isAndroid() && this.isOpened()) {
			WindowProvider.setEnterTransition(this.popupId, actor);
		}
		this.enterTransition = actor;
	}
	/**
	 * @requires `isAndroid()`
	 */
	getExitTransition() {
		return this.exitTransition || null;
	}
	/**
	 * @requires `isAndroid()`
	 */
	setExitTransition(actor) {
		if (isAndroid() && this.isOpened()) {
			WindowProvider.setExitTransition(this.popupId, actor);
		}
		this.exitTransition = actor;
	}
	attach() {
		Logger.Log(this.TYPE + ".attach", "FocusableWindow");
		if (!this.isOpened()) {
			let fragment = this.getFragment();
			if (fragment != null && fragment.isRequiresFocusable()) {
				this.focusable = true;
			}
			if (isAndroid()) {
				WindowProvider.openWindow(this);
			} else {
				ShellObserver.push(this);
			}
			this.onAttach && this.onAttach();
			return true;
		} else {
			Logger.Log("Modding Tools: Attaching window " + this.TYPE + " called on already opened window", "INFO");
		}
		return false;
	}
	update(...opts: any[]) {
		let fragment = this.getFragment();
		if (fragment != null) {
			fragment.update(...opts);
		}
		this.onUpdate && this.onUpdate(...opts);
	}
	updateWith(when?: (fragment: Fragment) => boolean, ...opts: any[]) {
		let fragment = this.getFragment();
		if (fragment != null) {
			fragment.updateWith(when, ...opts);
		}
		this.onUpdate && this.onUpdate(...opts);
	}
	dismiss() {
		Logger.Log(this.TYPE + ".dismiss", "FocusableWindow");
		if (this.isOpened()) {
			if (isAndroid()) {
				WindowProvider.closeWindow(this);
			} else {
				ShellObserver.dismiss(this);
			}
			this.onClose && this.onClose();
		} else {
			Logger.Log("Modding Tools: Dismissing window " + this.TYPE + " called on already closed window", "INFO");
		}
	}
}

namespace FocusableWindow {
	export function parseJson(json: IFocusableWindow): FocusableWindow;
	export function parseJson(instance: FocusableWindow, json: IFocusableWindow): FocusableWindow;
	export function parseJson(instanceOrJson: FocusableWindow | IFocusableWindow, json?: IFocusableWindow) {
		if (!(instanceOrJson instanceof FocusableWindow)) {
			json = instanceOrJson;
			instanceOrJson = new FocusableWindow();
		}
		json = calloutOrParse(this, json, instanceOrJson);
		if (json === null || typeof json != "object") {
			return instanceOrJson;
		}
		if (json.hasOwnProperty("touchable")) {
			instanceOrJson.setTouchable(calloutOrParse(json, json.touchable, [this, instanceOrJson]));
		}
		if (json.hasOwnProperty("focusable")) {
			instanceOrJson.setFocusable(calloutOrParse(json, json.focusable, [this, instanceOrJson]));
		}
		if (json.hasOwnProperty("gravity")) {
			instanceOrJson.setGravity(calloutOrParse(json, json.gravity, [this, instanceOrJson]));
		}
		if (json.hasOwnProperty("width")) {
			instanceOrJson.setWidth(calloutOrParse(json, json.width, [this, instanceOrJson]));
		}
		if (json.hasOwnProperty("height")) {
			instanceOrJson.setHeight(calloutOrParse(json, json.height, [this, instanceOrJson]));
		}
		if (json.hasOwnProperty("x")) {
			instanceOrJson.setX(calloutOrParse(json, json.x, [this, instanceOrJson]));
		}
		if (json.hasOwnProperty("y")) {
			instanceOrJson.setY(calloutOrParse(json, json.y, [this, instanceOrJson]));
		}
		if (json.hasOwnProperty("content")) {
			instanceOrJson.setLayout(calloutOrParse(json, json.content, [this, instanceOrJson]));
		}
		if (json.hasOwnProperty("fragment")) {
			let fragment: Fragment | IBaseFragment = calloutOrParse(json, json.fragment, [this, instanceOrJson]);
			if (fragment != null) {
				if (!(fragment instanceof Fragment)) {
					fragment = Fragment.parseJson(fragment);
				}
				instanceOrJson.setFragment(fragment);
			}
		}
		if (json.hasOwnProperty("onAttach")) {
			instanceOrJson.setOnAttachListener(parseCallback(json, json.onAttach, [this, instanceOrJson]));
		}
		if (json.hasOwnProperty("onUpdate")) {
			instanceOrJson.setOnUpdateListener(parseCallback(json, json.onUpdate, [this, instanceOrJson]));
		}
		if (json.hasOwnProperty("onDismiss")) {
			instanceOrJson.setOnDismissListener(parseCallback(json, json.onDismiss, [this, instanceOrJson]));
		}
		if (json.hasOwnProperty("enterTransition")) {
			instanceOrJson.setEnterTransition(calloutOrParse(json, json.enterTransition, [this, instanceOrJson]));
		}
		if (json.hasOwnProperty("exitTransition")) {
			instanceOrJson.setExitTransition(calloutOrParse(json, json.exitTransition, [this, instanceOrJson]));
		}
		return instanceOrJson;
	}
}

registerWindowJson("window", FocusableWindow);
registerWindowJson("focusable", FocusableWindow);
