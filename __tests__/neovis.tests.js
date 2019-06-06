import * as Neo4jMock from 'neo4j-driver';
import Neovis from '../src/neovis';
import { CompletionEvent } from '../src/events';

jest.mock('neo4j-driver');

describe('test', () => {
	const container_id = 'randomId';
	let initial_cypher, neovis;

	beforeEach(() => Neo4jMock.clearAllMocks());
	beforeEach(() => {
		document.body.innerHTML = `<div id="${container_id}"></div>`;
		initial_cypher = 'test query';
		neovis = new Neovis({initial_cypher, container_id});
	});

	describe('test', () => {
		it('should call run with query', () => {
			neovis.render();
			expect(Neo4jMock.mockSessionRun).toHaveBeenCalledWith(initial_cypher, {limit: 30});
		});

		it('should call completed when complete', (done) => {
			Neo4jMock.mockRunSubscribe.mockImplementationOnce(({onCompleted}) => {
				onCompleted();
			});
			neovis.render();
			neovis.registerOnEvent(CompletionEvent, () => {
				done();
			});
		});
	});
});
