export enum NeoVisEvents {
	CompletionEvent = 'completed',
	ClickNodeEvent = 'clickNode',
	ClickEdgeEvent ='clickEdge',
	ErrorEvent = 'error'
}

export class EventController {
	private readonly _handlers: { [p: string]: Function[] };

	constructor() {
		this._handlers = {
			[NeoVisEvents.CompletionEvent]: [],
			[NeoVisEvents.ErrorEvent]: [],
			[NeoVisEvents.ClickNodeEvent]: [],
			[NeoVisEvents.ClickEdgeEvent]: [],
		};
	}

	/**
	 *
	 * @param {string} eventType - Type of the event to be handled
	 * @param {callback} handler - Handler to manage the event
	 */
	register(eventType: NeoVisEvents, handler: Function): void {
		if (this._handlers[eventType] === undefined) {
			throw new Error('Unknown event: ' + eventType);
		}

		this._handlers[eventType].push(handler);
	}

	/**
	 *
	 * @param {string} eventType - Type of the event generated
	 * @param {any} values - Values associated to the event
	 */
	generateEvent(eventType: NeoVisEvents, values: any): void {
		if (this._handlers[eventType] === undefined) {
			throw new Error('Unknown event: ' + eventType);
		}

		for (const handler of this._handlers[eventType]) {
			handler(values);
		}
	}
}
