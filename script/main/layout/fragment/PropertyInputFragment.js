class PropertyInputFragment extends TextFragment {
	TYPE = "PropertyInputFragment";
	resetContainer() {
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
		view.setOnClickListener(function (view) {
			view.requestFocus();
			let ims = getContext().getSystemService(android.content.Context.INPUT_METHOD_SERVICE);
			ims.showSoftInput(view, android.view.inputmethod.InputMethodManager.SHOW_IMPLICIT);
		});
		this.setContainerView(view);
	}
	getTextView() {
		return this.getContainer();
	}
	setHint(who) {
		this.getTextView().setHint("" + who);
		return this;
	}
	isRequiresFocusable() {
		return true;
	}
	static parseJson(instanceOrJson, json) {
		if (!(instanceOrJson instanceof PropertyInputFragment)) {
			json = instanceOrJson;
			instanceOrJson = new PropertyInputFragment();
		}
		instanceOrJson = TextFragment.parseJson.call(this, instanceOrJson, json);
		json = calloutOrParse(this, json, instanceOrJson);
		if (json === null || typeof json != "object") {
			return instanceOrJson;
		}
		if (json.hasOwnProperty("hint")) {
			instanceOrJson.setHint(calloutOrParse(json, json.hint, [this, instanceOrJson]));
		}
		return instanceOrJson;
	}
}

registerFragmentJson("property_input", PropertyInputFragment);
registerFragmentJson("propertyInput", PropertyInputFragment);
