class AutoCompleteInputFragment extends PropertyInputFragment {
	TYPE = "AutoCompleteInputFragment";
	resetContainer() {
		let view = new android.widget.AutoCompleteTextView(getContext());
		view.setDropDownBackgroundDrawable(new BitmapDrawable("popup").toDrawableInThread());
		view.setInputType(android.text.InputType.TYPE_CLASS_TEXT |
			android.text.InputType.TYPE_TEXT_FLAG_MULTI_LINE);
		view.setImeOptions(android.view.inputmethod.EditorInfo.IME_FLAG_NO_FULLSCREEN);
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
	getAdapter() {
		return this.getTextView().getAdapter();
	}
	setAdapter(adapter) {
		this.getTextView().setAdapter(adapter);
		return this;
	}
	static parseJson(instanceOrJson, json) {
		if (!(instanceOrJson instanceof AutoCompleteInputFragment)) {
			json = instanceOrJson;
			instanceOrJson = new AutoCompleteInputFragment();
		}
		instanceOrJson = PropertyInputFragment.parseJson.call(this, instanceOrJson, json);
		json = calloutOrParse(this, json, instanceOrJson);
		if (json === null || typeof json != "object") {
			return instanceOrJson;
		}
		return instanceOrJson;
	}
}

registerFragmentJson("auto_complete_input", AutoCompleteInputFragment);
registerFragmentJson("autoCompleteInput", AutoCompleteInputFragment);
