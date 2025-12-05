class ExplanatoryFragment extends TextFragment {
	override readonly TYPE: string = "ExplanatoryFragment";
	override resetContainer() {
		let view = new android.widget.TextView(getContext());
		view.setPadding(toComplexUnitDip(14), toComplexUnitDip(10),
			toComplexUnitDip(14), toComplexUnitDip(10));
		view.setTextSize(toComplexUnitDp(6));
		view.setTextColor($.Color.LTGRAY);
		view.setGravity($.Gravity.CENTER);
		view.setTypeface(typeface);
		view.setLayoutParams(new android.view.ViewGroup.
			LayoutParams($.ViewGroup.LayoutParams.MATCH_PARENT, $.ViewGroup.LayoutParams.WRAP_CONTENT));
		this.setContainerView(view);
	}
	override getTextView() {
		return this.getContainer() as android.widget.TextView;
	}
}

namespace ExplanatoryFragment {
	export function parseJson<RT extends ExplanatoryFragment = ExplanatoryFragment, JT extends ITextFragmentMixin = ITextFragmentMixin>(json?: JT): RT;
	export function parseJson<RT extends ExplanatoryFragment = ExplanatoryFragment, JT extends ITextFragmentMixin = ITextFragmentMixin>(instance: RT, json?: JT): RT;
	export function parseJson<RT extends ExplanatoryFragment = ExplanatoryFragment, JT extends ITextFragmentMixin = ITextFragmentMixin>(instanceOrJson: RT | JT, json?: JT) {
		if (!(instanceOrJson instanceof ExplanatoryFragment)) {
			json = instanceOrJson;
			instanceOrJson = new ExplanatoryFragment() as RT;
		}
		json = calloutOrParse(this, json, instanceOrJson);
		if (json === null || typeof json != "object") {
			return instanceOrJson;
		}
		TextFragmentMixin.parseJson.call(this, instanceOrJson, json);
		return instanceOrJson;
	}
}

registerFragmentJson("explanatory", ExplanatoryFragment);
