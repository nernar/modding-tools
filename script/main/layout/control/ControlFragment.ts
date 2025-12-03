/**
 * @requires `isAndroid()`
 */
abstract class ControlFragment extends ImageFragment {
	override resetContainer() {
		MCSystem.throwException("Modding Tools: ControlFragment must be superclass only");
	}
	override getImageView() {
		return this.findViewByTag("logotypeForeground") as android.widget.ImageView;
	}
	override getContainerRoot() {
		return this.findViewByTag("logotypeBackground") as android.view.ViewGroup;
	}
}

namespace ControlFragment {
	export class Button extends ControlFragment {
		override resetContainer() {
			let container = new android.widget.FrameLayout(getContext());
			this.setContainerView(container);

			let layout = new android.widget.LinearLayout(getContext());
			layout.setOrientation($.LinearLayout.VERTICAL);
			layout.setTag("logotypeBackground");
			$.ViewCompat.setTransitionName(layout, "logotypeBackground");
			let params = new android.widget.FrameLayout.LayoutParams(
				$.ViewGroup.LayoutParams.WRAP_CONTENT, $.ViewGroup.LayoutParams.WRAP_CONTENT
			);
			params.setMargins(toComplexUnitDip(12), toComplexUnitDip(12), 0, 0);
			container.addView(layout, params);

			let button = new android.widget.ImageView(getContext());
			button.setPadding(toComplexUnitDip(10), toComplexUnitDip(10),
				toComplexUnitDip(10), toComplexUnitDip(10));
			button.setTag("logotypeForeground");
			$.ViewCompat.setTransitionName(button, "logotypeForeground");
			layout.addView(button, new android.widget.LinearLayout.LayoutParams(toComplexUnitDip(60), toComplexUnitDip(60)));
		}
	}

	export class CollapsedButton extends Button {
		constructor() {
			super();
			this.setOffset(toComplexUnitDip(40));
		}
		setOffset(x: number, y?: number) {
			let layout = this.getContainerRoot();
			if (x !== undefined) layout.setX(-x);
			if (y !== undefined) layout.setY(-y);
		}
	}

	export class Logotype extends ControlFragment {
		override resetContainer() {
			let container = new android.widget.FrameLayout(getContext());
			container.setLayoutParams(
				new android.widget.FrameLayout.LayoutParams($.ViewGroup.LayoutParams.MATCH_PARENT, $.ViewGroup.LayoutParams.MATCH_PARENT)
			);
			this.setContainerView(container);

			let layout = new android.widget.LinearLayout(getContext());
			layout.setGravity($.Gravity.CENTER);
			layout.setTag("logotypeBackground");
			layout.setMinimumWidth(getDisplayWidth());
			layout.setMinimumHeight(getDisplayHeight());
			$.ViewCompat.setTransitionName(layout, "logotypeBackground");
			container.addView(layout, new android.widget.FrameLayout.LayoutParams(
				$.ViewGroup.LayoutParams.MATCH_PARENT, $.ViewGroup.LayoutParams.MATCH_PARENT
			));

			let logotype = new android.widget.ImageView(getContext());
			logotype.setTag("logotypeForeground");
			$.ViewCompat.setTransitionName(logotype, "logotypeForeground");
			layout.addView(logotype, new android.widget.LinearLayout.LayoutParams(toComplexUnitDip(208), toComplexUnitDip(208)));
		}
		setLevel(level: number) {
			let logotype = this.getImageView();
			if (logotype == null) return this;
			logotype.setImageLevel(level);
			return this;
		}
	}
}
