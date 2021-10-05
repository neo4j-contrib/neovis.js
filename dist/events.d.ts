export declare enum NeoVisEvents {
    CompletionEvent = "completed",
    ClickNodeEvent = "clickNode",
    ClickEdgeEvent = "clickEdge",
    ErrorEvent = "error"
}
export declare class EventController {
    private readonly _handlers;
    constructor();
    /**
     *
     * @param {string} eventType - Type of the event to be handled
     * @param {callback} handler - Handler to manage the event
     */
    register(eventType: NeoVisEvents, handler: Function): void;
    /**
     *
     * @param {string} eventType - Type of the event generated
     * @param {any} values - Values associated to the event
     */
    generateEvent(eventType: NeoVisEvents, values: any): void;
}
