const Neo4j = jest.requireActual('neo4j-driver').v1;

export const mockRunSubscribe = jest.fn(() => {});

export const mockSessionRun = jest.fn(() => {
	const observablePromise = Promise.resolve();
	observablePromise.subscribe = mockRunSubscribe;
	return observablePromise;
});

export const mockSessionClose = jest.fn().mockImplementation(() => {});

export const mockSession = jest.fn().mockImplementation(() => ({
	run: mockSessionRun,
	close: mockSessionClose
}));

export const mockDriver = jest.spyOn(Neo4j, 'driver').mockImplementation(() => ({
	session: mockSession
}));

export function clearAllMocks() {
	mockRunSubscribe.mockClear();
	mockSessionClose.mockClear();
	mockSessionRun.mockClear();
	mockSession.mockClear();
	mockDriver.mockClear();
}

export default Neo4j;