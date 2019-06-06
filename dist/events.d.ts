export declare const CompletionEvent = "completed";
export declare const NodeSelectionEvent = "selectNode";
export declare const EdgeSelectionEvent = "selectEdge";
export declare const ClickEvent = "click";
export declare const ClearEvent = "clearNetwork";
export declare class EventController {
    _handlers: {
        [eventKey: string]: any;
    };
    constructor();
    /**
     *
     * @param {string} eventType Type of the event to be handled
     * @param {callback} handler Handler to manage the event
     */
    register(eventType: string, handler: (args: any[]) => void): void;
    /**
     *
     * @param {string} eventType Type of the event generated
     * @param {dictionary} value Values associated to the event
     */
    generateEvent(eventType: string, values: any): void;
}
