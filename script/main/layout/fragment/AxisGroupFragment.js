class AxisGroupFragment extends LayoutFragment {
	TYPE = "AxisGroupFragment";
	constructor(...marks) {
		super(...marks);
		this.setBackground("popup");
	}
	resetContainer() {
		let content = new android.widget.LinearLayout(getContext());
		content.setPadding(toComplexUnitDip(6), toComplexUnitDip(6),
			toComplexUnitDip(6), toComplexUnitDip(6));
		content.setGravity($.Gravity.CENTER);
		this.setContainerView(content);

		let axis = new android.widget.TextView(getContext());
		axis.setPadding(toComplexUnitDip(10), toComplexUnitDip(6),
			toComplexUnitDip(10), toComplexUnitDip(6));
		axis.setTextSize(toComplexUnitDp(12));
		axis.setTextColor($.Color.WHITE);
		axis.setTypeface(typeface);
		axis.setMaxLines(1);
		axis.setTag("groupAxis");
		content.addView(axis);

		let container = new android.widget.LinearLayout(getContext());
		container.setOrientation($.LinearLayout.VERTICAL);
		container.setTag("containerGroup");
		content.addView(container);
	}
	getContainerRoot() {
		return this.findViewByTag("containerGroup");
	}
	getContainerLayout() {
		return this.getContainerRoot();
	}
	getTextView() {
		return this.findViewByTag("groupAxis");
	}
	getAxis() {
		return TextFragment.prototype.getText.apply(this, arguments);
	}
	appendAxis(text) {
		return TextFragment.prototype.appendText.apply(this, arguments);
	}
	setAxis(text) {
		return TextFragment.prototype.setText.apply(this, arguments);
	}
	changeItemInLayout(item, value, difference) {
		this.onChangeItem && this.onChangeItem(item, item.getIndex(), value, difference);
	}
	resetItemInLayout(item, value) {
		if (this.onResetItem) {
			let result = this.onResetItem(item, item.getIndex(), value);
			return result != null && typeof result == "number" ? result : null;
		}
		return null;
	}
	setOnChangeItemListener(listener) {
		if (typeof listener == "function") {
			this.onChangeItem = listener;
		} else {
			delete this.onChangeItem;
		}
		return this;
	}
	setOnResetItemListener(listener) {
		if (typeof listener == "function") {
			this.onResetItem = listener;
		} else {
			delete this.onResetItem;
		}
		return this;
	}
	static parseJson(instanceOrJson, json, preferredFragment) {
		if (!(instanceOrJson instanceof AxisGroupFragment)) {
			json = instanceOrJson;
			instanceOrJson = new AxisGroupFragment();
		}
		instanceOrJson = LayoutFragment.parseJson.call(this, instanceOrJson, json, preferredFragment !== undefined ? preferredFragment : "slider");
		json = calloutOrParse(this, json, instanceOrJson);
		if (json === null || typeof json != "object") {
			return instanceOrJson;
		}
		if (json.hasOwnProperty("text")) {
			instanceOrJson.setAxis(calloutOrParse(json, json.text, [this, instanceOrJson]));
		}
		if (json.hasOwnProperty("append")) {
			instanceOrJson.appendAxis(calloutOrParse(json, json.append, [this, instanceOrJson]));
		}
		if (json.hasOwnProperty("changeItem")) {
			instanceOrJson.setOnChangeItemListener(parseCallback(json, json.changeItem, [this, instanceOrJson]));
		}
		if (json.hasOwnProperty("resetItem")) {
			instanceOrJson.setOnResetItemListener(parseCallback(json, json.resetItem, [this, instanceOrJson]));
		}
		return instanceOrJson;
	}
}

registerFragmentJson("axis_group", AxisGroupFragment);
registerFragmentJson("axisGroup", AxisGroupFragment);
