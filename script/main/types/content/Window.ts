interface IFocusableWindow<ABC = IFocusableWindow<any>> {
	touchable?: CallableJsonProperty1<ABC, boolean>;
	focusable?: CallableJsonProperty1<ABC, boolean>;
	gravity?: CallableJsonProperty1<ABC, number>;
	width?: CallableJsonProperty1<ABC, number>;
	height?: CallableJsonProperty1<ABC, number>;
	x?: CallableJsonProperty1<ABC, number>;
	y?: CallableJsonProperty1<ABC, number>;
	content?: CallableJsonProperty1<ABC, Nullable<android.view.ViewGroup>>;
	fragment?: CallableJsonProperty1<ABC, Nullable<IBaseFragment>>;
	onAttach?: Nullable<(self: ABC) => void>;
	onUpdate?: Nullable<(self: ABC, ...args: any) => void>;
	onDismiss?: Nullable<(self: ABC) => void>;
	enterTransition?: CallableJsonProperty1<ABC, Nullable<android.transition.Transition>>;
	exitTransition?: CallableJsonProperty1<ABC, Nullable<android.transition.Transition>>;
}

type IFocusableWindowWithType = IFocusableWindow & {
	type: "window" | "focusable" | "transition"
};

/**
 * @deprecated EXTREMELLY UNSTABLE
 */
interface IUniqueWindow<ABC = IUniqueWindow<any>> extends IFocusableWindow<ABC> {
	id?: CallableJsonProperty1<ABC, Nullable<string>>;
	updatable?: CallableJsonProperty1<ABC, boolean>;
}

type IUniqueWindowWithType = IUniqueWindow & {
	type: "unique"
};

interface IFocusablePopup<ABC = IFocusablePopup<any>> extends IFocusableWindow<ABC> {
	id?: CallableJsonProperty1<ABC, Nullable<string>>;
	mayDismissed?: CallableJsonProperty1<ABC, boolean>;
	elements?: CallableJsonProperty1<ABC, CallableJsonProperty2<ABC, object, IBaseFragment> | CallableJsonProperty2<ABC, object, IBaseFragment>[]>;
}

type IFocusablePopupWithType = IFocusablePopup & {
	type: "popup"
};

interface IExpandablePopup<ABC = IExpandablePopup<any>> extends IFocusablePopup<ABC> {
	title?: CallableJsonProperty1<ABC, Nullable<string>>;
	mayCollapsed?: CallableJsonProperty1<ABC, boolean>;
	mayDragged?: CallableJsonProperty1<ABC, boolean>;
	expanded?: CallableJsonProperty1<ABC, boolean>;
}

type IExpandablePopupWithType = IExpandablePopup & {
	type: "expandable"
};

type IWindowJson = IFocusableWindowWithType | IUniqueWindowWithType | IFocusablePopupWithType | IExpandablePopupWithType;
