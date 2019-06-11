import * as Neo4jMock from 'neo4j-driver';
import Neovis from '../src/neovis';
import { CompletionEvent } from '../src/events';
import * as testUtils from './testUtils';

jest.mock('neo4j-driver');

describe('Neovis', () => {
	const container_id = 'randomId';
	let initial_cypher, neovis;
	const label1 = 'label1';
	const relationshipType = 'TEST';

	beforeEach(() => Neo4jMock.clearAllMocks());
	beforeEach(() => {
		testUtils.clearIdCounter();
		document.body.innerHTML = `<div id="${container_id}"></div>`;
		initial_cypher = 'test query';
		neovis = new Neovis({initial_cypher, container_id});
	});

	describe('Neovis default behavior', () => {
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
			expect(neovis._data.nodes.get(1)).toBeDefined();
			expect(neovis._data.nodes.get(2)).toBeDefined();
			expect(neovis._data.edges.get(3)).toBeDefined();
		});

	});
});
