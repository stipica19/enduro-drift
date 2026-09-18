import fp from "fastify-plugin";
import { MongoClient, type Db } from "mongodb";
import type { FastifyPluginAsync } from "fastify";
import { env } from "../config/env.js";

declare module "fastify" {
  interface FastifyInstance {
    mongo: {
      client: MongoClient;
      db: Db;
    };
  }
}

const mongoPlugin: FastifyPluginAsync = async (fastify) => {
  const client = new MongoClient(env.mongoUri);
  await client.connect();

  fastify.decorate("mongo", { client, db: client.db(env.mongoDbName) });
  fastify.log.info("MongoDB connected");

  fastify.addHook("onClose", async () => {
    await client.close();
  });
};

export default fp(mongoPlugin);
