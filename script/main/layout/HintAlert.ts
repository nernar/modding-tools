/**
 * @deprecated DEPRECATED SECTION
 * All this will be removed as soon as possible.
 * @requires `isAndroid()`
 */
class HintAlert extends UniqueWindow {
	override readonly TYPE: string = "HintAlert";
	protected maximumHieracly: number = 3;
	protected autoReawait: boolean = true;
	protected consoleMode: boolean = false;
	protected stackable: boolean = true;
	protected forever: boolean = false;
	protected time: number = 3000;
	protected stack: [hint: string, color?: number][];
	protected action?: Action;

	constructor() {
		super();
		this.clearStack();
	}
	resetWindow() {
		super.resetWindow();
		this.setGravity($.Gravity.LEFT | $.Gravity.BOTTOM);
		this.setWidth($.ViewGroup.LayoutParams.MATCH_PARENT);
		this.setTouchable(false);

		let actor = new android.transition.Slide($.Gravity.BOTTOM),
			interpolator = new android.view.animation.DecelerateInterpolator();
		actor.setInterpolator(interpolator);
		actor.setDuration(this.getTime() / 6);
		this.setEnterTransition(actor);

		let actorSet = new android.transition.TransitionSet(),
			slide = new android.transition.Slide($.Gravity.BOTTOM),
			fade = new android.transition.Fade(android.transition.Visibility.MODE_OUT);
		actorSet.addTransition(slide);
		actorSet.addTransition(fade);
		actorSet.setDuration(this.getTime() / 6);
		this.setExitTransition(actorSet);

		this.resetContent();
	}
	resetContent() {
		let content = new android.widget.LinearLayout(getContext());
		content.setGravity($.Gravity.LEFT | $.Gravity.BOTTOM);
		content.setOrientation($.LinearLayout.VERTICAL);
		this.setLayout(content);
	}
	attachMessage(hint: string, color?: number, background?: IDrawableJson) {
		if (!this.canStackedMore()) {
			return null;
		}

		let layout = new android.widget.LinearLayout(getContext());
		layout.setPadding(toComplexUnitDip(32), toComplexUnitDip(10),
			toComplexUnitDip(32), toComplexUnitDip(10));
		try {
			if (background !== undefined) {
				if (!(background instanceof Drawable)) {
					background = Drawable.parseJson.call(this, background);
				}
			} else {
				background = new BitmapDrawable("popup");
			}
		} catch (e) {
			log("Modding Tools: HintAlert.attachMessage: " + e);
		}
		if (background) background.attachAsBackground(layout);
		layout.setOrientation($.LinearLayout.VERTICAL);
		layout.setGravity($.Gravity.CENTER);
		let content = this.getLayout();
		layout.setVisibility($.View.GONE);
		content.addView(layout, new android.widget.LinearLayout.LayoutParams($.ViewGroup.LayoutParams.WRAP_CONTENT, $.ViewGroup.LayoutParams.WRAP_CONTENT));

		let text = new android.widget.TextView(getContext());
		text.setTextSize(toComplexUnitDp(8));
		text.setText(hint !== undefined ? "" + hint : translate("Nothing"));
		if (!this.inConsoleMode()) text.setGravity($.Gravity.CENTER);
		text.setTextColor(color || $.Color.WHITE);
		typeface && text.setTypeface(typeface);
		text.setMinimumWidth(toComplexUnitDip(128));
		layout.addView(text);

		let actor = new android.transition.TransitionSet();
		actor.setOrdering(android.transition.TransitionSet.ORDERING_TOGETHER);
		let bounds = new android.transition.ChangeBounds(), fade = new android.transition.Fade();
		actor.setInterpolator(new android.view.animation.OvershootInterpolator());
		actor.setDuration(this.getTime() / 8);
		actor.addTransition(bounds);
		actor.addTransition(fade);
		this.beginDelayedTransition(actor);
		layout.setVisibility($.View.VISIBLE);
		return layout;
	}
	getMaximumStackedLimit() {
		return this.maximumHieracly != 0 ? this.maximumHieracly : 1;
	}
	getStackedCount() {
		return this.getLayout().getChildCount();
	}
	toInfinityStack() {
		this.setMaximumStacked(-1);
	}
	setMaximumStacked(count: number) {
		if (count == -1 || count > 0) {
			this.maximumHieracly = count;
		}
	}
	canStackedMore() {
		let limit = this.getMaximumStackedLimit();
		if (limit == -1) {
			let height = this.getLayout().getHeight();
			if (getDisplayHeight() - height < toComplexUnitDip(24)) {
				limit = 0;
			}
		}
		return limit == -1 || (this.getStackedCount() < limit);
	}
	inConsoleMode() {
		return this.consoleMode;
	}
	setConsoleMode(mode: boolean) {
		this.consoleMode = !!mode;
	}
	forceAddMessage(hint: string, color?: number, force?: boolean) {
		if (!this.inConsoleMode() && this.findStackedHint(hint)) {
			this.flashHint(hint, color);
		} else if (this.canStackedMore()) {
			this.attachMessage(hint, color);
		} else if ((!this.isPinned() && this.inConsoleMode()) || (!this.isPinned() && this.isStackable() && !this.alreadyHasHint(hint))) {
			this.addToStack(hint, color);
		} else if (!this.isStackable() || (this.isPinned() && this.inConsoleMode())) {
			this.removeFirstStacked();
			this.attachMessage(hint, color);
		}
		if (force || (this.hasAutoReawait() && force !== false && (this.isStackable() ? !this.hasMoreStack() : true))) {
			this.reawait();
		}
	}
	addMessage(hint: string, color?: number, force?: boolean) {
		if (this.getStackedCount() > 0 && (this.inConsoleMode() && !this.isPinned())) {
			this.addToStack(hint, color);
			if (force) this.reawait();
		} else {
			this.forceAddMessage(hint, color, force);
		}
	}
	removeFirstStacked() {
		let content = this.getLayout();
		if (content.getChildCount() > 0) {
			let actor = new android.transition.Fade();
			actor.setDuration(this.time / 12);
			this.beginDelayedTransition(actor);
			content.removeViewAt(0);
		}
	}
	next(force?: boolean) {
		if (!force) {
			this.reawait();
		}
		if (this.hasMoreStack()) {
			let message = this.stack.shift();
			if (!this.canStackedMore()) {
				this.removeFirstStacked();
			}
			this.forceAddMessage(message[0], message[1]);
			return true;
		}
		this.removeFirstStacked();
		return this.getStackedCount() > 0;
	}
	isPinned() {
		return this.forever;
	}
	pin() {
		this.forever = true;
	}
	unpin() {
		this.forever = false;
	}
	isStackable() {
		return this.stackable;
	}
	setStackable(enabled: boolean) {
		this.stackable = !!enabled;
	}
	addToStack(hint: string, color?: number) {
		if (maximumHints == -1 || this.stack.length > maximumHints - 1) {
			this.stack.pop();
		}
		this.isStackable() && this.stack.push(["" + hint, color]);
	}
	stackIndex(hint: string) {
		if (!this.isStackable()) {
			return -1;
		}
		for (let offset = 0; offset < this.stack.length; offset++) {
			if (this.stack[offset][0] == "" + hint) {
				return offset;
			}
		}
		return -1;
	}
	findStackedHint(hint) {
		let content = this.getLayout();
		for (let offset = 0; offset < content.getChildCount(); offset++) {
			let view = content.getChildAt(offset);
			if (view !== null && view instanceof android.view.ViewGroup && view.getChildCount() > 0) {
				let text = view.getChildAt(0);
				if (text !== null && text instanceof android.widget.TextView && (offset === hint || text.getText() == "" + hint)) {
					return text;
				}
			}
		}
		return null;
	}
	hasMoreStack() {
		return this.isStackable() ? this.stack.length > 0 : false;
	}
	alreadyHasHint(hint: string) {
		let stacked = this.stackIndex(hint) != -1;
		return stacked || this.findStackedHint(hint) !== null;
	}
	clearStack() {
		this.stack = [];
	}
	hasAutoReawait() {
		return this.autoReawait;
	}
	setAutoReawait(enabled: boolean) {
		this.autoReawait = !!enabled;
	}
	flashHint(hint: string, color?: number) {
		let view = this.findStackedHint(hint);
		if (view === null) return false;
		let actor = new android.transition.Fade();
		actor.setInterpolator(new android.view.animation.CycleInterpolator(1.3));
		actor.setDuration(this.time / 8);
		view.setVisibility($.View.INVISIBLE);
		this.beginDelayedTransition(actor);
		if (color !== undefined) view.setTextColor(color);
		view.setVisibility($.View.VISIBLE);
		log("Modding Tools: flashHint: " + hint);
		this.reawait();
		return true;
	}
	getTime() {
		return this.time !== undefined ? this.time : 3000;
	}
	setTime(ms: number) {
		ms > 0 && (this.time = preround(ms, 0));
		this.isOpened() && this.reawait();
	}
	reawait() {
		this.action && this.action.setCurrentTick(0);
	}
	override attach() {
		let scope = this;
		if (this.action == null) {
			this.action = handleAction(function () {
				handle.call(this, function () {
					if (scope.next(true)) {
						this.run();
						return;
					}
					scope.dismiss();
				});
			}, function () {
				if (scope.isPinned()) scope.reawait();
				return scope.action && scope.isAttached();
			}, this.getTime());
			this.action.setOnCancelListener(function () {
				scope.hasMoreStack() && scope.clearStack();
				scope.action.complete();
				scope.action.destroy();
				delete scope.action;
			});
			return super.attach();
		}
		this.reawait();
		return false;
	}
	override dismiss() {
		if (this.action != null) {
			this.action.destroy();
			delete this.action;
		}
		super.dismiss();
	}
}
