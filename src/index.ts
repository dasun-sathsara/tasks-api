import { FastifyReply } from 'fastify';
import mongoose from 'mongoose';
import { DocumentType } from '@typegoose/typegoose';
import { User } from './models/user.model';
import buildServer from './server';
import 'dotenv/config';

let logger;
if (process.env.NODE_ENV === 'production') {
	logger = {
		enabled: true,
	};
} else {
	logger = {
		transport: { target: 'pino-pretty' },
	};
}

// extending fastify types
declare module 'fastify' {
	export interface FastifyRequest {
		authUser: DocumentType<User> | null;
		token: string | null;
	}

	export interface FastifyInstance {
		authenticate: (request: FastifyRequest, reply: FastifyReply) => Promise<void>;
	}
}

const fastify = buildServer({ logger });

const main = async () => {
	try {
		await fastify.listen({ port: +process.env.PORT!, host: '0.0.0.0' });

		// try and connect to the database
		await mongoose.connect(process.env.DATABASE_URL!, { autoIndex: true });
		fastify.log.info('Connected to the database.');
	} catch (err) {
		fastify.log.error(err);
		fastify.log.info('Exiting....');
		process.exit(1);
	}
};

main();

export { fastify };
