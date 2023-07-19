import Fastify, { FastifyServerOptions } from 'fastify';
import userRoutes from './routes/user.routes';
import { userSchemas } from './schemas/user.schemas';
import { taskSchemas } from './schemas/task.schemas';
import taskRoutes from './routes/task.routes';
import authenticate from './utils/authenticate';
import multipart from '@fastify/multipart';

function buildServer(options: FastifyServerOptions) {
	const fastify = Fastify(options);

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

	return fastify;
}

export default buildServer;
