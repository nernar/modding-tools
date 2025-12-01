/**
 * @requires `isAndroid()`
 */
class FocusablePopup extends TransitionWindow {
	override readonly TYPE: string = "FocusablePopup";
	protected id?: string;
	protected mayDismissed?: boolean = true
	protected fragments?: Fragment[];

	constructor(id?: string) {
		super();
		this.fragments = [];

		if (id !== undefined) {
			this.setId(id);
		}
	}

	override resetWindow() {
		super.resetWindow();
		this.setFragment(new FocusableFragment());

		let fadeIn = new android.transition.Fade(), fadeOut = new android.transition.Fade();
		fadeIn.setInterpolator(new android.view.animation.DecelerateInterpolator());
		fadeIn.setDuration(400);
		this.setEnterTransition(fadeIn);
		fadeOut.setInterpolator(new android.view.animation.AccelerateDecelerateInterpolator());
		fadeOut.setDuration(400);
		this.setExitTransition(fadeOut);

		let place = Popups.getAvailablePlace();
		if (place != null) {
			this.setX(place.x);
			this.setY(place.y);
		}
		this.setGravity(android.view.Gravity.LEFT | android.view.Gravity.TOP);
	}
	override getFragment(): LayoutFragment {
		return super.getFragment() as LayoutFragment;
	}
	override setFragment(fragment: Fragment): void {
		if (!(fragment instanceof LayoutFragment)) {
			MCSystem.throwException("Modding Tools: FocusablePopup.setFragment requires LayoutFragment instance, got " + (fragment != null ? fragment.TYPE : null) + "!");
		}
		super.setFragment(fragment);
	}

	isMayDismissed() {
		return this.mayDismissed;
	}
	setIsMayDismissed(enabled: boolean) {
		this.mayDismissed = !!enabled;
	}
	getId() {
		return this.id || null;
	}
	setId(id: string) {
		this.id = "" + id;
	}
	addFragment(fragment: Fragment, params?: android.view.ViewGroup.LayoutParams) {
		return this.getFragment().addFragment(fragment, params);
	}
	getFragmentCount() {
		return this.getFragment().getFragmentCount();
	}
	indexOf(fragmentOrView: Fragment | android.view.View) {
		return this.getFragment().indexOf(fragmentOrView);
	}
	getFragmentAt(index: number) {
		return this.getFragment().getFragmentAt(index);
	}
	removeFragment(indexOrFragment: number | Fragment) {
		return this.getFragment().removeFragment(indexOrFragment);
	}
	showInternal() {
		return super.attach();
	}
	show(id?: string) {
		Popups.open(this, id || this.id || "internal");
	}
	dismissInternal() {
		super.dismiss();
	}
	override dismiss() {
		if (this.isMayDismissed()) {
			Popups.closeIfOpened(this.id);
		}
	}
}

namespace FocusablePopup {
	export function parseJson(json: IFocusablePopup): FocusablePopup;
	export function parseJson(instance: FocusablePopup, json: IFocusablePopup, preferredFragment?: string): FocusablePopup;
	export function parseJson(instanceOrJson: FocusablePopup | IFocusablePopup, json?: IFocusablePopup, preferredFragment?: string) {
		if (!(instanceOrJson instanceof FocusablePopup)) {
			json = instanceOrJson;
			instanceOrJson = new FocusablePopup();
		}
		instanceOrJson = TransitionWindow.parseJson.call(this, instanceOrJson, json) as FocusablePopup;
		json = calloutOrParse(this, json, instanceOrJson);
		while (instanceOrJson.getFragmentCount() > 0) {
			instanceOrJson.removeFragment(0);
		}
		if (json == null || typeof json != "object") {
			return instanceOrJson;
		}
		if (json.hasOwnProperty("id")) {
			instanceOrJson.setId(calloutOrParse(json, json.id, [this, instanceOrJson]));
		}
		if (json.hasOwnProperty("mayDismissed")) {
			instanceOrJson.setIsMayDismissed(calloutOrParse(json, json.mayDismissed, [this, instanceOrJson]));
		}
		if (json.hasOwnProperty("elements")) {
			let elements = calloutOrParse(json, json.elements, [this, instanceOrJson]);
			if (elements != null && typeof elements == "object") {
				Array.isArray(elements) || (elements = [elements]);
				for (let offset = 0; offset < elements.length; offset++) {
					let item = calloutOrParse(elements, elements[offset], [this, json, instanceOrJson]);
					if (item != null && typeof item == "object") {
						let fragment = Fragment.parseJson.call(this, item, item, preferredFragment);
						if (fragment != null) {
							instanceOrJson.addFragment(fragment);
						}
					}
				}
			}
		}
		return instanceOrJson;
	}
}

registerWindowJson("popup", FocusablePopup);
