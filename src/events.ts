export const CompletionEvent = "completed";
export const NodeSelectionEvent = "selectNode";
export const EdgeSelectionEvent = "selectEdge";
export const ClickEvent = "click";
export const ClearEvent = "clearNetwork";

export class EventController {
    public _handlers: { [eventKey: string]: any };

    constructor() {
        this._handlers = {
            [CompletionEvent]: [],
            [NodeSelectionEvent]: [],
            [EdgeSelectionEvent]: [],
            [ClickEvent]: [],
        };
    }

    /**
     *
     * @param {string} eventType Type of the event to be handled
     * @param {callback} handler Handler to manage the event
     */
    public register(eventType: string, handler: (args: any[]) => void) {
        if (this._handlers[eventType] === undefined) {
            throw new Error("Unknown event: " + eventType);
        }

        this._handlers[eventType].push(handler);
    }

    /**
     *
     * @param {string} eventType Type of the event generated
     * @param {dictionary} value Values associated to the event
     */
    public generateEvent(eventType: string, values: any) {
        if (this._handlers[eventType] === undefined) {
            throw new Error("Unknown event: " + eventType);
        }

        for (const handler of this._handlers[eventType]) {
            handler(values);
        }
    }
}
