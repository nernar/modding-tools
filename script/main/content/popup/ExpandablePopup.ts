/**
 * @requires `isAndroid()`
 */
class ExpandablePopup extends FocusablePopup {
	override readonly TYPE = "ExpandablePopup";
	protected expanded?: boolean = true;
	protected mayCollapsed?: boolean = true;
	protected mayDragged?: boolean = true;

	protected dx?: number;
	protected dy?: number;
	protected expandable?: Action;
	protected closeable?: Action;

	override resetWindow() {
		FocusablePopup.prototype.resetWindow.apply(this, arguments);
		this.setFragment(new ExpandableFragment());
		let self = this;
		this.getFragment().getTitleView().setOnTouchListener((view, event) => {
			try {
				return !!self.handleTouch(event);
			} catch (e) {
				log("Modding Tools: ExpandablePopup.onTouch: " + e);
			}
			return false;
		});
	}
	override getFragment(): ExpandableFragment {
		return super.getFragment() as ExpandableFragment;
	}
	override setFragment(fragment: Fragment): void {
		if (!(fragment instanceof ExpandableFragment)) {
			MCSystem.throwException("Modding Tools: FocusablePopup.setFragment requires ExpandableFragment instance, got " + (fragment != null ? fragment.TYPE : null) + "!");
		}
		super.setFragment(fragment);
	}

	setTitle(title) {
		this.getFragment().getTitleView().setText(title);
	}
	handleTouch(event: android.view.MotionEvent) {
		switch (event.getAction()) {
			case 0:
				if (this.isMayDragged()) {
					this.dx = event.getX();
					this.dy = event.getY();
				}
				if (this.isMayCollapsed() || !this.isExpanded()) {
					if (this.expandable && this.expandable.isActive()) {
						if (this.expand) {
							this.expand();
							// ProjectProvider.getProject().updatePopupExpanded(this.name, this.isExpanded());
						}
						this.expandable.destroy();
					} else {
						if (this.expandable) {
							this.expandable.destroy();
						}
						this.expandable = new Action(500);
						this.expandable.run();
					}
				}
				if (this.isMayDismissed()) {
					if (this.closeable) {
						this.closeable.destroy();
					}
					this.closeable = new Action(750);
					this.closeable.run();
				}
				break;
			case 1:
				if (this.isMayDismissed()) {
					if (this.closeable && this.closeable.getThread() && this.closeable.getLeftTime() == 0) {
						this.closeable.destroy();
						this.dismiss();
					} // else ProjectProvider.getProject().updatePopupLocation(this.name, event.getRawX() - this.dx, event.getRawY() - this.dy);
				}
				break;
			case 2:
				let x = event.getX() - this.dx, y = event.getY() - this.dy;
				if (this.isMayDragged()) {
					this.setX(event.getRawX() - this.dx);
					this.setY(event.getRawY() - this.dy);
					this.updateWindow();
				}
				if (x > 0 || y > 0) {
					if (this.closeable) {
						this.closeable.destroy();
					}
					if (this.expandable) {
						this.expandable.destroy();
					}
				}
				break;
		}
		return true;
	}
	isExpanded() {
		return this.expanded || false;
	}
	expand() {
		if (this.isExpanded()) {
			this.minimize();
		} else {
			this.maximize();
		}
	}
	minimize() {
		let actor = new android.transition.Fade();
		actor.setDuration(200);
		this.beginDelayedTransition(actor);
		this.getFragment().getContainerScroll().setVisibility($.View.GONE);
		this.expanded = false;
	}
	maximize() {
		let actor = new android.transition.Fade();
		actor.setDuration(400);
		this.beginDelayedTransition(actor);
		this.getFragment().getContainerScroll().setVisibility($.View.VISIBLE);
		this.expanded = true;
	}
	isMayCollapsed() {
		return this.mayCollapsed || false;
	}
	setIsMayCollapsed(enabled: boolean) {
		this.mayCollapsed = !!enabled;
	}
	isMayDragged() {
		return this.mayDragged || false;
	}
	setIsMayDragged(enabled: boolean) {
		this.mayDragged = !!enabled;
	}
}

namespace ExpandablePopup {
	export function parseJson(json: IExpandablePopup): ExpandablePopup;
	export function parseJson(instance: ExpandablePopup, json?: IExpandablePopup, preferredFragment?: string): ExpandablePopup;
	export function parseJson(instanceOrJson: ExpandablePopup | IExpandablePopup, json?: IExpandablePopup, preferredFragment?: string) {
		if (!(instanceOrJson instanceof ExpandablePopup)) {
			json = instanceOrJson;
			instanceOrJson = new ExpandablePopup();
		}
		instanceOrJson = FocusablePopup.parseJson.call(this, instanceOrJson, json) as ExpandablePopup;
		json = calloutOrParse(this, json, instanceOrJson);
		if (json === null || typeof json != "object") {
			return instanceOrJson;
		}
		if (json.hasOwnProperty("title")) {
			instanceOrJson.setTitle(calloutOrParse(json, json.title, [this, instanceOrJson]));
		}
		if (json.hasOwnProperty("mayCollapsed")) {
			instanceOrJson.setIsMayCollapsed(calloutOrParse(json, json.mayCollapsed, [this, instanceOrJson]));
		}
		if (json.hasOwnProperty("mayDragged")) {
			instanceOrJson.setIsMayDragged(calloutOrParse(json, json.mayDragged, [this, instanceOrJson]));
		}
		if (json.hasOwnProperty("expanded")) {
			let property = calloutOrParse(json, json.expanded, [this, instanceOrJson]);
			if (property) {
				instanceOrJson.maximize();
			} else {
				instanceOrJson.minimize();
			}
		}
		return instanceOrJson;
	}
}

registerWindowJson("expandable", ExpandablePopup);
