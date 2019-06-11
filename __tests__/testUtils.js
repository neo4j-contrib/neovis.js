import Neo4j, * as Neo4jMock from 'neo4j-driver';
import { CompletionEvent } from '../src/events';

jest.mock('neo4j-driver');

let counter = 1;

export function clearIdCounter() {
	counter = 1;
}

export function makeNode(labels, properties = {}) {
	return new Neo4j.types.Node(Neo4j.int(counter++), labels, properties);
}

export function makeRelationship(type, startNode, endNode, properties = {}) {
	return new Neo4j.types.Relationship(Neo4j.int(counter++), startNode.identity, endNode.identity, type, properties);
}

export function makePathFromNodes(nodes, relationshipType) {
	const pathSegments = [];
	for (let i = 0; i < nodes.length - 1; i++) {
		pathSegments.push(new Neo4j.types.PathSegment(
			nodes[i],
			makeRelationship(relationshipType, nodes[i], nodes[i + 1]),
			nodes[i + 1]
		));
	}
	return new Neo4j.types.Path(nodes[0], nodes[nodes.length - 1], pathSegments);
}

export function makeRecord(parameters) {
	const recordKeys = parameters.map((_, index) => index.toString());
	return new Neo4j.types.Record(recordKeys, parameters);
}

export function assertNodes(neovis, nodes, assertFunction) {
	nodes.forEach(node => {
		const dataSetNode = neovis._data.nodes.get(node.identity.toInt());
		assertFunction(node, dataSetNode);
	});
}

export function assertEdges(neovis, edges, assertFunction) {
	edges.forEach(edges => {
		const dataSetEdge = neovis._data.edges.get(edges.identity.toInt());
		assertFunction(edges, dataSetEdge);
	});
}

export function mockNormalRunSubscribe(records = []) {
	Neo4jMock.mockRunSubscribe.mockImplementationOnce(({onNext, onCompleted}) => {
		records.forEach(onNext);
		onCompleted();
	});
}

export function neovisRenderDonePromise(neovis) {
	return new Promise(res => neovis.registerOnEvent(CompletionEvent, res));
}