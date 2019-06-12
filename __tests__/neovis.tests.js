import Neo4j, * as Neo4jMock from 'neo4j-driver';
import Neovis from '../src/neovis';
import { CompletionEvent } from '../src/events';
import * as testUtils from './testUtils';

jest.mock('neo4j-driver');

describe('Neovis', () => {
	const container_id = 'randomId';
	const initial_cypher = 'test query';
	const label1 = 'label1';
	const relationshipType = 'TEST';
	let neovis;

	beforeEach(() => Neo4jMock.clearAllMocks());
	beforeEach(() => {
		testUtils.clearIdCounter();
		document.body.innerHTML = `<div id="${container_id}"></div>`;
	});

	describe('Neovis default behavior', () => {
		beforeEach(() => {
			neovis = new Neovis({initial_cypher, container_id});
		});

		it('should call run with query', () => {
			neovis.render();
			expect(Neo4jMock.mockSessionRun).toHaveBeenCalledWith(initial_cypher, {limit: 30});
		});

		it('should call completed when complete', (done) => {
			testUtils.mockNormalRunSubscribe();
			neovis.render();
			neovis.registerOnEvent(CompletionEvent, () => {
				done();
			});
		});

		it('should save records to dataset', async () => {
			testUtils.mockNormalRunSubscribe([
				testUtils.makeRecord([testUtils.makeNode([label1])]),
			]);
			neovis.render();
			await testUtils.neovisRenderDonePromise(neovis);
			expect(neovis._data.nodes.get(1)).toBeDefined();
		});

		it('should save paths to dataset', async () => {
			testUtils.mockNormalRunSubscribe([
				testUtils.makeRecord([testUtils.makePathFromNodes([
					testUtils.makeNode([label1]),
					testUtils.makeNode([label1])
				], relationshipType)]),
			]);
			neovis.render();
			await testUtils.neovisRenderDonePromise(neovis);
			expect(neovis._data.nodes.length).toBe(2);
			expect(neovis._data.edges.length).toBe(1);
		});

		it('should save record with multiple parameters', async () => {
			const firstNode = testUtils.makeNode([label1]);
			const secondNode = testUtils.makeNode([label1]);
			const relationship = testUtils.makeRelationship(relationshipType, firstNode, secondNode);
			testUtils.mockNormalRunSubscribe([
				testUtils.makeRecord([firstNode, secondNode, relationship])
			]);
			neovis.render();
			await testUtils.neovisRenderDonePromise(neovis);
			expect(neovis._data.nodes.length).toBe(2);
			expect(neovis._data.edges.length).toBe(1);
		});

		it('should save multiple records from different types', async () => {
			const firstNode = testUtils.makeNode([label1]);
			const secondNode = testUtils.makeNode([label1]);
			const relationship = testUtils.makeRelationship(relationshipType, firstNode, secondNode);
			testUtils.mockNormalRunSubscribe([
				testUtils.makeRecord([testUtils.makePathFromNodes([
					testUtils.makeNode([label1]),
					testUtils.makeNode([label1])
				], relationshipType)]),
				testUtils.makeRecord([testUtils.makeNode([label1])]),
				testUtils.makeRecord([firstNode, secondNode, relationship])
			]);
			neovis.render();
			await testUtils.neovisRenderDonePromise(neovis);
			expect(neovis._data.nodes.length).toBe(5);
			expect(neovis._data.edges.length).toBe(2);
		});
	});
	
	describe('neovis with sizeCypher', () => {
		const sizeCypher = 'sizeCypher';
		const neovisConfig = {
			initial_cypher,
			container_id,
			labels: {
				[label1]: {
					sizeCypher: sizeCypher
				}
			}
		};
		beforeEach(() => {
			neovis = new Neovis(neovisConfig);
		});

		it('should call sizeCypher and save return value to data set value', async () => {
			const node = testUtils.makeNode([label1]);
			testUtils.mockFullRunSubscribe({
				[initial_cypher]: {
					default: [testUtils.makeRecord([node])]
				},
				[sizeCypher]: {
					[node.identity.toInt()]: [testUtils.makeRecord([Neo4j.int(1)])]
				}
			});

			neovis.render();
			await testUtils.neovisRenderDonePromise(neovis);
			expect(Neo4jMock.mockSessionRun).toHaveBeenCalledTimes(1 + 1); // once for initial cypher and once for the sizeCypher
			expect(neovis._data.nodes.get(1)).toHaveProperty('value', 1);
		});
	});

});
