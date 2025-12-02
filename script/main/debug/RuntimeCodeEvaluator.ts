class RuntimeCodeEvaluator {
	protected runtimeContext?: any;
	protected lastCode?: string;
	protected lastExecutable?: any;
	protected lastLocation?: string;

	setupNewContext() {
		let context: any = this.runtimeContext = {};
		runCustomSource("runtime.js", {
			GLOBAL: context
		});
		if (isEmpty(context)) {
			MCSystem.throwException("Modding Tools: Runtime could not be resolved!");
		}
		return context;
	}
	getContextOrSetupIfNeeded() {
		if (this.runtimeContext == null) {
			this.runtimeContext = this.setupNewContext();
		}
		return this.runtimeContext;
	}
	evaluateInRuntime(executable: any, what: string) {
		let context = this.getContextOrSetupIfNeeded();
		return executable.parentContext.evaluateString(context || executable.scriptScope, what, executable.name, 0, null);
	}
	protected isChildInside(parent: android.view.ViewParent, child: android.view.ViewParent) {
		if (child == null) {
			return false;
		}
		let searching = child;
		do {
			if (parent == searching) return true;
		}
		while ((searching = searching.getParent()) != null);
		return false;
	}
	/**
	 * @requires `isAndroid()`
	 */
	showSpecifiedDialog(source?: string, where?: any, location?: string) {
		let fragment = new EditorFragment();
		let edit = fragment.getEditorView();
		source === undefined && (source = this.lastCode);
		where === undefined && (where = this.lastExecutable);
		location === undefined && (location = this.lastLocation);
		if (source !== undefined) edit.setText("" + source);

		let dialog = new android.app.AlertDialog.Builder(getContext(),
			android.R.style.Theme_DeviceDefault_DialogWhenLarge);
		dialog.setPositiveButton(translate("Evaluate"), (() => {
			let something: any;
			try {
				this.lastCode = "" + edit.getText().toString();
				this.lastExecutable = where;
				this.lastLocation = location;
				if (where !== undefined && where !== null) {
					something = where.evaluateStringInScope(this.lastCode);
				} else {
					something = eval(this.lastCode);
				}
			} catch (e) {
				reportError(e);
			}
			if (something !== undefined) {
				showHint(something);
			}
		}) as unknown as android.content.DialogInterface.OnClickListener);
		dialog.setNeutralButton(translate("Export"), (() => {
			try {
				this.lastCode = "" + edit.getText().toString();
				this.lastExecutable = where;
				this.lastLocation = location;
				this.exportEvaluate();
			} catch (e) {
				reportError(e);
			}
		}) as unknown as android.content.DialogInterface.OnClickListener);
		dialog.setNegativeButton(translate("Cancel"), null);
		dialog.setCancelable(false).setView(fragment.getContainer());
		dialog.setTitle(location === undefined ? translate(NAME) + " " + translate(VERSION) : "" + location);
		let something = dialog.create();
		something.getWindow().setLayout(getDisplayPercentWidth(70), android.view.WindowManager.LayoutParams.MATCH_PARENT);
		something.show();
		let titleView = ((...ids: number[]) => {
			for (let offset = 0; offset < ids.length; offset++) {
				if (ids[offset] == 0) {
					continue;
				}
				let view = something.findViewById(ids[offset]);
				if (view != null) {
					return view;
				}
			}
			MCSystem.throwException("Modding Tools: Not found actual android dialog title, using custom view");
		})(getContext().getResources().getIdentifier("alertTitle", "id", getContext().getPackageName()),
			getContext().getResources().getIdentifier("alertTitle", "id", "android"),
			android.R.id.title);
		titleView.setOnClickListener((() => {
			try {
				let executables = this.resolveAvailabledExecutables();
				let realExecutablePointer = [];
				let readableArray = [];
				for (let i = 0; i < executables.length; i++) {
					for (let element in executables[i]) {
						if (element == "__mod__") {
							continue;
						}
						for (let s = 0; s < executables[i][element].length; s++) {
							let source = executables[i][element][s];
							readableArray.push(executables[i].__mod__.name + ": " + source.name + " (" + element + ")");
							realExecutablePointer.push(source);
						}
					}
				}
				select(translate("Evaluate In"), readableArray, (index, value) => {
					where = realExecutablePointer[index];
					location = value;
					something.setTitle(location);
				});
			} catch (e) {
				reportError(e);
			}
		}) as unknown as android.view.View.OnClickListener);
		titleView = titleView.getParent() as android.view.ViewGroup;
		let buttonLayout = something.getButton(android.content.DialogInterface.BUTTON_NEUTRAL).getParent() as android.view.ViewGroup;
		if (!this.isChildInside(buttonLayout.getParent(), edit)) {
			buttonLayout = buttonLayout.getParent() as android.view.ViewGroup;
		}
		// TODO: Remove it with closing!
		registerKeyboardWatcher(function (onScreen) {
			titleView.setVisibility(onScreen ? android.view.View.GONE : android.view.View.VISIBLE);
			buttonLayout.setVisibility(onScreen ? android.view.View.GONE : android.view.View.VISIBLE);
		});
	}
	exportEvaluate() {
		saveFile(undefined, "js", function (file) {
			Files.write(file, this.lastCode);
		}, undefined, Dirs.EVALUATE);
	}
	loadEvaluate() {
		selectFile("js", function (file) {
			this.lastCode = Files.read(file);
			this.showSpecifiedDialog();
		}, undefined, Dirs.EVALUATE);
	}
	resolveSpecifiedTypeSources(modification: Mod.ModJsAdapter, type: string) {
		let sources = modification[type];
		if (sources && sources.size() > 0) {
			let source = [];
			for (let w = 0; w < sources.size(); w++) {
				source.push(sources.get(w));
			}
			return source;
		}
		return null;
	}
	putSpecifiedTypeSources(modification: Mod.ModJsAdapter, sources: any, type: string, name: string) {
		try {
			let specified = this.resolveSpecifiedTypeSources(modification, type);
			return specified && (sources[name] = specified) != null;
		} catch (e) {
			Logger.Log("Modding Tools: RuntimeCodeEvaluator.putSpecifiedTypeSources: " + e, "INFO");
		}
		return false;
	}
	resolveSpecifiedModificationSources(modification: Mod.ModJsAdapter) {
		let sources: any = {};
		this.putSpecifiedTypeSources(modification, sources, "compiledModSources", "modification");
		this.putSpecifiedTypeSources(modification, sources, "compiledLauncherScripts", "launcher");
		this.putSpecifiedTypeSources(modification, sources, "compiledLibs", "library");
		this.putSpecifiedTypeSources(modification, sources, "compiledPreloaderScripts", "preloader");
		this.putSpecifiedTypeSources(modification, sources, "compiledInstantScripts", "instant");
		// TODO: Custom sources must additionaly added manually, but not required at all.
		// It must be called by the `runCustomSource` function from parent script.
		if (isEmpty(sources)) {
			return null;
		}
		sources.__mod__ = modification;
		return sources;
	}
	getModListImpl() {
		try {
			let mods = Packages.com.zhekasmirnov.apparatus.modloader.ApparatusModLoader.getSingleton().getAllMods();
			let sorted = new java.util.ArrayList();
			for (let i = 0; i < mods.size(); i++) {
				let mod = mods.get(i);
				if (mod instanceof Packages.com.zhekasmirnov.apparatus.modloader.LegacyInnerCoreMod) {
					sorted.add(mod.getLegacyModInstance());
				}
			}
			return sorted;
		} catch (e) {
			return InnerCorePackages.mod.build.ModLoader.instance.modsList;
		}
	}
	resolveAvailabledExecutables(callback?: (index: number, length: number) => void) {
		let sources = this.getModListImpl(), modByName = [];
		for (let offset = 0; offset < sources.size(); offset++) {
			let modification = sources.get(offset);
			callback && callback(offset + 1, sources.size());
			let someone = this.resolveSpecifiedModificationSources(modification);
			someone && modByName.push(someone);
		}
		return modByName;
	}
}
