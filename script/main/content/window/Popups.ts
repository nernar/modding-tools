/**
 * @deprecated DEPRECATED SECTION
 * All this will be removed as soon as possible.
 */
namespace Popups {
	export let widgets: FocusablePopup[] = [];
	export function getOpenedIds() {
		let ids = [];
		for (let offset = 0; offset < widgets.length; offset++) {
			ids.push(widgets[offset].id);
		}
		return ids;
	}
	export function getOpened() {
		return widgets;
	}
	export function open(widget: FocusablePopup, id: string) {
		if (widget === undefined || widget === null) {
			Logger.Log("Modding Tools: Widget passed to openPopup " + id + " is undefined or null", "WARNING");
			return;
		}
		let opened = closeIfOpened(id);
		if (!opened) {
			// let index = widgets.length;
			// if (index > maxWindows) {
				// closeFirst();
			// }
			widgets.push(widget);
			widget.id = id;
			widget.showInternal();
		}
	}
	export function getAvailablePlace() {
		if (toComplexUnitDip(192) > getDisplayHeight()) {
			showHint("No place for open popup", ColorDrawable.parseColor("YELLOW"));
			return null;
		}
		return {
			x: random(toComplexUnitDip(64), getDisplayWidth() - toComplexUnitDip(128)),
			y: random(toComplexUnitDip(64), getDisplayHeight() - toComplexUnitDip(128))
		};
	}
	export function hasOpenedByName(id: string) {
		for (let offset = 0; offset < widgets.length; offset++) {
			if (widgets[offset].id == id) {
				return true;
			}
		}
		return false;
	}
	export function close(index: number) {
		let widget = widgets[index];
		if (widget) {
			widget.dismissInternal();
			widgets.splice(index, 1);
			return true;
		}
		return false;
	}
	export function closeFirst() {
		return close(0);
	}
	export function closeAll() {
		while (widgets.length > 0) {
			closeFirst();
		}
	}
	export function closeIfOpened(id: string) {
		for (let offset = 0; offset < widgets.length; offset++) {
			if (widgets[offset].id == id) {
				return close(offset);
			}
		}
		return false;
	}
	export function closeAllByTag(tag: string) {
		if (!tag.endsWith("_")) {
			tag += "_";
		}
		for (let offset = 0; offset < widgets.length; offset++) {
			if (widgets[offset].id.startsWith(tag)) {
				close(offset--);
			}
		}
	}
	export function update(index: number, ...opts: any[]) {
		let widget = widgets[index];
		if (widget) {
			widget.update(...opts);
			return true;
		}
		return false;
	}
	export function updateAtName(id: string, ...opts: any[]) {
		for (let offset = 0; offset < widgets.length; offset++) {
			if (widgets[offset].id == id) {
				return update(offset, ...opts);
			}
		}
		return false;
	}
	export function updateAll(...opts: any[]) {
		for (let offset = 0; offset < widgets.length; offset++) {
			update(offset, ...opts);
		}
	}
}
