namespace SidebarFragment {
	export interface IRail<ABC = IRail<any>> extends ILayoutFragment<ABC>, ISelectableLayoutFragment<ABC> {
		containerBackground?: CallableJsonProperty1<ABC, Nullable<IDrawableJson>>;
		fetchItem?: Nullable<(self: ABC, item: SidebarFragment.Rail.IItem, index: number) => Nullable<string>>;
		expanded?: CallableJsonProperty1<ABC, boolean>;
	}

	export namespace Rail {
		export interface IItem<ABC = IItem<any>> extends ILayoutFragment<ABC>, ISelectableFragment<ABC> {
			icon?: CallableJsonProperty1<IItem, Nullable<IDrawableJson>>;
			fetch?: Nullable<(self: ABC) => Nullable<string>>;
			expanded?: CallableJsonProperty1<ABC, boolean>;
		}
	}
}

interface IAngleCircleFragment<ABC = IAngleCircleFragment<any>> extends ITextFragment {
	value?: CallableJsonProperty1<ABC, number>;
	change?: Nullable<(self: ABC, radians: number, degress: number) => void>;
	reset?: Nullable<(self: ABC, radians: number, degress: number) => number>;
}

interface IAxisGroupFragment<ABC = IAxisGroupFragment<any>> extends ILayoutFragment<ABC> {
	text?: CallableJsonProperty1<ABC, Nullable<string>>;
	append?: CallableJsonProperty1<ABC, Nullable<string>>;
	changeItem?: Nullable<(self: ABC, item: IBaseFragment, index: number, value: number, difference: number) => void>;
	resetItem?: Nullable<(self: ABC, item: IBaseFragment, index: number, value: number) => Nullable<number>>;
}

interface IPropertyInputFragment<ABC = IPropertyInputFragment<any>> extends ITextFragment {
	hint?: CallableJsonProperty1<ABC, string>;
}

interface ISliderFragment<ABC = ISliderFragment<any>> extends ITextFragment {
	modifiers?: CallableJsonProperty1<ABC, number[]>;
	modifier?: CallableJsonProperty1<ABC, number>;
	value?: CallableJsonProperty1<ABC, number>;
	suffix?: CallableJsonProperty1<ABC, Nullable<string>>;
	change?: Nullable<(self: ABC, value: number, difference: number) => void>;
	reset?: Nullable<(self: ABC, value: number) => Nullable<number>>;
}
