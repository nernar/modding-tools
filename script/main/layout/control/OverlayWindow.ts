class OverlayWindow extends UniqueWindow {
	override readonly TYPE: string = "OverlayWindow";
	override resetWindow() {
		super.resetWindow();
		this.setTouchable(false);
		this.setX(toComplexUnitDip(96));
		this.setFragment(new OverlayFragment());

		let slide = new android.transition.Slide($.Gravity.TOP);
		slide.setInterpolator(new android.view.animation.DecelerateInterpolator());
		slide.setDuration(400);
		this.setEnterTransition(slide);

		slide = new android.transition.Slide($.Gravity.TOP);
		slide.setInterpolator(new android.view.animation.AccelerateInterpolator());
		slide.setDuration(400);
		this.setExitTransition(slide);

		this.setBackground("popup");
	}
	override getFragment() {
		return super.getFragment() as OverlayFragment;
	}
	appendText(text: string) {
		this.getFragment().append(text);
	}
	setText(text: string) {
		this.getFragment().setText(text);
	}
	getText() {
		return this.getFragment().getText();
	}
	setBackground(drawable: IDrawableJson) {
		this.getFragment().setBackground(drawable);
	}
	getBackground() {
		return this.getFragment().getBackground();
	}
}
