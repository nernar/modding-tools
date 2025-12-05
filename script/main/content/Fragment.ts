class Fragment {
	readonly TYPE: string;
	protected views: { [key: string]: android.view.View };
	protected container?: android.view.View;

	constructor() {
		this.views = {};
	}

	getContainer() {
		return this.container || null;
	}
	setContainerView(view: android.view.View) {
		if (!(view instanceof android.view.View)) {
			MCSystem.throwException("Modding Tools: Fragment.setContainerView accepts only instances of View, but got: " + view + "!");
		}
		this.container = view;
		return this;
	}
	getViews() {
		return this.views || null;
	}
	findViewByKey(key: string) {
		return this.views[key] || null;
	}
	/**
	 * @requires `isAndroid()`
	 */
	findViewById(id: number) {
		let container = this.getContainer();
		if (container == null) return null;
		return container.findViewById(id) || null;
	}
	/**
	 * @requires `isAndroid()`
	 */
	findViewByTag(tag: any) {
		let container = this.getContainer();
		if (container == null) return null;
		return container.findViewWithTag(tag) || null;
	}
	findView(stroke: any) {
		let byKey = this.findViewByKey(stroke);
		if (isAndroid()) {
			return byKey || this.findViewById(stroke) || this.findViewByTag(stroke);
		}
		return byKey;
	}

	protected parent?: Fragment | FocusableWindow;
	getParent() {
		return this.parent || null;
	}
	getIndex() {
		let parent = this.getParent();
		if (parent && parent instanceof LayoutFragment) {
			return parent.indexOf(this);
		}
		return -1;
	}
	getWindow() {
		let fragment = this.getParent();
		while (fragment && fragment instanceof Fragment) {
			fragment = fragment.getParent();
		}
		return fragment;
	}

	protected token?: string;
	getToken() {
		return this.token || null;
	}
	setToken(token: string) {
		if (token != null) {
			this.token = token;
		} else {
			delete this.token;
		}
		return this;
	}
	findParentFragment(token: string) {
		let parent = this.getParent();
		if (parent instanceof Fragment) {
			if (parent.getToken() == token) {
				return parent;
			}
			return parent.findParentFragment(token);
		}
		return null;
	}
	findFragmentInParent(token: string) {
		let parent = this.getParent();
		if (parent instanceof Fragment) {
			if (parent instanceof LayoutFragment) {
				let fragment = parent.findFragment(token);
				if (fragment != null) {
					return fragment;
				}
			}
			return parent.findFragmentInParent(token);
		}
		return null;
	}
	findFragment(token: any) {
		throw new Error("Method not implemented.");
	}

	protected onAttach?: () => void;
	protected onDeattach?: () => void;
	attach(parent: Fragment | FocusableWindow) {
		if (parent == null || parent == this.parent) {
			if (parent == null) {
				MCSystem.throwException("Modding Tools: Fragment.attach(*) was called with an invalid parent: " + parent);
			}
			return;
		}
		this.parent = parent;
		this.onAttach && this.onAttach();
	}
	setOnAttachListener(listener: () => void) {
		if (listener != null) {
			this.onAttach = listener;
		} else {
			delete this.onAttach;
		}
		return this;
	}
	deattach() {
		if (this.parent != null) {
			this.onDeattach && this.onDeattach();
		}
		delete this.parent;
	}
	setOnDeattachListener(listener: () => void) {
		if (listener != null) {
			this.onDeattach = listener;
		} else {
			delete this.onDeattach;
		}
		return this;
	}

	protected onUpdate?: (...opts: any[]) => void;
	updateFragment?: (...opts: any[]) => void;
	update(...opts: any[]) {
		this.updateFragment && this.updateFragment(...opts);
		this.onUpdate && this.onUpdate(...opts);
	}
	updateWith(when?: (fragment: Fragment) => boolean, ...opts: any[]) {
		if (typeof when != "function" || when(this)) {
			this.update(...opts);
		}
	}
	setOnUpdateListener(listener: (...opts: any[]) => void) {
		if (listener != null) {
			this.onUpdate = listener;
		} else {
			delete this.onUpdate;
		}
		return this;
	}

	protected selectable: boolean = false;
	isSelectable() {
		return this.selectable;
	}
	setIsSelectable(selectable: boolean) {
		this.selectable = !!selectable;
		return this;
	}

	/**
	 * @requires `isAndroid()`
	 */
	isRequiresFocusable() {
		return false;
	}
	/**
	 * @requires `isCLI()`
	 */
	draw(hovered: boolean) {
		return "";
	}
	/**
	 * @requires `isCLI()`
	 */
	observe(keys: number[]) {
		return false;
	}

	protected hoverable: boolean = true;
	/**
	 * @requires `isCLI()`
	 */
	isHoverable() {
		return this.hoverable;
	}
	/**
	 * @requires `isCLI()`
	 */
	setIsHoverable(hoverable: boolean) {
		this.hoverable = !!hoverable;
		return this;
	}
	/**
	 * @requires `isCLI()`
	 */
	hover() {
		return this.isHoverable();
	}
}

namespace Fragment {
	export function parseJson(json: IBaseFragment): Fragment;
	export function parseJson(instance: Fragment, json: IBaseFragment, preferredFragment?: string): Fragment;
	export function parseJson(instanceOrJson: Fragment | IBaseFragment, json?: IBaseFragment, preferredFragment?: string): Fragment {
		MCSystem.throwException("Modding Tools: Internal exception in Fragment.parseJson!");
	}
}

const registerFragmentJson = (function() {
	let fragments = {};

	Fragment.parseJson = function(instanceOrJson: Fragment | IBaseFragment, json?: IBaseFragment, preferredFragment?: string) {
		if (!(instanceOrJson instanceof Fragment)) {
			json = instanceOrJson;
			instanceOrJson = null;
		}
		if (json != null && typeof json == "object" && json.type != null) {
			preferredFragment = json.type;
		}
		if (preferredFragment == null || !fragments.hasOwnProperty(preferredFragment)) {
			Logger.Log("Modding Tools: Unresolved fragment " + JSON.stringify(preferredFragment) + ", please make sure that \"type\" property is used anywhere...", "WARNING");
			return instanceOrJson;
		}
		return fragments[preferredFragment].parseJson.call(this, instanceOrJson || new fragments[preferredFragment](), json);
	};

	return function(id: string, fragment: any) {
		if (fragments.hasOwnProperty(id)) {
			Logger.Log("Modding Tools: Fragment json " + JSON.stringify(id) + " is already occupied!", "WARNING");
			return false;
		}
		if (typeof fragment != "function" || !(fragment.prototype instanceof Fragment)) {
			Logger.Log("Modding Tools: Passed fragment " + fragment + " for json " + JSON.stringify(id) + " must contain prototype of Fragment!", "WARNING");
			return false;
		}
		if (typeof fragment.parseJson != "function") {
			Logger.Log("Modding Tools: Nothing to call by parseJson, please consider that your fragment contains required json property!", "WARNING");
			return false;
		}
		fragments[id] = fragment;
		return true;
	};
})();
