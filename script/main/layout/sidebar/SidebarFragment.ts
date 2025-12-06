class SidebarFragment {
	constructor() {
		MCSystem.throwException("Modding Tools: SidebarFragment cannot be instantiated!");
	}
}

namespace SidebarFragment {
	export class Rail extends ScrollFragment {
		protected selectionFragment?: LayoutFragment;
		protected onFetchItem?: (item: Rail.Item, index: number) => void | string;

		override resetContainer() {
			let container = new android.widget.LinearLayout(getContext());
			container.setLayoutDirection(android.view.View.LAYOUT_DIRECTION_RTL);
			this.setContainerView(container);

			// @ts-expect-error
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
		addViewDirectly(view: android.view.View, params?: android.view.ViewGroup.LayoutParams) {
			if (params == null && this.hasMark("fill")) {
				let filledParams = new android.widget.LinearLayout.LayoutParams(
					$.ViewGroup.LayoutParams.WRAP_CONTENT, $.ViewGroup.LayoutParams.MATCH_PARENT
				);
				menuDividers && (filledParams.topMargin = toComplexUnitDip(1));
				filledParams.weight = 1.;
				super.addViewDirectly(view, filledParams);
				return;
			}
			super.addViewDirectly(view, params);
		}
		selectItemInLayout(item: Rail.Item) {
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
		unselectItemInLayout(item: Rail.Item) {
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
		setContainerBackground(src: IDrawableJson) {
			return this.setBackground(src, "container", this.getContainerLayout());
		}
		expand(condition?: (fragment: Fragment) => boolean) {
			let fragments = this.getFragments();
			for (let offset = 0; offset < fragments.length; offset++) {
				let fragment = fragments[offset];
				if (fragment.expand && (!condition || condition.call(this, fragment))) {
					fragment.expand();
				}
			}
		}
		collapse(condition?: (fragment: Fragment) => boolean) {
			let fragments = this.getFragments();
			for (let offset = 0; offset < fragments.length; offset++) {
				let fragment = fragments[offset];
				if (fragment.collapse && (!condition || condition.call(this, fragment))) {
					fragment.collapse();
				}
			}
		}
		fetchItemInLayout(item: Rail.Item) {
			return (this.onFetchItem && this.onFetchItem(item, item.getIndex())) || null;
		}
		setOnFetchItemListener(listener: typeof this.onFetchItem) {
			if (listener != null) {
				this.onFetchItem = listener;
			} else {
				delete this.onFetchItem;
			}
			return this;
		}
	}

	export namespace Rail {
		export function parseJson<RT extends SidebarFragment.Rail = SidebarFragment.Rail, JT extends SidebarFragment.IRail = SidebarFragment.IRail>(json?: JT): RT;
		export function parseJson<RT extends SidebarFragment.Rail = SidebarFragment.Rail, JT extends SidebarFragment.IRail = SidebarFragment.IRail>(instance: RT, json?: JT, preferredFragment?: string): RT;
		export function parseJson<RT extends SidebarFragment.Rail = SidebarFragment.Rail, JT extends SidebarFragment.IRail = SidebarFragment.IRail>(instanceOrJson: RT | JT, json?: JT, preferredFragment?: string) {
			if (!(instanceOrJson instanceof SidebarFragment.Rail)) {
				json = instanceOrJson;
				instanceOrJson = new SidebarFragment.Rail() as RT;
			} else {
				instanceOrJson.getSelectionFragment().removeFragments();
			}
			instanceOrJson = ScrollFragment.parseJson.call(this, instanceOrJson, json, preferredFragment || "sidebarRailItem") as RT;
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

		export function parseLegacyJson<RT extends SidebarFragment.Rail = SidebarFragment.Rail, JT extends SidebarFragment.IRail = SidebarFragment.IRail>(json?: JT): RT;
		export function parseLegacyJson<RT extends SidebarFragment.Rail = SidebarFragment.Rail, JT extends SidebarFragment.IRail = SidebarFragment.IRail>(instance: RT, json?: JT, preferredFragment?: string): RT;
		/*
		{
			groups: [{
				icon: "uiFrame",
				items: [{
					icon: "explorerImport",
					title: translate("Prototype")
				}, {
					icon: "inspectorPrototype",
					title: translate("Description")
				}, {
					icon: "uiFrame",
					title: translate("Location")
				}, {
					icon: "uiFrameMarkup",
					title: translate("Substrate")
				}, {
					icon: "uiFrameLayer",
					title: translate("Move")
				}, {
					icon: "uiFrameSubstrate",
					title: translate("Transparency")
				}
			}]
		}
		*/
		export function parseLegacyJson<RT extends SidebarFragment.Rail = SidebarFragment.Rail, JT extends SidebarFragment.IRail = SidebarFragment.IRail>(instanceOrJson: RT | JT, json?: JT, preferredFragment?: string) {
			if (!(instanceOrJson instanceof SidebarFragment.Rail)) {
				json = instanceOrJson;
				instanceOrJson = new SidebarFragment.Rail() as RT;
			} else {
				instanceOrJson.getSelectionFragment().removeFragments();
			}
			instanceOrJson = ScrollFragment.parseJson.call(this, instanceOrJson, json, preferredFragment || "sidebarRailItem") as RT;
			json = calloutOrParse(this, json, instanceOrJson);
			if (json == null || typeof json != "object") {
				return instanceOrJson;
			}
			// TODO: groups, add rail with items to every group
			return instanceOrJson;
		};

		export class Item extends LayoutFragment {
			protected onFetch?: () => void | string;
			override resetContainer() {
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
				return this.findViewByTag("railItemIcon") as android.widget.ImageView;
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
				super.click();
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
				return super.hold() || text != null;
			}
			updateLayout() {
				this.updateSelection();
				super.updateLayout();
			}
			setOnFetchListener(listener: typeof this.onFetch) {
				if (listener != null) {
					this.onFetch = listener;
				} else {
					delete this.onFetch;
				}
				return this;
			}
		}

		export namespace Item {
			export function parseJson<RT extends SidebarFragment.Rail.Item = SidebarFragment.Rail.Item, JT extends SidebarFragment.Rail.IItem = SidebarFragment.Rail.IItem>(json?: JT): RT;
			export function parseJson<RT extends SidebarFragment.Rail.Item = SidebarFragment.Rail.Item, JT extends SidebarFragment.Rail.IItem = SidebarFragment.Rail.IItem>(instance: RT, json?: JT, preferredFragment?: string): RT;
			export function parseJson<RT extends SidebarFragment.Rail.Item = SidebarFragment.Rail.Item, JT extends SidebarFragment.Rail.IItem = SidebarFragment.Rail.IItem>(instanceOrJson: RT | JT, json?: JT, preferredFragment?: string) {
				if (!(instanceOrJson instanceof SidebarFragment.Rail.Item)) {
					json = instanceOrJson;
					instanceOrJson = new SidebarFragment.Rail.Item() as RT;
				}
				instanceOrJson = LayoutFragment.parseJson.call(this, instanceOrJson, json, preferredFragment || "sidebarPanel") as RT;
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
		}
	}
	
	export class Panel extends ScrollFragment {
		override resetContainer() {
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
	}
}

__inherit__(SidebarFragment.Rail, ScrollFragment, SelectableLayoutFragment.prototype);

registerFragmentJson("sidebar_rail", SidebarFragment.Rail);
registerFragmentJson("sidebarRail", SidebarFragment.Rail);

__inherit__(SidebarFragment.Rail.Item, LayoutFragment, ImageFragmentMixin, SelectableFragment.prototype);

registerFragmentJson("sidebar_rail_item", SidebarFragment.Rail.Item);
registerFragmentJson("sidebarRailItem", SidebarFragment.Rail.Item);

registerFragmentJson("sidebar_panel", SidebarFragment.Panel);
registerFragmentJson("sidebarPanel", SidebarFragment.Panel);

/*
SidebarWindow.parseJson = function(instanceOrJson, json) {
	if (!(instanceOrJson instanceof SidebarWindow)) {
		json = instanceOrJson;
		instanceOrJson = new SidebarWindow();
	}
	json = calloutOrParse(this, json, instanceOrJson);
	while (instanceOrJson.getGroupCount() > 0) {
		instanceOrJson.removeGroup(0);
	}
	if (json === null || typeof json != "object") {
		return instanceOrJson;
	}
	if (json.hasOwnProperty("background")) {
		instanceOrJson.setBackground(calloutOrParse(json, json.background, [this, instanceOrJson]));
	}
	if (json.hasOwnProperty("tabBackground")) {
		instanceOrJson.setTabBackground(calloutOrParse(json, json.tabBackground, [this, instanceOrJson]));
	}
	if (json.hasOwnProperty("selectGroup")) {
		instanceOrJson.setOnGroupSelectListener(parseCallback(json, json.selectGroup, this));
	}
	if (json.hasOwnProperty("undockGroup")) {
		instanceOrJson.setOnGroupUndockListener(parseCallback(json, json.undockGroup, this));
	}
	if (json.hasOwnProperty("fetchGroup")) {
		instanceOrJson.setOnGroupFetchListener(parseCallback(json, json.fetchGroup, this));
	}
	if (json.hasOwnProperty("selectItem")) {
		instanceOrJson.setOnItemSelectListener(parseCallback(json, json.selectItem, this));
	}
	if (json.hasOwnProperty("fetchItem")) {
		instanceOrJson.setOnItemFetchListener(parseCallback(json, json.fetchItem, this));
	}
	if (json.hasOwnProperty("groups")) {
		let groups = calloutOrParse(json, json.groups, [this, instanceOrJson]);
		if (groups !== null && typeof groups == "object") {
			if (!Array.isArray(groups)) groups = [groups];
			for (let i = 0; i < groups.length; i++) {
				let group = calloutOrParse(groups, groups[i], [this, json, instanceOrJson]);
				if (group !== null && typeof group == "object") {
					group = SidebarWindow.Group.parseJson.call(this, group);
					instanceOrJson.addGroup(group);
				}
			}
		}
	}
	if (json.hasOwnProperty("select")) {
		instanceOrJson.select(calloutOrParse(json, json.select, [this, instanceOrJson]));
	}
	return instanceOrJson;
};

SidebarWindow.Group.parseJson = function(instanceOrJson, json) {
	if (!(instanceOrJson instanceof SidebarWindow.Group)) {
		json = instanceOrJson;
		instanceOrJson = new SidebarWindow.Group();
	}
	json = calloutOrParse(this, json, instanceOrJson);
	while (instanceOrJson.getItemCount() > 0) {
		instanceOrJson.removeItem(0);
	}
	if (json === null || typeof json != "object") {
		return instanceOrJson;
	}
	if (json.hasOwnProperty("selectedBackground")) {
		instanceOrJson.setSelectedBackground(calloutOrParse(json, json.selectedBackground, [this, instanceOrJson]));
	}
	if (json.hasOwnProperty("unselectedBackground")) {
		instanceOrJson.setUnselectedBackground(calloutOrParse(json, json.unselectedBackground, [this, instanceOrJson]));
	}
	if (json.hasOwnProperty("background")) {
		instanceOrJson.setBackground(calloutOrParse(json, json.background, [this, instanceOrJson]));
	}
	if (json.hasOwnProperty("icon")) {
		instanceOrJson.setImage(calloutOrParse(json, json.icon, [this, instanceOrJson]));
	}
	if (json.hasOwnProperty("select")) {
		instanceOrJson.setOnSelectListener(parseCallback(json, json.select, this));
	}
	if (json.hasOwnProperty("undock")) {
		instanceOrJson.setOnUndockListener(parseCallback(json, json.undock, this));
	}
	if (json.hasOwnProperty("fetch")) {
		instanceOrJson.setOnFetchListener(parseCallback(json, json.fetch, this));
	}
	if (json.hasOwnProperty("selectItem")) {
		instanceOrJson.setOnItemSelectListener(parseCallback(json, json.selectItem, this));
	}
	if (json.hasOwnProperty("fetchItem")) {
		instanceOrJson.setOnItemFetchListener(parseCallback(json, json.fetchItem, this));
	}
	if (json.hasOwnProperty("items")) {
		let items = calloutOrParse(json, json.items, [this, instanceOrJson]);
		if (items !== null && typeof items == "object") {
			if (!Array.isArray(items)) items = [items];
			for (let i = 0; i < items.length; i++) {
				let item = calloutOrParse(items, items[i], [this, json, instanceOrJson]);
				if (item !== null && typeof item == "object") {
					item = SidebarWindow.Group.Item.parseJson.call(this, item);
					instanceOrJson.addItem(item);
				}
			}
		}
	}
	return instanceOrJson;
};
*/
