class AdditionalMessage {
	protected src?: IDrawableJson = AdditionalMessage.DEFAULT_SRC;
	protected message?: string;
	protected chance?: number;
	protected condition?: () => boolean;
	constructor(src: IDrawableJson, message: string, chance?: number, condition?: () => boolean) {
		if (src !== undefined) this.setImage(src);
		if (message !== undefined) this.setMessage(message);
		if (chance !== undefined) this.setChance(chance);
		if (condition !== undefined) this.setCondition(condition);
	}
	getMessage() {
		return this.message || null;
	}
	getLocalizedMessage() {
		return translate(this.getMessage());
	}
	setMessage(message: any) {
		if (!(message instanceof String)) {
			message = "" + message;
		}
		if (message.length > AdditionalMessage.MAX_MESSAGE_SYMBOLS) {
			message = message.substring(AdditionalMessage.MAX_MESSAGE_SYMBOLS);
		}
		this.message = message;
	}
	getImage() {
		return this.src || null;
	}
	setImage(src: IDrawableJson) {
		this.src = src;
	}
	getChance() {
		return this.hasOwnProperty("chance") ? this.chance : 1;
	}
	setChance(chance: number) {
		if (chance < 0 || chance > 1) {
			MCSystem.throwException("Modding Tools: AdditionalMessage.setChance outside [0; 1]");
		}
		this.chance = chance;
	}
	getCondition() {
		return this.condition || null;
	}
	setCondition(condition?: () => boolean) {
		if (condition == null) {
			delete this.condition;
			return;
		}
		if (typeof condition != "function") {
			MCSystem.throwException("Modding Tools: AdditionalMessage.setCondition can take functions only");
		}
		this.condition = condition;
	}
	tryToDisplay() {
		let condition = this.getCondition();
		if (condition !== null) {
			if (condition.call(this) != true) {
				return false;
			}
		}
		let chance = this.getChance();
		if (chance < 1) {
			return Math.random() < chance;
		}
		return true;
	}
}

namespace AdditionalMessage {
	export const MAX_MESSAGE_SYMBOLS = 256;
	export const DEFAULT_SRC = "menuBoard";
}

class AdditionalClickableMessage extends AdditionalMessage {
	action?: () => void;
	constructor(src: IDrawableJson, message: string, chance?: number, action?: () => void, condition?: () => boolean) {
		super(src, message, chance, condition);
		if (action !== undefined) this.setAction(action);
	}
	getAction() {
		return this.action || null;
	}
	setAction(action?: () => void) {
		if (!(action instanceof Function)) {
			MCSystem.throwException("Modding Tools: AdditionalClickableMessage.setAction only can take functions");
		}
		this.action = action;
	}
}

namespace AdditionalMessageFactory {
	export let registered: AdditionalMessage[] = [];
	export function getRegistered() {
		return registered || null;
	}
	export function getRegisteredCount() {
		return getRegistered().length;
	}
	export function indexOf(message: AdditionalMessage) {
		return getRegistered().indexOf(message);
	}
	export function getMessageAt(index: number) {
		return getRegistered()[index] || null;
	}
	export function hasMessage(message: AdditionalMessage) {
		return indexOf(message) != -1;
	}
	export function removeMessage(messageOrIndex: number | AdditionalMessage) {
		if (typeof messageOrIndex != "number") {
			messageOrIndex = indexOf(messageOrIndex);
		}
		if (messageOrIndex == -1) return false;
		getRegistered().splice(messageOrIndex, 1);
		return true;
	}
	export function register(message: AdditionalMessage): number;
	export function register(src: IDrawableJson, message: string, chance?: number, condition?: () => boolean): number;
	export function register(srcOrMessage: IDrawableJson | AdditionalMessage, message?: string, chance?: number, condition?: () => boolean) {
		if (!(srcOrMessage instanceof AdditionalMessage)) {
			srcOrMessage = new AdditionalMessage(srcOrMessage, message, chance, condition);
		}
		return getRegistered().push(srcOrMessage) - 1;
	}
	export function registerClickable(message: AdditionalClickableMessage): number;
	export function registerClickable(src: IDrawableJson, message: string, chance?: number, action?: () => void, condition?: () => boolean): number;
	export function registerClickable(srcOrMessage: IDrawableJson | AdditionalClickableMessage, message?: string, chance?: number, action?: () => void, condition?: () => boolean) {
		if (!(srcOrMessage instanceof AdditionalClickableMessage)) {
			srcOrMessage = new AdditionalClickableMessage(srcOrMessage, message, chance, action, condition);
		}
		return getRegistered().push(srcOrMessage) - 1;
	}
	export function resetAll() {
		registered = [];
	}
	export function randomize(limit: number = -1) {
		let registered = getRegistered();
		if (registered === null) return [];
		let randomized: AdditionalMessage[] = [];
		registered = registered.sort(() => .5 - Math.random());
		for (let offset = 0; offset < registered.length; offset++) {
			let message = registered[offset];
			if (message.tryToDisplay()) randomized.push(message);
			if (limit != -1 && randomized.length >= limit) break;
		}
		return randomized;
	}

	/**
	 * @deprecated DEPRECATED SECTION
	 * All this will be removed as soon as possible.
	 */
	export class Session {
		protected count?: number = 1;
		protected limit?: number = -1;
		protected randomized?: AdditionalMessage[];
		protected indexed?: { [position: number]: AdditionalMessage[] };
		protected position?: number;

		constructor(count?: number, limit?: number) {
			if (count !== undefined) this.setCount(count);
			if (limit !== undefined) this.setLimit(limit);
			this.complete();
		}
		getCount() {
			return this.count > 0 ? this.count : 1;
		}
		setCount(count: number) {
			this.count = preround(count, 0);
			return this;
		}
		getLimit() {
			return this.limit !== undefined ? this.limit : -1;
		}
		setLimit(limit: number) {
			this.limit = preround(limit, 0);
			return this;
		}
		toResult() {
			if (!this.hasOwnProperty("randomized")) {
				this.queue();
			}
			return this.randomized;
		}
		getMessageCount() {
			return this.toResult().length;
		}
		queue() {
			this.randomized = AdditionalMessageFactory.randomize(this.getLimit());
			let indexed: { [position: number]: AdditionalMessage[] } = this.indexed = {};
			for (let offset = 0; offset < this.getCount(); offset++) {
				indexed[offset + 1] = [];
			}
			for (let offset = 0; offset < this.getMessageCount(); offset++) {
				let position = offset % this.getCount() + 1;
				indexed[position].push(this.randomized[offset]);
			}
			let values = [];
			for (let index in indexed) {
				values.push(indexed[index]);
			}
			values = values.sort(function (a, b) {
				return .5 - Math.random();
			});
			for (let offset = 0; offset < values.length; offset++) {
				indexed[offset + 1] = values[offset];
			}
		}
		attachNext(control: MenuWindow) {
			if (!this.hasMore()) {
				return this.complete();
			}

			let randomized = this.toResult();
			if (randomized.length == 0) {
				return false;
			}
			this.position++;

			if (this.indexed.hasOwnProperty(this.position)) {
				let indexed = this.indexed[this.position];
				if (Array.isArray(indexed)) {
					for (let offset = 0; offset < indexed.length; offset++) {
						this.attach(control, indexed[offset]);
					}
				}
			}
			return this.hasMore();
		}
		hasMore() {
			return this.position < this.getCount();
		}
		attach(control: MenuWindow, message: AdditionalMessage) {
			if (control === undefined || control === null) {
				MCSystem.throwException("Modding Tools: Aborted attach AdditionalMessageFactory session to null or undefined");
			}
			if (message === undefined || message === null) {
				return false;
			}
			if (message instanceof AdditionalClickableMessage) {
				control.addMessage(message.getImage(), message.getMessage(), message.getAction());
			} else {
				control.addMessage(message.getImage(), message.getMessage());
			}
			return true;
		}
		complete() {
			this.position = 0;
			delete this.randomized;
			delete this.indexed;
		}
	}
}
