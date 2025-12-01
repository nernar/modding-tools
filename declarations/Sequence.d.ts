declare class Sequence {
    static uid: number;
    id: string;
    reporting?: boolean;
    index?: number;
    count?: number;
    between?: number;
    updated?: boolean;
    completed?: boolean;
    priority?: number;
    thread?: java.lang.Thread;
    update?: (progress: number, index: number) => void;
    tick?: (index: number, ellapsedMs: number, startMs: number) => void;
    complete?: (ellapsedMs: number, startMs: number) => void;
    uncount?: (value: any) => number;
    create?: (value: any, startMs: number) => void;
    /**
     * Processes thread besides [[sync()]] interface
     * context, that was used to indicate process.
     * Calls [[process()]] for every element requested
     * by [[next()]] besides [[execute()]] passed value.
     * @param obj merges with prototype
     */
    constructor(obj?: Scriptable);
    getThread(): java.lang.Thread;
    getSynchronizeTime(): number;
    setSynchronizeTime(ms: number): void;
    getPriority(): number;
    setPriority(priority: number): void;
    setFixedCount(count: number): void;
    getFixedCount(): number;
    setReportingEnabled(enabled: boolean): void;
    isReportingEnabled(): boolean;
    /**
     * Sync recursive action, that awaits when
     * process is completed, interrupted or cancelled.
     * @param active process startup milliseconds
     */
    sync(active: number): void;
    /**
     * Action that launches main process and sync.
     * @param value data to process
     */
    execute(value?: any): void;
    /**
     * Must be called inside [[process()]] or [[next()]]
     * if you want to force update process indexes.
     * Recommended to use if [[uncount()]] wouldn't
     * help in dynamical reupdate or just update progress.
     * @param index currently progress
     * @param count maximum value
     */
    require(index?: number, count?: number): void;
    shrink(addition?: number): void;
    /**
     * Calls for every item inside [[process]], passed
     * value will be used into it. That action created
     * to communicate executing object with process,
     * split it to processable parts.
     * @param value passed on execute
     * @param index was returned by [[process()]]
     * @returns value or element to [[process()]]
     * @async Wouldn't access interface thread.
     */
    next(value: any, index: number): any;
    /**
     * Main sequence process in thread;
     * handles object and returns index.
     * @param element next result to handle
     * @param value elements resolver
     * @param index indicates progress
     * @returns index to sync
     * @throws must be overwritten in usage
     * @async Wouldn't access interface thread.
     */
    process(element: any, value: any, index: number): number;
    cancel(error?: Error): void;
    interrupt(): void;
    isInterrupted(): boolean;
    assureYield(thread?: java.lang.Thread): boolean;
}
