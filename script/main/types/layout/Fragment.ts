namespace SidebarFragment {
	export interface IRail<ABC = IRail<any>> extends ILayoutFragment<ABC>, ISelectableLayoutFragment<ABC> {
		containerBackground?: CallableJsonProperty1<ABC, IDrawableJson>;
		fetchItem?: (self: ABC, item: SidebarFragment.Rail.IItem, index: number) => string;
		expanded?: CallableJsonProperty1<ABC, boolean>;
	}

	export namespace Rail {
		export interface IItem<ABC = IItem<any>> extends ILayoutFragment<ABC>, ISelectableFragment<ABC> {
			icon?: CallableJsonProperty1<IItem, IDrawableJson>;
			fetch?: (self: ABC) => string;
			expanded?: CallableJsonProperty1<ABC, boolean>;
		}
	}
}

interface IAngleCircleFragment<ABC = IAngleCircleFragment<any>> extends ITextFragmentMixin<ABC> {
	value?: CallableJsonProperty1<ABC, number>;
	change?: (self: ABC, radians: number, degress: number) => void;
	reset?: (self: ABC, radians: number, degress: number) => number;
}

interface IAxisGroupFragment<ABC = IAxisGroupFragment<any>> extends ILayoutFragment<ABC> {
	text?: CallableJsonProperty1<ABC, string>;
	append?: CallableJsonProperty1<ABC, string>;
	changeItem?: (self: ABC, item: IBaseFragment, index: number, value: number, difference: number) => void;
	resetItem?: (self: ABC, item: IBaseFragment, index: number, value: number) => void | number;
}

interface IPropertyInputFragment<ABC = IPropertyInputFragment<any>> extends ITextFragmentMixin<ABC> {
	hint?: CallableJsonProperty1<ABC, string>;
}

interface ISliderFragment<ABC = ISliderFragment<any>> extends ITextFragmentMixin<ABC> {
	modifiers?: CallableJsonProperty1<ABC, number[]>;
	modifier?: CallableJsonProperty1<ABC, number>;
	value?: CallableJsonProperty1<ABC, number>;
	suffix?: CallableJsonProperty1<ABC, string>;
	change?: (self: ABC, value: number, difference: number) => void;
	reset?: (self: ABC, value: number) => void | number | boolean;
}

interface IButtonFragment<ABC = IButtonFragment<any>> extends ITextFragmentMixin<ABC>, ISelectableFragment<ABC> {
}

interface ISegmentGroupFragment<ABC = ISegmentGroupFragment<any>> extends ILayoutFragment<ABC>, ISelectableLayoutFragment<ABC> {
}
