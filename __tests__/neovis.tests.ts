/**
 * @jest-environment jsdom
 */

import Neo4j, * as Neo4jMockImport from 'neo4j-driver';
import Neovis, {
	migrateFromOldConfig,
	OldNeoVisConfig
} from '../src/neovis';
import { NeoVisEvents } from '../src/events';
import * as testUtils from './testUtils';

// eslint-disable-next-line jest/no-mocks-import
import type * as Neo4jMockType from '../__mocks__/neo4j-driver';
import type NeoVis from '../src/neovis';
import type VisNetwork from 'vis-network';
import { NEOVIS_ADVANCED_CONFIG, NEOVIS_DEFAULT_CONFIG, NeovisConfig, NonFlatNeovisConfig } from '../src/types';

jest.mock('neo4j-driver');

const Neo4jMock = Neo4jMockImport as unknown as typeof Neo4jMockType;


describe('Neovis', () => {
	const containerId = 'randomId';
	const initialCypher = 'test query';
	const label1 = 'label1';
	const label2 = 'label2';
	const relationshipType = 'TEST';
	let neovis: NeoVis;

	beforeEach(() => Neo4jMock.clearAllMocks());
	beforeEach(() => {
		testUtils.clearIdCounter();
		document.body.innerHTML = `<div id="${containerId}"></div>`;
	});

	describe('NeoVis config defaults behavior', () => {
		let config: Partial<NeovisConfig> = {};
		beforeEach(() => {
			config = {};
		});
		it('should merge default symbol for each label config', () => {
			config.labels = {
				a: {
					label: 'name'
				},
				[NEOVIS_DEFAULT_CONFIG]: {
					chosen: 'test'
				}
			};
			const neovis = new Neovis(config as NeovisConfig);
			expect(neovis._config.labels!.a).toMatchObject({ label: 'name', chosen: 'test' });
		});
		it('should not change the config sent', () => {
			config = {
				labels: {
					a: {
						label: 'name'
					},
					[NEOVIS_DEFAULT_CONFIG]: {
						chosen: 'test'
					}
				},
				relationships: {
					a: {
						value: 'test'
					},
					[NEOVIS_DEFAULT_CONFIG]: {
						chosen: 'test'
					}
				}
			};
			const configTemp = { ...config };
			new Neovis(config as NeovisConfig);
			expect(config).toMatchObject(configTemp);
		});
		it('should override default config if specific label have one', () => {
			config.relationships = {
				a: {
					label: 'name',
					chosen: 'overridden'
				},
				[NEOVIS_DEFAULT_CONFIG]: {
					color: 'test',
					chosen: 'override'
				}
			};
			const neovis = new Neovis(config as NeovisConfig);
			expect(neovis._config.relationships!.a).toMatchObject({
				label: 'name', color: 'test', chosen: 'overridden'
			});
		});
		it('should merge default symbol for each relationship config', () => {
			config.labels = {
				a: {
					label: 'name'
				},
				[NEOVIS_DEFAULT_CONFIG]: {
					chosen: 'test'
				}
			};
			const neovis = new Neovis(config as NeovisConfig);
			expect(neovis._config.labels!.a).toMatchObject({ label: 'name', chosen: 'test' });
		});
		it('should override default config if specific relationship have one', () => {
			config.relationships = {
				a: {
					label: 'name',
					chosen: 'overridden'
				},
				[NEOVIS_DEFAULT_CONFIG]: {
					value: 'test',
					chosen: 'override'
				}
			};
			const neovis = new Neovis(config as NeovisConfig);
			expect(neovis._config.relationships!.a).toMatchObject({
				label: 'name', value: 'test', chosen: 'overridden'
			});
		});
	});

	describe('Neovis default behavior', () => {
		beforeEach(() => {
			neovis = new Neovis({ initialCypher, containerId });
		});

		it('should call run with query', () => {
			neovis.render(undefined, { limit: 30 });
			expect(Neo4jMock.mockSessionRun).toHaveBeenCalledWith(initialCypher, { limit: 30 });
		});

		it('should call completed when complete', () => new Promise<void>(done => {
			testUtils.mockNormalRunSubscribe();
			neovis.render();
			neovis.registerOnEvent(NeoVisEvents.CompletionEvent, () => {
				expect(true).toBe(true);
				done();
			});
		}));

		it('should save records to dataset', async () => {
			testUtils.mockNormalRunSubscribe([
				testUtils.makeRecord([testUtils.makeNode([label1])]),
			]);
			neovis.render();
			await testUtils.neovisRenderDonePromise(neovis);
			expect(neovis.nodes.get(1)).toBeDefined();
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
			expect(neovis.nodes.length).toBe(2);
			expect(neovis.edges.length).toBe(1);
		});

		it('should work with big int', async () => {
			testUtils.mockNormalRunSubscribe([
				testUtils.makeRecord([testUtils.makePathFromNodes([
					testUtils.makeNode([label1], {}, new Neo4j.types.Integer(0, 1)),
					testUtils.makeNode([label1], {}, new Neo4j.types.Integer(1, 1))
				], relationshipType)]),
			]);
			neovis.render();
			await testUtils.neovisRenderDonePromise(neovis);
			expect(neovis.nodes.length).toBe(2);
			expect(neovis.edges.length).toBe(1);
			expect(neovis.nodes.getIds()).toEqual(['4294967296', '4294967297']);
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
			expect(neovis.nodes.length).toBe(2);
			expect(neovis.nodes.length).toBe(2);
			expect(neovis.edges.length).toBe(1);
			expect(neovis.edges.length).toBe(1);
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
			expect(neovis.nodes.length).toBe(5);
			expect(neovis.nodes.length).toBe(5);
			expect(neovis.edges.length).toBe(2);
			expect(neovis.edges.length).toBe(2);
		});

		it('should save raw records', async () => {
			const firstNode = testUtils.makeNode([label1]);
			const secondNode = testUtils.makeNode([label1]);
			const relationship = testUtils.makeRelationship(relationshipType, firstNode, secondNode);
			testUtils.mockNormalRunSubscribe([
				testUtils.makeRecord([firstNode, secondNode, relationship])
			]);
			neovis.render();
			await testUtils.neovisRenderDonePromise(neovis);
			expect(neovis.nodes.get(1)!.raw).toBeDefined();
			expect(neovis.nodes.get(2)!.raw).toBeDefined();
			expect(neovis.edges.get(3)!.raw).toBeDefined();
		});
	});

	describe('neovis with sizeCypher', () => {
		const sizeCypher = 'sizeCypher';
		const neovisConfig = {
			initialCypher,
			containerId,
			labels: {
				[label1]: {
					[NEOVIS_ADVANCED_CONFIG]: {
						cypher: {
							value: sizeCypher
						}
					}
				}
			}
		};
		beforeEach(() => {
			neovis = new Neovis(neovisConfig);
		});

		it('should call sizeCypher and save return value to data set value', async () => {
			const node = testUtils.makeNode([label1]);
			testUtils.mockFullRunSubscribe({
				[initialCypher]: {
					default: [testUtils.makeRecord([node])]
				},
				[sizeCypher]: {
					[typeof node.identity === 'object' ? node.identity.toInt(): node.identity]: [testUtils.makeRecord([Neo4j.int(1)])]
				}
			});

			neovis.render();
			await testUtils.neovisRenderDonePromise(neovis);
			expect(Neo4jMock.mockSessionRun).toHaveBeenCalledTimes(1 + 1); // once for initial cypher and once for the sizeCypher
			expect(neovis.nodes.get(1)).toHaveProperty('value', 1);
		});
	});

	describe('neovis with update cypher', () => {
		const updateWithCypher = 'updateCypher';
		beforeEach(() => {
			neovis = new Neovis({ initialCypher, containerId });
		});

		it('should call updateWithCypher and add the new node to visualization', async () => {
			const node1 = testUtils.makeNode([label1]);
			const node2 = testUtils.makeNode([label1]);
			testUtils.mockFullRunSubscribe({
				[initialCypher]: {
					default: [testUtils.makeRecord([node1])]
				},
				[updateWithCypher]: {
					default: [testUtils.makeRecord([node2])]
				}
			});

			neovis.render();
			await testUtils.neovisRenderDonePromise(neovis);
			expect(Neo4jMock.mockSessionRun).toHaveBeenCalledTimes(1);
			expect(neovis.nodes.length).toBe(1); // 1 node before update with cypher
			neovis.updateWithCypher(updateWithCypher); // do the update
			await testUtils.neovisRenderDonePromise(neovis);
			expect(Neo4jMock.mockSessionRun).toHaveBeenCalledTimes(1 + 1); // once for initial cypher and once for the update
			expect(neovis.nodes.length).toBe(2); // 2 node after update with cypher
		});

		it('call updateWithCypher with same init query should not create duplicate nodes', async () => {
			const node1 = testUtils.makeNode([label1]);
			testUtils.mockFullRunSubscribe({
				[initialCypher]: {
					default: [testUtils.makeRecord([node1])]
				}
			});

			neovis.render();
			await testUtils.neovisRenderDonePromise(neovis);
			expect(Neo4jMock.mockSessionRun).toHaveBeenCalledTimes(1);
			expect(neovis.nodes.length).toBe(1); // 1 node before update with cypher
			neovis.updateWithCypher(initialCypher); // do the update
			await testUtils.neovisRenderDonePromise(neovis);
			expect(Neo4jMock.mockSessionRun).toHaveBeenCalledTimes(1 + 1); // once for initial cypher and once for the update
			expect(neovis.nodes.length).toBe(1); // 1 node after update with cypher
		});
	});

	const imageUrl = 'https://visjs.org/images/visjs_logo.png';
	const fontSize = 28;
	const fontColor = '#00FF00';
	describe.each([['config', {
		containerId,
		labels: {
			[label1]: {
				[NEOVIS_ADVANCED_CONFIG]: {
					static: {
						image: imageUrl,
						font: {
							size: fontSize,
							color: fontColor,
						}
					}
				}
			}
		},
		initialCypher
	} as Partial<NeovisConfig>], ['non flat config', {
		containerId,
		nonFlat: true,
		labels: {
			[label1]: {
				static: {
					image: imageUrl,
					font: {
						size: fontSize,
						color: fontColor,
					}
				}
			}
		},
		initialCypher
	} as Partial<NonFlatNeovisConfig>]])('neovis advance %s test', (configName: string, config) => {
		beforeEach(() => {
			neovis = new Neovis(config as NonFlatNeovisConfig | NeovisConfig);
		});

		it('image field in config should reflect in node data', async () => {
			const node1 = testUtils.makeNode([label1]);
			testUtils.mockFullRunSubscribe({
				[initialCypher]: {
					default: [testUtils.makeRecord([node1])]
				}
			});

			neovis.render();
			await testUtils.neovisRenderDonePromise(neovis);
			expect(neovis.nodes.get(1)).toHaveProperty('image', imageUrl);
		});

		it('image field for type not specified in config should not reflect in node data', async () => {
			const node1 = testUtils.makeNode([label2]);
			testUtils.mockFullRunSubscribe({
				[initialCypher]: {
					default: [testUtils.makeRecord([node1])]
				}
			});

			neovis.render();
			await testUtils.neovisRenderDonePromise(neovis);
			expect(neovis.nodes.get(1)).not.toHaveProperty('image');
		});

		it('font field in config should reflect in node data', async () => {
			const node1 = testUtils.makeNode([label1]);
			testUtils.mockFullRunSubscribe({
				[initialCypher]: {
					default: [testUtils.makeRecord([node1])]
				}
			});

			neovis.render();
			await testUtils.neovisRenderDonePromise(neovis);
			expect(neovis.nodes.get(1)!.font).toBeDefined();
			expect((neovis.nodes.get(1)!.font as VisNetwork.Font).size).toBe(fontSize);
			expect((neovis.nodes.get(1)!.font as VisNetwork.Font).color).toBe(fontColor);
		});

		it('font field for type not specified in config should not reflect in node data', async () => {
			const node1 = testUtils.makeNode([label2]);
			testUtils.mockFullRunSubscribe({
				[initialCypher]: {
					default: [testUtils.makeRecord([node1])]
				}
			});

			neovis.render();
			await testUtils.neovisRenderDonePromise(neovis);
			expect(neovis.nodes.get(1)).not.toHaveProperty('font');
		});
	});

	// TODO: After upgrading to merge config, type casting is failing due to not able to detect target type. A proper way
	// 			either let the user to define type casting or do it automaticlly need to be implemented.
	describe('neovis type casting test', () => {
		const intProperty = 'intProperty';
		const intPropertyValue = 40;

		it('should merge property name type to vis.js config properly', async () => {
			const config: NeovisConfig = {
				containerId,
				labels: {
					[label1]: {
						font: {
							size: intProperty,
							color: intProperty
						},
					}
				},
				initialCypher
			};
			neovis = new Neovis(config);
			const node1 = testUtils.makeNode([label1], { [intProperty]: intPropertyValue });
			testUtils.mockFullRunSubscribe({
				[initialCypher]: {
					default: [testUtils.makeRecord([node1])]
				}
			});
			neovis.render();
			await testUtils.neovisRenderDonePromise(neovis);
			expect(Neo4jMock.mockSessionRun).toHaveBeenCalledTimes(1);
			expect(neovis.nodes.get(1)).toHaveProperty('font');
			expect(neovis.nodes.get(1)!.font).toHaveProperty('size', intPropertyValue);
			expect(neovis.nodes.get(1)!.font).toHaveProperty('color', intPropertyValue);
		});

		it('should merge static type to vis.js config properly', async () => {
			const config: Partial<NeovisConfig> = {
				containerId,
				labels: {
					[label1]: {
						[NEOVIS_ADVANCED_CONFIG]: {
							static: {
								value: intPropertyValue
							}
						}
					}
				},
				initialCypher
			};
			neovis = new Neovis(config as NeovisConfig);
			const node1 = testUtils.makeNode([label1], { [intProperty]: intPropertyValue });
			testUtils.mockFullRunSubscribe({
				[initialCypher]: {
					default: [testUtils.makeRecord([node1])]
				}
			});
			neovis.render();
			await testUtils.neovisRenderDonePromise(neovis);
			expect(Neo4jMock.mockSessionRun).toHaveBeenCalledTimes(1);
			expect(neovis.nodes.get(1)).toHaveProperty('value', intPropertyValue);
		});

		it('should merge function type to vis.js config properly', async () => {
			const config: Partial<NeovisConfig> = {
				containerId,
				labels: {
					[label1]: {
						[NEOVIS_ADVANCED_CONFIG]: {
							function: {
								value: () => intPropertyValue
							}
						}
					}
				},
				initialCypher
			};
			neovis = new Neovis(config as NeovisConfig);
			const node1 = testUtils.makeNode([label1], { [intProperty]: intPropertyValue });
			testUtils.mockFullRunSubscribe({
				[initialCypher]: {
					default: [testUtils.makeRecord([node1])]
				}
			});
			neovis.render();
			await testUtils.neovisRenderDonePromise(neovis);
			expect(Neo4jMock.mockSessionRun).toHaveBeenCalledTimes(1);
			expect(neovis.nodes.get(1)).toHaveProperty('value', intPropertyValue);
		});

		it('should merge cypher type to vis.js config properly', async () => {
			const sizeCypher = 'sizeCypher';
			const config: Partial<NeovisConfig> = {
				containerId,
				labels: {
					[label1]: {
						[NEOVIS_ADVANCED_CONFIG]: {
							cypher: {
								value: sizeCypher
							}
						}
					}
				},
				initialCypher
			};
			neovis = new Neovis(config as NeovisConfig);
			const node1 = testUtils.makeNode([label1], { [intProperty]: intPropertyValue });
			testUtils.mockFullRunSubscribe({
				[initialCypher]: {
					default: [testUtils.makeRecord([node1])]
				},
				[sizeCypher]: {
					[typeof node1.identity === 'object' ? node1.identity.toInt(): node1.identity]: [testUtils.makeRecord([intPropertyValue])]
				}
			});
			neovis.render();
			await testUtils.neovisRenderDonePromise(neovis);
			expect(Neo4jMock.mockSessionRun).toHaveBeenCalledTimes(2);
			expect(neovis.nodes.get(1)).toHaveProperty('value', intPropertyValue);
		});

	});

	describe('neovis config migration', () => {
		const oldConfig: Partial<OldNeoVisConfig> = {
			initial_cypher: initialCypher,
			container_id: containerId,
			labels: {
				a: {
					caption: 'name'
				},
				[NEOVIS_DEFAULT_CONFIG]: {
					community: 'test'
				}
			},
			relationships: {
				a: {
					thickness: 0.1
				},
				[NEOVIS_DEFAULT_CONFIG]: {
					caption: 'test'
				}
			}
		};
		it('should work after full old config migration', async () => {
			const neovis = new Neovis(migrateFromOldConfig(oldConfig as OldNeoVisConfig));
			testUtils.mockNormalRunSubscribe([
				testUtils.makeRecord([testUtils.makeNode([label1])]),
			]);
			neovis.render();
			await testUtils.neovisRenderDonePromise(neovis);
			expect(neovis.nodes.get(1)).toBeDefined();
		});
	});
	const retData = [new Neo4j.types.Record(
		['a', 'b', 'c', 'd'], [
			new Neo4j.types.Node(new Neo4j.types.Integer(0, 0), ['Test'], { test: 1, test2: new Neo4j.types.Integer(1, 0) }),
			new Neo4j.types.Node(new Neo4j.types.Integer(1, 0), ['Test'], { 
				test1: new Neo4j.types.Date(new Neo4j.types.Integer(1, 0), new Neo4j.types.Integer(1, 0), new Neo4j.types.Integer(1, 0)),
				test2: new Neo4j.types.DateTime(1, 2, 3, 4, 5, 6, 7, 8),
				test3: new Neo4j.types.DateTime(1, 2, 3, 4, 5, 6, 7, 8, 'US/Pacific'),
				test4: new Neo4j.types.Duration(1, 2, 3, 5),
				test5: new Neo4j.types.LocalDateTime(1, 2, 3, 4, 5, 6, 7),
				test6: new Neo4j.types.LocalTime(1, 2, 3, 4),
				test7: new Neo4j.types.Point(1, 2, 3, 4),
				test8: new Neo4j.types.Point(1, 2, 3),
				test9: new Neo4j.types.Time(1, 2, 3, 4, 5)
			}),
			new Neo4j.types.Relationship(new Neo4j.types.Integer(0, 0), new Neo4j.types.Integer(0, 0), new Neo4j.types.Integer(1, 0), 'TEST', {}),
			new Neo4j.types.Path(
				new Neo4j.types.Node(new Neo4j.types.Integer(2, 0), ['Test'], {}),
				new Neo4j.types.Node(new Neo4j.types.Integer(3, 0), ['Test'], {}), [
					new Neo4j.types.PathSegment(
						new Neo4j.types.Node(new Neo4j.types.Integer(2, 0), ['Test'], {}),
						new Neo4j.types.Relationship(new Neo4j.types.Integer(1, 0), new Neo4j.types.Integer(3, 0), new Neo4j.types.Integer(1, 0), 'TEST', {}),
						new Neo4j.types.Node(new Neo4j.types.Integer(3, 0), ['Test'], {})
					)]
			)
		], { 'a': 0, 'b': 1, 'c': 2, 'd': 3 })
	].map(rec => JSON.parse(JSON.stringify(rec)));
	const dataFunctionSharedConfig: Partial<NeovisConfig> = {
		containerId,
		labels: {
			Test: {
				value: 'test',
				label: 'test2'
			}
		}
	};
	describe.each([['Sync Iterable', {
		...dataFunctionSharedConfig,
		dataFunction() {
			return retData;
		},
	} as Partial<NeovisConfig>], ['Sync Generator', {
		...dataFunctionSharedConfig,
		*dataFunction() {
			for (const record of retData) {
				yield record;
			}
		},
	} as Partial<NeovisConfig>], ['Async Iterable', {
		...dataFunctionSharedConfig,
		async dataFunction() {
			return retData;
		},
	} as Partial<NeovisConfig>], ['ASync Generator', {
		...dataFunctionSharedConfig,
		async *dataFunction() {
			for (const record of retData) {
				yield record;
			}
		},
	} as Partial<NeovisConfig>]])('neovis dataFunction %s test', (configName: string, config) => {
		beforeEach(() => {
			neovis = new Neovis(config as NonFlatNeovisConfig | NeovisConfig);
		});
		// TODO TESTS
		it('should create all nodes and relationship same if it was normal', async () => {
			neovis.render();
			await testUtils.neovisRenderDonePromise(neovis);
			expect(neovis.nodes.length).toBe(4);
			expect(neovis.edges.length).toBe(2);
			expect(neovis.nodes.get(0)?.value).toBe(1);
		});
		it('should desriallize int correctly in properties', async () => {
			neovis.render();
			await testUtils.neovisRenderDonePromise(neovis);
			expect(neovis.nodes.get(0)?.label).toBe(1);
		});
		it('should desriallize all neo4j types', async () => {
			neovis.render();
			await testUtils.neovisRenderDonePromise(neovis);
			expect(neovis.nodes.get(1)?.raw.properties.test1).toBeInstanceOf(Neo4j.types.Date);
			expect((neovis.nodes.get(1)?.raw.properties.test1 as any).year).toBeInstanceOf(Neo4j.types.Integer);
			expect((neovis.nodes.get(1)?.raw.properties.test1 as any).month).toBeInstanceOf(Neo4j.types.Integer);
			expect((neovis.nodes.get(1)?.raw.properties.test1 as any).day).toBeInstanceOf(Neo4j.types.Integer);
			expect(neovis.nodes.get(1)?.raw.properties.test2).toBeInstanceOf(Neo4j.types.DateTime);
			expect(neovis.nodes.get(1)?.raw.properties.test3).toBeInstanceOf(Neo4j.types.DateTime);
			expect(neovis.nodes.get(1)?.raw.properties.test4).toBeInstanceOf(Neo4j.types.Duration);
			expect(neovis.nodes.get(1)?.raw.properties.test5).toBeInstanceOf(Neo4j.types.LocalDateTime);
			expect(neovis.nodes.get(1)?.raw.properties.test6).toBeInstanceOf(Neo4j.types.LocalTime);
			expect(neovis.nodes.get(1)?.raw.properties.test7).toBeInstanceOf(Neo4j.types.Point);
			expect(neovis.nodes.get(1)?.raw.properties.test8).toBeInstanceOf(Neo4j.types.Point);
			expect(neovis.nodes.get(1)?.raw.properties.test9).toBeInstanceOf(Neo4j.types.Time);
		});
	});
});
