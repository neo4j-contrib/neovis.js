import Neo4j, * as Neo4jMock from 'neo4j-driver';
import Neovis from '../src/neovis';
import { CompletionEvent } from '../src/events';

jest.mock('neo4j-driver');

function makeNode(id, labels, properties) {
	return new Neo4j.types.Record(Neo4j.int(id), labels, properties);
}

function mockNormalRunSubscribe(records = []) {
	Neo4jMock.mockRunSubscribe.mockImplementationOnce(({onNext, onCompleted}) => {
		records.forEach(onNext);
		onCompleted();
	});
}

describe('Neovis', () => {
	const container_id = 'randomId';
	let initial_cypher, neovis;
	const label1 = 'label1';

	beforeEach(() => Neo4jMock.clearAllMocks());
	beforeEach(() => {
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
			mockNormalRunSubscribe();
			neovis.render();
			neovis.registerOnEvent(CompletionEvent, () => {
				done();
			});
		});

		it('should save records to dataset', (done) => {
			mockNormalRunSubscribe([
				new Neo4j.types.Record(['common'], [makeNode(1, [label1], {random: 1})]),
			]);
			neovis.render();
			neovis.registerOnEvent(CompletionEvent, () => {
				expect(neovis._data.nodes.get(1)).toBeDefined();
				done();
			});
		});
	});
});
