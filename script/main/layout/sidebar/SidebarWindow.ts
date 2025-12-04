/**
 * @requires `isAndroid()`
 */
class SidebarWindow extends UniqueWindow {
	override readonly TYPE: string = "SidebarWindow";
	resetWindow() {
		super.resetWindow();
		this.setGravity($.Gravity.RIGHT);
		this.setHeight($.ViewGroup.LayoutParams.MATCH_PARENT);

		// let fragment = new SidebarFragment();
		let fragment = new SidebarFragment.Rail("fill");
		fragment.setSelectionMode(SelectableLayoutFragment.MODE_SINGLE);
		fragment.setBackground("popup");
		this.setFragment(fragment);

		let enter = new android.transition.Slide($.Gravity.RIGHT);
		enter.setInterpolator(new android.view.animation.DecelerateInterpolator());
		enter.setDuration(400);
		this.setEnterTransition(enter);

		let exit = new android.transition.Slide($.Gravity.RIGHT);
		exit.setInterpolator(new android.view.animation.BounceInterpolator());
		exit.setDuration(1000);
		this.setExitTransition(exit);
	}
	// isSelected() {
		// return this.getFragment().isSelected();
	// }
	// getSelected() {
		// return this.getFragment().getSelected();
	// }
	// reinflateLayout() {
		// return this.getFragment().reinflateLayout();
	// }
}

namespace SidebarWindow {
	// static isSelected(group) {
		// let currently = UniqueHelper.getWindow("SidebarWindow");
		// return currently != null && currently.getSelected() == group;
	// }

	export function parseJson<JT extends SidebarFragment.IRail = SidebarFragment.IRail, RT extends SidebarWindow = SidebarWindow>(json?: JT): RT;
	export function parseJson<JT extends SidebarFragment.IRail = SidebarFragment.IRail, RT extends SidebarWindow = SidebarWindow>(instance: RT, json?: JT): RT;
	export function parseJson<JT extends SidebarFragment.IRail = SidebarFragment.IRail, RT extends SidebarWindow = SidebarWindow>(instanceOrJson: RT | JT, json?: JT): RT {
		if (!(instanceOrJson instanceof SidebarWindow)) {
			json = instanceOrJson;
			instanceOrJson = new SidebarWindow() as RT;
		}
		SidebarFragment.Rail.parseJson.call(this, instanceOrJson.getFragment(), json);
		return instanceOrJson;
	}
}
