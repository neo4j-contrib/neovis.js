import { Edge, Node } from './types';

export enum NeoVisEvents {
	CompletionEvent = 'completed',
	ClickNodeEvent = 'clickNode',
	ClickEdgeEvent = 'clickEdge',
	ErrorEvent = 'error'
}

export interface EventFunctionTypes {
	[NeoVisEvents.CompletionEvent]: (event: { recordCount: number }) => void;
	[NeoVisEvents.ClickNodeEvent]: (event: { nodeId: number, node: Node }) => void;
	[NeoVisEvents.ClickEdgeEvent]: (event: { edgeId: number, edge: Edge }) => void;
	[NeoVisEvents.ErrorEvent]: (event: { error: Error }) => void;
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
	 * @param eventType - Type of the event to be handled
	 * @param handler - Handler to manage the event
	 */
	register<T extends NeoVisEvents>(eventType: T, handler: EventFunctionTypes[T]): void {
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
	generateEvent<T extends NeoVisEvents>(eventType: T, values: Parameters<EventFunctionTypes[T]>[0]): void {
		if (this._handlers[eventType] === undefined) {
			throw new Error('Unknown event: ' + eventType);
		}

		for (const handler of this._handlers[eventType]) {
			handler(values);
		}
	}
}
