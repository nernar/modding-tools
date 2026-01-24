
/**
 * @requires `isAndroid()`
 */
function LegacySidebarWindow() {
	return UniqueWindow.apply(this, arguments);
};

LegacySidebarWindow.NOTHING_SELECTED = -1;

LegacySidebarWindow.prototype = new UniqueWindow;
LegacySidebarWindow.prototype.TYPE = "SidebarWindow";

LegacySidebarWindow.prototype.selected = LegacySidebarWindow.NOTHING_SELECTED;

LegacySidebarWindow.prototype.resetWindow = function() {
	UniqueWindow.prototype.resetWindow.apply(this, arguments);
	this.setGravity($.Gravity.RIGHT);
	this.setHeight($.ViewGroup.LayoutParams.MATCH_PARENT);
	this.setFragment(new LegacySidebarFragment());
	this.groups = [];
	this.setBackground("popup");
	if (!menuDividers) this.setTabBackground("popup");

	let enter = new android.transition.Slide($.Gravity.RIGHT);
	enter.setInterpolator(new android.view.animation.DecelerateInterpolator());
	enter.setDuration(400);
	this.setEnterTransition(enter);

	let exit = new android.transition.Slide($.Gravity.RIGHT);
	exit.setInterpolator(new android.view.animation.BounceInterpolator());
	exit.setDuration(1000);
	this.setExitTransition(exit);
}

LegacySidebarWindow.prototype.getGroups = function(index) {
	return this.groups || null;
};

LegacySidebarWindow.prototype.addGroup = function(srcOrGroup, action) {
	let groups = this.getGroups();
	if (groups === null) return null;
	let group = srcOrGroup instanceof LegacySidebarWindow.Group ?
		srcOrGroup : new LegacySidebarWindow.Group(srcOrGroup, action);
	if (srcOrGroup instanceof LegacySidebarWindow.Group) {
		action && group.setOnSelectListener(action);
	}
	groups.push(group);
	group.attachToWindow(this);
	let fragment = this.getFragment();
	if (fragment !== null) {
		let content = group.getContainer();
		if (content !== null) fragment.addTab(content);
	}
	return group;
};

LegacySidebarWindow.prototype.removeGroup = function(groupOrIndex) {
	let groups = this.getGroups();
	if (groups === null) return false;
	let index = groupOrIndex instanceof LegacySidebarWindow.Group ?
		this.indexOfGroup(groupOrIndex) : groupOrIndex;
	if (index < 0) return false;
	let group = this.getGroupAt(index);
	if (group == null) return false;
	if (group.isSelected()) this.unselect();
	group.deattachFromWindow();
	groups.splice(index, 1);
	let fragment = this.getFragment();
	if (fragment !== null) {
		let content = group.getContainer();
		if (content !== null) fragment.removeTab(content);
	}
	return true;
};

LegacySidebarWindow.prototype.getGroupAt = function(index) {
	let groups = this.getGroups();
	if (groups === null) return null;
	return groups[index] || null;
};

LegacySidebarWindow.prototype.getGroupCount = function() {
	let groups = this.getGroups();
	if (groups === null) return -1;
	return groups.length || 0;
};

LegacySidebarWindow.prototype.indexOfGroup = function(group) {
	let groups = this.getGroups();
	if (groups === null) return -1;
	return groups.indexOf(group);
};

LegacySidebarWindow.prototype.getSelected = function() {
	return this.selected >= 0 ? this.selected : LegacySidebarWindow.NOTHING_SELECTED;
};

LegacySidebarWindow.prototype.isSelected = function() {
	return this.getSelected() != LegacySidebarWindow.NOTHING_SELECTED;
};

LegacySidebarWindow.prototype.getSelectedGroup = function() {
	let selected = this.getSelected();
	if (selected < 0) return null;
	return this.getGroupAt(selected);
};

LegacySidebarWindow.prototype.setBackground = function(src) {
	this.getFragment().setBackground(src);
};

LegacySidebarWindow.prototype.getBackground = function() {
	return this.getFragment().getBackground();
};

LegacySidebarWindow.prototype.setTabBackground = function(src) {
	this.getFragment().setTabBackground(src);
};

LegacySidebarWindow.prototype.getTabBackground = function() {
	return this.getFragment().getTabBackground();
};

LegacySidebarWindow.prototype.unselect = function(forceUpdate) {
	let selected = this.getSelected();
	if (selected < 0) return false;
	let group = this.getSelectedGroup();
	this.selected = LegacySidebarWindow.NOTHING_SELECTED;
	if (group === null) return false;
	group.switchState(!!forceUpdate);
	if (!forceUpdate) this.reinflateLayout();
	return true;
};

LegacySidebarWindow.prototype.select = function(groupOrIndex) {
	let index = groupOrIndex instanceof LegacySidebarWindow.Group ?
		this.indexOfGroup(groupOrIndex) : groupOrIndex;
	if (index < 0) return false;
	let selected = this.getSelected();
	if (selected == index) {
		this.reinflateLayout();
		return false;
	}
	let group = this.getGroupAt(index);
	if (group === null) return false;
	if (this.isSelected()) this.unselect(true);
	this.selected = index;
	group.switchState(selected);
	this.reinflateLayout();
	return true;
};

LegacySidebarWindow.prototype.reinflateLayout = function() {
	let sidebar = this,
		fragment = this.getFragment();
	if (fragment !== null) {
		if (this.isSelected()) {
			let set = new android.transition.TransitionSet(),
				slide = new android.transition.Slide($.Gravity.RIGHT),
				bounds = new android.transition.ChangeBounds();
			if (this.isTouchable()) {
				set.addListener({
					onTransitionStart: function(transition) {
						try {
							sidebar.setTouchable(false);
						} catch (e) {
							reportError(e);
						}
					},
					onTransitionEnd: function(transition) {
						try {
							sidebar.setTouchable(true);
						} catch (e) {
							reportError(e);
						}
					}
				});
			}
			slide.setInterpolator(new android.view.animation.AccelerateDecelerateInterpolator());
			slide.setDuration(150);
			set.addTransition(slide);
			bounds.setStartDelay(25);
			bounds.setDuration(100);
			bounds.setInterpolator(new android.view.animation.AnticipateInterpolator());
			set.addTransition(bounds);
			let container = fragment.getItemContainer();
			this.beginDelayedTransition(container, set);
		}
		fragment.clearItems();
		let group = this.getSelectedGroup();
		if (group !== null) {
			for (let i = 0; i < group.getItemCount(); i++) {
				let item = group.getItemAt(i),
					content = item.getContainer();
				if (content !== null) fragment.addItem(content);
			}
		}
	}
	return this;
};

LegacySidebarWindow.prototype.setOnGroupSelectListener = function(listener) {
	this.onGroupSelect = listener;
	return this;
};

LegacySidebarWindow.prototype.setOnGroupUndockListener = function(listener) {
	this.onGroupUndock = listener;
	return this;
};

LegacySidebarWindow.prototype.setOnGroupFetchListener = function(listener) {
	this.onGroupFetch = listener;
	return this;
};

LegacySidebarWindow.prototype.setOnItemSelectListener = function(listener) {
	this.onItemSelect = listener;
	return this;
};

LegacySidebarWindow.prototype.setOnItemFetchListener = function(listener) {
	this.onItemFetch = listener;
	return this;
};

LegacySidebarWindow.Group = new Function();

LegacySidebarWindow.Group = function(parentOrSrc, srcOrAction, action) {
	LegacySidebarFragment.Group.apply(this, arguments);
	let scope = this;
	this.setOnClickListener(function() {
		let window = scope.getWindow();
		if (window === null) return;
		if (scope.isSelected()) {
			window.unselect();
		} else window.select(scope);
	});
	this.setOnHoldListener(function() {
		let window = scope.getWindow(),
			hint = null;
		if (window !== null) {
			window.onGroupFetch && (hint = window.onGroupFetch(window, scope, scope.indexOf()) || hint);
		}
		scope.onFetch && (hint = scope.onFetch(scope, scope.indexOf()) || hint);
		if (hint !== null) showHint(hint);
		return true;
	});
	this.items = [];
	if (parentOrSrc instanceof LegacySidebarWindow) {
		this.attachToWindow(parentOrSrc);
		srcOrAction && this.setImage(srcOrAction);
		action && this.setOnSelectListener(action);
	} else {
		parentOrSrc && this.setImage(parentOrSrc);
		srcOrAction && this.setOnSelectListener(srcOrAction);
	}
	this.setSelectedBackground("popupSelectionSelected");
	menuDividers && this.setUnselectedBackground("popup");
};

LegacySidebarWindow.Group.prototype = new LegacySidebarFragment.Group;

LegacySidebarWindow.Group.prototype.getWindow = function() {
	return this.window || null;
};

LegacySidebarWindow.Group.prototype.attachToWindow = function(window) {
	if (!window) MCSystem.throwException("ModdingTools: Window can not be null or undefined!");
	let attached = this.getWindow();
	if (attached != null) MCSystem.throwException("ModdingTools: You are must deattach sidebar group firstly!");
	let actor = new android.transition.ChangeBounds();
	actor.setDuration(200);
	window.beginDelayedTransition(actor);
	this.window = window;
	this.updateBackground();
	return true;
};

LegacySidebarWindow.Group.prototype.deattachFromWindow = function() {
	let window = this.getWindow();
	if (window == null) return false;
	let actor = new android.transition.ChangeBounds();
	actor.setDuration(500);
	window.beginDelayedTransition(actor);
	delete this.window;
	this.updateBackground();
	return true;
};

LegacySidebarWindow.Group.prototype.switchState = function(previous) {
	let window = this.getWindow();
	if (this.isSelected()) {
		this.onSelect && this.onSelect(this, this.indexOf(), previous, this.getItemCount());
		if (window !== null) {
			window.onGroupSelect && window.onGroupSelect(window, this, this.indexOf(), previous, this.getItemCount());
		}
	} else {
		this.onUndock && this.onUndock(this, this.indexOf(), previous);
		if (window !== null) {
			window.onGroupUndock && window.onGroupUndock(window, this, this.indexOf(), previous);
		}
	}
	this.updateBackground();
	return this;
};

LegacySidebarWindow.Group.prototype.isSelected = function() {
	let window = this.getWindow();
	if (window === null) return false;
	return window.getSelected() == this.indexOf();
};

LegacySidebarWindow.Group.prototype.getUnselectedBackground = function() {
	return this.unselectedBackground || null;
};

LegacySidebarWindow.Group.prototype.getSelectedBackground = function() {
	return this.selectedBackground || null;
};

LegacySidebarWindow.Group.prototype.updateBackground = function() {
	this.setBackground(this.isSelected() ?
		this.getSelectedBackground() : this.getUnselectedBackground());
	return this;
};

LegacySidebarWindow.Group.prototype.setUnselectedBackground = function(src) {
	this.unselectedBackground = src;
	this.updateBackground();
	return this;
};

LegacySidebarWindow.Group.prototype.setSelectedBackground = function(src) {
	this.selectedBackground = src;
	this.updateBackground();
	return this;
};

LegacySidebarWindow.Group.prototype.getItems = function() {
	return this.items || null;
};

LegacySidebarWindow.Group.prototype.addItem = function(srcOrItem, action) {
	let items = this.getItems();
	if (items === null) return null;
	let item = srcOrItem instanceof LegacySidebarWindow.Group.Item ?
		srcOrItem : new LegacySidebarWindow.Group.Item(srcOrItem, action);
	if (srcOrItem instanceof LegacySidebarWindow.Group.Item) {
		action && item.setOnClickListener(action);
	}
	items.push(item);
	item.attachToGroup(this);
	if (this.isSelected()) {
		let window = this.getWindow();
		if (window !== null) {
			let fragment = window.getFragment();
			if (fragment !== null) {
				let content = item.getContainer();
				if (content !== null) fragment.addItem(content);
			}
		}
	}
	return item;
};

LegacySidebarWindow.Group.prototype.removeItem = function(itemOrIndex) {
	let items = this.getItems();
	if (items === null) return false;
	let index = itemOrIndex instanceof LegacySidebarWindow.Group.Item ?
		this.indexOfItem(itemOrIndex) : itemOrIndex;
	if (index < 0) return false;
	let item = this.getItemAt(index);
	if (item === null) return false;
	item.deattachFromGroup();
	items.splice(index, 1);
	let window = this.getWindow();
	if (window !== null) {
		let fragment = window.getFragment();
		if (fragment !== null) {
			let content = item.getContainer();
			if (content !== null) fragment.removeItem(content);
		}
	}
	return true;
};

LegacySidebarWindow.Group.prototype.getItemAt = function(index) {
	let items = this.getItems();
	if (items === null) return null;
	return items[index] || null;
};

LegacySidebarWindow.Group.prototype.getItemCount = function() {
	let items = this.getItems();
	if (items === null) return -1;
	return items.length || 0;
};

LegacySidebarWindow.Group.prototype.indexOfItem = function(item) {
	let items = this.getItems();
	if (items === null) return -1;
	return items.indexOf(item);
};

LegacySidebarWindow.Group.prototype.indexOf = function() {
	let window = this.getWindow();
	if (window === null) return -1;
	return window.indexOfGroup(this);
};

LegacySidebarWindow.Group.prototype.setOnSelectListener = function(listener) {
	this.onSelect = listener;
	return this;
};

LegacySidebarWindow.Group.prototype.setOnUndockListener = function(listener) {
	this.onUndock = listener;
	return this;
};

LegacySidebarWindow.Group.prototype.setOnFetchListener = function(listener) {
	this.onFetch = listener;
	return this;
};

LegacySidebarWindow.Group.prototype.setOnItemSelectListener = function(listener) {
	this.onItemSelect = listener;
	return this;
};

LegacySidebarWindow.Group.prototype.setOnItemFetchListener = function(listener) {
	this.onItemFetch = listener;
	return this;
};

LegacySidebarWindow.Group.parseJson = function(instanceOrJson, json) {
	if (!(instanceOrJson instanceof LegacySidebarWindow.Group)) {
		json = instanceOrJson;
		instanceOrJson = new LegacySidebarWindow.Group();
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
					item = LegacySidebarWindow.Group.Item.parseJson.call(this, item);
					instanceOrJson.addItem(item);
				}
			}
		}
	}
	return instanceOrJson;
};

LegacySidebarWindow.Group.Item = function(parentOrSrc, srcOrAction, action) {
	LegacySidebarFragment.Group.Item.apply(this, arguments);
	let scope = this;
	this.setOnClickListener(function() {
		scope.onSelect && scope.onSelect(scope, scope.indexOf());
		let group = scope.getGroup();
		if (group !== null) {
			group.onItemSelect && group.onItemSelect(group, scope, group.indexOf(), scope.indexOf());
			let window = group.getWindow();
			if (window !== null) {
				window.onItemSelect && window.onItemSelect(window, group, scope, group.indexOf(), scope.indexOf());
			}
		}
	});
	this.setOnHoldListener(function() {
		let group = scope.getGroup(),
			hint = null;
		if (group !== null) {
			let window = group.getWindow();
			if (window !== null) {
				window.onItemFetch && (hint = window.onItemFetch(window, group, scope, group.indexOf(), scope.indexOf()) || hint);
			}
			group.onItemFetch && (hint = group.onItemFetch(group, scope, group.indexOf(), scope.indexOf()) || hint);
		}
		scope.onFetch && (hint = scope.onFetch(scope, scope.indexOf()) || hint);
		if (hint !== null) showHint(hint);
		return true;
	});
	if (parentOrSrc instanceof LegacySidebarWindow.Group) {
		this.attachToGroup(parentOrSrc);
		srcOrAction && this.setImage(srcOrAction);
		action && this.setOnSelectListener(action);
	} else {
		parentOrSrc && this.setImage(parentOrSrc);
		srcOrAction && this.setOnSelectListener(srcOrAction);
	}
};

LegacySidebarWindow.Group.Item.prototype = new LegacySidebarFragment.Group.Item;

LegacySidebarWindow.Group.Item.prototype.getGroup = function() {
	return this.group || null;
};

LegacySidebarWindow.Group.Item.prototype.attachToGroup = function(group) {
	if (!group) MCSystem.throwException("ModdingTools: Group can not be null or undefined!");
	let attached = this.getGroup();
	if (attached !== null) MCSystem.throwException("ModdingTools: You are must deattach sidebar item firstly!");
	let window = group.getWindow();
	if (window !== null) {
		let actor = new android.transition.ChangeBounds();
		actor.setDuration(200);
		window.beginDelayedTransition(actor);
	}
	this.group = group;
	return true;
};

LegacySidebarWindow.Group.Item.prototype.deattachFromGroup = function() {
	let group = this.getGroup();
	if (group == null) return false;
	let window = group.getWindow();
	if (window != null) {
		let actor = new android.transition.ChangeBounds();
		actor.setDuration(350);
		window.beginDelayedTransition(actor);
	}
	delete this.group;
	return true;
};

LegacySidebarWindow.Group.Item.prototype.indexOf = function() {
	let group = this.getGroup();
	if (group === null) return -1;
	return group.indexOfItem(this);
};

LegacySidebarWindow.Group.Item.prototype.setOnSelectListener = function(listener) {
	this.onSelect = listener;
	return this;
};

LegacySidebarWindow.Group.Item.prototype.setOnFetchListener = function(listener) {
	this.onFetch = listener;
	return this;
};

LegacySidebarWindow.Group.Item.parseJson = function(instanceOrJson, json) {
	if (!(instanceOrJson instanceof LegacySidebarWindow.Group.Item)) {
		json = instanceOrJson;
		instanceOrJson = new LegacySidebarWindow.Group.Item();
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
	if (json.hasOwnProperty("select")) {
		instanceOrJson.setOnSelectListener(parseCallback(json, json.select, this));
	}
	if (json.hasOwnProperty("fetch")) {
		instanceOrJson.setOnFetchListener(parseCallback(json, json.fetch, this));
	}
	return instanceOrJson;
};

LegacySidebarWindow.isSelected = function(group) {
	let currently = UniqueHelper.getWindow("LegacySidebarWindow");
	return currently && currently.getSelected() == group;
};

LegacySidebarWindow.parseJson = function(instanceOrJson, json) {
	Logger.Log("Modding Tools: Using legacy sidebar, which can lead to unexpected behaviors!", "WARNING");
	if (!(instanceOrJson instanceof LegacySidebarWindow)) {
		json = instanceOrJson;
		instanceOrJson = new LegacySidebarWindow();
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
					group = LegacySidebarWindow.Group.parseJson.call(this, group);
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
