import Fastify from 'fastify';
import 'dotenv/config';

const port = process.env.PORT || '3000';

const fastify = Fastify({
	logger: {
		transport: { target: 'pino-pretty' },
	},
});

fastify.get('/healthcheck', async () => {
	return { status: 'OK' };
});

const main = async () => {
	try {
		await fastify.listen({ port: +port, host: '0.0.0.0' });
	} catch (err) {
		fastify.log.error(err);
		fastify.log.info('Exiting....');
		process.exit(1);
	}
};

main();
