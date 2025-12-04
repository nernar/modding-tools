const CONSOLE_TOOL = (() => {
	return new Tool({
		controlDescriptor: {
			logotype: "menuBack",
			collapsedClick(tool, control) {
				tool.deattach();
			}
		},
		deattach() {
			let snack = UniqueHelper.getWindow(HintAlert.prototype.TYPE);
			if (snack !== null) snack.dismiss();
			Popups.closeIfOpened("evaluate");
			attachProjectTool(null, () => this.deattach());
		},
		attach() {
			Tool.prototype.attach.apply(this, arguments);
			this.setupConsole();
			this.addEditable();
		},
		setupConsole() {
			let snack = UniqueHelper.getWindow(HintAlert.prototype.TYPE) as HintAlert;
			if (snack !== null) snack.dismiss();
			snack = new HintAlert();
			snack.setConsoleMode(true);
			snack.setMaximumStacked(8);
			snack.pin();
			snack.attach();
		},
		addEditable() {
			let popup = new ExpandablePopup("evaluate");
			popup.setTitle(translate("Evaluate"));
			let layout = popup.getFragment();
			let input = layout.addPropertyInput(translate("Hi, I'm evaluate stroke"), "29 / 5");
			layout.addSolidButton(translate("Eval"), () => {
				let action = input.getText().trim();
				if (action.length > 0) {
					showHint(" > " + action);
					let result = compileData(action);
					if (result.lineNumber !== undefined) {
						showHint(result.message, ColorDrawable.parseColor("RED"));
					} else {
						showHint("" + result, ColorDrawable.parseColor("LTGRAY"));
					}
				}
			});
			popup.setIsMayDismissed(false);
			popup.show();
		}
	});
})();

const attachConsoleTool = (post?: (tool: Tool) => void) => {
	CONSOLE_TOOL.deattach();
	if (!CONSOLE_TOOL.isAttached()) {
		CONSOLE_TOOL.attach();
	}
	CONSOLE_TOOL.queue();
	handle(() => {
		CONSOLE_TOOL.collapse();
		let accepted = true;
		try {
			CONSOLE_TOOL.describe();
			post && post(CONSOLE_TOOL);
			accepted = false;
		} catch (e) {
			reportError(e);
		}
		if (accepted) {
			attachProjectTool(null, () => CONSOLE_TOOL.deattach());
		}
	});
};
