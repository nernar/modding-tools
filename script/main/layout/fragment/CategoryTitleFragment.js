class CategoryTitleFragment extends TextFragment {
	TYPE = "CategoryTitleFragment";
	resetContainer() {
		let view = new android.widget.TextView(getContext());
		view.setPadding(toComplexUnitDip(10), toComplexUnitDip(10),
			toComplexUnitDip(10), toComplexUnitDip(5));
		view.setTextSize(toComplexUnitDp(7));
		view.setTextColor($.Color.WHITE);
		view.setTypeface(typeface);
		view.setLayoutParams(new android.view.ViewGroup.
			LayoutParams($.ViewGroup.LayoutParams.MATCH_PARENT, $.ViewGroup.LayoutParams.WRAP_CONTENT));
		this.setContainerView(view);
	}
	getTextView() {
		return this.getContainer();
	}
	static parseJson(instanceOrJson, json) {
		if (!(instanceOrJson instanceof CategoryTitleFragment)) {
			json = instanceOrJson;
			instanceOrJson = new CategoryTitleFragment();
		}
		return TextFragment.parseJson.call(this, instanceOrJson, json);
	}
}

registerFragmentJson("category_title", CategoryTitleFragment);
registerFragmentJson("categoryTitle", CategoryTitleFragment);
