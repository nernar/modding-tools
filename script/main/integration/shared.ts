/**
 * If you thought you were missing feature that need, make sure
 * it's not deprecated or an environment internal feature.
 * Perhaps you should not interfere with itself work.
 */
const API = assign({}, {
	USER_ID: "none",
	API_VERSION: API_VERSION,
	PRODUCT_REVISION: REVISION,
	CONTEXT: CONTEXT,
	InnerCorePackages: InnerCorePackages,
	isAndroid: isAndroid,
	isCLI: isCLI,
	isCoreEngineLoaded: isCoreEngineLoaded,
	CoreEngine: CoreEngine,
	launchIfSupported: launchIfSupported,
	__inherit__: __inherit__,

	// Retention
	isHorizon: isHorizon,
	minecraftVersion: minecraftVersion,
	handle: handle,
	handleThread: handleThread,
	handleAction: handleAction,
	acquire: acquire,
	resolveThrowable: resolveThrowable,
	translate: translate,
	translateCounter: translateCounter,
	translateCode: translateCode,
	toDigestMd5: toDigestMd5,
	vibrate: vibrate,
	reportError: reportError,
	reportTrace: reportTrace,
	localizeError: localizeError,

	// Android Ui
	getContext: getContext,
	getTypeface: function() {
		return typeface;
	},
	getDecorView: getDecorView,
	getDisplayWidth: getDisplayWidth,
	getDisplayPercentWidth: getDisplayPercentWidth,
	getRelativeDisplayPercentWidth: getRelativeDisplayPercentWidth,
	getDisplayHeight: getDisplayHeight,
	getDisplayPercentHeight: getDisplayPercentHeight,
	getRelativeDisplayPercentHeight: getRelativeDisplayPercentHeight,
	getDisplayDensity: getDisplayDensity,
	toComplexUnitDip: toComplexUnitDip,
	toRawComplexUnitDip: toRawComplexUnitDip,
	toComplexUnitDp: toComplexUnitDp,
	toRawComplexUnitDp: toRawComplexUnitDp,
	toComplexUnitSp: toComplexUnitSp,
	toRawComplexUnitSp: toRawComplexUnitSp,

	// Global registry
	registerTool(id: string, tool: any) {
		if (Tools.hasOwnProperty(id)) {
			Logger.Log("Modding Tools: Id " + id + " is already occupied!", "WARNING");
			return;
		}
		log("Modding Tools: Registered tool " + id + " shortcut");
		Tools[id] = tool;
	},
	registerMenuTool(id: string, tool: any, entry: ProjectTool.MenuFactory) {
		if (Tools.hasOwnProperty(id)) {
			Logger.Log("Modding Tools: Id " + id + " is already occupied!", "WARNING");
			return;
		}
		if (entry === undefined) {
			entry = new ProjectTool.MenuFactory();
		}
		if (!(entry instanceof ProjectTool.MenuFactory)) {
			MCSystem.throwException("Modding Tools: registerMenuTool(id, tool, *) entry must be instance of ProjectTool.MenuFactory");
		}
		log("Modding Tools: Registered tool " + id + " into menu entry");
		PROJECT_TOOL.tools[id] = entry;
		Tools[id] = tool;
	},
	registerBitsetUi: registerBitsetUi,
	registerFragmentJson: registerFragmentJson,
	registerWindowJson: registerWindowJson,
	registerKeyboardWatcher: registerKeyboardWatcher,

	// Helper functions
	random: random,
	isEmpty: isEmpty,
	assign: assign,
	merge: merge,
	clone: clone,
	sameAs: sameAs,
	preround: preround,
	calloutOrParse: calloutOrParse,
	parseCallback: parseCallback,
	MathUtils: MathUtils,
	Base64: Base64,
	playTune: playTune,
	playTuneDirectly: playTuneDirectly,
	stopTune: stopTune,
	getPlayerEnt: getPlayerEnt,

	// Dialogues
	confirm: confirm,
	select: select,
	showHint: showHint,
	checkOnlineable: checkOnlineable,
	stringifyObject: stringifyObject,
	stringifyObjectInline: stringifyObjectInline,
	formatExceptionReport: formatExceptionReport,
	selectFile: selectFile,
	saveFile: saveFile,
	readFileAsync: readFile,
	stringifyJson: stringifyJson,
	stringifyJsonIndented: stringifyJsonIndented,
	isLightweightArray: isLightweightArray,

	// Storage utility
	resetSettingIfNeeded: resetSettingIfNeeded,
	loadSetting: loadSetting,
	injectSetting: injectSetting,
	updateInternalConfig: updateInternalConfig,
	formatSize: formatSize,
	Dirs: Dirs,
	MediaTypes: MediaTypes,
	Files: Files,

	// Decoding resources
	ImageFactory: ImageFactory, // DEPRECATED
	HashedDrawableMap: HashedDrawableMap,
	Drawable: Drawable,
	CachedDrawable: CachedDrawable,
	ScheduledDrawable: ScheduledDrawable,
	LayerDrawable: LayerDrawable,
	ClipDrawable: ClipDrawable,
	ColorDrawable: ColorDrawable,
	BitmapFactory: BitmapFactory,
	BitmapDrawable: BitmapDrawable,
	BitmapDrawableFactory: BitmapDrawableFactory,
	AnimationDrawable: AnimationDrawable,
	AnimationDrawableFactory: AnimationDrawableFactory,
	DrawableFactory: DrawableFactory,

	// Fragment prototypes
	Fragment: Fragment,
	BaseFragment: BaseFragment,
	LayoutFragment: LayoutFragment,
	SelectableFragment: SelectableFragment,
	SelectableLayoutFragment: SelectableLayoutFragment,
	FrameFragment: FrameFragment,
	ScrollFragment: ScrollFragment,
	HorizontalScrollFragment: HorizontalScrollFragment,
    TextFragment: TextFragment,
    TextFragmentMixin: TextFragmentMixin,
    ImageFragment: ImageFragment,
    ImageFragmentMixin: ImageFragmentMixin,
	ListFragment: ListFragment,

	// Adapters
	ListHolderAdapter: ListHolderAdapter,
	FilterListHolderAdapter: FilterListHolderAdapter,

	// Fragment variations
	CategoryTitleFragment: CategoryTitleFragment,
	ExplanatoryFragment: ExplanatoryFragment,
	ButtonFragment: ButtonFragment,
	ThinButtonFragment: ThinButtonFragment, // DEPRECATED
	SolidButtonFragment: SolidButtonFragment, // DEPRECATED
	PropertyInputFragment: PropertyInputFragment,
	SliderFragment: SliderFragment,
	CounterFragment: CounterFragment,
	AxisGroupFragment: AxisGroupFragment,
	SegmentGroupFragment: SegmentGroupFragment,
	EditorFragment: EditorFragment,

	// Under-refactored fragments
	OverlayFragment: OverlayFragment,
	ControlFragment: ControlFragment,
	SidebarFragment: SidebarFragment,

	// Window prototypes
	WindowProxy: WindowProxy,
	FocusableWindow: FocusableWindow,
	TransitionWindow: TransitionWindow,
	UniqueWindow: UniqueWindow,
	WindowProvider: WindowProvider,
	UniqueHelper: UniqueHelper,
	FocusableFragment: FocusableFragment,
	FocusablePopup: FocusablePopup,
	ExpandableFragment: ExpandableFragment,
	ExpandablePopup: ExpandablePopup,

	// Window variations
	AdditionalMessage: AdditionalMessage,
	AdditionalMessageFactory: AdditionalMessageFactory,
	HintAlert: HintAlert,
	ExplorerWindow: ExplorerWindow,
	OverlayWindow: OverlayWindow,
	ControlWindow: ControlWindow,
	MenuWindow: MenuWindow,
	SidebarWindow: SidebarWindow,

	// Functions used inside popup prototypes
	openPopup(id: string, popup: FocusablePopup) {
		Popups.open(popup, id);
	},
	closePopup(id: string) {
		return Popups.closeIfOpened(id);
	},
	closePopupGroup(id: string) {
		Popups.closeAllByTag(id);
	},
	closeAllPopups() {
		Popups.closeAll();
	},
	hasOpenedPopup(id: string) {
		return Popups.hasOpenedByName(id);
	},
	updatePopup(id: string, ...opts: any[]) {
		return Popups.updateAtName(id, ...opts);
	},
	updateAllPopups() {
		Popups.updateAll();
	},
	getPopupIds() {
		return Popups.getOpenedIds();
	},
	getPopups() {
		return Popups.getOpened();
	},

	// Rhino evaluation
	compileReader: compileReader,
	compileString: compileString,
	compileFunction: compileFunction,
	compileUniversal: compileUniversal,
	evaluateReader: evaluateReader,
	evaluateString: evaluateString,
	evaluateUniversal: evaluateUniversal,
	runAtScope: runAtScope,
	newLoggingErrorReporter: newLoggingErrorReporter,
	newRuntimeCompilerEnvirons: newRuntimeCompilerEnvirons,

	// Adaptive evaluation
	Wrappables: Wrappables,
	UNWRAP: UNWRAP,
	REQUIRE: REQUIRE,
	CHECKOUT: CHECKOUT,

	// Project
	compileScript: compileScript,
	compileData: compileData,
	exportProject: exportProject,
	importProject: importProject,
	importScript: importScript,
	selectProjectData: selectProjectData,
	Worker: Worker,
	Project: Project,
	ProjectProvider: ProjectProvider,
	ScriptConverter: ScriptConverter,
	ScriptImporter: ScriptImporter,

	// Tools
	Action: Action,
	Tool: Tool,
	InteractionTool: InteractionTool,
	MenuTool: MenuTool,
	SidebarTool: SidebarTool,
	ProjectTool: ProjectTool,
	EditorTool: EditorTool,
	attachProjectTool: attachProjectTool,
	attachEditorTool: attachEditorTool,
	attachTool(id: string, when?: (tool: Tool) => void) {
		if (!Tools.hasOwnProperty(id)) {
			Logger.Log("Modding Tools: Not found tool " + id + ", consider have you registered it", "WARNING");
			return;
		}
		attachEditorTool(Tools[id], undefined, when);
	},

	// Sequence
	Sequence: Sequence,
	SnackSequence: SnackSequence,

	// Specific content
	LogViewer: LogViewer,
	LevelProvider: LevelProvider,
	RuntimeCodeEvaluator: RuntimeCodeEvaluator,

	// For internal support launching other modifications
	Module: {
		canLeaveAtMoment() {
			return !isSupportEnv;
		},
		getCurrentEnvironment() {
			return currentEnvironment;
		},
		sendBackstageStatus() {
			restart();
		}
	}
});

((...who: string[]) => {
	for (let element in who) {
		if (this.hasOwnProperty(element)) {
			API[element] = who[element];
		}
	}
})("USER_ID", "Connectivity", "ModBrowser", "Mehwrap");

const notifyCoreEngineLoaded = () => CoreEngine.ModAPI.registerAPI("ModdingTools", API);

const hideInsetsOnScreen = () => {
	if (isHorizon) {
		handle(() => {
			let window = getContext().getWindow();
			if (android.os.Build.VERSION.SDK_INT >= 28) {
				// Content renders into the cutout area in both portrait and landscape modes.
				window.getAttributes().layoutInDisplayCutoutMode =
					android.view.WindowManager.LayoutParams.LAYOUT_IN_DISPLAY_CUTOUT_MODE_SHORT_EDGES;
			}
			if (android.os.Build.VERSION.SDK_INT >= 30) {
				let controller = window.getInsetsController();
				if (controller != null) {
					controller.hide(
						android.view.WindowInsets.Type.statusBars() |
						android.view.WindowInsets.Type.navigationBars());
					controller.setSystemBarsBehavior(
						android.view.WindowInsetsController.BEHAVIOR_SHOW_TRANSIENT_BARS_BY_SWIPE);
				}
			} else {
				window.getDecorView().setSystemUiVisibility(
					android.view.View.SYSTEM_UI_FLAG_LOW_PROFILE |
					android.view.View.SYSTEM_UI_FLAG_IMMERSIVE_STICKY |
					// Set the content to appear under the system bars so that the
					// content doesn't resize when the system bars hide and show.
					android.view.View.SYSTEM_UI_FLAG_LAYOUT_STABLE |
					android.view.View.SYSTEM_UI_FLAG_LAYOUT_HIDE_NAVIGATION |
					android.view.View.SYSTEM_UI_FLAG_LAYOUT_FULLSCREEN |
					// Hide the navigation bar and status bar.
					android.view.View.SYSTEM_UI_FLAG_HIDE_NAVIGATION |
					android.view.View.SYSTEM_UI_FLAG_FULLSCREEN);
				window.setFlags(
					android.view.WindowManager.LayoutParams.FLAG_FULLSCREEN,
					android.view.WindowManager.LayoutParams.FLAG_FULLSCREEN);
			}
		});
	}
};

const getCoreEngineAndInjectIfNeeded = () => {
	try {
		if (isCoreEngineLoaded()) {
			return CoreEngine;
		}
		let instance = null;
		let CoreEngineAPI = InnerCorePackages.api.mod.coreengine.CoreEngineAPI;
		let field: java.lang.reflect.Field;
		try {
			field = CoreEngineAPI.__javaObject__.getDeclaredField("ceHandlerSingleton");
		} catch (e) {
			field = CoreEngineAPI.__javaObject__.getDeclaredField("coreEngineHandler");
			instance = InnerCorePackages.api.mod.API.getInstanceByName("CoreEngine");
		}
		field.setAccessible(true);
		let ceHandlerSingleton = field.get(instance);
		if (ceHandlerSingleton != null) {
			ceHandlerSingleton.injectCoreAPI(CoreEngine);
		}
		if (!isCoreEngineLoaded()) {
			return null;
		}
		notifyCoreEngineLoaded();
	} catch (e) {
		reportError(e);
	}
	return CoreEngine;
};

Callback.addCallback("PreBlocksDefined", () =>{
	getCoreEngineAndInjectIfNeeded();
});
