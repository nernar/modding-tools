interface IControlWindow<CT = IControlWindow<any>> extends IUniqueWindow<CT> {
	orientation?: CallableJsonProperty2<CT, ControlWindow, number>;
	logotypeProgress?: CallableJsonProperty2<CT, ControlWindow, IDrawableJson>;
	logotypeOutside?: CallableJsonProperty2<CT, ControlWindow, IDrawableJson>;
	logotype?: CallableJsonProperty2<CT, ControlWindow, IDrawableJson>;
	buttonBackground?: CallableJsonProperty2<CT, ControlWindow, IDrawableJson>;
	logotypeBackground?: CallableJsonProperty2<CT, ControlWindow, IDrawableJson>;
	buttonClick?: (self: CT) => void;
	buttonHold?: (self: CT) => boolean;
	collapsedClick?: (self: CT) => void;
	collapsedHold?: (self: CT) => boolean;
	hideable?: CallableJsonProperty2<CT, ControlWindow, boolean>;
}

interface IMenuWindow<CT = IMenuWindow<any>> extends IUniqueWindow<CT> {
	background?: CallableJsonProperty2<CT, MenuWindow, IDrawableJson>;
	click?: (self: CT) => void;
	closeable?: CallableJsonProperty2<CT, MenuWindow, boolean>;
	elements?: CallableJsonProperty2<CT, MenuWindow, CallableJsonProperty2<CT, object, MenuWindow.IElements> | CallableJsonProperty2<CT, object, MenuWindow.IElements>[]>;
}

namespace MenuWindow {
	export type IElements = IHeader | IProjectHeader | ICategory | IMessage;

	export interface IHeader {
		type: "header";
		cover?: CallableJsonProperty1<IHeader, IDrawableJson>;
		logotype?: CallableJsonProperty1<IHeader, IDrawableJson>;
		maxScroll?: CallableJsonProperty1<IHeader, number>;
		slideOffset?: CallableJsonProperty1<IHeader, number>;
	}

	export interface IProjectHeader {
		type: "projectHeader";
		background?: CallableJsonProperty1<IProjectHeader, IDrawableJson>;
		maxScroll?: CallableJsonProperty1<IProjectHeader, number>;
		slideOffset?: CallableJsonProperty1<IProjectHeader, number>;
		categories?: CallableJsonProperty1<IProjectHeader, CallableJsonProperty2<IProjectHeader, object, ProjectHeader.ICategory> | CallableJsonProperty2<IProjectHeader, object, ProjectHeader.ICategory>[]>;
	}

	export namespace ProjectHeader {
		export interface ICategory {
			title?: CallableJsonProperty1<ICategory, string>;
			clickItem?: (self: ICategory, item: Category.IItem, index: number) => void;
			holdItem?: (self: ICategory, item: Category.IItem, index: number) => boolean;
			items?: CallableJsonProperty1<ICategory, CallableJsonProperty2<ICategory, object, Category.IItem> | CallableJsonProperty2<ICategory, object, Category.IItem>[]>;
		}
	
		export namespace Category {
			export interface IItem {
				background?: CallableJsonProperty1<IItem, IDrawableJson>;
				icon?: CallableJsonProperty1<IItem, IDrawableJson>;
				title?: CallableJsonProperty1<IItem, string>;
				description?: CallableJsonProperty1<IItem, string>;
				click?: (self: IItem, index: number) => void;
				hold?: (self: IItem, index: number) => void | boolean;
			}
		}
	}

	export interface ICategory {
		type: "category";
		title?: CallableJsonProperty1<ICategory, string>;
		clickItem?: (self: ICategory, item: Category.IItem, index: number) => void;
		holdItem?: (self: ICategory, item: Category.IItem, index: number) => boolean;
		items?: CallableJsonProperty1<ICategory, CallableJsonProperty2<ICategory, object, Category.IItem> | CallableJsonProperty2<ICategory, object, Category.IItem>[]>;
	}

	export namespace Category {
		export interface IItem {
			background?: CallableJsonProperty1<IItem, IDrawableJson>;
			icon?: CallableJsonProperty1<IItem, IDrawableJson>;
			title?: CallableJsonProperty1<IItem, string>;
			click?: (self: IItem, index: number) => void;
			hold?: (self: IItem, index: number) => void | boolean;
			badgeOverlay?: CallableJsonProperty1<IItem, IDrawableJson>;
			badgeText?: CallableJsonProperty1<IItem, string>;
		}
	}

	export interface IMessage {
		type: "message";
		background?: CallableJsonProperty1<IMessage, IDrawableJson>;
		icon?: CallableJsonProperty1<IMessage, IDrawableJson>;
		message?: CallableJsonProperty1<IMessage, string>;
		click?: (self: IMessage) => void;
	}
}
