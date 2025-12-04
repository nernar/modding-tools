class SliderFragment extends TextFragment {
	TYPE = "SliderFragment";
	constructor(...marks) {
		super(...marks);
		this.modifier = 0;
		this.modifiers = [16, 1];
		this.setValue(0);
	}
	resetContainer() {
		let view = new android.widget.TextView(getContext());
		view.setPadding(toComplexUnitDip(16), toComplexUnitDip(8),
			toComplexUnitDip(16), toComplexUnitDip(8));
		let x = 0;
		let y = 0;
		let currently = 0;
		let previous = 0;
		let moved = false;
		view.setOnTouchListener((view, event) => {
			if (event.getAction() == android.view.MotionEvent.ACTION_DOWN) {
				x = event.getX();
				y = event.getY();
				previous = currently = this.value;
				moved = false;
			} else if (event.getAction() == android.view.MotionEvent.ACTION_MOVE) {
				try {
					let current = this.modifiers[this.modifier];
					let raw = event.getX() - x;
					let offset = raw + toComplexUnitDip(40);
					let size = (current > 0 ? 1 / current : current) * (offset < 0 ? -1 : 1) * (Math.pow(2, Math.abs(offset) / toComplexUnitDip(80)) - 1);
					this.value = preround((current == 1 ? Math.floor(size) : Math.floor(size * current) / current) + currently);
					if (this.value != previous) {
						previous = this.value;
						this.updateCounter();
					}
					if (!moved) {
						moved = Math.abs(raw) > toComplexUnitDip(8);
					}
				} catch (e) {
					log("Modding Tools: SliderFragment.onTouch: " + e);
				}
			} else if (event.getAction() == android.view.MotionEvent.ACTION_UP) {
				try {
					if (!moved) {
						if (this.reset && event.getDownTime() > 1000) {
							return !!this.reset();
						}
						this.modifier++;
						this.modifier >= this.modifiers.length && (this.modifier = 0);
						this.updateCounter();
					} else if (currently != previous) {
						this.change(this.value, currently);
					}
				} catch (e) {
					reportError(e);
				}
			}
			view.getParent().requestDisallowInterceptTouchEvent(true);
			return true;
		});
		view.setTextSize(toComplexUnitDp(8));
		view.setGravity($.Gravity.CENTER);
		view.setTextColor($.Color.WHITE);
		view.setTypeface(typeface);
		view.setMaxLines(1);
		view.setLayoutParams(new android.view.ViewGroup.LayoutParams(toComplexUnitDip(188), toComplexUnitDip(40))
		);
		this.setContainerView(view);
	}
	getTextView() {
		return this.getContainer();
	}
	getValue() {
		return this.value || 0;
	}
	setValue(value) {
		value = value - 0;
		if (isNaN(value)) {
			Logger.Log("Modding Tools: Passed NaN to SliderFragment.setValue(*), it may be string or number", "WARNING");
			return false;
		}
		this.value = preround(value);
		this.updateCounter();
		return true;
	}
	setSuffix(suffix) {
		if (suffix != null) {
			this.suffix = "" + suffix;
		} else {
			delete this.suffix;
		}
		this.updateCounter();
		return this;
	}
	setModifier(modifier) {
		this.modifier = modifier - 0;
		if (this.modifier < 0) {
			this.modifier = 0;
		}
		if (this.modifier > this.modifiers.length - 1) {
			this.modifier = this.modifiers.length - 1;
		}
		this.updateCounter();
		return this;
	}
	setModifiers(modifiers) {
		if (!Array.isArray(modifiers) || modifiers.length == 0) {
			Logger.Log("Modding Tools: SliderFragment.setModifiers(*) in incorrect format, please consider that it must be [..]", "WARNING");
			return this;
		}
		this.modifier = 0;
		this.modifiers = modifiers;
		this.updateCounter();
		return this;
	}
	updateCounter() {
		let current = this.modifiers[this.modifier];
		this.setText((current == 1 ? "" + this.value :
			current > 0 ? preround(this.value * current) + " : " + current :
				preround(this.value / current) + " * " + (-current)) + (this.suffix || ""));
		return this;
	}
	change(value, previous) {
		previous == null && (previous = this.value);
		if (this.setValue(value)) {
			let parent = this.getParent();
			parent && parent.changeItemInLayout && parent.changeItemInLayout(this, value, value - previous);
			this.onChange && this.onChange(value, value - previous);
		}
	}
	reset() {
		let value = this.onReset && this.onReset(this.value);
		if (value != true && (value == null || isNaN(value))) {
			let parent = this.getParent();
			value = parent && parent.resetItemInLayout && parent.resetItemInLayout(this, value);
		}
		if (value != true && (value == null || isNaN(value))) {
			return false;
		}
		value == true || this.change(value);
		return true;
	}
	setOnChangeListener(listener) {
		if (typeof listener == "function") {
			this.onChange = listener;
		} else {
			delete this.onChange;
		}
		return this;
	}
	setOnResetListener(listener) {
		if (typeof listener == "function") {
			this.onReset = listener;
		} else {
			delete this.onReset;
		}
		return this;
	}
	static parseJson(instanceOrJson, json) {
		if (!(instanceOrJson instanceof SliderFragment)) {
			json = instanceOrJson;
			instanceOrJson = new SliderFragment();
		}
		instanceOrJson = TextFragment.parseJson.call(this, instanceOrJson, json);
		json = calloutOrParse(this, json, instanceOrJson);
		if (json === null || typeof json != "object") {
			return instanceOrJson;
		}
		if (json.hasOwnProperty("modifiers")) {
			instanceOrJson.setModifiers(calloutOrParse(json, json.modifiers, [this, instanceOrJson]));
		}
		if (json.hasOwnProperty("modifier")) {
			instanceOrJson.setModifier(calloutOrParse(json, json.modifier, [this, instanceOrJson]));
		}
		if (json.hasOwnProperty("value")) {
			instanceOrJson.setValue(calloutOrParse(json, json.value, [this, instanceOrJson]));
		}
		if (json.hasOwnProperty("suffix")) {
			instanceOrJson.setSuffix(calloutOrParse(json, json.suffix, [this, instanceOrJson]));
		}
		if (json.hasOwnProperty("change")) {
			instanceOrJson.setOnChangeListener(parseCallback(json, json.change, [this, instanceOrJson]));
		}
		if (json.hasOwnProperty("reset")) {
			instanceOrJson.setOnResetListener(parseCallback(json, json.reset, [this, instanceOrJson]));
		}
		return instanceOrJson;
	}
}

registerFragmentJson("slider", SliderFragment);
