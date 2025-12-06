declare namespace HashedDrawableMap {
    let attachedViews: {};
    let attachedAsImage: {};
    let attachedAsBackground: {};
    function isImageAttachedToView(view: any): boolean;
    function isBackgroundAttachedToView(view: any): boolean;
    function isAttachedToView(view: any): any;
    function getDrawableAttachedToViewAsImage(view: any): any;
    function getDrawableAttachedToViewAsBackground(view: any): any;
    function getDrawablesAttachedToView(view: any): any[];
    function getAttachedViewsInMap(map: any, drawable: any): any[];
    function getAsImageAttachedViews(drawable: any): any[];
    function getAsBackgroundAttachedViews(drawable: any): any[];
    function getAttachedViews(drawable: any): any[];
    function attachInMap(map: any, view: any, drawable: any): boolean;
    function attachAsImage(view: any, drawable: any): boolean;
    function attachAsBackground(view: any, drawable: any): boolean;
    function deattachInMap(map: any, view: any): boolean;
    function deattachAsImage(view: any): boolean;
    function deattachAsBackground(view: any): boolean;
}
declare namespace DrawableFactory {
    function setAlpha(drawable: any, alpha: any): void;
    function setAntiAlias(drawable: any, enabled: any): void;
    function setAutoMirrored(drawable: any, enabled: any): void;
    function setFilterBitmap(drawable: any, enabled: any): void;
    function setTintColor(drawable: any, color: any): void;
    function setMipMap(drawable: any, enabled: any): void;
    function setColorFilter(drawable: any, filter: any): void;
    function setTileMode(drawable: any, modesOrX: any, y: any): void;
    function setGravity(drawable: any, gravity: any): void;
    function setLayoutDirection(drawable: any, direction: any): void;
    function setXfermode(drawable: any, mode: any): void;
    function setLevel(drawable: any, level: any): any;
    function setState(drawable: any, states: any): any;
    function setVisible(drawable: any, first: any, second: any): any;
}
declare namespace BitmapFactory {
    function decodeBytes(bytes: any, options: any): android.graphics.Bitmap;
    function decodeFile(path: any, options: any): android.graphics.Bitmap;
    function decodeAsset(path: any, options: any): android.graphics.Bitmap;
    function createScaled(bitmap: any, dx: any, dy: any): any;
}
declare namespace BitmapDrawableFactory {
    let required: {};
    let mapped: {};
    function getMappedFileByKey(key: any): any;
    function requireByKey(key: any, options: any): any;
    function findMappedByTag(tag: any): string[];
    function getRequiredCount(): number;
    function isRequired(key: any): boolean;
    function generateKeyFor(path: any, root: any): string;
    function getMappedCount(): number;
    function isMapped(key: any): boolean;
    function map(file: any, root: any): any;
    function mapAs(key: any, file: any): any;
    let MIME_TYPES: string[];
    function listFileNames(path: any, explore: any, root: any): any;
    function mapDirectory(path: any, explore: any, root: any): any[];
    function require(value: any, options: any): any;
    function wrap(value: any, options: any): any;
    function sameAs(from: any, to: any): boolean;
    function recycle(key: any): boolean;
    function recycleRequired(): void;
}
declare namespace AnimationDrawableFactory {
    function setEnterFadeDuration(drawable: any, duration: any): void;
    function setExitFadeDuration(drawable: any, duration: any): void;
    function setOneShot(drawable: any, enabled: any): void;
}
declare class Drawable {
    static applyDescribe(drawable: any, descriptor: any): void;
    isAttachedAsImage(view: any): boolean;
    isAttachedAsBackground(view: any): boolean;
    isAttached(view: any): boolean;
    toDrawable(): any;
    attachAsImage(view: any, force: any): boolean;
    deattachAsImage(view: any): boolean;
    attachAsBackground(view: any, force: any): boolean;
    deattachAsBackground(view: any): boolean;
    requestDeattach(view: any): boolean;
    reattachAsImage(view: any): boolean;
    reattachAsBackground(view: any): boolean;
    requestReattach(view: any): boolean;
    toString(): string;
}
declare class CachedDrawable extends Drawable {
    toDrawable(): android.graphics.drawable.Drawable;
    source: android.graphics.drawable.Drawable;
    isProcessed(): boolean;
    /**
     * @returns {android.graphics.drawable.Drawable}
     */
    process(): android.graphics.drawable.Drawable;
    getDescriptor(): any;
    setDescriptor(descriptor: any): void;
    descriptor: any;
    describe(drawable: any): void;
    requireDescribe(): void;
    invalidate(): void;
}
declare class ColorDrawable extends Drawable {
    static parseColor(value: any): any;
    constructor(color: any);
    toDrawable(): android.graphics.drawable.ColorDrawable;
    getColor(): any;
    setColor(color: any): void;
    color: any;
}
declare class ScheduledDrawable extends CachedDrawable {
    thread: java.lang.Thread;
    toDrawableInThread(): android.graphics.drawable.Drawable;
    getThread(): java.lang.Thread;
    isProcessing(): boolean;
}
declare class LayerDrawable extends ScheduledDrawable {
    constructor(layers: any);
    process(): android.graphics.drawable.LayerDrawable;
    clearLayers(): void;
    layers: any;
    getLayers(): any;
    getLayerCount(): any;
    indexOfLayer(layer: any): any;
    getLayerAt(index: any): any;
    addLayer(layer: any): void;
    addLayers(layers: any): void;
    hasLayer(layer: any): boolean;
    removeLayer(layer: any): void;
}
declare class ClipDrawable extends ScheduledDrawable {
    constructor(drawable: any, location: any, side: any);
    process(): android.graphics.drawable.ClipDrawable;
    getDrawable(): any;
    setDrawable(drawable: any): void;
    drawable: any;
    getLocation(): number;
    setLocation(location: any): void;
    location: number;
    getSide(): number;
    setSide(side: any): void;
    side: number;
}
declare namespace ClipDrawable {
    namespace Side {
        let HORIZONTAL: number;
        let VERTICAL: number;
    }
}
declare class BitmapDrawable extends ScheduledDrawable {
    constructor(bitmap: any, options: any);
    process(): android.graphics.drawable.BitmapDrawable;
    wrapped: any;
    describe(drawable: any, ...args: any[]): void;
    getBitmap(): any;
    setBitmap(bitmap: any): void;
    bitmap: any;
    getWrappedBitmap(): any;
    getOptions(): any;
    setOptions(options: any): void;
    options: any;
    getCorruptedThumbnail(): any;
    setCorruptedThumbnail(bitmap: any): void;
    corrupted: any;
    recycle(): void;
}
declare class AnimationDrawable extends ScheduledDrawable {
    constructor(frames: any);
    process(): android.graphics.drawable.AnimationDrawable;
    clearFrames(): void;
    frames: any;
    getFrames(): any;
    getFrameCount(): any;
    indexOfFrame(frame: any): any;
    getFrameAt(index: any): any;
    addFrame(frame: any, duration: any): void;
    addFrames(frames: any, duration: any): void;
    hasFrame(frame: any): boolean;
    removeFrame(frame: any): void;
    getCurrentIndex(): any;
    setCurrentIndex(index: any): void;
    isRunning(): any;
    start(): boolean;
    stop(): boolean;
    getDefaultDuration(): number;
    setDefaultDuration(duration: any): void;
    duration: number;
    isStartingWhenProcess(): boolean;
    setIsStartingWhenProcess(enabled: any): void;
    starting: boolean;
    isStoppingWhenCompleted(): boolean;
    setIsStoppingWhenCompleted(enabled: any): void;
    stopping: boolean;
}
declare namespace AnimationDrawable {
    export { Frame };
}
declare class Frame {
    constructor(drawable: any, duration: any);
    getDrawable(): any;
    setDrawable(drawable: any): void;
    drawable: any;
    getDuration(): number;
    setDuration(duration: any): void;
    duration: number;
    toString(): string;
}
