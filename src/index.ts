import Fastify from 'fastify';
import 'dotenv/config';
import userRoutes from './routes/user.routes';
import { userSchemas } from './schemas/user.schemas';
import mongoose from 'mongoose';

const port = process.env.PORT || '3000';

const fastify = Fastify({
	logger: {
		transport: { target: 'pino-pretty' },
	},
});

fastify.get('/healthcheck', async () => {
	return { status: 'OK' };
});

// registering request validation schemas
for (const schema of [...userSchemas]) {
	fastify.addSchema(schema);
}

fastify.register(userRoutes, { prefix: 'api/users' });

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
