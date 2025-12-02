/**
 * @deprecated DEPRECATED SECTION
 * All this will be removed as soon as possible.
 */
namespace UniqueHelper {
	export let opened: { [key: string]: FocusableWindow } = {};
	export function getWindow(window: string | FocusableWindow) {
		if (window instanceof FocusableWindow) {
			window = window ? window.TYPE : null;
		}
		return opened[window] || null;
	}
	export function isAttached(window: FocusableWindow) {
		return window == getWindow(window);
	}
	export function wasTypeAttached(window: string | FocusableWindow) {
		return !!getWindow(window);
	}
	export function prepareWindow(window: FocusableWindow) {
		if (wasTypeAttached(window)) {
			let opened = getWindow(window);
			if (opened.isOpened()) {
				// Window are already opened
				if (opened == window) {
					return false;
				}
				// Another unique window with such type is already opened
				if (opened instanceof UniqueWindow && opened.isUpdatable()) {
					let content = window.getLayout();
					opened.setLayout(content);
					opened.updateWindow();
					return false;
				}
				opened.dismiss();
			}
			shiftWindow(opened);
			return prepareWindow(window);
		} else {
			stackWindow(window);
		}
		return true;
	}
	export function deattachWindow(window: FocusableWindow) {
		if (wasTypeAttached(window)) {
			let opened = getWindow(window);
			if (window == opened) {
				shiftWindow(window);
			}
			return true;
		}
		return window.isOpened();
	}
	export function stackWindow(window: FocusableWindow) {
		if (wasTypeAttached(window)) return;
		opened[window.TYPE] = window;
	}
	export function shiftWindow(window: FocusableWindow) {
		if (!wasTypeAttached(window)) return;
		delete opened[window.TYPE];
	}
	export function requireDestroy() {
		for (let type in opened) {
			let window = getWindow(type);
			window.dismiss();
		}
	}
}
