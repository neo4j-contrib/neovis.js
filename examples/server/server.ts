import fastify from 'fastify';
import cors from '@fastify/cors'
import * as Neo4j from "neo4j-driver";


const server = fastify()

const driver = Neo4j.driver(
   "bolt://localhost:7687",
    Neo4j.auth.basic(
        "neo4j",
        "sorts-swims-burglaries"
    )
);

server.register(cors)

server.get('/data', async (request, reply) => {
  const session = driver.session();
  const ret = await session.run("MATCH a=(n)-[r:INTERACTS]->(m) RETURN n,r,m,a");
  session.close();
  return ret.records;
})

server.get<{Params:{id: number }}>('/data/:id', async (req, res) => {
  const session = driver.session();
  const ret = await session.run("MATCH a=(n)-[r:INTERACTS]->(m) WHERE ID(n) = $id RETURN a,n,r,m", { id: Number(req.params.id) });
  session.close();
  return ret.records;
});

server.get('/allIds', async (req, res) => {
  const session = driver.session();
  const ret = await session.run("MATCH (n) RETURN id(n)");
  session.close();
  return ret.records.map(rec => rec.get(0).toInt());
})

server.listen({ port: 8080 }, (err, address) => {
  if (err) {
    console.error(err)
    process.exit(1)
  }
  console.log(`Server listening at ${address}`)
})