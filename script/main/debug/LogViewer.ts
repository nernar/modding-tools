/**
 * @requires `isAndroid()`
 */
namespace LogViewer {
	export function span(text: string, color: number) {
		let spannable = new android.text.SpannableString(text);
		spannable.setSpan(new android.text.style.ForegroundColorSpan(color), 0, text.length, android.text.Spannable.SPAN_EXCLUSIVE_EXCLUSIVE);
		return spannable;
	}
	export function append(text: android.widget.TextView, scroll: android.widget.ScrollView, horizontal: android.widget.HorizontalScrollView, prefix: string, message: string, color?: number) {
		text.post(() => {
			if (color !== undefined && color != 0) {
				text.append(span("\n" + (prefix != "undefined" ? prefix + "/" + message : message), color) as any);
			} else {
				text.append("\n" + (prefix != "undefined" ? prefix + "/" + message : message));
			}
			scroll.scrollTo(horizontal.getScrollX(), text.getMeasuredHeight());
		});
	}
	export function handle(text: android.widget.TextView, scroll: android.widget.ScrollView, horizontal: android.widget.HorizontalScrollView, message: any) {
		if (message == null) {
			return;
		}
		if (message.type.level == 3) {
			return append(text, scroll, horizontal, message.strPrefix, message.message, ColorDrawable.parseColor("RED"));
		}
		if (message.strPrefix == "WARNING") {
			return append(text, scroll, horizontal, message.strPrefix, message.message, ColorDrawable.parseColor("YELLOW"));
		}
		if (message.type.level == 2 || message.strPrefix == "INFO") {
			return append(text, scroll, horizontal, message.strPrefix, message.message, ColorDrawable.parseColor("GREEN"));
		} else if (message.type.level == 1 || message.strPrefix == "DEBUG") {
			return append(text, scroll, horizontal, message.strPrefix, message.message, ColorDrawable.parseColor("GRAY"));
		}
		if (message.strPrefix == "MOD") {
			return append(text, scroll, horizontal, message.strPrefix, message.message);
		}
		return append(text, scroll, horizontal, message.strPrefix, message.message, ColorDrawable.parseColor("LTGRAY"));
	}
	export function show() {
		let popup = new ExpandablePopup("log");
		popup.setTitle(translate("Current Log"));
		popup.getFragment().getContainerScroll().setLayoutParams(new android.widget.LinearLayout.LayoutParams
			(getDisplayPercentWidth(60), getDisplayPercentHeight(40))
		);
		let horizontal = new android.widget.HorizontalScrollView(getContext());
		let text = new android.widget.TextView(getContext());
		text.setPadding(toComplexUnitDip(6), 0, toComplexUnitDip(6), 0);
		text.setTextSize(toComplexUnitDp(5));
		text.setTextColor($.Color.WHITE);
		text.setTypeface(android.graphics.Typeface.MONOSPACE);
		text.setText(NAME + " " + REVISION);
		popup.getFragment().getContainerLayout().addView(horizontal);
		horizontal.addView(text);
		let filter = InnerCorePackages.api.log.ICLog.getLogFilter();
		// @ts-expect-error
		let messagesField = getClass(filter).__javaObject__.getDeclaredField("logMessages");
		messagesField.setAccessible(true);
		let messages: java.util.ArrayList<any> = messagesField.get(filter);
		popup.show();
		let count = messages.size();
		handleThread(() => {
			while (popup.isOpened()) {
				if (popup.isExpanded()) {
					let next = messages.size();
					if (next > count) {
						for (let i = count; i < next; i++) {
							handle(text, popup.getFragment().getContainerScroll(), horizontal, messages.get(i));
						}
						count = next;
					}
				}
				java.lang.Thread.yield();
			}
		});
	}
}
