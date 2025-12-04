class AngleCircleFragment extends TextFragment {
	TYPE = "AngleCircleFragment";
	constructor(...marks) {
		super(...marks);
		this.setValue(0);
	}
	resetContainer() {
		let view = new android.widget.TextView(getContext());
		view.setPadding(toComplexUnitDip(16), toComplexUnitDip(8),
			toComplexUnitDip(16), toComplexUnitDip(8));
		new BitmapDrawable("controlCircle").attachAsBackground(view);
		let x = 0;
		let y = 0;
		let currently = 0;
		let previous = 0;
		let moved = false;
		view.setOnTouchListener((view, event) => {
			if (event.getAction() == android.view.MotionEvent.ACTION_DOWN) {
				x = view.getWidth() / 2 - event.getX();
				y = view.getHeight() / 2 - event.getY();
				previous = currently = this.value;
				moved = false;
			} else if (event.getAction() == android.view.MotionEvent.ACTION_MOVE) {
				try {
					let rawX = event.getX() - x;
					let rawY = event.getY() - y;
					this.value = Math.floor((Math.PI / 2 + Math.atan(rawY / rawX)) * 100) / 100;
					if (this.value != previous) {
						previous = this.value;
						this.updateAngle();
					}
					if (!moved) {
						moved = Math.abs(rawX) > toComplexUnitDip(8);
					}
				} catch (e) {
					log("Modding Tools: AngleCircleFragment.onTouch: " + e);
				}
			} else if (event.getAction() == android.view.MotionEvent.ACTION_UP) {
				try {
					if (!moved) {
						if (this.holdDefault && event.getDownTime() > 1000) {
							return this.holdDefault();
						}
						this.radians = !this.radians;
						this.updateAngle();
					} else if (currently != previous) {
						this.onChange && this.onChange(this.value, this.value * 180 / Math.PI);
					}
				} catch (e) {
					reportError(e);
				}
			}
			view.getParent().requestDisallowInterceptTouchEvent(true);
			return true;
		});
		view.setTextSize(toComplexUnitDp(22));
		view.setGravity($.Gravity.CENTER);
		view.setTextColor($.Color.WHITE);
		view.setTypeface(typeface);
		view.setMaxLines(1);
		view.setLayoutParams(new android.view.ViewGroup.LayoutParams(toComplexUnitDip(188), toComplexUnitDip(188)));
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
			Logger.Log("Modding Tools: Angle circle value passed NaN or incorrect value, it may be string or number", "WARNING");
			return this;
		}
		this.value = value;
		this.updateAngle();
		return this;
	}
	updateAngle() {
		if (this.radians) {
			this.setText("" + this.value);
		} else {
			this.setText(Math.floor(this.value * 180 / Math.PI) + "'");
		}
		return this;
	}
	setOnChangeListener(action) {
		this.onChange = action;
		return this;
	}
	setOnResetListener(action) {
		this.onReset = action;
		return this;
	}
	holdDefault() {
		if (typeof this.onReset == "function") {
			this.value = preround(this.onReset() || 0);
			this.onChange && this.onChange(this.value, this.value * 180 / Math.PI);
			this.updateAngle();
			return true;
		}
		return false;
	}
	static parseJson(instanceOrJson, json) {
		if (!(instanceOrJson instanceof AngleCircleFragment)) {
			json = instanceOrJson;
			instanceOrJson = new AngleCircleFragment();
		}
		instanceOrJson = TextFragment.parseJson.call(this, instanceOrJson, json);
		json = calloutOrParse(this, json, instanceOrJson);
		if (json === null || typeof json != "object") {
			return instanceOrJson;
		}
		if (json.hasOwnProperty("value")) {
			instanceOrJson.setValue(calloutOrParse(json, json.value, [this, instanceOrJson]));
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

registerFragmentJson("angle_circle", AngleCircleFragment);
registerFragmentJson("angleCircle", AngleCircleFragment);
