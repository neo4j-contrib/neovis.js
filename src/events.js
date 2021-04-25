export const CompletionEvent = 'completed';
export const ClickNodeEvent = 'clickNode';
export const DoubleClickNodeEvent = 'doubleClickNode';
export const ClickEdgeEvent = 'clickEdge';
export const DoubleClickEdgeEvent = 'doubleClickEdge';
export const HoldNodeEvent = 'holdNode';
export const StabilizationIterationsDoneEvent = 'stabilizationIterationsDone';
export const ErrorEvent = 'error';

export class EventController {

	constructor() {
		this._handlers = {
			[CompletionEvent]: [],
			[ErrorEvent]: [],
			[ClickNodeEvent]: [],
			[DoubleClickNodeEvent]: [],
			[ClickEdgeEvent]: [],
			[HoldNodeEvent]: [],
			[DoubleClickEdgeEvent]: [],
			[StabilizationIterationsDoneEvent]: [],
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
