const Neo4j = jest.requireActual('neo4j-driver');

export const mockSessionRun = jest.fn(() => {
	const observablePromise = Promise.resolve();
	observablePromise.subscribe = jest.fn(() => {});
	return observablePromise;
});

export const mockSessionClose = jest.fn().mockImplementation(() => {});

export const mockReadTransaction = jest.fn(function (callback) {
	return callback(this);
});

export const mockSession = jest.fn().mockImplementation(() => ({
	run: mockSessionRun,
	close: mockSessionClose,
	readTransaction: mockReadTransaction
}));

export const mockDriver = jest.spyOn(Neo4j, 'driver').mockImplementation(() => ({
	session: mockSession
}));

export function clearAllMocks() {
	mockSessionClose.mockClear();
	mockSessionRun.mockClear();
	mockSession.mockClear();
	mockDriver.mockClear();
}

export default Neo4j;