interface IFilterListHolder {
	text?: android.widget.TextView
}

/**
 * @requires `isAndroid()`
 */
class FilterListHolderAdapter<LH extends IFilterListHolder = IFilterListHolder, IT extends any[] = any[]> extends android.widget.BaseAdapter implements android.widget.Adapter, android.widget.Filterable {
	protected array?: IT[];
	protected filteredArray?: IT[];
	protected constraint?: java.lang.CharSequence;
	// @ts-expect-error
	constructor(proto?: Scriptable) {
		// @ts-expect-error
		return new JavaAdapter(android.widget.BaseAdapter, android.widget.Adapter, android.widget.Filterable, merge(this, proto));
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
				convertView = this.bindView(position, parent);
				holder = this.bindHolder(convertView);
				convertView.setTag(holder);
			} else {
				holder = convertView.getTag();
			}
			this.describe(holder, position, convertView, parent);
			convertView.setTag(holder);
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
	bindView(position: number, parent: android.view.ViewGroup) {
		let view = new android.widget.TextView(getContext());
		view.setPadding(toComplexUnitDip(12), toComplexUnitDip(6),
			toComplexUnitDip(12), toComplexUnitDip(6));
		typeface && view.setTypeface(typeface);
		view.setTextColor($.Color.WHITE);
		view.setTextSize(toComplexUnitDp(9));
		return view;
	}
	bindHolder(view: android.view.View) {
		return {
			text: view
		} as LH;
	}
	describe(holder: LH, position: number, view: android.view.View, parent: android.view.ViewGroup) {
		let content = this.getItem(position);
		holder.text.setText("" + content);
	}
	getItems() {
		if (this.filteredArray) {
			return this.filteredArray;
		}
		return this.array || null;
	}
	getAllItems() {
		return this.array || null;
	}
	getItemCount() {
		let items = this.getItems();
		return (items == null ? 0 : items.length) || 0;
	}
	getAllItemCount() {
		let items = this.getAllItems();
		return (items == null ? 0 : items.length) || 0;
	}
	setItems(array: IT[]) {
		this.array = array;
		this.notifyDataSetChanged();
	}
	getFilter() {
		let self = this;
		// @ts-expect-error
		return new android.widget.Filter({
			publishResults(constraint: java.lang.CharSequence, results: android.widget.Filter.FilterResults[]) {
				self.filteredArray = results.values as any;
				self.constraint = constraint;
				self.notifyDataSetChanged();
			},
			performFiltering(constraint: java.lang.CharSequence) {
				let results = new android.widget.Filter.FilterResults();
				if (constraint == null || constraint.length() == 0) {
					results.count = self.getAllItemCount();
					results.values = self.getAllItems();
				} else {
					let array = [];
					let items = self.getAllItems();
					if (items) {
						let filter = "" + constraint.toString();
						for (let i = 0; i < items.length; i++) {
							let element = "" + items[i];
							if (element.indexOf(filter) != -1) {
								array.push(items[i]);
							}
						}
					}
					results.count = array.length;
					results.values = array;
				}
				return results;
			}
		});
	}
}
