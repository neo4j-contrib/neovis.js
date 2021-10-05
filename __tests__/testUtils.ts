import type * as Neo4jType from 'neo4j-driver';
import * as Neo4jMockImport from 'neo4j-driver';
import { NeoVisEvents } from '../src/events';
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

export function makeNode(labels: string[], properties: any = {}): Neo4jCore.Node<number> {
	return new Neo4jCore.Node(counter++, labels, properties);
}

export function makeRelationship(type: string, startNode: Neo4jCore.Node<number>, endNode: Neo4jCore.Node<number>, properties: any = {}): Neo4jCore.Relationship<number> {
	return new Neo4jCore.Relationship(counter++, startNode.identity, endNode.identity, type, properties);
}

export function makePathFromNodes(nodes: Neo4jType.Node<number>[], relationshipType: string): Neo4jCore.Path<number> {
	const pathSegments = [];
	for (let i = 0; i < nodes.length - 1; i++) {
		pathSegments.push(new Neo4jCore.PathSegment(
			nodes[i],
			makeRelationship(relationshipType, nodes[i], nodes[i + 1]),
			nodes[i + 1]
		));
	}
	return new Neo4jCore.Path(nodes[0], nodes[nodes.length - 1], pathSegments);
}

export function makeRecord(parameters: any[]): Neo4jCore.Record {
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

export function mockNormalRunSubscribe(records: Neo4jType.Record<any>[] = []): void {
	Neo4jMock.mockSessionRun.mockImplementation(() => {
		const observablePromise: Partial<ObservablePromise<{ records: Neo4jType.Record<any>[] }>> = Promise.resolve({ records });
		observablePromise.subscribe = ({ onNext, onCompleted }) => {
			records.forEach(onNext);
			onCompleted();
		};
		return observablePromise as ObservablePromise<{ records: Neo4jType.Record<any>[] }>;
	});
}

export function mockFullRunSubscribe(cypherIdsAndAnswers: Record<string, { default?: Neo4jType.Record<any>[], [id: number]: Neo4jType.Record<any>[] } >): void {
	Neo4jMock.mockSessionRun.mockImplementation((cypher: string, parameters: Record<string, any>) => {
		if (!cypherIdsAndAnswers[cypher]) {
			throw new Error(`the cypher '${cypher}' was not expected`);
		}
		if (!cypherIdsAndAnswers[cypher].default && !cypherIdsAndAnswers[cypher][parameters.id]) {
			throw new Error(`the id '${parameters.id}' was not expected for cypher ${cypher}`);
		}
		const records = cypherIdsAndAnswers[cypher].default || cypherIdsAndAnswers[cypher][parameters.id];
		const observablePromise: Partial<ObservablePromise<{ records: Neo4jType.Record<any>[] }>> = Promise.resolve({ records });
		observablePromise.subscribe = ({ onNext, onCompleted }) => {
			records.forEach(onNext);
			onCompleted();
		};
		return observablePromise as ObservablePromise<{ records: Neo4jType.Record<any>[] }>;
	});
}


export function neovisRenderDonePromise(neovis: NeoVis): Promise<void> {
	return new Promise(res => neovis.registerOnEvent(NeoVisEvents.CompletionEvent, res));
}