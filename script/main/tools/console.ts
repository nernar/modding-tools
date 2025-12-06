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

const DEBUG_TOOL = new SidebarTool({
	sidebarDescriptor: {
		fragments: [{
			icon: "support",
			fragments: [{
				fragments: [{
					type: "categoryTitle",
					text: "Поддержите нашу работу!"
				}, {
					type: "button",
					marks: "solid",
					selectionType: SelectableFragment.SELECTION_DENIED,
					text: "Купить кофе ☕"
				}, {
					type: "button",
					marks: "solid",
					selectionType: SelectableFragment.SELECTION_DENIED,
					text: "Купить чай 🍵"
				}, {
					type: "button",
					marks: "solid",
					unselectedBackground: "popupSelectionSelected",
					selectedBackground: "popupSelectionLocked",
					text: "Присоединиться",
					click(tool, fragment) {
						handle(function() {
							fragment.unselect();
							showHint("Увы, такого репозитория не существует или он запривачен.");
						}, 1000);
					}
				}, {
					type: "categoryTitle",
					text: "Сделайте здравый выбор:"
				}, {
					type: "segmentGroup",
					selectionMode: SelectableLayoutFragment.MODE_SINGLE,
					fragments: [{
						marks: "solid",
						text: "Ничего",
						background: "popupSelectionQueued"
					}, {
						marks: "solid",
						text: "Донат"
					}, {
						type: "sidebarRailItem",
						selectionType: SelectableFragment.SELECTION_EXPLICIT,
						expanded: true,
						icon: "create"
					}]
				}]
			}, {
				fragments: {
					type: "explanatory",
					text: Files.read(__dir__ + ".todo/long-read.txt"),
					click(tool, fragment) {
						let text = fragment.getText();
						let character = text[random(text.length)];
						fragment.setText("" + new java.lang.String(text).replace(character, ""));
						showHint("Символ " + JSON.stringify(character) + " магическим образом исчез...");
					}
				}
			}]
		}, {
			icon: "supportInstantRunner",
			fragments: [{
				type: "sidebarRail",
				selectionMode: SelectableLayoutFragment.MODE_MULTIPLE,
				fragments: [{
					icon: "menuNetwork"
				}, {
					icon: "menuNetworkKey"
				}, {
					icon: "menuNetworkSupport"
				}, {
					icon: "menuNetworkUser"
				}, {
					icon: "menuNetworkConnect"
				}],
				selectItem(tool, fragment, index) {
					this.__selected || (this.__selected = []);
					if (fragment.getParent().getSelectionMode() != SelectableLayoutFragment.MODE_NONE && this.__selected.length == fragment.getParent().getFragmentCount()) {
						this.__selected = [];
					}
					this.__selected.push(index);
					if (this.__selected.length == fragment.getParent().getFragmentCount()) {
						fragment.getParent().setSelectionMode(SelectableLayoutFragment.MODE_NONE);
						showHint("К сожалению, ты зажрался, больше у тебя нет возможности выбора...");
					}
				},
				unselectItem(tool, fragment, index) {
					this.__selected || (this.__selected = []);
					let offset = this.__selected.indexOf(index);
					this.__selected.splice(offset, 1);
				},
				expanded: true
			}, function(tool, sidebar) {
				return {
					fragments: [{
						type: "counter",
						value: 1,
						change: function(tool, fragment, value) {
							fragment.getParent().update("sync");
						},
						update: function(tool, fragment, tag) {
							if (tag == "randomize") {
								fragment.setValue(random(0, 16));
								showHint("Получен флаг случайного обновления!");
								fragment.getParent().update("sync");
							}
						}
					}, {
						type: "counter",
						value: 1,
						update: function(tool, fragment, tag) {
							if (tag == "sync") {
								fragment.setValue(fragment.getParent().getFragmentAt(0).getValue());
								showHint("Получен флаг синхронизации с другим счетчиком!");
							}
						}
					}]
				};
			}]
		}, {
			icon: "supportRunJSingame",
			fragments: {
				fragments: [{
					type: "categoryTitle",
					text: "Местоположение"
				}, {
					type: "segmentGroup",
					selectionMode: SelectableLayoutFragment.MODE_SINGLE,
					fragments: [{
						marks: ["filled", "solid"],
						text: "Мир"
					}, {
						marks: ["filled", "solid"],
						text: "Локально"
					}],
					selectItem(tool, fragment, index) {
						fragment.getParent().getParent().update(index == 0 ? "positionWorld" : "positionLocal");
					}
				}, {
					type: "axisGroup",
					text: "x",
					fragments: [{
						type: "counter",
						modifiers: [1],
						update(tool, fragment, tag) {
							if (tag && tag.indexOf("position") != -1) {
								fragment.setValue(tag == "positionWorld" ? 128 : 3.5);
							}
						}
					}]
				}, {
					type: "axisGroup",
					text: "y",
					fragments: [{
						type: "counter",
						modifiers: [1],
						update(tool, fragment, tag) {
							if (tag && tag.indexOf("position") != -1) {
								fragment.setValue(tag == "positionWorld" ? 63 : 0);
							}
						}
					}]
				}, {
					type: "axisGroup",
					text: "z",
					fragments: [{
						type: "counter",
						modifiers: [1],
						update(tool, fragment, tag) {
							if (tag && tag.indexOf("position") != -1) {
								fragment.setValue(tag == "positionWorld" ? -24 : 6);
							}
						}
					}]
				}, {
					type: "categoryTitle",
					text: "Поворот"
				}, {
					type: "segmentGroup",
					selectionMode: SelectableLayoutFragment.MODE_SINGLE,
					fragments: [{
						marks: ["filled", "solid"],
						text: "Мир"
					}, {
						marks: ["filled", "solid"],
						text: "Локально"
					}]
				}, {
					type: "axisGroup",
					text: "x",
					fragments: [{
						type: "counter",
						modifiers: [10]
					}]
				}, {
					type: "axisGroup",
					text: "y",
					fragments: [{
						type: "counter",
						modifiers: [10]
					}]
				}, {
					type: "axisGroup",
					text: "z",
					fragments: [{
						type: "counter",
						modifiers: [10]
					}]
				}, {
					type: "categoryTitle",
					text: "Длительность"
				}, {
					type: "slider",
					modifiers: [1],
					value: 30,
					suffix: " тиков",
					change(tool, fragment, value) {
						fragment.getParent().update("duration");
					}
				}, {
					type: "explanatory",
					text: "Измените значение длительности, чтобы узнать количество секунд. Это сделано для теста, а не потому что я не могу обновить интерфейс сразу.",
					update(tool, fragment, tag) {
						if (tag == "duration") {
							let duration = fragment.getParent().getFragmentAt(11).getValue();
							fragment.setText(preround(duration * 0.05) + " секунд");
						}
					}
				}, {
					type: "categoryTitle",
					text: "Интерполяция"
				}, {
					type: "segmentGroup",
					selectionMode: SelectableLayoutFragment.MODE_SINGLE,
					fragments: [{
						marks: ["filled", "solid"],
						text: "Нет"
					}, {
						marks: ["filled", "solid"],
						text: "Ускорение"
					}, {
						marks: ["filled", "solid"],
						text: "Замедление"
					}, {
						marks: ["filled", "solid"],
						text: "Волна"
					}]
				}, {
					type: "categoryTitle",
					text: "Опции"
				}, {
					type: "button",
					selectionType: SelectableFragment.SELECTION_EXPLICIT,
					text: "Скрывать аттачейблы",
					unselectedBackground: "popupSelectionLocked"
				}, {
					type: "button",
					selectionType: SelectableFragment.SELECTION_EXPLICIT,
					text: "Поворачивать игрока за камерой",
					unselectedBackground: "popupSelectionLocked"
				}, {
					type: "button",
					selectionType: SelectableFragment.SELECTION_EXPLICIT,
					text: "Отрисовка модели игрока",
					unselectedBackground: "popupSelectionLocked"
				}, {
					type: "button",
					selectionType: SelectableFragment.SELECTION_EXPLICIT,
					text: "Отрисовка объектов от первого лица",
					unselectedBackground: "popupSelectionLocked"
				}, {
					type: "categoryTitle",
					text: "Поле зрения"
				}, {
					type: "slider",
					modifiers: [10],
					value: 70
				}]
			}
		}]
	},
	onSelectItem(fragment, index) {
		if (index == 1) {
			fragment.update("randomize");
		} else {
			fragment.update();
		}
	},
	onFetchItem(fragment, index) {
		return ["Поддержка того самого гандона", "Рельса сайдбара и обновления", "Тестовый вариант интерфейса камеры"][index];
	}
});
