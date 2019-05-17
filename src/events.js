export const CompletionEvent = 'completed';
export const SelectionEvent = 'selectNode';
export const ClickEvent = 'click';

export class EventController {

    constructor() {
        this._handlers = {
            [CompletionEvent]: [],
            [SelectionEvent]: [],
            [ClickEvent]: []
        };
    }

    /**
     * 
     * @param {string} eventType Type of the event to be handled
     * @param {callback} handler Handler to manage the event
     */
    register(eventType, handler) {
        if (this._handlers[eventType] === undefined) {
            throw new Error('Unknown event: ' + eventType);
        }

        this._handlers[eventType].push(handler);
    }

    /**
     * 
     * @param {string} eventType Type of the event generated
     * @param {dictionary} value Values associated to the event
     */
    generateEvent(eventType, values) {
        if (this._handlers[eventType] === undefined) {
            throw new Error('Unknown event: ' + eventType);
        }

        for (const handler of this._handlers[eventType]) {
            handler(values);
        }
    }
}