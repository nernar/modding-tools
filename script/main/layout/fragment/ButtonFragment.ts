class ButtonFragment extends TextFragment {
	override readonly TYPE: string = "ButtonFragment";
	constructor(...marks) {
		super(...marks);
		this.setIsSelectable(true);
	}
	override resetContainer() {
		let view = new android.widget.TextView(getContext());
		view.setGravity($.Gravity.CENTER);
		view.setTextColor($.Color.WHITE);
		view.setTypeface(typeface);
		view.setLayoutParams(new android.view.ViewGroup.LayoutParams($.ViewGroup.LayoutParams.MATCH_PARENT, $.ViewGroup.LayoutParams.WRAP_CONTENT));
		this.setContainerView(view);
		this.setSelectedBackground("popupSelectionSelected");
	}
	override getTextView() {
		return this.getContainer() as android.widget.TextView;
	}
	override click() {
		this.toggle();
		super.click();
	}
	override hold() {
		let parent = this.getParent();
		if (parent && parent.holdItemInLayout && parent.holdItemInLayout(this)) {
			return true;
		}
		return super.hold();
	}
	override remark() {
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
		super.remark();
	}
}

namespace ButtonFragment {
	export function parseJson<RT extends ButtonFragment = ButtonFragment, JT extends IButtonFragment = IButtonFragment>(json?: JT): RT;
	export function parseJson<RT extends ButtonFragment = ButtonFragment, JT extends IButtonFragment = IButtonFragment>(instance: RT, json?: JT): RT;
	export function parseJson<RT extends ButtonFragment = ButtonFragment, JT extends IButtonFragment = IButtonFragment>(instanceOrJson: RT | JT, json?: JT) {
		if (!(instanceOrJson instanceof ButtonFragment)) {
			json = instanceOrJson;
			instanceOrJson = new ButtonFragment() as RT;
		}
		json = calloutOrParse(this, json, instanceOrJson);
		if (json === null || typeof json != "object") {
			return instanceOrJson;
		}
		TextFragmentMixin.parseJson.call(this, instanceOrJson, json);
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
