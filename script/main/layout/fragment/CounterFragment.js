class CounterFragment extends SliderFragment {
	TYPE = "CounterFragment";
	resetContainer() {
		SliderFragment.prototype.resetContainer.apply(this, arguments);
		let modifier = this.getContainer();

		let content = new android.widget.LinearLayout(getContext());
		content.setPadding(toComplexUnitDip(8), toComplexUnitDip(8),
			toComplexUnitDip(8), toComplexUnitDip(8));
		content.setGravity($.Gravity.CENTER);
		this.setContainerView(content);

		let subtract = new android.widget.ImageView(getContext());
		new BitmapDrawable("controlAdapterMinus").attachAsImage(subtract);
		subtract.setOnClickListener(() => {
			try {
				let previous = this.value, current = this.modifiers[this.modifier];
				this.change(this.value - (current > 0 ? 1 / current : current), previous);
			} catch (e) {
				reportError(e);
			}
		});
		subtract.setTag("counterSubtract");
		let params = new android.widget.LinearLayout.
			LayoutParams(toComplexUnitDip(40), toComplexUnitDip(40));
		content.addView(subtract, params);

		modifier.setPadding(toComplexUnitDip(8), 0, toComplexUnitDip(8), 0);
		modifier.setOnClickListener(() => {
			try {
				this.modifier++;
				this.modifier == this.modifiers.length && (this.modifier = 0);
				this.updateCounter();
			} catch (e) {
				reportError(e);
			}
		});
		modifier.setOnLongClickListener(() => {
			try {
				return !!(this.reset && this.reset());
			} catch (e) {
				reportError(e);
			}
			return false;
		});
		modifier.setTag("counterText");
		content.addView(modifier, new android.widget.LinearLayout.
			LayoutParams(toComplexUnitDip(104), $.ViewGroup.LayoutParams.MATCH_PARENT));

		let add = new android.widget.ImageView(getContext());
		new BitmapDrawable("controlAdapterPlus").attachAsImage(add);
		add.setOnClickListener(() => {
			try {
				let previous = this.value, current = this.modifiers[this.modifier];
				this.change(this.value + (current > 0 ? 1 / current : current), previous);
			} catch (e) {
				reportError(e);
			}
		});
		add.setTag("counterAdd");
		content.addView(add, params);
	}
	getTextView() {
		return this.findViewByTag("counterText");
	}
	getSubtractView() {
		return this.findViewByTag("counterSubtract");
	}
	getAddView() {
		return this.findViewByTag("counterAdd");
	}
	static parseJson(instanceOrJson, json) {
		if (!(instanceOrJson instanceof CounterFragment)) {
			json = instanceOrJson;
			instanceOrJson = new CounterFragment();
		}
		return SliderFragment.parseJson.call(this, instanceOrJson, json);
	}
}

registerFragmentJson("counter", CounterFragment);
