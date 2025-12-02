/**
 * @deprecated DEPRECATED SECTION
 * All this will be removed as soon as possible.
 */
namespace LevelProvider {
	export let thereIsNoTPSMeter: boolean = true;
	export let meter: any;
	export let overlay: OverlayWindow;
	export function attach() {
		overlay = new OverlayWindow();
	}
	export function getOverlayWindow() {
		return overlay || null;
	}
	export function isAttached() {
		return getOverlayWindow() !== null;
	}
	export function getFormattedTps() {
		let tps = preround(meter.getTps(), 1);
		if (tps < .1 || tps >= 1000) return "0.0";
		return new java.lang.Float(tps);
	}
	export function update() {
		let overlay = getOverlayWindow();
		if (overlay === null) return false;
		if (!thereIsNoTPSMeter) {
			let tps = getFormattedTps(); // 20.0
			let ticks: number | string = "?";
			try {
				ticks = Updatable.getSyncTime();
			} catch (e) {}
			overlay.setText(ticks + " / " + translate("%stps", tps) + " / " + Math.ceil((java.lang.Runtime.getRuntime().totalMemory() - java.lang.Runtime.getRuntime().freeMemory()) / 1048576) + "MiB");
			return true;
		}
		return false;
	}
	export function updateRecursive() {
		let instance = this;
		handle(function() {
			if (instance.update() && $.LevelInfo.isLoaded()) {
				instance.updateRecursive();
			}
		}, 50);
	}
	export function show() {
		let overlay = getOverlayWindow();
		if (overlay === null) return;
		if (update()) {
			overlay.attach();
			updateRecursive();
		}
	}
	export function hide() {
		let overlay = getOverlayWindow();
		if (overlay === null) return;
		overlay.dismiss();
	}
}

Callback.addCallback("LevelLoaded", () => handle(() => {
	if (LevelProvider.isAttached()) {
		LevelProvider.show();
	}
}));

Callback.addCallback("LevelLeft", () => handle(() => {
	if (LevelProvider.isAttached()) {
		LevelProvider.hide();
	}
}));

try {
	LevelProvider.meter = new InnerCorePackages.api.runtime.TPSMeter(20, 1000);
	Callback.addCallback("LocalTick", () => LevelProvider.meter.onTick());
	LevelProvider.thereIsNoTPSMeter = false;
} catch (e) {
	showHint(translate("Couldn't create engine TPS Meter"));
}
