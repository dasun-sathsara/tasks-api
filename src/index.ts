import Fastify, { FastifyReply } from 'fastify';
import 'dotenv/config';
import userRoutes from './routes/user.routes';
import { userSchemas } from './schemas/user.schemas';
import mongoose from 'mongoose';
import { taskSchemas } from './schemas/task.schemas';
import taskRoutes from './routes/task.routes';
import authenticate from './utils/authenticate';
import { DocumentType } from '@typegoose/typegoose';
import { User } from './models/user.model';
import multipart from '@fastify/multipart';

const port = process.env.PORT || '3000';

const fastify = Fastify({
	logger: {
		enabled: true,
		// not recommended in production
		// transport: { target: 'pino-pretty' },
	},
});

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

fastify.get('/healthcheck', async () => {
	return { status: 'OK' };
});

// registering request validation schemas
for (const schema of [...userSchemas, ...taskSchemas]) {
	fastify.addSchema(schema);
}

// decorating fastify instance with authenticate function
fastify.decorate('authenticate', authenticate);

// decorating request object
fastify.decorateRequest('authUser', null);
fastify.decorateRequest('token', null);

// registering multipart plugin, and setting limits
fastify.register(multipart, { limits: { files: 1, fileSize: 1000000 } });

// registering routes, with prefixes
fastify.register(userRoutes, { prefix: 'api/users' });
fastify.register(taskRoutes, { prefix: 'api/tasks' });

const main = async () => {
	try {
		await fastify.listen({ port: +port, host: '0.0.0.0' });

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
