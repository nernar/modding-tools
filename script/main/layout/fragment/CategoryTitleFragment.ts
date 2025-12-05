class CategoryTitleFragment extends TextFragment {
	override readonly TYPE: string = "CategoryTitleFragment";
	override resetContainer() {
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
	override getTextView() {
		return this.getContainer() as android.widget.TextView;
	}
}

namespace CategoryTitleFragment {
	export function parseJson<RT extends CategoryTitleFragment = CategoryTitleFragment, JT extends ITextFragmentMixin = ITextFragmentMixin>(json?: JT): RT;
	export function parseJson<RT extends CategoryTitleFragment = CategoryTitleFragment, JT extends ITextFragmentMixin = ITextFragmentMixin>(instance: RT, json?: JT): RT;
	export function parseJson<RT extends CategoryTitleFragment = CategoryTitleFragment, JT extends ITextFragmentMixin = ITextFragmentMixin>(instanceOrJson: RT | JT, json?: JT) {
		if (!(instanceOrJson instanceof CategoryTitleFragment)) {
			json = instanceOrJson;
			instanceOrJson = new CategoryTitleFragment() as RT;
		}
		json = calloutOrParse(this, json, instanceOrJson);
		if (json === null || typeof json != "object") {
			return instanceOrJson;
		}
		TextFragmentMixin.parseJson.call(this, instanceOrJson, json);
		return instanceOrJson;
	}
}

registerFragmentJson("category_title", CategoryTitleFragment);
registerFragmentJson("categoryTitle", CategoryTitleFragment);
