/**
 * In future every window should equals to fragment
 * container from itself, instance rewrites global
 * window with specified container; window is untouched.
 * @todo Do not use constructors to get attached container.
 * @deprecated EXTREMELLY UNSTABLE
 */
class UniqueWindow extends TransitionWindow {
	override readonly TYPE: string = "UniqueWindow";
	protected updatable?: boolean;

	constructor() {
		super();
		if (UniqueHelper.wasTypeAttached(this)) {
			return UniqueHelper.getWindow(this);
		}
		return this;
	}

	isAttached() {
		return UniqueHelper.isAttached(this);
	}
	canBeOpened() {
		return !this.isOpened();
	}
	isUpdatable() {
		return this.updatable !== undefined ? this.updatable : true;
	}
	setIsUpdatable(enabled: boolean) {
		if (enabled !== undefined) {
			this.updatable = !!enabled;
		} else {
			delete this.updatable;
		}
	}
	override attach() {
		if (UniqueHelper.prepareWindow(this)) {
			return super.attach();
		}
		return false;
	}
	override dismiss() {
		if (UniqueHelper.deattachWindow(this)) {
			super.dismiss();
		}
	}
}

namespace UniqueWindow {
	export function parseJson(json: IUniqueWindow): UniqueWindow;
	export function parseJson(instance: UniqueWindow, json: IUniqueWindow): UniqueWindow;
	export function parseJson(instanceOrJson: UniqueWindow | IUniqueWindow, json?: IUniqueWindow) {
		if (!(instanceOrJson instanceof UniqueWindow)) {
			json = instanceOrJson;
			instanceOrJson = new UniqueWindow();
		}
		instanceOrJson = TransitionWindow.parseJson.call(this, instanceOrJson, json) as UniqueWindow;
		json = calloutOrParse(this, json, instanceOrJson);
		if (json === null || typeof json != "object") {
			return instanceOrJson;
		}
		if (json.hasOwnProperty("id")) {
			// @ts-expect-error
			instanceOrJson.TYPE = calloutOrParse(json, json.id, [this, instanceOrJson]);
		}
		if (json.hasOwnProperty("updatable")) {
			instanceOrJson.setIsUpdatable(calloutOrParse(json, json.updatable, [this, instanceOrJson]));
		}
		return instanceOrJson;
	}
}

registerWindowJson("unique", UniqueWindow);
