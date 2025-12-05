/**
 * @deprecated DEPRECATED SECTION
 * All this will be removed as soon as possible.
 * @requires `isAndroid()`
 */
class ExplorerWindow extends UniqueWindow {
	override readonly TYPE: string = "ExplorerWindow";
	views: {
		layout: android.widget.RelativeLayout,
		files: android.widget.ListView,
		empty: android.widget.LinearLayout,
		icon: android.widget.ImageView,
		info: android.widget.TextView
	};
	protected elements: any[];
	protected mayWrap?: boolean;
	protected multiple?: boolean = false;
	protected single?: boolean = false;
	protected file?: java.io.File;
	protected background?: IDrawableJson;
	protected filter?: string[];
	protected external?: string;
	protected adapter?: ExplorerAdapter;
	protected __explore?: (file: java.io.File) => void;
	protected __approve?: (files: java.io.File[]) => void;

	constructor(mayWrap?: boolean) {
		super();
		this.mayWrap = mayWrap;
	}
	override resetWindow() {
		super.resetWindow();
		this.setGravity($.Gravity.CENTER);
		this.setWidth(this.mayWrap ?
			$.ViewGroup.LayoutParams.WRAP_CONTENT :
			$.ViewGroup.LayoutParams.MATCH_PARENT);
		this.setHeight(this.mayWrap ?
			$.ViewGroup.LayoutParams.WRAP_CONTENT :
			$.ViewGroup.LayoutParams.MATCH_PARENT);
		this.setFocusable(true);
		this.file = Files.of(__dir__);
		this.resetContent();
		this.setRootDirectory();
		this.resetAdapter();
		this.setBackground("popupControl");
		this.elements = [];
	}
	resetContent() {
		let views = this.views = {} as typeof this.views;
		let content = new android.widget.FrameLayout(getContext());
		this.setLayout(content);

		views.layout = new android.widget.RelativeLayout(getContext());
		content.addView(views.layout, new android.widget.FrameLayout.LayoutParams($.ViewGroup.LayoutParams.MATCH_PARENT, $.ViewGroup.LayoutParams.MATCH_PARENT));

		views.files = new android.widget.ListView(getContext());
		views.files.setOnItemClickListener(((parent, view, position, id) => {
			this.selectItem(position) && this.checkIfCanBeApproved();
		}) as any);
		views.files.setOnItemLongClickListener(((parent, view, position, id) => {
			this.isMultipleSelectable() && this.setMode($.ListView.CHOICE_MODE_MULTIPLE);
			this.selectItem(position) && this.checkIfCanBeApproved();
			return true;
		}) as any);
		views.layout.addView(views.files, new android.widget.RelativeLayout.LayoutParams($.ViewGroup.LayoutParams.MATCH_PARENT, $.ViewGroup.LayoutParams.MATCH_PARENT));

		views.empty = new android.widget.LinearLayout(getContext());
		views.empty.setOrientation($.LinearLayout.VERTICAL);
		views.empty.setGravity($.Gravity.CENTER);
		views.empty.setId(android.R.id.empty);
		views.layout.addView(views.empty, new android.widget.RelativeLayout.LayoutParams($.ViewGroup.LayoutParams.MATCH_PARENT, $.ViewGroup.LayoutParams.MATCH_PARENT));

		views.icon = new android.widget.ImageView(getContext());
		new BitmapDrawable("explorerFolder").attachAsImage(views.icon);
		views.empty.addView(views.icon, new android.widget.LinearLayout.LayoutParams(toComplexUnitDip(120), toComplexUnitDip(120)));

		views.info = new android.widget.TextView(getContext());
		typeface && views.info.setTypeface(typeface);
		views.info.setText(translate("Void itself."));
		views.info.setGravity($.Gravity.CENTER);
		views.info.setTextSize(toComplexUnitDp(14));
		views.info.setTextColor($.Color.WHITE);
		views.info.setPadding(toComplexUnitDip(12), toComplexUnitDip(12),
			toComplexUnitDip(12), toComplexUnitDip(12));
		views.empty.addView(views.info);
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
	addElement(element) {
		this.indexOfElement(element) == -1 &&
			this.getElements().push(element);
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
	indexOfElement(item) {
		return this.getElements().indexOf(item);
	}
	removeElement(elementOrIndex) {
		let index = typeof elementOrIndex == "object" ?
			this.indexOfElement(elementOrIndex) : elementOrIndex;
		let element = this.getElementAt(index);
		if (element == null) {
			return this;
		}
		let bounds = new android.transition.ChangeBounds();
		bounds.setInterpolator(new android.view.animation.AccelerateInterpolator());
		bounds.setDuration(400);
		let set = new android.transition.TransitionSet();
		set.addTransition(bounds);
		let fade = new android.transition.Fade();
		fade.setDuration(200);
		set.addTransition(fade);
		this.beginDelayedTransition(set);
		this.views.layout.removeView(element.getLayout());
		this.getElements().splice(index, 1);
		return this;
	}
	setPath(pathOrFile: string | java.io.File) {
		this.file = Files.of(pathOrFile);
		let filter = this.filter;
		this.setItems(
			Files.list(this.file, "relative", function (file) {
				return file.isDirectory() || (filter == null || filter.indexOf(this.extension(file)) != -1);
			}, false)
		);
		this.__explore && this.__explore(this.file);
	}
	setFilter(filter) {
		if (filter == null) {
			this.filter = null;
			return;
		} else if (!Array.isArray(filter)) {
			filter = [filter];
		}
		this.filter = filter.slice();
	}
	getDirectory() {
		return this.file;
	}
	setRootDirectory(path: string) {
		this.external = path ? "" + path : Dirs.EXTERNAL;
		(!this.external.endsWith("/")) && (this.external += "/");
	}
	getRootDirectory() {
		return this.external;
	}
	setItems(array) {
		this.adapter.setRoot(this.file.getPath());
		this.adapter.setItems(array);
		let fade = new android.transition.Fade();
		fade.setDuration(400);
		this.beginDelayedTransition(fade);
		if (array.length == 0) {
			this.views.files.setVisibility($.View.GONE);
			this.views.empty.setVisibility($.View.VISIBLE);
		} else {
			this.views.files.setVisibility($.View.VISIBLE);
			this.views.empty.setVisibility($.View.GONE);
		}
	}
	setMode(mode) {
		this.adapter && this.adapter.setMode(mode);
	}
	setUnselectMode(mode) {
		this.adapter && this.adapter.setUnselectMode(mode);
	}
	selectItem(index: number) {
		if (this.adapter.choice != $.ListView.CHOICE_MODE_MULTIPLE && this.adapter.isDirectory(index) == true) {
			let file = this.adapter.getFile(index);
			this.setPath(file.getPath());
			return false;
		}
		this.adapter.selectItem(index);
		return true;
	}
	isMultipleSelectable() {
		return this.multiple;
	}
	setMultipleSelectable(enabled: boolean, require?: boolean) {
		this.multiple = !!enabled;
		require && this.setMode($.ListView.CHOICE_MODE_MULTIPLE);
	}
	getDefaultMode() {
		return this.single ? $.ListView.CHOICE_MODE_SINGLE : $.ListView.CHOICE_MODE_NONE;
	}
	setApprovedSingle(enabled: boolean) {
		this.single = !!enabled;
		this.setUnselectMode(this.getDefaultMode());
	}
	resetAdapter() {
		this.adapter = new ExplorerAdapter();
		this.views.files.setAdapter(this.adapter.self);
	}
	getAdapter() {
		return this.adapter;
	}
	getApproved() {
		return this.adapter.getApprovedFiles();
	}
	isCanBeApproved() {
		return this.adapter.isCanBeApproved() == true;
	}
	checkIfCanBeApproved() {
		this.__approve && this.__approve(this.getApproved());
	}
	setOnApproveListener(listener: (window: ExplorerWindow, files: java.io.File[]) => void) {
		this.__approve = (files) => {
			try {
				listener && listener(this, files);
			} catch (e) {
				reportError(e);
			}
		};
		return this;
	}
	setOnExploreListener(listener: (window: ExplorerWindow, file: java.io.File) => void) {
		this.__explore = (file) => {
			try {
				listener && listener(this, file);
			} catch (e) {
				reportError(e);
			}
		};
		return this;
	}
	setOnSelectListener(listener) {
		let adapter = this.getAdapter();
		adapter.setOnSelectListener((item, previous) => {
			try {
				let file = adapter.getFile(item);
				listener && listener(this, file, item, previous);
			} catch (e) {
				reportError(e);
			}
		});
	}
	setOnUnselectListener(listener) {
		let adapter = this.getAdapter();
		adapter.setOnUnselectListener((item) => {
			try {
				let file = adapter.getFile(item);
				listener && listener(this, file, item);
			} catch (e) {
				reportError(e);
			}
		});
	}
	addApprove(srcOrApprove, actionOrSrc, action) {
		let approve = srcOrApprove instanceof ExplorerWindow.Approve ?
			srcOrApprove : new ExplorerWindow.Approve(this, srcOrApprove, actionOrSrc);
		actionOrSrc && srcOrApprove instanceof ExplorerWindow.Approve &&
			srcOrApprove.setImage(actionOrSrc);
		action && srcOrApprove instanceof ExplorerWindow.Approve &&
			srcOrApprove.setOnApproveListener(action);
		this.indexOfElement(approve) == -1 && this.getElements().push(approve);
		return approve;
	}
	addPath(actionOrPath, action) {
		let path = actionOrPath instanceof ExplorerWindow.Path ?
			actionOrPath : new ExplorerWindow.Path(this, actionOrPath);
		action && actionOrPath instanceof ExplorerWindow.Path &&
			actionOrPath.setOnExploreListener(action);
		this.indexOfElement(path) == -1 && this.getElements().push(path);
		return path;
	}
	addRename(actionOrRename, action) {
		let rename = actionOrRename instanceof ExplorerWindow.Rename ?
			actionOrRename : new ExplorerWindow.Rename(this, actionOrRename);
		action && actionOrRename instanceof ExplorerWindow.Rename &&
			actionOrRename.setOnApproveListener(action);
		this.indexOfElement(rename) == -1 && this.getElements().push(rename);
		return rename;
	}
}

namespace ExplorerWindow {
	export class Approve {
		content: android.widget.ImageView;
		protected window?: ExplorerWindow;
		protected background?: IDrawableJson;
		protected icon?: IDrawableJson;
		protected __approve?: (approve: Approve, files: java.io.File[]) => void;

		constructor(parentOrSrc, srcOrAction, action) {
			if (isAndroid()) {
				this.resetContent();
			}
			if (parentOrSrc instanceof ExplorerWindow) {
				this.setWindow(parentOrSrc);
				srcOrAction && this.setImage(srcOrAction);
				action && this.setOnApproveListener(action);
			} else {
				parentOrSrc && this.setImage(parentOrSrc);
				srcOrAction && this.setOnApproveListener(srcOrAction);
			}
			this.checkIfCanBeApproved();
			this.setBackground("popupButton");
		}
		resetContent() {
			let content = new android.widget.ImageView(getContext());
			content.setVisibility($.View.GONE);
			content.setPadding(toComplexUnitDip(12), toComplexUnitDip(12),
				toComplexUnitDip(12), toComplexUnitDip(12));
			content.setScaleType($.ImageView.ScaleType.CENTER_CROP);
			content.setOnClickListener((() => this.approve()) as any);
			this.content = content;
		}
		getLayout() {
			return this.content || null;
		}
		getWindow() {
			return this.window || null;
		}
		setWindow(window: ExplorerWindow) {
			if (!(window instanceof ExplorerWindow)) {
				MCSystem.throwException("Modding Tools: ExplorerWindow.Approve.setWindow requires ExplorerWindow, but received " + window + "!");
			}
			let elements = window.getElements();
			if (elements.indexOf(this) == -1) {
				elements.push(this);
			}
			let actor = new android.transition.ChangeBounds();
			actor.setDuration(600);
			window.beginDelayedTransition(actor);
			let params = new android.widget.RelativeLayout.LayoutParams(toComplexUnitDip(80), toComplexUnitDip(80));
			params.setMargins(toComplexUnitDip(40), toComplexUnitDip(27),
				toComplexUnitDip(27), toComplexUnitDip(27));
			params.addRule(android.widget.RelativeLayout.ALIGN_PARENT_BOTTOM);
			params.addRule(android.widget.RelativeLayout.ALIGN_PARENT_RIGHT);
			window.views.layout.addView(this.getLayout(), params);
			window.setOnApproveListener(() => this.checkIfCanBeApproved());
			this.window = window;
			return this;
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
		getImage() {
			return this.icon || null;
		}
		setImage(src: IDrawableJson) {
			if (isAndroid()) {
				let content = this.getLayout();
				if (!(src instanceof Drawable)) {
					src = Drawable.parseJson.call(this, src);
				}
				src.attachAsImage(content);
			}
			this.icon = src;
			return this;
		}
		approve() {
			let window = this.getWindow();
			this.__approve && this.__approve(this, window ? window.getApproved() : null);
			return this;
		}
		checkIfCanBeApproved() {
			let content = this.getLayout(), window = this.getWindow();
			if (window) {
				let actor = new android.transition.Fade();
				actor.setDuration(400);
				window.beginDelayedTransition(actor);
			}
			content.setVisibility(window != null && window.isCanBeApproved() ?
				$.View.VISIBLE : $.View.GONE);
			content.setEnabled(window != null && window.isCanBeApproved());
		}
		setOnApproveListener(listener) {
			this.__approve = function (approve, files) {
				try {
					listener && listener(approve, files);
				} catch (e) {
					reportError(e);
				}
			};
			return this;
		}
	}

	export class Path {
		views: {
			scroll: android.widget.HorizontalScrollView,
			layout: android.widget.LinearLayout
		};
		content: android.widget.LinearLayout;
		protected pathes?: android.view.View[];
		protected window?: ExplorerWindow;
		protected background?: IDrawableJson;
		protected lastPath?: android.view.View;
		protected __explore?: (path: Path, file: java.io.File) => void;
		protected __outside?: (path: Path) => void;

		constructor(parentOrAction?: ExplorerWindow | typeof this.__explore, action?: typeof this.__explore) {
			if (isAndroid()) {
				this.resetContent();
			}
			if (parentOrAction instanceof ExplorerWindow) {
				this.setWindow(parentOrAction);
				action && this.setOnExploreListener(action);
			} else {
				parentOrAction && this.setOnExploreListener(parentOrAction);
			}
			this.setBackground("popup");
			this.pathes = [];
		}
		resetContent() {
			let views = this.views = {} as typeof this.views;
			let content = new android.widget.LinearLayout(getContext());
			content.setId(new java.lang.String("pathLayout").hashCode());
			content.setOrientation($.LinearLayout.VERTICAL);
			content.setGravity($.Gravity.BOTTOM);
			content.setOnClickListener((() => this.__outside && this.__outside(this)) as any);
			content.setLayoutParams(new android.widget.RelativeLayout.LayoutParams($.ViewGroup.LayoutParams.MATCH_PARENT, toComplexUnitDip(80)));
			this.content = content;

			views.scroll = new android.widget.HorizontalScrollView(getContext());
			content.addView(views.scroll, new android.widget.LinearLayout.LayoutParams($.ViewGroup.LayoutParams.MATCH_PARENT, $.ViewGroup.LayoutParams.WRAP_CONTENT));

			views.layout = new android.widget.LinearLayout(getContext());
			views.layout.setPadding(toComplexUnitDip(8), 0, toComplexUnitDip(8), 0);
			views.scroll.addView(views.layout, new android.view.ViewGroup.LayoutParams($.ViewGroup.LayoutParams.MATCH_PARENT, $.ViewGroup.LayoutParams.WRAP_CONTENT));
		}
		getLayout() {
			return this.content || null;
		}
		getWindow() {
			return this.window || null;
		}
		setWindow(window: ExplorerWindow) {
			if (!(window instanceof ExplorerWindow)) {
				MCSystem.throwException("Modding Tools: ExplorerWindow.Path.setWindow requires ExplorerWindow, but received " + window + "!");
			}
			let elements = window.getElements();
			if (elements.indexOf(this) == -1) {
				elements.push(this);
			}
			let content = this.getLayout();
			let actor = new android.transition.ChangeBounds();
			actor.setDuration(600);
			window.beginDelayedTransition(actor);
			let params = window.views.files.getLayoutParams() as android.widget.RelativeLayout.LayoutParams;
			params.addRule(android.widget.RelativeLayout.BELOW, content.getId());
			window.views.layout.addView(content, 0);
			window.setOnExploreListener((window, file) => {
				this.__explore && this.__explore(this, file);
				this.updatePath();
			});
			this.window = window;
			return this;
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
		addPathElement(view, extendsArrow?: boolean) {
			if (!view) return;
			extendsArrow = extendsArrow === undefined ?
				!!this.lastPath : extendsArrow;
			this.lastPath = view;
			extendsArrow && this.attachArrowToPath();
			this.views.layout.addView(view);
			this.pathes.push(view);
		}
		makePathClick(path: string | java.io.File) {
			return () => {
				let file = Files.of(path);
				file.exists() && this.setPath(file.getPath());
			};
		}
		addPathIcon(src, file: string | java.io.File) {
			let path = new android.widget.ImageView(getContext());
			new BitmapDrawable(src).attachAsImage(path);
			path.setPadding(toComplexUnitDip(8), toComplexUnitDip(8),
				toComplexUnitDip(8), toComplexUnitDip(8));
			path.setScaleType($.ImageView.ScaleType.CENTER_CROP);
			path.setOnClickListener(this.makePathClick(file));
			path.setLayoutParams(new android.widget.LinearLayout.LayoutParams(toComplexUnitDip(40), toComplexUnitDip(40)));
			return this.addPathElement(path);
		}
		addPathText(text, file: string | java.io.File) {
			let path = new android.widget.TextView(getContext());
			text !== undefined && path.setText(text);
			typeface && path.setTypeface(typeface);
			path.setTextColor($.Color.WHITE);
			path.setGravity($.Gravity.CENTER);
			path.setTextSize(toComplexUnitDp(8.25));
			path.setPadding(toComplexUnitDip(8), toComplexUnitDip(8),
				toComplexUnitDip(8), toComplexUnitDip(8));
			path.setOnClickListener(this.makePathClick(file));
			path.setLayoutParams(new android.widget.LinearLayout.LayoutParams($.ViewGroup.LayoutParams.WRAP_CONTENT, $.ViewGroup.LayoutParams.MATCH_PARENT));
			return this.addPathElement(path);
		}
		attachArrowToPath() {
			let path = new android.widget.ImageView(getContext());
			new BitmapDrawable("controlAdapterDivider").attachAsImage(path);
			path.setPadding(toComplexUnitDip(4), toComplexUnitDip(12),
				toComplexUnitDip(4), toComplexUnitDip(12));
			path.setScaleType($.ImageView.ScaleType.CENTER_CROP);
			path.setLayoutParams(new android.widget.LinearLayout.LayoutParams(toComplexUnitDip(20), toComplexUnitDip(40)));
			return this.addPathElement(path, false);
		}
		setPath(path: string | java.io.File) {
			let window = this.getWindow();
			window && window.setPath(path);
			return this;
		}
		updatePath() {
			let views = this.views, window = this.getWindow(), path = (window ? window.file.getPath() + "/" : Dirs.EXTERNAL);
			this.pathes = [];
			views.layout.removeAllViews();
			delete this.lastPath;
			let current = window ? window.external : Dirs.EXTERNAL, pathFilter = path.replace(current, ""), pathDivided = pathFilter.split("/");
			pathDivided.pop();
			this.addPathIcon("controlAdapterHome", current);
			for (let i = 0; i < pathDivided.length; i++) {
				current += pathDivided[i] + "/";
				if (pathDivided[i].length == 0) continue;
				this.addPathText(pathDivided[i], current);
			}
			return this;
		}
		setOnExploreListener(listener: typeof this.__explore) {
			this.__explore = (scope, file) => {
				try {
					listener && listener(scope, file);
				} catch (e) {
					reportError(e);
				}
			};
			return this;
		}
		setOnOutsideListener(listener: typeof this.__outside) {
			this.__outside = (scope) => {
				try {
					listener && listener(scope);
				} catch (e) {
					reportError(e);
				}
			};
			return this;
		}
	}

	export class Rename {
		views: {
			approve: android.widget.TextView,
			format: android.widget.TextView,
			name: android.widget.EditText
		};
		content: android.widget.RelativeLayout;
		protected formatIndex: number = -1;
		protected formats: string[];
		protected window?: ExplorerWindow;
		protected background?: IDrawableJson;
		protected __approve?: (rename: Rename, file: java.io.File, name: string) => void;

		constructor(parentOrAction?: ExplorerWindow | typeof this.__approve, action?: typeof this.__approve) {
			if (isAndroid()) {
				this.resetContent();
			}
			if (parentOrAction instanceof ExplorerWindow) {
				this.setWindow(parentOrAction);
				action && this.setOnApproveListener(action);
			} else {
				parentOrAction && this.setOnApproveListener(parentOrAction);
			}
			this.setHint(translate("File name"));
			this.setTitle(translate("Export"));
			this.setBackground("popup");
			this.formats = [];
		}
		resetContent() {
			let views = this.views = {} as typeof this.views;
			let content = new android.widget.RelativeLayout(getContext());
			content.setId(new java.lang.String("renameLayout").hashCode());
			let params = new android.widget.RelativeLayout.LayoutParams($.ViewGroup.LayoutParams.MATCH_PARENT, $.ViewGroup.LayoutParams.WRAP_CONTENT);
			params.addRule(android.widget.RelativeLayout.ALIGN_PARENT_BOTTOM);
			content.setLayoutParams(params);
			this.content = content;

			views.approve = new android.widget.TextView(getContext());
			typeface && views.approve.setTypeface(typeface);
			views.approve.setSingleLine();
			views.approve.setTextColor(isInvertedLogotype() ? $.Color.WHITE : $.Color.GREEN);
			views.approve.setTextSize(toComplexUnitDp(11));
			views.approve.setId(new java.lang.String("renameApprove").hashCode());
			views.approve.setPadding(toComplexUnitDip(16), toComplexUnitDip(16),
				toComplexUnitDip(16), toComplexUnitDip(16));
			views.approve.setOnClickListener((() => this.approve()) as any);
			params = new android.widget.RelativeLayout.LayoutParams($.ViewGroup.LayoutParams.WRAP_CONTENT, $.ViewGroup.LayoutParams.WRAP_CONTENT);
			params.addRule(android.widget.RelativeLayout.ALIGN_PARENT_RIGHT);
			params.addRule(android.widget.RelativeLayout.CENTER_IN_PARENT);
			params.leftMargin = toComplexUnitDip(16);
			content.addView(views.approve, params);

			views.format = new android.widget.TextView(getContext());
			typeface && views.format.setTypeface(typeface);
			views.format.setSingleLine();
			views.format.setTextColor($.Color.WHITE);
			views.format.setTextSize(toComplexUnitDp(11));
			views.format.setId(new java.lang.String("renameFormat").hashCode());
			views.format.setPadding(toComplexUnitDip(10), toComplexUnitDip(10),
				toComplexUnitDip(10), toComplexUnitDip(10));
			views.format.setOnClickListener((() => this.nextFormat()) as any);
			params = new android.widget.RelativeLayout.LayoutParams($.ViewGroup.LayoutParams.WRAP_CONTENT, $.ViewGroup.LayoutParams.WRAP_CONTENT);
			params.addRule(android.widget.RelativeLayout.LEFT_OF, views.approve.getId());
			params.addRule(android.widget.RelativeLayout.CENTER_IN_PARENT);
			content.addView(views.format, params);

			views.name = new android.widget.EditText(getContext());
			views.name.setInputType(android.text.InputType.TYPE_CLASS_TEXT |
				android.text.InputType.TYPE_TEXT_FLAG_NO_SUGGESTIONS);
			views.name.setHintTextColor($.Color.LTGRAY);
			views.name.setTextColor($.Color.WHITE);
			views.name.setTextSize(toComplexUnitDp(9));
			typeface && views.name.setTypeface(typeface);
			params = new android.widget.RelativeLayout.LayoutParams($.ViewGroup.LayoutParams.MATCH_PARENT, $.ViewGroup.LayoutParams.WRAP_CONTENT);
			params.addRule(android.widget.RelativeLayout.LEFT_OF, views.format.getId());
			params.addRule(android.widget.RelativeLayout.CENTER_IN_PARENT);
			params.setMargins(toComplexUnitDip(6), toComplexUnitDip(6), toComplexUnitDip(6), toComplexUnitDip(6));
			content.addView(views.name, params);
		}
		getLayout() {
			return this.content || null;
		}
		getWindow() {
			return this.window || null;
		}
		setWindow(window: ExplorerWindow) {
			if (!(window instanceof ExplorerWindow)) {
				MCSystem.throwException("Modding Tools: ExplorerWindow.Rename.setWindow requires ExplorerWindow, but received " + window + "!");
			}
			let elements = window.getElements();
			if (elements.indexOf(this) == -1) {
				elements.push(this);
			}
			let content = this.getLayout()
			let actor = new android.transition.Fade();
			actor.setDuration(400);
			window.beginDelayedTransition(actor);
			let params = window.views.files.getLayoutParams() as android.widget.RelativeLayout.LayoutParams;
			params.addRule(android.widget.RelativeLayout.ABOVE, content.getId());
			window.views.layout.addView(content, 0); // TODO?
			window.setOnSelectListener((window, file, item, previous) => {
				if (previous == -1) this.setCurrentName(file.getName());
			});
			this.window = window;
			return this;
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
		getCurrentName() {
			let name = this.views ? this.views.name ?
				"" + this.views.name.getText().toString() : "" : "";
			if (name.length == 0) name = translate("project");
			return name + "." + this.getCurrentFormat();
		}
		setCurrentName(text: string) {
			if (!text) return;
			let extension = Files.extension(text);
			if (extension) this.setFormat(extension);
			this.setName(Files.basename(text, extension));
			return this;
		}
		setName(text: string) {
			let content = this.getLayout(), views = this.views;
			if (!content || !views) return this;
			views.name.setText("" + text);
			return this;
		}
		getCurrentFile() {
			let window = this.getWindow(), directory = window ? window.getDirectory() : null;
			if (!directory) return null;
			return Files.of(directory, this.getCurrentName());
		}
		approve() {
			this.__approve && this.__approve(this, this.getCurrentFile(), this.getCurrentName());
			return this;
		}
		nextFormat() {
			if (!this.formats || this.formats.length == 0) {
				return;
			}
			if (this.formatIndex > this.formats.length - 2) {
				this.formatIndex = 0;
			} else {
				this.formatIndex++;
			}
			this.setFormat(this.formatIndex);
			return this;
		}
		setFormat(indexOrFormat: number | string) {
			let index = typeof indexOrFormat == "number" ?
				indexOrFormat : this.formats.indexOf(indexOrFormat);
			let format = this.views ? this.views.format : null;
			if (!format || index < 0) return;
			this.formatIndex = index;
			format.setText(this.formats[index]);
			return this;
		}
		getCurrentFormat() {
			return this.formats[this.formatIndex];
		}
		setAvailabledTypes(types: string | string[]) {
			this.formats = Array.isArray(types) ? types : [types];
			this.formatIndex = -1;
			this.nextFormat();
			return this;
		}
		getTitle() {
			let views = this.views;
			if (!views) return null;
			return views.approve.getText();
		}
		setTitle(text: string) {
			let content = this.getLayout(), views = this.views;
			if (!content || !views) return this;
			views.approve.setText(("" + text).toUpperCase());
			return this;
		}
		getHint() {
			let views = this.views;
			if (!views) return null;
			return views.name.getHint();
		}
		setHint(text: string) {
			let content = this.getLayout(), views = this.views;
			if (!content || !views) return this;
			views.name.setHint("" + text);
			return this;
		}
		setOnApproveListener(listener: typeof this.__approve) {
			this.__approve = (rename, file, name) => {
				try {
					listener && listener(rename, file, name);
				} catch (e) {
					reportError(e);
				}
			};
			return this;
		}
	}
}

class ExplorerAdapter {
	constructor(array: java.io.File[], external: string | java.io.File, mode) {
		this.resetAndClear();
		array && this.setItems(array);
		external && this.setRoot(external);
		mode !== undefined && this.setMode(mode);
	}
}

if (isAndroid()) {
	ExplorerAdapter.prototype = new JavaAdapter(android.widget.BaseAdapter, android.widget.Adapter, {
		array: [],
		getCount() {
			return this.array.length;
		},
		getItemId(position: number) {
			return position;
		},
		getItems() {
			return this.array;
		},
		getItem(position: number) {
			let object = {};
			try {
				object.isApproved = this.isApproved(position) == true;
				let file = this.getFile(position);
				object.file = file;
				object.isDirectory = file.isDirectory();
				let item = this.array[position];
				if (!object.isDirectory) {
					let extension = Files.extension(file);
					object.name = extension ? Files.basename(item, extension) : item;
					if (extension) object.extension = extension.toUpperCase();
				} else {
					object.name = item;
				}
				object.type = Files.typeof(file);
				let date = new java.util.Date(file.lastModified()),
					format = new java.text.SimpleDateFormat();
				format.applyPattern("d MMM, yyyy")
				object.date = format.format(date);
				format.applyPattern("k:mm")
				object.time = format.format(date);
				try {
					if (object.isDirectory) {
						let list = file.list();
						if (list == null) return;
						object.filesCount = list.length;
					} else {
						object.size = Files.prepareSize(file);
					}
				} catch (e) {
					log("Modding Tools: ExplorerAdapter.getItem: " + e);
				}
			} catch (e) {
				showHint(position + ": " + e);
			}
			return object;
		},
		getApproved() {
			return this.approves;
		},
		getApprovedCount() {
			return this.approves.length;
		},
		getMode() {
			return this.mode;
		},
		getUnselectMode() {
			return this.basicMode;
		},
		getFile(position: number) {
			position = position - 0;
			return Files.of(this.direct, this.array[position]);
		},
		getApprovedFiles() {
			let files = [],
				approves = this.getApproved();
			for (let i = 0; i < this.getApprovedCount(); i++) {
				files.push(this.getFile(approves[i]));
			}
			return files;
		},
		getView(position: number, convertView: android.view.View, parent: android.view.ViewGroup) {
			let holder;
			try {
				if (convertView == null) {
					convertView = this.makeItemLayout();
					holder = {};
					holder.name = convertView.findViewWithTag("fileName");
					holder.bound = convertView.findViewWithTag("fileSize");
					holder.date = convertView.findViewWithTag("fileDate");
					holder.property = convertView.findViewWithTag("fileInfo");
					holder.icon = convertView.findViewWithTag("fileIcon");
					holder.drawable = new BitmapDrawable();
					holder.drawable.setCorruptedThumbnail("explorerFileCorrupted");
					holder.drawable.attachAsImage(holder.icon);
					convertView.setTag(holder);
				} else {
					holder = convertView.getTag();
				}
			} catch (e) {
				reportError(e);
				return convertView;
			}
			let item = this.getItem(position);
			try {
				(item.isApproved ? new BitmapDrawable("popupSelectionSelected") : new Drawable()).attachAsBackground(convertView);
				holder.name.setText(item.name);
				holder.bound.setText((item.extension ? item.extension : "") +
					(item.extension && item.size ? " / " : "") + (item.size ? item.size : "") +
					(item.isDirectory && item.filesCount !== undefined ? translateCounter(item.filesCount, "no files",
					"%s1 file", "%s" + (item.filesCount % 10) + " files", "%s files") : ""));
				holder.drawable.setOptions();
				holder.date.setText(item.date);
				if (item.type == "image") {
					let size = Files.prepareBounds(item.file);
					if (size[0] == -1 || size[1] == -1) {
						holder.property.setText(item.time);
						holder.drawable.setBitmap("explorerFileCorrupted");
						return convertView;
					}
					holder.property.setText(size.join("x") + " / " + item.time);
					if (size[0] <= maximumAllowedBounds && size[1] <= maximumAllowedBounds) {
						let options = Files.getThumbnailOptions(maximumThumbnailBounds, size);
						holder.drawable.setOptions(options);
						holder.drawable.setBitmap(item.file);
						return convertView;
					}
				} else {
					holder.property.setText(item.time);
				}
				holder.drawable.setBitmap(item.isDirectory ? "explorerFolder" : item.type != "none" ?
					"explorerExtension" + item.type.charAt(0).toUpperCase() + item.type.substring(1) : "explorerFile");
			} catch (e) {
				showHint(item + ": " + e);
			}
			return convertView;
		},
		isApproved(position: number) {
			position = position - 0;
			return this.approves.indexOf(position) != -1;
		},
		isCanBeApproved() {
			return this.getApprovedCount() > 0;
		},
		isDirectory(position: number) {
			return this.getFile(position).isDirectory();
		},
		makeItemLayout() {
			let layout = new android.widget.RelativeLayout(getContext());
			layout.setLayoutParams(new android.view.ViewGroup.LayoutParams
				($.ViewGroup.LayoutParams.MATCH_PARENT, $.ViewGroup.LayoutParams.WRAP_CONTENT));

			let icon = new android.widget.ImageView(getContext());
			icon.setPadding(toComplexUnitDip(14), toComplexUnitDip(14),
				toComplexUnitDip(14), toComplexUnitDip(14));
			icon.setScaleType($.ImageView.ScaleType.CENTER_CROP);
			icon.setTag("fileIcon");
			icon.setId(new java.lang.String("fileIcon").hashCode());
			let params = new android.widget.RelativeLayout.LayoutParams
				(toComplexUnitDip(50), toComplexUnitDip(66));
			params.addRule(android.widget.RelativeLayout.ALIGN_PARENT_LEFT);
			params.addRule(android.widget.RelativeLayout.CENTER_IN_PARENT);
			params.rightMargin = toComplexUnitDip(10);
			layout.addView(icon, params);

			let additional = new android.widget.LinearLayout(getContext());
			additional.setOrientation($.LinearLayout.VERTICAL);
			additional.setGravity($.Gravity.RIGHT);
			additional.setPadding(toComplexUnitDip(20), 0, toComplexUnitDip(20), 0);
			additional.setTag("additionalInfo");
			additional.setId(new java.lang.String("additionalInfo").hashCode());
			params = new android.widget.RelativeLayout.LayoutParams
				($.ViewGroup.LayoutParams.WRAP_CONTENT, $.ViewGroup.LayoutParams.WRAP_CONTENT);
			params.addRule(android.widget.RelativeLayout.ALIGN_PARENT_RIGHT);
			params.addRule(android.widget.RelativeLayout.CENTER_IN_PARENT);
			layout.addView(additional, params);

			let date = new android.widget.TextView(getContext());
			typeface && date.setTypeface(typeface);
			date.setGravity($.Gravity.RIGHT);
			date.setTextSize(toComplexUnitDp(8));
			date.setTextColor($.Color.LTGRAY);
			date.setTag("fileDate");
			additional.addView(date);

			let info = new android.widget.TextView(getContext());
			typeface && info.setTypeface(typeface);
			info.setGravity($.Gravity.RIGHT);
			info.setTextSize(toComplexUnitDp(8));
			info.setTextColor($.Color.LTGRAY);
			info.setTag("fileInfo");
			additional.addView(info);

			let uniqal = new android.widget.LinearLayout(getContext());
			uniqal.setOrientation($.LinearLayout.VERTICAL);
			uniqal.setTag("uniqalInfo");
			uniqal.setId(new java.lang.String("uniqalInfo").hashCode());
			params = new android.widget.RelativeLayout.LayoutParams
				($.ViewGroup.LayoutParams.WRAP_CONTENT, $.ViewGroup.LayoutParams.WRAP_CONTENT);
			params.addRule(android.widget.RelativeLayout.LEFT_OF, additional.getId());
			params.addRule(android.widget.RelativeLayout.RIGHT_OF, icon.getId());
			params.addRule(android.widget.RelativeLayout.CENTER_IN_PARENT);
			uniqal.post((() => uniqal.requestLayout()) as any);
			layout.addView(uniqal, params);

			let name = new android.widget.TextView(getContext());
			typeface && name.setTypeface(typeface);
			name.setTextSize(toComplexUnitDp(9));
			name.setTextColor($.Color.WHITE);
			name.setTag("fileName");
			name.setMaxLines(3);
			uniqal.addView(name);

			let size = new android.widget.TextView(getContext());
			typeface && size.setTypeface(typeface);
			size.setTextSize(toComplexUnitDp(8));
			size.setTextColor($.Color.LTGRAY);
			size.setTag("fileSize");
			uniqal.addView(size);
			return layout;
		},
		setItems(array: java.io.File[]) {
			this.array = array;
			this.unselectAll();
		},
		setMode(mode) {
			this.choice = mode;
		},
		setUnselectMode(mode) {
			this.basicMode = mode;
		},
		returnToBasic() {
			this.basicMode !== undefined && this.setMode(this.basicMode);
		},
		setRoot(external: string | java.io.File) {
			this.direct = external;
		},
		setOnSelectListener(listener) {
			this.__select = listener;
		},
		setOnUnselectListener(listener) {
			this.__unselect = listener;
		},
		selectItem(position: number) {
			position = position - 0;
			if (this.previous !== undefined) {
				let last = this.approves.indexOf(this.previous);
				if (last != -1 && this.choice == $.ListView.CHOICE_MODE_SINGLE) {
					this.approves.splice(last, 1);
				}
			}
			if (position !== undefined) {
				let selected = this.approves.indexOf(position);
				if (this.choice == $.ListView.CHOICE_MODE_SINGLE) {
					this.approves.push(position);
					this.previous = position;
					this.__select && this.__select(position, selected);
				} else if (selected != -1) {
					this.approves.splice(selected, 1);
					this.getApprovedCount() == 0 && this.returnToBasic();
					this.__unselect && this.__unselect(position, selected);
				} else if (this.choice == $.ListView.CHOICE_MODE_NONE) {
					let index = this.approves.push(position) - 1;
					this.__select && this.__select(position, selected);
					this.approves.splice(index, 1);
				} else {
					this.approves.push(position);
					this.__select && this.__select(position, selected);
				}
			}
			this.notifyDataSetChanged();
		},
		selectAll() {
			this.approves = [];
			for (let offset = 0; offset < this.getCount(); offset++) {
				this.approves.push(this.getItemId(offset));
			}
			this.notifyDataSetChanged();
		},
		invertSelection() {
			let approves = [];
			for (let i = 0; i < this.getCount(); i++) {
				approves.push(approves.indexOf(this.getItemId(i)) == -1);
			}
			this.approves = approves;
			this.notifyDataSetChanged();
		},
		unselectAll() {
			this.approves = [];
			this.returnToBasic();
			this.notifyDataSetChanged();
		},
		resetAndClear() {
			this.__select = undefined;
			this.__unselect = undefined;
			this.direct = __dir__;
			this.array = [];
			this.choice = $.ListView.CHOICE_MODE_NONE;
			this.basicMode = $.ListView.CHOICE_MODE_NONE;
			this.unselectAll();
		}
	});
}
