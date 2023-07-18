import { FastifyInstance } from 'fastify';
import {
	addAvatarHandler,
	addNewUserHandler,
	deleteUserHandler,
	getAvatarHandler,
	getOwnAvatarHandler,
	getUserHandler,
	loginHandler,
	logoutAllHandler,
	logoutHandler,
	updateUserHandler,
} from '../controllers/user.controller';
import { $ref, UpdateUserSchema } from '../schemas/user.schemas';

// route: api/users
async function userRoutes(fastify: FastifyInstance) {
	fastify.post('/', { schema: { body: $ref('addUserSchema') } }, addNewUserHandler);

	fastify.post('/login', { schema: { body: $ref('loginSchema') } }, loginHandler);

	fastify.post('/logout', { preHandler: [fastify.authenticate] }, logoutHandler);

	fastify.post('/logoutAll', { preHandler: [fastify.authenticate] }, logoutAllHandler);

	fastify.get('/me', { preHandler: [fastify.authenticate] }, getUserHandler);

	fastify.patch<{ Body: UpdateUserSchema }>(
		'/me',
		{ preHandler: [fastify.authenticate], schema: { body: $ref('updateUserSchema') } },
		updateUserHandler,
	);

	fastify.delete('/me', { preHandler: [fastify.authenticate] }, deleteUserHandler);

	fastify.post('/me/avatar', { preHandler: [fastify.authenticate] }, addAvatarHandler);

	fastify.get('/me/avatar', { preHandler: [fastify.authenticate] }, getOwnAvatarHandler);

	fastify.get<{ Params: { id: string } }>(
		'/:id/avatar',
		{ preHandler: [fastify.authenticate], schema: { params: $ref('getAvatarSchema') } },
		getAvatarHandler,
	);
}

export default userRoutes;
