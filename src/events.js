export const CompletionEvent = 'completed';
export const ClickNodeEvent = 'clickNode';
export const ClickEdgeEvent = 'clickEdge';
export const DoubleClickNodeEvent = 'doubleClickNode';
export const DoubleClickEdgeEvent = 'doubleClickEdge';
export const ErrorEvent = 'error';

export class EventController {

	constructor() {
		this._handlers = {
			[CompletionEvent]: [],
			[ErrorEvent]: [],
			[ClickNodeEvent]: [],
			[ClickEdgeEvent]: [],
			[DoubleClickNodeEvent]: [],
			[DoubleClickEdgeEvent]: []
		};
	}

	/**
	 *
	 * @param {string} eventType - Type of the event to be handled
	 * @param {callback} handler - Handler to manage the event
	 */
	register(eventType, handler) {
		if (this._handlers[eventType] === undefined) {
			throw new Error('Unknown event: ' + eventType);
		}

		this._handlers[eventType].push(handler);
	}

	/**
	 *
	 * @param {string} eventType - Type of the event generated
	 * @param {object} values - Values associated to the event
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
