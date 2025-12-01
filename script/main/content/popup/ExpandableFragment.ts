/**
 * @requires `isAndroid()`
 */
class ExpandableFragment extends FocusableFragment {
	override readonly TYPE: string = "ExpandableFragment";
	override resetContainer() {
		FocusableFragment.prototype.resetContainer.apply(this, arguments);
		let layout = this.getContainerRoot();

		let title = new android.widget.TextView(getContext());
		new BitmapDrawable("popup").attachAsBackground(title);
		title.setPadding(toComplexUnitDip(16), toComplexUnitDip(16),
			toComplexUnitDip(16), toComplexUnitDip(16));
		title.setTextSize(toComplexUnitDp(9));
		title.setGravity($.Gravity.CENTER);
		title.setTextColor($.Color.WHITE);
		title.setTypeface(typeface);
		title.setTag("popupTitle");
		let params: android.view.ViewGroup.LayoutParams = new android.widget.LinearLayout.LayoutParams(
			android.view.ViewGroup.LayoutParams.MATCH_PARENT, android.view.ViewGroup.LayoutParams.WRAP_CONTENT
		);
		layout.addView(title, params);

		let scroll = new android.widget.ScrollView(getContext());
		scroll.setTag("containerExpandableScroll");
		params = new android.widget.LinearLayout.LayoutParams(
			android.view.ViewGroup.LayoutParams.MATCH_PARENT, android.view.ViewGroup.LayoutParams.WRAP_CONTENT
		);
		layout.addView(scroll, params);

		let content = new android.widget.LinearLayout(getContext());
		content.setOrientation($.LinearLayout.VERTICAL);
		content.setGravity($.Gravity.CENTER);
		content.setTag("containerExpandable");
		params = new android.view.ViewGroup.LayoutParams(
			android.view.ViewGroup.LayoutParams.MATCH_PARENT, android.view.ViewGroup.LayoutParams.WRAP_CONTENT
		);
		scroll.addView(content, params);
	}
	override getContainerLayout() {
		let layout = this.findViewByTag("containerExpandable");
		if (!(layout instanceof android.view.ViewGroup)) {
			Logger.Log("Modding Tools: ExpandableFragment.getContainerLayout received " + layout + " as container, but it should be ViewGroup!", "WARNING");
			return null;
		}
		return layout;
	}
	getContainerScroll() {
		let scroll = this.findViewByTag("containerExpandableScroll");
		if (!(scroll instanceof android.widget.ScrollView)) {
			Logger.Log("Modding Tools: ExpandableFragment.getContainerLayout received " + scroll + " as container, but it should be ScrollView!", "WARNING");
			return null;
		}
		return scroll;
	}
	getTitleView() {
		return this.findViewByTag("popupTitle") as android.widget.TextView;
	}
}
