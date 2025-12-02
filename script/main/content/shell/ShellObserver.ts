namespace ShellObserver {
	export function getCLI() {
		return SHELL;
	}
	export function isInteractive() {
		return isCLI() && Packages.io.nernar.instant.cli.CLI.interactive();
	}
	export function read(justNext: boolean) {
		if (!isInteractive()) {
			return null;
		}
		let symbol = SHELL.read(true);
		if (symbol < 0) {
			MCSystem.throwException("Modding Tools: TTY closed unexpectly!");
		}
		let symbols = [];
		do {
			symbols.push(symbol);
			symbols.push(java.lang.Character.valueOf(symbol));
		} while (!justNext && (symbol = SHELL.read(false)) >= 0);
		return symbols;
	}
	export function trim() {
		let whitespace = 0;
		while (isInteractive() && SHELL.read(false) >= 0) {
			whitespace++;
		}
		return whitespace;
	}
	export function leave() {
		if (isInteractive()) {
			SHELL.reset();
		}
	}
	export let attachedLayers: FocusableWindow[] = [];
	export function includes(indexOrWho: number | FocusableWindow) {
		if (typeof indexOrWho == "number") {
			return indexOrWho >= 0 && indexOrWho < attachedLayers.length;
		}
		return attachedLayers.indexOf(indexOrWho) != -1;
 	}
	export function attach(index: number, who: FocusableWindow) {
		index = index < 0 ? 0 : index > attachedLayers.length ? attachedLayers.length : index;
		let layers = [];
		let offset = 0;
		for (; offset < index; offset++) {
			if (attachedLayers[offset] != who) {
				layers.push(attachedLayers[offset]);
			}
		}
		layers.push(who);
		for (offset++; offset < attachedLayers.length; offset++) {
			if (attachedLayers[offset] != who) {
				layers.push(attachedLayers[offset]);
			}
		}
		ShellObserver.attachedLayers = layers;
	}
	export function push(who: FocusableWindow) {
		return attach(attachedLayers.length, who);
	}
	export function unshift(who: FocusableWindow) {
		return attach(0, who);
	}
	export function dismiss(indexOrWho: number | FocusableWindow) {
		if (typeof indexOrWho != "number") {
			indexOrWho = attachedLayers.lastIndexOf(indexOrWho);
		}
		if (indexOrWho < 0 || indexOrWho >= attachedLayers.length) {
			return;
		}
		let who = attachedLayers[indexOrWho];
		for (let i = 0; i <= indexOrWho; i++) {
			if (attachedLayers[i] == who) {
				attachedLayers.splice(i--, 1);
				indexOrWho--;
			}
		}
	}
	export function pop() {
		return dismiss(attachedLayers.length - 1);
	}
	export function shift() {
		return dismiss(0);
	}
	export function free() {
		while (attachedLayers.length > 0) {
			let length = attachedLayers.length - 1;
			let who = attachedLayers[length];
			if (who instanceof FocusableWindow) {
				who.dismiss();
			}
			while (length < attachedLayers.length) {
				attachedLayers.pop();
			}
		}
	}
}
