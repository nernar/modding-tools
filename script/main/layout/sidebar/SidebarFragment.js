class SidebarFragment {
	constructor() {
		MCSystem.throwException("Modding Tools: SidebarFragment cannot be instantiated!");
	}
}

SidebarFragment.Rail = class {
	constructor() {
		ScrollFragment.apply(this, arguments);
	}
	resetContainer() {
		let container = new android.widget.LinearLayout(getContext());
		container.setLayoutDirection(android.view.View.LAYOUT_DIRECTION_RTL);
		this.setContainerView(container);

		let selection = new LayoutFragment();
		selection.setContainerView(container);
		this.selectionFragment = selection;

		let scroll = new android.widget.ScrollView(getContext());
		scroll.setTag("containerScroll");
		container.addView(scroll);

		let layout = new android.widget.LinearLayout(getContext());
		layout.setLayoutDirection(android.view.View.LAYOUT_DIRECTION_LTR);
		layout.setOrientation($.LinearLayout.VERTICAL);
		layout.setMinimumHeight(getDisplayHeight());
		layout.setTag("containerLayout");
		scroll.addView(layout);

		menuDividers || this.setContainerBackground("popup");
		this.setSelectionMode(SelectableLayoutFragment.SELECTION_NONE);
	}
	getSelectionFragment() {
		return this.selectionFragment || null;
	}
	addViewDirectly(view, params) {
		if (params == null && this.hasMark("fill")) {
			params = new android.widget.LinearLayout.LayoutParams($.ViewGroup.LayoutParams.WRAP_CONTENT, $.ViewGroup.LayoutParams.MATCH_PARENT);
			menuDividers && (params.topMargin = toComplexUnitDip(1));
			params.weight = 1.;
		}
		ScrollFragment.prototype.addViewDirectly.call(this, view, params);
	}
	selectItemInLayout(item) {
		let selection = this.getSelectionFragment();
		if (item instanceof LayoutFragment) {
			let fragments = item.getFragments();
			for (let offset = 0; offset < fragments.length; offset++) {
				let fragment = fragments[offset];
				if (selection.indexOf(fragment) == -1) {
					selection.addFragment(fragment);
				}
			}
		}
		SelectableLayoutFragment.prototype.selectItemInLayout.apply(this, arguments);
	}
	unselectItemInLayout(item) {
		let selection = this.getSelectionFragment();
		if (item instanceof LayoutFragment) {
			let fragments = item.getFragments();
			for (let offset = 0; offset < fragments.length; offset++) {
				let fragment = fragments[offset];
				if (selection.indexOf(fragment) != -1) {
					selection.removeFragment(fragment);
				}
			}
		}
		SelectableLayoutFragment.prototype.unselectItemInLayout.apply(this, arguments);
	}
	getContainerBackground() {
		return this.getBackground("container");
	}
	setContainerBackground(src) {
		return this.setBackground(src, "container", this.getContainerLayout());
	}
	expand(condition) {
		let fragments = this.getFragments();
		for (let offset = 0; offset < fragments.length; offset++) {
			let fragment = fragments[offset];
			if (fragment.expand && (!condition || condition.call(this, fragment))) {
				fragment.expand();
			}
		}
	}
	collapse(condition) {
		let fragments = this.getFragments();
		for (let offset = 0; offset < fragments.length; offset++) {
			let fragment = fragments[offset];
			if (fragment.collapse && (!condition || condition.call(this, fragment))) {
				fragment.collapse();
			}
		}
	}
	fetchItemInLayout(item) {
		return (this.onFetchItem && this.onFetchItem(item, item.getIndex())) || null;
	}
	setOnFetchItemListener(listener) {
		if (listener != null) {
			this.onFetchItem = listener;
		} else {
			delete this.onFetchItem;
		}
		return this;
	}
	static parseJson(instanceOrJson, json, preferredFragment) {
		if (!(instanceOrJson instanceof SidebarFragment.Rail)) {
			json = instanceOrJson;
			instanceOrJson = new SidebarFragment.Rail();
		} else {
			instanceOrJson.getSelectionFragment().removeFragments();
		}
		instanceOrJson = ScrollFragment.parseJson.call(this, instanceOrJson, json, preferredFragment || "sidebarRailItem");
		json = calloutOrParse(this, json, instanceOrJson);
		if (json == null || typeof json != "object") {
			return instanceOrJson;
		}
		if (json.hasOwnProperty("containerBackground")) {
			instanceOrJson.setContainerBackground(calloutOrParse(json, json.containerBackground, [this, instanceOrJson]));
		}
		if (json.hasOwnProperty("fetchItem")) {
			instanceOrJson.setOnFetchItemListener(parseCallback(json, json.fetchItem, this));
		}
		if (json.hasOwnProperty("expanded") && calloutOrParse(json, json.expanded, [this, instanceOrJson])) {
			instanceOrJson.expand();
		}
		SelectableLayoutFragment.parseJson.call(this, instanceOrJson, json);
		return instanceOrJson;
	}
};

__inherit__(SidebarFragment.Rail, ScrollFragment, SelectableLayoutFragment.prototype);

registerFragmentJson("sidebar_rail", SidebarFragment.Rail);
registerFragmentJson("sidebarRail", SidebarFragment.Rail);

SidebarFragment.Rail.Item = class {
	constructor() {
		LayoutFragment.call(this);
	}
	resetContainer() {
		let container = new android.widget.LinearLayout(getContext());
		container.setGravity($.Gravity.CENTER);
		this.setContainerView(container);

		let icon = new android.widget.ImageView(getContext());
		icon.setTag("railItemIcon");
		container.addView(icon);

		this.setSelectedBackground("popupSelectionSelected");
		menuDividers && this.setUnselectedBackground("popup");
		this.collapse();
	}
	getContainerLayout() {
		return null;
	}
	getImageView() {
		return this.findViewByTag("railItemIcon");
	}
	collapse() {
		let icon = this.getImageView();
		icon.setScaleType($.ImageView.ScaleType.CENTER_CROP);
		icon.setLayoutParams(new android.widget.LinearLayout.LayoutParams(toComplexUnitDip(36), toComplexUnitDip(54)));
		icon.setPadding(toComplexUnitDip(28), 0, 0, 0);
		this.getContainer().setMinimumHeight(toComplexUnitDip(120));
	}
	expand() {
		let icon = this.getImageView();
		icon.setScaleType($.ImageView.ScaleType.FIT_CENTER);
		icon.setLayoutParams(new android.widget.LinearLayout.LayoutParams(toComplexUnitDip(54), toComplexUnitDip(54)));
		icon.setPadding(toComplexUnitDip(8), toComplexUnitDip(8),
			toComplexUnitDip(8), toComplexUnitDip(8));
		this.getContainer().setMinimumHeight(0);
	}
	click() {
		this.toggle();
		LayoutFragment.prototype.click.apply(this, arguments);
	}
	hold() {
		let text = null;
		if (this.onFetch && (text = this.onFetch())) {
			typeof text == "boolean" || showHint(text);
		} else {
			let parent = this.getParent();
			if (parent && parent.fetchItemInLayout && (text = parent.fetchItemInLayout(this))) {
				typeof text == "boolean" || showHint(text);
			}
		}
		let parent = this.getParent();
		if (parent && parent.holdItemInLayout && parent.holdItemInLayout(this)) {
			return true;
		}
		return LayoutFragment.prototype.hold.apply(this, arguments) || text != null;
	}
	updateLayout() {
		this.updateSelection();
		LayoutFragment.prototype.updateLayout.apply(this, arguments);
	}
	setOnFetchListener(listener) {
		if (listener != null) {
			this.onFetch = listener;
		} else {
			delete this.onFetch;
		}
		return this;
	}
	static parseJson(instanceOrJson, json, preferredFragment) {
		if (!(instanceOrJson instanceof SidebarFragment.Rail.Item)) {
			json = instanceOrJson;
			instanceOrJson = new SidebarFragment.Rail.Item();
		}
		instanceOrJson = LayoutFragment.parseJson.call(this, instanceOrJson, json, preferredFragment || "sidebarPanel");
		json = calloutOrParse(this, json, instanceOrJson);
		if (json == null || typeof json != "object") {
			return instanceOrJson;
		}
		if (json.hasOwnProperty("icon")) {
			instanceOrJson.setImage(calloutOrParse(json, json.icon, [this, instanceOrJson]));
		}
		if (json.hasOwnProperty("fetch")) {
			instanceOrJson.setOnFetchListener(parseCallback(json, json.fetch, this));
		}
		if (json.hasOwnProperty("expanded") && calloutOrParse(json, json.expanded, [this, instanceOrJson])) {
			instanceOrJson.expand();
		}
		SelectableFragment.parseJson.call(this, instanceOrJson, json);
		return instanceOrJson;
	}
};

__inherit__(SidebarFragment.Rail.Item, LayoutFragment, ImageFragmentMixin, SelectableFragment.prototype);

registerFragmentJson("sidebar_rail_item", SidebarFragment.Rail.Item);
registerFragmentJson("sidebarRailItem", SidebarFragment.Rail.Item);

SidebarFragment.Panel = class extends ScrollFragment {
	constructor() {
		ScrollFragment.apply(this, arguments);
	}
	resetContainer() {
		ScrollFragment.prototype.resetContainer.apply(this, arguments);
		let layout = this.getContainerLayout();
		layout.setLayoutDirection(android.view.View.LAYOUT_DIRECTION_LTR);
		layout.setGravity($.Gravity.TOP | $.Gravity.CENTER);
		layout.setMinimumHeight(getDisplayHeight());
	}
	addFragment() {
		let index = ScrollFragment.prototype.addFragment.apply(this, arguments);
		if (index >= 0) {
			this.getContainerLayout().setMinimumWidth(toComplexUnitDip(300)); // 270
		}
		return index;
	}
	removeFragment() {
		let succeed = ScrollFragment.prototype.removeFragment.apply(this, arguments);
		if (succeed && this.getFragmentCount() == 0) {
			this.getContainerLayout().setMinimumWidth(0);
		}
		return succeed;
	}
	static parseJson(instanceOrJson, json, preferredFragment) {
		if (!(instanceOrJson instanceof SidebarFragment.Panel)) {
			json = instanceOrJson;
			instanceOrJson = new SidebarFragment.Panel();
		}
		return ScrollFragment.parseJson.call(this, instanceOrJson, json, preferredFragment);
	}
};

registerFragmentJson("sidebar_panel", SidebarFragment.Panel);
registerFragmentJson("sidebarPanel", SidebarFragment.Panel);
