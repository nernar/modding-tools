class PropertyInputFragment extends TextFragment {
	override readonly TYPE: string = "PropertyInputFragment";
	override resetContainer() {
		let view = new android.widget.EditText(getContext());
		view.setInputType(android.text.InputType.TYPE_CLASS_TEXT |
			android.text.InputType.TYPE_TEXT_FLAG_MULTI_LINE |
			android.text.InputType.TYPE_TEXT_FLAG_NO_SUGGESTIONS);
		view.setImeOptions(android.view.inputmethod.EditorInfo.IME_FLAG_NO_FULLSCREEN |
			android.view.inputmethod.EditorInfo.IME_FLAG_NO_ENTER_ACTION);
		view.setPadding(toComplexUnitDip(12), toComplexUnitDip(12),
			toComplexUnitDip(12), toComplexUnitDip(12));
		view.setHintTextColor($.Color.LTGRAY);
		view.setTextSize(toComplexUnitDp(7));
		view.setTextColor($.Color.WHITE);
		view.setSingleLine(false);
		view.setTypeface(typeface);
		view.setHorizontallyScrolling(true);
		view.setFocusableInTouchMode(true);
		view.setOnClickListener(((view: android.view.View) => {
			view.requestFocus();
			let ims = getContext().getSystemService(android.content.Context.INPUT_METHOD_SERVICE);
			ims.showSoftInput(view, android.view.inputmethod.InputMethodManager.SHOW_IMPLICIT);
		}) as any);
		this.setContainerView(view);
	}
	override getTextView() {
		return this.getContainer() as android.widget.EditText;
	}
	setHint(who: string) {
		this.getTextView().setHint("" + who);
		return this;
	}
	override isRequiresFocusable() {
		return true;
	}
}

namespace PropertyInputFragment {
	export function parseJson<RT extends PropertyInputFragment = PropertyInputFragment, JT extends IPropertyInputFragment = IPropertyInputFragment>(json?: JT): RT;
	export function parseJson<RT extends PropertyInputFragment = PropertyInputFragment, JT extends IPropertyInputFragment = IPropertyInputFragment>(instance: RT, json?: JT): RT;
	export function parseJson<RT extends PropertyInputFragment = PropertyInputFragment, JT extends IPropertyInputFragment = IPropertyInputFragment>(instanceOrJson: RT | JT, json?: JT) {
		if (!(instanceOrJson instanceof PropertyInputFragment)) {
			json = instanceOrJson;
			instanceOrJson = new PropertyInputFragment() as RT;
		}
		json = calloutOrParse(this, json, instanceOrJson);
		if (json === null || typeof json != "object") {
			return instanceOrJson;
		}
		TextFragmentMixin.parseJson.call(this, instanceOrJson, json);
		if (json.hasOwnProperty("hint")) {
			instanceOrJson.setHint(calloutOrParse(json, json.hint, [this, instanceOrJson]));
		}
		return instanceOrJson;
	}
}

registerFragmentJson("property_input", PropertyInputFragment);
registerFragmentJson("propertyInput", PropertyInputFragment);
