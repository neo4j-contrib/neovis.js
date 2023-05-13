import type * as Neo4jType from 'neo4j-driver';
import * as Neo4jMockImport from 'neo4j-driver';
import { EventFunctionTypes, NeoVisEvents } from '../src/events';
import * as Neo4jCore from 'neo4j-driver-core';

// eslint-disable-next-line jest/no-mocks-import
import type * as Neo4jMockType from '../__mocks__/neo4j-driver';
import type NeoVis from '../src/neovis';
export type ObservablePromise<T> = Promise<T> & { subscribe: (T) => void };

jest.mock('neo4j-driver');

const Neo4jMock = Neo4jMockImport as unknown as typeof Neo4jMockType;

let counter = 1;

export function clearIdCounter(): void {
	counter = 1;
}

export function makeNode(labels: string[], properties: Record<string, unknown> = {}, id?: Neo4jCore.Integer | number): Neo4jCore.Node<Neo4jCore.Integer | number> {
	return new Neo4jCore.Node(id ?? new Neo4jCore.Integer(counter++, 0), labels, properties);
}

export function makeRelationship(type: string, startNode: Neo4jCore.Node<number | Neo4jCore.Integer>, endNode: Neo4jCore.Node<number | Neo4jCore.Integer>, properties: Record<string, unknown> = {}): Neo4jCore.Relationship<number | Neo4jCore.Integer> {
	return new Neo4jCore.Relationship(counter++, startNode.identity, endNode.identity, type, properties);
}

export function makePathFromNodes(nodes: Neo4jType.Node<number | Neo4jCore.Integer>[], relationshipType: string): Neo4jCore.Path<number | Neo4jCore.Integer> {
	const pathSegments: Neo4jCore.PathSegment<number | Neo4jCore.Integer>[] = [];
	for (let i = 0; i < nodes.length - 1; i++) {
		pathSegments.push(new Neo4jCore.PathSegment(
			nodes[i],
			makeRelationship(relationshipType, nodes[i], nodes[i + 1]),
			nodes[i + 1]
		));
	}
	return new Neo4jCore.Path(nodes[0], nodes[nodes.length - 1], pathSegments);
}

export function makeRecord<T>(parameters: T[]): Neo4jCore.Record<{ [key: string] : unknown }> {
	const recordKeys = parameters.map((_, index) => index.toString());
	return new Neo4jCore.Record(recordKeys, parameters);
}

export function assertNodes(neovis: NeoVis, nodes: Neo4jType.Node<number>[], assertFunction: Function): void {
	nodes.forEach(node => {
		const dataSetNode = neovis.nodes.get(node.identity);
		assertFunction(node, dataSetNode);
	});
}

export function assertEdges(neovis: NeoVis, edges: Neo4jType.Relationship<number>[], assertFunction: Function): void {
	edges.forEach(edges => {
		const dataSetEdge = neovis.edges.get(edges.identity);
		assertFunction(edges, dataSetEdge);
	});
}

export function mockNormalRunSubscribe(records: Neo4jType.Record<{ [key: string]: unknown }>[] = []): void {
	Neo4jMock.mockSessionRun.mockImplementation(() => {
		const observablePromise: Partial<ObservablePromise<{ records: Neo4jType.Record<{ [key: string]: unknown }>[] }>> = Promise.resolve({ records });
		observablePromise.subscribe = ({ onNext, onCompleted }) => {
			records.forEach(onNext);
			onCompleted();
		};
		return observablePromise as ObservablePromise<{ records: Neo4jType.Record<Record<string, unknown>>[] }>;
	});
}

export function mockFullRunSubscribe(cypherIdsAndAnswers: Record<string, { default?: Neo4jType.Record<{ [key: string]: unknown }>[], [id: number]: Neo4jType.Record<{ [key: string]: unknown }>[] } >): void {
	Neo4jMock.mockSessionRun.mockImplementation((cypher: string, parameters: Record<string, unknown>) => {
		if (!cypherIdsAndAnswers[cypher]) {
			throw new Error(`the cypher '${cypher}' was not expected`);
		}
		if (!cypherIdsAndAnswers[cypher].default && !cypherIdsAndAnswers[cypher][parameters.id as number]) {
			throw new Error(`the id '${parameters.id}' was not expected for cypher ${cypher}`);
		}
		const records = cypherIdsAndAnswers[cypher].default || cypherIdsAndAnswers[cypher][parameters.id as number];
		const observablePromise: Partial<ObservablePromise<{ records: Neo4jType.Record<{ [key: string]: unknown }>[] }>> = Promise.resolve({ records });
		observablePromise.subscribe = ({ onNext, onCompleted }) => {
			records.forEach(onNext);
			onCompleted();
		};
		return observablePromise as ObservablePromise<{ records: Neo4jType.Record<Record<string, unknown>>[] }>;
	});
}


export function neovisRenderDonePromise(neovis: NeoVis): Promise<Parameters<EventFunctionTypes[NeoVisEvents.CompletionEvent]>[0]> {
	return new Promise((res, rej) => {
		neovis.registerOnEvent(NeoVisEvents.CompletionEvent, res);
		neovis.registerOnEvent(NeoVisEvents.ErrorEvent, rej);
	});
}