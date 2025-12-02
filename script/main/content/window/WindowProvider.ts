/**
 * @deprecated DEPRECATED SECTION
 * All this will be removed as soon as possible.
 * @requires `isAndroid()`
 */
namespace WindowProvider {
	export const BASE_WINDOW_FLAGS = isHorizon ? 256 : 0;
	export let attached: { [popupId: number]: android.widget.PopupWindow } = {};
	export let nextPopupId = 0;
	export function getWindowManager(): android.view.WindowManager {
		return getContext().getSystemService("window");
	}
	export function getFlagsForWindow(window: FocusableWindow) {
		let flags = isInstant ? 0 : BASE_WINDOW_FLAGS;
		if (!window) {
			return flags;
		}
		if (!window.isTouchable()) {
			flags |= 16;
		} else if (!window.isFullscreen()) {
			flags |= 32;
		}
		if (window.isFullscreen()) {
			return flags | 2;
		}
		return flags;
	}
	export function prepareIdentifier(window: FocusableWindow) {
		if (window.popupId !== undefined) {
			return window.popupId;
		}
		window.popupId = ++nextPopupId;
		return window.popupId;
	}
	export function hasOpenedPopup(window: FocusableWindow) {
		return !!(window.popupId == -1 || getByPopupId(window.popupId));
	}
	export function getByPopupId(popupId: number) {
		if (popupId === undefined || popupId == -1) return null;
		return attached[popupId] || null;
	}
	export function openWindow(window: FocusableWindow) {
		if (hasOpenedPopup(window)) {
			return;
		}
		let content = window.getContainer();
		if (!window.isFocusable()) {
			if (content) {
				// if (isInstant) {
					// content.setFitsSystemWindows(true);
				// } else if (isHorizon) {
					content.setSystemUiVisibility(5894);
				// }
			}
			let popup = content ? new android.widget.PopupWindow(content, window.getWidth(), window.getHeight())
					: new android.widget.PopupWindow(window.getWidth(), window.getHeight()),
				popupId = prepareIdentifier(window);
			attached[popupId] = popup;
			popup.setAttachedInDecor(isHorizon && !isInstant);
			popup.setTouchable(window.isTouchable());
			let enter = window.getEnterTransition();
			if (enter != null) setEnterTransition(popupId, enter);
			let exit = window.getExitTransition();
			if (exit != null) setExitTransition(popupId, exit);
			popup.showAtLocation(getDecorView(), window.getGravity(), window.getX(), window.getY());
			return;
		}
		window.popupId = -1;
		let flags = getFlagsForWindow(window);
		getWindowManager().addView(content, window.getParams(flags));
	}
	export function closeWindow(window: FocusableWindow) {
		if (!window.isFocusable()) {
			let popupId = window.popupId,
				popup = getByPopupId(popupId);
			if (popup == null) return;
			popup.dismiss();
			delete attached[popupId];
			delete window.popupId;
			return;
		}
		if (window.popupId != -1) return;
		delete window.popupId;
		getWindowManager().removeView(window.getContainer());
	}
	export function setEnterTransition(popupId: number, actor: android.transition.Transition) {
		if (android.os.Build.VERSION.SDK_INT >= 23) {
			let popup = getByPopupId(popupId);
			if (popup == null) return;
			popup.setEnterTransition(actor);
		}
	}
	export function setExitTransition(popupId: number, actor: android.transition.Transition) {
		if (android.os.Build.VERSION.SDK_INT >= 23) {
			let popup = getByPopupId(popupId);
			if (popup == null) return;
			popup.setExitTransition(actor);
		}
	}
	export function updateWindow(window: FocusableWindow) {
		if (!window.isFocusable()) {
			let popupId = window.popupId,
				popup = getByPopupId(popupId);
			if (popup == null) return;
			let enter = window.getEnterTransition();
			if (enter != null) setEnterTransition(popupId, enter);
			let exit = window.getExitTransition();
			if (exit != null) setExitTransition(popupId, exit);
			popup.setContentView(window.getContainer());
			popup.setTouchable(window.isTouchable());
			popup.setFocusable(window.isFocusable());
			popup.update(window.getX(), window.getY(),
				window.getWidth(), window.getHeight());
			return;
		}
		if (window.popupId != -1) return;
		let flags = getFlagsForWindow(window);
		getWindowManager().updateViewLayout(window.getContainer(), window.getParams(flags));
	}
	export function destroy() {
		for (let item in attached) {
			attached[item].dismiss();
		}
		attached = {};
	}
}
