import Neo4j, * as Neo4jMockImport from 'neo4j-driver';
import Neovis, {
	NEOVIS_DEFAULT_CONFIG,
	NEOVIS_ADVANCED_CONFIG,
	migrateFromOldConfig,
	NeovisConfig, NonFlatNeovisConfig, OldNeoVisConfig
} from '../src/neovis';
import { NeoVisEvents } from '../src/events';
import * as testUtils from './testUtils';

// eslint-disable-next-line jest/no-mocks-import
import type * as Neo4jMockType from '../__mocks__/neo4j-driver';
import type NeoVis from '../src/neovis';
import type VisNetwork from 'vis-network';

jest.mock('neo4j-driver');

const Neo4jMock = Neo4jMockImport as unknown as typeof Neo4jMockType;


describe('Neovis', () => {
	const container_id = 'randomId';
	const initial_cypher = 'test query';
	const label1 = 'label1';
	const label2 = 'label2';
	const relationshipType = 'TEST';
	let neovis: NeoVis; 

	beforeEach(() => Neo4jMock.clearAllMocks());
	beforeEach(() => {
		testUtils.clearIdCounter();
		document.body.innerHTML = `<div id="${container_id}"></div>`;
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
			expect(neovis._config.labels.a).toMatchObject({ label: 'name', chosen: 'test' });
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
			expect(neovis._config.relationships.a).toMatchObject({
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
			expect(neovis._config.labels.a).toMatchObject({ label: 'name', chosen: 'test' });
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
			expect(neovis._config.relationships.a).toMatchObject({
				label: 'name', value: 'test', chosen: 'overridden'
			});
		});
	});

	describe('Neovis default behavior', () => {
		beforeEach(() => {
			neovis = new Neovis({ initial_cypher, container_id });
		});

		it('should call run with query', () => {
			neovis.render();
			expect(Neo4jMock.mockSessionRun).toHaveBeenCalledWith(initial_cypher, { limit: 30 });
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
			expect(neovis.nodes.get(1).raw).toBeDefined();
			expect(neovis.nodes.get(2).raw).toBeDefined();
			expect(neovis.edges.get(3).raw).toBeDefined();
		});
	});

	describe('neovis with sizeCypher', () => {
		const sizeCypher = 'sizeCypher';
		const neovisConfig = {
			initial_cypher,
			container_id,
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
				[initial_cypher]: {
					default: [testUtils.makeRecord([node])]
				},
				[sizeCypher]: {
					[node.identity]: [testUtils.makeRecord([Neo4j.int(1)])]
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
			neovis = new Neovis({ initial_cypher, container_id });
		});

		it('should call updateWithCypher and add the new node to visualization', async () => {
			const node1 = testUtils.makeNode([label1]);
			const node2 = testUtils.makeNode([label1]);
			testUtils.mockFullRunSubscribe({
				[initial_cypher]: {
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
				[initial_cypher]: {
					default: [testUtils.makeRecord([node1])]
				}
			});

			neovis.render();
			await testUtils.neovisRenderDonePromise(neovis);
			expect(Neo4jMock.mockSessionRun).toHaveBeenCalledTimes(1);
			expect(neovis.nodes.length).toBe(1); // 1 node before update with cypher
			neovis.updateWithCypher(initial_cypher); // do the update
			await testUtils.neovisRenderDonePromise(neovis);
			expect(Neo4jMock.mockSessionRun).toHaveBeenCalledTimes(1 + 1); // once for initial cypher and once for the update
			expect(neovis.nodes.length).toBe(1); // 1 node after update with cypher
		});
	});

	const imageUrl = 'https://visjs.org/images/visjs_logo.png';
	const fontSize = 28;
	const fontColor = '#00FF00';
	describe.each([['config', {
		container_id,
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
		initial_cypher: initial_cypher
	} as Partial<NeovisConfig>], ['non flat config', {
		container_id,
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
		initial_cypher: initial_cypher
	} as Partial<NonFlatNeovisConfig>]])('neovis advance %s test', (configName: string, config) => {
		beforeEach(() => {
			neovis = new Neovis(config as NonFlatNeovisConfig | NeovisConfig);
		});

		it('image field in config should reflect in node data', async () => {
			const node1 = testUtils.makeNode([label1]);
			testUtils.mockFullRunSubscribe({
				[initial_cypher]: {
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
				[initial_cypher]: {
					default: [testUtils.makeRecord([node1])]
				}
			});

			neovis.render();
			await testUtils.neovisRenderDonePromise(neovis);
			expect(neovis.nodes.get(1)).toHaveProperty('image', undefined);
		});

		it('font field in config should reflect in node data', async () => {
			const node1 = testUtils.makeNode([label1]);
			testUtils.mockFullRunSubscribe({
				[initial_cypher]: {
					default: [testUtils.makeRecord([node1])]
				}
			});

			neovis.render();
			await testUtils.neovisRenderDonePromise(neovis);
			expect(neovis.nodes.get(1).font).toBeDefined();
			expect((neovis.nodes.get(1).font as VisNetwork.Font).size).toBe(fontSize);
			expect((neovis.nodes.get(1).font as VisNetwork.Font).color).toBe(fontColor);
		});

		it('font field for type not specified in config should not reflect in node data', async () => {
			const node1 = testUtils.makeNode([label2]);
			testUtils.mockFullRunSubscribe({
				[initial_cypher]: {
					default: [testUtils.makeRecord([node1])]
				}
			});

			neovis.render();
			await testUtils.neovisRenderDonePromise(neovis);
			expect(neovis.nodes.get(1)).toHaveProperty('font', undefined);
		});
	});

	// TODO: After upgrading to merge config, type casting is failing due to not able to detect target type. A proper way
	// 			either let the user to define type casting or do it automaticlly need to be implemented.
	describe('neovis type casting test', () => {
		const intProperty = 'intProperity';
		const intPropertyValue = 40;

		it('should merge property name type to vis.js config properly', async () => {
			const config = {
				container_id: container_id,
				labels: {
					[label1]: {
						'label': intProperty
					}
				},
				initial_cypher: initial_cypher
			};
			neovis = new Neovis(config);
			const node1 = testUtils.makeNode([label1], { [intProperty]: intPropertyValue });
			testUtils.mockFullRunSubscribe({
				[initial_cypher]: {
					default: [testUtils.makeRecord([node1])]
				}
			});
			neovis.render();
			await testUtils.neovisRenderDonePromise(neovis);
			expect(Neo4jMock.mockSessionRun).toHaveBeenCalledTimes(1);
			expect(neovis.nodes.get(1)).toHaveProperty('label', intPropertyValue);
		});

		it('should merge static type to vis.js config properly', async () => {
			const config: Partial<NeovisConfig> = {
				container_id,
				labels: {
					[label1]: {
						[NEOVIS_ADVANCED_CONFIG]: {
							'static': {
								value: intPropertyValue
							}
						}
					}
				},
				initial_cypher
			};
			neovis = new Neovis(config as NeovisConfig);
			const node1 = testUtils.makeNode([label1], { [intProperty]: intPropertyValue });
			testUtils.mockFullRunSubscribe({
				[initial_cypher]: {
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
				container_id: container_id,
				labels: {
					[label1]: {
						[NEOVIS_ADVANCED_CONFIG]: {
							function: {
								value: () => intPropertyValue
							}
						}
					}
				},
				initial_cypher: initial_cypher
			};
			neovis = new Neovis(config as NeovisConfig);
			const node1 = testUtils.makeNode([label1], { [intProperty]: intPropertyValue });
			testUtils.mockFullRunSubscribe({
				[initial_cypher]: {
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
				container_id,
				labels: {
					[label1]: {
						[NEOVIS_ADVANCED_CONFIG]: {
							cypher: {
								value: sizeCypher
							}
						}
					}
				},
				initial_cypher: initial_cypher
			};
			neovis = new Neovis(config as NeovisConfig);
			const node1 = testUtils.makeNode([label1], { [intProperty]: intPropertyValue });
			testUtils.mockFullRunSubscribe({
				[initial_cypher]: {
					default: [testUtils.makeRecord([node1])]
				},
				[sizeCypher]: {
					[node1.identity]: [testUtils.makeRecord([intPropertyValue])]
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
			initial_cypher,
			container_id,
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
});
