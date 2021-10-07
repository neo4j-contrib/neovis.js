import type * as Neo4jType from 'neo4j-driver';
import { ObservablePromise } from '../__tests__/testUtils';
const Neo4j: typeof Neo4jType = jest.requireActual('neo4j-driver');

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const mockSessionRun: jest.Mock<ObservablePromise<unknown>, [cypher: string, b: Record<string, unknown>]> = jest.fn((..._) => {
	const observablePromise: Partial<ObservablePromise<void>> = Promise.resolve();
	// eslint-disable-next-line @typescript-eslint/no-empty-function
	observablePromise.subscribe = jest.fn(() => {});
	return observablePromise as ObservablePromise<void>;
});

// eslint-disable-next-line @typescript-eslint/no-empty-function
export const mockSessionClose = jest.fn().mockImplementation(() => {});

export const mockReadTransaction = jest.fn(function (this: Neo4jType.Session, callback: (session: Neo4jType.Session) => void) {
	return callback(this);
});

export const mockSession: jest.Mock<Partial<Neo4jType.Session>> = jest.fn().mockImplementation(() => ({
	run: mockSessionRun,
	close: mockSessionClose,
	readTransaction: mockReadTransaction
}));

export const mockDriver = jest.spyOn(Neo4j, 'driver').mockImplementation(() => ({
	session: mockSession as unknown as (...args: unknown[]) => Neo4jType.Session
}) as Neo4jType.Driver);

export function clearAllMocks(): void {
	mockSessionClose.mockClear();
	mockSessionRun.mockClear();
	mockSession.mockClear();
	mockDriver.mockClear();
}

export default Neo4j;