/**
 * @requires `isAndroid()`
 */
class EditorFragment extends Fragment {
	constructor() {
		super();
		if (isAndroid()) {
			if (isHorizon && android.os.Build.VERSION.SDK_INT >= 21) {
				try {
					this.resetContainer();
					return;
				} catch (e) {
					Logger.Log("Modding Tools#EditorFragment: " + e, "WARNING");
				}
			}
			this.resetLegacyContainer();
		}
	}
	resetContainer() {
		let container = new android.widget.FrameLayout(getContext());
		this.setContainerView(container);

		let text = new Packages.io.github.rosemoe.sora.widget.CodeEditor(getContext());
		text.setTypefaceText(typefaceJetBrains);
		/*
			processor.setWordwrap(true);
			processor.setUndoEnabled(true);
			processor.setPinLineNumber(true);
			processor.setTabWidth(4);
			processor.setLineNumberEnabled(false);
			processor.setBlockLineEnabled(true);
			processor.setBlockLineWidth(0.1f);
			processor.setLigatureEnabled(false);
			processor.setScalable(false);
			processor.setScaleTextSizes(10f, 20f);
			processor.setNonPrintablePaintingFlags(0);
			processor.setFirstLineNumberAlwaysVisible(false);
			processor.setCursorBlinkPeriod(800);
			processor.setHighlightCurrentLine(false);
			processor.setHighlightCurrentBlock(false);
			processor.setEditable(false);
			processor.setEdgeEffectColor(-1);
		*/
		let drawable = new android.graphics.drawable.ColorDrawable($.Color.YELLOW);
		text.setSelectionHandleStyle(new Packages.io.nernar.editor.style.HandleStyleSideDrop(getContext(), drawable));
		text.setColorScheme(new Packages.io.github.rosemoe.sora.widget.schemes.SchemeDarcula());
		text.setAutoCompletionItemAdapter(EditorFragment.COMPLETION_ADAPTER);
		text.getComponent(Packages.io.github.rosemoe.sora.widget.component.EditorAutoCompletion).setParentView(getContext().getWindow().getDecorView());

		let layout = new android.widget.LinearLayout(getContext());
		new BitmapDrawable("popup").attachAsBackground(layout);
		layout.setGravity($.Gravity.CENTER);
		let textActionButtonParams = new android.widget.LinearLayout.
			LayoutParams(toComplexUnitDip(40), toComplexUnitDip(40));
		textActionButtonParams.leftMargin = textActionButtonParams.rightMargin =
			textActionButtonParams.topMargin = textActionButtonParams.bottomMargin = toComplexUnitDip(8);
		let copyBtn = new android.widget.Button(getContext());
		new BitmapDrawable("explorerSelectionApprove").attachAsBackground(copyBtn);
		let textAction: any;
		copyBtn.setOnClickListener((() => {
			text.copyText();
			text.setSelection(text.getCursor().getRightLine(), text.getCursor().getRightColumn());
			textAction.dismiss();
		}) as any);
		layout.addView(copyBtn, textActionButtonParams);
		let cutBtn = new android.widget.Button(getContext());
		new BitmapDrawable("explorerSelectionWhole").attachAsBackground(cutBtn);
		cutBtn.setOnClickListener((() => {
			text.copyText();
			if (text.getCursor().isSelected()) {
				text.deleteText();
			}
			textAction.dismiss();
		}) as any);
		layout.addView(cutBtn, textActionButtonParams);
		let pasteBtn = new android.widget.Button(getContext());
		new BitmapDrawable("explorerSelectionSame").attachAsBackground(pasteBtn);
		pasteBtn.setOnClickListener((() => {
			text.pasteText();
			text.setSelection(text.getCursor().getRightLine(), text.getCursor().getRightColumn());
			textAction.dismiss();
		}) as any);
		layout.addView(pasteBtn, textActionButtonParams);
		let selectAllBtn = new android.widget.Button(getContext());
		new BitmapDrawable("explorerSelectionInvert").attachAsBackground(selectAllBtn);
		selectAllBtn.setOnClickListener((() => {
			text.selectAll();
			textAction.show();
		}) as any);
		layout.addView(selectAllBtn, textActionButtonParams);

		textAction = new Packages.io.nernar.editor.component.EditorTextActionWindow(text, textAction, pasteBtn, copyBtn, cutBtn);
		textAction.setParentView(getContext().getWindow().getDecorView());
		text.replaceComponent(Packages.io.github.rosemoe.sora.widget.component.EditorTextActionWindow, textAction);
		let magnifierRoot = new android.widget.FrameLayout(getContext());
		magnifierRoot.setElevation(toComplexUnitDip(4));
		let magnifierIcon = new android.widget.ImageView(getContext());
		magnifierRoot.addView(magnifierIcon, new android.widget.FrameLayout.
			LayoutParams($.ViewGroup.LayoutParams.MATCH_PARENT, $.ViewGroup.LayoutParams.MATCH_PARENT));

		let magnifier = new Packages.io.nernar.editor.component.Magnifier(text, magnifierRoot, magnifierIcon);
		magnifier.setParentView(getContext().getWindow().getDecorView());
		text.replaceComponent(Packages.io.github.rosemoe.sora.widget.component.Magnifier, magnifier);
		text.setTag("editor");
		container.addView(text);
	}
	resetLegacyContainer() {
		let container = new android.widget.FrameLayout(getContext());
		this.setContainerView(container);

		let text = new android.widget.EditText(getContext());
		text.setHint(translate("Hi, I'm evaluate stroke"));
		text.setInputType(android.text.InputType.TYPE_CLASS_TEXT |
			android.text.InputType.TYPE_TEXT_FLAG_MULTI_LINE |
			android.text.InputType.TYPE_TEXT_FLAG_NO_SUGGESTIONS);
		text.setImeOptions(android.view.inputmethod.EditorInfo.IME_FLAG_NO_FULLSCREEN |
			android.view.inputmethod.EditorInfo.IME_FLAG_NO_ENTER_ACTION);
		text.setTextColor(android.graphics.Color.WHITE);
		text.setTextSize(toComplexUnitDp(8));
		text.setHorizontalScrollBarEnabled(true);
		text.setHorizontallyScrolling(true);
		text.setSingleLine(false);
		text.setMinLines(3);
		text.setTypeface(typefaceJetBrains);
		text.setTag("editor");
		container.addView(text);
	}
	getEditorView() {
		return this.findViewByTag("editor") as android.widget.TextView;
	}
	setText(text: string) {
		let view = this.getEditorView();
		if (view == null) return;
		view.setText("" + text);
	}
	getText() {
		let view = this.getEditorView();
		if (view == null) return null;
		return "" + view.getText();
	}
	isLegacyEditor() {
		return isHorizon;
	}
}

namespace EditorFragment {
	export interface ICompletionItem {
		label: android.widget.TextView;
		description: android.widget.TextView;
		icon: android.widget.ImageView;
		drawable: BitmapDrawable;
	}
	export let COMPLETION_ADAPTER: any;
}

if (isHorizon && isAndroid()) {
	try {
		EditorFragment.COMPLETION_ADAPTER = new JavaAdapter(Packages.io.github.rosemoe.sora.widget.component.EditorCompletionAdapter, {
			getItemHeight() {
				return toComplexUnitDip(45);
			},
			getView(position: number, convertView: android.view.View, parent: android.view.ViewGroup, isCurrentCursorPosition: boolean) {
				let holder: EditorFragment.ICompletionItem;
				try {
					if (convertView == null) {
						convertView = EditorFragment.COMPLETION_ADAPTER.newItem();
						holder = {} as EditorFragment.ICompletionItem;
						holder.label = convertView.findViewWithTag("itemLabel") as android.widget.TextView;
						holder.description = convertView.findViewWithTag("itemDescription") as android.widget.TextView;
						holder.icon = convertView.findViewWithTag("itemIcon") as android.widget.ImageView;
						holder.drawable = new BitmapDrawable();
						holder.drawable.setCorruptedThumbnail("explorerFileCorrupted");
						holder.drawable.attachAsImage(holder.icon);
						convertView.setTag(holder);
					} else {
						holder = convertView.getTag();
					}
				} catch (e) {
					log("Modding Tools#EditorFragment.COMPLETION_ADAPTER.getItem: " + e);
					return convertView;
				}
				let completion = this.getItem(position);
				if (holder != null) {
					holder.label.setText(completion.label);
					holder.description.setText(completion.desc);
					if (completion.icon != null) {
						holder.icon.setImageDrawable(completion.icon);
					} else {
						holder.drawable.attachAsImage(holder.icon);
					}
				}
				if (isCurrentCursorPosition) {
					new BitmapDrawable("popupSelectionSelected").attachAsBackground(convertView);
				} else {
					convertView.setBackgroundDrawable(null);
				}
			}
		});

		EditorFragment.COMPLETION_ADAPTER.newItem = () => {
			let layout = new android.widget.LinearLayout(getContext());
			layout.setGravity($.Gravity.CENTER_VERTICAL);
			layout.setPadding(0, toComplexUnitDip(2), 0, toComplexUnitDip(2));

			let icon = new android.widget.ImageView(getContext());
			icon.setTag("itemIcon");
			let params = new android.widget.LinearLayout.LayoutParams
				(toComplexUnitDip(24), toComplexUnitDip(24));
			params.leftMargin = params.rightMargin = toComplexUnitDip(4);
			layout.addView(icon, params);

			let descriptor = new android.widget.LinearLayout(getContext());
			descriptor.setOrientation($.LinearLayout.VERTICAL);
			descriptor.setGravity($.Gravity.CENTER_VERTICAL);
			descriptor.setPadding(toComplexUnitDip(8), 0, toComplexUnitDip(8), 0);
			layout.addView(descriptor);

			let label = new android.widget.TextView(getContext());
			label.setTextSize(toComplexUnitDp(12));
			label.setTag("itemLabel");
			descriptor.addView(label);

			let description = new android.widget.TextView(getContext());
			description.setTextSize(toComplexUnitDp(9));
			description.setTag("itemDescription");
			params = new android.widget.LinearLayout.LayoutParams
				($.ViewGroup.LayoutParams.WRAP_CONTENT, $.ViewGroup.LayoutParams.WRAP_CONTENT);
			params.topMargin = toComplexUnitDip(4);
			descriptor.addView(description, params);
		};
	} catch (e) {
		Logger.Log("Modding Tools#EditorFragment.COMPLETION_ADAPTER: " + e, "ERROR");
	}
}
