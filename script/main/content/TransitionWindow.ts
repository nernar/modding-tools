class TransitionWindow extends FocusableWindow {
	override readonly TYPE: string = "TransitionWindow";
	protected manager: android.transition.TransitionManager;

	protected root?: android.view.ViewGroup;
	protected nothing?: android.transition.Scene;
	protected scene?: android.transition.Scene;
	protected containerOfScene?: android.view.ViewGroup;
	protected containerScene?: android.transition.Scene;

	constructor() {
		super();
		if (isAndroid()) {
			this.resetWindow();
		}
	}

	resetWindow() {
		this.manager = new android.transition.TransitionManager();
		this.root = this.makeRoot();
		this.nothing = this.makeRootScene();
	}
	setTransition(sceneFromOrTo: android.transition.Scene, actor: android.transition.Transition): void;
	setTransition(sceneFromOrTo: android.transition.Scene, scene: android.transition.Scene, actor: android.transition.Transition): void;
	/**
	 * @requires `isAndroid()`
	 */
	setTransition(sceneFromOrTo: android.transition.Scene, sceneToOrTransition: android.transition.Scene | android.transition.Transition, actor?: android.transition.Transition) {
		if (actor) {
			this.manager.setTransition(sceneFromOrTo, sceneToOrTransition as android.transition.Scene, actor);
		}
		this.manager.setTransition(sceneFromOrTo, sceneToOrTransition as android.transition.Transition);
	}
	/**
	 * @requires `isAndroid()`
	 */
	transitionTo(scene: android.transition.Scene, actor?: android.transition.Transition) {
		if (actor) {
			android.transition.TransitionManager.go(scene, actor);
		} else {
			this.manager.transitionTo(scene);
		}
		if (scene != this.getRootScene()) {
			this.scene = scene;
		} else {
			delete this.scene;
		}
	}
	beginDelayedTransition(transition: android.transition.Transition): void;
	beginDelayedTransition(container: android.view.ViewGroup, actor: android.transition.Transition): void;
	/**
	 * @requires `isAndroid()`
	 */
	beginDelayedTransition(containerOrTransition: android.view.ViewGroup | android.transition.Transition, actor?: android.transition.Transition) {
		let root = this.getContainer();
		if (root == null) return;
		android.transition.TransitionManager.beginDelayedTransition(actor ? containerOrTransition as android.view.ViewGroup : root, actor || containerOrTransition as android.transition.Transition);
	}
	/**
	 * @requires `isAndroid()`
	 */
	endTransitions(container: android.view.ViewGroup) {
		if (android.os.Build.VERSION.SDK_INT >= 23) {
			let root = this.getContainer();
			if (root == null) return;
			android.transition.TransitionManager.endTransitions(container || root);
		}
	}
	/**
	 * @requires `isAndroid()`
	 */
	makeScene(rootOrContainer: android.view.ViewGroup, container?: android.view.ViewGroup) {
		let root = this.getContainer();
		if (root == null) return null;
		return new android.transition.Scene(container ? rootOrContainer : root, container || rootOrContainer);
	}
	/**
	 * @requires `isAndroid()`
	 */
	findScene(container: android.view.ViewGroup) {
		if (android.os.Build.VERSION.SDK_INT >= 29) {
			let scene = this.getRootScene();
			if (scene == null) return null;
			// @ts-expect-error
			return scene.getCurrentScene(container);
		}
		return null;
	}
	/**
	 * @requires `isAndroid()`
	 */
	makeRoot() {
		return new FrameFragment().getContainer();
	}
	/**
	 * @requires `isAndroid()`
	 */
	makeRootScene() {
		let scene = this.getRootScene();
		if (scene === null) return scene;
		return this.makeScene(this.makeRoot());
	}
	/**
	 * @requires `isAndroid()`
	 */
	getRootScene() {
		return this.nothing || null;
	}
	/**
	 * @requires `isAndroid()`
	 */
	hasScene(scene: android.transition.Scene) {
		// @ts-expect-error
		return this.manager.hasScene(scene);
	}
	/**
	 * @requires `isAndroid()`
	 */
	getCurrentlyScene() {
		return this.scene || null;
	}
	/**
	 * @requires `isAndroid()`
	 */
	getContainerOfScene() {
		return this.containerOfScene || null;
	}
	/**
	 * @requires `isAndroid()`
	 */
	hasContainerScene() {
		return !!this.getContainerOfScene();
	}
	/**
	 * @requires `isAndroid()`
	 */
	makeContainerScene() {
		let container = this.getLayout();
		if (container === null) return null;
		let root = this.getContainer();
		if (root === null) return null;
		return this.makeScene(root, container);
	}
	/**
	 * @requires `isAndroid()`
	 */
	getContainerScene() {
		let container = this.getLayout();
		if (!this.hasContainerScene() || this.getContainerOfScene() != container) {
			this.containerScene = this.makeContainerScene();
			this.containerOfScene = container;
		}
		return this.containerScene || null;
	}
	/**
	 * @requires `isAndroid()`
	 */
	getAvailabledScene() {
		return this.getContainerScene() || this.getCurrentlyScene() || null;
	}
	/**
	 * @requires `isAndroid()`
	 */
	getCurrentlyContainer() {
		let root = this.getContainer();
		if (root !== null) {
			if (root instanceof android.view.ViewGroup) {
				if (root.getChildCount() > 0) {
					return root.getChildAt(0);
				}
			}
		}
		return null;
	}

	override getContainer() {
		return this.root || null;
	}
	override updateWindow() {
		if (this.isOpened()) {
			if (this.containerScene !== undefined) {
				if (this.getLayout() != this.getContainerOfScene()) {
					this.transitionTo(this.getAvailabledScene());
				}
			}
		}
		super.updateWindow();
	}
	override attach() {
		let availabled = this.getAvailabledScene();
		if (availabled !== null) {
			let transition = this.getEnterTransition();
			this.transitionTo(availabled, transition);
		}
		return super.attach();
	}
	override dismiss() {
		super.dismiss();
		let availabled = this.getRootScene();
		if (availabled !== null) {
			let transition = this.getExitTransition();
			this.transitionTo(availabled, transition);
		}
	}
}

namespace TransitionWindow {
	export function parseJson(json: IFocusableWindow): TransitionWindow;
	export function parseJson(instance: TransitionWindow, json: IFocusableWindow): TransitionWindow;
	export function parseJson(instanceOrJson: TransitionWindow | IFocusableWindow, json?: IFocusableWindow) {
		if (!(instanceOrJson instanceof TransitionWindow)) {
			json = instanceOrJson;
			instanceOrJson = new TransitionWindow();
		}
		instanceOrJson = FocusableWindow.parseJson.call(this, instanceOrJson, json);
		json = calloutOrParse(this, json, instanceOrJson);
		return instanceOrJson;
	}
}

registerWindowJson("transition", TransitionWindow);
