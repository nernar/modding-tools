/**
 * @requires `isAndroid()`
 */
class ListHolderAdapter<LH extends IFilterListHolder = IFilterListHolder, IT extends any[] = any[]> extends android.widget.BaseAdapter implements android.widget.Adapter {
	protected array?: IT[];
	protected holderFragmentAdapter?: ListFragment;
	// @ts-expect-error
	constructor(proto?: Scriptable) {
		// @ts-expect-error
		return new JavaAdapter(android.widget.BaseAdapter, android.widget.Adapter, merge(this, proto));
	}
	override getCount() {
		// No Context associated with current Thread
		org.mozilla.javascript.Context.enter();
		try {
			return this.getItemCount() || 0;
		} catch (e) {
			reportError(e);
		}
		return 0;
	}
	override getItemId(position: number) {
		return position;
	}
	override getItem(position: number) {
		try {
			let items = this.getItems();
			if (items == null) return null;
			return items.length > position ? items[position] : null;
		} catch (e) {
			reportError(e);
		}
		return null;
	}
	override getView(position: number, convertView: android.view.View, parent: android.view.ViewGroup) {
		try {
			let holder: LH;
			if (convertView == null) {
				if (this.holderFragmentAdapter && this.holderFragmentAdapter.bindItemFragment) {
					let fragment = this.holderFragmentAdapter.bindItemFragment(this, position, parent);
					fragment && (convertView = fragment.getContainer());
				}
				if (holder == null) {
					convertView = this.bindView(position, parent);
					holder = this.bindHolder(convertView, position);
				}
				convertView.setTag(holder);
			} else {
				holder = convertView.getTag();
			}
			if (this.holderFragmentAdapter && this.holderFragmentAdapter.describeItemFragment) {
				this.holderFragmentAdapter.describeItemFragment(this, holder, this.getItem(position), position, parent);
			} else {
				this.describe(holder, position, convertView, parent);
			}
			return convertView;
		} catch (e) {
			reportError(e);
		}
		let view = new android.view.View(getContext());
		view.setBackgroundColor($.Color.RED);
		view.setLayoutParams(new android.view.ViewGroup.LayoutParams(
			android.view.ViewGroup.LayoutParams.MATCH_PARENT, toComplexUnitDip(32)
		));
		return view;
	}
	setFragmentAdapter(fragment: ListFragment) {
		if (fragment != null) {
			this.holderFragmentAdapter = fragment;
		} else {
			delete this.holderFragmentAdapter;
		}
		return this;
	}
	bindView(position: number, parent: android.view.ViewGroup) {
		let view = new android.widget.TextView(getContext());
		view.setPadding(toComplexUnitDip(12), toComplexUnitDip(6),
			toComplexUnitDip(12), toComplexUnitDip(6));
		typeface && view.setTypeface(typeface);
		view.setTextColor($.Color.WHITE);
		view.setTextSize(toComplexUnitDp(9));
		return view;
	}
	bindHolder(view: android.view.View, position: number) {
		return {
			text: view
		} as LH;
	}
	describe(holder: LH, position: number, view: android.view.View, parent: android.view.ViewGroup) {
		let content = this.getItem(position);
		holder.text.setText("" + content);
	}
	getItems() {
		return this.array || null;
	}
	getItemCount() {
		let items = this.getItems();
		return (items == null ? 0 : items.length) || 0;
	}
	setItems(array: IT) {
		this.array = array;
		this.notifyDataSetChanged();
	}
}
