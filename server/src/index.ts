import "reflect-metadata";
import "dotenv-safe/config";
import { COOKE_NAME, __prod__ } from "./constants";
import express from "express";
import { ApolloServer } from "apollo-server-express";
import { buildSchema } from "type-graphql";
import { UserResolver } from "./resolvers/user";
import Redis from "ioredis";
import session from "express-session";
import connectRedis from "connect-redis";
import cors from "cors";
import { createConnection } from "typeorm";
import { User } from "./entities/User";
import path from "path";
import { createUserLoader } from "./utils/createUserLoader";

const main = async () => {
	const conn = await createConnection({
		type: "postgres",
		url: process.env.DATABASE_URL,
		logging: true,
		synchronize: !__prod__,
		migrations: [path.join(__dirname, "./migrations/*")],
		entities: [User],
	});
	await conn.runMigrations();

	const app = express();

	const RedisStore = connectRedis(session);
	const redis = new Redis(process.env.REDIS_URL);
	app.set("trust proxy", 1);
	app.use(
		cors({
			origin: process.env.CORS_ORIGIN,
			credentials: true,
		})
	);
	app.use(
		session({
			name: COOKE_NAME,
			store: new RedisStore({
				client: redis,
				disableTouch: true,
			}),
			cookie: {
				maxAge: 1000 * 60 * 60 * 24 * 365, // one year
				httpOnly: true,
				sameSite: "lax", // csrf
				secure: __prod__, // cookie only works in https
				domain: __prod__ ? ".realfagskjelleren.no" : undefined,
			},
			saveUninitialized: false,
			secret: process.env.SESSION_SECRET,
			resave: false,
		})
	);

	const apolloServer = new ApolloServer({
		schema: await buildSchema({
			resolvers: [UserResolver],
			validate: false,
		}),
		context: ({ req, res }) => ({
			req,
			res,
			redis,
			userLoader: createUserLoader(),
		}),
	});
	await apolloServer.start();

	apolloServer.applyMiddleware({ app, cors: false });

	app.listen(parseInt(process.env.PORT), () => {
		console.log("server started on localhost:5000");
	});
};

main().catch((err) => {
	console.error(err);
});