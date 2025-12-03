/**
 * @deprecated DEPRECATED SECTION
 * All this will be removed as soon as possible.
 * @requires `isAndroid()`
 */
class MenuWindow extends UniqueWindow {
	override readonly TYPE: string = "MenuWindow";
	views: {
		layout: android.widget.LinearLayout,
		scroll: android.widget.ScrollView,
	};
	protected elements: MenuWindow.Elements[];
	protected outside?: boolean = true;
	protected background?: IDrawableJson;
	protected __click?: (window: MenuWindow) => void;

	constructor() {
		super();
		this.elements = [];
	}
	override resetWindow() {
		super.resetWindow();
		this.elements = [];

		this.setWidth($.ViewGroup.LayoutParams.MATCH_PARENT);
		this.setHeight($.ViewGroup.LayoutParams.MATCH_PARENT);
		this.resetContent();
		this.setBackground("popupControl");

		let slideIn = new android.transition.Slide(), slideOut = new android.transition.Slide();
		slideIn.setInterpolator(new android.view.animation.DecelerateInterpolator());
		slideIn.setSlideEdge($.Gravity.TOP);
		slideIn.setDuration(1000);
		this.setEnterTransition(slideIn);
		slideOut.setInterpolator(new android.view.animation.AnticipateInterpolator());
		slideOut.setSlideEdge($.Gravity.TOP);
		slideOut.setDuration(800);
		this.setExitTransition(slideOut);
	}
	resetContent() {
		let views = this.views = {} as typeof this.views;

		let content = new android.widget.FrameLayout(getContext());
		content.setOnClickListener((() => {
			try {
				this.click && this.click();
			} catch (e) {
				reportError(e);
			}
		}) as any);
		this.setLayout(content);

		views.scroll = new android.widget.ScrollView(getContext());
		content.addView(views.scroll, new android.widget.FrameLayout.LayoutParams($.ViewGroup.LayoutParams.MATCH_PARENT, $.ViewGroup.LayoutParams.WRAP_CONTENT));

		views.layout = new android.widget.LinearLayout(getContext());
		views.layout.setGravity($.Gravity.TOP | $.Gravity.CENTER);
		views.layout.setOrientation($.LinearLayout.VERTICAL);
		views.layout.setOnClickListener((() => {
			try {
				this.click && this.click();
			} catch (e) {
				reportError(e);
			}
		}) as any);
		views.scroll.addView(views.layout, new android.view.ViewGroup.LayoutParams($.ViewGroup.LayoutParams.MATCH_PARENT, $.ViewGroup.LayoutParams.MATCH_PARENT));
	}
	getBackground() {
		return this.background || null;
	}
	setBackground(src: IDrawableJson) {
		if (isAndroid()) {
			let content = this.getLayout();
			if (!(src instanceof Drawable)) {
				src = Drawable.parseJson.call(this, src);
			}
			src.attachAsBackground(content);
		}
		this.background = src;
		return this;
	}
	addElement(element: MenuWindow.Elements) {
		let window = element.getWindow();
		if (window != null) {
			if (window != this) {
				MCSystem.throwException("Modding Tools: MenuWindow.addElement received element that is already attached to another window!");
			}
		} else {
			element.setWindow(this);
		}
		if (this.indexOfElement(element) == -1) {
			this.getElements().push(element);
		}
		return element;
	}
	getElementAt(index: number) {
		return this.getElements()[index] || null;
	}
	getElements() {
		return this.elements;
	}
	getElementCount() {
		return this.getElements().length;
	}
	indexOfElement(item: MenuWindow.Elements) {
		return this.getElements().indexOf(item);
	}
	scrollTo(y: number, duration?: number) {
		if (isAndroid()) {
			let actor = new android.transition.ChangeScroll();
			actor.setInterpolator(new android.view.animation.AccelerateDecelerateInterpolator());
			if (duration !== undefined) actor.setDuration(duration);
			this.beginDelayedTransition(actor);
			this.views.scroll.scrollTo(this.views.scroll.getScrollX(), y);
		}
		return this;
	}
	scrollToElement(elementOrIndex: MenuWindow.Elements | number, duration?: number) {
		if (typeof elementOrIndex != "number") {
			elementOrIndex = this.indexOfElement(elementOrIndex);
		}
		if (isAndroid()) {
			let element = this.getElementAt(elementOrIndex);
			let content = element.getLayout();
			this.scrollTo(content.getY(), duration);
		}
		return this;
	}
	scrollDown(duration?: number) {
		if (isAndroid()) {
			this.scrollTo(this.views.layout.getMeasuredHeight(), duration);
		}
		return this;
	}
	removeElement(elementOrIndex: MenuWindow.Elements | number) {
		if (typeof elementOrIndex != "number") {
			elementOrIndex = this.indexOfElement(elementOrIndex);
		}
		let element = this.getElementAt(elementOrIndex);
		if (isAndroid()) {
			let set = new android.transition.TransitionSet(), fade = new android.transition.Fade(), bounds = new android.transition.ChangeBounds();
			bounds.setInterpolator(new android.view.animation.AccelerateInterpolator());
			bounds.setDuration(400);
			set.addTransition(bounds);
			fade.setDuration(200);
			set.addTransition(fade);
			this.beginDelayedTransition(set);
			this.views.layout.removeView(element.getLayout());
		}
		this.getElements().splice(elementOrIndex, 1);
		return this;
	}
	isCloseableOutside() {
		return this.outside;
	}
	setCloseableOutside(enabled: boolean) {
		this.outside = !!enabled;
		return this;
	}
	click() {
		this.outside && this.dismiss();
		this.__click && this.__click(this);
		return this;
	}
	setOnClickListener(listener: typeof this.__click) {
		this.__click = listener;
		return this;
	}
	addHeader(header?: MenuWindow.Header) {
		if (!(header instanceof MenuWindow.Header)) {
			header = new MenuWindow.Header(this);
		}
		if (this.indexOfElement(header) == -1) {
			this.getElements().push(header);
		}
		return header;
	}
	addProjectHeader(header?: MenuWindow.ProjectHeader) {
		if (!(header instanceof MenuWindow.ProjectHeader)) {
			header = new MenuWindow.ProjectHeader(this);
		}
		if (this.indexOfElement(header) == -1) {
			this.getElements().push(header);
		}
		return header;
	}
	addCategory(name?: string): MenuWindow.Category;
	addCategory(category: MenuWindow.Category, name?: string): MenuWindow.Category;
	addCategory(categoryOrName?: string | MenuWindow.Category, name?) {
		if (!(categoryOrName instanceof MenuWindow.Category)) {
			categoryOrName = new MenuWindow.Category(this, categoryOrName);
		} else {
			name && categoryOrName.setTitle(name);
		}
		if (this.indexOfElement(categoryOrName) == -1) {
			this.getElements().push(categoryOrName);
		}
		return categoryOrName;
	}
	addMessage(src?: IDrawableJson, text?: string, action?: (message: MenuWindow.Message) => void): MenuWindow.Message;
	addMessage(message?: MenuWindow.Message, src?: IDrawableJson, text?: string, action?: (message: MenuWindow.Message) => void): MenuWindow.Message;
	addMessage(messageOrSrc?: IDrawableJson | MenuWindow.Message, srcOrText?, textOrAction?, action?) {
		if (!(messageOrSrc instanceof MenuWindow.Message)) {
			messageOrSrc = new MenuWindow.Message(this, messageOrSrc, srcOrText, textOrAction);
		} else {
			srcOrText && messageOrSrc.setImage(srcOrText);
			textOrAction && messageOrSrc.setMessage(textOrAction);
			action && messageOrSrc.setOnClickListener(action);
		}
		if (this.indexOfElement(messageOrSrc) == -1) {
			this.getElements().push(messageOrSrc);
		}
		return messageOrSrc;
	}
}

namespace MenuWindow {
	export function parseJson(json: IMenuWindow): MenuWindow;
	export function parseJson(instance: MenuWindow, json?: IMenuWindow): MenuWindow;
	export function parseJson(instanceOrJson: MenuWindow | IMenuWindow, json?: IMenuWindow) {
		if (!(instanceOrJson instanceof MenuWindow)) {
			json = instanceOrJson;
			instanceOrJson = new MenuWindow();
		}
		json = calloutOrParse(this, json, instanceOrJson);
		while (instanceOrJson.getElementCount() > 0) {
			instanceOrJson.removeElement(0);
		}
		if (json === null || typeof json != "object") {
			return instanceOrJson;
		}
		if (json.hasOwnProperty("background")) {
			instanceOrJson.setBackground(calloutOrParse(json, json.background, [this, instanceOrJson]));
		}
		if (json.hasOwnProperty("click")) {
			instanceOrJson.setOnClickListener(parseCallback(json, json.click, [this, instanceOrJson]));
		}
		if (json.hasOwnProperty("closeable")) {
			instanceOrJson.setCloseableOutside(calloutOrParse(json, json.closeable, [this, instanceOrJson]));
		}
		if (json.hasOwnProperty("elements")) {
			let elements = calloutOrParse(json, json.elements, [this, instanceOrJson]);
			if (elements !== null && typeof elements == "object") {
				Array.isArray(elements) || (elements = [elements]);
				for (let offset = 0; offset < elements.length; offset++) {
					let element = calloutOrParse(elements, elements[offset], [this, json, instanceOrJson]);
					if (element !== null && typeof element == "object") {
						let instance: Elements;
						if (element.type == "header") {
							instance = MenuWindow.Header.parseJson.call(this, element);
						} else if (element.type == "projectHeader") {
							instance = MenuWindow.ProjectHeader.parseJson.call(this, element);
						} else if (element.type == "category") {
							instance = MenuWindow.Category.parseJson.call(this, element);
						} else if (element.type == "message") {
							instance = MenuWindow.Message.parseJson.call(this, element);
						} else {
							Logger.Log("Modding Tools: MenuWindow unable to parse " + (element as IElements).type, "WARNING");
							continue;
						}
						instance.setWindow(instanceOrJson);
						instanceOrJson.addElement(instance);
					}
				}
			}
		}
		return instanceOrJson;
	}

	export function hideCurrently() {
		let unique = UniqueHelper.getWindow("MenuWindow");
		if (unique !== null) unique.dismiss();
	}

	export class Header {
		views: {
			slide: android.widget.ImageView,
			layout: android.widget.LinearLayout,
			logo: android.widget.ImageView,
		};
		content: android.view.ViewGroup;
		protected window?: MenuWindow;
		protected cover?: IDrawableJson;
		protected maxScroll?: number;
		protected progress?: number;
		protected offset?: number;
		protected logo?: IDrawableJson;

		constructor(parent?: MenuWindow) {
			if (isAndroid()) {
				this.resetContent();
				this.updateSlideProgress();
			}
			this.setLogo(requireLogotype());
			this.setMaxScroll(toComplexUnitDip(320));
			if (!isInvertedLogotype()) {
				this.setCover("popupHeader");
			} else {
				this.setCover("popup");
			}
			parent && this.setWindow(parent);
		}
		resetContent() {
			let views = this.views = {} as typeof this.views;

			let content = new android.widget.FrameLayout(getContext());
			let params = new android.widget.LinearLayout.LayoutParams($.ViewGroup.LayoutParams.MATCH_PARENT, $.ViewGroup.LayoutParams.WRAP_CONTENT);
			params.bottomMargin = toComplexUnitDip(20);
			content.setLayoutParams(params);
			this.content = content;

			views.slide = new android.widget.ImageView(getContext());
			views.slide.setScaleX(3), views.slide.setScaleY(2);
			content.addView(views.slide, new android.widget.FrameLayout.LayoutParams($.ViewGroup.LayoutParams.MATCH_PARENT, $.ViewGroup.LayoutParams.MATCH_PARENT));

			views.layout = new android.widget.LinearLayout(getContext());
			views.layout.setGravity($.Gravity.CENTER);
			content.addView(views.layout, new android.widget.FrameLayout.LayoutParams($.ViewGroup.LayoutParams.MATCH_PARENT, $.ViewGroup.LayoutParams.MATCH_PARENT));

			views.logo = new android.widget.ImageView(getContext());
			params = new android.widget.LinearLayout.LayoutParams(toComplexUnitDip(208), toComplexUnitDip(208));
			params.leftMargin = params.topMargin =
				params.rightMargin = params.bottomMargin = toComplexUnitDip(8);
			views.layout.addView(views.logo, params);
		}
		getLayout() {
			return this.content || null;
		}
		getWindow() {
			return this.window || null;
		}
		setWindow(window: MenuWindow) {
			if (!(window instanceof MenuWindow)) {
				MCSystem.throwException("Modding Tools: MenuWindow.Header.setWindow requires MenuWindow, but received " + window + "!");
			}
			let elements = window.getElements();
			if (elements.indexOf(this) == -1) {
				elements.push(this);
			}
			this.window = window;
			if (isAndroid()) {
				let actor = new android.transition.ChangeBounds();
				actor.setDuration(600);
				window.beginDelayedTransition(actor);
				window.views.layout.addView(this.getLayout());
				this.setupScroll();
			}
			return this;
		}
		getCover() {
			return this.cover || null;
		}
		setCover(src: IDrawableJson) {
			if (isAndroid()) {
				if (!(src instanceof Drawable)) {
					src = Drawable.parseJson.call(this, src);
				}
				src.attachAsBackground(this.views.slide);
			}
			this.cover = src;
			return this;
		}
		getMaxScroll() {
			return this.maxScroll || 0;
		}
		setMaxScroll(y: number) {
			y > 0 && (this.maxScroll = y);
		}
		setupScroll() {
			let window = this.getWindow();
			if (window == null) {
				return this;
			}
			window.views.scroll.setOnScrollChangeListener(((view: android.widget.ScrollView, x: number, y: number) => {
				try {
					let contentY = this.content.getY(),
						logoY = this.views.logo.getY(),
						scrollOffsetY = y - contentY - logoY - toComplexUnitDip(8),
						scrollY = scrollOffsetY / this.getMaxScroll() * 100;
					this.setSlideProgress(scrollY > 100 ? 100 : scrollY < 0 ? 0 : scrollY);
				} catch (e) {
					reportError(e);
				}
			}) as any);
			window.setOnAttachListener(() => {
				window.getLayout().post((() => {
					try {
						// TODO: Sometimes not working at all
						this.updateSlideProgress();
					} catch (e) {
						reportError(e);
					}
				}) as any);
			});
			return this;
		}
		getSlideProgress() {
			return this.progress || 0;
		}
		setSlideProgress(percent: number) {
			if (percent < 0 || percent > 100) {
				return this;
			}
			if (percent > 1) {
				percent /= 100;
			}
			this.progress = percent;
			if (isAndroid()) {
				let translationY = -this.views.slide.getHeight() + this.views.logo.getHeight()
					* 0.1 + (this.offset || 0) - this.views.logo.getHeight() * percent;
				this.views.slide.setRotation(-8 + 8 * percent);
				this.views.slide.setTranslationY(translationY);
			}
			return this;
		}
		updateSlideProgress() {
			this.setSlideProgress(this.progress || 0);
		}
		setSlideOffset(y: number) {
			this.offset = y || 0;
			this.updateSlideProgress();
		}
		getLogo() {
			return this.logo || null;
		}
		setLogo(src: IDrawableJson) {
			if (isAndroid()) {
				if (!(src instanceof Drawable)) {
					src = Drawable.parseJson.call(this, src);
				}
				src.attachAsImage(this.views.logo);
			}
			this.logo = src;
			return this;
		}
	}

	export namespace Header {
		export function parseJson<JT extends MenuWindow.IHeader = MenuWindow.IHeader, RT extends MenuWindow.Header = MenuWindow.Header>(json: JT): RT;
		export function parseJson<JT extends MenuWindow.IHeader = MenuWindow.IHeader, RT extends MenuWindow.Header = MenuWindow.Header>(instance: MenuWindow.Header, json?: JT): RT;
		export function parseJson<JT extends MenuWindow.IHeader = MenuWindow.IHeader, RT extends MenuWindow.Header = MenuWindow.Header>(instanceOrJson: RT | JT, json?: JT): RT {
			if (!(instanceOrJson instanceof MenuWindow.Header)) {
				json = instanceOrJson;
				instanceOrJson = new MenuWindow.Header() as RT;
			}
			json = calloutOrParse(this, json, instanceOrJson);
			if (json === null || typeof json != "object") {
				return instanceOrJson;
			}
			if (json.hasOwnProperty("cover")) {
				instanceOrJson.setCover(calloutOrParse(json, json.cover, [this, instanceOrJson]));
			}
			if (json.hasOwnProperty("logotype")) {
				instanceOrJson.setLogo(calloutOrParse(json, json.logotype, [this, instanceOrJson]));
			}
			if (json.hasOwnProperty("maxScroll")) {
				instanceOrJson.setMaxScroll(calloutOrParse(json, json.maxScroll, [this, instanceOrJson]));
			}
			if (json.hasOwnProperty("slideOffset")) {
				instanceOrJson.setSlideOffset(calloutOrParse(json, json.slideOffset, [this, instanceOrJson]));
			}
			return instanceOrJson;
		}
	}

	export class ProjectHeader extends MenuWindow.Header {
		override views: {
			slide: android.widget.ImageView,
			layout: android.widget.LinearLayout,
			logo: android.widget.ImageView,
			background: android.widget.LinearLayout,
			scroll: android.widget.ScrollView,
			project: android.widget.LinearLayout,
		};
		protected categories: ProjectHeader.Category[];
		protected background?: IDrawableJson;

		constructor(parent?: MenuWindow) {
			super(parent);
			this.categories = [];
			if (isAndroid()) {
				this.resetContent();
				this.checkIfPlaceholderNeeded();
				this.updateSlideProgress();
			}
			this.setLogo(requireLogotype());
			projectHeaderBackground && this.setBackground("popupControl");
			this.setMaxScroll(toComplexUnitDip(320));
			if (!isInvertedLogotype()) {
				this.setCover("popupHeader");
			} else {
				this.setCover("popup");
			}
		}
		resetContent() {
			super.resetContent();
			let views = this.views;

			views.background = new android.widget.LinearLayout(getContext());
			let params = new android.widget.LinearLayout.LayoutParams(toComplexUnitDip(416), $.ViewGroup.LayoutParams.WRAP_CONTENT);
			params.leftMargin = toComplexUnitDip(32);
			params.topMargin = params.rightMargin =
				params.bottomMargin = toComplexUnitDip(16);
			views.layout.addView(views.background, params);

			views.scroll = new android.widget.ScrollView(getContext());
			views.background.addView(views.scroll, new android.widget.LinearLayout.LayoutParams(
				$.ViewGroup.LayoutParams.MATCH_PARENT, $.ViewGroup.LayoutParams.WRAP_CONTENT
			));

			views.project = new android.widget.LinearLayout(getContext());
			views.project.setOrientation($.LinearLayout.VERTICAL);
			views.project.setGravity($.Gravity.CENTER);
			views.scroll.addView(views.project);
		}
		getBackground() {
			return this.background || null;
		}
		setBackground(src: IDrawableJson) {
			if (isAndroid()) {
				if (!(src instanceof Drawable)) {
					src = Drawable.parseJson.call(this, src);
				}
				src.attachAsBackground(this.views.background);
			}
			this.background = src;
			return this;
		}
		checkIfPlaceholderNeeded() {
			let window = this.getWindow();
			if (window) {
				let set = new android.transition.TransitionSet();
				set.setInterpolator(new android.view.animation.AccelerateDecelerateInterpolator());
				let bounds = new android.transition.ChangeBounds();
				bounds.setDuration(1000);
				set.addTransition(bounds);
				let fade = new android.transition.Fade();
				fade.setDuration(400);
				set.addTransition(fade);
				window.beginDelayedTransition(set);
			}
			let requiresPlaceholder = this.getCategoryCount() > 0;
			this.setSlideOffset(requiresPlaceholder ? -toComplexUnitDip(24) : 0);
			this.views.background.setVisibility(requiresPlaceholder ? $.View.VISIBLE : $.View.GONE);
			return this;
		}
		addCategory(name?: string): ProjectHeader.Category;
		addCategory(category: ProjectHeader.Category, name?: string): ProjectHeader.Category;
		addCategory(categoryOrName: string | ProjectHeader.Category, name?) {
			if (!(categoryOrName instanceof ProjectHeader.Category)) {
				categoryOrName = new ProjectHeader.Category(this, categoryOrName);
			} else {
				name && categoryOrName.setTitle(name);
			}
			if (this.indexOfCategory(categoryOrName) == -1) {
				this.getCategories().push(categoryOrName);
			}
			if (isAndroid()) {
				this.updateSlideProgress();
				this.checkIfPlaceholderNeeded();
			}
			return categoryOrName;
		}
		getCategoryAt(index: number) {
			return this.getCategories()[index] || null;
		}
		getCategories() {
			return this.categories;
		}
		getCategoryCount() {
			return this.getCategories().length;
		}
		indexOfCategory(category: ProjectHeader.Category) {
			return this.getCategories().indexOf(category);
		}
		removeCategory(categoryOrIndex: ProjectHeader.Category | number) {
			if (typeof categoryOrIndex != "number") {
				categoryOrIndex = this.indexOfCategory(categoryOrIndex);
			}
			if (categoryOrIndex == -1) {
				return this;
			}
			let category = this.getCategoryAt(categoryOrIndex);
			this.getCategories().splice(categoryOrIndex, 1);
			if (isAndroid()) {
				let window = this.getWindow();
				if (window) {
					let actor = new android.transition.ChangeBounds();
					actor.setDuration(200);
					window.beginDelayedTransition(actor);
				}
				this.views.project.removeView(category.getLayout());
				this.updateSlideProgress();
				this.checkIfPlaceholderNeeded();
			}
			return this;
		}
	}

	export namespace ProjectHeader {
		export function parseJson<JT extends MenuWindow.IProjectHeader = MenuWindow.IProjectHeader, RT extends MenuWindow.ProjectHeader = MenuWindow.ProjectHeader>(json: JT): RT;
		export function parseJson<JT extends MenuWindow.IProjectHeader = MenuWindow.IProjectHeader, RT extends MenuWindow.ProjectHeader = MenuWindow.ProjectHeader>(instance: RT, json?: JT): RT;
		export function parseJson<JT extends MenuWindow.IProjectHeader = MenuWindow.IProjectHeader, RT extends MenuWindow.ProjectHeader = MenuWindow.ProjectHeader>(instanceOrJson: RT | JT, json?: JT): RT {
			if (!(instanceOrJson instanceof MenuWindow.ProjectHeader)) {
				json = instanceOrJson;
				instanceOrJson = new MenuWindow.ProjectHeader() as RT;
			}
			MenuWindow.Header.parseJson.call(this, instanceOrJson, json);
			json = calloutOrParse(this, json, instanceOrJson);
			while (instanceOrJson.getCategoryCount() > 0) {
				instanceOrJson.removeCategory(0);
			}
			if (json === null || typeof json != "object") {
				return instanceOrJson;
			}
			if (json.hasOwnProperty("background")) {
				instanceOrJson.setBackground(calloutOrParse(json, json.background, [this, instanceOrJson]));
			}
			if (json.hasOwnProperty("categories")) {
				let categories = calloutOrParse(json, json.categories, [this, instanceOrJson]);
				if (categories !== null && typeof categories == "object") {
					Array.isArray(categories) || (categories = [categories]);
					for (let offset = 0; offset < categories.length; offset++) {
						let category = calloutOrParse(categories, categories[offset], [this, json, instanceOrJson]);
						if (category !== null && typeof category == "object") {
							let instance = MenuWindow.ProjectHeader.Category.parseJson.call(this, category);
							instance.setParentHeader(instanceOrJson);
							instanceOrJson.addCategory(instance);
						}
					}
				}
			}
			return instanceOrJson;
		}

		export class Category {
			views: {
				title: android.widget.TextView,
			};
			content: android.view.ViewGroup;
			protected items: Category.Item[];
			protected header?: ProjectHeader;
			protected text?: string;
			protected __click?: (item: Category.Item, index: number) => void;
			protected __hold?: (item: Category.Item, index: number) => boolean | void;

			constructor(name?: string);
			constructor(parent: MenuWindow.ProjectHeader, name?: string);
			constructor(parentOrName?: MenuWindow.ProjectHeader | string, name?) {
				if (isAndroid()) {
					this.resetContent();
				}
				if (parentOrName instanceof MenuWindow.ProjectHeader) {
					this.setParentHeader(parentOrName);
					name && this.setTitle(name);
				} else {
					parentOrName && this.setTitle(parentOrName);
				}
				this.items = [];
			}
			resetContent() {
				let views = this.views = {} as typeof this.views;

				let content = new android.widget.LinearLayout(getContext());
				content.setOrientation($.LinearLayout.VERTICAL);
				let params = new android.widget.LinearLayout.LayoutParams($.ViewGroup.LayoutParams.MATCH_PARENT, $.ViewGroup.LayoutParams.MATCH_PARENT);
				params.topMargin = toComplexUnitDip(8);
				content.setLayoutParams(params);
				this.content = content;

				views.title = new android.widget.TextView(getContext());
				typeface && views.title.setTypeface(typeface);
				views.title.setTextSize(toComplexUnitDp(10));
				views.title.setTextColor($.Color.LTGRAY);
				views.title.setSingleLine();
				params = new android.widget.LinearLayout.LayoutParams($.ViewGroup.LayoutParams.MATCH_PARENT, $.ViewGroup.LayoutParams.WRAP_CONTENT);
				params.leftMargin = params.rightMargin = toComplexUnitDip(10);
				params.bottomMargin = toComplexUnitDip(5);
				content.addView(views.title, params);
			}
			getLayout() {
				return this.content || null;
			}
			getParentHeader() {
				return this.header || null;
			}
			setParentHeader(header?: ProjectHeader) {
				if (!(header instanceof ProjectHeader)) {
					MCSystem.throwException("Modding Tools: MenuWindow.ProjectHeader.Category.setParentHeader requires ProjectHeader, but received " + header + "!");
				}
				let categories = header.getCategories();
				if (categories.indexOf(this) == -1) {
					categories.push(this);
				}
				this.header = header;
				if (isAndroid()) {
					let window = header.getWindow();
					if (window) {
						let actor = new android.transition.ChangeBounds();
						actor.setDuration(400);
						window.beginDelayedTransition(actor);
					}
					header.views.project.addView(this.getLayout());
					header.updateSlideProgress();
					header.checkIfPlaceholderNeeded();
				}
				return this;
			}
			indexOf() {
				let header = this.getParentHeader();
				if (header != null) {
					return header.indexOfCategory(this);
				}
				return -1;
			}
			getTitle() {
				if (isAndroid()) {
					return this.views.title.getText();
				}
				return this.text || null;
			}
			setTitle(text: string) {
				if (isAndroid()) {
					this.views.title.setText("" + text);
				}
				this.text = text;
				return this;
			}
			addItem(src?: IDrawableJson, title?: string, description?: string, action?: (item: Category.Item) => void): Category.Item;
			addItem(item: Category.Item, src?: IDrawableJson, title?: string, description?: string, action?: (item: Category.Item) => void): Category.Item;
			addItem(itemOrSrc?: IDrawableJson | Category.Item, srcOrTitle?, titleOrDescription?, descriptionOrAction?, action?) {
				if (!(itemOrSrc instanceof Category.Item)) {
					itemOrSrc = new Category.Item(this, itemOrSrc, srcOrTitle, titleOrDescription, descriptionOrAction);
				} else {
					srcOrTitle && itemOrSrc.setImage(srcOrTitle);
					titleOrDescription && itemOrSrc.setTitle(titleOrDescription);
					descriptionOrAction && itemOrSrc.setDescription(descriptionOrAction);
					action && itemOrSrc.setOnClickListener(action);
				}
				if (this.indexOfItem(itemOrSrc) == -1) {
					this.getItems().push(itemOrSrc);
				}
				if (isAndroid()) {
					this.getParentHeader()?.updateSlideProgress();
				}
				return itemOrSrc;
			}
			getItemAt(index: number) {
				return this.getItems()[index] || null;
			}
			getItems() {
				return this.items;
			}
			getItemCount() {
				return this.getItems().length;
			}
			indexOfItem(item: Category.Item) {
				return this.getItems().indexOf(item);
			}
			removeItem(itemOrIndex: Category.Item | number) {
				if (typeof itemOrIndex != "number") {
					itemOrIndex = this.indexOfItem(itemOrIndex);
				}
				let item = this.getItemAt(itemOrIndex);
				if (isAndroid()) {
					let window = this.getParentHeader()?.getWindow();
					if (window) {
						let actor = new android.transition.ChangeBounds();
						actor.setDuration(200);
						window.beginDelayedTransition(actor);
					}
					this.content.removeView(item.getLayout());
					this.getParentHeader()?.updateSlideProgress();
				}
				this.getItems().splice(itemOrIndex, 1);
				return this;
			}
			setOnItemClickListener(listener: typeof this.__click) {
				this.__click = listener;
				return this;
			}
			setOnItemHoldListener(listener: typeof this.__hold) {
				this.__hold = listener;
				return this;
			}
			clickItem(item: Category.Item | number) {
				let index = typeof item != "number" ? this.indexOfItem(item) : item;
				if (index != -1) {
					if (!(item instanceof Category.Item)) {
						item = this.getItemAt(index);
					}
					this.__click(item, index);
				}
			}
			holdItem(item: Category.Item | number) {
				let index = typeof item != "number" ? this.indexOfItem(item) : item;
				if (index != -1) {
					if (!(item instanceof Category.Item)) {
						item = this.getItemAt(index);
					}
					return this.__hold(item, index);
				}
				return false;
			}
		}

		export namespace Category {
			export function parseJson(json: MenuWindow.ProjectHeader.ICategory): MenuWindow.ProjectHeader.Category;
			export function parseJson(instance: MenuWindow.ProjectHeader.Category, json?: MenuWindow.ProjectHeader.ICategory): MenuWindow.ProjectHeader.Category;
			export function parseJson(instanceOrJson: MenuWindow.ProjectHeader.Category | MenuWindow.ProjectHeader.ICategory, json?: MenuWindow.ProjectHeader.ICategory) {
				if (!(instanceOrJson instanceof MenuWindow.ProjectHeader.Category)) {
					json = instanceOrJson;
					instanceOrJson = new MenuWindow.ProjectHeader.Category();
				}
				json = calloutOrParse(this, json, instanceOrJson);
				while (instanceOrJson.getItemCount() > 0) {
					instanceOrJson.removeItem(0);
				}
				if (json === null || typeof json != "object") {
					return instanceOrJson;
				}
				if (json.hasOwnProperty("title")) {
					instanceOrJson.setTitle(calloutOrParse(json, json.title, [this, instanceOrJson]));
				}
				if (json.hasOwnProperty("clickItem")) {
					instanceOrJson.setOnItemClickListener(parseCallback(json, json.clickItem, [this, instanceOrJson]));
				}
				if (json.hasOwnProperty("holdItem")) {
					instanceOrJson.setOnItemHoldListener(parseCallback(json, json.holdItem, [this, instanceOrJson]));
				}
				if (json.hasOwnProperty("items")) {
					let items = calloutOrParse(json, json.items, [this, instanceOrJson]);
					if (items !== null && typeof items == "object") {
						Array.isArray(items) || (items = [items]);
						for (let offset = 0; offset < items.length; offset++) {
							let item = calloutOrParse(items, items[offset], [this, json, instanceOrJson]);
							if (item !== null && typeof item == "object") {
								let instance = MenuWindow.ProjectHeader.Category.Item.parseJson.call(this, item);
								instance.setParentCategory(instanceOrJson);
								instanceOrJson.addItem(instance);
							}
						}
					}
				}
				return instanceOrJson;
			}

			export class Item {
				views: {
					icon: android.widget.ImageView,
					more: android.widget.LinearLayout,
					title: android.widget.TextView,
					params: android.widget.TextView,
				};
				content: android.view.ViewGroup;
				protected category?: Category;
				protected background?: IDrawableJson;
				protected icon?: IDrawableJson;
				protected text?: string;
				protected description?: string;
				protected __click?: (item: Item) => void;
				protected __hold: (item: Item) => void | boolean;

				constructor(src?: IDrawableJson, title?: string, description?: string, action?: typeof this.__click);
				constructor(parent: MenuWindow.ProjectHeader.Category, src?: IDrawableJson, title?: string, description?: string, action?: typeof this.__click);
				constructor(parentOrSrc?: MenuWindow.ProjectHeader.Category | IDrawableJson, srcOrTitle?, titleOrDescription?, descriptionOrAction?, action?) {
					if (isAndroid()) {
						this.resetContent();
					}
					if (parentOrSrc instanceof MenuWindow.ProjectHeader.Category) {
						this.setParentCategory(parentOrSrc);
						srcOrTitle && this.setImage(srcOrTitle);
						titleOrDescription && this.setTitle(titleOrDescription);
						descriptionOrAction && this.setDescription(descriptionOrAction);
						action && this.setOnClickListener(action);
					} else {
						parentOrSrc && this.setImage(parentOrSrc);
						srcOrTitle && this.setTitle(srcOrTitle);
						titleOrDescription && this.setDescription(titleOrDescription);
						descriptionOrAction && this.setOnClickListener(descriptionOrAction);
					}
					this.setBackground("popup");
				}
				resetContent() {
					let views = this.views = {} as typeof this.views;

					let content = new android.widget.LinearLayout(getContext());
					content.setPadding(toComplexUnitDip(8), toComplexUnitDip(8),
						toComplexUnitDip(8), toComplexUnitDip(8));
					content.setGravity($.Gravity.CENTER);
					content.setOnClickListener((() => {
						try {
							this.click && this.click();
						} catch (e) {
							reportError(e);
						}
					}) as any);
					content.setOnLongClickListener((() => {
						try {
							return (this.hold && this.hold()) == true;
						} catch (e) {
							reportError(e);
						}
						return false;
					}) as any);
					content.setLayoutParams(new android.widget.LinearLayout.LayoutParams($.ViewGroup.LayoutParams.MATCH_PARENT, $.ViewGroup.LayoutParams.WRAP_CONTENT));
					this.content = content;

					views.icon = new android.widget.ImageView(getContext());
					let params = new android.widget.LinearLayout.LayoutParams(toComplexUnitDip(36), toComplexUnitDip(36));
					params.leftMargin = toComplexUnitDip(32);
					content.addView(views.icon, params);

					views.more = new android.widget.LinearLayout(getContext());
					views.more.setOrientation($.LinearLayout.VERTICAL);
					params = new android.widget.LinearLayout.LayoutParams($.ViewGroup.LayoutParams.MATCH_PARENT, $.ViewGroup.LayoutParams.WRAP_CONTENT);
					params.leftMargin = toComplexUnitDip(16);
					content.addView(views.more, params);

					views.title = new android.widget.TextView(getContext());
					typeface && views.title.setTypeface(typeface);
					views.title.setTextSize(toComplexUnitDp(9));
					views.title.setTextColor($.Color.WHITE);
					views.title.setSingleLine();
					views.more.addView(views.title);

					views.params = new android.widget.TextView(getContext());
					typeface && views.params.setTypeface(typeface);
					views.params.setPadding(0, toComplexUnitDip(3), 0, 0);
					views.params.setTextSize(toComplexUnitDp(8));
					views.params.setTextColor($.Color.LTGRAY);
					views.params.setMaxLines(3);
					views.more.addView(views.params);
				}
				getLayout() {
					return this.content || null;
				}
				indexOf() {
					return this.getParentCategory()?.indexOfItem(this) ?? 1;
				}
				getParentCategory() {
					return this.category || null;
				}
				setParentCategory(category: Category) {
					if (!(category instanceof Category)) {
						MCSystem.throwException("Modding Tools: MenuWindow.ProjectHeader.Category.Item.setParentCategory requires Category, but received " + category + "!");
					}
					let items = category.getItems();
					if (items.indexOf(this) == -1) {
						items.push(this);
					}
					this.category = category;
					if (isAndroid()) {
						let header = category.getParentHeader();
						if (header) {
							let window = header.getWindow();
							if (window) {
								let actor = new android.transition.ChangeBounds();
								actor.setDuration(400);
								window.beginDelayedTransition(actor);
							}
							header.updateSlideProgress();
						}
						category.getLayout().addView(this.getLayout());
					}
					return this;
				}
				getBackground() {
					return this.background || null;
				}
				setBackground(src: IDrawableJson) {
					if (isAndroid()) {
						if (!(src instanceof Drawable)) {
							src = Drawable.parseJson.call(this, src);
						}
						src.attachAsBackground(this.getLayout());
					}
					this.background = src;
					return this;
				}
				getImage() {
					return this.icon || null;
				}
				setImage(src: IDrawableJson) {
					if (isAndroid()) {
						if (!(src instanceof Drawable)) {
							src = Drawable.parseJson.call(this, src);
						}
						src.attachAsImage(this.views.icon);
					}
					this.icon = src;
					return this;
				}
				getTitle() {
					if (isAndroid()) {
						return this.views.title.getText();
					}
					return this.text || null;
				}
				setTitle(text: string) {
					if (isAndroid()) {
						this.views.title.setText("" + text);
					}
					this.text = text;
					return this;
				}
				getDescription() {
					if (isAndroid()) {
						return this.views.params.getText();
					}
					return this.description || null;
				}
				setDescription(text: string) {
					if (isAndroid()) {
						this.views.params.setText("" + text);
					}
					this.description = text;
					return this;
				}
				click() {
					this.__click && this.__click(this);
					this.getParentCategory()?.clickItem(this);
					return this;
				}
				hold() {
					let clicked = false;
					if (this.__hold && this.__hold(this)) {
						clicked = true;
					}
					if (this.getParentCategory()?.holdItem(this)) {
						clicked = true;
					}
					return clicked;
				}
				setOnClickListener(listener: typeof this.__click) {
					this.__click = listener;
					return this;
				}
				setOnHoldListener(listener: typeof this.__hold) {
					this.__hold = listener;
					return this;
				}
			}

			export namespace Item {
				export function parseJson(json: MenuWindow.ProjectHeader.Category.IItem): MenuWindow.ProjectHeader.Category.Item;
				export function parseJson(instance: MenuWindow.ProjectHeader.Category.Item, json?: MenuWindow.ProjectHeader.Category.IItem): MenuWindow.ProjectHeader.Category.Item;
				export function parseJson(instanceOrJson: MenuWindow.ProjectHeader.Category.Item | MenuWindow.ProjectHeader.Category.IItem, json?: MenuWindow.ProjectHeader.Category.IItem) {
					if (!(instanceOrJson instanceof MenuWindow.ProjectHeader.Category.Item)) {
						json = instanceOrJson;
						instanceOrJson = new MenuWindow.ProjectHeader.Category.Item();
					}
					json = calloutOrParse(this, json, instanceOrJson);
					if (json === null || typeof json != "object") {
						return instanceOrJson;
					}
					if (json.hasOwnProperty("background")) {
						instanceOrJson.setBackground(calloutOrParse(json, json.background, [this, instanceOrJson]));
					}
					if (json.hasOwnProperty("icon")) {
						instanceOrJson.setImage(calloutOrParse(json, json.icon, [this, instanceOrJson]));
					}
					if (json.hasOwnProperty("title")) {
						instanceOrJson.setTitle(calloutOrParse(json, json.title, [this, instanceOrJson]));
					}
					if (json.hasOwnProperty("description")) {
						instanceOrJson.setDescription(calloutOrParse(json, json.description, [this, instanceOrJson]));
					}
					if (json.hasOwnProperty("click")) {
						instanceOrJson.setOnClickListener(parseCallback(json, json.click, [this, instanceOrJson]));
					}
					if (json.hasOwnProperty("hold")) {
						instanceOrJson.setOnHoldListener(parseCallback(json, json.hold, [this, instanceOrJson]));
					}
					return instanceOrJson;
				}
			}
		}
	}

	export class Category {
		content: android.view.ViewGroup;
		views: {
			title: android.widget.TextView,
			layout: android.widget.GridLayout,
		};
		protected items: Category.Item[];
		protected window?: MenuWindow;
		protected text?: string;
		protected __click?: (item: Category.Item, index: number) => void;
		protected __hold?: (item: Category.Item, index: number) => void | boolean;

		constructor(name?: string);
		constructor(parent: MenuWindow, name?: string);
		constructor(parentOrName?: MenuWindow | string, name?) {
			if (isAndroid()) {
				this.resetContent();
			}
			this.items = [];
			if (parentOrName instanceof MenuWindow) {
				this.setWindow(parentOrName);
				name && this.setTitle(name);
			} else {
				parentOrName && this.setTitle(parentOrName);
			}
		}
		resetContent() {
			let views = this.views = {} as typeof this.views;

			let content = new android.widget.LinearLayout(getContext());
			content.setOrientation($.LinearLayout.VERTICAL);
			content.setGravity($.Gravity.CENTER);
			content.setClipToPadding(false);
			content.setClipChildren(false);
			let params = new android.widget.LinearLayout.LayoutParams(
				$.ViewGroup.LayoutParams.WRAP_CONTENT, $.ViewGroup.LayoutParams.WRAP_CONTENT
			);
			params.topMargin = toComplexUnitDip(10);
			content.setLayoutParams(params);
			this.content = content;

			views.title = new android.widget.TextView(getContext());
			typeface && views.title.setTypeface(typeface);
			views.title.setTextSize(toComplexUnitDp(12));
			views.title.setTextColor($.Color.LTGRAY);
			let params2 = new android.widget.LinearLayout.LayoutParams(
				$.ViewGroup.LayoutParams.MATCH_PARENT, $.ViewGroup.LayoutParams.WRAP_CONTENT
			);
			params2.leftMargin = params2.rightMargin = toComplexUnitDip(21);
			params2.bottomMargin = toComplexUnitDip(5);
			content.addView(views.title, params2);

			views.layout = new android.widget.GridLayout(getContext());
			views.layout.setColumnCount(Math.floor(getDisplayWidth() / toComplexUnitDip(168)));
			views.layout.setClipToPadding(false);
			views.layout.setClipChildren(false);
			content.addView(views.layout);
		}
		getLayout() {
			return this.content || null;
		}
		getWindow() {
			return this.window || null;
		}
		setWindow(window: MenuWindow) {
			if (!(window instanceof MenuWindow)) {
				MCSystem.throwException("Modding Tools: MenuWindow.Category.setWindow requires MenuWindow, but received " + window + "!");
			}
			let elements = window.getElements();
			if (elements.indexOf(this) == -1) {
				elements.push(this);
			}
			this.window = window;
			if (isAndroid()) {
				let actor = new android.transition.ChangeBounds();
				actor.setDuration(400);
				window.beginDelayedTransition(actor);
				window.views.layout.addView(this.getLayout());
			}
			return this;
		}
		getTitle() {
			if (isAndroid()) {
				return this.views.title.getText();
			}
			return this.text;
		}
		setTitle(text: string) {
			if (isAndroid()) {
				this.views.title.setText("" + text);
			}
			this.text = text;
			return this;
		}
		addItem(src?: IDrawableJson, title?: string, action?: (item: Category.Item) => void): Category.Item;
		addItem(item: Category.Item, src?: IDrawableJson, title?: string, action?: (item: Category.Item) => void): Category.Item;
		addItem(itemOrSrc?: IDrawableJson | Category.Item, srcOrTitle?, titleOrAction?, action?) {
			if (!(itemOrSrc instanceof Category.Item)) {
				itemOrSrc = new Category.Item(this, itemOrSrc, titleOrAction, action);
			} else {
				srcOrTitle && itemOrSrc.setImage(srcOrTitle);
				titleOrAction && itemOrSrc.setTitle(titleOrAction);
				action && itemOrSrc.setOnClickListener(action);
			}
			if (this.indexOfItem(itemOrSrc) == -1) {
				this.getItems().push(itemOrSrc);
			}
			return itemOrSrc;
		}
		getItemAt(index: number) {
			return this.getItems()[index] || null;
		}
		getItems() {
			return this.items;
		}
		getItemCount() {
			return this.getItems().length;
		}
		indexOfItem(item: Category.Item) {
			return this.getItems().indexOf(item);
		}
		removeItem(itemOrIndex: Category.Item | number) {
			if (typeof itemOrIndex != "number") {
				itemOrIndex = this.indexOfItem(itemOrIndex);
			}
			let item = this.getItemAt(itemOrIndex);
			if (isAndroid()) {
				let window = this.getWindow();
				if (window) {
					let actor = new android.transition.ChangeBounds();
					actor.setDuration(200);
					window.beginDelayedTransition(actor);
				}
				this.views.layout.removeView(item.getLayout());
			}
			this.getItems().splice(itemOrIndex, 1);
			return this;
		}
		setOnItemClickListener(listener: typeof this.__click) {
			this.__click = listener;
			return this;
		}
		setOnHoldItemListener(listener: typeof this.__hold) {
			this.__hold = listener;
			return this;
		}
		clickItem(item: Category.Item | number) {
			let index = typeof item != "number" ? this.indexOfItem(item) : item;
			if (index != -1) {
				if (!(item instanceof Category.Item)) {
					item = this.getItemAt(index);
				}
				this.__click(item, index);
			}
		}
		holdItem(item: Category.Item | number) {
			let index = typeof item != "number" ? this.indexOfItem(item) : item;
			if (index != -1) {
				if (!(item instanceof Category.Item)) {
					item = this.getItemAt(index);
				}
				return this.__hold(item, index);
			}
			return false;
		}
	}

	export namespace Category {
		export function parseJson(instanceOrJson: MenuWindow.Category | MenuWindow.ICategory, json?: MenuWindow.ICategory) {
			if (!(instanceOrJson instanceof MenuWindow.Category)) {
				json = instanceOrJson;
				instanceOrJson = new MenuWindow.Category();
			}
			json = calloutOrParse(this, json, instanceOrJson);
			while (instanceOrJson.getItemCount() > 0) {
				instanceOrJson.removeItem(0);
			}
			if (json === null || typeof json != "object") {
				return instanceOrJson;
			}
			if (json.hasOwnProperty("title")) {
				instanceOrJson.setTitle(calloutOrParse(json, json.title, [this, instanceOrJson]));
			}
			if (json.hasOwnProperty("clickItem")) {
				instanceOrJson.setOnItemClickListener(parseCallback(json, json.clickItem, [this, instanceOrJson]));
			}
			if (json.hasOwnProperty("holdItem")) {
				instanceOrJson.setOnHoldItemListener(parseCallback(json, json.holdItem, [this, instanceOrJson]));
			}
			if (json.hasOwnProperty("items")) {
				let items = calloutOrParse(json, json.items, [this, instanceOrJson]);
				if (items !== null && typeof items == "object") {
					Array.isArray(items) || (items = [items]);
					for (let offset = 0; offset < items.length; offset++) {
						let item = calloutOrParse(items, items[offset], [this, json, instanceOrJson]);
						if (item !== null && typeof item == "object") {
							let instance = MenuWindow.Category.Item.parseJson.call(this, item);
							instance.setParentCategory(instanceOrJson);
							instanceOrJson.addItem(instance);
						}
					}
				}
			}
			return instanceOrJson;
		}

		export class Item {
			content: android.widget.FrameLayout;
			views: {
				content: android.widget.LinearLayout,
				icon: android.widget.ImageView,
				title: android.widget.TextView,
				badgeOverlay: android.widget.ImageView,
				badgeText: android.widget.TextView,
			};
			protected category?: Category;
			protected background?: IDrawableJson;
			protected icon?: IDrawableJson;
			protected badgeOverlay?: IDrawableJson;
			protected text?: string;
			protected badgeText?: string;
			protected __click?: (item: Item) => void;
			protected __hold?: (item: Item) => boolean | void;

			constructor(src?: IDrawableJson, title?: string, action?: typeof this.__click);
			constructor(parent: MenuWindow.Category, src?: IDrawableJson, title?: string, action?: typeof this.__click);
			constructor(parentOrSrc?: MenuWindow.Category | IDrawableJson, srcOrTitle?, titleOrAction?, action?) {
				if (isAndroid()) {
					this.resetContent();
				}
				if (parentOrSrc instanceof MenuWindow.Category) {
					this.setParentCategory(parentOrSrc);
					srcOrTitle && this.setImage(srcOrTitle);
					titleOrAction && this.setTitle(titleOrAction);
					action && this.setOnClickListener(action);
				} else {
					parentOrSrc && this.setImage(parentOrSrc);
					srcOrTitle && this.setTitle(srcOrTitle);
					titleOrAction && this.setOnClickListener(titleOrAction);
				}
				this.setBackground("popup");
			}
			resetContent() {
				let views = this.views = {} as typeof this.views;

				let layout = new android.widget.FrameLayout(getContext());
				layout.setClipToPadding(false);
				layout.setClipChildren(false);
				let params = new android.widget.GridLayout.LayoutParams();
				params.width = toComplexUnitDip(168);
				params.height = toComplexUnitDip(192);
				layout.setLayoutParams(params);
				this.content = layout;

				views.content = new android.widget.LinearLayout(getContext());
				views.content.setOrientation($.LinearLayout.VERTICAL);
				views.content.setGravity($.Gravity.CENTER);
				views.content.setOnClickListener((() => {
					try {
						this.click && this.click();
					} catch (e) {
						reportError(e);
					}
				}) as any);
				views.content.setOnLongClickListener((() => {
					try {
						return (this.hold && this.hold()) == true;
					} catch (e) {
						reportError(e);
					}
					return false;
				}) as any);
				layout.addView(views.content, new android.widget.FrameLayout.LayoutParams(toComplexUnitDip(160), toComplexUnitDip(184)));
				views.content.setX(toComplexUnitDip(4));
				views.content.setY(toComplexUnitDip(4));

				views.icon = new android.widget.ImageView(getContext());
				views.content.addView(views.icon, new android.widget.LinearLayout.LayoutParams(toComplexUnitDip(128), toComplexUnitDip(96)));

				views.title = new android.widget.TextView(getContext());
				typeface && views.title.setTypeface(typeface);
				views.title.setTextSize(toComplexUnitDp(11));
				views.title.setTextColor($.Color.WHITE);
				views.title.setSingleLine();
				let params2 = new android.widget.LinearLayout.LayoutParams($.ViewGroup.LayoutParams.WRAP_CONTENT, $.ViewGroup.LayoutParams.WRAP_CONTENT);
				params2.topMargin = toComplexUnitDip(11);
				views.content.addView(views.title, params2);

				views.badgeOverlay = new android.widget.ImageView(getContext());
				layout.addView(views.badgeOverlay, new android.widget.LinearLayout.LayoutParams(toComplexUnitDip(128), toComplexUnitDip(128)));
				views.badgeOverlay.setX(-toComplexUnitDip(4));
				views.badgeOverlay.setY(-toComplexUnitDip(4));

				views.badgeText = new android.widget.TextView(getContext());
				typeface && views.badgeText.setTypeface(typeface);
				views.badgeText.setTextSize(toComplexUnitDp(11));
				views.badgeText.setGravity($.Gravity.TOP | $.Gravity.CENTER);
				views.badgeText.setTextColor($.Color.WHITE);
				views.badgeText.setSingleLine();
				views.badgeText.setRotation(-45);
				layout.addView(views.badgeText);
				views.badgeText.setX(toComplexUnitDip(20));
				views.badgeText.setY(toComplexUnitDip(7));
			}
			getLayout() {
				return this.content || null;
			}
			indexOf() {
				let category = this.getParentCategory();
				return category ? category.indexOfItem(this) : -1;
			}
			getParentCategory() {
				return this.category || null;
			}
			setParentCategory(category: Category) {
				if (!(category instanceof Category)) {
					MCSystem.throwException("Modding Tools: MenuWindow.Category.Item.setParentCategory requires Category, but received " + category + "!");
				}
				let items = category.getItems();
				if (items.indexOf(this) == -1) {
					items.push(this);
				}
				this.category = category;
				if (isAndroid()) {
					let window = category.getWindow();
					if (window) {
						let actor = new android.transition.ChangeBounds();
						actor.setDuration(600);
						window.beginDelayedTransition(actor);
					}
					category.views.layout.addView(this.getLayout());
				}
				return this;
			}
			getBackground() {
				return this.background || null;
			}
			setBackground(src: IDrawableJson) {
				if (isAndroid()) {
					if (!(src instanceof Drawable)) {
						src = Drawable.parseJson.call(this, src);
					}
					src.attachAsBackground(this.views.content);
				}
				this.background = src;
				return this;
			}
			getImage() {
				return this.icon || null;
			}
			setImage(src: IDrawableJson) {
				if (isAndroid()) {
					if (!(src instanceof Drawable)) {
						src = Drawable.parseJson.call(this, src);
					}
					src.attachAsImage(this.views.icon);
				}
				this.icon = src;
				return this;
			}
			getBadgeOverlay() {
				return this.badgeOverlay || null;
			}
			setBadgeOverlay(src: IDrawableJson) {
				if (isAndroid()) {
					if (!(src instanceof Drawable)) {
						src = Drawable.parseJson.call(this, src);
					}
					src.attachAsImage(this.views.badgeOverlay);
				}
				this.badgeOverlay = src;
				return this;
			}
			getTitle() {
				if (isAndroid()) {
					return this.views.title.getText();
				}
				return this.text;
			}
			setTitle(text: string) {
				if (isAndroid()) {
					this.views.title.setText(text ? "" + text : null);
				}
				this.text = text;
				return this;
			}
			getBadgeText() {
				if (isAndroid()) {
					return this.views.badgeText.getText();
				}
				return this.badgeText;
			}
			setBadgeText(text: string) {
				if (isAndroid()) {
					this.views.badgeText.setText(text ? "" + text : null);
				}
				this.badgeText = text;
				return this;
			}
			click() {
				this.__click && this.__click(this);
				this.getParentCategory()?.clickItem(this);
				return this;
			}
			hold() {
				let clicked = false;
				if (this.__hold && this.__hold(this)) {
					clicked = true;
				}
				if (this.getParentCategory()?.holdItem(this)) {
					clicked = true;
				}
				return clicked;
			}
			setOnClickListener(listener: typeof this.__click) {
				this.__click = listener;
				return this;
			}
			setOnHoldListener(listener: typeof this.__hold) {
				this.__hold = listener;
				return this;
			}
		}

		export namespace Item {
			export function parseJson(json: MenuWindow.Category.IItem): MenuWindow.Category.Item;
			export function parseJson(instance: MenuWindow.Category.Item, json?: MenuWindow.Category.IItem): MenuWindow.Category.Item;
			export function parseJson(instanceOrJson: MenuWindow.Category.Item | MenuWindow.Category.IItem, json?: MenuWindow.Category.IItem) {
				if (!(instanceOrJson instanceof MenuWindow.Category.Item)) {
					json = instanceOrJson;
					instanceOrJson = new MenuWindow.Category.Item();
				}
				json = calloutOrParse(this, json, instanceOrJson);
				if (json === null || typeof json != "object") {
					return instanceOrJson;
				}
				if (json.hasOwnProperty("background")) {
					instanceOrJson.setBackground(calloutOrParse(json, json.background, [this, instanceOrJson]));
				}
				if (json.hasOwnProperty("icon")) {
					instanceOrJson.setImage(calloutOrParse(json, json.icon, [this, instanceOrJson]));
				}
				if (json.hasOwnProperty("title")) {
					instanceOrJson.setTitle(calloutOrParse(json, json.title, [this, instanceOrJson]));
				}
				if (json.hasOwnProperty("click")) {
					instanceOrJson.setOnClickListener(parseCallback(json, json.click, [this, instanceOrJson]));
				}
				if (json.hasOwnProperty("hold")) {
					instanceOrJson.setOnHoldListener(parseCallback(json, json.hold, [this, instanceOrJson]));
				}
				if (json.hasOwnProperty("badgeOverlay")) {
					instanceOrJson.setBadgeOverlay(calloutOrParse(json, json.badgeOverlay, [this, instanceOrJson]));
				}
				if (json.hasOwnProperty("badgeText")) {
					instanceOrJson.setBadgeText(calloutOrParse(json, json.badgeText, [this, instanceOrJson]));
				}
				return instanceOrJson;
			}
		}
	}

	export class Message {
		content: android.view.ViewGroup;
		views: {
			icon: android.widget.ImageView,
			message: android.widget.TextView,
		};
		protected window?: MenuWindow;
		protected background?: IDrawableJson;
		protected icon?: IDrawableJson;
		protected text?: string;
		protected __click?: (message: Message) => void;

		constructor(src?: IDrawableJson, message?: string, action?: typeof this.__click);
		constructor(parent: MenuWindow, src?: IDrawableJson, message?: string, action?: typeof this.__click);
		constructor(parentOrSrc?: MenuWindow | IDrawableJson, srcOrMessage?, messageOrAction?, action?) {
			if (isAndroid()) {
				this.resetContent();
			}
			if (parentOrSrc instanceof MenuWindow) {
				this.setWindow(parentOrSrc);
				srcOrMessage && this.setImage(srcOrMessage);
				messageOrAction && this.setMessage(messageOrAction);
				action && this.setOnClickListener(action);
			} else {
				parentOrSrc && this.setImage(parentOrSrc);
				srcOrMessage && this.setMessage(srcOrMessage);
				messageOrAction && this.setOnClickListener(messageOrAction);
			}
			this.setBackground("popup");
		}
		resetContent() {
			let views = this.views = {} as typeof this.views;

			let content = new android.widget.LinearLayout(getContext());
			content.setPadding(toComplexUnitDip(84), toComplexUnitDip(8),
				toComplexUnitDip(84), toComplexUnitDip(8));
			content.setLayoutParams(new android.widget.LinearLayout.LayoutParams($.ViewGroup.LayoutParams.MATCH_PARENT, $.ViewGroup.LayoutParams.WRAP_CONTENT));
			content.setGravity($.Gravity.CENTER);
			content.setOnClickListener((() => {
				try {
					this.click && this.click();
				} catch (e) {
					reportError(e);
				}
			}) as any);
			this.content = content;

			views.icon = new android.widget.ImageView(getContext());
			let params = new android.widget.LinearLayout.LayoutParams(toComplexUnitDip(42), toComplexUnitDip(42));
			params.leftMargin = params.topMargin =
				params.rightMargin = params.bottomMargin = toComplexUnitDip(8);
			content.addView(views.icon, params);

			views.message = new android.widget.TextView(getContext());
			typeface && views.message.setTypeface(typeface);
			views.message.setTextSize(toComplexUnitDp(9));
			views.message.setTextColor($.Color.WHITE);
			params = new android.widget.LinearLayout.LayoutParams($.ViewGroup.LayoutParams.MATCH_PARENT, $.ViewGroup.LayoutParams.WRAP_CONTENT);
			params.leftMargin = toComplexUnitDip(21);
			params.rightMargin = toComplexUnitDip(16);
			content.addView(views.message, params);
		}
		getLayout() {
			return this.content || null;
		}
		getWindow() {
			return this.window || null;
		}
		setWindow(window: MenuWindow) {
			if (!(window instanceof MenuWindow)) {
				MCSystem.throwException("Modding Tools: MenuWindow.Header.setWindow requires MenuWindow, but received " + window + "!");
			}
			let elements = window.getElements();
			if (elements.indexOf(this) == -1) {
				elements.push(this);
			}
			this.window = window;
			if (isAndroid()) {
				let actor = new android.transition.ChangeBounds();
				actor.setDuration(400);
				window.beginDelayedTransition(actor);
				window.views.layout.addView(this.getLayout());
			}
			return this;
		}
		getBackground() {
			return this.background || null;
		}
		setBackground(src: IDrawableJson) {
			if (isAndroid()) {
				if (!(src instanceof Drawable)) {
					src = Drawable.parseJson.call(this, src);
				}
				src.attachAsBackground(this.getLayout());
			}
			this.background = src;
			return this;
		}
		getImage() {
			return this.icon || null;
		}
		setImage(src: IDrawableJson) {
			if (isAndroid()) {
				if (!(src instanceof Drawable)) {
					src = Drawable.parseJson.call(this, src);
				}
				src.attachAsBackground(this.views.icon);
			}
			this.icon = src;
			return this;
		}
		getMessage() {
			if (isAndroid()) {
				return this.views.message.getText();
			}
			return this.text;
		}
		setMessage(text: string) {
			if (isAndroid()) {
				this.views.message.setText("" + text);
			}
			this.text = text;
			return this;
		}
		click() {
			this.__click && this.__click(this);
			return this;
		}
		setOnClickListener(listener: typeof this.__click) {
			this.__click = listener;
			return this;
		}
	}

	export namespace Message {
		export function parseJson(json: MenuWindow.IMessage): MenuWindow.Message;
		export function parseJson(instance: MenuWindow.Message, json?: MenuWindow.IMessage): MenuWindow.Message;
		export function parseJson(instanceOrJson: MenuWindow.Message | MenuWindow.IMessage, json?: MenuWindow.IMessage) {
			if (!(instanceOrJson instanceof MenuWindow.Message)) {
				json = instanceOrJson;
				instanceOrJson = new MenuWindow.Message();
			}
			json = calloutOrParse(this, json, instanceOrJson);
			if (json === null || typeof json != "object") {
				return instanceOrJson;
			}
			if (json.hasOwnProperty("background")) {
				instanceOrJson.setBackground(calloutOrParse(json, json.background, [this, instanceOrJson]));
			}
			if (json.hasOwnProperty("icon")) {
				instanceOrJson.setImage(calloutOrParse(json, json.icon, [this, instanceOrJson]));
			}
			if (json.hasOwnProperty("message")) {
				instanceOrJson.setMessage(calloutOrParse(json, json.message, [this, instanceOrJson]));
			}
			if (json.hasOwnProperty("click")) {
				instanceOrJson.setOnClickListener(parseCallback(json, json.click, [this, instanceOrJson]));
			}
			return instanceOrJson;
		}
	}

	export type Elements = Header | ProjectHeader | Category | Message;
}
