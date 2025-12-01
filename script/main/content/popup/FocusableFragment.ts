/**
 * @requires `isAndroid()`
 */
class FocusableFragment extends LayoutFragment {
	override readonly TYPE: string = "FocusableFragment";
	constructor() {
		super();
		this.setBackground("popup");
	}
	override resetContainer() {
		let layout = new android.widget.LinearLayout(getContext());
		layout.setOrientation(android.widget.LinearLayout.VERTICAL);
		layout.setTag("containerLayout");
		this.setContainerView(layout);
	}
	override getContainerRoot() {
		let layout = this.findViewByTag("containerLayout");
		if (!(layout instanceof android.view.ViewGroup)) {
			Logger.Log("Modding Tools: FocusableFragment.getContainerRoot received " + layout + " as container, but it should be ViewGroup!", "WARNING");
			return null;
		}
		return layout;
	}
	override getContainerLayout() {
		return this.getContainerRoot();
	}
}
