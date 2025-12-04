class ButtonFragment extends TextFragment {
	TYPE = "ButtonFragment";
	constructor(...marks) {
		super(...marks);
		this.setIsSelectable(true);
	}
	resetContainer() {
		let view = new android.widget.TextView(getContext());
		view.setGravity($.Gravity.CENTER);
		view.setTextColor($.Color.WHITE);
		view.setTypeface(typeface);
		view.setLayoutParams(new android.view.ViewGroup.LayoutParams($.ViewGroup.LayoutParams.MATCH_PARENT, $.ViewGroup.LayoutParams.WRAP_CONTENT));
		this.setContainerView(view);
		this.setSelectedBackground("popupSelectionSelected");
	}
	getTextView() {
		return this.getContainer();
	}
	click() {
		this.toggle();
		TextFragment.prototype.click.apply(this, arguments);
	}
	hold() {
		let parent = this.getParent();
		if (parent && parent.holdItemInLayout && parent.holdItemInLayout(this)) {
			return true;
		}
		return TextFragment.prototype.hold.apply(this, arguments);
	}
	remark() {
		let text = this.getTextView();
		if (this.hasMark("solid") || this.hasMark("popup")) {
			text.setPadding(toComplexUnitDip(16), toComplexUnitDip(16),
				toComplexUnitDip(16), toComplexUnitDip(16));
		} else {
			text.setPadding(toComplexUnitDip(16), toComplexUnitDip(6),
				toComplexUnitDip(16), toComplexUnitDip(6));
		}
		if (this.hasMark("filled") || this.hasMark("popup")) {
			this.setUnselectedBackground("popup");
		} else {
			this.setUnselectedBackground(null);
		}
		if (this.hasMark("popup")) {
			text.setTextSize(toComplexUnitDp(9));
		} else {
			text.setTextSize(toComplexUnitDp(8));
		}
		TextFragment.prototype.remark.apply(this, arguments);
	}
	static parseJson(instanceOrJson, json) {
		if (!(instanceOrJson instanceof ButtonFragment)) {
			json = instanceOrJson;
			instanceOrJson = new ButtonFragment();
		}
		instanceOrJson = TextFragment.parseJson.call(this, instanceOrJson, json);
		json = calloutOrParse(this, json, instanceOrJson);
		if (json === null || typeof json != "object") {
			return instanceOrJson;
		}
		SelectableFragment.parseJson.call(this, instanceOrJson, json);
		return instanceOrJson;
	}
}

__inherit__(ButtonFragment, TextFragment, SelectableFragment.prototype);

registerFragmentJson("button", ButtonFragment);

class SolidButtonFragment extends ButtonFragment {
	TYPE = "SolidButtonFragment";
	constructor() {
		super("solid");
		Logger.Log("Modding Tools: SolidButtonFragment has been deprecated! Use marks or layout adding instead.", "WARNING");
	}
}

class ThinButtonFragment extends ButtonFragment {
	TYPE = "ThinButtonFragment";
	constructor() {
		super();
		Logger.Log("Modding Tools: ThinButtonFragment has been deprecated! Use primary ButtonFragment instead.", "WARNING");
	}
}
